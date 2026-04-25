import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Server, Utensils, Home, RefreshCcw } from 'lucide-react';
import ModuleIntro from '../components/ModuleIntro';

const ApiModule = () => {
  const [showLab, setShowLab] = useState(false);
  const [userId, setUserId] = useState('1');
  const [response, setResponse] = useState(null);
  const [status, setStatus] = useState('IDLE');

  const handleSend = async () => {
    if (status !== 'IDLE') return;
    
    setStatus('WALKING');
    setResponse(null);

    // Step 1: Waiter goes to kitchen
    setTimeout(async () => {
      setStatus('COOKING');
      
      // Step 2: Kitchen processes
      try {
        const res = await fetch(`/api/users/${userId}`);
        const data = await res.json();
        
        setTimeout(() => {
          setResponse(data.data || data);
          setStatus('RETURNING');
          
          // Step 3: Waiter returns
          setTimeout(() => {
            setStatus('IDLE');
          }, 2000);
        }, 1500);
      } catch (err) {
        setStatus('IDLE');
        setResponse({ error: "Falha na conexão com o servidor Python." });
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
            <Utensils size={30} />
          </motion.div>
          <Server size={40} color="#ff3b3b" />
        </div>
      </ModuleIntro>
    );
  }

  return (
    <div className="container" style={{ padding: '4rem 2rem' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
        <Link to="/" className="btn-404" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <Home size={16} /> VOLTAR AO HUB
        </Link>
        <button className="btn-404 btn-outline" onClick={() => { setShowLab(false); setStatus('IDLE'); setResponse(null); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCcw size={16} /> REVER INTRO
        </button>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="card-404" style={{ padding: '3rem' }}>
          <h2 style={{ color: '#00f3ff', textAlign: 'center', marginBottom: '4rem' }}>RESTAURANTE DE DADOS</h2>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6rem', position: 'relative' }}>
             <div style={{ textAlign: 'center', zIndex: 10 }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--bg-accent)', borderRadius: '50%', border: '2px solid #00f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <User size={35} color="#00f3ff" />
              </div>
              <div className="mono" style={{ fontSize: '0.7rem' }}>VOCÊ (CLIENTE)</div>
            </div>

            <div style={{ position: 'absolute', top: '40px', left: '80px', right: '80px', height: '2px', background: 'rgba(255,255,255,0.05)' }}>
               <motion.div
                animate={{ 
                  left: status === 'WALKING' || status === 'COOKING' ? '100%' : '0%',
                }}
                transition={{ duration: 2, ease: "easeInOut" }}
                style={{ position: 'absolute', top: '-25px', display: status === 'IDLE' && !response ? 'none' : 'block' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Utensils size={30} color="#ffcc00" />
                  <div className="mono" style={{ fontSize: '0.5rem', background: '#ffcc00', color: 'black', padding: '2px 5px', borderRadius: '4px', marginTop: '5px' }}>API</div>
                </div>
              </motion.div>
            </div>

            <div style={{ textAlign: 'center', zIndex: 10 }}>
              <motion.div animate={{ scale: status === 'COOKING' ? [1, 1.1, 1] : 1 }} transition={{ repeat: Infinity, duration: 0.5 }} style={{ width: '80px', height: '80px', background: 'var(--bg-accent)', borderRadius: '50%', border: '2px solid #ff3b3b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Server size={35} color="#ff3b3b" />
              </motion.div>
              <div className="mono" style={{ fontSize: '0.7rem' }}>SISTEMA (COZINHA)</div>
            </div>
          </div>

          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div className="mono" style={{ fontSize: '0.7rem', color: '#00f3ff', marginBottom: '1rem' }}>ESCOLHA SEU PEDIDO (ID DO USUÁRIO):</div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
              <input 
                className="input-404"
                type="number" 
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                min="1"
                max="3"
                style={{ fontSize: '1.5rem', textAlign: 'center' }}
              />
              <button className="btn-404" onClick={handleSend} disabled={status !== 'IDLE'} style={{ padding: '0 2rem' }}>
                {status === 'IDLE' ? 'FAZER PEDIDO' : 'AGUARDANDO...'}
              </button>
            </div>

            <AnimatePresence>
              {response && (status === 'IDLE' || status === 'RETURNING') && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="mono" style={{ fontSize: '0.7rem', color: '#00ff88', marginBottom: '0.5rem' }}>PRATO PRONTO (RESPOSTA JSON):</div>
                  <div style={{ background: '#000', padding: '2rem', borderRadius: '12px', border: '1px solid #00ff8833' }}>
                    <pre style={{ color: '#00ff88', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{JSON.stringify(response, null, 2)}</pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiModule;
