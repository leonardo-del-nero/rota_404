import { useState, useEffect  } from 'react';
import React from 'react';

const Typewriter = ({ text, speed = 30, delay = 0, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          setIsComplete(true);
          if (onComplete) onComplete();
        }
      }, speed);
      
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay, onComplete]);

  return <span>{displayedText}</span>;
};

export default Typewriter;
