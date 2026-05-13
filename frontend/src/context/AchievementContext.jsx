import { createContext, useContext, useState, useCallback  } from 'react';
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import AchievementToast from '../components/AchievementToast';

const AchievementContext = createContext();

export const AchievementProvider = ({ children }) => {
  const [achievements, setAchievements] = useState([]);

  const unlockAchievement = useCallback((id, title, description, tier = 'COMUM') => {
    // Verifica se já foi desbloqueado nesta sessão ou no localStorage
    const unlocked = JSON.parse(localStorage.getItem('rota404_achievements') || '[]');
    if (unlocked.includes(id)) return;

    const newAchievement = { id, title, description, tier };
    setAchievements(prev => [...prev, newAchievement]);
    
    // Salva no localStorage
    localStorage.setItem('rota404_achievements', JSON.stringify([...unlocked, id]));
  }, []);

  const removeAchievement = useCallback((id) => {
    setAchievements(prev => prev.filter(a => a.id !== id));
  }, []);

  return (
    <AchievementContext.Provider value={{ unlockAchievement }}>
      {children}
      <AnimatePresence mode="wait">
        {achievements.length > 0 && (
          <AchievementToast 
            key={achievements[0].id} 
            achievement={achievements[0]} 
            onExpire={() => removeAchievement(achievements[0].id)} 
          />
        )}
      </AnimatePresence>
    </AchievementContext.Provider>
  );
};

export const useAchievement = () => {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievement must be used within an AchievementProvider');
  }
  return context;
};
