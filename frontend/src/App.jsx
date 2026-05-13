import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Intro from './components/Intro';
import StartScreen from './pages/StartScreen/StartScreen';
import CharacterSelect from './pages/CharacterSelect/CharacterSelect';
import Hub from './pages/Hub/Hub';
import HashModule from './pages/HashModule/HashModule';
import ApiModule from './pages/ApiModule/ApiModule';
import DnsModule from './pages/DnsModule/DnsModule';
import HttpsModule from './pages/HttpsModule/HttpsModule';
import Error404Module from './pages/Error404Module/Error404Module';
import DeployModule from './pages/DeployModule/DeployModule';
import Leaderboard from './pages/Leaderboard/Leaderboard';
import ResultScreen from './pages/ResultScreen/ResultScreen';
import { AchievementProvider } from './context/AchievementContext';
import Achievements from './pages/Achievements/Achievements';

// Wrapper para o Intro poder usar o useNavigate
const IntroWrapper = () => {
  const navigate = useNavigate();
  return <Intro onFinish={() => navigate('/hub')} />;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div 
            initial={{ opacity: 0, filter: 'blur(10px)' }} 
            animate={{ opacity: 1, filter: 'blur(0px)' }} 
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(5px)' }} 
            transition={{ duration: 0.5 }}
          >
            <StartScreen />
          </motion.div>
        } />
        <Route path="/select" element={
          <motion.div 
            initial={{ opacity: 0, x: 20, filter: 'blur(5px)' }} 
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} 
            exit={{ opacity: 0, x: -20, filter: 'blur(5px)' }} 
            transition={{ duration: 0.5 }}
          >
            <CharacterSelect />
          </motion.div>
        } />
        
        <Route path="/intro" element={
          <IntroWrapper />
        } />
        <Route path="/hub" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <Hub />
          </motion.div>
        } />
        <Route path="/hash" element={
          <motion.div 
            initial={{ opacity: 0, x: 20, filter: 'blur(5px)' }} 
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} 
            exit={{ opacity: 0, x: -20, filter: 'blur(5px)' }} 
            transition={{ duration: 0.5 }}
          >
            <HashModule />
          </motion.div>
        } />
        <Route path="/api-concept" element={
          <motion.div 
            initial={{ opacity: 0, x: 20, filter: 'blur(5px)' }} 
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} 
            exit={{ opacity: 0, x: -20, filter: 'blur(5px)' }} 
            transition={{ duration: 0.5 }}
          >
            <ApiModule />
          </motion.div>
        } />
        <Route path="/dns" element={
          <motion.div 
            initial={{ opacity: 0, x: 20, filter: 'blur(5px)' }} 
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} 
            exit={{ opacity: 0, x: -20, filter: 'blur(5px)' }} 
            transition={{ duration: 0.2 }}
          >
            <DnsModule />
          </motion.div>
        } />
        <Route path="/https" element={
          <motion.div 
            initial={{ opacity: 0, x: 20, filter: 'blur(5px)' }} 
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} 
            exit={{ opacity: 0, x: -20, filter: 'blur(5px)' }} 
            transition={{ duration: 0.2 }}
          >
            <HttpsModule />
          </motion.div>
        } />
        <Route path="/404-lab" element={
          <motion.div 
            initial={{ opacity: 0, x: 20, filter: 'blur(5px)' }} 
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} 
            exit={{ opacity: 0, x: -20, filter: 'blur(5px)' }} 
            transition={{ duration: 0.2 }}
          >
            <Error404Module />
          </motion.div>
        } />
        <Route path="/deploy" element={
          <motion.div 
            initial={{ opacity: 0, x: 20, filter: 'blur(5px)' }} 
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} 
            exit={{ opacity: 0, x: -20, filter: 'blur(5px)' }} 
            transition={{ duration: 0.5 }}
          >
            <DeployModule />
          </motion.div>
        } />
        <Route path="/result" element={
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }} 
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} 
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(5px)' }} 
            transition={{ duration: 0.4 }}
          >
            <ResultScreen />
          </motion.div>
        } />
        <Route path="/leaderboard" element={
          <motion.div 
            initial={{ opacity: 0, filter: 'blur(10px)' }} 
            animate={{ opacity: 1, filter: 'blur(0px)' }} 
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(5px)' }} 
            transition={{ duration: 0.2 }}
          >
            <Leaderboard />
          </motion.div>
        } />


        <Route path="/achievements" element={
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }} 
            transition={{ duration: 0.3 }}
          >
            <Achievements />
          </motion.div>
        } />

      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AchievementProvider>
      <Router>
        <div style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
          <AnimatedRoutes />
        </div>
      </Router>
    </AchievementProvider>
  );
}

export default App;
