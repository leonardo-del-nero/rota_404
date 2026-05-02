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
import Leaderboard from './pages/Leaderboard/Leaderboard';

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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <StartScreen />
          </motion.div>
        } />
        <Route path="/select" element={
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
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
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <HashModule />
          </motion.div>
        } />
        <Route path="/api-concept" element={
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <ApiModule />
          </motion.div>
        } />
        <Route path="/dns" element={
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <DnsModule />
          </motion.div>
        } />
        <Route path="/https" element={
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <HttpsModule />
          </motion.div>
        } />
        <Route path="/404-lab" element={
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <Error404Module />
          </motion.div>
        } />
        <Route path="/leaderboard" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <Leaderboard />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
