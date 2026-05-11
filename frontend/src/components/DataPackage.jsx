import React from 'react';
import { motion } from 'framer-motion';

const DataPackage = ({ text, icon: Icon, type = 'primary', className = '', style = {} }) => {
  const typeClasses = {
    primary: 'primary-package',
    secondary: 'secondary-package',
    success: 'success-package',
    danger: 'danger-package'
  };

  return (
    <div className={`package-container ${className}`} style={style}>
      <div className={`data-package ${typeClasses[type] || typeClasses.primary}`}>
        {Icon && <Icon size={14} style={{ marginRight: '5px' }} />}
        {text}
      </div>
    </div>
  );
};

export default DataPackage;
