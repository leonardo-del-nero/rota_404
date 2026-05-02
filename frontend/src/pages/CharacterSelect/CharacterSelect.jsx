import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Cpu, Zap, Shield, Sparkles } from 'lucide-react';
import styles from './CharacterSelect.module.css';

const CHARACTERS = [
  { id: '1', name: 'Neo', role: 'The Hacker', icon: <User size={40} />, color: '#00ff88', desc: 'Rápido e furtivo. Especialista em quebrar firewalls.' },
  { id: '2', name: 'Trinity', role: 'SysAdmin', icon: <Cpu size={40} />, color: '#00f3ff', desc: 'Controla a infraestrutura. Nada passa despercebido.' },
  { id: '3', name: 'Morpheus', role: 'Cyber Punk', icon: <Zap size={40} />, color: '#ffcc00', desc: 'Poder bruto de processamento. Especialista em força bruta.' },
  { id: '4', name: 'Piaba', role: 'Guardian', icon: <Shield size={40} />, color: '#ff3b3b', desc: 'Defesa impenetrável. Focado em criptografia.' },
  { id: '5', name: 'Pipoca', role: 'Glitcher', icon: <Sparkles size={40} />, color: '#ff00ff', desc: 'Mestre da engenharia reversa e do caos controlado.' },
];

const CharacterSelect = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [selectedChar, setSelectedChar] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !selectedChar) {
      setError('Por favor, preencha seu nome e selecione um personagem.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), characterId: selectedChar.id })
      });

      if (!response.ok) throw new Error('Erro ao salvar os dados.');
      
      const result = await response.json();
      localStorage.setItem('rota404_player', JSON.stringify(result.data));
      localStorage.removeItem('rota404_quiz_progress'); // Zera o progresso do quiz para o novo usuário
      
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
                  <div className={styles.iconWrapper} style={{ color: char.color }}>
                    {char.icon}
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
                  <div className={styles.previewAvatar} style={{ color: selectedChar.color, borderColor: selectedChar.color, boxShadow: `0 0 20px ${selectedChar.color}44` }}>
                    {selectedChar.icon}
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
