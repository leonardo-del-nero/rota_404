import React from 'react';
import logoEnhanced from '../assets/logo_enhanced.png';

/**
 * Componente centralizado para a Logo do Rota 404.
 * @param {string} size - 'small', 'medium', 'large' ou 'xl'
 * @param {object} style - estilos adicionais
 */
const PrimaryLogo = ({ size = 'medium', className = '', style = {} }) => {
  const sizes = {
    small: { height: '10vh' },
    medium: { height: '15vh' },
    large: { height: '20vh' },
    xl: { width: '70vw', maxHeight: '35vh' }
  };

  const selectedSize = sizes[size] || sizes.medium;

  return (
    <div className={`rota-logo ${className}`} style={{ display: 'flex', justifyContent: 'center' }}>
      <img 
        src={logoEnhanced} 
        alt="Rota 404 Logo" 
        style={{ ...selectedSize, objectFit: 'contain', ...style }} 
      />
    </div>
  );
};

export default PrimaryLogo;
