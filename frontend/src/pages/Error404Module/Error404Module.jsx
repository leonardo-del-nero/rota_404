import { useState, useEffect  } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, AlertCircle, HelpCircle, Server, DoorOpen, DoorClosed, Globe, CheckCircle, FileX, Search } from 'lucide-react';
import ModuleIntro from '../../components/ModuleIntro';
import LabHeader from '../../components/LabHeader';
import Quiz from '../../components/Quiz';
import Mascot from '../../components/Mascot';
import Typewriter from '../../components/Typewriter';
import styles from './Error404Module.module.css';

import bonzi1 from '../../bonzi/bonzi_upscaled_0.png';
import bonzi2 from '../../bonzi/bonzi_upscaled_1.png';
import bonzi3 from '../../bonzi/bonzi_upscaled_3.png';

const errorQuestions = [
  {
    q: "1. O que o código '404' indica quando você tenta acessar uma rota no seu simulador?",
    options: [
      "A. A internet do usuário caiu antes da requisição chegar ao guia (servidor).",
      "B. O usuário não tem permissão para entrar naquela pasta específica.",
      "C. O servidor foi encontrado e está funcionando, mas a rota (URL) solicitada não existe na tabela de roteamento dele.",
      "D. O servidor está desligado ou o cabo de rede foi desconectado."
    ],
    correct: 2,
    why: "O 404 é um erro de 'lado do cliente' que confirma: o servidor está lá, mas ele não encontrou nada no endereço que você digitou."
  },
  {
    q: "2. Qual é o código de status retornado pelo servidor quando a porta é encontrada com sucesso?",
    options: [
      "A. 200",
      "B. 301",
      "C. 404",
      "D. 500"
    ],
    correct: 0,
    why: "O código 200 (OK) é a resposta padrão da internet para dizer que a requisição foi bem-sucedida e o conteúdo foi entregue."
  },
  {
    q: "3. Por que o Erro 404 é importante para a experiência do usuário, mesmo sendo um erro?",
    options: [
      "A. Porque ele informa claramente que o endereço está errado, evitando que o usuário fique esperando por algo que não vai carregar.",
      "B. Porque o erro 404 limpa o cache do computador e libera memória RAM.",
      "C. Porque ele obriga o usuário a decorar todos os endereços corretos do site.",
      "D. Porque ele é a única forma de o servidor economizar energia."
    ],
    correct: 0,
    why: "Sinalizar o erro imediatamente permite que o usuário saiba que houve um erro de digitação ou link quebrado, permitindo que ele tome outra ação."
  }
];

const Error404Module = () => {
  const [showLab, setShowLab] = useState(false);
  const [path, setPath] = useState('/api/users/1');
  const [status, setStatus] = useState('IDLE'); 
  const [backendMsg, setBackendMsg] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);
  const [showCastor, setShowCastor] = useState(false);
  const [castorStep, setCastorStep] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizFocus, setQuizFocus] = useState(false); 

  const validDoors = ['/api/users/1', '/api/hash', '/api/dns-lookup'];

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

  const handleSearch = () => {
    if (!path || status === 'SCANNING') return; 
    
    setStatus('SCANNING');
    
    setTimeout(() => {
      const match = validDoors.find(door => door === path.toLowerCase());
      
      if (match) {
        setBackendMsg("Recurso encontrado! Servidor enviando dados...");
        setStatus('FOUND'); 
        setCastorStep(1); 
        setShowCastor(true);
      } else {
        setBackendMsg("Erro: O servidor não encontrou nada nesse endereço.");
        setStatus('NOT_FOUND'); 
        setCastorStep(2);
        setShowCastor(true);
      }
    }, 2000); 
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const resetLab = () => {
    setShowLab(false);
    setStatus('IDLE');
    setPath('/api/users/1');
    setShowQuiz(false);
  };

  if (!showLab) {
    return (
      <ModuleIntro 
        title="ERRO 404" 
        color="var(--danger)" 
        icon={AlertCircle} 
        description="O endereço que não existe mais." 
        analogy="O erro 404 é como chegar no endereço de um amigo e encontrar a casa vazia." 
        onStart={() => setShowLab(true)}
      >
        <div className={`flex-center ${styles.introContainer}`}>
          <motion.div animate={{ x: [-100, 50], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 3 }} className={styles.introPin}>
            <MapPin size={40} color="var(--text-dim)" />
          </motion.div>
          <HelpCircle size={60} color="var(--danger)" />
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
          images={[bonzi1, bonzi2, bonzi3]}
          phrases={[
            /* 0 */ <Typewriter text="Olá, bem-vindo ao módulo de Erro 404! Tente pesquisar uma das URLs mapeadas na nossa tabela para ver o servidor funcionando." />,
            /* 1 */ <Typewriter text="Perfeito! Como essa rota existe no servidor, ele retornou o status 200 (OK). Agora, tente digitar algo que não esteja na lista para ver o que acontece!" />,
            /* 2 */ <Typewriter text="Viu só? O servidor está ativo, mas ele não encontrou esse caminho. O 404 é exclusivo para rotas inexistentes, mas existem outros códigos como 403 ou 500!" />,
            /* 3 */ <Typewriter text="Excelente! Você entendeu como funcionam as rotas e o Erro 404. Que tal testar seu conhecimento no Quiz?" />
          ]}
          onNext={handleNextCastor}
          buttonLabels={["VAMOS LÁ_", "ENTENDI!_", "ENTENDI_", "BORA!_"]}
        /> 

        <AnimatePresence mode="wait">
          {!showQuiz ? (
            <motion.div 
              key="lab" 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} 
              className={`card-404 ${styles.labCard} ${status === 'NOT_FOUND' ? styles.labCardNotFound : styles.labCardDefault}`}
            >
              <div className={styles.searchBar}>
                <div className={styles.windowDots}>
                  <div className={`${styles.dot} ${styles.dotRed}`}></div>
                  <div className={`${styles.dot} ${styles.dotYellow}`}></div>
                  <div className={`${styles.dot} ${styles.dotGreen}`}></div>
                </div>
                <div className={styles.inputWrapper}>
                  <Globe size={16} color="#888" style={{ marginRight: '0.5rem' }} />
                  <input 
                    value={path} 
                    onChange={(e) => { setPath(e.target.value); setStatus('IDLE'); }} 
                    onKeyDown={handleKeyDown}
                    className={styles.inputField}
                    disabled={status === 'SCANNING'} 
                  />
                </div>
                <button 
                  className={`btn-404 ${styles.searchBtn} ${status === 'IDLE' ? styles.searchBtnIdle : styles.searchBtnScanning}`} 
                  onClick={handleSearch} 
                  disabled={status === 'SCANNING' || !path}
                >
                  {status === 'IDLE' ? 'ACESSAR' : 'BUSCANDO...'}
                </button>
              </div>

              <div className={styles.arenaContent}>
                <div className="text-center mb-4">
                  <Server size={40} color={status === 'SCANNING' ? 'var(--secondary)' : '#666'} className={`${styles.serverIcon} ${status === 'SCANNING' ? styles.serverIconScanning : ''}`} />
                  <h3 className={`mono ${styles.serverTitle} ${status === 'SCANNING' ? styles.serverTitleScanning : styles.serverTitleIdle}`}>
                    {status === 'IDLE' ? 'SERVIDOR AGUARDANDO REQUISIÇÃO' : (status === 'SCANNING' ? 'ANALISANDO TABELA DE ROTEAMENTO...' : 'RESPOSTA DO SERVIDOR')}
                  </h3>
                </div>

                <div className="io-grid" style={{ alignItems: 'start' }}>
                  <div style={{ position: 'relative' }}>
                    <div className="io-label">ROTAS MAPEADAS (EXISTENTES)</div>
                    <div className={styles.doorList}>
                      <AnimatePresence>
                        {status === 'SCANNING' && (<motion.div initial={{ top: 0, opacity: 0 }} animate={{ top: '100%', opacity: [0, 1, 1, 0] }} transition={{ duration: 1.8, ease: "linear" }} className={styles.scanLine} />)}
                      </AnimatePresence>
                      {validDoors.map(door => {
                        const isMatched = status === 'FOUND' && path === door;
                        return (
                          <div key={door} className={`glass-panel ${styles.doorItem} ${isMatched ? styles.doorItemMatched : styles.doorItemDefault}`}>
                            {isMatched ? <DoorOpen size={24} color="var(--success)" /> : <DoorClosed size={24} color="#555" />}
                            <span className={`mono ${isMatched ? styles.doorLabelMatched : styles.doorLabelDefault}`}>{door}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className={styles.outputColumn}>
                    <div className="io-label">SAÍDA (OUTPUT)</div>
                    <div className={`glass-panel flex-center ${styles.outputBox} ${status === 'FOUND' ? styles.outputBoxFound : (status === 'NOT_FOUND' ? styles.outputBoxNotFound : styles.outputBoxDefault)}`}>
                      {status === 'IDLE' && <span className={styles.idleText}>Esperando requisição...</span>}
                      {status === 'SCANNING' && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}><Search size={40} color="var(--secondary)" style={{ opacity: 0.5 }} /></motion.div>}
                      {status === 'FOUND' && <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><CheckCircle size={60} color="var(--success)" style={{ marginBottom: '1rem' }} /><h2 className={`${styles.resultTitle} ${styles.resultTitleFound}`}>200 OK</h2><p className={`mono ${styles.resultMsg} ${styles.resultMsgFound}`}>{backendMsg}</p></motion.div>}
                      {status === 'NOT_FOUND' && <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><FileX size={60} color="var(--danger)" style={{ marginBottom: '1rem' }} /><h2 className={`${styles.resultTitle} ${styles.resultTitleNotFound}`}>404 NOT FOUND</h2><p className={`mono ${styles.resultMsg} ${styles.resultMsgNotFound}`}>{backendMsg}</p></motion.div>}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="card-404">
              <Quiz 
                moduleId="error404" 
                questions={errorQuestions} 
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

export default Error404Module;