import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../index.css'; 

const Mascot = ({ 
  show, 
  step, 
  images,
  phrases,
  onNext, 
  buttonLabels,
  isHacker = false
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const content = (
    <div className="mascotNotify">
      <AnimatePresence>
        {show && (
          <div className="mascotContentWrapper">
            <motion.div 
              className="mascotFixed"
              initial={{ opacity: 0, y: 50, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.5 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <AnimatePresence mode="wait">
                <motion.img 
                  key={`${step}-${isHacker}`}
                  src={images[step] || images[0]} 
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                  className={`bonziSideImg ${isHacker ? 'hackerGlow' : ''}`} 
                />
              </AnimatePresence>
            </motion.div>

            <motion.div 
              className={`cyberPopup ${isHacker ? 'cyberPopupHacker' : ''}`}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ delay: 0.1 }}
            >
              <div className="popupHeader">
                <div className={`blinkDot ${isHacker ? 'blinkDotHacker' : ''}`} />
                <small>{isHacker ? 'CRITICAL_ERROR // INTRUSÃO DETECTADA' : 'BONZI_LOG // TRANSMISSÃO RECEBIDA'}</small>
              </div>
              
              <div className="popupBody">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={step}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="phraseContainer">
                      {phrases[step]}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="popupFooter">
                <button onClick={onNext} className={`popupBtn ${isHacker ? 'popupBtnHacker' : ''}`}>
                  {buttonLabels[step] || "ENTENDI_"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  return createPortal(content, document.body);
};

export default Mascot;