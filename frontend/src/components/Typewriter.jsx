import React, { useState, useEffect } from 'react';

const Typewriter = ({ text, speed = 30, delay = 100 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const timeout = setTimeout(() => {
      const typingInterval = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(typingInterval);
      }, speed);
      return () => clearInterval(typingInterval);
    }, delay);

    return () => {
      clearTimeout(timeout);
      setDisplayedText('');
    };
  }, [text, speed, delay]);

  return <span>{displayedText}</span>;
};

export default Typewriter;
