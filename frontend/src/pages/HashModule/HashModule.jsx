import { useState, useEffect } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, FileText, Zap, Moon, User, Server } from 'lucide-react';
import ModuleIntro from '../../components/ModuleIntro';
import LabHeader from '../../components/LabHeader';
import Quiz from '../../components/Quiz';
import { useAchievement } from '../../context/AchievementContext';
import GlassPanel from '../../components/GlassPanel';
import Mascot from '../../components/Mascot';
import styles from './HashModule.module.css';

import bonzi1 from '../../bonzi/bonzi_upscaled_0.png';
import bonzi2 from '../../bonzi/bonzi_upscaled_1.png';
import bonzi3 from '../../bonzi/bonzi_upscaled_3.png';

import Typewriter from '../../components/Typewriter';
import DataPackage from '../../components/DataPackage';

import neoImg from '../../avatars/ghost_spec_upscaled_0.png';
import trinityImg from '../../avatars/pucca_upscaled_0.png';
import morpheusImg from '../../avatars/stormtrooper_upscaled_0.png';
import piabaImg from '../../avatars/piaba_upscaled_0.png';
import pipocaImg from '../../avatars/tigrinho_upscaled_0.png';
import castorImg from '../../avatars/castor_upscaled_0.png';

const AVATAR_MAP = {
  '1': neoImg,
  '2': trinityImg,
  '3': morpheusImg,
  '4': piabaImg,
  '5': pipocaImg,
  '6': castorImg
};

const hashQuestions = [
  {
    q: "1. Se você mudar uma letra em um texto e gerar o Hash novamente, o que acontece com a \"assinatura\" gerada?",
    options: [
      "A. O Hash muda completamente, ficando irreconhecível em relação ao anterior.",
      "B. O Hash diminui o tamanho para indicar que houve uma edição.",
      "C. O Hash permanece o mesmo, pois o conteúdo principal não mudou.",
      "D. Apenas o caractere correspondente à letra alterada muda no Hash."
    ],
    correct: 0,
    why: "Isso é o efeito avalanche: qualquer alteração, por menor que seja, gera um resultado totalmente novo e imprevisível.",
  },
  {
    q: "2. A função Hash é considerada uma via de mão única. O que isso significa na prática?",
    options: [
      "A. Uma vez gerado, o Hash não pode ser excluído do computador.",
      "B. É fácil gerar um Hash a partir de um dado, mas impossível recuperar o dado original apenas lendo o Hash.",
      "C. O Hash só pode ser lido da esquerda para a direita.",
      "D. Significa que o Hash só pode ser enviado para um único destino por vez."
    ],
    correct: 1,
    why: "A função hash é irreversível; você pode validar um dado, mas não pode descriptografar o hash para obter o texto original.",
  },
  {
    q: "3. Se você tem dois arquivos diferentes no seu computador. Qual é a probabilidade de a \"Máquina de Hash\" gerar exatamente a mesma assinatura (SHA-256) para os dois?",
    options: [
      "A. É muito comum, por isso precisamos de senhas extras.",
      "B. A assinatura será igual se os arquivos tiverem o mesmo nome.",
      "C. É praticamente impossível, pois cada conjunto de dados gera uma assinatura única.",
      "D. A probabilidade é de 50%, dependendo do tamanho do arquivo."
    ],
    correct: 2,
    why: "O SHA-256 é tão complexo que a chance de dois arquivos diferentes terem o mesmo hash (colisão) é praticamente zero.",
  }
];

const HashModule = () => {
  const [showLab, setShowLab] = useState(false);
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('...');
  const [isHashingOn, setIsHashingOn] = useState(false);
  const [status, setStatus] = useState('IDLE');
  const [showQuiz, setShowQuiz] = useState(false);

  const [showCastor, setShowCastor] = useState(false);
  const [castorStep, setCastorStep] = useState(0); 
  const [generations, setGenerations] = useState(0);
  const [hashGenerations, setHashGenerations] = useState(0);
  const [isButtonFlashing, setIsButtonFlashing] = useState(false);
  const { unlockAchievement } = useAchievement();
  const [quizFocus, setQuizFocus] = useState(false);

  const slowScrollTo = (targetY, duration) => {
    const startingY = window.pageYOffset;
    const diff = targetY - startingY;
    let start;

    window.requestAnimationFrame(function step(timestamp) {
      if (!start) start = timestamp;
      const time = timestamp - start;
      const percent = Math.min(time / duration, 1);
      
      window.scrollTo(0, startingY + diff * percent);

      if (time < duration) {
        window.requestAnimationFrame(step);
      }
    });
  };

  useEffect(() => {
    if (showLab) {
      const endScreen = setTimeout(() => {
        slowScrollTo(300, 1000)
      }, 800);
    }

    setCastorStep(0);
    setShowCastor(true);
  }, [showLab]);

  const [playerData] = useState(() => {
    const savedPlayer = JSON.parse(localStorage.getItem('rota404_player') || '{}');
    const charId = savedPlayer.characterId || savedPlayer.character_id;

    return {
      name: savedPlayer.name || 'USUÁRIO',
      avatar: AVATAR_MAP[charId] || null
    };
  });

  const handleSend = async () => {
    if (!input || (status !== 'IDLE' && status !== 'DONE')) return;
    
    setStatus('SENDING_TO_HASH');
    setHash('...');
    
    setTimeout(async () => {
      setStatus('PROCESSING');
      
      if (!isHashingOn) {
        setTimeout(() => {
          setStatus('SENDING_TO_DEST');
          setTimeout(() => {
            setHash(input);
            setStatus('DONE');
            triggerCastor();
          }, 1000);
        }, 300);
      } else {
        try {
          const response = await fetch('/api/hash', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: input })
          });
          const data = await response.json();
          
          setTimeout(() => {
            setStatus('SENDING_TO_DEST');
            setTimeout(() => {
              setHash(data.hash.toUpperCase());
              setStatus('DONE');
              triggerCastor();
            }, 1000);
          }, 800);
        } catch (err) {
          setTimeout(() => {
            setStatus('SENDING_TO_DEST');
            setTimeout(() => {
              setHash('ERRO_CONEXÃO');
              setStatus('DONE');
              triggerCastor();
            }, 1000);
          }, 500);
        }
      }
    }, 1000);
  };

  const triggerCastor = () => {
    setGenerations(prev => prev + 1);

    if (!isHashingOn) {
      if (generations === 0) {
        setCastorStep(1); 
        setShowCastor(true);
        setIsButtonFlashing(true); 
      }
    } else {
      setIsButtonFlashing(false);
      setCastorStep(prev => {
        if (prev < 3) return 3;
        if (prev < 5) return prev + 1;
        return prev;
      });
      setShowCastor(true);
    }
  };

  const handleNextCastor = () => {
    if (castorStep === 1) {
      setShowCastor(false);
    } else if (castorStep === 4) {
      setCastorStep(5);
    } else if (castorStep === 5) {
      setCastorStep(6); 
      setQuizFocus(true); 
      
      slowScrollTo(0, 1000); 
    } else if (castorStep === 6) {
      setShowCastor(false);
      setQuizFocus(false);
    } else {
      setShowCastor(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetLab = () => {
    setShowLab(false);
    setInput('');
    setIsHashingOn(false); 
    setStatus('IDLE');
    setHash('...');
    setShowQuiz(false);
    setGenerations(0);
  };

  if (!showLab) {
    return (
      <ModuleIntro 
        title="DNA DIGITAL"
        color="var(--primary)"
        icon={Fingerprint}
        description="A prova de que nada foi alterado."
        analogy="O Hash é como a impressão digital de um arquivo. Se você mudar um único milímetro no seu dedo, a digital muda completamente. Na internet, se você mudar uma única letra num arquivo, o Hash muda e você sabe na hora que ele foi mexido."
        onStart={() => setShowLab(true)}
      >
        <div className={styles.introContainer}>
          <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }} className={styles.introIconWrapper}>
            <FileText size={80} color="var(--primary)" />
          </motion.div>
          <div className={styles.introArrow}>➔</div>
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, type: 'spring' }} className={styles.circleIcon}>
            <Fingerprint size={60} />
          </motion.div>
        </div>
      </ModuleIntro>
    );
  }

  return (
    <div className="container module-container">
      <LabHeader 
        showQuiz={showQuiz} 
        setShowQuiz={setShowQuiz} 
        onResetLab={resetLab} 
        quizFocus={quizFocus} 
      />

      <AnimatePresence>
        {quizFocus && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { 
              setQuizFocus(false);
              setShowCastor(false);
            }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              zIndex: 999,
              backdropFilter: 'blur(1px)',
              cursor: 'pointer'
            }}
          />
        )}
      </AnimatePresence>

      <div className="content-max-width">
        <Mascot 
          show={showCastor}
          step={castorStep}
          images={[bonzi1, bonzi2, bonzi3, bonzi1, bonzi2, bonzi3, bonzi2]}
          phrases={[
            /* Passo 0 */ <Typewriter text="Olá! Bem-vindo ao módulo de Hash. Digite qualquer mensagem ali embaixo e clique em enviar para começarmos!" />,
            /* Passo 1 */ <Typewriter text="Notou? Como o Hashing está DESLIGADO, a informação chegou ao destino exatamente como você a escreveu. Tente ligar o Hashing agora!" />,
            /* Passo 2 */ <Typewriter text="Ótimo! Agora com o Hashing LIGADO, digite uma nova mensagem e veja o que vai acontecer." />,
            /* Passo 3 */ <Typewriter text="Ei! Notou algo? Mude apenas uma letra ou um ponto e envie de novo. O Hash será completamente diferente!" />,
            /* Passo 4 */ <Typewriter text="O SHA-256 é tão complexo que a chance de dois arquivos diferentes terem o mesmo Hash é praticamente ZERO!" />,
            /* Passo 5 */ <Typewriter text="Gerar um Hash é como triturar uma fruta. Você joga a fruta (dado), faz o suco (hash), mas é impossível transformar o suco de volta em fruta." />,
            /* Passo 6 */ <Typewriter text="Você dominou o Hash! Que tal testar seus conhecimentos com um quiz rápido? Está logo ali em cima!" />
          ]}
          onNext={handleNextCastor}
          buttonLabels={["VAMOS LÁ_", "ENTENDI_", "OK!_", "INCRÍVEL_", "CONTINUAR_", "ENTENDI_", "BORA!_"]}
        />

        <AnimatePresence mode="wait">
          {!showQuiz ? (
            <motion.div 
              key="lab"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card-404"
            >
              <h2 className={`text-center lab-title ${styles.labTitle}`}>LABORATÓRIO DE HASH</h2>

              <div className="flex-center mb-4">
                <button 
                  className={`glass-panel ${styles.toggleBtn} ${isHashingOn ? styles.activePrimary : styles.inactive} ${isButtonFlashing ? styles.flashAnimation : ''}`} 
                  onClick={() => { 
                    if(status === 'IDLE' || status === 'DONE') {
                      const nextHashingState = !isHashingOn; 
                      setIsHashingOn(nextHashingState);
                      setIsButtonFlashing(false); 

                      if (nextHashingState) {
                        setCastorStep(2); 
                        setShowCastor(true);  
                      } else {
                        setShowCastor(false);
                      }
                    }
                  }}
                  disabled={status !== 'IDLE' && status !== 'DONE'}
                >
                  {isHashingOn ? <Zap size={18} /> : <Moon size={18} />}
                  HASHING: {isHashingOn ? 'LIGADO' : 'DESLIGADO'}
                </button>
              </div>

              <div className={styles.animationArena}>
                <div className={styles.pathLine}>
                  <AnimatePresence>
                    {status === 'SENDING_TO_HASH' && (
                      <motion.div 
                        initial={{ left: '0%' }} animate={{ left: '50%' }} transition={{ duration: 1, ease: "linear" }}
                        className={styles.packageContainer}
                      >
                        <DataPackage text={input} type="primary" />
                      </motion.div>
                    )}
                    {status === 'SENDING_TO_DEST' && (
                      <motion.div 
                        initial={{ left: '50%' }} animate={{ left: '100%' }} transition={{ duration: 1, ease: "linear" }}
                        className={styles.packageContainer}
                      >
                        <DataPackage 
                          text={isHashingOn ? '###' : input} 
                          type={isHashingOn ? 'success' : 'primary'} 
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className={styles.nodeItem}>
                  <div 
                    className={`node-icon ${styles.nodeIcon} ${styles.nodePrimary}`} 
                    style={{ 
                      overflow: 'hidden', 
                      padding: 0, 
                      background: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {playerData.avatar ? (
                      <img 
                        src={playerData.avatar} 
                        alt="Avatar" 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover'
                        }} 
                      />
                    ) : (
                      <User size={40} className={styles.nodePrimaryIcon} />
                    )}
                  </div>
                  <div className={styles.nodeLabel}>USUÁRIO</div>
                </div>

                <div className={styles.nodeItem}>
                  <div className={`node-icon ${styles.nodeIcon} ${styles.processingNode} ${isHashingOn ? (status === 'PROCESSING' ? styles.activeProcessing : styles.activeIdle) : styles.inactiveNode}`}>
                    {isHashingOn ? (
                      <motion.div animate={{ rotate: status === 'PROCESSING' ? 360 : 0, scale: status === 'PROCESSING' ? 1.2 : 1 }} transition={{ repeat: status === 'PROCESSING' ? Infinity : 0, duration: 1 }}>
                        <Fingerprint size={50} color="var(--primary)" />
                      </motion.div>
                    ) : (
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}>
                        <Moon size={40} color="#555" />
                      </motion.div>
                    )}
                  </div>
                  <div className={styles.nodeLabel}>FUNÇÃO HASH</div>
                </div>

                <div className={styles.nodeItem}>
                  <div className={`node-icon ${styles.nodeIcon} ${styles.nodePrimary}`}><Server size={40} className={styles.nodePrimaryIcon} /></div>
                  <div className={styles.nodeLabel}>DESTINO</div>
                </div>
              </div>

              <div className={styles.ioGrid}>
                <div className={styles.ioSection}>
                  <label className={styles.ioLabel}>INPUT DO USUÁRIO:</label>
                  <textarea 
                    className={`input-404 ${styles.inputArea}`}
                    value={input}
                    onChange={(e) => { 
                      setInput(e.target.value); 
                      setStatus('IDLE'); 
                      setHash('...'); 
                    }}
                    onKeyDown={handleKeyDown}
                    disabled={status !== 'IDLE' && status !== 'DONE'}
                    placeholder="Digite algo para enviar... (Pressione Enter para enviar)"
                  />
                  <button className="btn-404" onClick={handleSend} disabled={(status !== 'IDLE' && status !== 'DONE') || !input}>
                    {status === 'IDLE' || status === 'DONE' ? 'ENVIAR INFORMAÇÃO' : 'PROCESSANDO...'}
                  </button>
                </div>

                <div className={styles.ioSection}>
                  <label className={styles.ioLabel}>INFORMAÇÃO QUE CHEGOU:</label>
                  <GlassPanel className={styles.outputPanel}>
                    {hash}
                  </GlassPanel>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="card-404"
            >
              <Quiz moduleId="hash" questions={hashQuestions} onFinishQuiz={() => setShowQuiz(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HashModule;