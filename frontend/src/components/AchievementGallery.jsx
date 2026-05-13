import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Star, Zap, Lock } from 'lucide-react';
import styles from './AchievementGallery.module.css';

const ALL_ACHIEVEMENTS = {
  COMUM: [
    { id: 'ESCOLHER_NOME_AVATAR', title: 'IDENTIDADE CONFIRMADA', desc: 'Escolheu nome e avatar.' },
    { id: 'QUIZ_PERFEITO', title: 'GABARITOU!', desc: 'Completou um quiz sem errar.' },
    { id: 'INTERACAO_BONZI', title: 'AMIGO DO SISTEMA', desc: 'Interagiu com o Bonzi.' },
    { id: 'INTERACAO_LAB', title: 'PESQUISADOR NATO', desc: 'Interagiu com todos os elementos de um laboratório.' },
    { id: 'PONTUACAO_300', title: 'HACKER APRENDIZ', desc: 'Pontuou 300 ou mais.' },
  ],
  RARO: [
    { id: 'QUIZ_RAPIDO_40', title: 'FLASH DA REDE', desc: 'Completou um quiz em < 40s.' },
    { id: 'COMPLETAR_PERCURSO', title: 'CONQUISTADOR', desc: 'Completou todo o percurso.' },
    { id: 'QUIZ_3_SEGUIDOS', title: 'TRIPLE KILL', desc: '3 quizes perfeitos seguidos.' },
    { id: 'PONTUACAO_700', title: 'HACKER AVANÇADO', desc: 'Pontuou 700 ou mais.' },
    { id: 'TOP_10', title: 'ELITE CYBER', desc: 'Atingiu o Top 10.' },
  ],
  LENDÁRIO: [
    { id: 'QUIZ_RAPIDO_10', title: 'VELOCIDADE DA LUZ', desc: 'Completou um quiz em < 10s.' },
    { id: 'JORNADA_VELOZ', title: 'SPEEDRUNNER', desc: 'Percurso em < 6 min.' },
    { id: 'QUIZ_TODOS_PERFEITOS', title: 'MESTRE DOS BITS', desc: 'Todos os quizes perfeitos.' },
    { id: 'PONTUACAO_900', title: 'DEUS DO CÓDIGO', desc: 'Pontuou 900 ou mais.' },
  ],
  SECRETAS: [
    { id: 'TOP_3', title: 'LENDA DA REDE', desc: 'Atingiu o Top 3.' },
    { id: 'DIGITAR_START', title: 'ACESSO PRIVILEGIADO', desc: 'Digitou START na tela inicial.' },
  ]
};

const AchievementGallery = ({ isOpen, onClose }) => {
  const unlocked = JSON.parse(localStorage.getItem('rota404_achievements') || '[]');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div 
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <div className={styles.header}>
              <h2 className="mono"><Trophy color="var(--primary)" /> CONQUISTAS</h2>
              <button onClick={onClose} className={styles.closeBtn}><X /></button>
            </div>

            <div className={styles.content}>
              {Object.entries(ALL_ACHIEVEMENTS).map(([category, list]) => (
                <div key={category} className={styles.categorySection}>
                  <h3 className={styles.categoryTitle} style={{ 
                    color: category === 'COMUM' ? '#aaa' : 
                           category === 'RARO' ? 'var(--secondary)' : 
                           category === 'LENDÁRIO' ? 'var(--primary)' : '#ff00ff'
                  }}>
                    {category}
                  </h3>
                  <div className={styles.grid}>
                    {list.map(ach => {
                      const isUnlocked = unlocked.includes(ach.id);
                      const isSecret = category === 'SECRETAS' && !isUnlocked;

                      return (
                        <div 
                          key={ach.id} 
                          className={`${styles.item} ${isUnlocked ? styles.unlocked : styles.locked}`}
                        >
                          <div className={styles.iconWrapper}>
                            {isUnlocked ? <Zap size={20} /> : <Lock size={20} opacity={0.3} />}
                          </div>
                          <div className={styles.info}>
                            <p className={styles.achTitle}>{isSecret ? '???' : ach.title}</p>
                            <p className={styles.achDesc}>{isSecret ? 'Continue explorando para descobrir.' : ach.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AchievementGallery;
