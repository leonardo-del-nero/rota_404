import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const ModuleIntro = ({ title, analogy, description, onStart, color, icon: Icon, children }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '2rem',
        background: 'radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)'
      }}
    >
      <div style={{ maxWidth: '800px', width: '100%', textAlign: 'center' }}>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: '3rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
             {Icon && <Icon size={32} color={color} />}
             <h1 style={{ color: 'white', fontSize: '2.5rem', letterSpacing: '4px' }}>{title}</h1>
          </div>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-dim)', maxWidth: '600px', margin: '0 auto' }}>{description}</p>
        </motion.div>

        {/* Animated Metaphor Area */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{ 
            background: 'rgba(255,255,255,0.02)', 
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '24px',
            padding: '3rem',
            marginBottom: '3rem',
            minHeight: '250px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {children}
          
          <div style={{ marginTop: '2rem', maxWidth: '500px', textAlign: 'center' }}>
             <p className="mono" style={{ fontSize: '0.8rem', color: color, marginBottom: '0.5rem' }}>A METÁFORA:</p>
             <p style={{ color: 'var(--text-bright)', fontSize: '1rem', lineHeight: '1.5', fontStyle: 'italic' }}>
               "{analogy}"
             </p>
          </div>
        </motion.div>

        <motion.button 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={onStart}
          className="btn-404"
          style={{ background: color, padding: '1.5rem 4rem', fontSize: '1.1rem', borderRadius: '50px', clipPath: 'none' }}
        >
          ESTOU PRONTO_
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ModuleIntro;
