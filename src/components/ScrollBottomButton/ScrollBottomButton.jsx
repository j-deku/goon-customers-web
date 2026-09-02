import React, { useEffect, useState } from 'react';
import { FaArrowDown } from 'react-icons/fa';

const ScrollBottomButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolledPast = window.scrollY > 150;
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 500;

      setIsVisible(scrolledPast && !atBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="scroll-bottom-button"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        position: 'fixed',
        bottom: '150px',
        right: '10px',
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: '20px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        padding: '15px',
        cursor: 'pointer',
        transition: 'opacity 0.4s ease',
      }}
    >
      <a href="#footer" className="scroll-bottom-link">
        <FaArrowDown
          className="scroll-bottom-icon"
          size={30}
          style={{ color: '#333' }}
        />
      </a>
    </div>
  );
};

export default ScrollBottomButton;