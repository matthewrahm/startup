import React, { useState, useRef, useEffect } from 'react';
import '../components/css/OnboardingTooltip.css';

const OnboardingTooltip = ({ children, content, position = 'top' }) => {
  const [show, setShow] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);

  useEffect(() => {
    if (show && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: position === 'top' ? rect.top : rect.bottom,
        left: rect.left + rect.width / 2
      });
    }
  }, [show, position]);

  return (
    <div className="tooltip-container">
      <div 
        ref={triggerRef}
        className="tooltip-trigger"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
        {show && (
          <div 
            className={`tooltip ${position}`}
            style={{
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`
            }}
          >
            <div className="tooltip-content">
              {content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingTooltip;