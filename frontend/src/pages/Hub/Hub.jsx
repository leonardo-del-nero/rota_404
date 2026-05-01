import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hash, Cpu, Globe, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import styles from './Hub.module.css';

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
    <div className={`container ${styles.hubContainer}`}>
      <header className={styles.hubHeader}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rota-logo ${styles.logo}`}
        >
          ROTA 404
        </motion.div>
        <p className={`mono ${styles.subtitle}`}>
          DESCOMPLICANDO O MUNDO DIGITAL
        </p>
        <div className={styles.introBox}>
          <p className={styles.introText}>
            <strong>Olá, viajante!</strong> Escolha um dos caminhos abaixo para entender como a internet funciona "por baixo do capô". Não se preocupe, vamos te explicar tudo com calma! 🚀
          </p>
        </div>
      </header>

      <div className={styles.grid}>
        {modules.map((mod, idx) => (
          <motion.div
            key={mod.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, type: 'spring', stiffness: 100 }}
          >
            <Link to={mod.path} className={`card-404 ${styles.cardLink}`}>
              <div className={styles.cardHeader}>
                <div 
                  className={styles.iconWrapper} 
                  style={{ color: mod.color, background: `${mod.color}22` }}
                >
                  {mod.icon}
                </div>
                <span 
                  className={`mono ${styles.tag}`} 
                  style={{ color: mod.color, border: `1px solid ${mod.color}` }}
                >
                  {mod.tag}
                </span>
              </div>
              <h2 className={styles.cardTitle}>{mod.title}</h2>
              <p className={styles.cardDesc}>{mod.desc}</p>
              
              <div 
                className={styles.cardFooter} 
                style={{ color: mod.color }}
              >
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
