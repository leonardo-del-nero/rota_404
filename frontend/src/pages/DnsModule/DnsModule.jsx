import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Server, Search, Contact, User, ExternalLink } from 'lucide-react';
import ModuleIntro from '../../components/ModuleIntro';
import LabHeader from '../../components/LabHeader';
import Quiz from '../../components/Quiz';
import GlassPanel from '../../components/GlassPanel';
import styles from './DnsModule.module.css';

const dnsQuestions = [
  {
    q: "1. Se o sistema de DNS parasse de funcionar em todo o mundo agora, o que aconteceria com a sua navegação?",
    options: [
      "A. Os sites passariam a carregar muito mais rápido porque não haveria tradução.",
      "B. Você não conseguiria acessar sites digitando nomes (como google.com), apenas digitando o endereço IP direto.",
      "C. Todos os sites do mundo seriam excluídos permanentemente.",
      "D. A internet seria desligada fisicamente e nenhum dado circularia mais."
    ],
    correct: 1,
    why: "O DNS funciona como uma lista telefônica; sem ele, você ainda pode ligar para o número (IP), mas não consegue completar a chamada usando apenas o nome do contato."
  },
  {
    q: "2. O que é um 'Endereço IP'?",
    options: [
      "A. É um código secreto que muda toda vez que você clica em um link.",
      "B. É o nome fantasia do site (ex: Rota 404).",
      "C. É o endereço físico e numérico único de um servidor na rede, como se fosse o CEP e o número de uma casa.",
      "D. É a velocidade com que a informação viaja pelo cabo de rede."
    ],
    correct: 2,
    why: "O IP (Internet Protocol) é a identificação única de cada máquina na rede, permitindo que os dados saibam exatamente para onde devem ser enviados."
  },
  {
    q: "3. O que acontece se um hacker conseguir 'envenenar' o seu DNS e trocar o IP do seu banco pelo IP de um site falso?",
    options: [
      "A. Você digitará o nome correto do site, mas o DNS te levará para o servidor errado sem você perceber.",
      "B. O site original será deletado da internet permanentemente.",
      "C. O site original será acessado de qualquer maneira, pois o navegador irá ignorar o novo IP falso.",
      "D. A velocidade da sua internet vai aumentar drasticamente."
    ],
    correct: 0,
    why: "Nesse ataque (DNS Spoofing), o navegador confia na 'placa de sinalização' errada e te entrega o conteúdo do invasor como se fosse o legítimo."
  }
];

const DnsModule = () => {
  const [showLab, setShowLab] = useState(false);
  const [url, setUrl] = useState('');
  const [step, setStep] = useState(0); // 0: idle, 1: sending to DNS, 2: DNS searching, 3: returning ip, 4: done
  const [result, setResult] = useState(null);
  const [searchLogs, setSearchLogs] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);

  const simulateDnsSearch = () => {
    const logs = [
      "> Analisando requisição...",
      "> Verificando cache local...",
      "> Consultando Root Servers...",
      "> Traduzindo domínio para IP...",
      "> Registro (A) encontrado!"
    ];
    
    setSearchLogs([]);
    let currentLog = 0;
    
    const interval = setInterval(() => {
      if (currentLog < logs.length) {
        setSearchLogs(prev => [...prev, logs[currentLog]]);
        currentLog++;
      } else {
        clearInterval(interval);
      }
    }, 400);
  };

  const handleLookup = async () => {
    if (!url) return;
    setStep(1);
    setResult(null);
    setSearchLogs([]);
    
    setTimeout(() => {
      setStep(2);
      simulateDnsSearch();
    }, 1500);
    
    try {
      const response = await fetch('/api/dns-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: url })
      });
      const data = await response.json();
      
      setTimeout(() => {
        setStep(3);
        setTimeout(() => {
          setStep(4);
          setResult(data.ip);
        }, 1500);
      }, 2500);

    } catch (err) {
      setTimeout(() => {
        setStep(4);
        setResult('ERRO_CONEXÃO');
      }, 2500);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLookup();
    }
  };

  const resetLab = () => {
    setShowLab(false);
    setStep(0);
    setResult(null);
    setUrl('');
    setSearchLogs([]);
    setShowQuiz(false);
  };

  if (!showLab) {
    return (
      <ModuleIntro 
        title="DNS"
        color="#ff6b00"
        icon={Globe}
        description="A lista telefônica que mantém a internet de pé."
        analogy="Você não precisa decorar o número de telefone de todos os seus amigos, basta procurar pelo nome no celular. O DNS faz a mesma coisa: ele traduz o nome do site em um endereço que os computadores entendem."
        onStart={() => setShowLab(true)}
      >
        <div className="flex-center" style={{ gap: '3rem' }}>
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }} className={styles.introIconWrapper}>
            <Contact size={80} color="#ff6b00" className={styles.introIconShadow} />
            <motion.div animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }} transition={{ repeat: Infinity, duration: 2 }} className={styles.introSearchOverlay}>
              <Search size={30} color="white" />
            </motion.div>
          </motion.div>
          <div className={styles.introArrow}>➔</div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className={`mono ${styles.introResult}`}>
            142.250.190.46
          </motion.div>
        </div>
      </ModuleIntro>
    );
  }

  const isValidIp = result && result !== 'IP_NÃO_ENCONTRADO' && result !== 'ERRO_CONEXÃO';

  return (
    <div className="container module-container">
      <LabHeader showQuiz={showQuiz} setShowQuiz={setShowQuiz} onResetLab={resetLab} />

      <div className="content-max-width">
        <AnimatePresence mode="wait">
          {!showQuiz ? (
            <motion.div 
              key="lab"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="card-404"
            >
              <div className="text-center mb-4">
                <h2 className={styles.labTitle}>LABORATÓRIO DE DNS</h2>
                <p className={styles.labSubtitle}>Veja a tradução de domínios acontecendo em tempo real.</p>
              </div>

              <div className={styles.arenaContainer}>
                <div className={styles.nodeContainer}>
                  <div className={`node-icon ${styles.userNodeIcon}`}>
                    <User size={40} color="#ff6b00" />
                  </div>
                  <div className={styles.nodeLabel}>USUÁRIO</div>
                </div>

                <div className={styles.connectionLine}>
                  <AnimatePresence>
                    {step === 1 && (
                      <motion.div initial={{ left: 0 }} animate={{ left: '100%' }} transition={{ duration: 1.5, ease: 'linear' }} className={styles.packageWrapper}>
                        <Search size={24} color="#ff6b00" className={styles.packageIcon} />
                        <div className={`data-package ${styles.dataPackageQuery}`}>QUEM É {url}?</div>
                      </motion.div>
                    )}
                    {step === 3 && (
                      <motion.div initial={{ left: '100%' }} animate={{ left: 0 }} transition={{ duration: 1.5, ease: 'linear' }} className={styles.packageWrapper}>
                        <Globe size={24} color="var(--success)" className={styles.packageIcon} />
                        <div className="data-package success-package">IP: {result}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className={styles.serverNodeContainer}>
                  <motion.div 
                    className={`node-icon ${styles.serverNodeIconBase} ${step >= 2 && step <= 3 ? styles.serverNodeIconActive : styles.serverNodeIconInactive}`} 
                    animate={{ scale: step === 2 ? [1, 1.05, 1] : 1 }} 
                    transition={{ repeat: step === 2 ? Infinity : 0, duration: 1 }}
                  >
                    <Server size={40} color={step >= 2 && step <= 3 ? '#ff6b00' : '#888'} />
                  </motion.div>
                  <div className={styles.serverNodeLabel}>SERVIDOR DNS</div>
                  <div className={styles.logsContainer} style={{ opacity: step >= 2 ? 1 : 0 }}>
                    {step >= 2 && (
                      <div className={`glass-panel mono ${styles.logsPanel}`}>
                        <div className={styles.logsTitle}>LOG DE RESOLUÇÃO</div>
                        {searchLogs.map((log, index) => <div key={index}>{log}</div>)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={`flex-center ${styles.formWrapper}`}>
                <div className={styles.inputGroup}>
                  <div className={styles.inputContainer}>
                    <input 
                      className={`input-404 ${styles.urlInput}`} 
                      placeholder="Ex: google.com" 
                      value={url} 
                      onChange={(e) => { setUrl(e.target.value); setStep(0); setResult(null); }} 
                      onKeyDown={handleKeyDown}
                      disabled={step > 0 && step < 4} 
                    />
                    <Globe size={22} className={styles.inputIcon} />
                  </div>
                  <button className={`btn-404 ${styles.submitBtn}`} onClick={handleLookup} disabled={(step > 0 && step < 4) || !url}>
                    {step > 0 && step < 4 ? 'BUSCANDO...' : 'TRADUZIR'}
                  </button>
                </div>

                {step === 4 && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <GlassPanel className={`${styles.resultPanel} ${isValidIp ? styles.resultPanelValid : styles.resultPanelInvalid}`}>
                      <div className={`mono ${styles.resultLabel}`}>RESULTADO:</div>
                      <div className={`${styles.resultIp} ${isValidIp ? styles.resultIpValid : styles.resultIpInvalid}`}>{result}</div>
                      {isValidIp && (
                        <button 
                          className={`btn-404 ${styles.accessBtn}`} 
                          onClick={() => window.open(`http://${result}`, '_blank')}
                        >
                          <ExternalLink size={20} /> ACESSAR IP DIRETAMENTE
                        </button>
                      )}
                    </GlassPanel>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="card-404"
            >
              <Quiz questions={dnsQuestions} onFinishQuiz={() => setShowQuiz(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DnsModule;