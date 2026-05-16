import { useEffect } from 'react';
import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

import comum1 from '../badges/comum1.png';
import comum2 from '../badges/comum2.png';
import comum3 from '../badges/comum3.png';
import comum4 from '../badges/comum4.png';
import comum5 from '../badges/comum5.png';
import comum6 from '../badges/comum6.png';
import comum7 from '../badges/comum7.png';

import rara1 from '../badges/rara1.png';
import rara2 from '../badges/rara2.png';
import rara3 from '../badges/rara3.png';
import rara4 from '../badges/rara4.png';
import rara5 from '../badges/rara5.png';

import lenda1 from '../badges/lenda1.png';
import lenda2 from '../badges/lenda2.png';
import lenda3 from '../badges/lenda3.png';
import lenda4 from '../badges/lenda4.png';

const TOAST_BADGES = {
  // Comuns
  'ESCOLHER_NOME_AVATAR': comum1,
  'QUIZ_PERFEITO': comum2,
  'INTERACAO_BONZI': comum3,
  'PONTUACAO_300': comum4,
  
  // Raras
  'QUIZ_RAPIDO_40': rara1,
  'COMPLETAR_PERCURSO': rara2,
  'QUIZ_3_SEGUIDOS': rara3,
  'PONTUACAO_700': rara4,
  'TOP_10': rara5,
  
  // Lendárias
  'QUIZ_RAPIDO_10': lenda1,
  'JORNADA_VELOZ': lenda2,
  'QUIZ_TODOS_PERFEITOS': lenda3,
  'PONTUACAO_900': lenda4,

  // Secretas
  'TOP_3': lenda4,
  'DIGITAR_START': comum5,
  'EASTER_EGG_PIABA': comum6
};

const AchievementToast = ({ achievement, onExpire }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onExpire();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onExpire]);

  const getGlowColor = () => {
    switch (achievement?.tier) {
      case 'RARO': return 'var(--secondary)';
      case 'LENDÁRIO': return 'var(--primary)';
      case 'SECRETAS': return '#ff00ff';
      default: return '#aaa';
    }
  };
  
  const badgeImg = TOAST_BADGES[achievement?.id] || achievement?.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, scale: 0.8, x: '-50%' }}
      style={{
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        zIndex: 10000,
        background: 'rgba(10, 10, 15, 0.98)',
        border: `1px solid ${getGlowColor()}`,
        boxShadow: `0 0 30px ${getGlowColor()}44`,
        padding: '0.8rem 1.5rem',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '1.2rem',
        minWidth: '340px',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div style={{ 
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>

        {badgeImg ? (
          <img 
            src={badgeImg} 
            alt="Badge" 
            style={{ 
              width: '45px', 
              height: '45px', 
              imageRendering: 'pixelated',
              filter: achievement?.tier === 'SECRETAS' ? 'hue-rotate(290deg) brightness(1.2)' : 'none'
            }} 
          />
        ) : (
          <div style={{ width: '45px', height: '45px' }} />
        )}
        
        <motion.div 
          animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ 
            position: 'absolute', 
            inset: -5, 
            border: `1px solid ${getGlowColor()}`, 
            borderRadius: '50%', 
            opacity: 0.3 
          }} 
        />
      </div>
      <div>
        <h4 className="mono" style={{ color: getGlowColor(), margin: 0, fontSize: '0.7rem', letterSpacing: '1px' }}>
          CONQUISTA DESBLOQUEADA!
        </h4>
        <p style={{ color: 'white', margin: '2px 0', fontWeight: 'bold', fontSize: '1rem' }}>{achievement?.title}</p>
        <p className="mono" style={{ color: '#aaa', margin: 0, fontSize: '0.7rem' }}>{achievement?.description || achievement?.desc}</p>
      </div>
      <div style={{ marginLeft: 'auto', color: getGlowColor() }}>
        <Zap size={20} />
      </div>
    </motion.div>
  );
};

export default AchievementToast;