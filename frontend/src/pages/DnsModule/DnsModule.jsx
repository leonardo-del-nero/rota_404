import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Server, Search, Contact, User, ExternalLink, Flame, ShieldAlert, Copy, Check, Landmark, Skull, AlertTriangle } from 'lucide-react';
import ModuleIntro from '../../components/ModuleIntro';
import LabHeader from '../../components/LabHeader';
import Quiz from '../../components/Quiz';
import GlassPanel from '../../components/GlassPanel';
import DataPackage from '../../components/DataPackage';
import Mascot from '../../components/Mascot';
import styles from './DnsModule.module.css';

import cp1 from '../../assets/cp1.png';
import cp2 from '../../assets/cp2.png';
import cp6 from '../../assets/cp6.png';
import cp4 from '../../assets/cp4.png';

const Typewriter = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    let i = 0; setDisplayedText('');
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++; if (i >= text.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [text]);
  return <span>{displayedText}</span>;
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
  const [showQuiz, setShowQuiz] = useState(false);

  const [isServerOffline, setIsServerOffline] = useState(false);
  const [showFirePopup, setShowFirePopup] = useState(false);
  const [lastValidIp, setLastValidIp] = useState('');
  const [showCastor, setShowCastor] = useState(false);
  const [castorStep, setCastorStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [hasTestedIp, setHasTestedIp] = useState(false);
  const [hasTestedUrl, setHasTestedUrl] = useState(false);

  const [hackerScene, setHackerScene] = useState('NONE'); 
  const [isHackerMascot, setIsHackerMascot] = useState(false);
  const [dnsStep, setDnsStep] = useState(0);

  useEffect(() => {
    if (showLab && dnsStep === 0) {
      setCastorStep(8);
      setShowCastor(true);
    }
  }, [showLab]);

  const simulateDnsSearch = () => {
    const logs = isServerOffline 
      ? ["> Conectando ao servidor...", "> Erro: DNS_PROBE_FINISHED_NXDOMAIN", "> SERVIDOR OFFLINE"]
      : (hackerScene === 'GLITCH' || hackerScene === 'POISONED' 
          ? ["> Analisando banco.com...", "> Redirecionando...", "> [!] Rota alterada"] 
          : ["> Analisando requisição...", "> Verificando cache local...", "> Registro encontrado!"]);
    setSearchLogs([]);
    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < logs.length) {
        setSearchLogs(prev => [...prev, logs[currentLog]]);
        currentLog++;
      } else { clearInterval(interval); }
    }, 400);
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
          setCastorStep(7); 
          setShowCastor(true); 
          return;
        }

        if (!isServerOffline && hackerScene === 'NONE' && dnsStep === 0) {
          if (!isValidUrlFormat || url.length < 3) { 
            setResult("IP_NÃO_ENCONTRADO"); 
            setCastorStep(9); 
            setDnsStep(1);
            setShowCastor(true);
          } else {
            setResult("172.217.1.1"); 
          }
          return;
        }

        if (!isServerOffline && hackerScene === 'NONE' && dnsStep === 1) {
          if (isValidUrlFormat) {
            const mockIp = "142.250.190.46"; 
            setResult(mockIp); 
            setLastValidIp(mockIp); 
            
            setCastorStep(10);
            setShowCastor(true);
            
            setTimeout(() => {
              setShowFirePopup(true); 
              setCastorStep(0); 
              setDnsStep(2); 
            }, 4000);
          } else {
            setResult("IP_NÃO_ENCONTRADO"); 
          }
          return;
        }

        if (isServerOffline) {
          if (isInputIp) {
            setResult(url); 
            setHasTestedIp(true); 
            setCastorStep(hasTestedUrl ? 2 : 1); 
            setShowCastor(true); 
          } else {
            setResult('IP_NÃO_ENCONTRADO'); 
            setHasTestedUrl(true); 
            setCastorStep(hasTestedIp ? 4 : 3); 
            setShowCastor(true); 
          }
        } else {
          setResult(isInputIp ? url : (isValidUrlFormat ? "172.217.1.1" : "IP_NÃO_ENCONTRADO")); 
        }
      }, 1500);
    }, 2000);
  }, 1500);
};

  const handleNextCastor = () => {
    if (hasTestedIp && hasTestedUrl) {
      setTimeout(() => {
        setIsServerOffline(false);
        setHasTestedIp(false);
        setHasTestedUrl(false);
        setTimeout(() => setHackerScene('SHOW_ROUTES'), 2000);
      }, 1000);
    }

    if (castorStep === 5) { 
       setHackerScene('GLITCH');
       setIsHackerMascot(true);
       setCastorStep(6);
       return;
    }

    if (castorStep === 7) { 
       setHackerScene('NONE');
    }

    setShowCastor(false);
  };

  useEffect(() => {
    if (hackerScene === 'SHOW_ROUTES') {
      setCastorStep(5);
      setShowCastor(true);
    }
  }, [hackerScene]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleLookup(); }
  };

  const handleCopyIp = () => {
    navigator.clipboard.writeText(lastValidIp);
    setCopied(true);
    
    setTimeout(() => {
      setShowFirePopup(false);
      setIsServerOffline(true);
      setCopied(false);
      
      setCastorStep(11); 
      setShowCastor(true);
    }, 1000);
  };

  const resetLab = () => {
    setShowLab(false); setStep(0); setResult(null); setUrl(''); 
    setSearchLogs([]); setIsServerOffline(false); setHasTestedIp(false); setHasTestedUrl(false);
    setShowCastor(false); setHackerScene('NONE'); setIsHackerMascot(false);
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
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }} style={{ position: 'relative' }}>
            <Contact size={80} color="#ff6b00" style={{ filter: 'drop-shadow(0 0 10px rgba(255,107,0,0.5))' }} />
            <motion.div animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }} transition={{ repeat: Infinity, duration: 2 }} style={{ position: 'absolute', top: -20, right: -20 }}>
              <Search size={30} color="white" />
            </motion.div>
          </motion.div>
          <div style={{ fontSize: '2rem', color: '#444' }}>➔</div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="mono" style={{ fontSize: '1.5rem', color: '#00ff88', border: '1px solid #00ff8833', padding: '1rem', borderRadius: '8px', boxShadow: '0 0 20px rgba(0,255,136,0.2)', background: 'rgba(0,255,136,0.05)' }}>
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
        
        <div style={{ position: 'relative', zIndex: showFirePopup ? 1001 : 10 }}>
          <Mascot 
            show={showCastor}
            step={castorStep}
            images={[cp6, cp2, cp1, cp6, cp1, cp2, cp4, cp1, cp1, cp6, cp2, cp6]} 
            phrases={[
              /* 0 */ <Typewriter text="OH NÃO! O servidor DNS acabou de cair e tudo está pegando fogo! Copie o IP do site agora para não perder o acesso!" />,
              /* 1 */ <Typewriter text="Viu só? O endereço IP funcionou! Como você usou o número direto, não precisamos do tradutor DNS. Agora tente digitar a URL para ver como o sistema falha!" />,
              /* 2 */ <Typewriter text="Excelente! O IP funcionou e você recuperou o acesso. Agora, espere o servidor voltar ao normal!" />,
              /* 3 */ <Typewriter text="Não funcionou! Sem o DNS (o tradutor) ativo, o nome do site não serve de nada. Tente usar o IP que você copiou!" />,
              /* 4 */ <Typewriter text="Exatamente como eu disse! Nomes não funcionam sem o tradutor DNS ativo. Espere alguns segundos enquanto restauro o sistema..." />,
              /* 5 */ <Typewriter text="Que estranho... o servidor voltou, mas sinto que algo mudou no sistema. Olhe aquelas novas rotas ali embaixo..." />,
              /* 6 */ <Typewriter text="HA-HA! Esqueça o castor bobinho. Digite 'banco.com' na busca. Eu preparei um caminho especial para você!" />,
              /* 7 */ <Typewriter text="CUIDADO! O DNS foi envenenado! O hacker trocou o endereço do banco por um IP falso (Poisoning). Agora tudo foi limpo, pode continuar!" />,
              /* 8 */ <Typewriter text="Olá! Bem-vindo ao laboratório de DNS. Tente digitar qualquer palavra aleatória (sem ser um site real) para ver como o tradutor reage quando não encontra um endereço!" />, 
              /* 9 */ <Typewriter text="Viu só? Como essa URL não existe, o DNS não encontrou nenhum IP. Agora, tente pesquisar um site real que você conheça!" />,
              /* 10 */ <Typewriter text="Perfeito! O DNS encontrou o IP correspondente e agora o navegador sabe exatamente para onde ir. Continue observando..." />,
              /* 11 */ <Typewriter text="Agora que você tem o IP salvo, tente fazer algumas pesquisas!" /> 
            ]}
            onNext={handleNextCastor}
            buttonLabels={["COPIAR IP", "TESTAR URL", "CONTINUAR", "USAR IP", "CONTINUAR", "QUÊ?", "TESTAR BANCO", "FINALIZAR"]}
            isHacker={isHackerMascot} 
          />
        </div>

        <AnimatePresence>
          {showFirePopup && (
            <div className={styles.fireOverlayBackdrop} style={{ position: 'fixed', inset: 0, zIndex: 999 }}>
              <motion.div initial={{ scale: 0.8, opacity: 0, x: "-50%", y: "-50%" }} animate={{ scale: 1, opacity: 1, x: "-50%", y: "-50%" }} exit={{ scale: 0.8, opacity: 0, x: "-50%", y: "-50%" }} className={styles.firePopup} style={{ position: 'fixed', top: '50%', left: '50%', zIndex: 1001, margin: 0 }}>
                <div className={styles.fireIconContainer}><Flame size={50} className={styles.flameAnimate} /></div>
                <h3>ALERTA DE QUEDA!</h3>
                <p>O servidor DNS falhou. Use o IP para navegar:</p>
                <div className={styles.ipBox}>
                  <code>{lastValidIp}</code>
                  <button onClick={handleCopyIp}>{copied ? <Check color="var(--success)" /> : <Copy size={20} />}</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!showQuiz ? (
            <motion.div key="lab" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card-404">
              <div className="text-center mb-4">
                <h2 className={styles.labTitle}>LABORATÓRIO DE DNS</h2>
              </div>

              <div className={styles.arenaContainer}>
                <div className={styles.nodeContainer}>
                  <div className={`node-icon ${styles.userNodeIcon}`}><User size={40} color="#ff6b00" /></div>
                  <div className={styles.nodeLabel}>USUÁRIO</div>
                </div>

                <div className={styles.connectionLine}>
                  <AnimatePresence>
                    {step === 1 && <motion.div initial={{ left: 0 }} animate={{ left: '100%' }} transition={{ duration: 1.5 }} className={styles.packageWrapper}><DataPackage text={url} icon={Search} type="primary" /></motion.div>}
                    {step === 3 && <motion.div initial={{ left: '100%' }} animate={{ left: 0 }} transition={{ duration: 1.5 }} className={styles.packageWrapper}><DataPackage text={result} icon={Globe} type={result?.includes('MALICIOSO') ? "danger" : "success"} /></motion.div>}
                  </AnimatePresence>
                </div>

                <div className={styles.serverNodeContainer}>
                  <motion.div 
                    className={`node-icon ${isServerOffline ? styles.serverOffline : (step >= 2 ? styles.serverNodeIconActive : styles.serverNodeIconInactive)}`}
                    animate={{ scale: step === 2 ? [1, 1.05, 1] : 1 }}
                    transition={{ repeat: step === 2 ? Infinity : 0, duration: 1 }}
                  >
                    {isServerOffline ? <ShieldAlert size={40} color="var(--danger)" /> : <Server size={40} color={step >= 2 ? '#ff6b00' : '#888'} />}
                  </motion.div>
                  <div className={styles.serverNodeLabel}>{isServerOffline ? "OFFLINE" : "SERVIDOR DNS"}</div>
                  
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
                                  transition={{ duration: 1.2}}
                                />
                                <motion.path
                                  d="M 200 100 L 200 40 L 60 40" 
                                  stroke="rgba(255, 107, 0, 0.6)"
                                  strokeWidth="3"
                                  strokeDasharray="8,8" 
                                  initial={{ pathLength: 0 }}
                                  animate={{ pathLength: 1 }}
                                  transition={{ duration: 1.5, delay: 1.2 }}
                                />
                                <motion.path
                                  d="M 200 100 L 200 160 L 60 160"
                                  stroke="rgba(255, 107, 0, 0.6)"
                                  strokeWidth="3"
                                  strokeDasharray="8,8" 
                                  initial={{ pathLength: 0 }}
                                  animate={{ pathLength: 1 }}
                                  transition={{ duration: 1.5, delay: 1.2}}
                                />
                              </svg>

                              <div className={styles.destinationNodesY}>
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0 }} 
                                  animate={{ opacity: 1, scale: 1 }} 
                                  transition={{ delay: 2.7 }}
                                  className={styles.miniIconNode}
                                  style={{ top: '15px', left: '0' }}
                                >
                                  <Landmark size={28} color="#00ff88" />
                                </motion.div>

                                <motion.div 
                                  initial={{ opacity: 0, scale: 0 }} 
                                  animate={{ opacity: 1, scale: 1 }} 
                                  transition={{ delay: 2.7 }}
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

                {step === 4 && result && (
                  <GlassPanel className={`${styles.resultPanel} ${isValidIpResult ? styles.resultPanelValid : styles.resultPanelInvalid}`}>
                    <div className={`mono ${styles.resultLabel}`}>RESULTADO:</div>
                    <div className={`${styles.resultIp} ${isValidIpResult ? styles.resultIpValid : styles.resultIpInvalid}`}>{result}</div>
                  </GlassPanel>
                )}
              </div>
            </motion.div>
          ) : (
            <Quiz moduleId="dns" questions={[]} onFinishQuiz={() => setShowQuiz(false)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DnsModule;