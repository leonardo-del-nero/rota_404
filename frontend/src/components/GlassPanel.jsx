import React from 'react';

const GlassPanel = ({ children, className = '', style = {}, ...props }) => {
  return (
    <div 
      className={`glass-panel ${className}`} 
      style={{
        padding: '1.5rem',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassPanel;
