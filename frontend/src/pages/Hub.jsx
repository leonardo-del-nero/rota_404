import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hash, Cpu, Globe, Lock, AlertCircle, ArrowRight } from 'lucide-react';

const Hub = () => {
  const modules = [
    {
      id: 'hash',
      title: 'DNA DIGITAL',
      tag: 'SEGURANÇA',
      desc: 'Como saber se um arquivo foi mexido? O Hash cria uma assinatura única que dedura qualquer mudança!',
      path: '/hash',
      icon: <Hash size={24} />,
      color: 'var(--primary)'
    },
    {
      id: 'api',
      title: 'GARÇOM DIGITAL',
      tag: 'API & JSON',
      desc: 'Descubra como o seu computador faz "pedidos" para os sites e recebe as informações de volta.',
      path: '/api-concept',
      icon: <Cpu size={24} />,
      color: 'var(--secondary)'
    },
    {
      id: 'dns',
      title: 'DNS LOOKUP',
      tag: 'NAVEGAÇÃO',
      desc: 'A lista telefônica da internet que traduz nomes em IPs.',
      path: '/dns',
      icon: <Globe size={24} />,
      color: '#ff6b00'
    },
    {
      id: 'https',
      title: 'HTTPS & SSL',
      tag: 'PRIVACIDADE',
      desc: 'Como seus dados viajam protegidos por um cofre digital.',
      path: '/https',
      icon: <Lock size={24} />,
      color: '#00ff88'
    },
    {
      id: 'error404',
      title: 'ERRO 404',
      tag: 'ROTAS',
      desc: 'Onde foram parar meus arquivos? Entenda por que as páginas somem da internet.',
      path: '/404-lab',
      icon: <AlertCircle size={24} />,
      color: '#ff3b3b'
    }
  ];

  return (
    <div className="container" style={{ minHeight: '100vh', padding: '4rem 2rem' }}>
      <header style={{ marginBottom: '5rem', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rota-logo"
          style={{ fontSize: '4rem', marginBottom: '1rem' }}
        >
          ROTA 404
        </motion.div>
        <p className="mono" style={{ color: 'var(--text-dim)', letterSpacing: '4px', marginBottom: '2rem' }}>
          DESCOMPLICANDO O MUNDO DIGITAL
        </p>
        <div style={{ maxWidth: '600px', margin: '0 auto', background: 'rgba(255, 204, 0, 0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px dashed var(--primary)' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--primary)', lineHeight: '1.5' }}>
            <strong>Olá, viajante!</strong> Escolha um dos caminhos abaixo para entender como a internet funciona "por baixo do capô". Não se preocupe, vamos te explicar tudo com calma! 🚀
          </p>
        </div>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {modules.map((mod, idx) => (
          <motion.div
            key={mod.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, type: 'spring', stiffness: 100 }}
          >
            <Link to={mod.path} className="card-404" style={{ 
              display: 'block', 
              textDecoration: 'none', 
              color: 'inherit',
              height: '100%'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div style={{ color: mod.color, background: `${mod.color}22`, padding: '12px', borderRadius: '4px' }}>
                  {mod.icon}
                </div>
                <span className="mono" style={{ fontSize: '0.7rem', color: mod.color, border: `1px solid ${mod.color}`, padding: '2px 8px' }}>
                  {mod.tag}
                </span>
              </div>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', letterSpacing: '1px' }}>{mod.title}</h2>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '2rem' }}>{mod.desc}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 'bold', color: mod.color }}>
                INICIAR PERCURSO <ArrowRight size={16} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Hub;
