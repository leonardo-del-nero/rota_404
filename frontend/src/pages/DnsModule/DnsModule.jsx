import { useState, useEffect  } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Server, Search, Contact, User, ExternalLink, Flame, ShieldAlert, Copy, Check, Landmark, Skull, AlertTriangle } from 'lucide-react';
import ModuleIntro from '../../components/ModuleIntro';
import LabHeader from '../../components/LabHeader';
import Quiz from '../../components/Quiz';
import GlassPanel from '../../components/GlassPanel';
import DataPackage from '../../components/DataPackage';
import Mascot from '../../components/Mascot';
import Typewriter from '../../components/Typewriter';
import styles from './DnsModule.module.css';

import bonzi1 from '../../bonzi/bonzi_upscaled_0.png';
import bonzi2 from '../../bonzi/bonzi_upscaled_1.png';
import bonzi3 from '../../bonzi/bonzi_upscaled_3.png';
import bonzi4 from '../../bonzi/bonzi_upscaled_2.png';

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
  const [step, setStep] = useState(0); 
  const [result, setResult] = useState(null);
  const [searchLogs, setSearchLogs] = useState([]);
  const [lookupHistory, setLookupHistory] = useState([]); // Added history
  const [showQuiz, setShowQuiz] = useState(false);

  const [showCastor, setShowCastor] = useState(false);
  const [castorStep, setCastorStep] = useState(0);

  const [hackerScene, setHackerScene] = useState('NONE'); 
  const [isHackerMascot, setIsHackerMascot] = useState(false);
  const [dnsStep, setDnsStep] = useState(0);

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

  const simulateDnsSearch = () => {
    const logs = (hackerScene === 'GLITCH' || hackerScene === 'POISONED' 
          ? ["> Analisando banco.com...", "> Redirecionando...", "> [!] Rota alterada"] 
          : ["> Analisando requisição...", "> Verificando cache local...", "> Registro encontrado!"]);
    setSearchLogs([]);
    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < logs.length) {
        setSearchLogs(prev => [...prev, logs[currentLog]]);
        currentLog++;
      } else { clearInterval(interval); }
    }, 600); 
  };

const handleLookup = async () => {
  if (!url) return;
  setStep(1);
  setResult(null);
  setSearchLogs([]);
  
  const isInputIp = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(url);
  const isValidUrlFormat = url.includes('.') && !isInputIp;

  setTimeout(() => {
    setStep(2);
    simulateDnsSearch();
    
    setTimeout(() => {
      setStep(3);
      setTimeout(() => {
        setStep(4);
        
        if ((hackerScene === 'GLITCH' || hackerScene === 'POISONED') && url.toLowerCase().includes('banco.com')) {
          setResult("66.66.66.66 (IP_MALICIOSO)"); 
          setHackerScene('POISONED'); 
          setIsHackerMascot(false); 
          setCastorStep(5); // Poisoning alert
          setShowCastor(true); 
          return;
        }

        if (dnsStep === 0) {
          if (!isValidUrlFormat || url.length < 3) { 
            setResult("IP_NÃO_ENCONTRADO"); 
            setCastorStep(1); // Not found
            setDnsStep(1);
            setShowCastor(true);
          } else {
            setResult("172.217.1.1"); 
            setDnsStep(1);
          }
          return;
        }

        if (dnsStep === 1) {
          if (isValidUrlFormat) {
            const mockIp = "142.250.190.46"; 
            setResult(mockIp); 
            
            setCastorStep(2); // Perfect lookup
            setShowCastor(true);
            setDnsStep(2);

            setTimeout(() => {
               setHackerScene('SHOW_ROUTES');
            }, 6000);
          } else {
            setResult("IP_NÃO_ENCONTRADO"); 
          }
          return;
        }

        const resVal = isInputIp ? url : (isValidUrlFormat ? "172.217.1.1" : "IP_NÃO_ENCONTRADO");
        setResult(resVal); 
        setLookupHistory(prev => {
          const entry = { url, result: resVal, time: new Date().toLocaleTimeString() };
          return [entry, ...prev].slice(0, 3);
        });
      }, 2500); 
    }, 3000); 
  }, 2500); 
};

  const handleNextCastor = () => {
    if (castorStep === 3) { // After "Something changed"
       setHackerScene('GLITCH');
       setIsHackerMascot(true);
       setCastorStep(4); // Hacker hi-jack
       return;
    }

    if (castorStep === 5) { // After poisoning alert
       setHackerScene('NONE');
    }

    setShowCastor(false);
  };

  useEffect(() => {
    if (hackerScene === 'SHOW_ROUTES') {
      setCastorStep(3); // Strange routes
      setShowCastor(true);
    }
  }, [hackerScene]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleLookup(); }
  };

  const resetLab = () => {
    setShowLab(false); setStep(0); setResult(null); setUrl(''); 
    setSearchLogs([]); setShowCastor(false); setHackerScene('NONE'); setIsHackerMascot(false);
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }} style={{ position: 'relative' }}>
            <Contact size={80} color="#ff6b00" style={{ filter: 'drop-shadow(0 0 10px rgba(255,107,0,0.5))' }} />
            <motion.div animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }} transition={{ repeat: Infinity, duration: 3 }} style={{ position: 'absolute', top: -20, right: -20 }}>
              <Search size={30} color="white" />
            </motion.div>
          </motion.div>
          <div style={{ fontSize: '2rem', color: '#444' }}>➔</div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 2 }} className="mono" style={{ fontSize: '1.5rem', color: '#00ff88', border: '1px solid #00ff8833', padding: '1rem', borderRadius: '8px', boxShadow: '0 0 20px rgba(0,255,136,0.2)', background: 'rgba(0,255,136,0.05)' }}>
            142.250.190.46
          </motion.div>
        </div>
      </ModuleIntro>
    );
  }

  const isValidIpResult = result && result !== 'IP_NÃO_ENCONTRADO' && result !== 'ERRO_CONEXÃO';

  return (
    <div className="container module-container">
      <LabHeader showQuiz={showQuiz} setShowQuiz={setShowQuiz} onResetLab={resetLab} />

      <div className="content-max-width" style={{ position: 'relative' }}>
        
        <div style={{ position: 'relative', zIndex: 10 }}>
          <Mascot 
            show={showCastor}
            step={castorStep}
            images={[bonzi1, bonzi3, bonzi1, bonzi1, bonzi4, bonzi1]} 
            phrases={[
              /* 0 */ <Typewriter text="Olá! Bem-vindo ao laboratório de DNS. Tente digitar qualquer palavra aleatória (sem ser um site real) para ver como o tradutor reage quando não encontra um endereço!" speed={70} />, 
              /* 1 */ <Typewriter text="Viu só? Como essa URL não existe, o DNS não encontrou nenhum IP. Agora, tente pesquisar um site real como 'google.com'!" speed={70} />,
              /* 2 */ <Typewriter text="Perfeito! O DNS encontrou o IP correspondente e agora o navegador sabe exatamente para onde ir. Continue observando..." speed={70} />,
              /* 3 */ <Typewriter text="Que estranho... sinto que algo mudou no sistema. Olhe aquelas novas rotas ali embaixo..." speed={70} />,
              /* 4 */ <Typewriter text="HA-HA! Esqueça o castor bobinho. Digite 'banco.com' na busca. Eu preparei um caminho especial para você!" speed={70} />,
              /* 5 */ <Typewriter text="CUIDADO! O DNS foi envenenado! O hacker trocou o endereço do banco por um IP falso (Poisoning). Agora tudo foi limpo, pode continuar!" speed={70} />,
            ]}
            onNext={handleNextCastor}
            buttonLabels={["VAMOS LÁ_", "ENTENDI_", "OK!_", "COMO ASSIM?_", "TESTAR BANCO", "FINALIZAR"]}
            isHacker={isHackerMascot} 
          />
        </div>

        <AnimatePresence mode="wait">
          {!showQuiz ? (
            <motion.div key="lab" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card-404">
              <div className="text-center mb-4">
                <h2 className={styles.labTitle}>LABORATÓRIO DE DNS</h2>
              </div>

              <div className={styles.arenaContainer}>
                <div className={styles.nodeContainer}>
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
                </div>

                <div className={styles.connectionLine}>
                  <AnimatePresence>
                    {step === 1 && <motion.div initial={{ left: 0 }} animate={{ left: '100%' }} transition={{ duration: 4 }} className={styles.packageWrapper}><DataPackage text={url} icon={Search} type="primary" /></motion.div>}
                    {step === 3 && <motion.div initial={{ left: '100%' }} animate={{ left: 0 }} transition={{ duration: 4 }} className={styles.packageWrapper}><DataPackage text={result} icon={Globe} type={result?.includes('MALICIOSO') ? "danger" : "success"} /></motion.div>}
                  </AnimatePresence>
                </div>

                <div className={styles.serverNodeContainer}>
                  <motion.div 
                    className={`node-icon ${step >= 2 ? styles.serverNodeIconActive : styles.serverNodeIconInactive}`}
                    animate={{ scale: step === 2 ? [1, 1.05, 1] : 1 }}
                    transition={{ repeat: step === 2 ? Infinity : 0, duration: 2 }}
                  >
                    <Server size={40} color={step >= 2 ? '#ff6b00' : '#888'} />
                  </motion.div>
                  <div className={styles.serverNodeLabel}>SERVIDOR DNS</div>
                  
                  <div className={styles.logsContainer} style={{ opacity: (step >= 2 || hackerScene !== 'NONE') ? 1 : 0 }}>
                    {(step >= 2 || hackerScene !== 'NONE') && (
                      <div className={`glass-panel mono ${styles.logsPanel}`} style={{ position: 'relative' }}>
                        
                        <div style={{ opacity: (searchLogs.length > 0 || step === 2) ? 1 : 0, transition: 'opacity 0.2s' }}>
                          <div className={styles.logsTitle}>LOG DE RESOLUÇÃO</div>
                          {searchLogs.map((log, index) => <div key={index}>{log}</div>)}
                        </div>

                        <AnimatePresence>
                          {hackerScene !== 'NONE' && (
                            <div className={styles.poisonRoutesWrapper}>
                              <svg width="400" height="200" viewBox="0 0 400 200" className={styles.poisonSvg}>
                                <motion.path
                                  d="M 400 100 L 200 100"
                                  stroke="rgba(255, 107, 0, 0.6)"
                                  strokeWidth="3"
                                  strokeDasharray="8,8" 
                                  initial={{ pathLength: 0 }}
                                  animate={{ pathLength: 1 }}
                                  transition={{ duration: 3}}
                                />
                                <motion.path
                                  d="M 200 100 L 200 40 L 60 40" 
                                  stroke="rgba(255, 107, 0, 0.6)"
                                  strokeWidth="3"
                                  strokeDasharray="8,8" 
                                  initial={{ pathLength: 0 }}
                                  animate={{ pathLength: 1 }}
                                  transition={{ duration: 4, delay: 3 }}
                                />
                                <motion.path
                                  d="M 200 100 L 200 160 L 60 160"
                                  stroke="rgba(255, 107, 0, 0.6)"
                                  strokeWidth="3"
                                  strokeDasharray="8,8" 
                                  initial={{ pathLength: 0 }}
                                  animate={{ pathLength: 1 }}
                                  transition={{ duration: 4, delay: 3}}
                                />
                              </svg>

                              <div className={styles.destinationNodesY}>
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0 }} 
                                  animate={{ opacity: 1, scale: 1 }} 
                                  transition={{ delay: 7 }}
                                  className={styles.miniIconNode}
                                  style={{ top: '15px', left: '0' }}
                                >
                                  <Landmark size={28} color="#00ff88" />
                                </motion.div>

                                <motion.div 
                                  initial={{ opacity: 0, scale: 0 }} 
                                  animate={{ opacity: 1, scale: 1 }} 
                                  transition={{ delay: 7 }}
                                  className={`${styles.miniIconNode} ${hackerScene === 'POISONED' ? styles.glitchAlert : ''}`}
                                  style={{ top: '135px', left: '0' }}
                                >
                                  <Skull size={28} color="#ff3b3b" />
                                </motion.div>
                              </div>
                            </div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={`flex-center ${styles.formWrapper}`}>
                <div className={styles.inputGroup}>
                  <div className={styles.inputContainer}>
                    <input className={`input-404 ${styles.urlInput}`} placeholder="Ex: google.com" value={url} onChange={(e) => { setUrl(e.target.value); setStep(0); setResult(null); }} onKeyDown={handleKeyDown} disabled={step > 0 && step < 4} />
                    <Globe size={22} className={styles.inputIcon} />
                  </div>
                  <button className={`btn-404 ${styles.submitBtn}`} onClick={handleLookup} disabled={(step > 0 && step < 4) || !url}>TRADUZIR</button>
                </div>
                
                {/* Usability Improvement: Suggested URLs */}
                <div className={styles.suggestions}>
                  <span>Sugestões: </span>
                  {['google.com', 'banco.com', 'site-falso'].map(s => (
                    <button key={s} className={styles.suggestionBtn} onClick={() => { setUrl(s); setStep(0); setResult(null); }}>
                      {s}
                    </button>
                  ))}
                </div>

                {step === 4 && result && (
                  <GlassPanel className={`${styles.resultPanel} ${isValidIpResult ? styles.resultPanelValid : styles.resultPanelInvalid}`}>
                    <div className={`mono ${styles.resultLabel}`}>RESULTADO:</div>
                    <div className={`${styles.resultIp} ${isValidIpResult ? styles.resultIpValid : styles.resultIpInvalid}`}>{result}</div>
                  </GlassPanel>
                )}

                {lookupHistory.length > 0 && (
                  <div className={styles.historySection}>
                    <div className={styles.historyTitle}>HISTÓRICO RECENTE</div>
                    <div className={styles.historyList}>
                      {lookupHistory.map((h, i) => (
                        <div key={i} className={styles.historyItem}>
                          <span className={styles.historyUrl}>{h.url}</span>
                          <span className={styles.historyArrow}>→</span>
                          <span className={styles.historyResult}>{h.result}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <Quiz moduleId="dns" questions={dnsQuestions} onFinishQuiz={() => setShowQuiz(false)} />
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default DnsModule;