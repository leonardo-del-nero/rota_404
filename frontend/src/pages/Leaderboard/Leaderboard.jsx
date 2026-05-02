import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Star, ArrowLeft, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './Leaderboard.module.css';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayScore, setDisplayScore] = useState(0);
  const navigate = useNavigate();
  
  const player = JSON.parse(localStorage.getItem('rota404_player') || '{}');
  const targetScore = player.progress?.score || 0;

  useEffect(() => {
    // Busca a leaderboard do backend
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/leaderboard');
        if (response.ok) {
          const result = await response.json();
          setLeaderboard(result.data || []);
        }
      } catch (e) {
        console.error("Erro ao buscar leaderboard:", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, []);

  // Animação do score do jogador
  useEffect(() => {
    let current = 0;
    const duration = 2000; // 2 segundos
    const fps = 60;
    const increment = targetScore / (duration / (1000 / fps));
    
    const interval = setInterval(() => {
      current += increment;
      if (current >= targetScore) {
        setDisplayScore(targetScore);
        clearInterval(interval);
      } else {
        setDisplayScore(current);
      }
    }, 1000 / fps);
    
    return () => clearInterval(interval);
  }, [targetScore]);

  // Encontra a posição do jogador atual
  const playerRank = leaderboard.findIndex(p => p.id === player.id) + 1;

  const handleLogout = () => {
    localStorage.removeItem('rota404_player');
    localStorage.removeItem('rota404_quiz_progress');
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.topButtons}>
        <motion.button 
          className={`btn-404 btn-outline`}
          onClick={() => navigate('/hub')}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          <ArrowLeft size={16} /> VOLTAR AO HUB
        </motion.button>

        <motion.button 
          className={`btn-404`}
          onClick={handleLogout}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ background: 'var(--danger)', color: '#fff', border: 'none' }}
        >
          <LogOut size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }}/> 
          ENCERRAR SESSÃO (NOVO JOGADOR)
        </motion.button>
      </div>

      <div className={styles.scoreSection}>
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 10 }}
          className={styles.scoreCard}
        >
          <h2 className="mono">SEU SCORE FINAL</h2>
          <div className={styles.scoreValue}>
            {displayScore.toFixed(2)}
          </div>
          <p className={styles.scoreText}>PONTOS DE HACKER</p>
        </motion.div>
      </div>

      <div className={styles.boardSection}>
        <h1 className={styles.title}><Trophy color="var(--primary)" /> LEADERBOARD</h1>
        
        {loading ? (
          <p className="mono">CARREGANDO DADOS DA REDE...</p>
        ) : (
          <div className={styles.list}>
            <AnimatePresence>
              {leaderboard.map((p, idx) => {
                const isCurrentPlayer = p.id === player.id;
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + (idx * 0.1) }} // Espera a animação do score terminar (1s) para listar
                    className={`${styles.row} ${isCurrentPlayer ? styles.highlightRow : ''}`}
                  >
                    <div className={styles.rank}>
                      {idx === 0 ? <Medal color="var(--primary)" /> : 
                       idx === 1 ? <Medal color="#C0C0C0" /> : 
                       idx === 2 ? <Medal color="#CD7F32" /> : 
                       <span className="mono">{idx + 1}º</span>}
                    </div>
                    <div className={`mono ${styles.name}`}>{p.name}</div>
                    <div className={`mono ${styles.points}`}>{p.progress.score.toFixed(2)} pts</div>
                    {isCurrentPlayer && <Star size={16} color="var(--primary)" style={{ marginLeft: '1rem' }} />}
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {leaderboard.length === 0 && (
              <p className="mono">Nenhum registro encontrado. Seja o primeiro!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
