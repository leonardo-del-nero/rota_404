import { useEffect, useState } from 'react';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Clock, Star, ChevronRight } from 'lucide-react';
import ParticleBackground from '../../components/ParticleBackground';
import styles from './ResultScreen.module.css';

import neoImg from '../../avatars/ghost_spec_upscaled_0.png';
import trinityImg from '../../avatars/pucca_upscaled_0.png';
import morpheusImg from '../../avatars/stormtrooper_upscaled_0.png';
import piabaImg from '../../avatars/piaba_upscaled_0.png';
import pipocaImg from '../../avatars/tigrinho_upscaled_0.png';
import castorImg from '../../avatars/castor_upscaled_0.png';

const AVATARS = {
  '1': neoImg,
  '2': trinityImg,
  '3': morpheusImg,
  '4': piabaImg,
  '5': pipocaImg,
  '6': castorImg,
};

const ResultScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionScore = location.state?.sessionScore || 0;
  
  const [player, setPlayer] = useState({});
  const [achievements, setAchievements] = useState([]);
  const [timeStr, setTimeStr] = useState('00:00');

  useEffect(() => {
    const savedPlayer = JSON.parse(localStorage.getItem('rota404_player') || '{}');
    setPlayer(savedPlayer);

    const savedAchievements = JSON.parse(localStorage.getItem('rota404_achievements') || '[]');
    setAchievements(savedAchievements);

    const journeyStart = parseInt(localStorage.getItem('rota404_journey_start') || '0');
    if (journeyStart > 0) {
      const durationSeconds = Math.floor((Date.now() - journeyStart) / 1000);
      const mins = Math.floor(durationSeconds / 60).toString().padStart(2, '0');
      const secs = (durationSeconds % 60).toString().padStart(2, '0');
      setTimeStr(`${mins}:${secs}`);
    }
  }, []);

  return (
    <div className={styles.container}>
      <ParticleBackground />
      
      <div className={styles.content}>
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          SESSÃO FINALIZADA
        </motion.h1>

        <motion.div 
          className={styles.profileCard}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className={styles.avatarBox}>
            <img src={AVATARS[player.character_id] || AVATARS['1']} alt="Avatar" />
          </div>
          <div className={styles.infoBox}>
            <h2>{player.name || 'VIAJANTE'}</h2>
            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <Trophy size={20} color="var(--primary)" />
                <span>{sessionScore} PTS</span>
              </div>
              <div className={styles.statItem}>
                <Clock size={20} color="var(--secondary)" />
                <span>{timeStr}</span>
              </div>
              <div className={styles.statItem}>
                <Star size={20} color="#ffcc00" />
                <span>{achievements.length} CONQUISTAS</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={styles.actionArea}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button 
            className={styles.leaderboardBtn}
            onClick={() => navigate('/leaderboard', { state: { sessionScore } })}
          >
            VER LEADERBOARD <ChevronRight size={24} />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultScreen;
