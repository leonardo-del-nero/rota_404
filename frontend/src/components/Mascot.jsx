import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../index.css'; 

const Mascot = ({ 
  show, 
  step, 
  images,
  phrases,
  onNext, 
  buttonLabels
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          className="mascotNotify" 
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
        >
          <div className="mascotFixed">
            <AnimatePresence mode="wait">
              <motion.img 
                key={step}
                src={images[step] || images[0]} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="castorSideImg" 
              />
            </AnimatePresence>
          </div>

          <div className="cyberPopup">
            <div className="popupHeader">
              <div className="blinkDot" />
              <small>CASTOR_LOG // TRANSMISSÃO RECEBIDA</small>
            </div>
            
            <div className="popupBody">
              <AnimatePresence mode="wait">
                <motion.p 
                  key={step}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {phrases[step]}
                </motion.p>
              </AnimatePresence>
            </div>

            <button onClick={onNext} className="popupBtn">
              {buttonLabels[step] || "OK_"}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Mascot;