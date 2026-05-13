import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Monitor, CloudUpload, Globe, Play, Box, CheckCircle } from 'lucide-react';
import ModuleIntro from '../../components/ModuleIntro';
import LabHeader from '../../components/LabHeader';
import Quiz from '../../components/Quiz';
import GlassPanel from '../../components/GlassPanel';
import Mascot from '../../components/Mascot';
import styles from './DeployModule.module.css';

import bonzi1 from '../../bonzi/bonzi_upscaled_0.png';
import bonzi2 from '../../bonzi/bonzi_upscaled_1.png';

import Typewriter from '../../components/Typewriter';

const deployQuestions = [
  {
    q: "1. Por que não devemos hospedar um site público diretamente no nosso computador pessoal?",
    options: [
      "A. Porque o site seria apagado toda vez que abrirmos outro programa.",
      "B. Porque precisaríamos deixar o computador ligado 24h por dia, com internet rápida e exposto a ataques de fora.",
      "C. Porque os navegadores (Chrome, Edge) só acessam sites que estão fora do Brasil.",
      "D. Na verdade, é a forma mais recomendada pelas grandes empresas."
    ],
    correct: 1,
    why: "Servidores em nuvem são máquinas preparadas para ficarem ligadas o tempo todo, com segurança e conexão redundante."
  },
  {
    q: "2. O que significa a etapa de 'Build' antes de enviar o código para o servidor?",
    options: [
      "A. É o momento em que o servidor cria um domínio (como .com.br).",
      "B. É o processo de apagar o banco de dados antigo para colocar um novo.",
      "C. É a preparação e empacotamento do código (otimizando arquivos e imagens) para que fique mais rápido no servidor.",
      "D. É a etapa onde enviamos um e-mail para os usuários avisando que o site mudou."
    ],
    correct: 2,
    why: "O Build 'traduz' e compacta o código feito pelos desenvolvedores para uma versão final que os navegadores leem mais rápido."
  },
  {
    q: "3. O que é 'Deploy'?",
    options: [
      "A. O ato de transferir o código empacotado para o servidor e colocá-lo no ar.",
      "B. A criação de um design novo para o aplicativo.",
      "C. O processo de descobrir senhas de outras redes.",
      "D. O pagamento da hospedagem mensal."
    ],
    correct: 0,
    why: "Fazer o deploy significa implantar o seu sistema. É tirar o projeto da máquina local e torná-lo acessível ao público na internet."
  }
];

const DeployModule = () => {
  const [showLab, setShowLab] = useState(false);
  const [status, setStatus] = useState('IDLE'); // IDLE, BUILDING, READY_TO_DEPLOY, DEPLOYING, ONLINE
  const [showQuiz, setShowQuiz] = useState(false);
  
  const [showCastor, setShowCastor] = useState(false);
  const [castorStep, setCastorStep] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  
  const [logs, setLogs] = useState([]);
  const terminalEndRef = useRef(null);

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

  const addLog = (msg, isAction = false) => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg, isAction }]);
  };

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleBuild = () => {
    if (status !== 'IDLE' && status !== 'ONLINE') return;
    setStatus('BUILDING');
    setLogs([]);
    addLog("Iniciando processo de build...", true);
    
    setTimeout(() => {
      addLog("Instalando dependências...");
      setTimeout(() => {
        addLog("Otimizando imagens e CSS...");
        setTimeout(() => {
          addLog("Build concluído com sucesso!", true);
          setStatus('READY_TO_DEPLOY');
          
          if(castorStep === 0 || castorStep === 1) {
            setCastorStep(1);
            setShowCastor(true);
          }
        }, 1500);
      }, 1000);
    }, 1000);
  };

  const handleDeploy = () => {
    if (status !== 'READY_TO_DEPLOY') return;
    setStatus('DEPLOYING');
    addLog("Conectando ao servidor em nuvem...", true);
    
    setTimeout(() => {
      addLog("Transferindo pacote de arquivos (Upload)...");
      setTimeout(() => {
        addLog("Extraindo arquivos no servidor...");
        setTimeout(() => {
          addLog("Reiniciando serviços...");
          setTimeout(() => {
            addLog("Deploy finalizado! Sistema ONLINE.", true);
            setStatus('ONLINE');
            
            setCastorStep(2);
            setShowCastor(true);
          }, 1500);
        }, 1500);
      }, 2000);
    }, 1000);
  };

  const handleNextCastor = () => {
    if (castorStep === 2) {
      setCastorStep(3);
    } else {
      setShowCastor(false);
    }
  };

  const resetLab = () => {
    setShowLab(false);
    setStatus('IDLE');
    setShowQuiz(false);
    setShowCastor(false);
    setHasStarted(false);
    setLogs([]);
  };

  if (!showLab) {
    return (
      <ModuleIntro 
        title="DEPLOY & CLOUD"
        color="var(--secondary)"
        icon={CloudUpload}
        description="Colocando sua ideia no ar."
        analogy="Seu computador é como a cozinha da sua casa. Você pode fazer um bolo lá, mas só você e sua família vão comer. O Servidor em Nuvem é como alugar uma loja no shopping: lá, qualquer pessoa do mundo pode entrar e experimentar o que você criou. O processo de levar o bolo da cozinha para a loja é o que chamamos de Deploy."
        onStart={() => setShowLab(true)}
      >
        <div className={styles.introContainer}>
          <Monitor size={50} color="var(--primary)" />
          <div className={styles.introArrow}>➔</div>
          <Server size={60} color="var(--secondary)" />
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
          images={[bonzi1, bonzi1, bonzi2, bonzi1]}
          phrases={[
            <Typewriter text="O seu código está apenas no seu computador (Local). Para o mundo ver, você precisa fazer o 'Build' e depois enviá-lo (Deploy). Tente clicar em Executar Build!" />,
            <Typewriter text="Boa! O Build empacotou seu código. Ele removeu espaços, otimizou imagens e deixou tudo levinho. Agora está pronto para viajar pela rede!" />,
            <Typewriter text="Incrível! Seu site agora está morando em um Servidor: um supercomputador em um Data Center que nunca dorme e tem uma internet ultrarrápida!" />,
            <Typewriter text="Excelente! Você dominou a prática deste laboratório. Agora, clique em 'QUIZ' ali no topo e mostre o que aprendeu!" />
          ]}
          onNext={handleNextCastor}
          buttonLabels={["BORA_", "ENTENDI_", "PRÓXIMO_", "BORA!_"]}
        />

        <AnimatePresence mode="wait">
          {!showQuiz ? (
            <motion.div key="lab" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card-404">
              <h2 className={`text-center mono ${styles.labTitle}`}>CENTRAL DE DEPLOY</h2>

              <div className={styles.arenaContainer}>
                
                {/* Local Machine */}
                <div className={styles.localContainer}>
                  <div className={styles.localIcon}>
                    <Monitor size={40} color="var(--primary)" />
                  </div>
                  <div className="mono secondary-text">LOCAL (DEV)</div>
                  
                  <AnimatePresence>
                    {status === 'READY_TO_DEPLOY' && (
                      <motion.div 
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className={styles.packageBox}
                        style={{ marginTop: '1rem' }}
                      >
                        <Box size={20} color="var(--primary)" />
                        <span className="mono text-xs">build.zip</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Network Path */}
                <div className={styles.pathContainer}>
                  <div className={styles.pathLine} />
                  
                  <div className={styles.cloudIconWrapper}>
                    <Globe size={30} color="rgba(255, 255, 255, 0.4)" />
                  </div>

                  <AnimatePresence>
                    {status === 'DEPLOYING' && (
                      <motion.div
                        initial={{ left: '0%' }}
                        animate={{ left: '100%' }}
                        transition={{ duration: 3, ease: 'easeInOut' }}
                        className={styles.packageWrapper}
                      >
                        <div className={styles.packageBox}>
                          <Box size={20} color="var(--secondary)" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Server */}
                <div className={styles.serverContainer}>
                  <div className={`${styles.serverPanel} ${status === 'ONLINE' ? styles.serverActive : ''}`}>
                    <Server size={50} color={status === 'ONLINE' ? 'var(--success)' : 'var(--secondary)'} />
                    <div className={`${styles.statusBadge} ${status === 'ONLINE' ? styles.statusOnline : styles.statusOffline}`}>
                      {status === 'ONLINE' ? 'ONLINE' : 'OFFLINE'}
                    </div>
                  </div>
                  <div className="mono secondary-text mt-2">SERVIDOR (PROD)</div>
                </div>

              </div>

              <div className={styles.controlsGrid}>
                <div className={styles.controlSection}>
                  <div className={`mono ${styles.sectionTitle}`}>AÇÕES DO DESENVOLVEDOR</div>
                  <div className={styles.buttonRow}>
                    <button 
                      className={`btn-404 ${styles.btnBuild}`} 
                      onClick={handleBuild}
                      disabled={status === 'BUILDING' || status === 'DEPLOYING'}
                    >
                      {status === 'BUILDING' ? 'PROCESSANDO...' : '1. EXECUTAR BUILD'}
                    </button>
                    
                    <button 
                      className={`btn-404 ${styles.btnDeploy}`} 
                      onClick={handleDeploy}
                      disabled={status !== 'READY_TO_DEPLOY'}
                    >
                      <CloudUpload size={18} style={{ marginRight: '8px' }} />
                      2. FAZER DEPLOY
                    </button>
                  </div>
                </div>

                <div className={styles.controlSection}>
                  <div className={`mono ${styles.sectionTitle}`}>TERMINAL DE DEPLOY</div>
                  <div className={styles.terminalOutput}>
                    {logs.length === 0 ? (
                      <div style={{ color: '#555' }}>Aguardando comandos...</div>
                    ) : (
                      logs.map((log, i) => (
                        <div key={i} className={styles.terminalLine}>
                          <span className={styles.terminalPrefix}>[{log.time}]</span>
                          <span className={log.isAction ? styles.terminalAction : ''}>{log.msg}</span>
                        </div>
                      ))
                    )}
                    <div ref={terminalEndRef} />
                  </div>
                </div>
              </div>

            </motion.div>
          ) : (
            <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="card-404">
              <Quiz moduleId="deploy" questions={deployQuestions} onFinishQuiz={() => setShowQuiz(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DeployModule;
