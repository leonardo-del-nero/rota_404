import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './StartScreen.module.css';
import PrimaryLogo from '../../components/PrimaryLogo';

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

  // Detecta "Enter" para avançar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
