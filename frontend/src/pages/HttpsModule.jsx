import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Key, Home, RefreshCcw, Mail } from 'lucide-react';
import ModuleIntro from '../components/ModuleIntro';

const HttpsModule = () => {
  const [showLab, setShowLab] = useState(false);
  const [message, setMessage] = useState('');
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [encryptedText, setEncryptedText] = useState('');

  const handleToggle = async () => {
    if (!isEncrypted) {
      // Encrypt via backend
      try {
        const response = await fetch('/api/https-encrypt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: message })
        });
        const data = await response.json();
        setEncryptedText(data.encrypted);
        setIsEncrypted(true);
      } catch (err) {
        alert("Erro ao conectar com o backend.");
      }
    } else {
      setIsEncrypted(false);
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
        <button className="btn-404 btn-outline" onClick={() => { setShowLab(false); setIsEncrypted(false); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCcw size={16} /> REVER INTRO
        </button>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="card-404" style={{ padding: '3rem', textAlign: 'center' }}>
          <h2 style={{ color: '#00ff88', marginBottom: '3rem' }}>TESTE O COFRE DIGITAL</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
            <div className="card-404" style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem' }}>
              <div className="mono" style={{ fontSize: '0.7rem', marginBottom: '1rem', color: '#00ff88' }}>SUA VISÃO (SEGURO)</div>
              <textarea 
                className="input-404"
                placeholder="Escreva algo secreto..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ height: '120px', fontSize: '1rem' }}
              />
            </div>

            <div className="card-404" style={{ background: 'rgba(255,0,0,0.05)', padding: '1.5rem', border: '1px solid rgba(255,0,0,0.2)' }}>
              <div className="mono" style={{ fontSize: '0.7rem', marginBottom: '1rem', color: 'var(--danger)' }}>VISÃO DE UM HACKER (NA REDE)</div>
              <div className="mono" style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', borderRadius: '4px', padding: '1rem', overflow: 'hidden', color: isEncrypted ? 'var(--text-dim)' : 'var(--danger)' }}>
                {isEncrypted ? encryptedText : message || 'Aguardando dados...'}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '4rem' }}>
            <motion.div animate={{ y: isEncrypted ? [0, -10, 0] : 0 }} transition={{ repeat: isEncrypted ? Infinity : 0, duration: 2 }} style={{ display: 'inline-block', color: isEncrypted ? '#00ff88' : 'var(--danger)', marginBottom: '1rem' }}>
              {isEncrypted ? <Lock size={80} /> : <Unlock size={80} />}
            </motion.div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button className="btn-404" onClick={handleToggle} style={{ background: isEncrypted ? 'var(--danger)' : '#00ff88', color: 'black', padding: '1.5rem 3rem', fontSize: '1rem' }}>
                {isEncrypted ? 'ABRIR COFRE (HTTP)' : 'TRANCAR COFRE (HTTPS)'}
              </button>
            </div>
          </div>

          <div className="didactic-bubble">
            {isEncrypted 
              ? "Viu só? O backend Python processou sua mensagem e 'trancou' ela. Agora o hacker só vê lixo eletrônico!" 
              : "Sem o cofre, seus dados viajam 'pelados' pela rede. Qualquer um pode ver sua senha!"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HttpsModule;
