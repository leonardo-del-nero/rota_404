import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Fingerprint, FileText, Home, RefreshCcw } from 'lucide-react';
import ModuleIntro from '../components/ModuleIntro';

const HashModule = () => {
  const [showLab, setShowLab] = useState(false);
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('...');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHash = async () => {
      if (!input) {
        setHash('AGUARDANDO_DADOS...');
        return;
      }
      setLoading(true);
      try {
        const response = await fetch('/api/hash', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: input })
        });
        const data = await response.json();
        setHash(data.hash.toUpperCase());
      } catch (err) {
        setHash('ERRO_CONEXÃO');
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchHash, 300);
    return () => clearTimeout(timeout);
  }, [input]);

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
            <FileText size={80} color="#ffcc00" />
          </motion.div>
          <div style={{ fontSize: '2rem', color: '#444' }}>➔</div>
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, type: 'spring' }} style={{ padding: '20px', background: 'rgba(255, 204, 0, 0.1)', borderRadius: '50%', border: '2px dashed #ffcc00' }}>
            <Fingerprint size={60} color="#ffcc00" />
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
        <button className="btn-404 btn-outline" onClick={() => { setShowLab(false); setInput(''); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCcw size={16} /> REVER INTRO
        </button>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="card-404" style={{ padding: '3rem' }}>
          <h2 style={{ color: '#ffcc00', textAlign: 'center', marginBottom: '3rem' }}>LABORATÓRIO DE DIGITAIS</h2>

          <div style={{ marginBottom: '3rem' }}>
            <label className="mono" style={{ display: 'block', marginBottom: '1rem', color: '#ffcc00', fontSize: '0.8rem' }}>COLOQUE SEUS DADOS NA MÁQUINA:</label>
            <textarea 
              className="input-404"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite um texto aqui..."
              style={{ height: '100px', fontSize: '1.2rem', textAlign: 'center' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            <div style={{ width: '100px', height: '100px', background: 'rgba(255,204,0,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #ffcc00' }}>
              <motion.div animate={{ rotate: loading ? 360 : 0 }} transition={{ repeat: loading ? Infinity : 0, duration: 1 }}>
                <Fingerprint size={50} color="#ffcc00" />
              </motion.div>
            </div>

            <div style={{ width: '100%' }}>
              <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.5rem', textAlign: 'center' }}>ASSINATURA GERADA (SHA-256) PELO PYTHON:</div>
              <div className="mono" style={{ 
                background: '#000', 
                padding: '2rem', 
                borderRadius: '12px', 
                border: '1px solid #ffcc0033',
                wordBreak: 'break-all',
                color: '#ffcc00',
                textAlign: 'center',
                fontSize: '1rem',
                minHeight: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
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
