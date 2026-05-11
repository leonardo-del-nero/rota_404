import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './StartScreen.module.css';
import PrimaryLogo from '../../components/PrimaryLogo';
import { useAchievement } from '../../context/AchievementContext';

const StartScreen = () => {
  const navigate = useNavigate();
  const [showPressStart, setShowPressStart] = useState(false);

  useEffect(() => {
    // Atraso para mostrar o "Press Start" para dar tempo da logo aparecer
    const timer = setTimeout(() => {
      setShowPressStart(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    navigate('/select');
  };

  const [typedKeys, setTypedKeys] = useState('');
  const { unlockAchievement } = useAchievement();

  // Detecta teclas para o segredo "start" ou Enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleStart();
        return;
      }

      const char = e.key.toLowerCase();
      const target = "start";
      const nextTyped = typedKeys + char;

      if (target.startsWith(nextTyped)) {
        setTypedKeys(nextTyped);
        if (nextTyped === target) {
          localStorage.setItem('rota404_secret_start_pending', 'true');
          handleStart();
        }
      } else {
        setTypedKeys(char === target[0] ? char : '');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [typedKeys, unlockAchievement]);

  return (
    <div className={styles.startContainer} onClick={handleStart}>
      <div className={styles.gridOverlay}></div>
      <div className={styles.vignette}></div>
      
      <div className={styles.content}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={styles.logoContainer}
        >
          <PrimaryLogo size="xl" className={styles.mainLogo} />
          <p className={`mono ${styles.subtitle}`}>A JORNADA CYBERNÉTICA</p>
        </motion.div>

        {showPressStart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.5, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className={styles.pressStartContainer}
          >
            <p className={`mono ${styles.pressStartText}`}>&gt; PRESSIONE START (OU ENTER) _</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StartScreen;
