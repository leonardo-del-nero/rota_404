import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, AlertCircle, Home, RefreshCcw, HelpCircle } from 'lucide-react';
import ModuleIntro from '../components/ModuleIntro';

const Error404Module = () => {
  const [showLab, setShowLab] = useState(false);
  const [path, setPath] = useState('/fotos/viagem');
  const [status, setStatus] = useState('IDLE');
  const [backendMsg, setBackendMsg] = useState('');

  const handleSearch = async () => {
    setStatus('SEARCHING');
    setBackendMsg('');
    
    try {
      const response = await fetch('/api/route-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: path })
      });
      const data = await response.json();
      
      setTimeout(() => {
        if (response.ok) {
          setStatus('FOUND');
        } else {
          setStatus('NOT_FOUND');
        }
        setBackendMsg(data.message);
      }, 2500);
    } catch (err) {
      setStatus('NOT_FOUND');
      setBackendMsg('Falha na comunicação com o servidor.');
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
            <HelpCircle size={60} color="#ff3b3b" />
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
        <button className="btn-404 btn-outline" onClick={() => { setShowLab(false); setStatus('IDLE'); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCcw size={16} /> REVER INTRO
        </button>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card-404" style={{ padding: '3rem', position: 'relative', overflow: 'hidden' }}>
          <h2 style={{ color: '#ff3b3b', textAlign: 'center', marginBottom: '3rem' }}>LABORATÓRIO DE ROTAS</h2>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '4rem' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '1rem', color: '#666', fontSize: '0.9rem' }}>rota404.edu</span>
              <input className="input-404" value={path} onChange={(e) => setPath(e.target.value)} style={{ paddingLeft: '7.5rem' }} />
            </div>
            <button className="btn-404" onClick={handleSearch} disabled={status === 'SEARCHING'}>ACESSAR ROTA</button>
          </div>

          <div style={{ height: '300px', background: '#000', borderRadius: '12px', border: '1px solid #333', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AnimatePresence>
              {status === 'SEARCHING' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center' }}>
                  <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
                    <Search size={48} />
                  </motion.div>
                  <div className="mono" style={{ fontSize: '0.8rem' }}>CONSULTANDO SERVIDOR PYTHON...</div>
                </motion.div>
              )}

              {(status === 'NOT_FOUND' || status === 'FOUND') && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
                  <h1 style={{ fontSize: '5rem', color: status === 'FOUND' ? '#00ff88' : '#ff3b3b', margin: 0 }}>{status === 'FOUND' ? '200' : '404'}</h1>
                  <div className="mono" style={{ color: status === 'FOUND' ? '#00ff88' : '#ff3b3b', fontWeight: 'bold', marginBottom: '1.5rem' }}>{status === 'FOUND' ? 'OK: FOUND' : 'ERROR: NOT FOUND'}</div>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{backendMsg}</p>
                  <button className="btn-404" onClick={() => setStatus('IDLE')} style={{ marginTop: '2rem', background: 'transparent', border: '1px solid #333' }}>TENTAR NOVAMENTE</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error404Module;
