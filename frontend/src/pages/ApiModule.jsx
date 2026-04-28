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
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
        <Link to="/" className="btn-404 btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <Home size={16} /> VOLTAR AO HUB
        </Link>
        <button className="btn-404 btn-outline" onClick={() => { setShowLab(false); setStatus('IDLE'); setResponse(null); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCcw size={16} /> REVER INTRO
        </button>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div className="card-404" style={{ padding: '3rem' }}>
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
            <div className="mono" style={{ fontSize: '0.8rem', color: 'rgba(0,243,255,0.8)', marginBottom: '1rem', letterSpacing: '1px' }}>SOLICITAR CAIXA (ID):</div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
              <input 
                className="input-404"
                type="number" 
                value={userId}
                onChange={(e) => { setUserId(e.target.value); setResponse(null); setStatus('IDLE'); }}
                min="1"
                max="10"
                style={{ fontSize: '1.5rem', textAlign: 'center' }}
                disabled={status !== 'IDLE'}
              />
              <button className="btn-404" onClick={handleSend} disabled={status !== 'IDLE'} style={{ padding: '0 2.5rem' }}>
                {status === 'IDLE' ? 'FAZER REQUISIÇÃO' : 'AGUARDANDO...'}
              </button>
            </div>

            <AnimatePresence>
              {response && status === 'IDLE' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="mono" style={{ fontSize: '0.8rem', color: response.error ? 'var(--danger)' : '#00ff88', marginBottom: '1rem', letterSpacing: '1px' }}>CONTEÚDO DA CAIXA:</div>
                  <div className="glass-panel" style={{ padding: '2.5rem', border: `1px solid ${response.error ? 'rgba(255,59,59,0.3)' : 'rgba(0,255,136,0.3)'}`, background: 'rgba(0,0,0,0.6)', boxShadow: `inset 0 0 30px ${response.error ? 'rgba(255,59,59,0.1)' : 'rgba(0,255,136,0.1)'}` }}>
                    {response.error ? (
                      <div style={{ color: 'var(--danger)', textAlign: 'center', fontSize: '1.2rem', textShadow: '0 0 10px rgba(255,59,59,0.5)' }}>A requisição não existe. O servidor voltou de mãos vazias.</div>
                    ) : (
                      <pre style={{ color: '#00ff88', fontSize: '1rem', whiteSpace: 'pre-wrap', textShadow: '0 0 10px rgba(0,255,136,0.3)' }}>{JSON.stringify(response, null, 2)}</pre>
                    )}
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
