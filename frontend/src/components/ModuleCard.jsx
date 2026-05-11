import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import styles from '../pages/Hub/Hub.module.css';

const ModuleCard = ({ mod, index, isCompleted }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
    >
      <Link 
        to={mod.path} 
        className={`card-404 ${styles.cardLink}`}
        style={{ 
          borderColor: isCompleted ? mod.color : '',
          boxShadow: isCompleted ? `0 0 20px ${mod.color}22` : ''
        }}
      >
        <div className={styles.cardHeader}>
          <div 
            className={styles.iconWrapper} 
            style={{ color: mod.color, background: `${mod.color}22` }}
          >
            {mod.icon}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {isCompleted && (
              <span 
                className="mono" 
                style={{ 
                  color: 'black', 
                  background: mod.color, 
                  padding: '2px 8px', 
                  fontSize: '0.7rem', 
                  fontWeight: 'bold',
                  borderRadius: '4px' 
                }}
              >
                CONCLUÍDO
              </span>
            )}
            <span 
              className={`mono ${styles.tag}`} 
              style={{ color: mod.color, border: `1px solid ${mod.color}` }}
            >
              {mod.tag}
            </span>
          </div>
        </div>
        <h2 className={styles.cardTitle}>{mod.title}</h2>
        <p className={styles.cardDesc}>{mod.desc}</p>
        
        <div 
          className={styles.cardFooter} 
          style={{ color: isCompleted ? mod.color : 'white', opacity: isCompleted ? 1 : 0.7 }}
        >
          {isCompleted ? 'REVISITAR MÓDULO' : 'INICIAR PERCURSO'} <ArrowRight size={16} />
        </div>
      </Link>
    </motion.div>
  );
};

export default ModuleCard;
