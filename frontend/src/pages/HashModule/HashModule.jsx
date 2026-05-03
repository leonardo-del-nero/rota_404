import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, FileText, Zap, Moon, User, Server } from 'lucide-react';
import ModuleIntro from '../../components/ModuleIntro';
import LabHeader from '../../components/LabHeader';
import Quiz from '../../components/Quiz';
import GlassPanel from '../../components/GlassPanel';
import Mascot from '../../components/Mascot';
import styles from './HashModule.module.css';

import cp1 from '../../assets/cp1.png';
import cp2 from '../../assets/cp2.png';
import cp6 from '../../assets/cp6.png';

const Typewriter = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const timeout = setTimeout(() => {
      const typingInterval = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(typingInterval);
      }, 30);
      return () => clearInterval(typingInterval);
    }, 100);
    return () => {
      clearTimeout(timeout);
      setDisplayedText('');
    };
  }, [text]); 

  return <span>{displayedText}</span>;
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
    if (!isHashingOn) return; 

    setGenerations(prev => {
      const newCount = prev + 1;
      if (newCount === 1) {
        setCastorStep(0);
        setShowCastor(true);
      } else if (newCount === 2) {
        setCastorStep(1);
        setShowCastor(true);
      }
      return newCount;
    });
  };

  const handleNextCastor = () => {
    if (castorStep === 1) {
      setCastorStep(2);
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
      <LabHeader showQuiz={showQuiz} setShowQuiz={setShowQuiz} onResetLab={resetLab} />

      <div className="content-max-width">
        <Mascot 
          show={showCastor}
          step={castorStep}
          images={[cp1, cp2, cp6]}
          phrases={[
            <Typewriter text="Ei! Notou algo? Tente mudar apenas uma letra minúscula ou um ponto no seu texto e envie de novo. O Hash será completamente diferente!" />,
            <Typewriter text="Sabia que o SHA-256 tem tantas combinações que a chance de dois arquivos diferentes terem o mesmo Hash é praticamente ZERO!" />,
            <Typewriter text="Gerar um Hash é como triturar uma fruta. Você joga a fruta (dado), faz o suco (hash), mas é impossível transformar o suco de volta em fruta." />
          ]}
          onNext={handleNextCastor}
          buttonLabels={["ENTENDI_", "CONTINUAR_", "ENTENDI_"]}
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
                  className={`glass-panel ${styles.toggleBtn} ${isHashingOn ? styles.activePrimary : styles.inactive}`} 
                  onClick={() => { if(status === 'IDLE' || status === 'DONE') setIsHashingOn(!isHashingOn); }}
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
                        <div className={`data-package ${styles.dataPackage} ${styles.primaryPackage}`}>{input}</div>
                      </motion.div>
                    )}
                    {status === 'SENDING_TO_DEST' && (
                      <motion.div 
                        initial={{ left: '50%' }} animate={{ left: '100%' }} transition={{ duration: 1, ease: "linear" }}
                        className={styles.packageContainer}
                      >
                        <div className={`data-package ${styles.dataPackage} ${isHashingOn ? styles.successPackage : styles.primaryPackage}`}>
                          {isHashingOn ? '###' : input}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className={styles.nodeItem}>
                  <div className={`node-icon ${styles.nodeIcon} ${styles.nodePrimary}`}><User size={40} className={styles.nodePrimaryIcon} /></div>
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
                    onChange={(e) => { setInput(e.target.value); setStatus('IDLE'); setHash('...'); }}
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