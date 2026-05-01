import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Server, Utensils, Package, XCircle } from 'lucide-react';
import ModuleIntro from '../../components/ModuleIntro';
import LabHeader from '../../components/LabHeader';
import Quiz from '../../components/Quiz';
import GlassPanel from '../../components/GlassPanel';
import styles from './ApiModule.module.css';

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

const ApiModule = () => {
  const [showLab, setShowLab] = useState(false);
  const [userId, setUserId] = useState('1');
  const [response, setResponse] = useState(null);
  const [status, setStatus] = useState('IDLE'); // IDLE, WALKING_TO_STOCK, SEARCHING, WALKING_BACK
  const [showQuiz, setShowQuiz] = useState(false);

  const handleSend = async () => {
    if (status !== 'IDLE') return;
    
    setStatus('WALKING_TO_STOCK');
    setResponse(null);

    setTimeout(async () => {
      setStatus('SEARCHING');
      
      try {
        const res = await fetch(`/api/users/${userId}`);
        const data = await res.json();
        
        setTimeout(() => {
          setResponse(res.ok ? (data.data || data) : { error: "Box not found" });
          setStatus('WALKING_BACK');
          
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const resetLab = () => {
    setShowLab(false);
    setUserId('1');
    setResponse(null);
    setStatus('IDLE');
    setShowQuiz(false);
  };

  if (!showLab) {
    return (
      <ModuleIntro 
        title="API"
        color="var(--secondary)"
        icon={Utensils}
        description="O garçom que conecta você aos dados."
        analogy="Num restaurante, você não entra na cozinha. Você chama o GARÇOM (API), diz o que quer, e ele leva o pedido e traz a comida pronta. A API faz exatamente isso entre o seu celular e o servidor do site."
        onStart={() => setShowLab(true)}
      >
        <div className={styles.introContainer}>
          <User size={40} color="white" />
          <motion.div
            animate={{ x: [-100, 100, -100] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className={styles.introUtensils}
          >
            <Utensils size={30} />
          </motion.div>
          <Server size={40} color="var(--secondary)" className={styles.introServer} />
        </div>
      </ModuleIntro>
    );
  }

  const boxes = [1, 2, 3, 4, 5];

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
              <h2 className={`text-center lab-title ${styles.labTitle}`}>ESTOQUE DE DADOS</h2>

              <div className={`animation-arena ${styles.arenaContainer}`}>
                
                {/* Stockroom (Left) */}
                <div className={styles.stockroom}>
                  <GlassPanel className={styles.shelfPanel}>
                    {boxes.map(id => {
                      const isTarget = status === 'SEARCHING' && parseInt(userId) === id;
                      const isTaken = response && response.id === id && status === 'WALKING_BACK';
                      return (
                        <motion.div 
                          key={id} 
                          animate={{ scale: isTarget ? [1, 1.1, 1] : 1, rotate: isTarget ? [0, 5, -5, 0] : 0 }}
                          transition={{ repeat: isTarget ? Infinity : 0, duration: 0.5 }}
                          className={`${styles.boxItem} ${isTarget ? styles.boxActive : styles.boxDefault}`}
                          style={{ 
                            opacity: isTaken ? 0.3 : 1, position: 'relative'
                          }}
                        >
                          <Package size={20} color={isTarget ? 'var(--secondary)' : '#444'} />
                          <span className={`mono ${styles.boxLabel}`} style={{ color: isTarget ? 'var(--secondary)' : '#444' }}>#{id}</span>
                        </motion.div>
                      );
                    })}
                  </GlassPanel>
                  <div className="node-label secondary-text">PRATELEIRAS</div>
                </div>

                {/* Path & Clerk (Server) */}
                <div className={styles.pathContainer}>
                  <div className={styles.pathLine} />
                  
                  <motion.div
                    animate={{ left: status === 'IDLE' ? '100%' : (status === 'WALKING_TO_STOCK' || status === 'SEARCHING' ? '0%' : '100%') }}
                    transition={{ duration: status === 'SEARCHING' ? 0 : 2, ease: "easeInOut" }}
                    className={styles.clerkWrapper}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <GlassPanel className={styles.clerkPanel}>
                        <Server size={35} color="var(--secondary)" className={styles.serverIcon} />
                        <AnimatePresence>
                          {status === 'WALKING_BACK' && response && !response.error && (
                            <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} className={`${styles.clerkBadge} ${styles.clerkBadgeSuccess}`}>
                              <Package size={20} color="var(--success)" />
                            </motion.div>
                          )}
                          {status === 'WALKING_BACK' && response && response.error && (
                            <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} className={`${styles.clerkBadge} ${styles.clerkBadgeError}`}>
                              <XCircle size={20} color="var(--danger)" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </GlassPanel>
                      <div className={`mono ${styles.clerkLabel}`}>SERVIDOR</div>
                    </div>
                  </motion.div>
                </div>

                {/* User (Right) */}
                <div className={styles.userContainer}>
                  <div className={`node-icon node-secondary ${styles.userIcon}`}>
                    <User size={40} color="var(--secondary)" />
                  </div>
                  <div className="node-label secondary-text">USUÁRIO</div>
                </div>
              </div>

              <div className={styles.formWrapper}>
                <div className={`io-label secondary-label`}>SOLICITAR CAIXA (ID):</div>
                <div className={styles.inputRow}>
                  <input 
                    className={`input-404 ${styles.idInput}`} 
                    type="number" 
                    value={userId} 
                    onChange={(e) => { setUserId(e.target.value); setResponse(null); }} 
                    onKeyDown={handleKeyDown}
                    min="1" max="10" 
                    disabled={status !== 'IDLE'} 
                  />
                  <button className={`btn-404 ${styles.submitBtn}`} onClick={handleSend} disabled={status !== 'IDLE'}>
                    {status === 'IDLE' ? 'FAZER REQUISIÇÃO' : 'AGUARDANDO...'}
                  </button>
                </div>
                <AnimatePresence>
                  {response && status === 'IDLE' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <div className={`mono ${styles.outputLabel}`} style={{ color: response.error ? 'var(--danger)' : 'var(--success)' }}>CONTEÚDO:</div>
                      <GlassPanel className={`${styles.outputPanel} ${response.error ? styles.outputError : styles.outputSuccess}`}>
                        {response.error ? (
                          <div className={styles.errorMessage}>A requisição não existe.</div>
                        ) : (
                          <pre className={styles.jsonDisplay}>{JSON.stringify(response, null, 2)}</pre>
                        )}
                      </GlassPanel>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="card-404"
            >
              <Quiz questions={apiQuestions} onFinishQuiz={() => setShowQuiz(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ApiModule;