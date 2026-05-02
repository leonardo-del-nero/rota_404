import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Quiz = ({ moduleId, questions, onFinishQuiz }) => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [lastSelected, setLastSelected] = useState({});
  const [pendingSelection, setPendingSelection] = useState(null);
  const [attempts, setAttempts] = useState({});
  const [isCorrectMap, setIsCorrectMap] = useState({});
  const [showCongrats, setShowCongrats] = useState(false);

  useEffect(() => {
    if (moduleId) {
      const saved = JSON.parse(localStorage.getItem('rota404_quiz_progress') || '{}');
      if (saved[moduleId]) {
        setAttempts(saved[moduleId].attempts || {});
        setIsCorrectMap(saved[moduleId].isCorrectMap || {});
        setLastSelected(saved[moduleId].lastSelected || {});
      }
    }
  }, [moduleId]);

  const saveProgress = (newAttempts, newIsCorrectMap, newLastSelected) => {
    if (!moduleId) return;
    const saved = JSON.parse(localStorage.getItem('rota404_quiz_progress') || '{}');
    saved[moduleId] = { attempts: newAttempts, isCorrectMap: newIsCorrectMap, lastSelected: newLastSelected };
    localStorage.setItem('rota404_quiz_progress', JSON.stringify(saved));
  };

  const handleSelect = (idx) => {
    if (isCorrectMap[currentQuestion]) return; // Já acertou
    setPendingSelection(idx);
  };

  const handleConfirm = () => {
    if (pendingSelection === null) return;
    const isAnsCorrect = pendingSelection === questions[currentQuestion].correct;
    
    const newLastSelected = { ...lastSelected, [currentQuestion]: pendingSelection };
    const newAttemptsCount = (attempts[currentQuestion] || 0) + 1;
    const newAttempts = { ...attempts, [currentQuestion]: newAttemptsCount };
    const newIsCorrectMap = { ...isCorrectMap, [currentQuestion]: isAnsCorrect || isCorrectMap[currentQuestion] };
    
    setLastSelected(newLastSelected);
    setAttempts(newAttempts);
    setIsCorrectMap(newIsCorrectMap);
    
    saveProgress(newAttempts, newIsCorrectMap, newLastSelected);
    setPendingSelection(null);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setPendingSelection(null);
    } else {
      setShowCongrats(true);
      setTimeout(() => {
        navigate('/hub');
      }, 2500);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setPendingSelection(null);
    }
  };

  if (showCongrats) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ type: 'spring', damping: 12, stiffness: 100 }}
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'var(--bg-main)',
          zIndex: 9999,
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        <motion.h2 
          animate={{ 
            textShadow: ["0 0 20px var(--primary)", "0 0 60px var(--primary)", "0 0 20px var(--primary)"],
            scale: [1, 1.05, 1]
          }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          style={{ color: 'var(--primary)', fontSize: '5rem', fontFamily: 'var(--font-title)', letterSpacing: '4px', margin: 0 }}
        >
          PARABÉNS!
        </motion.h2>
      </motion.div>
    );
  }

  const q = questions[currentQuestion];
  const hasConfirmed = lastSelected[currentQuestion] !== undefined;
  const isCorrect = hasConfirmed && lastSelected[currentQuestion] === q.correct;
  const currentAttempts = attempts[currentQuestion] || 0;

  // Lógica para pegar a justificativa específica se existir
  const getFeedbackText = () => {
    if (isCorrect) return q.why;
    if (hasConfirmed && q.hints && q.hints[lastSelected[currentQuestion]]) {
      return q.hints[lastSelected[currentQuestion]];
    }
    return q.why; // Fallback
  };

  return (
    <>
      <div className="mono" style={{ color: 'var(--primary)', marginBottom: '1rem', letterSpacing: '2px', display: 'flex', justifyContent: 'space-between' }}>
        <span>QUESTÃO {currentQuestion + 1} / {questions.length}</span>
        {isCorrectMap[currentQuestion] && <span style={{color: 'var(--success)'}}>RESOLVIDO ({currentAttempts} tentativas)</span>}
      </div>
      <h3 style={{ marginBottom: '2rem', color: '#fff', fontSize: '1.4rem' }}>{q.q}</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {q.options.map((opt, idx) => {
          const isPending = pendingSelection === idx;
          const isLastConfirmed = lastSelected[currentQuestion] === idx;
          const isAlreadyCorrectMap = isCorrectMap[currentQuestion];
          const isThisOptionCorrect = isAlreadyCorrectMap && q.correct === idx;

          let borderCol = 'rgba(255,255,255,0.1)';
          let bgCol = 'rgba(0,0,0,0.2)';
          
          if (isThisOptionCorrect) {
            borderCol = 'var(--success)';
            bgCol = 'rgba(0,255,136,0.1)';
          } else if (isLastConfirmed && !isAlreadyCorrectMap && pendingSelection === null) {
            // Confirmou e errou
            borderCol = 'var(--danger)';
            bgCol = 'rgba(255,59,59,0.1)';
          } else if (isPending) {
            // Selecionou mas não confirmou
            borderCol = 'var(--secondary)';
            bgCol = 'rgba(0,243,255,0.1)';
          } else if (isLastConfirmed) {
            // Errou no passado, e agora está escolhendo outra
            borderCol = 'rgba(255,59,59,0.3)';
          }

          return (
            <button 
              key={idx} 
              className="glass-panel" 
              onClick={() => handleSelect(idx)}
              disabled={isAlreadyCorrectMap}
              style={{ 
                textAlign: 'left', 
                padding: '1.2rem', 
                border: `1px solid ${borderCol}`,
                background: bgCol,
                color: '#fff',
                cursor: isAlreadyCorrectMap ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '0.95rem',
                letterSpacing: '0.5px', 
                lineHeight: '1.4',
                boxShadow: isPending ? '0 0 15px rgba(0,243,255,0.2)' : 'none'
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {!isCorrectMap[currentQuestion] && pendingSelection !== null && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <button className="btn-404" onClick={handleConfirm} style={{ background: 'var(--secondary)', color: '#000' }}>
            CONFIRMAR RESPOSTA
          </button>
        </motion.div>
      )}

      {hasConfirmed && pendingSelection === null && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          style={{ 
            marginTop: '2rem', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            background: 'rgba(0,0,0,0.6)', 
            borderLeft: `4px solid ${isCorrect ? 'var(--success)' : 'var(--primary)'}` 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            {isCorrect ? <CheckCircle2 color="var(--success)" size={28} /> : <Lightbulb color="var(--primary)" size={28} />}
            <div>
              <h4 style={{ color: isCorrect ? 'var(--success)' : 'var(--primary)', marginBottom: '0.5rem', fontFamily: 'var(--font-title)', fontSize: '1rem' }}>
                {isCorrect ? 'ACESSO CONCEDIDO' : 'DICA DO SISTEMA'}
              </h4>
              <p style={{ color: '#ccc', lineHeight: '1.5', margin: 0, fontSize: '0.95rem' }}>
                {getFeedbackText()}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem' }}>
        <button className="btn-404 btn-outline" disabled={currentQuestion === 0} onClick={handlePrev}>ANTERIOR</button>
        {currentQuestion < questions.length - 1 ? 
          <button className="btn-404" disabled={!isCorrectMap[currentQuestion]} style={{ opacity: isCorrectMap[currentQuestion] ? 1 : 0.5 }} onClick={handleNext}>PRÓXIMA</button> :
          <button className="btn-404" disabled={!isCorrectMap[currentQuestion]} style={{ background: 'var(--primary)', color: '#000', border: 'none', opacity: isCorrectMap[currentQuestion] ? 1 : 0.5 }} onClick={handleNext}>FINALIZAR MÓDULO</button>
        }
      </div>
    </>
  );
};

export default Quiz;
