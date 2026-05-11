import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap } from 'lucide-react';

const AchievementToast = ({ achievement, onExpire }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onExpire();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onExpire]);

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
        background: 'rgba(10, 10, 15, 0.95)',
        border: '1px solid var(--primary)',
        boxShadow: '0 0 30px var(--glow-primary)',
        padding: '1rem 2rem',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        minWidth: '320px'
      }}
    >
      <div style={{ 
        background: 'var(--primary)', 
        color: 'black', 
        padding: '10px', 
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Trophy size={24} />
      </div>
      <div>
        <h4 className="mono" style={{ color: 'var(--primary)', margin: 0, fontSize: '0.8rem' }}>CONQUISTA DESBLOQUEADA!</h4>
        <p style={{ color: 'white', margin: '4px 0 0 0', fontWeight: 'bold' }}>{achievement.title}</p>
        <p className="mono" style={{ color: '#888', margin: 0, fontSize: '0.7rem' }}>{achievement.description}</p>
      </div>
      <div style={{ marginLeft: 'auto', color: 'var(--primary)' }}>
        <Zap size={20} />
      </div>
    </motion.div>
  );
};

export default AchievementToast;
