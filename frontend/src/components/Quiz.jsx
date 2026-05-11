import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, CheckCircle2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAchievement } from '../context/AchievementContext';

const Quiz = ({ moduleId, questions, onFinishQuiz }) => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [lastSelected, setLastSelected] = useState({});
  const [pendingSelection, setPendingSelection] = useState(null);
  const [attempts, setAttempts] = useState({});
  const [isCorrectMap, setIsCorrectMap] = useState({});
  const [showCongrats, setShowCongrats] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const { unlockAchievement } = useAchievement();

  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (moduleId) {
      const saved = JSON.parse(localStorage.getItem('rota404_quiz_progress') || '{}');
      
      // Inicializa o módulo e o tempo de início se for a primeira vez
      if (!saved[moduleId]) {
        saved[moduleId] = { startTime: Date.now(), attempts: {}, isCorrectMap: {}, lastSelected: {} };
        localStorage.setItem('rota404_quiz_progress', JSON.stringify(saved));
      } else if (!saved[moduleId].startTime) {
        saved[moduleId].startTime = Date.now();
        localStorage.setItem('rota404_quiz_progress', JSON.stringify(saved));
      }

      setAttempts(saved[moduleId].attempts || {});
      setIsCorrectMap(saved[moduleId].isCorrectMap || {});
      setLastSelected(saved[moduleId].lastSelected || {});
    }
  }, [moduleId]);

  const saveProgress = (newAttempts, newIsCorrectMap, newLastSelected) => {
    if (!moduleId) return;
    const saved = JSON.parse(localStorage.getItem('rota404_quiz_progress') || '{}');
    const prevData = saved[moduleId] || {};
    saved[moduleId] = { 
      ...prevData, 
      attempts: newAttempts, 
      isCorrectMap: newIsCorrectMap, 
      lastSelected: newLastSelected 
    };
    localStorage.setItem('rota404_quiz_progress', JSON.stringify(saved));
  };

  const handleSelect = (idx) => {
    if (isReviewing || isCorrectMap[currentQuestion]) return;
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
    setDirection(1);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setPendingSelection(null);
    } else {
      // Final do quiz, calcula a pontuação
      const saved = JSON.parse(localStorage.getItem('rota404_quiz_progress') || '{}');
      const moduleData = saved[moduleId] || {};
      
      // Só calcula se ainda não tiver a pontuação fechada
      if (!moduleData.score) {
        const startTime = moduleData.startTime || Date.now();
        const seg = Math.floor((Date.now() - startTime) / 1000);
        
        const un = 16.66666666666667;
        const max_time = 80;
        
        let valor_bonus = 0;
        if (seg <= 10) {
          valor_bonus = un;
        } else if (seg <= max_time) {
          valor_bonus = (un / (max_time - 10)) * (max_time - seg - 10);
        } else {
          valor_bonus = 0;
        }
        
        let perguntasScore = 0;
        let perfectFirstTry = true;
        const questionsScoreDetails = {};
        
        questions.forEach((q, idx) => {
          const tent = moduleData.attempts[idx] || 1; 
          if (tent > 1) perfectFirstTry = false;
          const v = (un * 3) / tent;
          perguntasScore += v;
          questionsScoreDetails[idx] = { attempts: tent, score: v };
        });
        
        const valor_quiz = perguntasScore + valor_bonus;
        
        // Armazenando a nota por módulo e por tentativa
        moduleData.score = {
          total: valor_quiz,
          bonus: valor_bonus,
          timeElapsed: seg,
          questions: questionsScoreDetails
        };
        
        saved[moduleId] = moduleData;
        localStorage.setItem('rota404_quiz_progress', JSON.stringify(saved));

        // Conquistas de Dificuldade
        if (perfectFirstTry) {
          unlockAchievement(`PERFECTIONIST_${moduleId.toUpperCase()}`, 'PERFECCIONISTA DIGITAL', `Você acertou todas as questões de ${moduleId.toUpperCase()} de primeira!`);
        }
        if (seg < 30) {
          unlockAchievement(`SPEED_HACKER_${moduleId.toUpperCase()}`, 'SPEED HACKER', `Você detonou o laboratório de ${moduleId.toUpperCase()} em menos de 30 segundos!`);
        }
      }


      unlockAchievement(`QUIZ_COMPLETE_${moduleId.toUpperCase()}`, 'PERCURSO FINALIZADO', `Você completou o laboratório de ${moduleId.toUpperCase()}!`);
      setShowCongrats(true);
    }
  };

  const handlePrev = () => {
    setDirection(-1);
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setPendingSelection(null);
    }
  };

  const startReview = () => {
    setIsReviewing(true);
    setShowCongrats(false);
    setCurrentQuestion(0); 
  };

  if (showCongrats) {
    const score = questions.filter((q, i) => lastSelected[i] === q.correct).length;
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ textAlign: 'center', padding: '2rem 0' }}
      >
        <h2 style={{ color: 'var(--primary)', fontSize: '2.5rem', marginBottom: '1rem' }}>QUIZ CONCLUÍDO</h2>
        <p className="mono" style={{ color: 'var(--text-dim)', marginBottom: '3rem' }}>
          VOCÊ FINALIZOU O PERCURSO COM {score} ACERTOS DE {questions.length}.
        </p>
        <button className="btn-404" onClick={startReview}>
          <Eye size={18} style={{ marginRight: '8px' }} /> REVISAR RESPOSTAS
        </button>
      </motion.div>
    );
  }

  const q = questions[currentQuestion];
  const hasConfirmed = lastSelected[currentQuestion] !== undefined;
  const isCorrect = hasConfirmed && lastSelected[currentQuestion] === q.correct;
  const currentAttempts = attempts[currentQuestion] || 0;

  const getFeedbackText = () => {
    if (isCorrect) return q.why;
    if (hasConfirmed && q.hints && q.hints[lastSelected[currentQuestion]]) {
      return q.hints[lastSelected[currentQuestion]];
    }
    return q.why;
  };

  return (
    <div style={{ minHeight: '450px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="mono" style={{ color: 'var(--primary)', marginBottom: '1rem', letterSpacing: '2px', display: 'flex', justifyContent: 'space-between' }}>
        <span>{isReviewing ? "REVISÃO" : "QUESTÃO"} {currentQuestion + 1} / {questions.length}</span>
        {isCorrectMap[currentQuestion] && !isReviewing && <span style={{color: 'var(--success)'}}>RESOLVIDO ({currentAttempts} tentativas)</span>}
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentQuestion}
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ width: '100%' }}
        >
          <h3 style={{ marginBottom: '2rem', color: '#fff', fontSize: '1.4rem' }}>{q.q}</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {q.options.map((opt, idx) => {
              const isPending = pendingSelection === idx;
              const isLastConfirmed = lastSelected[currentQuestion] === idx;
              const isThisOptionCorrect = (isCorrectMap[currentQuestion] || isReviewing) && q.correct === idx;

              let borderCol = 'rgba(255,255,255,0.1)';
              let bgCol = 'rgba(0,0,0,0.2)';
              
              if (isThisOptionCorrect) {
                borderCol = 'var(--success)';
                bgCol = 'rgba(0,255,136,0.1)';
              } else if (isLastConfirmed && !isCorrectMap[currentQuestion] && !isReviewing) {
                borderCol = 'var(--danger)';
                bgCol = 'rgba(255,59,59,0.1)';
              } else if (isReviewing && isLastConfirmed && !isThisOptionCorrect) {
                 borderCol = 'var(--danger)';
                 bgCol = 'rgba(255,59,59,0.1)';
              } else if (isPending) {
                borderCol = 'var(--secondary)';
                bgCol = 'rgba(0,243,255,0.1)';
              }

              return (
                <button 
                  key={idx} className="glass-panel" onClick={() => handleSelect(idx)}
                  disabled={isCorrectMap[currentQuestion] || isReviewing}
                  style={{ 
                    textAlign: 'left', padding: '1.2rem', border: `1px solid ${borderCol}`,
                    background: bgCol, color: '#fff', cursor: (isCorrectMap[currentQuestion] || isReviewing) ? 'default' : 'pointer',
                    transition: 'all 0.2s ease', fontFamily: 'var(--font-mono), monospace', fontSize: '0.95rem'
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {!isReviewing && !isCorrectMap[currentQuestion] && pendingSelection !== null && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}
              >
                <button className="btn-404" onClick={handleConfirm} style={{ background: 'var(--secondary)', color: '#000' }}>
                  CONFIRMAR RESPOSTA
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {(isReviewing || (hasConfirmed && pendingSelection === null)) && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                style={{ 
                  marginTop: '2rem', padding: '1.5rem', borderRadius: '12px', 
                  background: 'rgba(0,0,0,0.6)', borderLeft: `4px solid ${isCorrect ? 'var(--success)' : 'var(--primary)'}` 
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
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem' }}>
        <button className="btn-404 btn-outline" disabled={currentQuestion === 0} onClick={handlePrev}>
          <ChevronLeft size={16} style={{marginRight: '5px'}}/> ANTERIOR
        </button>
        {isReviewing && currentQuestion === questions.length - 1 ? (
          <button className="btn-404" onClick={() => navigate('/hub')}>VOLTAR AO HUB</button>
        ) : (
          <button 
            className="btn-404" 
            disabled={!isReviewing && !isCorrectMap[currentQuestion]} 
            style={{ 
              opacity: (isReviewing || isCorrectMap[currentQuestion]) ? 1 : 0.5, 
              background: (currentQuestion === questions.length - 1 && !isReviewing) ? 'var(--primary)' : '',
              transition: 'all 0.3s ease'
            }} 
            onClick={handleNext}
          >
            {currentQuestion === questions.length - 1 ? (isReviewing ? "PRÓXIMA" : "FINALIZAR") : "PRÓXIMA"} <ChevronRight size={16} style={{marginLeft: '5px'}}/>
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;