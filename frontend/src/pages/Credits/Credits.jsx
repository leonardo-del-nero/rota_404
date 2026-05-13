import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ParticleBackground from '../../components/ParticleBackground';
import styles from './Credits.module.css';

const Credits = () => {
  const navigate = useNavigate();
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    // O botão de pular aparece um pouco mais cedo para melhor UX
    const timer = setTimeout(() => {
      setShowSkip(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleFinish = () => {
    // Limpando apenas estados do jogo, ou pode manter o clear() se preferir limpar tudo
    localStorage.clear(); 
    navigate('/');
  };

  return (
    <div className={styles.container}>
      {/* Esse ParticleBackground já vai dar o efeito perfeito de estrelas/poeira cósmica */}
      <ParticleBackground />
      
      {/* Efeitos visuais do monitor da nave / painel hacker */}
      <div className={styles.scanlines}></div>
      <div className={styles.vignette}></div>

      <div className={styles.crawlContainer}>
        <motion.div 
          className={styles.crawlText}
          initial={{ y: '100vh', opacity: 0, rotateX: 25 }}
          animate={{ 
            y: '-130%', // Ajuste conforme a quantidade de texto
            opacity: [0, 1, 1, 0], 
          }}
          transition={{ 
            duration: 45, 
            ease: 'linear',
            times: [0, 0.05, 0.9, 1] 
          }}
          onAnimationComplete={handleFinish}
        >
          <header className={styles.header}>
            <h1 className={styles.title}>ROTA 404</h1>
            <p className={styles.subtitle}>SISTEMA DESCONECTADO // NAVEGANDO NO VAZIO</p>
          </header>
          
          <div className={styles.section}>
            <h2>COMANDANTE DA FROTA E DEV FULL-STACK</h2>
            <p>Leonardo Del Nero</p>
          </div>

          <div className={styles.section}>
            <h2>CO-PILOTO DE DESENVOLVIMENTO E IDEALIZAÇÃO</h2>
            <p>Yasmin</p>
          </div>

          <div className={styles.section}>
            <h2>OFICIAL IMEDIATO (CO-LIDERANÇA) E SPRITES</h2>
            <p>Texugo</p>
          </div>

          <div className={styles.section}>
            <h2>ARQUITETO VISUAL E BATISMO DA "ROTA 404"</h2>
            <p>JP</p>
          </div>

          <div className={styles.section}>
            <h2>COMANDO ESTELAR (ORIENTADOR)</h2>
            <p>Prof. Vida Mansa</p>
          </div>

          <div className={styles.section}>
            <h2>AGRADECIMENTOS AOS VIAJANTES</h2>
            <p>Sem a sua curiosidade, este universo digital</p>
            <p>continuaria sendo apenas poeira estelar e código.</p>
            <p className={styles.hackTheWorld}>Continue hackeando o cosmos.</p>
          </div>
          
          <div className={styles.endSimulation}>
            <p>FIM DA TRANSMISSÃO</p>
            <span className={styles.cursor}>_</span>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showSkip && (
          <motion.button
            className={styles.skipBtn}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.05, textShadow: "0px 0px 8px rgb(255,255,255)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFinish}
          >
            [ ABORTAR SEQUÊNCIA ]
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Credits;