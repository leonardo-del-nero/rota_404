import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Server, Search, Home, RefreshCcw, Contact } from 'lucide-react';
import ModuleIntro from '../components/ModuleIntro';

const DnsModule = () => {
  const [showLab, setShowLab] = useState(false);
  const [url, setUrl] = useState('');
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);

  const handleLookup = async () => {
    setStep(1);
    setResult(null);
    
    // Simulate steps with real data from backend
    setTimeout(() => setStep(2), 1500);
    
    try {
      const response = await fetch('/api/dns-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: url })
      });
      const data = await response.json();
      
      setTimeout(() => setStep(3), 3000);
      setTimeout(() => {
        setStep(4);
        setResult(data.ip);
      }, 4500);
    } catch (err) {
      setStep(4);
      setResult('ERRO_CONEXÃO');
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
            <Contact size={80} color="#ff6b00" />
            <motion.div animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }} transition={{ repeat: Infinity, duration: 2 }} style={{ position: 'absolute', top: -20, right: -20 }}>
              <Search size={30} color="white" />
            </motion.div>
          </motion.div>
          <div style={{ fontSize: '2rem', color: '#444' }}>➔</div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="mono" style={{ fontSize: '1.5rem', color: '#00ff88', border: '1px solid #00ff8833', padding: '1rem', borderRadius: '8px' }}>
            142.250.190.46
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
        <button className="btn-404 btn-outline" onClick={() => { setShowLab(false); setStep(0); setResult(null); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCcw size={16} /> REVER INTRO
        </button>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="card-404" style={{ padding: '3rem', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ color: '#ff6b00', marginBottom: '1rem' }}>LABORATÓRIO DE BUSCA</h2>
            <p style={{ color: 'var(--text-dim)' }}>Tente encontrar o endereço de IP de um site!</p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '5rem' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input 
                className="input-404"
                placeholder="Ex: google.com ou youtube.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                style={{ paddingLeft: '3rem' }}
              />
              <Globe size={18} style={{ position: 'absolute', left: '1rem', top: '1.2rem', color: '#ff6b00' }} />
            </div>
            <button className="btn-404" onClick={handleLookup} disabled={step > 0 && step < 4}>
              {step > 0 && step < 4 ? 'BUSCANDO...' : 'PROCURAR NA LISTA'}
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <motion.div animate={{ scale: step === 1 ? 1.2 : 1 }} style={{ width: '70px', height: '70px', background: 'var(--bg-accent)', borderRadius: '12px', border: `2px solid ${step >= 1 ? '#ff6b00' : '#333'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Globe size={30} color={step >= 1 ? '#ff6b00' : '#444'} />
              </motion.div>
              <div className="mono" style={{ fontSize: '0.6rem' }}>SEU NAVEGADOR</div>
            </div>

            <div style={{ flex: 1, height: '2px', background: '#222', margin: '0 1.5rem', position: 'relative' }}>
              <AnimatePresence>
                {step === 1 && (
                  <motion.div initial={{ left: 0 }} animate={{ left: '100%' }} style={{ position: 'absolute', top: '-15px' }}>
                    <div style={{ background: '#ff6b00', padding: '4px 10px', borderRadius: '4px', color: 'black', fontSize: '0.7rem', fontWeight: 'bold' }}>QUEM É {url}?</div>
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div initial={{ right: 0 }} animate={{ right: '100%' }} style={{ position: 'absolute', top: '-15px' }}>
                    <div style={{ background: '#00ff88', padding: '4px 10px', borderRadius: '4px', color: 'black', fontSize: '0.7rem', fontWeight: 'bold' }}>IP: {result}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div style={{ textAlign: 'center' }}>
              <motion.div animate={{ rotate: step === 2 ? 360 : 0 }} transition={{ repeat: step === 2 ? Infinity : 0, duration: 1 }} style={{ width: '70px', height: '70px', background: 'var(--bg-accent)', borderRadius: '12px', border: `2px solid ${step >= 2 ? '#ff6b00' : '#333'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Server size={30} color={step >= 2 ? '#ff6b00' : '#444'} />
              </motion.div>
              <div className="mono" style={{ fontSize: '0.6rem' }}>LISTA TELEFÔNICA (DNS)</div>
            </div>
          </div>

          {step === 4 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '5rem', textAlign: 'center', background: 'rgba(0,0,0,0.4)', padding: '2rem', borderRadius: '12px', border: '1px solid #ff6b0033' }}>
              <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>RESPOSTA DO SERVIDOR:</div>
              <div style={{ fontSize: '2.5rem', color: result === 'IP_NÃO_ENCONTRADO' ? 'var(--danger)' : '#00ff88', fontFamily: 'var(--font-mono)' }}>{result}</div>
              <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                {result === 'IP_NÃO_ENCONTRADO' 
                  ? "Ops! Esse nome não está na nossa lista. Verifique se digitou corretamente." 
                  : `Sucesso! Agora seu navegador sabe que para chegar em "${url}" ele deve ir para o endereço "${result}".`}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DnsModule;
