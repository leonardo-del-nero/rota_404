import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, AlertCircle, Home, RefreshCcw, HelpCircle, Server, DoorOpen, DoorClosed, AlertTriangle, Globe, CheckCircle, FileX } from 'lucide-react';
import ModuleIntro from '../components/ModuleIntro';

const Error404Module = () => {
  const [showLab, setShowLab] = useState(false);
  const [path, setPath] = useState('/api/users/1');
  const [status, setStatus] = useState('IDLE'); // IDLE, SCANNING, FOUND, NOT_FOUND
  const [backendMsg, setBackendMsg] = useState('');

  const validDoors = [
    '/api/users/1',
    '/api/hash',
    '/api/dns-lookup'
  ];

const handleSearch = async () => {
    if (!path) return;
    setStatus('SCANNING');
    setBackendMsg('');
    
    try {
      const response = await fetch('/api/route-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: path })
      });
      
      let data = {};
      try {
        data = await response.json();
      } catch (e) {}
      
      setTimeout(() => {
        if (validDoors.includes(path)) {
          setStatus('FOUND');
          // CORREÇÃO: Força a mensagem de sucesso se for uma porta válida da simulação, 
          // ignorando o erro que o backend real possa ter mandado.
          setBackendMsg('Rota mapeada com sucesso. O servidor entregou o recurso!');
        } else {
          setStatus('NOT_FOUND');
          // Mostra a mensagem do backend apenas se der erro real na simulação
          setBackendMsg(data.message || 'O servidor não reconhece este caminho.');
        }
      }, 2000);

    } catch (err) {
      setTimeout(() => {
        if (validDoors.includes(path)) {
          setStatus('FOUND');
          setBackendMsg('Rota mapeada com sucesso. O servidor entregou o recurso!');
        } else {
          setStatus('NOT_FOUND');
          setBackendMsg('O servidor não reconhece este caminho.');
        }
      }, 2000);
    }
  };
  
  if (!showLab) {
    return (
      <ModuleIntro 
        title="ERRO 404"
        color="#ff3b3b"
        icon={AlertCircle}
        description="O endereço que não existe mais."
        analogy="Imagine que você vai visitar um amigo, mas ele mudou de casa e não avisou. Você chega no endereço antigo e encontra a casa vazia. O erro 404 é exatamente isso: você pediu um endereço, mas o servidor não encontrou nada lá."
        onStart={() => setShowLab(true)}
      >
        <div style={{ position: 'relative', width: '250px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div animate={{ x: [-100, 50], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 3 }} style={{ position: 'absolute' }}>
            <MapPin size={40} color="var(--text-dim)" />
          </motion.div>
          <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }} style={{ zIndex: 2 }}>
            <HelpCircle size={60} color="#ff3b3b" style={{ filter: 'drop-shadow(0 0 10px rgba(255,59,59,0.8))' }} />
          </motion.div>
        </div>
      </ModuleIntro>
    );
  }

  return (
    <div className="container" style={{ padding: '4rem 2rem' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
        <Link to="/" className="btn-404 btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <Home size={16} /> VOLTAR AO HUB
        </Link>
        <button className="btn-404 btn-outline" onClick={() => { setShowLab(false); setStatus('IDLE'); setPath('/api/users/1'); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCcw size={16} /> REVER INTRO
        </button>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <motion.div 
          className="card-404" 
          animate={status === 'NOT_FOUND' ? { x: [-10, 10, -10, 10, 0] } : {}} 
          transition={{ duration: 0.4 }}
          style={{ padding: '0', overflow: 'hidden', border: status === 'NOT_FOUND' ? '1px solid #ff3b3b' : '1px solid rgba(255,255,255,0.1)' }}
        >
          
          {/* FAKE BROWSER HEADER */}
          <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff3b3b' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffcc00' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#00ff88' }}></div>
            </div>
            
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div className="glass-panel" style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: status === 'NOT_FOUND' ? '1px solid rgba(255,59,59,0.5)' : '1px solid rgba(255,255,255,0.1)' }}>
                <Globe size={16} color={status === 'NOT_FOUND' ? '#ff3b3b' : '#888'} style={{ marginRight: '0.5rem' }} />
                <span style={{ color: '#888', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>rota404.edu</span>
                <input 
                  value={path} 
                  onChange={(e) => { setPath(e.target.value); setStatus('IDLE'); }} 
                  style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }} 
                  disabled={status === 'SCANNING'}
                  placeholder="/digite-a-rota..."
                />
              </div>
            </div>

            <button 
              className="btn-404" 
              onClick={status === 'IDLE' || status === 'FOUND' || status === 'NOT_FOUND' ? handleSearch : undefined} 
              disabled={status === 'SCANNING' || !path}
              style={{ padding: '0.5rem 1.5rem', background: status === 'IDLE' ? 'var(--primary)' : (status === 'SCANNING' ? '#555' : 'transparent'), color: status === 'IDLE' ? 'black' : '#fff', border: status !== 'IDLE' && status !== 'SCANNING' ? '1px solid rgba(255,255,255,0.2)' : 'none' }}
            >
              {status === 'IDLE' ? 'ACESSAR' : (status === 'SCANNING' ? 'BUSCANDO...' : 'TENTAR OUTRA')}
            </button>
          </div>

          {/* SERVER ROUTING AREA */}
          <div style={{ padding: '3rem', position: 'relative' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <Server size={40} color={status === 'SCANNING' ? '#00f3ff' : '#666'} style={{ marginBottom: '1rem', filter: status === 'SCANNING' ? 'drop-shadow(0 0 15px rgba(0,243,255,0.8))' : 'none', transition: 'all 0.3s ease' }} />
              <h3 className="mono" style={{ color: status === 'SCANNING' ? '#00f3ff' : '#888', margin: 0, letterSpacing: '2px', transition: 'all 0.3s ease' }}>
                {status === 'IDLE' ? 'SERVIDOR AGUARDANDO REQUISIÇÃO' : (status === 'SCANNING' ? 'ANALISANDO TABELA DE ROTEAMENTO...' : 'RESPOSTA DO SERVIDOR')}
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
              
              {/* PORTAS VÁLIDAS */}
              <div style={{ position: 'relative' }}>
                <div className="mono" style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem', letterSpacing: '1px' }}>ROTAS MAPEADAS (EXISTENTES)</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  
                  {/* Scanner Overlay Line */}
                  <AnimatePresence>
                    {status === 'SCANNING' && (
                      <motion.div 
                        initial={{ top: 0, opacity: 0 }} 
                        animate={{ top: '100%', opacity: [0, 1, 1, 0] }} 
                        transition={{ duration: 1.8, ease: "linear" }}
                        style={{ position: 'absolute', width: '100%', height: '2px', background: '#00f3ff', boxShadow: '0 0 20px 5px rgba(0,243,255,0.4)', zIndex: 10, pointerEvents: 'none' }}
                      />
                    )}
                  </AnimatePresence>

                  {validDoors.map(door => {
                    const isMatched = status === 'FOUND' && path === door;
                    return (
                      <div key={door} className="glass-panel" style={{ 
                        display: 'flex', alignItems: 'center', gap: '1rem', 
                        padding: '1rem', 
                        border: isMatched ? '1px solid #00ff88' : '1px solid rgba(255,255,255,0.05)',
                        background: isMatched ? 'rgba(0,255,136,0.1)' : 'rgba(0,0,0,0.3)',
                        boxShadow: isMatched ? 'inset 0 0 20px rgba(0,255,136,0.2), 0 0 20px rgba(0,255,136,0.2)' : 'none',
                        transition: 'all 0.3s ease'
                      }}>
                        {isMatched ? <DoorOpen size={24} color="#00ff88" /> : <DoorClosed size={24} color="#555" />}
                        <span className="mono" style={{ color: isMatched ? '#00ff88' : '#888', fontSize: '1rem' }}>{door}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RESULTADO DA BUSCA / VOID 404 */}
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="mono" style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem', letterSpacing: '1px' }}>SAÍDA (OUTPUT)</div>
                
                <div className="glass-panel" style={{ 
                  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem',
                  background: status === 'FOUND' ? 'rgba(0,255,136,0.05)' : (status === 'NOT_FOUND' ? 'rgba(255,59,59,0.05)' : 'rgba(0,0,0,0.3)'),
                  border: status === 'FOUND' ? '1px dashed #00ff88' : (status === 'NOT_FOUND' ? '1px dashed #ff3b3b' : '1px dashed rgba(255,255,255,0.1)'),
                  transition: 'all 0.4s ease'
                }}>
                  
                  {status === 'IDLE' && (
                    <span style={{ color: '#555', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>Esperando requisição...</span>
                  )}

                  {status === 'SCANNING' && (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                      <Search size={40} color="#00f3ff" style={{ opacity: 0.5 }} />
                    </motion.div>
                  )}

                  {status === 'FOUND' && (
                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                      <CheckCircle size={60} color="#00ff88" style={{ marginBottom: '1rem', filter: 'drop-shadow(0 0 10px rgba(0,255,136,0.5))' }} />
                      <h2 style={{ color: '#00ff88', margin: '0 0 0.5rem 0', textShadow: '0 0 10px rgba(0,255,136,0.3)' }}>200 OK</h2>
                      <p className="mono" style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>{backendMsg}</p>
                    </motion.div>
                  )}

                  {status === 'NOT_FOUND' && (
                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                      <FileX size={60} color="#ff3b3b" style={{ marginBottom: '1rem', filter: 'drop-shadow(0 0 10px rgba(255,59,59,0.5))' }} />
                      <h2 style={{ color: '#ff3b3b', margin: '0 0 0.5rem 0', textShadow: '0 0 10px rgba(255,59,59,0.3)' }}>404 NOT FOUND</h2>
                      <p className="mono" style={{ color: '#ff3b3b', opacity: 0.8, fontSize: '0.85rem', margin: 0 }}>{backendMsg}</p>
                    </motion.div>
                  )}

                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Error404Module;