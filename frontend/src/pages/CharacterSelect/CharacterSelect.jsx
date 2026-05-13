import { useState  } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Cpu, Zap, Shield, Sparkles } from 'lucide-react';
import { useAchievement } from '../../context/AchievementContext';
import styles from './CharacterSelect.module.css';

import neoImg from '../../avatars/ghost_spec_upscaled_0.png';
import trinityImg from '../../avatars/pucca_upscaled_0.png';
import morpheusImg from '../../avatars/stormtrooper_upscaled_0.png';
import piabaImg from '../../avatars/piaba_upscaled_0.png';
import pipocaImg from '../../avatars/tigrinho_upscaled_0.png';
import castorImg from '../../avatars/castor_upscaled_0.png';

const CHARACTERS = [
  { id: '1', name: 'Gustavo Pereira', role: 'Gustavo Pereira', image: neoImg, color: '#00ff88', desc: 'Gustavo Pereira' },
  { id: '2', name: 'Pucca', role: 'Guardiã Valente', image: trinityImg, color: '#00f3ff', desc: 'Deixou a vida pacífica da vila para se tornar uma protetora solitária. Utiliza sua persistência e seus icônicos laços vermelhos para abrir caminhos perigosos que ninguém mais ousa trilhar.' },
  { id: '3', name: 'Stormtrooper', role: 'Sentinela Renegado', image: morpheusImg, color: '#ffcc00', desc: 'Especialista em táticas de defesa, apesar da má pontaria. Ele abandonou um exército rígido para aplicar suas habilidades militares na proteção de viajantes perdidos, garantindo que ninguém seja deixado para trás por ordens injustas.' },
  { id: '4', name: 'Piaba', role: 'Sombra Ancestral', image: piabaImg, color: '#ff3b3b', desc: 'Uma entidade Illuminati que camufla sua mente vingativa e seu poder ancestral sob a aparência inofensiva de uma cadela carismática, aguardando o momento exato para retomar sua glória.' },
  { id: '5', name: 'Tigrinho', role: 'Estrategista de Risco', image: pipocaImg, color: '#ff00ff', desc: 'Transformou críticas e derrotas, em um domínio absoluto sobre o mercado de apostas. É movido pela visão de negócios e pela realidade constante de metas batidas e conquistas inquestionáveis.' },
  { id: '6', name: 'Castor', role: 'Mestre Construtor', image: castorImg, color: '#ffcc00', desc: 'Unindo a paciência de um mentor à força de um operário, ele utiliza sua vasta experiência para construir fisicamente as rotas que antes apenas ensinava, garantindo a segurança de novos viajantes.' },
];

const CharacterSelect = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [selectedChar, setSelectedChar] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { unlockAchievement } = useAchievement();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !selectedChar) {
      setError('Por favor, preencha seu nome e selecione um personagem.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/players`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), characterId: selectedChar.id })
      });

      if (!response.ok) throw new Error('Erro ao salvar os dados.');
      
      const result = await response.json();
      localStorage.setItem('rota404_player', JSON.stringify(result.data));
      localStorage.removeItem('rota404_quiz_progress'); // Zera o progresso do quiz para o novo usuário
      
      unlockAchievement('ESCOLHER_NOME_AVATAR', 'IDENTIDADE CONFIRMADA', 'Você escolheu seu nome e avatar na Rota 404!', 'COMUM');
      
      // Checa se veio do atalho secreto
      if (localStorage.getItem('rota404_secret_start_pending') === 'true') {
        unlockAchievement('DIGITAR_START', 'ACESSO PRIVILEGIADO', 'Você digitou START na tela inicial!', 'SECRETAS');
        localStorage.removeItem('rota404_secret_start_pending');
      }

      if (name.trim().toLowerCase() === 'piaba' && selectedChar.id === '4') {
        unlockAchievement('EASTER_EGG_PIABA', 'A VERDADEIRA PIABA', 'Você revelou a verdadeira identidade da Piaba!', 'SECRETAS');
      }

      // Sucesso! Vamos para a Intro
      navigate('/intro');
    } catch (err) {
      console.error(err);
      setError('Falha na comunicação com o servidor. Verifique se o backend está rodando.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.selectContainer}>
      <div className={styles.contentWrapper}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.title}
        >
          CRIAR PERFIL
        </motion.h1>

        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.leftPanel}>
            <div className={styles.inputGroup}>
              <label className={`mono ${styles.label}`}>NOME DE USUÁRIO_</label>
              <input 
                type="text" 
                className={`input-404 ${styles.nameInput}`}
                placeholder="Ex: CrashOverride"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
              />
            </div>

            <div className={styles.charGrid}>
              {CHARACTERS.map((char) => (
                <div 
                  key={char.id}
                  className={`${styles.charCard} ${selectedChar?.id === char.id ? styles.selected : ''}`}
                  onClick={() => setSelectedChar(char)}
                  style={{ '--char-color': char.color }}
                >
                  <div className={styles.iconWrapper}>
                    <img src={char.image} alt={char.name} className={styles.charAvatarImg} />
                  </div>
                  <span className={`mono ${styles.charName}`}>{char.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.rightPanel}>
            <div className={`glass-panel ${styles.previewPanel}`}>
              {selectedChar ? (
                <motion.div 
                  key={selectedChar.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={styles.previewContent}
                >
                  <div className={styles.previewAvatar} style={{ borderColor: selectedChar.color, boxShadow: `0 0 20px ${selectedChar.color}44` }}>
                    <img src={selectedChar.image} alt={selectedChar.name} className={styles.previewAvatarImg} />
                  </div>
                  <h2 className={styles.previewName}>{selectedChar.name}</h2>
                  <p className={`mono ${styles.previewRole}`} style={{ color: selectedChar.color }}>{selectedChar.role}</p>
                  <div className={styles.divider}></div>
                  <p className={styles.previewDesc}>{selectedChar.desc}</p>
                </motion.div>
              ) : (
                <div className={styles.emptyPreview}>
                  <p className="mono">SELECIONE UM PERSONAGEM</p>
                </div>
              )}
            </div>

            {error && <p className={`mono ${styles.errorMessage}`}>{error}</p>}

            <button 
              type="submit" 
              className={`btn-404 ${styles.submitBtn}`}
              disabled={!name.trim() || !selectedChar || isSubmitting}
            >
              {isSubmitting ? 'CRIANDO...' : 'CONFIRMAR IDENTIDADE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CharacterSelect;
