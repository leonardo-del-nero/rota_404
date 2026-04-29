import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Server, Utensils, Home, RefreshCcw, Package, Layers, XCircle } from 'lucide-react';
import ModuleIntro from '../components/ModuleIntro';

const ApiModule = () => {
  const [showLab, setShowLab] = useState(false);
  const [userId, setUserId] = useState('1');
  const [response, setResponse] = useState(null);
  const [status, setStatus] = useState('IDLE'); // IDLE, WALKING_TO_STOCK, SEARCHING, WALKING_BACK
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);

  const apiQuestions = [
    {
      q: "1. Se um usuário solicitar o ID #10 no seu servidor, mas o banco de dados só tiver registros até o ID #5, qual será o resultado dessa operação?",
      options: [
        "A. O servidor entregará o registro #5 por ser o mais próximo do solicitado.",
        "B. O servidor retornará um erro de 'Não Encontrado' (comumente o status 404).",
        "C. A API vai criar um registro novo com o número 10 automaticamente.",
        "D. O sistema vai travar e o usuário precisará reiniciar o computador."
      ],
      correct: 1,
      why: "APIs trabalham com dados exatos; se o recurso não existe, o servidor deve informar que a busca falhou através de um código de erro."
    },
    {
      q: "2. Qual é o formato de texto mais comum utilizado pelas APIs modernas para entregar os dados (como a 'caixa' que o seu servidor carrega)?",
      options: [
        "A. JSON (JavaScript Object Notation).",
        "B. Documento de texto do Microsoft Word (.docx).",
        "C. Arquivos de valores separados por vírgula (CSV).",
        "D. Dados em texto simples (.txt)."
      ],
      correct: 0,
      why: "O JSON é o padrão de mercado por ser leve, fácil de ler para humanos e simples de processar para sistemas."
    },
    {
      q: "3. Por que usamos uma API em vez de deixar o usuário acessar os arquivos do servidor diretamente?",
      options: [
        "A. Para garantir a segurança e o controle de quem pode ver ou alterar as informações.",
        "B. Porque o navegador não consegue ler arquivos que não foram processados por uma API.",
        "C. Porque é proibido por lei acessar servidores sem um intermediário.",
        "D. Para que o site demore mais tempo para carregar e pareça mais complexo."
      ],
      correct: 0,
      why: "A API age como um filtro de segurança e uma camada de regras de negócio, protegendo a integridade dos dados originais."
    }
  ];

  const handleSend = async () => {
    if (status !== 'IDLE') return;
    
    setStatus('WALKING_TO_STOCK');
    setResponse(null);

    // Step 1: Clerk goes to stockroom
    setTimeout(async () => {
      setStatus('SEARCHING');
      
      // Step 2: Clerk searches in backend
      try {
        const res = await fetch(`/api/users/${userId}`);
        const data = await res.json();
        
        setTimeout(() => {
          setResponse(res.ok ? (data.data || data) : { error: "Box not found" });
          setStatus('WALKING_BACK');
          
          // Step 3: Clerk returns
          setTimeout(() => {
            setStatus('IDLE');
          }, 2000);
        }, 1500);
      } catch (err) {
        setTimeout(() => {
          setResponse({ error: "Falha na conexão" });
          setStatus('WALKING_BACK');
          setTimeout(() => setStatus('IDLE'), 2000);
        }, 1500);
      }
    }, 2000);
  };

  if (!showLab) {
    return (
      <ModuleIntro 
        title="API"
        color="#00f3ff"
        icon={Utensils}
        description="O garçom que conecta você aos dados."
        analogy="Num restaurante, você não entra na cozinha. Você chama o GARÇOM (API), diz o que quer, e ele leva o pedido e traz a comida pronta. A API faz exatamente isso entre o seu celular e o servidor do site."
        onStart={() => setShowLab(true)}
      >
        <div style={{ position: 'relative', width: '300px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <User size={40} color="white" />
          <motion.div
            animate={{ x: [-100, 100, -100] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            style={{ color: '#00f3ff' }}
          >
            <Utensils size={30} style={{ filter: 'drop-shadow(0 0 10px rgba(0,243,255,0.8))' }} />
          </motion.div>
          <Server size={40} color="#00f3ff" style={{ filter: 'drop-shadow(0 0 10px rgba(0,243,255,0.5))' }} />
        </div>
      </ModuleIntro>
    );
  }

  // Stock boxes 1 to 5
  const boxes = [1, 2, 3, 4, 5];

  return (
    <div className="container" style={{ padding: '4rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" className="btn-404 btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <Home size={16} /> VOLTAR AO HUB
          </Link>
          <button className="btn-404 btn-outline" onClick={() => { setShowLab(false); setUserId('1'); setResponse(null); setStatus('IDLE'); setShowQuiz(false); }}>
            <RefreshCcw size={16} /> REVER INTRO
          </button>
        </div>

        <button 
          className="btn-404" 
          onClick={() => setShowQuiz(!showQuiz)}
          style={{ 
            background: showQuiz ? '#fff' : '#ffcc00', 
            color: '#000',
            border: 'none'
          }}
        >
          {showQuiz ? "VOLTAR AO LABORATÓRIO" : "REALIZAR QUIZ"}
        </button>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          {!showQuiz ? (
            <motion.div 
              key="lab"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card-404" 
              style={{ padding: '3rem' }}
            >
              <h2 style={{ color: '#00f3ff', textAlign: 'center', marginBottom: '4rem', textShadow: '0 0 20px rgba(0,243,255,0.3)' }}>ESTOQUE DE DADOS</h2>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6rem', position: 'relative', padding: '0 2rem' }}>
              
              {/* Stockroom (Left) */}
              <div style={{ zIndex: 1, width: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="glass-panel" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '1.5rem', padding: '20px', background: 'rgba(0,243,255,0.05)', border: '1px solid rgba(0,243,255,0.2)', boxShadow: 'inset 0 0 20px rgba(0,243,255,0.1)' }}>
                {boxes.map(id => {
                  const isTarget = status === 'SEARCHING' && parseInt(userId) === id;
                  const isTaken = response && response.id === id && status === 'WALKING_BACK';
                  return (
                  <motion.div 
                    key={id} 
                    animate={{ scale: isTarget ? [1, 1.1, 1] : 1, rotate: isTarget ? [0, 5, -5, 0] : 0 }}
                    transition={{ repeat: isTarget ? Infinity : 0, duration: 0.5 }}
                    style={{ 
                    width: '45px', height: '45px', background: isTarget ? 'rgba(0,243,255,0.1)' : 'rgba(0,0,0,0.6)', 
                    border: `1px solid ${isTarget ? '#00f3ff' : 'rgba(255,255,255,0.15)'}`, 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '4px',
                    boxShadow: isTarget ? '0 0 20px #00f3ff' : 'none',
                    opacity: isTaken ? 0.3 : 1,
                    position: 'relative',
                    transition: 'all 0.3s ease'
                    }}
                  >
                    <Package size={20} color={isTarget ? '#00f3ff' : '#444'} />
                    <span className="mono" style={{ fontSize: '0.6rem', color: isTarget ? '#00f3ff' : '#444', marginTop: '2px' }}>#{id}</span>
                  </motion.div>
                  );
                })}
                </div>
                <div className="mono" style={{ fontSize: '0.85rem', color: '#00f3ff', letterSpacing: '2px' }}>PRATELEIRAS</div>
              </div>

              {/* Path & Clerk (Server) */}
              <div style={{ flex: 1, position: 'relative', height: '60px' }}>
                {/* Floor line */}
                <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '2px', background: 'linear-gradient(90deg, rgba(0, 243, 255, 0.4), rgba(0, 243, 255, 0.05), rgba(0, 243, 255, 0.4))' }} />
                
                {/* Clerk animation */}
                <motion.div
                animate={{ 
                  left: status === 'IDLE' ? '100%' : (status === 'WALKING_TO_STOCK' || status === 'SEARCHING' ? '0%' : '100%')
                }}
                transition={{ duration: status === 'SEARCHING' ? 0 : 2, ease: "easeInOut" }}
                style={{ position: 'absolute', bottom: '15px', transform: 'translateX(-50%)' }}
                >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="glass-panel" style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '12px', border: '1px solid rgba(0,243,255,0.4)', background: 'rgba(0,243,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', boxShadow: '0 0 20px rgba(0,243,255,0.2)' }}>
                  <Server size={35} color="#00f3ff" style={{ filter: 'drop-shadow(0 0 8px rgba(0,243,255,0.6))' }} />
                  {/* Holding Box or Empty Hands if walking back */}
                  <AnimatePresence>
                    {status === 'WALKING_BACK' && response && !response.error && (
                    <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} style={{ position: 'absolute', top: -15, right: -15, background: 'rgba(0,255,136,0.1)', borderRadius: '50%', padding: '5px', border: '1px solid #00ff88', boxShadow: '0 0 15px rgba(0,255,136,0.5)' }}>
                      <Package size={20} color="#00ff88" />
                    </motion.div>
                    )}
                    {status === 'WALKING_BACK' && response && response.error && (
                    <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} style={{ position: 'absolute', top: -15, right: -15, background: 'rgba(255,59,59,0.1)', borderRadius: '50%', padding: '5px', border: '1px solid #ff3b3b', boxShadow: '0 0 15px rgba(255,59,59,0.5)' }}>
                      <XCircle size={20} color="#ff3b3b" />
                    </motion.div>
                    )}
                  </AnimatePresence>
                  </div>
                  <div className="mono" style={{ fontSize: '0.7rem', color: '#00f3ff', letterSpacing: '1px' }}>SERVIDOR</div>
                </div>
                </motion.div>
              </div>

              {/* User (Right) */}
              <div style={{ zIndex: 1, width: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="glass-panel" style={{ width: '90px', height: '90px', borderRadius: '50%', border: '1px solid rgba(0,243,255,0.4)', background: 'rgba(0,243,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: 'inset 0 0 20px rgba(0,243,255,0.1)' }}>
                <User size={40} color="#00f3ff" style={{ filter: 'drop-shadow(0 0 8px rgba(0,243,255,0.6))' }} />
                </div>
                <div className="mono" style={{ fontSize: '0.85rem', color: '#00f3ff', letterSpacing: '2px' }}>USUÁRIO</div>
              </div>
              </div>

              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div className="mono" style={{ fontSize: '0.8rem', color: 'rgba(0,243,255,0.8)', marginBottom: '1rem' }}>SOLICITAR CAIXA (ID):</div>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                  <input className="input-404" type="number" value={userId} onChange={(e) => { setUserId(e.target.value); setResponse(null); }} min="1" max="10" style={{ fontSize: '1.5rem', textAlign: 'center', flex: 1 }} disabled={status !== 'IDLE'} />
                  <button className="btn-404" onClick={handleSend} disabled={status !== 'IDLE'} style={{ padding: '0 2.5rem' }}>
                    {status === 'IDLE' ? 'FAZER REQUISIÇÃO' : 'AGUARDANDO...'}
                  </button>
                </div>
                <AnimatePresence>
                  {response && status === 'IDLE' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="mono" style={{ fontSize: '0.8rem', color: response.error ? 'var(--danger)' : '#00ff88', marginBottom: '1rem' }}>CONTEÚDO:</div>
                      <div className="glass-panel" style={{ padding: '2.5rem', background: 'rgba(0,0,0,0.6)', border: `1px solid ${response.error ? 'rgba(255,59,59,0.3)' : 'rgba(0,255,136,0.3)'}` }}>
                        {response.error ? (
                          <div style={{ color: 'var(--danger)', textAlign: 'center' }}>A requisição não existe.</div>
                        ) : (
                          <pre style={{ color: '#00ff88', whiteSpace: 'pre-wrap' }}>{JSON.stringify(response, null, 2)}</pre>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 20 }}
              className="card-404" 
              style={{ padding: '3rem' }}
            >
              {!quizFinished ? (
                <>
                  <div className="mono" style={{ color: '#ffcc00', marginBottom: '1rem', letterSpacing: '2px' }}>QUESTÃO {currentQuestion + 1} / 3</div>
                  <h3 style={{ marginBottom: '2rem', color: '#fff', fontSize: '1.4rem' }}>{apiQuestions[currentQuestion].q}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {apiQuestions[currentQuestion].options.map((opt, idx) => (
                      <button 
                        key={idx} 
                        className="glass-panel" 
                        onClick={() => setSelectedAnswers({...selectedAnswers, [currentQuestion]: idx})}
                        style={{ 
                          textAlign: 'left', padding: '1.2rem', 
                          border: selectedAnswers[currentQuestion] === idx ? '1px solid #00f3ff' : '1px solid rgba(255,255,255,0.1)',
                          background: selectedAnswers[currentQuestion] === idx ? 'rgba(0,243,255,0.1)' : 'rgba(0,0,0,0.2)',
                          color: '#fff', cursor: 'pointer', transition: 'all 0.2s ease',
                          fontFamily: 'var(--font-mono), monospace', fontSize: '0.95rem'
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {selectedAnswers[currentQuestion] !== undefined && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '4px', background: 'rgba(255,255,255,0.03)', borderLeft: `4px solid ${selectedAnswers[currentQuestion] === apiQuestions[currentQuestion].correct ? '#00ff88' : '#ff3b3b'}` }}>
                      <p style={{ fontSize: '0.9rem', color: '#aaa', margin: 0 }}>
                        <strong style={{ color: selectedAnswers[currentQuestion] === apiQuestions[currentQuestion].correct ? '#00ff88' : '#ff3b3b' }}>
                          {selectedAnswers[currentQuestion] === apiQuestions[currentQuestion].correct ? "CORRETO: " : "INCORRETO: "}
                        </strong>
                        {apiQuestions[currentQuestion].why}
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
                    SCORE: {apiQuestions.filter((q, i) => selectedAnswers[i] === q.correct).length} / 3
                  </h2>
                  <p style={{ color: '#888', marginBottom: '2rem' }}>{apiQuestions.filter((q, i) => selectedAnswers[i] === q.correct).length === 3 ? "Excelente! Você é um mestre do Hash." : "Bom trabalho! Continue praticando no laboratório."}</p>
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

export default ApiModule;