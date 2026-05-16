import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudUpload } from 'lucide-react'; // Mantido apenas para o botão se necessário
import ModuleIntro from '../../components/ModuleIntro';
import LabHeader from '../../components/LabHeader';
import Quiz from '../../components/Quiz';
import GlassPanel from '../../components/GlassPanel';
import Mascot from '../../components/Mascot';
import styles from './DeployModule.module.css';

// Importações dos assets de imagens da pasta labs conforme a árvore de arquivos
import deployBuild from '../../labs/deploy_build.png';
import deployIcon from '../../labs/deploy_icon.png';
import deployMonitorIntro from '../../labs/deploy_monitor_intro.png';
import deployRede from '../../labs/deploy_rede.png';
import deploySubir from '../../labs/deploy_subir.png';
import deployMonitor from '../../labs/depoly_monitor.png'; // Mantendo a grafia exata do arquivo: depoly_monitor
import allServer from '../../labs/all_server.png';

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
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizFocus, setQuizFocus] = useState(false); 
  
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
      setTimeout(() => {
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
      setQuizFocus(true);
      slowScrollTo(0, 1000);
    } else if (castorStep === 3) {
      setShowCastor(false);
      setQuizFocus(false);
    } else {
      setShowCastor(false);
    }
  };

  const resetLab = () => {
    setShowLab(false);
    setStatus('IDLE');
    setShowQuiz(false);
    setShowCastor(false);
    setLogs([]);
  };

  if (!showLab) {
    return (
      <ModuleIntro 
        title="DEPLOY & CLOUD"
        color="var(--secondary)"
        icon={() => <img src={deployIcon} alt="Deploy Icon" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />}
        description="Colocando sua ideia no ar."
        analogy="Seu computador é como a cozinha da sua casa. Você pode fazer um bolo lá, mas só você e sua família vão comer. O Servidor em Nuvem é como alugar uma loja no shopping: lá, qualquer pessoa do mundo pode entrar e experimentar o que você criou. O processo de levar o bolo da cozinha para a loja é o que chamamos de Deploy."
        onStart={() => setShowLab(true)}
      >
        <div className={styles.introContainer}>
          <motion.img 
            src={deployMonitorIntro} 
            alt="Monitor Dev" 
            style={{ width: '55px', height: '55px', objectFit: 'contain' }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          />
          <div className={styles.introArrow}>➔</div>
          <motion.img 
            src={allServer} 
            alt="Servidor" 
            style={{ width: '65px', height: '65px', objectFit: 'contain' }}
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
          />
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
        quizFinished={quizFinished} 
        setQuizFinished={setQuizFinished} 
        setShowCastor={setShowCastor}
        setQuizFocus={setQuizFocus}
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

      <div className="content-max-width" style={{ position: 'relative', zIndex: quizFocus ? 1002 : 1 }}> 
        <Mascot 
          show={showCastor}
          step={castorStep}
          images={[bonzi1, bonzi1, bonzi2, bonzi1]}
          phrases={[
            <Typewriter text="O seu código está apenas no seu computador (Local). Para o mundo ver, você precisa fazer o 'Build' e depois enviá-lo (Deploy). Tente clicar em Executar Build!" />,
            <Typewriter text="Boa! O Build empacotou seu código. Ele removeu espaços, otimizou imagens e deixou tudo levinho. Agora está pronto para viajar pela rede!" />,
            <Typewriter text="Incrível! Seu site agora está morando em um Servidor: um supercomputador em um Data Center que nunca dorme e tem uma internet ultrarrápida!" />,
            <Typewriter text="Excelente! Você entendeu como funciona o Deploy e a Nuvem. Que tal testar seu conhecimento no Quiz?" />
          ]}
          onNext={handleNextCastor}
          buttonLabels={["BORA_", "ENTENDI_", "PRÓXIMO_", "BORA!_"]}
        /> 

        <AnimatePresence mode="wait">
          {!showQuiz ? (
            <motion.div key="lab" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card-404">
              <h2 className={`text-center mono ${styles.labTitle}`}>CENTRAL DE DEPLOY</h2>

              <div className={styles.arenaContainer}>
                
                {/* LOCAL MACHINE - MÁQUINA DE DESENVOLVIMENTO */}
                <div className={styles.localContainer}>
                  <motion.div 
                    className={styles.localIcon}
                    animate={{ y: [0, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    style={{ display: 'flex', alignItems: 'center', justifycontent: 'center' }}
                  >
                    {/* Alterado de Monitor para a imagem do laboratório */}
                    <img src={deployMonitor} alt="Monitor Local" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                  </motion.div>
                  <div className="mono secondary-text">LOCAL (DEV)</div>
                  
                  <AnimatePresence>
                    {status === 'READY_TO_DEPLOY' && (
                      <motion.div 
                        initial={{ scale: 0, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0 }}
                        className={styles.packageBox}
                        style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <img src={deployBuild} alt="Arquivo Compactado" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                        <span className="mono text-xs">build.zip</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* NETWORK PATH - INFRAESTRUTURA DE REDE */}
                <div className={styles.pathContainer}>
                  <div className={styles.pathLine} />
                  
                  <div className={styles.cloudIconWrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Alterado de Globe para deployRede com rotação contínua sutil */}
                    <motion.img 
                      src={deployRede} 
                      alt="Infraestrutura Rede" 
                      style={{ width: '45px', height: '45px', objectFit: 'contain' }}
                      animate={{ rotate: status === 'DEPLOYING' ? 360 : [0, 5, -5, 0] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: status === 'DEPLOYING' ? 1.5 : 4, 
                        ease: status === 'DEPLOYING' ? "linear" : "easeInOut" 
                      }}
                    />
                  </div>

                  {/* PACOTE DE ARQUIVOS VIAJANDO EM REDE DURANTE O DEPLOY */}
                  <AnimatePresence>
                    {status === 'DEPLOYING' && (
                      <motion.div
                        initial={{ left: '0%' }}
                        animate={{ left: '100%' }}
                        transition={{ duration: 3, ease: 'easeInOut' }}
                        className={styles.packageWrapper}
                      >
                        <div className={styles.packageBox}>
                          <img src={deploySubir} alt="Subindo Pacote" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* SERVER - SERVIDOR DE PRODUÇÃO EM NUVEM */}
                <div className={styles.serverContainer}>
                  <div className={`${styles.serverPanel} ${status === 'ONLINE' ? styles.serverActive : ''}`}>
                    <motion.img 
                      src={allServer} 
                      alt="Servidor Nuvem" 
                      style={{ width: '60px', height: '60px', objectFit: 'contain', marginBottom: '8px' }}
                      animate={status === 'ONLINE' ? { scale: [1, 1.03, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    />
                    <div className={`${styles.statusBadge} ${status === 'ONLINE' ? styles.statusOnline : styles.statusOffline}`}>
                      {status === 'ONLINE' ? 'ONLINE' : 'OFFLINE'}
                    </div>
                  </div>
                  <div className="mono secondary-text mt-2">SERVIDOR (PROD)</div>
                </div>

              </div>

              {/* GRIDS DE INTERAÇÕES E CONSOLE */}
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
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <img src={deploySubir} alt="Upload" style={{ width: '18px', height: '18px', marginRight: '8px', objectFit: 'contain' }} />
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
              <Quiz 
                moduleId="deploy" 
                questions={deployQuestions} 
                onFinishQuiz={() => {
                  setQuizFinished(true); 
                }} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DeployModule;