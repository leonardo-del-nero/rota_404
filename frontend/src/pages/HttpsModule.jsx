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
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
        <Link to="/" className="btn-404" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <Home size={16} /> VOLTAR AO HUB
        </Link>
        <button className="btn-404 btn-outline" onClick={() => { setShowLab(false); setStatus('IDLE'); setInput(''); setInterceptedText(''); setReceivedText(''); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCcw size={16} /> REVER INTRO
        </button>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div className="card-404" style={{ padding: '3rem', position: 'relative' }}>
          <h2 style={{ color: isHttpsOn ? '#00ff88' : 'var(--danger)', textAlign: 'center', marginBottom: '3rem' }}>
            SIMULADOR DE REDE ({isHttpsOn ? 'HTTPS' : 'HTTP'})
          </h2>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4rem', padding: '0 2rem', position: 'relative', height: '300px' }}>
            
            {/* Connecting Line */}
            <div style={{ position: 'absolute', top: '40px', left: '100px', right: '100px', height: '2px', background: isHttpsOn ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 59, 59, 0.2)', zIndex: 0 }} />

            {/* Traveling Letter */}
            <AnimatePresence>
              {status === 'SENDING' && (
                <motion.div
                  initial={{ left: '100px' }}
                  animate={{ left: 'calc(100% - 130px)' }}
                  transition={{ duration: 3, ease: "linear" }}
                  style={{ position: 'absolute', top: '15px', zIndex: 5 }}
                >
                  <div style={{ 
                    background: isHttpsOn ? '#000' : '#fff', 
                    border: `2px solid ${isHttpsOn ? '#00ff88' : '#333'}`,
                    padding: '8px', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                  }}>
                    {isHttpsOn ? <Lock size={20} color="#00ff88" /> : <Mail size={20} color="#333" />}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Interception Line to Hacker */}
            <div style={{ position: 'absolute', top: '40px', left: '50%', width: '2px', height: '160px', background: 'rgba(255,59,59,0.3)', zIndex: 0, borderLeft: '2px dashed rgba(255,59,59,0.3)' }} />

            {/* Intercepted Traveling Letter */}
            <AnimatePresence>
              {intercepting && (
                <motion.div
                  initial={{ top: '15px', left: '50%', transform: 'translateX(-50%)' }}
                  animate={{ top: '150px' }}
                  transition={{ duration: 1, ease: "linear" }}
                  style={{ position: 'absolute', zIndex: 4 }}
                >
                  <div style={{ 
                    background: isHttpsOn ? '#000' : '#fff', 
                    border: `2px solid ${isHttpsOn ? '#00ff88' : '#333'}`,
                    padding: '8px', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(255,59,59,0.5)',
                    opacity: 0.8
                  }}>
                    {isHttpsOn ? <Lock size={20} color="#00ff88" /> : <Mail size={20} color="#333" />}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Left: User */}
            <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--bg-accent)', borderRadius: '50%', border: `2px solid ${isHttpsOn ? '#00ff88' : '#888'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <User size={40} color={isHttpsOn ? "#00ff88" : "#888"} />
              </div>
              <div className="mono" style={{ fontSize: '0.8rem', color: isHttpsOn ? '#00ff88' : '#888' }}>USUÁRIO</div>
              
              <div style={{ marginTop: '1rem' }}>
                <button 
                  className="btn-404" 
                  onClick={() => setIsHttpsOn(!isHttpsOn)}
                  style={{ 
                    background: isHttpsOn ? '#00ff88' : 'transparent', 
                    color: isHttpsOn ? '#000' : '#888',
                    border: `1px solid ${isHttpsOn ? '#00ff88' : '#888'}`,
                    padding: '0.5rem 1rem',
                    fontSize: '0.8rem'
                  }}
                  disabled={status === 'SENDING'}
                >
                  {isHttpsOn ? <><Lock size={14} style={{ marginRight: '5px' }}/> HTTPS ON</> : <><Unlock size={14} style={{ marginRight: '5px' }}/> HTTPS OFF</>}
                </button>
              </div>
            </div>

            {/* Middle Bottom: Hacker */}
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

            {/* Right: Destination */}
            <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '200px' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--bg-accent)', borderRadius: '12px', border: `2px solid ${isHttpsOn ? '#00ff88' : '#888'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Server size={40} color={isHttpsOn ? "#00ff88" : "#888"} />
              </div>
              <div className="mono" style={{ fontSize: '0.8rem', color: isHttpsOn ? '#00ff88' : '#888', marginBottom: '1rem' }}>DESTINO</div>

              <div style={{ width: '100%', height: '60px', background: '#000', border: '1px solid #333', borderRadius: '4px', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <span className="mono" style={{ fontSize: '0.8rem', color: '#fff', wordBreak: 'break-all', textAlign: 'center' }}>
                  {receivedText || 'Aguardando...'}
                </span>
              </div>
            </div>

          </div>

          {/* User Input Area */}
          <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', gap: '1rem' }}>
            <input 
              className="input-404"
              value={input}
              onChange={(e) => { setInput(e.target.value); setInterceptedText(''); setReceivedText(''); setStatus('IDLE'); }}
              placeholder="Digite uma mensagem secreta..."
              disabled={status === 'SENDING'}
              style={{ flex: 1 }}
            />
            <button 
              className="btn-404" 
              onClick={status === 'IDLE' || status === 'DONE' ? handleSend : () => {}}
              disabled={status === 'SENDING' || !input}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: isHttpsOn ? '#00ff88' : '#fff', color: '#000' }}
            >
              <Send size={18} /> {status === 'SENDING' ? 'ENVIANDO...' : 'ENVIAR'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HttpsModule;
