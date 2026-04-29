import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, AlertCircle, Home, RefreshCcw, HelpCircle, Server, DoorOpen, DoorClosed, Globe, CheckCircle, FileX } from 'lucide-react';
import ModuleIntro from '../components/ModuleIntro';

const Error404Module = () => {
  const [showLab, setShowLab] = useState(false);
  const [path, setPath] = useState('/api/users/1');
  const [status, setStatus] = useState('IDLE'); 
  const [backendMsg, setBackendMsg] = useState('');

  // Estados do Quiz
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);

  const validDoors = ['/api/users/1', '/api/hash', '/api/dns-lookup'];

 const errorQuestions = [
    {
      q: "1. O que o código '404' indica quando você tenta acessar uma rota no seu simulador?",
      options: [
        "A. A internet do usuário caiu antes da requisição chegar ao guia (servidor).",
        "B. O usuário não tem permissão para entrar naquela pasta específica.",
        "C. O servidor foi encontrado e está funcionando, mas a rota (URL) solicitada não existe na tabela de roteamento dele.",
        "D. O servidor está desligado ou o cabo de rede foi desconectado."
      ],
      correct: 2, // Alternativa C
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
      correct: 0, // Alternativa A
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
      correct: 0, // Alternativa A
      why: "Sinalizar o erro imediatamente permite que o usuário saiba que houve um erro de digitação ou link quebrado, permitindo que ele tome outra ação."
    }
  ];

  const handleSearch = async () => {
    if (!path) return;
    setStatus('SCANNING');
    setBackendMsg('');
    setTimeout(() => {
      if (validDoors.includes(path)) {
        setStatus('FOUND');
        setBackendMsg('Rota mapeada com sucesso. O servidor entregou o recurso!');
      } else {
        setStatus('NOT_FOUND');
        setBackendMsg('O servidor não reconhece este caminho.');
      }
    }, 2000);
  };

  if (!showLab) {
    return (
      <ModuleIntro title="ERRO 404" color="#ff3b3b" icon={AlertCircle} description="O endereço que não existe mais." analogy="O erro 404 é como chegar no endereço de um amigo e encontrar a casa vazia." onStart={() => setShowLab(true)}>
        <div style={{ position: 'relative', width: '250px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div animate={{ x: [-100, 50], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 3 }} style={{ position: 'absolute' }}>
            <MapPin size={40} color="var(--text-dim)" />
          </motion.div>
          <HelpCircle size={60} color="#ff3b3b" />
        </div>
      </ModuleIntro>
    );
  }

  return (
    <div className="container" style={{ padding: '4rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" className="btn-404 btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}><Home size={16} /> HUB</Link>
          <button className="btn-404 btn-outline" onClick={() => { setShowLab(false); setStatus('IDLE'); setShowQuiz(false); }}><RefreshCcw size={16} /> REVER INTRO</button>
        </div>
        <button className="btn-404" onClick={() => setShowQuiz(!showQuiz)} style={{ background: showQuiz ? '#fff' : '#ffcc00', color: showQuiz ? '#000' : '#000000', border: 'none' }}>
          {showQuiz ? "VOLTAR AO LABORATÓRIO" : "REALIZAR QUIZ"}
        </button>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          {!showQuiz ? (
            <motion.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="card-404" style={{ padding: '0', overflow: 'hidden', border: status === 'NOT_FOUND' ? '1px solid #ff3b3b' : '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff3b3b' }}></div>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffcc00' }}></div>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#00ff88' }}></div>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '20px' }}>
                  <Globe size={16} color="#888" style={{ marginRight: '0.5rem' }} />
                  <input value={path} onChange={(e) => { setPath(e.target.value); setStatus('IDLE'); }} style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', fontFamily: 'var(--font-mono)' }} disabled={status === 'SCANNING'} />
                </div>
                <button className="btn-404" onClick={handleSearch} disabled={status === 'SCANNING' || !path} style={{ padding: '0.5rem 1.5rem', background: status === 'IDLE' ? 'var(--primary)' : '#555', color: status === 'IDLE' ? 'black' : '#fff' }}>{status === 'IDLE' ? 'ACESSAR' : 'BUSCANDO...'}</button>
              </div>

              <div style={{ padding: '3rem', position: 'relative' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                  <Server size={40} color={status === 'SCANNING' ? '#00f3ff' : '#666'} style={{ marginBottom: '1rem', filter: status === 'SCANNING' ? 'drop-shadow(0 0 15px rgba(0,243,255,0.8))' : 'none' }} />
                  <h3 className="mono" style={{ color: status === 'SCANNING' ? '#00f3ff' : '#888', letterSpacing: '2px' }}>{status === 'IDLE' ? 'SERVIDOR AGUARDANDO REQUISIÇÃO' : (status === 'SCANNING' ? 'ANALISANDO TABELA DE ROTEAMENTO...' : 'RESPOSTA DO SERVIDOR')}</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
                  <div style={{ position: 'relative' }}>
                    <div className="mono" style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem' }}>ROTAS MAPEADAS (EXISTENTES)</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <AnimatePresence>
                        {status === 'SCANNING' && (<motion.div initial={{ top: 0, opacity: 0 }} animate={{ top: '100%', opacity: [0, 1, 1, 0] }} transition={{ duration: 1.8, ease: "linear" }} style={{ position: 'absolute', width: '100%', height: '2px', background: '#00f3ff', boxShadow: '0 0 20px 5px rgba(0,243,255,0.4)', zIndex: 10, pointerEvents: 'none' }} />)}
                      </AnimatePresence>
                      {validDoors.map(door => {
                        const isMatched = status === 'FOUND' && path === door;
                        return (
                          <div key={door} className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: isMatched ? '1px solid #00ff88' : '1px solid rgba(255,255,255,0.05)', background: isMatched ? 'rgba(0,255,136,0.1)' : 'rgba(0,0,0,0.3)', boxShadow: isMatched ? 'inset 0 0 20px rgba(0,255,136,0.2)' : 'none' }}>
                            {isMatched ? <DoorOpen size={24} color="#00ff88" /> : <DoorClosed size={24} color="#555" />}
                            <span className="mono" style={{ color: isMatched ? '#00ff88' : '#888' }}>{door}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div className="mono" style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem' }}>SAÍDA (OUTPUT)</div>
                    <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem', background: status === 'FOUND' ? 'rgba(0,255,136,0.05)' : (status === 'NOT_FOUND' ? 'rgba(255,59,59,0.05)' : 'rgba(0,0,0,0.3)'), border: status === 'FOUND' ? '1px dashed #00ff88' : (status === 'NOT_FOUND' ? '1px dashed #ff3b3b' : '1px dashed rgba(255,255,255,0.1)') }}>
                      {status === 'IDLE' && <span style={{ color: '#555', fontFamily: 'var(--font-mono)' }}>Esperando requisição...</span>}
                      {status === 'SCANNING' && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}><Search size={40} color="#00f3ff" style={{ opacity: 0.5 }} /></motion.div>}
                      {status === 'FOUND' && <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><CheckCircle size={60} color="#00ff88" style={{ marginBottom: '1rem' }} /><h2 style={{ color: '#00ff88', margin: '0 0 0.5rem 0' }}>200 OK</h2><p className="mono" style={{ color: '#888', fontSize: '0.85rem' }}>{backendMsg}</p></motion.div>}
                      {status === 'NOT_FOUND' && <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><FileX size={60} color="#ff3b3b" style={{ marginBottom: '1rem' }} /><h2 style={{ color: '#ff3b3b', margin: '0 0 0.5rem 0' }}>404 NOT FOUND</h2><p className="mono" style={{ color: '#ff3b3b', opacity: 0.8, fontSize: '0.85rem' }}>{backendMsg}</p></motion.div>}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="card-404" style={{ padding: '3rem' }}>
              {!quizFinished ? (
                <>
                  <div className="mono" style={{ color: '#ffcc00', marginBottom: '1rem', letterSpacing: '2px' }}>QUESTÃO {currentQuestion + 1} / 3</div>
                  <h3 style={{ marginBottom: '2rem', color: '#fff', fontSize: '1.4rem' }}>{errorQuestions[currentQuestion].q}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {errorQuestions[currentQuestion].options.map((opt, idx) => (
                      <button key={idx} className="glass-panel" 
                        onClick={() => setSelectedAnswers({...selectedAnswers, [currentQuestion]: idx})}
                        style={{ 
                          textAlign: 'left', padding: '1.2rem', 
                          border: selectedAnswers[currentQuestion] === idx ? '1px solid #ffcc00' : '1px solid rgba(255,255,255,0.1)',
                          background: selectedAnswers[currentQuestion] === idx ? 'rgba(0,255,136,0.1)' : 'rgba(0,0,0,0.2)',
                          color: '#fff', cursor: 'pointer', transition: 'all 0.2s ease',
                          fontFamily: 'var(--font-mono), monospace', fontSize: '0.95rem', letterSpacing: '0.5px', lineHeight: '1.4'
                        }}>{opt}</button>
                    ))}
                  </div>
                  {selectedAnswers[currentQuestion] !== undefined && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '4px', background: 'rgba(255,255,255,0.03)', borderLeft: `4px solid ${selectedAnswers[currentQuestion] === errorQuestions[currentQuestion].correct ? '#00ff88' : '#ff3b3b'}` }}>
                      <p style={{ fontSize: '0.9rem', color: '#aaa', margin: 0 }}><strong style={{ color: selectedAnswers[currentQuestion] === errorQuestions[currentQuestion].correct ? '#00ff88' : '#ff3b3b' }}>{selectedAnswers[currentQuestion] === errorQuestions[currentQuestion].correct ? "CORRETO: " : "INCORRETO: "}</strong>{errorQuestions[currentQuestion].why}</p>
                    </motion.div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem' }}>
                    <button className="btn-404 btn-outline" disabled={currentQuestion === 0} onClick={() => setCurrentQuestion(currentQuestion - 1)}>ANTERIOR</button>
                    {currentQuestion < 2 ? <button className="btn-404" onClick={() => setCurrentQuestion(currentQuestion + 1)}>PRÓXIMA</button> : <button className="btn-404" style={{ background: '#ffcc00', color: '#000000', border: 'none' }} onClick={() => setQuizFinished(true)}>FINALIZAR QUIZ</button>}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <h2 style={{ color: '#ffcc00', fontSize: '2.5rem', marginBottom: '1rem' }}>
                    SCORE: {errorQuestions.filter((q, i) => selectedAnswers[i] === q.correct).length} / 3
                  </h2>
                  <p style={{ color: '#888', marginBottom: '2rem' }}>{errorQuestions.filter((q, i) => selectedAnswers[i] === q.correct).length === 3 ? "Excelente! Você é um mestre do Hash." : "Bom trabalho! Continue praticando no laboratório."}</p>
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

export default Error404Module;