import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Minimize2, Maximize2, Zap, Package } from 'lucide-react';
import ModuleIntro from '../components/ModuleIntro';

const CompressionModule = () => {
  const [showLab, setShowLab] = useState(false);
  const [text, setText] = useState('AAAABBBCCDDDDD');
  const [compressed, setCompressed] = useState(false);

  const compressText = (str) => {
    let result = '';
    let count = 1;
    for (let i = 0; i < str.length; i++) {
      if (str[i] === str[i + 1]) {
        count++;
      } else {
        result += count + str[i];
        count = 1;
      }
    }
    return result;
  };

  if (!showLab) {
    return (
      <ModuleIntro 
        title="COMPRESSÃO: A ARTE DE EMPACOTAR"
        color="#ff3b3b"
        description="Como fazer arquivos gigantes ficarem pequenos para enviar mais rápido?"
        analogy="Imagine que você vai viajar e quer levar 10 camisetas iguais. Em vez de dobrar uma por uma e ocupar toda a mala, você coloca todas num saco a vácuo e tira o ar. Elas ocupam muito menos espaço, mas continuam sendo 10 camisetas. A compressão faz isso com os dados!"
        onStart={() => setShowLab(true)}
      />
    );
  }

  const ratio = (1 - compressText(text).length / text.length) * 100;

  return (
    <div className="container" style={{ padding: '4rem 2rem' }}>
      <button className="btn-404" onClick={() => setShowLab(false)} style={{ marginBottom: '3rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft size={16} /> VOLTAR PARA INTRO
      </button>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="card-404" style={{ padding: '3rem', textAlign: 'center' }}>
          <h2 style={{ color: '#ff3b3b', marginBottom: '2rem' }}>DESAFIO DA MALA DIGITAL</h2>
          
          <div style={{ marginBottom: '3rem' }}>
            <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem' }}>Digite letras repetidas para ver como o algoritmo as "compacta":</p>
            <input 
              className="input-404"
              value={text}
              onChange={(e) => setText(e.target.value.toUpperCase())}
              placeholder="Ex: AAAAAAABBBBBCC"
              style={{ fontSize: '1.5rem', textAlign: 'center', maxWidth: '500px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', marginBottom: '4rem' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
               <div className="mono" style={{ fontSize: '0.7rem', color: '#ff3b3b', marginBottom: '0.5rem', textAlign: 'left' }}>
                TAMANHO NA MALA: {compressed ? compressText(text).length : text.length} UNIDADES
              </div>
              <motion.div 
                animate={{ scaleX: compressed ? (compressText(text).length / text.length) : 1 }}
                style={{ height: '60px', background: 'linear-gradient(90deg, #ff3b3b, #990000)', borderRadius: '8px', position: 'relative', transformOrigin: 'left' }}
              >
                <div className="mono" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                  {compressed ? compressText(text) : text}
                </div>
              </motion.div>
            </div>

            <button 
              className="btn-404" 
              onClick={() => setCompressed(!compressed)}
              style={{ background: compressed ? '#ff3b3b' : 'var(--bg-accent)', color: compressed ? 'black' : 'white', padding: '1rem 3rem' }}
            >
              {compressed ? 'DESCOMPACTAR MALA' : 'COMPACTAR A VÁCUO (ZIP)'}
            </button>
          </div>

          <AnimatePresence>
            {compressed && ratio > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid #00ff88', padding: '2rem', borderRadius: '12px' }}>
                  <div style={{ fontSize: '2rem', color: '#00ff88', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    ECONOMIA DE {ratio.toFixed(0)}%!
                  </div>
                  <p style={{ color: 'var(--text-dim)' }}>
                    Excelente! Com essa compressão, você enviaria o mesmo conteúdo gastando muito menos internet.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CompressionModule;
