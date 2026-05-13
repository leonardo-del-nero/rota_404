import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hash, Cpu, Globe, Lock, AlertCircle, CloudUpload } from 'lucide-react';
import { useAchievement } from '../../context/AchievementContext';
import styles from './Hub.module.css';
import PrimaryLogo from '../../components/PrimaryLogo';
import ParticleBackground from '../../components/ParticleBackground';
import ModuleCard from '../../components/ModuleCard';
import AchievementGallery from '../../components/AchievementGallery';
import { LayoutGrid } from 'lucide-react';

const Hub = () => {
  const navigate = useNavigate();
  const modules = [
    {
      id: 'hash',
      title: 'DNA DIGITAL',
      tag: 'SEGURANÇA',
      desc: 'Como saber se um arquivo foi mexido? O Hash cria uma assinatura única que dedura qualquer mudança!',
      path: '/hash',
      icon: <Hash size={24} />,
      color: 'var(--primary)'
    },
    {
      id: 'api',
      title: 'GARÇOM DIGITAL',
      tag: 'API & JSON',
      desc: 'Descubra como o seu computador faz "pedidos" para os sites e recebe as informações de volta.',
      path: '/api-concept',
      icon: <Cpu size={24} />,
      color: 'var(--secondary)'
    },
    {
      id: 'dns',
      title: 'DNS LOOKUP',
      tag: 'NAVEGAÇÃO',
      desc: 'A lista telefônica da internet que traduz nomes em IPs.',
      path: '/dns',
      icon: <Globe size={24} />,
      color: '#ff6b00'
    },
    {
      id: 'https',
      title: 'HTTPS & SSL',
      tag: 'PRIVACIDADE',
      desc: 'Como seus dados viajam protegidos por um cofre digital.',
      path: '/https',
      icon: <Lock size={24} />,
      color: '#00ff88'
    },

    {
      id: 'error404',
      title: 'ERRO 404',
      tag: 'ROTAS',
      desc: 'Onde foram parar meus arquivos? Entenda por que as páginas somem da internet.',
      path: '/404-lab',
      icon: <AlertCircle size={24} />,
      color: '#ff3b3b'
    },
    {
      id: 'deploy',
      title: 'DEPLOY & CLOUD',
      tag: 'IMPLANTAÇÃO',
      desc: 'Leve seu código da sua máquina para o mundo real em um servidor 24/7.',
      path: '/deploy',
      icon: <CloudUpload size={24} />,
      color: '#00f3ff'
    }
  ];

  const player = JSON.parse(localStorage.getItem('rota404_player') || '{}');
  const { unlockAchievement } = useAchievement();

  React.useEffect(() => {
    // Inicializa o tempo da jornada se não existir
    if (!localStorage.getItem('rota404_journey_start')) {
      localStorage.setItem('rota404_journey_start', Date.now().toString());
    }

    // Check for Grand Master (RARO: completar todo o percurso)
    const progress = JSON.parse(localStorage.getItem('rota404_quiz_progress') || '{}');
    const completedModules = Object.keys(progress).filter(key => progress[key].score);
    if (completedModules.length >= 6) {
      unlockAchievement('COMPLETAR_PERCURSO', 'CONQUISTADOR DO SISTEMA', 'Você completou todo o percurso da Rota 404!', 'RARO');
      
      // LENDÁRIO: completar todo o percurso dentro de 6 minutos
      const journeyStart = parseInt(localStorage.getItem('rota404_journey_start') || '0');
      const journeyDuration = (Date.now() - journeyStart) / 1000;
      if (journeyDuration <= 360) { // 6 minutos = 360 segundos
        unlockAchievement('JORNADA_VELOZ', 'SPEEDRUNNER CYBER', 'Você completou todo o percurso em menos de 6 minutos!', 'LENDÁRIO');
      }
    }
  }, [unlockAchievement]);

  const handleFinishSimulation = async () => {
    const saved = JSON.parse(localStorage.getItem('rota404_quiz_progress') || '{}');
    
    // Calcula os pontos baseado nas tentativas
    const TOTAL_QUESTIONS = 18; // Definido na especificação
    const X = 100 / TOTAL_QUESTIONS;
    let totalScore = 0;
    
    Object.keys(saved).forEach(moduleId => {
      const moduleData = saved[moduleId];
      
      // Se o módulo foi concluído, usa a pontuação calculada (inclui bônus de tempo)
      if (moduleData.score && moduleData.score.total) {
        totalScore += moduleData.score.total;
      } else if (moduleData.isCorrectMap) {
        // Para módulos não finalizados, calcula apenas as respostas corretas (sem bônus)
        const un = 16.66666666666667;
        Object.keys(moduleData.isCorrectMap).forEach(qIdx => {
          if (moduleData.isCorrectMap[qIdx]) {
            const tent = moduleData.attempts[qIdx] || 1;
            totalScore += (un * 3) / tent;
          }
        });
      }
    });

    // NOVAS CONQUISTAS DE PONTUAÇÃO
    if (totalScore >= 300) {
      unlockAchievement('PONTUACAO_300', 'HACKER APRENDIZ', 'Você atingiu 300 pontos ou mais!', 'COMUM');
    }
    if (totalScore >= 700) {
      unlockAchievement('PONTUACAO_700', 'HACKER AVANÇADO', 'Você atingiu 700 pontos ou mais!', 'RARO');
    }
    if (totalScore >= 900) {
      unlockAchievement('PONTUACAO_900', 'DEUS DO CÓDIGO', 'Você atingiu 900 pontos ou mais!', 'LENDÁRIO');
    }

    const isFirstTime = !player.progress?.score || player.progress.score === 0;

    if (player.id) {
      const achievements = JSON.parse(localStorage.getItem('rota404_achievements') || '[]');
      try {
        // Se for a primeira vez, envia tudo. Se não, envia apenas as achievements (o backend deve ignorar o score se já existir, mas aqui garantimos enviando o original ou uma flag)
        await fetch(`${import.meta.env.VITE_API_URL}/api/players/${player.id}/score`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            score: isFirstTime ? totalScore : player.progress.score, 
            modules: saved,
            achievements: achievements,
            isUpdate: !isFirstTime // Flag opcional para o backend saber que é apenas atualização de badges
          })
        });
        
        // No local, só atualizamos o score se for a primeira vez
        player.progress = { 
          ...player.progress, 
          score: isFirstTime ? totalScore : player.progress.score, 
          modules: saved, 
          achievements: achievements 
        };
        localStorage.setItem('rota404_player', JSON.stringify(player));
      } catch (e) {
        console.error("Erro ao salvar dados:", e);
      }
    }
    
    navigate('/leaderboard', { state: { sessionScore: totalScore } });
  };

  const progressData = JSON.parse(localStorage.getItem('rota404_quiz_progress') || '{}');

  return (
    <div className={`container ${styles.hubContainer}`}>
      <ParticleBackground />
      
      <div className={styles.topActions}>
        <motion.button 
          className={styles.achievementBtn}
          onClick={() => navigate('/achievements')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <LayoutGrid size={20} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span>CONQUISTAS</span>
            <span style={{ fontSize: '0.6rem', opacity: 0.7, fontFamily: 'var(--font-mono)' }}>
              {JSON.parse(localStorage.getItem('rota404_achievements') || '[]').filter(a => [
                'ESCOLHER_NOME_AVATAR', 'QUIZ_PERFEITO', 'INTERACAO_BONZI', 'PONTUACAO_300',
                'QUIZ_RAPIDO_40', 'COMPLETAR_PERCURSO', 'QUIZ_3_SEGUIDOS', 'PONTUACAO_700', 'TOP_10',
                'QUIZ_RAPIDO_10', 'JORNADA_VELOZ', 'QUIZ_TODOS_PERFEITOS', 'PONTUACAO_900',
                'TOP_3', 'DIGITAR_START'
              ].includes(a)).length}/15 COLETADAS
            </span>
          </div>
        </motion.button>
      </div>

      <header className={styles.hubHeader}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <PrimaryLogo size="large" />
        </motion.div>
        <p className={`mono ${styles.subtitle}`}>
          DESCOMPLICANDO O MUNDO DIGITAL
        </p>
        <div className={styles.introBox}>
          <p className={styles.introText}>
            <strong>Olá, {player.name || 'Viajante'}!</strong> Escolha um dos caminhos abaixo para entender como a internet funciona "por baixo do capô". Não se preocupe, vamos te explicar tudo com calma!
          </p>
        </div>
      </header>

      <div className={styles.grid}>
        {modules.map((mod, idx) => {
          const isCompleted = progressData[mod.id]?.score?.total > 0;
          return (
            <ModuleCard 
              key={mod.id} 
              mod={mod} 
              index={idx} 
              isCompleted={isCompleted} 
            />
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
        <motion.button 
          className="btn-404" 
          onClick={handleFinishSimulation} 
          style={{ fontSize: '1.2rem', padding: '1.5rem 3rem', background: 'var(--secondary)' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          FINALIZAR SIMULAÇÃO E VER RESULTADO
        </motion.button>
      </div>
    </div>
  );
};

export default Hub;
