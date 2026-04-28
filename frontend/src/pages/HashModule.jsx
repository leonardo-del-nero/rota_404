import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Fingerprint, FileText, Home, RefreshCcw, User, Server, Moon } from 'lucide-react';
import ModuleIntro from '../components/ModuleIntro';

const HashModule = () => {
  const [showLab, setShowLab] = useState(false);
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('...');
  const [isHashingOn, setIsHashingOn] = useState(true);
  const [status, setStatus] = useState('IDLE'); // IDLE, SENDING_TO_HASH, PROCESSING, SENDING_TO_DEST, DONE

  const handleSend = async () => {
    if (!input || (status !== 'IDLE' && status !== 'DONE')) return;
    
    setStatus('SENDING_TO_HASH');
    setHash('...');
    
    // Step 1: Package travels from User to Hash Function
    setTimeout(async () => {
      setStatus('PROCESSING');
      
      if (!isHashingOn) {
        // Step 2 (Off): Passes through quickly
        setTimeout(() => {
          setStatus('SENDING_TO_DEST');
          setTimeout(() => {
            setHash(input);
            setStatus('DONE');
          }, 1000);
        }, 300);
      } else {
        // Step 2 (On): Processing
        try {
          const response = await fetch('/api/hash', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: input })
          });
          const data = await response.json();
          
          // Minimum processing time for visibility
          setTimeout(() => {
            setStatus('SENDING_TO_DEST');
            setTimeout(() => {
              setHash(data.hash.toUpperCase());
              setStatus('DONE');
            }, 1000);
          }, 800);
        } catch (err) {
          setTimeout(() => {
            setStatus('SENDING_TO_DEST');
            setTimeout(() => {
              setHash('ERRO_CONEXÃO');
              setStatus('DONE');
            }, 1000);
          }, 500);
        }
      }
    }, 1000); // Reduced from 1500ms
  };

  if (!showLab) {
    return (
      <ModuleIntro 
        title="DNA DIGITAL"
        color="#ffcc00"
        icon={Fingerprint}
        description="A prova de que nada foi alterado."
        analogy="O Hash é como a impressão digital de um arquivo. Se você mudar um único milímetro no seu dedo, a digital muda completamente. Na internet, se você mudar uma única letra num arquivo, o Hash muda e você sabe na hora que ele foi mexido."
        onStart={() => setShowLab(true)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <FileText size={80} color="#ffcc00" style={{ filter: 'drop-shadow(0 0 10px rgba(255,204,0,0.5))' }} />
          </motion.div>
          <div style={{ fontSize: '2rem', color: '#444' }}>➔</div>
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, type: 'spring' }} style={{ padding: '20px', background: 'rgba(255, 204, 0, 0.1)', borderRadius: '50%', border: '2px dashed #ffcc00', boxShadow: '0 0 30px rgba(255,204,0,0.2)' }}>
            <Fingerprint size={60} color="#ffcc00" />
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
        <button className="btn-404 btn-outline" onClick={() => { setShowLab(false); setInput(''); setIsHashingOn(true); setStatus('IDLE'); setHash('...'); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCcw size={16} /> REVER INTRO
        </button>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div className="card-404" style={{ padding: '3rem' }}>
          <h2 style={{ color: '#ffcc00', textAlign: 'center', marginBottom: '3rem', textShadow: '0 0 20px rgba(255,204,0,0.3)' }}>LABORATÓRIO DE HASH</h2>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4rem' }}>
            <button 
              className="glass-panel" 
              // BUG CORRIGIDO: Permite clicar se estiver IDLE ou DONE
              onClick={() => { if(status === 'IDLE' || status === 'DONE') setIsHashingOn(!isHashingOn); }}
              disabled={status !== 'IDLE' && status !== 'DONE'}
              style={{ 
                padding: '1rem 3rem',
                border: `1px solid ${isHashingOn ? '#ffcc00' : 'rgba(255,255,255,0.1)'}`,
                background: isHashingOn ? 'rgba(255,204,0,0.1)' : 'rgba(0,0,0,0.5)',
                color: isHashingOn ? '#ffcc00' : '#888',
                cursor: (status === 'IDLE' || status === 'DONE') ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-title)',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease',
                boxShadow: isHashingOn ? '0 0 20px rgba(255,204,0,0.2)' : 'none',
                display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}
            >
              {isHashingOn ? <Zap size={18} /> : <Moon size={18} />}
              HASHING: {isHashingOn ? 'LIGADO' : 'DESLIGADO'}
            </button>
          </div>

          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5rem', padding: '0 2rem' }}>
            
            {/* Glowing Connection Lines */}
            <div style={{ position: 'absolute', top: '50%', left: '100px', right: '100px', height: '2px', background: 'linear-gradient(90deg, transparent, rgba(255, 204, 0, 0.3), transparent)', zIndex: 0 }}>
              <AnimatePresence>
                {status === 'SENDING_TO_HASH' && (
                  <motion.div 
                    // ANIMAÇÃO CORRIGIDA: Esquerda para o Meio
                    initial={{ left: '0%' }}
                    animate={{ left: '50%' }}
                    transition={{ duration: 1, ease: "linear" }}
                    style={{ position: 'absolute', top: '-18px', transform: 'translateX(-50%)', zIndex: 5 }}
                  >
                    <div className="glass-panel" style={{ background: 'rgba(255,204,0,0.2)', padding: '6px 15px', border: '1px solid #ffcc00', color: '#ffcc00', fontSize: '0.75rem', fontWeight: 'bold', boxShadow: '0 0 15px rgba(255,204,0,0.4)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {input}
                    </div>
                  </motion.div>
                )}
                {status === 'SENDING_TO_DEST' && (
                  <motion.div 
                    // ANIMAÇÃO CORRIGIDA: Meio para a Direita
                    initial={{ left: '50%' }}
                    animate={{ left: '100%' }}
                    transition={{ duration: 1, ease: "linear" }}
                    style={{ position: 'absolute', top: '-18px', transform: 'translateX(-50%)', zIndex: 5 }}
                  >
                    <div className="glass-panel" style={{ background: isHashingOn ? 'rgba(0,255,136,0.2)' : 'rgba(255,204,0,0.2)', padding: '6px 15px', border: `1px solid ${isHashingOn ? '#00ff88' : '#ffcc00'}`, color: isHashingOn ? '#00ff88' : '#ffcc00', fontSize: '0.75rem', fontWeight: 'bold', boxShadow: `0 0 15px ${isHashingOn ? 'rgba(0,255,136,0.4)' : 'rgba(255,204,0,0.4)'}`, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {isHashingOn ? '###' : input}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User (AGORA NA ESQUERDA) */}
            <div style={{ zIndex: 1, textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="glass-panel" style={{ width: '90px', height: '90px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid rgba(255,204,0,0.4)', background: 'rgba(255,204,0,0.05)', boxShadow: 'inset 0 0 20px rgba(255,204,0,0.1)' }}>
                <User size={40} color="#ffcc00" style={{ filter: 'drop-shadow(0 0 8px rgba(255,204,0,0.6))' }} />
              </div>
              <div className="mono" style={{ fontSize: '0.85rem', color: '#ffcc00', letterSpacing: '2px' }}>USUÁRIO</div>
            </div>

            {/* Hash Function (Continua no Meio) */}
            <div style={{ zIndex: 1, textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="glass-panel" style={{ 
                width: '120px', height: '120px', 
                background: status === 'PROCESSING' && isHashingOn ? 'rgba(255,204,0,0.3)' : (isHashingOn ? 'rgba(255,204,0,0.1)' : 'rgba(0,0,0,0.6)'), 
                borderRadius: '50%', 
                border: `2px dashed ${isHashingOn ? '#ffcc00' : 'rgba(255,255,255,0.1)'}`, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
                position: 'relative',
                boxShadow: status === 'PROCESSING' && isHashingOn ? '0 0 60px rgba(255,204,0,0.5)' : (isHashingOn ? '0 0 40px rgba(255,204,0,0.2)' : 'none'),
                transition: 'all 0.3s ease'
              }}>
                {isHashingOn ? (
                  <motion.div animate={{ rotate: status === 'PROCESSING' ? 360 : 0, scale: status === 'PROCESSING' ? 1.2 : 1 }} transition={{ repeat: status === 'PROCESSING' ? Infinity : 0, duration: 1 }}>
                    <Fingerprint size={50} color="#ffcc00" style={{ filter: 'drop-shadow(0 0 10px rgba(255,204,0,0.5))' }} />
                  </motion.div>
                ) : (
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}>
                    <Moon size={40} color="#555" />
                    <motion.div animate={{ opacity: [0, 1, 0], y: [0, -10] }} transition={{ repeat: Infinity, duration: 2 }} style={{ position: 'absolute', top: -10, right: 10, color: '#555', fontSize: '1rem', fontFamily: 'var(--font-mono)' }}>zZz</motion.div>
                  </motion.div>
                )}
              </div>
              <div className="mono" style={{ fontSize: '0.85rem', color: isHashingOn ? '#ffcc00' : '#555', letterSpacing: '2px' }}>FUNÇÃO HASH</div>
            </div>

            {/* Destination (AGORA NA DIREITA) */}
            <div style={{ zIndex: 1, textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="glass-panel" style={{ width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid rgba(255,204,0,0.4)', background: 'rgba(255,204,0,0.05)', boxShadow: 'inset 0 0 20px rgba(255,204,0,0.1)' }}>
                <Server size={40} color="#ffcc00" style={{ filter: 'drop-shadow(0 0 8px rgba(255,204,0,0.6))' }} />
              </div>
              <div className="mono" style={{ fontSize: '0.85rem', color: '#ffcc00', letterSpacing: '2px' }}>DESTINO</div>
            </div>

          </div>

          {/* PAINÉIS INVERTIDOS (Input na Esquerda, Output na Direita) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            
            {/* INPUT DO USUÁRIO */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
              <label className="mono" style={{ display: 'block', marginBottom: '1rem', color: 'rgba(255,204,0,0.8)', fontSize: '0.8rem', letterSpacing: '1px' }}>INPUT DO USUÁRIO:</label>
              <textarea 
                className="input-404"
                value={input}
                onChange={(e) => { setInput(e.target.value); setStatus('IDLE'); setHash('...'); }}
                disabled={status !== 'IDLE' && status !== 'DONE'}
                placeholder="Digite algo para enviar..."
                style={{ height: '120px', fontSize: '1.1rem', resize: 'none', marginBottom: '1rem' }}
              />
              <button 
                className="btn-404" 
                onClick={handleSend} 
                disabled={(status !== 'IDLE' && status !== 'DONE') || !input}
              >
                {status === 'IDLE' || status === 'DONE' ? 'ENVIAR INFORMAÇÃO' : 'PROCESSANDO...'}
              </button>
            </div>

            {/* INFORMAÇÃO QUE CHEGOU */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
              <label className="mono" style={{ display: 'block', marginBottom: '1rem', color: 'rgba(255,204,0,0.8)', fontSize: '0.8rem', letterSpacing: '1px' }}>INFORMAÇÃO QUE CHEGOU:</label>
              <div className="glass-panel mono" style={{ 
                padding: '2rem', 
                wordBreak: 'break-all',
                color: '#ffcc00',
                fontSize: '1.1rem',
                minHeight: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255,204,0,0.2)',
                background: 'rgba(0,0,0,0.6)',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
              }}>
                {hash}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default HashModule;