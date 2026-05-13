import React from 'react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ParticleBackground from '../../components/ParticleBackground';
import styles from './Achievements.module.css';

import commonBadge from '../../badges/c_model.png';
import rareBadge from '../../badges/r_model.png';
import legendaryBadge from '../../badges/l_model.png';

const ALL_ACHIEVEMENTS = {
  COMUM: [
    { id: 'ESCOLHER_NOME_AVATAR', title: 'IDENTIDADE CONFIRMADA', desc: 'Escolheu nome e avatar.', icon: commonBadge },
    { id: 'QUIZ_PERFEITO', title: 'GABARITOU!', desc: 'Completou um quiz sem errar.', icon: commonBadge },
    { id: 'INTERACAO_BONZI', title: 'AMIGO DO SISTEMA', desc: 'Interagiu com o Bonzi.', icon: commonBadge },
    { id: 'PONTUACAO_300', title: 'HACKER APRENDIZ', desc: 'Pontuou 300 ou mais.', icon: commonBadge },
  ],
  RARO: [
    { id: 'QUIZ_RAPIDO_40', title: 'FLASH DA REDE', desc: 'Completou um quiz em < 40s.', icon: rareBadge },
    { id: 'COMPLETAR_PERCURSO', title: 'CONQUISTADOR', desc: 'Completou todo o percurso.', icon: rareBadge },
    { id: 'QUIZ_3_SEGUIDOS', title: 'TRIPLE KILL', desc: '3 quizes perfeitos seguidos.', icon: rareBadge },
    { id: 'PONTUACAO_700', title: 'HACKER AVANÇADO', desc: 'Pontuou 700 ou mais.', icon: rareBadge },
    { id: 'TOP_10', title: 'ELITE CYBER', desc: 'Atingiu o Top 10.', icon: rareBadge },
  ],
  LENDARIO: [
    { id: 'QUIZ_RAPIDO_10', title: 'VELOCIDADE DA LUZ', desc: 'Completou um quiz em < 10s.', icon: legendaryBadge },
    { id: 'JORNADA_VELOZ', title: 'SPEEDRUNNER', desc: 'Percurso em < 6 min.', icon: legendaryBadge },
    { id: 'QUIZ_TODOS_PERFEITOS', title: 'MESTRE DOS BITS', desc: 'Todos os quizes perfeitos.', icon: legendaryBadge },
    { id: 'PONTUACAO_900', title: 'DEUS DO CÓDIGO', desc: 'Pontuou 900 ou mais.', icon: legendaryBadge },
  ],
  SECRETAS: [
    { id: 'TOP_3', title: 'LENDA DA REDE', desc: 'Atingiu o Top 3.', icon: rareBadge },
    { id: 'DIGITAR_START', title: 'ACESSO PRIVILEGIADO', desc: 'Digitou START na tela inicial.', icon: rareBadge },
  ]
};

const Achievements = () => {
  const navigate = useNavigate();
  const [unlocked, setUnlocked] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('rota404_achievements') || '[]');
    setUnlocked(saved);
  }, []);

  return (
    <div className={styles.container}>
      <ParticleBackground />
      
      <div className={styles.header}>
        <motion.button 
          className="btn-404 btn-outline"
          onClick={() => navigate(-1)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ArrowLeft size={18} /> VOLTAR
        </motion.button>
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          SALA DE TROFÉUS
        </motion.h1>
        <div style={{ width: '100px' }} />
      </div>

      <div className={styles.content}>
        {Object.entries(ALL_ACHIEVEMENTS).map(([category, list], catIdx) => {
          const catUnlocked = list.filter(a => unlocked.includes(a.id)).length;
          const catTotal = list.length;
          const progressPercent = (catUnlocked / catTotal) * 100;

          return (
            <motion.section 
              key={category} 
              className={styles.section}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIdx * 0.1 }}
            >
              <div className={styles.categoryHeader}>
                <h2 className={styles.categoryTitle} data-category={category}>
                  {category} <span>({catUnlocked}/{catTotal})</span>
                </h2>
                <div className={styles.progressBarContainer}>
                  <motion.div 
                    className={styles.progressBar} 
                    data-category={category}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
              
              <div className={styles.grid}>
                {list.map((ach) => {
                  const isUnlocked = unlocked.includes(ach.id);
                  const isSecret = category === 'SECRETAS' && !isUnlocked;

                  return (
                    <motion.div 
                      key={ach.id}
                      className={`${styles.card} ${isUnlocked ? styles.unlocked : styles.locked} ${isSecret ? styles.secret : ''}`}
                      whileHover={isUnlocked ? { scale: 1.05, translateY: -5 } : {}}
                    >
                      <div className={styles.iconBox}>
                        {isUnlocked ? (
                          <img 
                            src={ach.icon} 
                            alt={ach.title} 
                            className={styles.badgeImg} 
                            style={category === 'SECRETAS' ? { filter: 'hue-rotate(290deg) brightness(1.2) drop-shadow(0 0 10px #ff00ff)' } : {}} 
                          />
                        ) : isSecret ? (
                          <Lock size={32} color="#ff00ff" />
                        ) : (
                          <img 
                            src={ach.icon} 
                            alt="Locked" 
                            className={styles.badgeImg} 
                            style={{ opacity: 0.2, filter: 'grayscale(1)' }} 
                          />
                        )}
                      </div>
                      <div className={styles.info}>
                        <h3>{isSecret ? '???' : ach.title}</h3>
                        <p>{isSecret ? 'Oculto nos códigos do sistema.' : ach.desc}</p>
                      </div>
                      {isUnlocked && <div className={styles.checkBadge}><Zap size={12} /></div>}
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;