import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Intro = ({ onFinish }) => {
  const [text, setText] = useState('');
  const [showSkip, setShowSkip] = useState(false);
  const player = JSON.parse(localStorage.getItem('rota404_player') || '{}');
  const playerName = player.name ? player.name.toUpperCase() : 'VIAJANTE';

  const fullText = `C ONECTANDO AO MUNDO DIGITAL...\nPREPARANDO SUAS FERRAMENTAS...\nMAPA DA ROTA CARREGADO.\n\nBEM-VINDO, ${playerName}, À ROTA 404.\nO LUGAR ONDE VOCÊ DESCOBRE COMO A WEB FUNCIONA.`;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setText((prev) => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(interval);
        // Após terminar o texto, espera um pouco e vai para o hub automaticamente
        setTimeout(() => {
          setShowSkip(true);
          setTimeout(() => {
            onFinish();
          }, 3000); // Voltando para 3 segundos para ler
        }, 1000);
      }
    }, 60); 

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#050505',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '2rem'
      }}
    >
      <div className="mono" style={{ 
        fontSize: '1.2rem', 
        color: 'var(--primary)', 
        maxWidth: '800px',
        whiteSpace: 'pre-wrap',
        borderLeft: '2px solid var(--primary)',
        paddingLeft: '1.5rem'
      }}>
        {text}
        <motion.span 
          animate={{ opacity: [1, 0] }} 
          transition={{ repeat: Infinity, duration: 0.8 }}
          style={{ background: 'var(--primary)', width: '10px', height: '1.2rem', display: 'inline-block', marginLeft: '5px' }}
        />
      </div>
      
      {(showSkip || text.length > 20) && (
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onFinish}
          className="btn-404"
          style={{ marginTop: '4rem' }}
        >
          PULAR_INTRO
        </motion.button>
      )}
    </motion.div>
  );
};

export default Intro;
