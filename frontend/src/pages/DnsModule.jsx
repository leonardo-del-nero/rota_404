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
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
        <Link to="/" className="btn-404 btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <Home size={16} /> VOLTAR AO HUB
        </Link>
        <button className="btn-404 btn-outline" onClick={() => { setShowLab(false); setStep(0); setResult(null); setUrl(''); setSearchLogs([]); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCcw size={16} /> REVER INTRO
        </button>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div className="card-404" style={{ padding: '3rem', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ color: '#ff6b00', marginBottom: '1rem', textShadow: '0 0 20px rgba(255,107,0,0.3)' }}>LABORATÓRIO DE DNS</h2>
            <p style={{ color: '#888', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>Veja a tradução de domínios acontecendo em tempo real.</p>
          </div>

          {/* User (Left) ----- DNS Server (Right) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0 2rem', marginBottom: '5rem', minHeight: '180px' }}>
            
            {/* User */}
            <div style={{ textAlign: 'center', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="glass-panel" style={{ width: '90px', height: '90px', borderRadius: '50%', border: '1px solid rgba(255,107,0,0.4)', background: 'rgba(255,107,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: 'inset 0 0 20px rgba(255,107,0,0.1)' }}>
                <User size={40} color="#ff6b00" style={{ filter: 'drop-shadow(0 0 8px rgba(255,107,0,0.6))' }} />
              </div>
              <div className="mono" style={{ fontSize: '0.85rem', color: '#ff6b00', letterSpacing: '2px' }}>USUÁRIO</div>
            </div>

            {/* Path */}
            <div style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg, rgba(255, 107, 0, 0.3), rgba(255, 107, 0, 0.05), rgba(255, 107, 0, 0.3))', margin: '45px 2rem 0', position: 'relative' }}>
              <AnimatePresence>
                {step === 1 && (
                  <motion.div initial={{ left: 0 }} animate={{ left: '100%' }} transition={{ duration: 1.5, ease: 'linear' }} style={{ position: 'absolute', top: '-25px', display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'translateX(-50%)' }}>
                    <Search size={24} color="#ff6b00" style={{ marginBottom: '5px' }} />
                    <div className="glass-panel" style={{ background: 'rgba(255,107,0,0.2)', padding: '6px 15px', border: '1px solid #ff6b00', color: '#ffcc00', fontSize: '0.75rem', fontWeight: 'bold', boxShadow: '0 0 15px rgba(255,107,0,0.4)', whiteSpace: 'nowrap' }}>QUEM É {url}?</div>
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div initial={{ left: '100%' }} animate={{ left: 0 }} transition={{ duration: 1.5, ease: 'linear' }} style={{ position: 'absolute', top: '-25px', display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'translateX(-50%)' }}>
                    <Globe size={24} color="#00ff88" style={{ marginBottom: '5px' }} />
                    <div className="glass-panel" style={{ background: 'rgba(0,255,136,0.2)', padding: '6px 15px', border: '1px solid #00ff88', color: '#00ff88', fontSize: '0.75rem', fontWeight: 'bold', boxShadow: '0 0 15px rgba(0,255,136,0.4)', whiteSpace: 'nowrap' }}>IP: {result}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* DNS Server */}
            <div style={{ textAlign: 'center', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '220px' }}>
              <motion.div className="glass-panel" animate={{ scale: step === 2 ? [1, 1.05, 1] : 1 }} transition={{ repeat: step === 2 ? Infinity : 0, duration: 1 }} style={{ width: '90px', height: '90px', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: `1px solid ${step >= 2 && step <=3 ? '#ff6b00' : 'rgba(255,255,255,0.1)'}`, background: step >= 2 && step <=3 ? 'rgba(255,107,0,0.1)' : 'rgba(0,0,0,0.4)', boxShadow: step >= 2 && step <=3 ? '0 0 30px rgba(255,107,0,0.3)' : 'none' }}>
                <Server size={40} color={step >= 2 && step <=3 ? '#ff6b00' : '#888'} style={{ filter: step >= 2 && step <=3 ? 'drop-shadow(0 0 8px rgba(255,107,0,0.6))' : 'none' }} />
              </motion.div>
              <div className="mono" style={{ fontSize: '0.85rem', color: '#ff6b00', letterSpacing: '2px', marginBottom: '1rem' }}>SERVIDOR DNS</div>
              
              {/* Terminal interativo educacional */}
              <div style={{ height: '100px', width: '100%', opacity: step >= 2 ? 1 : 0, transition: 'opacity 0.3s ease' }}>
                {step >= 2 && (
                  <div className="glass-panel mono" style={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,107,0,0.3)', padding: '10px', fontSize: '0.7rem', color: '#00ff88', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px', color: '#ff6b00', borderBottom: '1px solid rgba(255,107,0,0.3)', paddingBottom: '3px' }}>
                      <Terminal size={12} /> <span>LOG DE RESOLUÇÃO</span>
                    </div>
                    {searchLogs.map((log, index) => (
                      <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>{log}</motion.div>
                    ))}
                    {step === 2 && searchLogs.length > 0 && searchLogs.length < 5 && (
                      <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }}>_</motion.div>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '600px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input 
                  className="input-404"
                  placeholder="Ex: google.com ou netflix.com"
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); setStep(0); setResult(null); setSearchLogs([]); }}
                  style={{ paddingLeft: '3.5rem', fontSize: '1.1rem', textTransform: 'lowercase' }}
                  disabled={step > 0 && step < 4}
                />
                <Globe size={22} style={{ position: 'absolute', left: '1.2rem', top: '1.2rem', color: '#ff6b00' }} />
              </div>
              <button className="btn-404" onClick={handleLookup} disabled={(step > 0 && step < 4) || !url} style={{ padding: '0 2.5rem' }}>
                {step > 0 && step < 4 ? 'BUSCANDO...' : 'TRADUZIR'}
              </button>
            </div>

            {step === 4 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '3rem', textAlign: 'center', width: '100%', maxWidth: '600px', background: 'rgba(0,0,0,0.6)', border: `1px solid ${isValidIp ? 'rgba(0,255,136,0.3)' : 'rgba(255,59,59,0.3)'}`, boxShadow: `inset 0 0 30px ${isValidIp ? 'rgba(0,255,136,0.1)' : 'rgba(255,59,59,0.1)'}` }}>
                <div className="mono" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem', letterSpacing: '2px' }}>RESULTADO DA RESOLUÇÃO:</div>
                <div style={{ fontSize: '3rem', color: isValidIp ? '#00ff88' : 'var(--danger)', fontFamily: 'var(--font-mono)', marginBottom: '2rem', textShadow: `0 0 20px ${isValidIp ? 'rgba(0,255,136,0.5)' : 'rgba(255,59,59,0.5)'}`, wordBreak: 'break-all' }}>{result}</div>
                
                {isValidIp && (
                  <button 
                    className="btn-404" 
                    onClick={() => window.open(`http://${result}`, '_blank')}
                    style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid #00ff88', color: '#00ff88', display: 'inline-flex', alignItems: 'center', gap: '0.8rem', padding: '1rem 2rem', clipPath: 'none', borderRadius: '8px' }}
                  >
                    <ExternalLink size={20} /> ACESSAR IP DIRETAMENTE
                  </button>
                )}
                
                {!isValidIp && (
                  <p style={{ color: 'var(--danger)', fontSize: '1.1rem', background: 'rgba(255,59,59,0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,59,59,0.2)' }}>
                    O Servidor DNS não encontrou registros para este domínio.
                  </p>
                )}
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DnsModule;