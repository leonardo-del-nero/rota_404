import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Quiz = ({ questions, onFinishQuiz }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);

  const handleSelect = (idx) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: idx });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRestart = () => {
    setQuizFinished(false);
    setSelectedAnswers({});
    setCurrentQuestion(0);
  };

  if (quizFinished) {
    const score = questions.filter((q, i) => selectedAnswers[i] === q.correct).length;
    const allCorrect = score === questions.length;
    
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <h2 style={{ color: 'var(--primary)', fontSize: '2.5rem', marginBottom: '1rem' }}>
          SCORE: {score} / {questions.length}
        </h2>
        <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>
          {allCorrect ? "Excelente! Você dominou este módulo." : "Bom trabalho! Continue praticando no laboratório."}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn-404 btn-outline" onClick={handleRestart}>REINICIAR QUIZ</button>
          <button className="btn-404" onClick={onFinishQuiz}>VOLTAR AO LABORATÓRIO</button>
        </div>
      </div>
    );
  }

  const q = questions[currentQuestion];
  const hasSelected = selectedAnswers[currentQuestion] !== undefined;
  const isCorrect = hasSelected && selectedAnswers[currentQuestion] === q.correct;

  return (
    <>
      <div className="mono" style={{ color: 'var(--primary)', marginBottom: '1rem', letterSpacing: '2px' }}>
        QUESTÃO {currentQuestion + 1} / {questions.length}
      </div>
      <h3 style={{ marginBottom: '2rem', color: '#fff', fontSize: '1.4rem' }}>{q.q}</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {q.options.map((opt, idx) => {
          const isSelected = selectedAnswers[currentQuestion] === idx;
          return (
            <button 
              key={idx} 
              className="glass-panel" 
              onClick={() => handleSelect(idx)}
              style={{ 
                textAlign: 'left', 
                padding: '1.2rem', 
                border: isSelected ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                background: isSelected ? 'rgba(255,204,0,0.1)' : 'rgba(0,0,0,0.2)',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '0.95rem',
                letterSpacing: '0.5px', 
                lineHeight: '1.4'
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {hasSelected && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '4px', background: 'rgba(255,255,255,0.03)', borderLeft: `4px solid ${isCorrect ? 'var(--success)' : 'var(--danger)'}` }}>
          <p style={{ fontSize: '0.9rem', color: '#aaa', margin: 0 }}>
            <strong style={{ color: isCorrect ? 'var(--success)' : 'var(--danger)' }}>
              {isCorrect ? "CORRETO: " : "INCORRETO: "}
            </strong>
            {q.why}
          </p>
        </motion.div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem' }}>
        <button className="btn-404 btn-outline" disabled={currentQuestion === 0} onClick={handlePrev}>ANTERIOR</button>
        {currentQuestion < questions.length - 1 ? 
          <button className="btn-404" onClick={handleNext}>PRÓXIMA</button> :
          <button className="btn-404" style={{ background: 'var(--primary)', color: '#000', border: 'none' }} onClick={handleNext}>FINALIZAR QUIZ</button>
        }
      </div>
    </>
  );
};

export default Quiz;
