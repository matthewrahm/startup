import React, { useState, useEffect } from 'react';

const FadeInImage = ({ src, alt, className, style, fallbackSrc = "/solana.png" }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Reset states when src changes
    setIsLoaded(false);
    setError(false);
    
    // Create new image to preload
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImgSrc(src);
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      setError(true);
      setImgSrc(fallbackSrc);
      
      // Try to load the fallback image
      const fallbackImg = new Image();
      fallbackImg.src = fallbackSrc;
      
      fallbackImg.onload = () => {
        setIsLoaded(true);
      };
    };
    
    // Clean up
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallbackSrc]);

  return (
    <div className="image-container" style={{ position: 'relative', ...style }}>
      {!isLoaded && <div className="image-placeholder"></div>}
      <img
        src={imgSrc || (error ? fallbackSrc : src)}
        alt={alt}
        className={`fade-in-image ${isLoaded ? 'loaded' : ''} ${className || ''}`}
        style={style}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!error) {
            setError(true);
            setImgSrc(fallbackSrc);
          }
        }}
      />
    </div>
  );
};

export default FadeInImage;