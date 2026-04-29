import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Server, Search, Home, RefreshCcw, Contact, User, Terminal, ExternalLink } from 'lucide-react';
import ModuleIntro from '../components/ModuleIntro';

const DnsModule = () => {
  const [showLab, setShowLab] = useState(false);
  const [url, setUrl] = useState('');
  const [step, setStep] = useState(0); // 0: idle, 1: sending to DNS, 2: DNS searching, 3: returning ip, 4: done
  const [result, setResult] = useState(null);
  const [searchLogs, setSearchLogs] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);

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

  // Função para simular o processo de busca do DNS para fins educacionais
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
    }, 400); // Adiciona um log a cada 400ms
  };

  const handleLookup = async () => {
    if (!url) return;
    setStep(1);
    setResult(null);
    setSearchLogs([]);
    
    // Animação do Usuário para o Servidor DNS
    setTimeout(() => {
      setStep(2);
      simulateDnsSearch(); // Inicia a animação educacional no terminal
    }, 1500);
    
    try {
      const response = await fetch('/api/dns-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: url })
      });
      const data = await response.json();
      
      // Espera o tempo da simulação (2 segundos) para ficar visualmente agradável
      setTimeout(() => {
        setStep(3);
        // Animação do Servidor DNS de volta para o Usuário
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

  const isValidIp = result && result !== 'IP_NÃO_ENCONTRADO' && result !== 'ERRO_CONEXÃO';

  return (
    <div className="container" style={{ padding: '4rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" className="btn-404 btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <Home size={16} /> VOLTAR AO HUB
          </Link>
          <button className="btn-404 btn-outline" onClick={() => { setShowLab(false); setStep(0); setResult(null); setUrl(''); setSearchLogs([]); setShowQuiz(false); }}>
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
              <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 style={{ color: '#ff6b00', marginBottom: '1rem', textShadow: '0 0 20px rgba(255,107,0,0.3)' }}>LABORATÓRIO DE DNS</h2>
                <p style={{ color: '#888', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>Veja a tradução de domínios acontecendo em tempo real.</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0 2rem', marginBottom: '5rem', minHeight: '180px' }}>
                <div style={{ textAlign: 'center', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="glass-panel" style={{ width: '90px', height: '90px', borderRadius: '50%', border: '1px solid rgba(255,107,0,0.4)', background: 'rgba(255,107,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: 'inset 0 0 20px rgba(255,107,0,0.1)' }}>
                    <User size={40} color="#ff6b00" />
                  </div>
                  <div className="mono" style={{ fontSize: '0.85rem', color: '#ff6b00', letterSpacing: '2px' }}>USUÁRIO</div>
                </div>

                <div style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg, rgba(255, 107, 0, 0.3), rgba(255, 107, 0, 0.05), rgba(255, 107, 0, 0.3))', margin: '45px 2rem 0', position: 'relative' }}>
                  <AnimatePresence>
                    {step === 1 && (
                      <motion.div initial={{ left: 0 }} animate={{ left: '100%' }} transition={{ duration: 1.5, ease: 'linear' }} style={{ position: 'absolute', top: '-25px', display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'translateX(-50%)' }}>
                        <Search size={24} color="#ff6b00" style={{ marginBottom: '5px' }} />
                        <div className="glass-panel" style={{ background: 'rgba(255,107,0,0.2)', padding: '6px 15px', border: '1px solid #ff6b00', color: '#ffcc00', fontSize: '0.75rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>QUEM É {url}?</div>
                      </motion.div>
                    )}
                    {step === 3 && (
                      <motion.div initial={{ left: '100%' }} animate={{ left: 0 }} transition={{ duration: 1.5, ease: 'linear' }} style={{ position: 'absolute', top: '-25px', display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'translateX(-50%)' }}>
                        <Globe size={24} color="#00ff88" style={{ marginBottom: '5px' }} />
                        <div className="glass-panel" style={{ background: 'rgba(0,255,136,0.2)', padding: '6px 15px', border: '1px solid #00ff88', color: '#00ff88', fontSize: '0.75rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>IP: {result}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div style={{ textAlign: 'center', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '220px' }}>
                  <motion.div className="glass-panel" animate={{ scale: step === 2 ? [1, 1.05, 1] : 1 }} transition={{ repeat: step === 2 ? Infinity : 0, duration: 1 }} style={{ width: '90px', height: '90px', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: `1px solid ${step >= 2 && step <= 3 ? '#ff6b00' : 'rgba(255,255,255,0.1)'}`, background: step >= 2 && step <= 3 ? 'rgba(255,107,0,0.1)' : 'rgba(0,0,0,0.4)' }}>
                    <Server size={40} color={step >= 2 && step <= 3 ? '#ff6b00' : '#888'} />
                  </motion.div>
                  <div className="mono" style={{ fontSize: '0.85rem', color: '#ff6b00', letterSpacing: '2px', marginBottom: '1rem' }}>SERVIDOR DNS</div>
                  <div style={{ height: '100px', width: '100%', opacity: step >= 2 ? 1 : 0 }}>
                    {step >= 2 && (
                      <div className="glass-panel mono" style={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,107,0,0.3)', padding: '10px', fontSize: '0.7rem', color: '#00ff88', textAlign: 'left' }}>
                        <div style={{ color: '#ff6b00', borderBottom: '1px solid rgba(255,107,0,0.3)', marginBottom: '5px' }}>LOG DE RESOLUÇÃO</div>
                        {searchLogs.map((log, index) => <div key={index}>{log}</div>)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '600px' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <input className="input-404" placeholder="Ex: google.com" value={url} onChange={(e) => { setUrl(e.target.value); setStep(0); setResult(null); }} style={{ paddingLeft: '3.5rem' }} disabled={step > 0 && step < 4} />
                    <Globe size={22} style={{ position: 'absolute', left: '1.2rem', top: '1.2rem', color: '#ff6b00' }} />
                  </div>
                  <button className="btn-404" onClick={handleLookup} disabled={(step > 0 && step < 4) || !url}>
                    {step > 0 && step < 4 ? 'BUSCANDO...' : 'TRADUZIR'}
                  </button>
                </div>

                {step === 4 && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center', width: '100%', maxWidth: '600px', background: 'rgba(0,0,0,0.6)', border: `1px solid ${isValidIp ? 'rgba(0,255,136,0.3)' : 'rgba(255,59,59,0.3)'}` }}>
                    <div className="mono" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>RESULTADO:</div>
                    <div style={{ fontSize: '3rem', color: isValidIp ? '#00ff88' : 'var(--danger)', fontFamily: 'var(--font-mono)', marginBottom: '2rem' }}>{result}</div>
                    {isValidIp && (
                      <button 
                        className="btn-404" 
                        onClick={() => window.open(`http://${result}`, '_blank')}
                        style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid #00ff88', color: '#00ff88', display: 'inline-flex', alignItems: 'center', gap: '0.8rem', padding: '1rem 2rem', clipPath: 'none', borderRadius: '8px' }}
                      >
                        <ExternalLink size={20} /> ACESSAR IP DIRETAMENTE
                      </button>
                    )}
                  </motion.div>
                )}
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
                  <div className="mono" style={{ color: '#ffcc00', marginBottom: '1rem', letterSpacing: '2px' }}>QUESTÃO {currentQuestion + 1} / 3</div>
                  <h3 style={{ marginBottom: '2rem', color: '#fff', fontSize: '1.4rem' }}>{dnsQuestions[currentQuestion].q}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {dnsQuestions[currentQuestion].options.map((opt, idx) => (
                      <button 
                        key={idx} className="glass-panel" 
                        onClick={() => setSelectedAnswers({...selectedAnswers, [currentQuestion]: idx})}
                        style={{ 
                          textAlign: 'left', padding: '1.2rem', 
                          border: selectedAnswers[currentQuestion] === idx ? '1px solid #ffcc00' : '1px solid rgba(255,255,255,0.1)',
                          background: selectedAnswers[currentQuestion] === idx ? 'rgba(255,107,0,0.1)' : 'rgba(0,0,0,0.2)',
                          color: '#fff', cursor: 'pointer', transition: 'all 0.2s ease',
                          fontFamily: 'var(--font-mono), monospace', fontSize: '0.95rem', letterSpacing: '0.5px', lineHeight: '1.4'
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {selectedAnswers[currentQuestion] !== undefined && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '4px', background: 'rgba(255,255,255,0.03)', borderLeft: `4px solid ${selectedAnswers[currentQuestion] === dnsQuestions[currentQuestion].correct ? '#00ff88' : '#ff3b3b'}` }}>
                      <p style={{ fontSize: '0.9rem', color: '#aaa', margin: 0 }}>
                        <strong style={{ color: selectedAnswers[currentQuestion] === dnsQuestions[currentQuestion].correct ? '#00ff88' : '#ff3b3b' }}>
                          {selectedAnswers[currentQuestion] === dnsQuestions[currentQuestion].correct ? "CORRETO: " : "INCORRETO: "}
                        </strong>
                        {dnsQuestions[currentQuestion].why}
                      </p>
                    </motion.div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem' }}>
                    <button className="btn-404 btn-outline" disabled={currentQuestion === 0} onClick={() => setCurrentQuestion(currentQuestion - 1)}>ANTERIOR</button>
                    {currentQuestion < 2 ? 
                      <button className="btn-404" onClick={() => setCurrentQuestion(currentQuestion + 1)}>PRÓXIMA</button> :
                      <button className="btn-404" style={{ background: '#ffcc00', color: '#000', border: 'none' }} onClick={() => setQuizFinished(true)}>FINALIZAR QUIZ</button>
                    }
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <h2 style={{ color: '#ffcc00', fontSize: '2.5rem', marginBottom: '1rem' }}>
                    SCORE: {dnsQuestions.filter((q, i) => selectedAnswers[i] === q.correct).length} / 3
                  </h2>
                  <p style={{ color: '#888', marginBottom: '2rem' }}>{dnsQuestions.filter((q, i) => selectedAnswers[i] === q.correct).length === 3 ? "Excelente! Você é um mestre do Hash." : "Bom trabalho! Continue praticando no laboratório."}</p>
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

export default DnsModule;