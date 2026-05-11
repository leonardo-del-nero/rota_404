import React from 'react';
import { Link } from 'react-router-dom';
import { Home, RefreshCcw } from 'lucide-react';

const LabHeader = ({ showQuiz, setShowQuiz, onResetLab }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/hub" className="btn-404 btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <Home size={16} /> VOLTAR AO HUB
        </Link>
        <button className="btn-404 btn-outline" onClick={onResetLab} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCcw size={16} /> REVER INTRO
        </button>
      </div>

      <button 
        className="btn-404" 
        onClick={() => setShowQuiz(!showQuiz)}
        style={{ 
          background: showQuiz ? '#fff' : 'var(--primary)', 
          color: '#000',
          border: 'none'
        }}
      >
        {showQuiz ? "VOLTAR AO LABORATÓRIO" : "REALIZAR QUIZ"}
      </button>
    </div>
  );
};

export default LabHeader;
