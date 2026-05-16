import { useState, useEffect, useMemo  } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useAchievement } from '../../context/AchievementContext';
import styles from './Hub.module.css';
import PrimaryLogo from '../../components/PrimaryLogo';
import Typewriter from '../../components/Typewriter';

import bonziIdle from '../../bonzi/bonzi_upscaled_0.png';
import bonziTalk from '../../bonzi/bonzi_upscaled_1.png';
import Mascot from '../../components/Mascot';

import neoImg from '../../avatars/ghost_spec_upscaled_0.png';
import trinityImg from '../../avatars/pucca_upscaled_0.png';
import morpheusImg from '../../avatars/stormtrooper_upscaled_0.png';
import piabaImg from '../../avatars/piaba_upscaled_0.png';
import pipocaImg from '../../avatars/tigrinho_upscaled_0.png';
import castorImg from '../../avatars/castor_upscaled_0.png';

// Novos assets V2
import shipFrame0 from '../../assets/v2/foguete/foguete_png_0.png';
import shipFrame1 from '../../assets/v2/foguete/foguete_png_1.png';
import shipFrame2 from '../../assets/v2/foguete/foguete_png_2.png';
import shipFrame3 from '../../assets/v2/foguete/foguete_png_3.png';
import shipFrame4 from '../../assets/v2/foguete/foguete_png_4.png';
import shipFrame5 from '../../assets/v2/foguete/foguete_png_5.png';

const SHIP_FRAMES = [shipFrame0, shipFrame1, shipFrame2, shipFrame3, shipFrame4, shipFrame5];

import planetHash from '../../assets/v2/planetas/hashing_upscaled.png';
import planetApi from '../../assets/v2/planetas/api_upscaled.png';
import planetDns from '../../assets/v2/planetas/dns_upscaled.png';
import planetHttps from '../../assets/v2/planetas/https_upscaled.png';
import planetError404 from '../../assets/v2/planetas/erro404_upscaled.png';
import planetDeploy from '../../assets/v2/planetas/deploy_upscaled.png';

import spriteCofre from '../../assets/sprites/cofre_upscaled.png';
import spritePedido from '../../assets/sprites/pedido_upscaled.png';
import spriteCadeado from '../../assets/sprites/cadeado_upscaled.png';

const AVATARS = {
  '1': neoImg,
  '2': trinityImg,
  '3': morpheusImg,
  '4': piabaImg,
  '5': pipocaImg,
  '6': castorImg,
};

const Hub = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  
  const savedPos = JSON.parse(localStorage.getItem('rota404_ship_pos') || 'null');
  const [shipPos, setShipPos] = useState(savedPos || { x: 500, y: 180 });
  const [shipRot, setShipRot] = useState(Number(localStorage.getItem('rota404_ship_rot')) || 0);
  const [shipIndex, setShipIndex] = useState(Number(localStorage.getItem('rota404_ship_index')) || -1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [talkFrame, setTalkFrame] = useState(0);
  const [shipFrame, setShipFrame] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);

  const handleTypewriterComplete = React.useCallback(() => {
    setIsTalking(false);
  }, []);

  useEffect(() => {
    let interval;
    if (isTalking) {
      interval = setInterval(() => {
        setTalkFrame(prev => (prev === 0 ? 1 : 0));
      }, 150);
    } else {
      setTalkFrame(0);
    }
    return () => clearInterval(interval);
  }, [isTalking]);

  // Rocket animation frame cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setShipFrame(prev => (prev + 1) % SHIP_FRAMES.length);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const modules = useMemo(() => [
    {
      id: 'hash',
      title: 'DNA DIGITAL',
      desc: 'Como saber se um arquivo foi mexido? O Hash cria uma assinatura única que dedura qualquer mudança!',
      path: '/hash',
      color: 'var(--primary)',
      image: planetHash,
      sprite: spriteCofre,
      x: 300, y: 250
    },
    {
      id: 'api',
      title: 'GARÇOM DIGITAL',
      desc: 'Descubra como o seu computador faz "pedidos" para os sites e recebe as informações de volta.',
      path: '/api-concept',
      color: 'var(--secondary)',
      image: planetApi,
      sprite: spritePedido,
      x: 700, y: 450
    },
    {
      id: 'dns',
      title: 'DNS LOOKUP',
      desc: 'A lista telefônica da internet que traduz nomes em IPs.',
      path: '/dns',
      color: '#ff6b00',
      image: planetDns,
      x: 300, y: 650
    },
    {
      id: 'https',
      title: 'HTTPS & SSL',
      desc: 'Como seus dados viajam protegidos por um cofre digital.',
      path: '/https',
      color: '#00ff88',
      image: planetHttps,
      sprite: spriteCadeado,
      x: 700, y: 850
    },
    {
      id: 'deploy',
      title: 'DEPLOY & CLOUD',
      desc: 'Leve seu código da sua máquina para o mundo real em um servidor 24/7.',
      path: '/deploy',
      color: '#00f3ff',
      image: planetDeploy,
      x: 300, y: 1050
    },
    {
      id: 'error404',
      title: 'ERRO 404',
      desc: 'Onde foram parar meus arquivos? Entenda por que as páginas somem da internet.',
      path: '/404-lab',
      color: '#ff3b3b',
      image: planetError404,
      x: 700, y: 1250
    }
  ], []);

  const INITIAL_SHIP_POS = { x: 500, y: 180 };

  const player = JSON.parse(localStorage.getItem('rota404_player') || '{}');
  const { unlockAchievement } = useAchievement();
  const progressData = JSON.parse(localStorage.getItem('rota404_quiz_progress') || '{}');

  const currentScore = useMemo(() => {
    const saved = progressData;
    let totalScore = 0;
    Object.keys(saved).forEach(moduleId => {
      const moduleData = saved[moduleId];
      if (moduleData.score && moduleData.score.total) {
        totalScore += moduleData.score.total;
      } else if (moduleData.isCorrectMap) {
        const un = 1667;
        Object.keys(moduleData.isCorrectMap).forEach(qIdx => {
          if (moduleData.isCorrectMap[qIdx]) {
            const tent = moduleData.attempts[qIdx] || 1;
            totalScore += (un * 3) / tent;
          }
        });
      }
    });
    return Math.min(Math.floor(totalScore), 100000);
  }, [progressData]);

  useEffect(() => {
    if (!localStorage.getItem('rota404_journey_start')) {
      localStorage.setItem('rota404_journey_start', Date.now().toString());
    }

    const progress = JSON.parse(localStorage.getItem('rota404_quiz_progress') || '{}');
    const completedModules = Object.keys(progress).filter(key => progress[key].score);
    if (completedModules.length >= 6) {
      unlockAchievement('COMPLETAR_PERCURSO', 'CONQUISTADOR DO SISTEMA', 'Você completou todo o percurso da Rota 404!', 'RARO');
      const journeyStart = parseInt(localStorage.getItem('rota404_journey_start') || '0');
      const journeyDuration = (Date.now() - journeyStart) / 1000;
      if (journeyDuration <= 360) {
        unlockAchievement('JORNADA_VELOZ', 'SPEEDRUNNER CYBER', 'Você completou todo o percurso em menos de 6 minutos!', 'LENDÁRIO');
      }
    }

    // Milestones de pontuação
    if (currentScore >= 30000) unlockAchievement('PONTUACAO_300', 'HACKER APRENDIZ', 'Você atingiu 30.000 pontos ou mais!', 'COMUM');
    if (currentScore >= 70000) unlockAchievement('PONTUACAO_700', 'HACKER AVANÇADO', 'Você atingiu 70.000 pontos ou mais!', 'RARO');
    if (currentScore >= 90000) unlockAchievement('PONTUACAO_900', 'DEUS DO CÓDIGO', 'Você atingiu 90.000 pontos ou mais!', 'LENDÁRIO');
  }, [unlockAchievement, currentScore]);

  // Idle ship animation
  useEffect(() => {
    if (!isAnimating) {
      controls.start({
        y: [shipPos.y - 15, shipPos.y + 15],
        x: shipPos.x,
        scale: 1,
        rotate: shipRot,
        transition: { 
          y: { duration: 2, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut" },
          x: { duration: 0 },
          scale: { duration: 0.3 },
          rotate: { duration: 0.3 }
        }
      });
    }
  }, [shipPos, shipRot, isAnimating, controls]);

  const handlePlanetClick = async (node) => {
    if (isAnimating) return;
    
    const targetIndex = modules.findIndex(m => m.id === node.id);
    if (shipIndex === targetIndex) {
      setShowDialog(true);
      return;
    }
    
    setIsAnimating(true);
    setShowDialog(false);
    
    const direction = targetIndex > shipIndex ? 1 : -1;
    let pathPointsX = [shipPos.x];
    let pathPointsY = [shipPos.y];
    
    let currIndex = shipIndex;
    
    // Construct the path by traveling node by node
    while (currIndex !== targetIndex) {
      const nextIndex = currIndex + direction;
      
      const startNode = Math.min(currIndex, nextIndex) === -1 ? INITIAL_SHIP_POS : modules[Math.min(currIndex, nextIndex)];
      const endNode = modules[Math.max(currIndex, nextIndex)];
      
      const cMidY = (startNode.y + endNode.y) / 2;
      const cP0 = startNode;
      const cP1 = { x: startNode.x, y: cMidY };
      const cP2 = { x: endNode.x, y: cMidY };
      const cP3 = endNode;
      
      const steps = 30;
      for (let i = 1; i <= steps; i++) {
        const t = direction === 1 ? (i / steps) : (1 - (i / steps));
        
        const x = Math.pow(1 - t, 3) * cP0.x + 3 * Math.pow(1 - t, 2) * t * cP1.x + 3 * (1 - t) * Math.pow(t, 2) * cP2.x + Math.pow(t, 3) * cP3.x;
        const y = Math.pow(1 - t, 3) * cP0.y + 3 * Math.pow(1 - t, 2) * t * cP1.y + 3 * (1 - t) * Math.pow(t, 2) * cP2.y + Math.pow(t, 3) * cP3.y;
        
        pathPointsX.push(x);
        pathPointsY.push(y);
      }
      
      currIndex = nextIndex;
    }
    
    const totalPoints = pathPointsX.length;
    let pathRotations = [];
    let pathScales = [];
    
    for (let i = 0; i < totalPoints; i++) {
      let tangent;
      if (i < totalPoints - 1) {
        let dx = pathPointsX[i+1] - pathPointsX[i];
        let dy = pathPointsY[i+1] - pathPointsY[i];
        tangent = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      } else {
        tangent = pathRotations[i-1] || 0;
      }
      
      // Unwrap against the previous rotation, starting with shipRot
      let prev = i > 0 ? pathRotations[i-1] : shipRot;
      while (tangent - prev > 180) tangent -= 360;
      while (tangent - prev < -180) tangent += 360;
      
      pathRotations.push(tangent);
    }
    
    // Blend rotations to start at shipRot and end at nearest multiple of 360
    let finalRotations = pathRotations.map((rot, i) => {
      let progress = i / (totalPoints - 1);
      
      let blendFactor = 1;
      let targetZero;
      
      if (progress < 0.15) {
        blendFactor = progress / 0.15;
        targetZero = shipRot; // Blend from current rotation
      } else if (progress > 0.85) {
        blendFactor = (1 - progress) / 0.15;
        targetZero = Math.round(rot / 360) * 360; // Blend to nearest upright
      } else {
        return rot; // middle of flight
      }
      
      blendFactor = Math.sin(blendFactor * Math.PI / 2);
      return targetZero * (1 - blendFactor) + rot * blendFactor;
    });
    
    for (let i = 0; i < totalPoints; i++) {
      let progress = i / (totalPoints - 1);
      let scale = 1 + Math.sin(progress * Math.PI) * 0.5; // peaks at 1.5
      pathScales.push(scale);
    }
    
    const duration = Math.abs(targetIndex - shipIndex) * 0.8;
    
    await controls.start({
      x: pathPointsX,
      y: pathPointsY,
      scale: pathScales,
      rotate: finalRotations,
      transition: { 
        duration: duration,
        ease: "linear"
      }
    });
    
    const finalX = pathPointsX[pathPointsX.length - 1];
    const finalY = pathPointsY[pathPointsY.length - 1];
    
    setShipPos({ x: finalX, y: finalY });
    setShipRot(finalRotations[finalRotations.length - 1]);
    setShipIndex(targetIndex);
    
    localStorage.setItem('rota404_ship_pos', JSON.stringify({ x: finalX, y: finalY }));
    localStorage.setItem('rota404_ship_rot', finalRotations[finalRotations.length - 1].toString());
    localStorage.setItem('rota404_ship_index', targetIndex.toString());
    
    setIsAnimating(false);
    setSelectedNode(node);
    setIsTalking(true);
    setShowDialog(true);
  };

  const handleFinishClick = () => {
    const isFirstTime = !player.progress?.score || player.progress.score === 0;
    if (isFirstTime) {
      setShowConfirmFinish(true);
    } else {
      handleFinishSimulation();
    }
  };

  const handleFinishSimulation = async () => {
    const saved = JSON.parse(localStorage.getItem('rota404_quiz_progress') || '{}');
    let totalScore = 0;
    
    Object.keys(saved).forEach(moduleId => {
      const moduleData = saved[moduleId];
      if (moduleData.score && moduleData.score.total) {
        totalScore += moduleData.score.total;
      } else if (moduleData.isCorrectMap) {
        const un = 1667;
        Object.keys(moduleData.isCorrectMap).forEach(qIdx => {
          if (moduleData.isCorrectMap[qIdx]) {
            const tent = moduleData.attempts[qIdx] || 1;
            totalScore += (un * 3) / tent;
          }
        });
      }
    });
    totalScore = Math.min(Math.floor(totalScore), 100000);

    // Milestones de pontuação (também checados no useEffect, mas mantidos aqui para segurança no envio)
    if (totalScore >= 30000) unlockAchievement('PONTUACAO_300', 'HACKER APRENDIZ', 'Você atingiu 30.000 pontos ou mais!', 'COMUM');
    if (totalScore >= 70000) unlockAchievement('PONTUACAO_700', 'HACKER AVANÇADO', 'Você atingiu 70.000 pontos ou mais!', 'RARO');
    if (totalScore >= 90000) unlockAchievement('PONTUACAO_900', 'DEUS DO CÓDIGO', 'Você atingiu 90.000 pontos ou mais!', 'LENDÁRIO');

    localStorage.removeItem('rota404_ship_pos');
    localStorage.removeItem('rota404_ship_rot');
    localStorage.removeItem('rota404_ship_index');

    const isFirstTime = !player.progress?.score || player.progress.score === 0;

    if (player.id) {
      const achievements = JSON.parse(localStorage.getItem('rota404_achievements') || '[]');
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/players/${player.id}/score`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            score: isFirstTime ? totalScore : player.progress.score, 
            modules: saved,
            achievements: achievements,
            isUpdate: !isFirstTime
          })
        });
        
        player.progress = { 
          ...player.progress, 
          score: isFirstTime ? totalScore : player.progress.score, 
          modules: saved, 
          achievements: achievements 
        };
        localStorage.setItem('rota404_player', JSON.stringify(player));
      } catch (e) {
        console.error("Erro ao salvar dados:", e);
      }
    }
    
    navigate('/result', { state: { sessionScore: totalScore } });
  };

  const stars = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      x: Math.random() * 1000,
      y: Math.random() * 1500,
      size: Math.random() * 10 + 5,
      delay: Math.random() * 3
    }));
  }, []);

  const segments = useMemo(() => {
    const paths = [];
    let prev = INITIAL_SHIP_POS;
    modules.forEach(mod => {
      const midY = (prev.y + mod.y) / 2;
      paths.push(`M ${prev.x} ${prev.y} C ${prev.x} ${midY}, ${mod.x} ${midY}, ${mod.x} ${mod.y}`);
      prev = mod;
    });
    return paths;
  }, [modules]);

  const handleScroll = (e) => {
    setIsScrolled(e.target.scrollTop > 50);
  };

  return (
    <div className={styles.spaceContainer}>
      <div className={styles.topNav}>
        <motion.div 
          className={styles.logoWrapper}
          initial={false}
          animate={{
            left: isScrolled ? "2rem" : "50%",
            x: isScrolled ? "0%" : "-50%",
            y: "-50%",
            scale: isScrolled ? 0.7 : 1.2
          }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          style={{ position: 'absolute', top: '50%', originX: isScrolled ? 0 : 0.5, originY: 0.5 }}
        >
          <PrimaryLogo size="large" />
        </motion.div>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button 
            className={styles.trophyBtn} 
            onClick={() => navigate('/achievements')}
            title="Conquistas"
          >
            <Trophy size={24} />
          </button>
          
          <div className={styles.arcadeProfile}>
            <div className={styles.avatarCircle}>
              <img src={AVATARS[player.character_id] || AVATARS['1']} alt="Avatar" />
            </div>
            <div className={styles.profileInfo}>
              <p className={styles.playerName}>{player.name || 'VIAJANTE'}</p>
              <p className={styles.playerScore}>{currentScore} PTS</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomNav}>
        <button className={styles.finalizarBtn} onClick={handleFinishClick}>
          Finalizar Sessão
        </button>
      </div>

      <div className={styles.scrollArea} onScroll={handleScroll}>
        <svg viewBox="0 0 1000 1400" className={styles.mapSvg} preserveAspectRatio="xMidYMin slice">
          {/* Background Stars (Diamonds) */}
          {stars.map((star, i) => (
            <motion.polygon 
              key={`star-${i}`}
              points="0,-1 1,0 0,1 -1,0"
              transform={`translate(${star.x}, ${star.y}) scale(${star.size})`}
              fill="rgba(200, 200, 200, 0.3)"
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 2 + star.delay, repeat: Infinity, ease: "linear" }}
            />
          ))}

          {/* Dotted Paths */}
          {segments.map((d, i) => (
            <path 
              key={`path-${i}`} 
              d={d} 
              fill="none" 
              stroke="rgba(255, 255, 255, 0.4)" 
              strokeWidth="4" 
              strokeDasharray="15 15" 
            />
          ))}

          {/* Planets */}
          {modules.map((mod, idx) => {
            const isCompleted = progressData[mod.id]?.score?.total > 0;
            const isSelected = selectedNode?.id === mod.id;
            
            return (
              <motion.g 
                key={mod.id} 
                onClick={() => handlePlanetClick(mod)}
                whileHover={{ scale: 1.15 }}
                style={{ cursor: 'pointer' }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                {/* Enhanced background glow - ALWAYS THERE */}
                <motion.circle 
                  cx={mod.x} 
                  cy={mod.y} 
                  r={75} 
                  fill={mod.color}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isCompleted ? [0.3, 0.6, 0.3] : [0.15, 0.25, 0.15] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ filter: 'blur(20px)' }}
                />

                {/* Rotating orbit ring - ONLY FOR CURRENT MODULE */}
                {shipIndex === idx && (
                  <motion.circle
                    cx={mod.x}
                    cy={mod.y}
                    r={70}
                    fill="none"
                    stroke={mod.color}
                    strokeWidth={3}
                    strokeDasharray="10 10"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: `${mod.x}px ${mod.y}px` }}
                  />
                )}

                {/* Inner pulse - only for completed or current */}
                {(isCompleted || shipIndex === idx) && (
                  <motion.circle
                    cx={mod.x}
                    cy={mod.y}
                    r={62}
                    fill="none"
                    stroke="#fff"
                    strokeWidth={2}
                    animate={{ scale: [1, 1.1, 1], opacity: [0.8, 0.3, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}



                {/* Planet Image - Colorful by default, dim if not completed */}
                <image 
                  href={mod.image}
                  x={mod.x - 60}
                  y={mod.y - 60}
                  width={120}
                  height={120}
                  style={{ 
                    filter: isCompleted ? 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' : 'brightness(0.7) contrast(1.1)',
                    transition: 'all 0.5s ease'
                  }}
                />
                
                {/* Completion Badge (Small checkmark or star) */}
                {isCompleted && (
                  <motion.g
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                  >
                    <circle cx={mod.x + 45} cy={mod.y - 45} r={15} fill="var(--primary)" stroke="#000" strokeWidth={2} />
                    <text x={mod.x + 45} y={mod.y - 40} textAnchor="middle" fill="#000" fontSize="16" fontWeight="bold">✓</text>
                  </motion.g>
                )}

                {/* Selection Ring */}
                {isSelected && (
                  <circle 
                    cx={mod.x} 
                    cy={mod.y} 
                    r={80} 
                    fill="none" 
                    stroke="#fff" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                )}
                
                {/* Label */}
                <text 
                  x={mod.x} 
                  y={mod.y + 100} 
                  textAnchor="middle" 
                  fill={isCompleted ? "var(--primary)" : "#fff"}
                  fontSize="18"
                  fontWeight="bold"
                  fontFamily="var(--font-mono)"
                  letterSpacing="1"
                  style={{ 
                    textShadow: isCompleted ? '0 0 15px var(--primary)' : '0 0 10px rgba(0,0,0,1)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {mod.title} {isCompleted ? '[OK]' : ''}
                </text>

                {/* Floating Sprite (Top Left) - MOVIDO PARA CIMA DE TUDO */}
                {mod.sprite && (
                  <motion.g
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <image 
                      href={mod.sprite} 
                      x={mod.x - 95} 
                      y={mod.y - 95} 
                      width="65" 
                      height="65" 
                    />
                  </motion.g>
                )}
              </motion.g>
            );
          })}

          {/* The Ship */}
          <motion.g animate={controls}>
            {/* Animated Ship Sprite */}
            <image 
              href={SHIP_FRAMES[shipFrame]}
              x={-50}
              y={-50}
              width={100}
              height={100}
            />
          </motion.g>
        </svg>
      </div>

      {/* Bonzi Mascot overlay from modules */}
      <Mascot 
        show={showDialog && selectedNode}
        step={0}
        images={[talkFrame === 0 ? bonziIdle : bonziTalk]} 
        phrases={[ 
          <div key="mascot-text">
            <h3 style={{ margin: '0 0 10px 0', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
              {selectedNode?.title}
            </h3>
            <Typewriter 
              text={selectedNode?.desc || ''} 
              speed={25} 
              onComplete={handleTypewriterComplete} 
            />
          </div> 
        ]}
        onNext={() => navigate(selectedNode?.path || '/')}
        buttonLabels={["INICIAR_"]}
      />

      {createPortal(
        <AnimatePresence>
          {showConfirmFinish && (
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
                style={{ background: '#111', border: '2px solid var(--primary)', padding: '2.5rem', borderRadius: '16px', maxWidth: '500px', textAlign: 'center', boxShadow: '0 0 30px rgba(0,255,136,0.2)' }}
              >
                <h2 style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)', margin: '0 0 1.5rem 0' }}>ATENÇÃO, VIAJANTE</h2>
                <p style={{ color: '#ccc', fontSize: '1.1rem', lineHeight: '1.5', marginBottom: '2rem' }}>
                  Tem certeza que deseja finalizar a sessão agora? 
                  <br/><br/>
                  <b>Seus pontos serão definidos permanentemente na Leaderboard!</b> 
                  <br/><br/>
                  Mesmo após enviar, você poderá continuar explorando os módulos para tentar desbloquear novas conquistas.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button 
                    onClick={() => setShowConfirmFinish(false)}
                    style={{ background: 'transparent', color: '#fff', border: '2px solid #555', padding: '0.8rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '1.1rem' }}
                  >
                    VOLTAR
                  </button>
                  <button 
                    onClick={() => {
                      setShowConfirmFinish(false);
                      handleFinishSimulation();
                    }}
                    style={{ background: 'var(--primary)', color: '#000', border: '2px solid var(--primary)', padding: '0.8rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontWeight: 'bold', fontSize: '1.1rem' }}
                  >
                    FINALIZAR
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

export default Hub;
