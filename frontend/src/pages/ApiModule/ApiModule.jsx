import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Server, Utensils, Package, XCircle, ShieldCheck, ShieldAlert } from 'lucide-react';
import ModuleIntro from '../../components/ModuleIntro';
import LabHeader from '../../components/LabHeader';
import Quiz from '../../components/Quiz';
import GlassPanel from '../../components/GlassPanel';
import Mascot from '../../components/Mascot';
import styles from './ApiModule.module.css';

import cp7 from '../../assets/cp7.png';

import Typewriter from '../../components/Typewriter';

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
  const [status, setStatus] = useState('IDLE'); 
  const [showQuiz, setShowQuiz] = useState(false);
  
  const [showCastor, setShowCastor] = useState(false);
  const [castorStep, setCastorStep] = useState(0);
  const [isMaliciousAction, setIsMaliciousAction] = useState(false);
  const [apiStep, setApiStep] = useState(0);

  useEffect(() => {
    if (showLab && apiStep === 0) {
      setCastorStep(0);
      setShowCastor(true);
    }
  }, [showLab]);

  const handleSend = async (isMalicious = false) => {
    if (status !== 'IDLE') return;
    
    setResponse(null);
    setIsMaliciousAction(isMalicious);
    setStatus('WALKING_TO_FIREWALL');

    setTimeout(async () => {
      if (isMalicious) {
        setStatus('BLOCKED');
        setResponse({ error: "403 Forbidden: Tentativa de acesso direto bloqueada." });
        setCastorStep(3); 
        setShowCastor(true);
        setTimeout(() => {
          setStatus('IDLE');
          setIsMaliciousAction(false);
        }, 3000);
      } else {
        setStatus('WALKING_TO_STOCK');
        setTimeout(async () => {
          setStatus('SEARCHING');
          try {
            const res = await fetch(`/api/users/${userId}`);
            const data = await res.json();
            
            setTimeout(() => {
              const isNotFound = !res.ok || parseInt(userId) > 5;
              if (isNotFound) {
                setResponse({ error: "A requisição não existe." });
                if (apiStep === 1) { 
                  setCastorStep(2);
                  setApiStep(2);
                  setShowCastor(true);
                }
              } else {
                setResponse(data.data || data);
                if (apiStep === 0) { 
                  setCastorStep(1);
                  setApiStep(1);
                  setShowCastor(true);
                }
              }
              setStatus('WALKING_BACK');
              setTimeout(() => setStatus('IDLE'), 2000);
            }, 1500);
          } catch (err) {
            setTimeout(() => {
              setResponse({ error: "Falha na conexão" });
              setStatus('WALKING_BACK');
              setTimeout(() => setStatus('IDLE'), 2000);
            }, 1500);
          }
        }, 1500);
      }
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend(false);
    }
  };

  const resetLab = () => {
    setShowLab(false);
    setUserId('1');
    setResponse(null);
    setStatus('IDLE');
    setShowQuiz(false);
    setShowCastor(false);
    setIsMaliciousAction(false);
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
        <Mascot 
          show={showCastor}
          step={castorStep}
          images={[cp7]}
          phrases={[
            /* Passo 0 */ <Typewriter text="Olá! Bem-vindo ao módulo de API. Escolha um ID entre 1 e 5 e clique em 'Fazer Requisição' para ver o garçom em ação!" />,
            /* Passo 1 */ <Typewriter text="Viu só? O Servidor foi até o estoque e trouxe exatamente o pacote JSON que você pediu. Agora, tente pedir um ID que não existe (como o 6)!" />,
            /* Passo 2 */ <Typewriter text="A API retornou um erro porque você pediu algo que não está no estoque. APIs são rígidas! Agora, tente clicar em 'Tentar Acesso Direto' para ver o que acontece." />,
            /* Passo 3 */ <Typewriter text="SEGURANÇA! Tentar acessar arquivos sensíveis sem permissão ativa o Firewall da API. Ela protege o servidor! Seria como tentar acessar a cozinha de um restaurante, não sendo um garçom. Não tem motivos para você estar lá!" />
          ]}
          onNext={() => {
            if (castorStep === 1) {
              setShowCastor(false); 
            } else {
              setShowCastor(false);
            }
          }}
          buttonLabels={["VAMOS LÁ_", "ENTENDI_", "OK!_", "ENTENDI_"]}
        />

        <AnimatePresence mode="wait">
          {!showQuiz ? (
            <motion.div key="lab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-404">
              <h2 className={`text-center lab-title ${styles.labTitle}`}>ESTOQUE DE DADOS</h2>

              <div className={`animation-arena ${styles.arenaContainer}`}>
                <div className={styles.stockroom}>
                  <GlassPanel className={styles.shelfPanel}>
                    {boxes.map(id => (
                      <motion.div key={id} 
                        className={`${styles.boxItem} ${status === 'SEARCHING' && parseInt(userId) === id ? styles.boxActive : styles.boxDefault}`}
                        style={{ opacity: response && response.id === id && status === 'WALKING_BACK' ? 0.3 : 1 }}>
                        <Package size={20} />
                        <span className={`mono ${styles.boxLabel}`}>#{id}</span>
                      </motion.div>
                    ))}
                  </GlassPanel>
                  <div className="node-label secondary-text">PRATELEIRAS</div>
                </div>

                <div className={styles.pathContainer}>
                  <div className={styles.pathLine} />
                  <div className={styles.firewallHub}>
                    {status === 'BLOCKED' ? <ShieldAlert size={35} color="var(--danger)" /> : <ShieldCheck size={30} color="rgba(0,243,255,0.3)" />}
                    <div className={styles.firewallLabel}>API FIREWALL</div>
                  </div>

                  <motion.div
                    animate={{ 
                        left: (isMaliciousAction || status === 'IDLE') ? '100%' : 
                              (status === 'WALKING_TO_FIREWALL') ? '50%' : 
                              (status === 'WALKING_TO_STOCK' || status === 'SEARCHING') ? '0%' : '100%' 
                    }}
                    transition={{ duration: 1.5 }}
                    className={styles.clerkWrapper}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <GlassPanel className={styles.clerkPanel}>
                        <Server size={35} color="var(--secondary)" />
                        <AnimatePresence>
                          {status === 'WALKING_BACK' && response && !response.error && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`${styles.clerkBadge} ${styles.clerkBadgeSuccess}`}>
                              <Package size={20} color="var(--success)" />
                            </motion.div>
                          )}
                          {(status === 'WALKING_BACK' || (status === 'BLOCKED' && !isMaliciousAction)) && response && response.error && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`${styles.clerkBadge} ${styles.clerkBadgeError}`}>
                              <XCircle size={20} color="var(--danger)" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </GlassPanel>
                      <div className={`mono ${styles.clerkLabel}`}>SERVIDOR</div>
                    </div>
                  </motion.div>
                </div>

                <motion.div 
                  className={styles.userContainer}
                  style={{ position: 'relative' }} 
                  animate={{ 
                    x: (isMaliciousAction && (status === 'WALKING_TO_FIREWALL' || status === 'BLOCKED')) ? '-275%' : 0 
                  }}
                  transition={{ duration: 1.5 }}
                >
                  <div className={`node-icon node-secondary ${styles.userIcon}`}><User size={40} color="var(--secondary)" /></div>
                  <div className="node-label secondary-text">USUÁRIO</div>
                </motion.div>
              </div>

              <div className={styles.formWrapper}>
                <div className={styles.outputLabel} style={{ color: 'var(--secondary)' }}>
                  SISTEMA_DE_REQUISIÇÃO // ENTRADA_DE_ID
                </div>
                
                <div className={styles.inputRow}>
                  <input 
                    className={`input-404 ${styles.idInput}`} 
                    type="number" 
                    value={userId} 
                    onChange={(e) => { setUserId(e.target.value); setResponse(null); }} 
                    onKeyDown={handleKeyDown}
                    min="1" max="10" 
                    placeholder="ID"
                    disabled={status !== 'IDLE'} 
                  />
                  
                  <button 
                    className={`btn-404 ${styles.submitBtn}`} 
                    onClick={() => handleSend(false)} 
                    disabled={status !== 'IDLE'}
                  >
                    {status === 'IDLE' ? 'FAZER REQUISIÇÃO' : 'PROCESSANDO...'}
                  </button>

                  <button 
                    className={`btn-404 ${styles.maliciousBtn}`} 
                    onClick={() => handleSend(true)} 
                    disabled={status !== 'IDLE'}
                  >
                    TENTAR ACESSO DIRETO
                  </button>
                </div>

                <AnimatePresence>
                  {response && status === 'IDLE' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <div className={styles.outputLabel} style={{ color: response.error ? 'var(--danger)' : 'var(--success)' }}>
                        LOG_DO_SERVIDOR // {response.error ? 'ERRO_DETECTADO' : 'JSON'}
                      </div>
                      <GlassPanel className={`${styles.outputPanel} ${response.error ? styles.outputError : styles.outputSuccess}`}>
                        {response.error ? (
                          <div className={styles.errorMessage}>{response.error}</div>
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
            <Quiz moduleId="api" questions={apiQuestions} onFinishQuiz={() => setShowQuiz(false)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ApiModule;