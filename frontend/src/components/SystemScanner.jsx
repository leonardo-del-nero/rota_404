import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const CyberTransition = () => {
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (location.pathname !== '/') {
      setIsActive(true);
      const timer = setTimeout(() => setIsActive(false), 600);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {isActive && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10000,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Top Bar */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: ['0%', '50%', '50%', '0%'] }}
            transition={{ duration: 0.6, times: [0, 0.4, 0.6, 1], ease: "easeInOut" }}
            style={{
              width: '100%',
              background: 'var(--bg-main)',
              borderBottom: '1px solid var(--secondary)',
              boxShadow: '0 5px 15px rgba(0, 243, 255, 0.2)'
            }}
          />
          
          {/* Bottom Bar */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: ['0%', '50%', '50%', '0%'] }}
            transition={{ duration: 0.6, times: [0, 0.4, 0.6, 1], ease: "easeInOut" }}
            style={{
              width: '100%',
              background: 'var(--bg-main)',
              borderTop: '1px solid var(--secondary)',
              boxShadow: '0 -5px 15px rgba(0, 243, 255, 0.2)',
              marginTop: 'auto'
            }}
          />

          {/* Centered Logo/Text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8] }}
            transition={{ duration: 0.6, times: [0, 0.3, 0.7, 1] }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'var(--secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              letterSpacing: '4px',
              zIndex: 10001
            }}
          >
            DECRYPTING_PATH...
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CyberTransition;


