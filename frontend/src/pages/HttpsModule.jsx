import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Home, RefreshCcw, Mail, Server, User, Terminal, Send, ShieldAlert } from 'lucide-react';
import ModuleIntro from '../components/ModuleIntro';

const HttpsModule = () => {
  const [showLab, setShowLab] = useState(false);
  const [input, setInput] = useState('');
  const [isHttpsOn, setIsHttpsOn] = useState(false);
  const [status, setStatus] = useState('IDLE'); // IDLE, SENDING, DONE
  
  const [intercepting, setIntercepting] = useState(false);
  const [interceptedText, setInterceptedText] = useState('');
  const [receivedText, setReceivedText] = useState('');

  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);

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
        "B. O navegador exibe uma barra de progresso azul constante para indicar que a criptografia está ativa.",
        "C. O cursor do mouse muda para o formato de uma chave toda vez que você passa por cima de um formulário.",
        "D. A presença de um ícone de cadeado e o prefixo 'https://' na barra de endereços."
      ],
      correct: 3,
      why: "O cadeado fechado é o indicador padrão universal de que a comunicação entre o cliente e o servidor está devidamente protegida."
    }
  ];


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
        
        // Mid-way (hacker intercepts)
        setTimeout(() => {
          setIntercepting(true);
          setTimeout(() => {
            setInterceptedText(data.encrypted);
            setIntercepting(false);
          }, 1000);
        }, midWayTime);

        // Arrives at destination
        setTimeout(() => {
          setReceivedText(input); // Server decrypts it
          setStatus('DONE');
        }, totalTime);

      } catch (err) {
        setStatus('DONE');
      }
    } else {
      // Plain text HTTP
      // Mid-way (hacker intercepts)
      setTimeout(() => {
        setIntercepting(true);
        setTimeout(() => {
          setInterceptedText(input);
          setIntercepting(false);
        }, 1000);
      }, midWayTime);

      // Arrives at destination
      setTimeout(() => {
        setReceivedText(input);
        setStatus('DONE');
      }, totalTime);
    }
  };

  if (!showLab) {
    return (
      <ModuleIntro 
        title="HTTPS"
        color="#00ff88"
        icon={Lock}
        description="O cofre inquebrável que protege suas conversas."
        analogy="Mandar dados sem HTTPS é como mandar uma carta sem envelope: qualquer um no caminho pode ler. O HTTPS coloca seus dados dentro de um cofre blindado que só você e o site conseguem abrir."
        onStart={() => setShowLab(true)}
      >
        <div style={{ position: 'relative', width: '200px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div animate={{ x: [-100, 0], opacity: [0, 1] }} transition={{ duration: 1 }} style={{ position: 'absolute', color: 'var(--text-dim)' }}>
            <Mail size={50} />
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 2 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1, duration: 0.5, type: 'spring' }} style={{ zIndex: 2, color: '#00ff88', background: 'var(--bg-main)', padding: '10px', borderRadius: '50%' }}>
            <Lock size={60} />
          </motion.div>
        </div>
      </ModuleIntro>
    );
  }

  return (
    <div className="container" style={{ padding: '4rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" className="btn-404" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <Home size={16} /> VOLTAR AO HUB
          </Link>
          <button className="btn-404 btn-outline" onClick={() => { setShowLab(false); setStatus('IDLE'); setInput(''); setShowQuiz(false); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCcw size={16} /> REVER INTRO
          </button>
        </div>

        <button 
          className="btn-404" 
          onClick={() => setShowQuiz(!showQuiz)}
          style={{ background: showQuiz ? '#fff' : '#ffcc00', color: '#000', border: 'none' }}
        >
          {showQuiz ? "VOLTAR AO LABORATÓRIO" : "REALIZAR QUIZ"}
        </button>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          {!showQuiz ? (
            /* --- TELA DO LABORATÓRIO (SEU CÓDIGO ORIGINAL) --- */
            <motion.div 
              key="lab"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="card-404" style={{ padding: '3rem', position: 'relative' }}
            >
              <h2 style={{ color: isHttpsOn ? '#00ff88' : 'var(--danger)', textAlign: 'center', marginBottom: '3rem' }}>
                SIMULADOR DE REDE ({isHttpsOn ? 'HTTPS' : 'HTTP'})
              </h2>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4rem', padding: '0 2rem', position: 'relative', height: '300px' }}>
                <div style={{ position: 'absolute', top: '40px', left: '100px', right: '100px', height: '2px', background: isHttpsOn ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 59, 59, 0.2)', zIndex: 0 }} />

                <AnimatePresence>
                  {status === 'SENDING' && (
                    <motion.div initial={{ left: '100px' }} animate={{ left: 'calc(100% - 130px)' }} transition={{ duration: 3, ease: "linear" }} style={{ position: 'absolute', top: '15px', zIndex: 5 }}>
                      <div style={{ background: isHttpsOn ? '#000' : '#fff', border: `2px solid ${isHttpsOn ? '#00ff88' : '#333'}`, padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isHttpsOn ? <Lock size={20} color="#00ff88" /> : <Mail size={20} color="#333" />}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div style={{ position: 'absolute', top: '40px', left: '50%', width: '2px', height: '160px', background: 'rgba(255,59,59,0.3)', borderLeft: '2px dashed rgba(255,59,59,0.3)' }} />

                <AnimatePresence>
                  {intercepting && (
                    <motion.div initial={{ top: '15px', left: '50%', transform: 'translateX(-50%)' }} animate={{ top: '150px' }} transition={{ duration: 1, ease: "linear" }} style={{ position: 'absolute', zIndex: 4 }}>
                      <div style={{ background: isHttpsOn ? '#000' : '#fff', border: `2px solid ${isHttpsOn ? '#00ff88' : '#333'}`, padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isHttpsOn ? <Lock size={20} color="#00ff88" /> : <Mail size={20} color="#333" />}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '80px', height: '80px', background: 'var(--bg-accent)', borderRadius: '50%', border: `2px solid ${isHttpsOn ? '#00ff88' : '#888'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <User size={40} color={isHttpsOn ? "#00ff88" : "#888"} />
                  </div>
                  <div className="mono" style={{ fontSize: '0.8rem', color: isHttpsOn ? '#00ff88' : '#888' }}>USUÁRIO</div>
                  <div style={{ marginTop: '1rem' }}>
                    <button className="btn-404" onClick={() => setIsHttpsOn(!isHttpsOn)} style={{ background: isHttpsOn ? '#00ff88' : 'transparent', color: isHttpsOn ? '#000' : '#888', border: `1px solid ${isHttpsOn ? '#00ff88' : '#888'}`, padding: '0.5rem 1rem', fontSize: '0.8rem' }} disabled={status === 'SENDING'}>
                      {isHttpsOn ? <><Lock size={14} style={{ marginRight: '5px' }}/> HTTPS ON</> : <><Unlock size={14} style={{ marginRight: '5px' }}/> HTTPS OFF</>}
                    </button>
                  </div>
                </div>

                <div style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '250px' }}>
                  <div style={{ width: '60px', height: '60px', background: '#220000', borderRadius: '12px', border: '2px solid #ff3b3b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                    <Terminal size={30} color="#ff3b3b" />
                  </div>
                  <div className="mono" style={{ fontSize: '0.8rem', color: '#ff3b3b', marginBottom: '0.5rem' }}>HACKER</div>
                  <div style={{ width: '100%', height: '60px', background: '#000', border: '1px solid #ff3b3b55', borderRadius: '4px', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <span className="mono" style={{ fontSize: '0.7rem', color: isHttpsOn ? 'var(--text-dim)' : '#ff3b3b', wordBreak: 'break-all', textAlign: 'center' }}>
                      {interceptedText || 'Escutando rede...'}
                    </span>
                  </div>
                </div>

                <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '200px' }}>
                  <div style={{ width: '80px', height: '80px', background: 'var(--bg-accent)', borderRadius: '12px', border: `2px solid ${isHttpsOn ? '#00ff88' : '#888'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Server size={40} color={isHttpsOn ? "#00ff88" : "#888"} />
                  </div>
                  <div className="mono" style={{ fontSize: '0.8rem', color: isHttpsOn ? '#00ff88' : '#888', marginBottom: '1rem' }}>DESTINO</div>
                  <div style={{ width: '100%', height: '60px', background: '#000', border: '1px solid #333', borderRadius: '4px', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <span className="mono" style={{ fontSize: '0.8rem', color: '#fff', wordBreak: 'break-all', textAlign: 'center' }}>{receivedText || 'Aguardando...'}</span>
                  </div>
                </div>
              </div>

              <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', gap: '1rem' }}>
                <input className="input-404" value={input} onChange={(e) => { setInput(e.target.value); setStatus('IDLE'); }} placeholder="Digite uma mensagem secreta..." disabled={status === 'SENDING'} style={{ flex: 1 }} />
                <button className="btn-404" onClick={handleSend} disabled={status === 'SENDING' || !input} style={{ background: isHttpsOn ? '#00ff88' : '#fff', color: '#000' }}>
                  <Send size={18} /> {status === 'SENDING' ? 'ENVIANDO...' : 'ENVIAR'}
                </button>
              </div>
            </motion.div>
          ) : (
            /* --- TELA DO QUIZ --- */
            <motion.div 
              key="quiz"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="card-404" style={{ padding: '3rem' }}
            >
              {!quizFinished ? (
                <>
                  <div className="mono" style={{ color: '#ffcc00', marginBottom: '1rem', letterSpacing: '2px' }}>QUESTÃO {currentQuestion + 1} / {httpsQuestions.length}</div>
                  <h3 style={{ marginBottom: '2rem', color: '#ffffff', fontSize: '1.4rem' }}>{httpsQuestions[currentQuestion].q}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {httpsQuestions[currentQuestion].options.map((opt, idx) => (
                      <button 
                        key={idx} className="glass-panel" 
                        onClick={() => setSelectedAnswers({...selectedAnswers, [currentQuestion]: idx})}
                        style={{ 
                          textAlign: 'left', padding: '1.2rem', 
                          border: selectedAnswers[currentQuestion] === idx ? '1px solid #ffcc00' : '1px solid rgba(255,255,255,0.1)',
                          background: selectedAnswers[currentQuestion] === idx ? 'rgba(0,255,136,0.1)' : 'rgba(0,0,0,0.2)',
                          color: '#fff', cursor: 'pointer', transition: 'all 0.2s ease',
                          fontFamily: 'var(--font-mono), monospace', fontSize: '0.95rem', letterSpacing: '0.5px', lineHeight: '1.4'
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {selectedAnswers[currentQuestion] !== undefined && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '4px', background: 'rgba(255,255,255,0.03)', borderLeft: `4px solid ${selectedAnswers[currentQuestion] === httpsQuestions[currentQuestion].correct ? '#00ff88' : '#ff3b3b'}` }}>
                      <p style={{ fontSize: '0.9rem', color: '#aaa', margin: 0 }}>
                        <strong style={{ color: selectedAnswers[currentQuestion] === httpsQuestions[currentQuestion].correct ? '#00ff88' : '#ff3b3b' }}>
                          {selectedAnswers[currentQuestion] === httpsQuestions[currentQuestion].correct ? "CORRETO: " : "INCORRETO: "}
                        </strong>
                        {httpsQuestions[currentQuestion].why}
                      </p>
                    </motion.div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem' }}>
                    <button className="btn-404 btn-outline" disabled={currentQuestion === 0} onClick={() => setCurrentQuestion(currentQuestion - 1)}>ANTERIOR</button>
                    {currentQuestion < httpsQuestions.length - 1 ? 
                      <button className="btn-404" onClick={() => setCurrentQuestion(currentQuestion + 1)}>PRÓXIMA</button> :
                      <button className="btn-404" style={{ background: '#ffcc00', color: '#000', border: 'none' }} onClick={() => setQuizFinished(true)}>FINALIZAR QUIZ</button>
                    }
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <h2 style={{ color: '#ffcc00', fontSize: '2.5rem', marginBottom: '1rem' }}>
                    SCORE: {httpsQuestions.filter((q, i) => selectedAnswers[i] === q.correct).length} / 3
                  </h2>
                  <p style={{ color: '#888', marginBottom: '2rem' }}>{httpsQuestions.filter((q, i) => selectedAnswers[i] === q.correct).length === 3 ? "Excelente! Você é um mestre do Hash." : "Bom trabalho! Continue praticando no laboratório."}</p>
                  <button className="btn-404" onClick={() => { setQuizFinished(false); setSelectedAnswers({}); setCurrentQuestion(0); }}>REINICIAR QUIZ</button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HttpsModule;
