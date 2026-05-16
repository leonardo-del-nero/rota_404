import React from 'react';
import { Link } from 'react-router-dom';
import { Home, RefreshCcw } from 'lucide-react';

const LabHeader = ({ 
  showQuiz, 
  setShowQuiz, 
  onResetLab, 
  quizFocus, 
  quizFinished, 
  setQuizFinished,
  setShowCastor,
  setQuizFocus 
}) => {
  
  const handleQuizToggle = () => {
    const nextShowQuiz = !showQuiz;

    if (nextShowQuiz) {
      if (typeof setShowCastor === 'function') setShowCastor(false); 
      if (typeof setQuizFocus === 'function') setQuizFocus(false);  
    } else {
      if (quizFinished) {
        if (typeof setQuizFinished === 'function') setQuizFinished(false); 
      }
    }

    setShowQuiz(nextShowQuiz);
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '3rem', 
      flexWrap: 'wrap', 
      gap: '1rem',
      position: 'relative',
      zIndex: quizFocus ? 1001 : 10
    }}>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        
        {quizFinished ? (
          <button 
            className="btn-404 btn-outline" 
            onClick={handleQuizToggle}
            style={{ borderRadius: '30px', clipPath: 'none' }}
          >
            {showQuiz ? "VOLTAR AO LABORATÓRIO" : "REALIZAR QUIZ"}
          </button>
        ) : (
          <Link 
            to="/hub" 
            className="btn-404 btn-outline" 
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
          >
            <Home size={16} /> VOLTAR AO HUB
          </Link>
        )}

        <button className="btn-404 btn-outline" onClick={onResetLab} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCcw size={16} /> REVER INTRO
        </button>
      </div>

      {quizFinished ? (
        <Link 
          to="/hub" 
          className="btn-404"
          style={{ 
            background: showQuiz ? '#fff' : 'var(--primary)', 
            color: '#000',
            border: 'none',
            transition: 'all 0.5s ease',
            transform: quizFocus ? 'scale(1.15)' : 'scale(1)',
            boxShadow: quizFocus ? '0 0 30px var(--primary), 0 0 60px var(--primary)' : 'none',
            animation: quizFocus ? 'pulse-glow 1.5s infinite' : 'none',
            borderRadius: '10px',
            clipPath: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none'
          }}
        >
          <Home size={16} /> VOLTAR AO HUB
        </Link>
      ) : (
        <button 
          className="btn-404" 
          onClick={handleQuizToggle}
          style={{ 
            background: showQuiz ? '#fff' : 'var(--primary)', 
            color: '#000',
            border: 'none',
            transition: 'all 0.5s ease',
            transform: quizFocus ? 'scale(1.15)' : 'scale(1)',
            boxShadow: quizFocus ? '0 0 30px var(--primary), 0 0 60px var(--primary)' : 'none',
            animation: quizFocus ? 'pulse-glow 1.5s infinite' : 'none',
            borderRadius: '10px',
            clipPath: 'none'
          }}
        >
          {showQuiz ? "VOLTAR AO LABORATÓRIO" : "REALIZAR QUIZ"}
        </button>
      )}

      <style>{`
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 20px var(--primary); }
          50% { box-shadow: 0 0 40px var(--primary), 0 0 15px #fff; }
          100% { box-shadow: 0 0 20px var(--primary); }
        }
      `}</style>
    </div>
  );
};

export default LabHeader;