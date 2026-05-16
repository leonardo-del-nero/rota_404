import { useEffect, useState } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Star, ArrowLeft, LogOut, Zap, RefreshCcw, LayoutGrid } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useAchievement } from '../../context/AchievementContext';
import styles from './Leaderboard.module.css';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayScore, setDisplayScore] = useState(0);
  const [showFinishExpConfirm, setShowFinishExpConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { unlockAchievement } = useAchievement();
  
  const sessionScore = location.state?.sessionScore;
  const player = JSON.parse(localStorage.getItem('rota404_player') || '{}');
  const targetScore = player.progress?.score || 0;

  useEffect(() => {
    // Busca a leaderboard do backend
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/leaderboard`);
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

  useEffect(() => {
    if (!loading && leaderboard.length > 0 && player.id) {
      const rank = leaderboard.findIndex(p => p.id === player.id) + 1;
      if (rank > 0 && rank <= 10) {
        unlockAchievement('TOP_10', 'ELITE CYBER', 'Você atingiu o top 10 na leaderboard!', 'RARO');
      }
      if (rank > 0 && rank <= 3) {
        unlockAchievement('TOP_3', 'LENDA DA REDE', 'Você atingiu o top 3 na leaderboard!', 'SECRETAS');
      }
    }
  }, [loading, leaderboard, player.id, unlockAchievement]);

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
    setShowFinishExpConfirm(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.topButtons}>
        <div className={styles.leftGroup}>
          <motion.button 
            className={`btn-404 btn-outline`}
            onClick={() => navigate('/hub')}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            <ArrowLeft size={16} /> VOLTAR AO HUB
          </motion.button>
        </div>

        <div className={styles.rightGroup}>
          <motion.button 
            className={`btn-404`}
            onClick={() => navigate('/achievements')}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ background: 'var(--primary)', color: '#000' }}
          >
            <LayoutGrid size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }}/> 
            MINHAS CONQUISTAS
          </motion.button>

          <motion.button 
            className={`btn-404`}
            onClick={handleLogout}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ background: 'rgba(255,59,59,0.1)', color: 'var(--danger)', border: '1px solid var(--danger)' }}
          >
            <LogOut size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> 
            FINALIZAR EXPERIÊNCIA
          </motion.button>
        </div>
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
            {Math.floor(displayScore)}
          </div>
          <p className={styles.scoreText}>PONTOS DE HACKER</p>
          
          {sessionScore !== undefined && Math.abs(sessionScore - targetScore) > 0.01 && (
            <div className={styles.sessionScoreInfo}>
              <span className="mono">ESTA TENTATIVA: {Math.floor(sessionScore)} pts</span>
              <p className="mono" style={{ fontSize: '0.6rem', opacity: 0.5, marginTop: '4px' }}>
                (Seu score oficial na Leaderboard permanece {Math.floor(targetScore)})
              </p>
            </div>
          )}
          
          <div className={styles.cardActions}>
            <button 
              className={styles.refazerBtn}
              onClick={() => {
                const progress = JSON.parse(localStorage.getItem('rota404_quiz_progress') || '{}');
                Object.keys(progress).forEach(key => {
                  progress[key].attempts = {};
                  progress[key].isCorrectMap = {};
                  progress[key].lastSelected = {};
                  delete progress[key].startTime;
                  delete progress[key].score;
                });
                localStorage.setItem('rota404_quiz_progress', JSON.stringify(progress));
                localStorage.removeItem('rota404_consecutive_perfect');
                localStorage.removeItem('rota404_perfect_modules');
                localStorage.removeItem('rota404_journey_start');
                navigate('/hub');
              }}
            >
              <RefreshCcw size={14} /> REFAZER LABORATÓRIOS
            </button>
          </div>
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
                    <div className={`mono ${styles.achievements}`} style={{ fontSize: '0.75rem', color: 'var(--secondary)', opacity: 0.8 }}>
                      {(p.progress?.achievements?.filter(a => [
                        'ESCOLHER_NOME_AVATAR', 'QUIZ_PERFEITO', 'INTERACAO_BONZI', 'PONTUACAO_300',
                        'QUIZ_RAPIDO_40', 'COMPLETAR_PERCURSO', 'QUIZ_3_SEGUIDOS', 'PONTUACAO_700', 'TOP_10',
                        'QUIZ_RAPIDO_10', 'JORNADA_VELOZ', 'QUIZ_TODOS_PERFEITOS', 'PONTUACAO_900',
                        'TOP_3', 'DIGITAR_START'
                      ].includes(a)).length || 0)}/15 <Zap size={10} style={{ marginLeft: '2px' }} />
                    </div>
                    <div className={`mono ${styles.points}`}>{Math.floor(p.progress?.score ?? 0)} pts</div>
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

      {createPortal(
        <AnimatePresence>
          {showFinishExpConfirm && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <motion.div 
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                style={{ background: '#111', border: '2px solid var(--danger)', padding: '2.5rem', borderRadius: '16px', maxWidth: '500px', textAlign: 'center', boxShadow: '0 0 30px rgba(255,59,59,0.2)' }}
              >
                <h2 style={{ fontFamily: 'var(--font-mono)', color: 'var(--danger)', margin: '0 0 1.5rem 0' }}>ENCERRAR SIMULAÇÃO?</h2>
                <p style={{ color: '#ccc', fontSize: '1.1rem', lineHeight: '1.5', marginBottom: '2rem' }}>
                  Você está prestes a finalizar sua jornada na Rota 404.
                  <br/><br/>
                  <b>Todo o seu progresso local será apagado (Reset Total)!</b>
                  <br/><br/>
                  No entanto, seu nome e pontuação continuarão salvos na Leaderboard da nuvem. Tem certeza?
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button 
                    onClick={() => setShowFinishExpConfirm(false)}
                    style={{ background: 'transparent', color: '#fff', border: '2px solid #555', padding: '0.8rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '1.1rem' }}
                  >
                    CANCELAR
                  </button>
                  <button 
                    onClick={() => {
                      setShowFinishExpConfirm(false);
                      navigate('/credits');
                    }}
                    style={{ background: 'var(--danger)', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontWeight: 'bold', fontSize: '1.1rem' }}
                  >
                    CONFIRMAR RESET
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default Leaderboard;
