  import { useState, useEffect  } from 'react';
  import React from 'react';
  import { motion, AnimatePresence } from 'framer-motion';
  import { User, Send } from 'lucide-react'; 
  import ModuleIntro from '../../components/ModuleIntro';
  import LabHeader from '../../components/LabHeader';
  import Quiz from '../../components/Quiz';
  import DataPackage from '../../components/DataPackage';
  import Mascot from '../../components/Mascot';
  import Typewriter from '../../components/Typewriter';
  import styles from './HttpsModule.module.css';

  // Importações dos assets de imagens
  import httpsCadeadoOff from '../../labs/https_cadeado_off.png';
  import httpsCadeadoOn from '../../labs/https_cadeado_on.png';
  import httpsCarta from '../../labs/https_carta.png';
  import httpsHacker from '../../labs/https_hacker.png';
  import httpsIcon from '../../labs/https_icon.png';
  import httpsOff from '../../labs/https_off.png';
  import httpsOn from '../../labs/https_on.png';
  import allServer from '../../labs/all_server.png';

  import bonzi1 from '../../bonzi/bonzi_upscaled_0.png';
  import bonzi2 from '../../bonzi/bonzi_upscaled_1.png';
  import bonzi3 from '../../bonzi/bonzi_upscaled_3.png';

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

  const httpsQuestions = [
    {
      q: "1. Quando um site utiliza o HTTP, um hacker pode ler a mensagem que está sendo enviada. Por que isso acontece?",
      options: [
        "A. Porque o Hacker tem a senha do usuário que enviou a mensagem.",
        "B. Porque os dados estão sendo enviados em \"texto puro\" (HTTP), permitindo que qualquer pessoa no caminho leia o conteúdo.",
        "C. Porque o servidor de destino está desligado.",
        "D. Porque o HTTPS serve apenas para aumentar a velocidade da internet."
      ],
      correct: 1,
      why: "O HTTP não protege o conteúdo; os dados viajam de forma exposta, como se fosse uma carta escrita do lado de fora do envelope."
    },
    {
      q: "2. Ao utilizar o HTTPS um hacker ainda intercepta o dado, no entanto, ele aparece como um código ilegível. O que é esse processo?",
      options: [
        "A. Exclusão: o servidor deleta a mensagem do hacker assim que ele tenta ler.",
        "B. Compactação: o processo de diminuir o tamanho do arquivo para ele viajar mais rápido.",
        "C. Tradução: o HTTPS traduz o texto para outra língua automaticamente.",
        "D. Criptografia: o ato de transformar a informação em um código que só pode ser lido por quem tem a chave correta."
      ],
      correct: 3,
      why: "A criptografia garante a confidencialidade; mesmo que o dado seja capturado, ele permanece incompreensível para quem não possui a chave de decifração." 
    },
    {
      q: "3. Qual é a principal diferença visual que um usuário percebe em seu navegador ao acessar um site com HTTPS?",
      options: [
        "A. Uma marca d'água transparente de \"Conexão Segura\" que aparece no centro de todas as imagens do site.",
        "B. O navegador exibe uma barra de progresso azul constante para indicar que a criptografia está activa.",
        "C. O cursor do mouse muda para o formato de uma chave toda vez que você passa por cima de um formulário.",
        "D. A presença de um ícone de cadeado e o prefixo 'https://' na barra de endereços."
      ],
      correct: 3,
      why: "O cadeado fechado é o indicador padrão universal de que a comunicação entre o cliente e o servidor está devidamente protegida."
    }
  ];

  const HttpsModule = () => {
    const [showLab, setShowLab] = useState(false);
    const [input, setInput] = useState('');
    const [isHttpsOn, setIsHttpsOn] = useState(false);
    const [status, setStatus] = useState('IDLE');
    const [intercepting, setIntercepting] = useState(false);
    const [interceptedText, setInterceptedText] = useState('');
    const [receivedText, setReceivedText] = useState('');
    const [showQuiz, setShowQuiz] = useState(false);
    const [isButtonFlashing, setIsButtonFlashing] = useState(false);
    const [showCastor, setShowCastor] = useState(false);
    const [castorStep, setCastorStep] = useState(0);
    const [hasExplainedHttps, setHasExplainedHttps] = useState(false);
    const [quizFinished, setQuizFinished] = useState(false);
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
        setTimeout(() => {
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
      if (!input) return;
      setStatus('SENDING');
      setInterceptedText('');
      setReceivedText('');
      setIntercepting(false);

      const midWayTime = 1500; 
      const totalTime = 3000; 

      if (isHttpsOn) {
        try {
          const response = await fetch('/api/https-encrypt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: input })
          });
          const data = await response.json();
          
          setTimeout(() => {
            setIntercepting(true);
            
            setTimeout(() => {
              setInterceptedText(data.encrypted);
              setIntercepting(false);
            }, 500);
          }, midWayTime);

          setTimeout(() => {
            setReceivedText(input);
            setStatus('DONE');
            
            setCastorStep(1); 
            setShowCastor(true);
            setHasExplainedHttps(true);
          }, totalTime);
        } catch (err) {
          setStatus('DONE');
        }
      } else {
        setTimeout(() => {
          setIntercepting(true);
          
          setTimeout(() => {
            setInterceptedText(input); 
            setIntercepting(false);
            
            setCastorStep(2); 
            setShowCastor(true);
            setIsButtonFlashing(true); 
          }, 500);
        }, midWayTime);

        setTimeout(() => {
          setReceivedText(input);
          setStatus('DONE');
        }, totalTime);
      }
    };

    const handleNextCastor = () => {
      if (castorStep === 1) {
        setCastorStep(4);
        setQuizFocus(true);
        slowScrollTo(0, 1000);
      } else if (castorStep === 4) {
        setShowCastor(false);
        setQuizFocus(false);
      } else {
        setShowCastor(false);
      }
    };

    const handleKeyDown = (e) => { 
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSend();
      }
    };

    const resetLab = () => {
      setShowLab(false);
      setStatus('IDLE');
      setInput('');
      setShowQuiz(false);
      setHasExplainedHttps(false);
    };

    if (!showLab) {
      return (
        <ModuleIntro 
          title="HTTPS"
          color="var(--success)"
          icon={() => <img src={httpsCadeadoOn} alt="HTTPS Icon" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />}
          description="O cofre inquebrável que protege suas conversas."
          analogy="Mandar dados sem HTTPS é como mandar uma carta sem envelope: qualquer um no caminho pode ler. O HTTPS coloca seus dados dentro de um cofre blindado que só você e o site conseguem abrir."
          onStart={() => setShowLab(true)}
        >
          <div className={`flex-center ${styles.introAnimation}`}>
            <motion.div 
              animate={{ y: [0, -8, 0], rotate: [0, 2, -2, 0] }} 
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} 
              className={styles.introMail}
            >
              <img src={httpsCarta} alt="Carta" style={{ width: '65px', height: '65px', objectFit: 'contain' }} />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }} 
              animate={{ opacity: 1, scale: [1, 1.05, 1] }} 
              transition={{ delay: 0.5, scale: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } }} 
              className={styles.introLock}
            >
              <img src={httpsCadeadoOn} alt="Cadeado Seguro" style={{ width: '75px', height: '75px', objectFit: 'contain' }} />
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
            images={[bonzi1, bonzi2, bonzi3, bonzi1]}
            phrases={[
              /* 0 */ <Typewriter text="Olá! Bem-vindo ao simulador de HTTPS. Digite uma mensagem e clique em enviar para ver como os dados viajam pela rede!" speed={70} />,
              /* 1 */ <Typewriter text="Ótimo! Com HTTPS, a Criptografia embaralhou seus dados. Tornando difícil que um invasor roube-os!" speed={70} />,
              /* 2 */ <Typewriter text="CUIDADO! Como você usou HTTP, seus dados viajaram como 'texto puro'. Isso significa que o Hacker conseguiu ler tudo! Tente ativar o botão HTTPS para proteger sua mensagem." speed={70} />,
              /* 3 */ <Typewriter text="Excelente! Agora que estamos utilizando o protocolo seguro (HTTPS), seus dados serão protegidos por criptografia. Digite sua mensagem novamente." speed={70} />,
              /* 4 */ <Typewriter text="Excelente! Você entendeu como a Criptografia do HTTPS protege seus dados. Que tal testar seu conhecimento no Quiz?" speed={70} />
            ]}
            onNext={handleNextCastor}
            buttonLabels={["VAMOS LÁ_", "ENTENDI!_", "VOU ATIVAR!_", "ENTENDI!_", "BORA!_"]}
          /> 

          <AnimatePresence mode="wait">
           {!showQuiz ? (
            <motion.div 
              key="lab" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              className="card-404"
              style={{ padding: 0, overflow: 'hidden' }}
            >
              <div className={styles.searchBar}>
                <div className={styles.windowDots}>
                  <div className={`${styles.dot} ${styles.dotRed}`}></div>
                  <div className={`${styles.dot} ${styles.dotYellow}`}></div>
                  <div className={`${styles.dot} ${styles.dotGreen}`}></div>
                </div>
                <div className={`${styles.inputWrapper} ${isHttpsOn ? styles.inputWrapperSecure : styles.inputWrapperUnsecure}`}>
                  <img 
                    src={isHttpsOn ? httpsCadeadoOn : httpsCadeadoOff} 
                    alt="Status Conexão" 
                    style={{ width: '16px', height: '16px', marginRight: '0.5rem', objectFit: 'contain' }} 
                  />
                  <div className={styles.inputField}>
                    {isHttpsOn ? 'https://' : 'http://'}rota404.com.br
                  </div>
                </div>
                <div className={styles.statusBadge} style={{ color: isHttpsOn ? 'var(--success)' : 'var(--danger)' }}>
                  {isHttpsOn ? 'SEGURO' : 'INSEGURO'}
                </div>
              </div>

              <div style={{ padding: '2rem' }}>
                <h2 className="text-center lab-title" style={{ color: isHttpsOn ? 'var(--success)' : 'var(--danger)' }}>
                  SIMULADOR DE REDE ({isHttpsOn ? 'HTTPS' : 'HTTP'})
                </h2>

                <div className="animation-arena" style={{ marginBottom: '4rem', height: '300px', position: 'relative' }}>
                  <div className={`${styles.arenaLine} ${isHttpsOn ? styles.arenaLineHttps : styles.arenaLineHttp}`} />

                  {/* PACOTE DA LINHA PRINCIPAL (DA ESQUERDA PARA A DIREITA) */}
                  <AnimatePresence>
                    {status === 'SENDING' && (
                      <motion.div 
                        initial={{ left: '100px' }} 
                        animate={{ left: 'calc(100% - 130px)' }} 
                        transition={{ duration: 2.5, ease: "linear" }} 
                        style={{ position: 'absolute', top: '15px', zIndex: 5 }}
                      >
                        <DataPackage
                          icon={() => <img src={isHttpsOn ? httpsCadeadoOn : httpsCarta} alt="Data Type" style={{ width: '18px', height: '18px', objectFit: 'contain' }} />} 
                          type={isHttpsOn ? "success" : "danger"} 
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className={styles.arenaVerticalLine} />

                  {/* PACOTE DE INTERCEPTAÇÃO CAINDO PARA O HACKER */}
                  <AnimatePresence>
                    {intercepting && (
                      <motion.div 
                        initial={{ top: '15px', left: '50%', transform: 'translateX(-50%)' }} 
                        animate={{ top: '150px' }} 
                        transition={{ duration: 0.8, ease: "linear" }} 
                        style={{ position: 'absolute', zIndex: 4 }}
                      >
                        <DataPackage 
                          icon={() => <img src={isHttpsOn ? httpsCadeadoOn : httpsCarta} alt="Intercept Type" style={{ width: '18px', height: '18px', objectFit: 'contain' }} />} 
                          type={isHttpsOn ? "success" : "danger"} 
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ENVELOPE FLEXÍVEL DOS TRÊS ATORES */}
                  <div className={styles.actorContainer}>
                    
                    {/* 1. NÓ DO USUÁRIO (LADO ESQUERDO) */}
                    <div className={styles.nodeItem}>
                      <motion.div 
                        className={`node-icon ${styles.nodeIcon} ${styles.nodePrimary}`} 
                        style={{ 
                          overflow: 'hidden', 
                          padding: 0, 
                          background: 'rgba(0,0,0,0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        animate={{ y: [0, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
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
                      </motion.div>
                      <div className={styles.nodeLabel}>USUÁRIO</div>
                      
                      <div style={{ marginTop: '1rem' }}>
                        <button 
                          className={`btn-404 ${styles.toggleBtn} ${isHttpsOn ? styles.toggleBtnHttps : styles.toggleBtnHttp} ${isButtonFlashing ? styles.flashAnimation : ''}`} 
                          onClick={() => {
                            const newState = !isHttpsOn;
                            setIsHttpsOn(newState);
                            setIsButtonFlashing(false); 
                            
                            if (newState) { 
                              setCastorStep(3);
                              setShowCastor(true);
                            }
                          }} 
                          disabled={status === 'SENDING'}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <img 
                            src={isHttpsOn ? httpsOn : httpsOff} 
                            alt="Protocol Switch" 
                            style={{ width: '18px', height: '18px', objectFit: 'contain' }} 
                          />
                          {isHttpsOn ? 'HTTPS ON' : 'HTTPS OFF'}
                        </button>
                      </div>
                    </div>
                          
                    <div className={styles.hackerContainer}>
                      <motion.div 
                        className={styles.hackerIcon}
                        style={{ background: 'rgba(0, 0, 0, 0.2)', borderRadius: '50%', padding: '5px' }}
                        animate={{ y: [0, -4, 0], scale: [1, 1.02, 1] }}
                        transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                      >
                        <img src={httpsHacker} alt="Hacker Invasor" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                      </motion.div>
                      <div className="node-label" style={{ color: 'var(--danger)', marginBottom: '0.5rem' }}>HACKER</div>
                      <div className={`${styles.displayBox} ${styles.displayHacker}`}>
                        <span className={`mono ${styles.displayText} ${isHttpsOn && interceptedText ? styles.glitchText : ''}`} style={{ color: isHttpsOn ? 'var(--text-dim)' : 'var(--danger)' }}>
                          {interceptedText || 'Escutando rede...'}
                        </span>
                      </div>
                    </div>

                    <div className={styles.serverContainer}>
                      <motion.div 
                        className={`${styles.actorIcon} ${styles.actorIconServer}`} 
                        style={{ 
                          border: `2px solid ${isHttpsOn ? 'var(--success)' : '#888'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          padding: '6px', background: 'rgba(0,0,0,0.3)'
                        }}
                        animate={{ y: [0, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.3 }}
                      >
                        <img src={allServer} alt="Servidor Remoto" style={{ width: '40px', height: '100%', objectFit: 'contain' }} />
                      </motion.div>
                      <div className="node-label" style={{ color: isHttpsOn ? 'var(--success)' : '#888', marginBottom: '1rem' }}>DESTINO</div>
                      <div className={`${styles.displayBox} ${styles.displayServer}`}>
                        <span className={`mono ${styles.displayTextServer}`}>{receivedText || 'Aguardando...'}</span>
                      </div>
                    </div>

                  </div>
                </div> 

                <div className={`flex-center ${styles.formContainer}`}>
                  <input 
                    className={`input-404 ${styles.formInput}`} 
                    value={input} 
                    onChange={(e) => { setInput(e.target.value); setStatus('IDLE'); }} 
                    onKeyDown={handleKeyDown} 
                    placeholder="Digite uma mensagem secreta..." 
                    disabled={status === 'SENDING'} 
                  />
                  <button 
                    className={`btn-404 ${styles.formBtn} ${isHttpsOn ? styles.formBtnHttps : styles.formBtnHttp}`} 
                    onClick={handleSend} 
                    disabled={status === 'SENDING' || !input}
                  >
                    <Send size={18} /> {status === 'SENDING' ? 'ENVIANDO...' : 'ENVIAR'}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
              <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="card-404">
                <Quiz 
                  moduleId="https" 
                  questions={httpsQuestions} 
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

  export default HttpsModule;