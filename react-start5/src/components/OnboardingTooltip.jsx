import React, { useState, useEffect } from 'react';
import '../components/css/OnboardingTooltip.css';

const OnboardingTooltip = ({ children, content, position = 'top' }) => {
  const [show, setShow] = useState(false);
  const [hasSeen, setHasSeen] = useState(false);

  useEffect(() => {
    // Check if user has seen this tooltip before
    const seenTooltips = JSON.parse(localStorage.getItem('seenTooltips') || '{}');
    if (!seenTooltips[content]) {
      setShow(true);
      // Mark this tooltip as seen
      seenTooltips[content] = true;
      localStorage.setItem('seenTooltips', JSON.stringify(seenTooltips));
    }
  }, [content]);

  if (!show || hasSeen) return children;

  return (
    <div className="tooltip-container">
      {children}
      <div className={`tooltip ${position}`}>
        <div className="tooltip-content">
          {content}
          <button 
            className="tooltip-close"
            onClick={() => {
              setShow(false);
              setHasSeen(true);
            }}
          >
            Got it!
          </button>
        </div>
        <div className="tooltip-arrow" />
      </div>
    </div>
  );
};

export default OnboardingTooltip; 