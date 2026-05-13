import { useEffect } from 'react';
import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

import commonBadge from '../badges/c_model.png';
import rareBadge from '../badges/r_model.png';
import legendaryBadge from '../badges/l_model.png';

const AchievementToast = ({ achievement, onExpire }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onExpire();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onExpire]);

  const getBadgeIcon = () => {
    switch (achievement.tier) {
      case 'RARO': return rareBadge;
      case 'LENDÁRIO': return legendaryBadge;
      case 'SECRETAS': return rareBadge; // Secret uses rare as base
      default: return commonBadge;
    }
  };

  const getGlowColor = () => {
    switch (achievement.tier) {
      case 'RARO': return 'var(--secondary)';
      case 'LENDÁRIO': return 'var(--primary)';
      case 'SECRETAS': return '#ff00ff';
      default: return '#aaa';
    }
  };

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
        <img 
          src={getBadgeIcon()} 
          alt="Badge" 
          style={{ 
            width: '45px', 
            height: '45px', 
            imageRendering: 'pixelated',
            filter: achievement.tier === 'SECRETAS' ? 'hue-rotate(290deg) brightness(1.2)' : 'none'
          }} 
        />
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
        <p style={{ color: 'white', margin: '2px 0', fontWeight: 'bold', fontSize: '1rem' }}>{achievement.title}</p>
        <p className="mono" style={{ color: '#aaa', margin: 0, fontSize: '0.7rem' }}>{achievement.description}</p>
      </div>
      <div style={{ marginLeft: 'auto', color: getGlowColor() }}>
        <Zap size={20} />
      </div>
    </motion.div>
  );
};

export default AchievementToast;
