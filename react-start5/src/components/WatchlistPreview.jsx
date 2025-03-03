import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import FadeInImage from './FadeInImage';
import './css/watchlist-preview.css';

const WatchlistPreview = () => {
  const { watchlist } = useWatchlist();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // If watchlist is empty, show CTA
  if (!watchlist || watchlist.length === 0) {
    return (
      <div className="watchlist-preview empty-watchlist">
        <h2>Your Watchlist</h2>
        <div className="empty-watchlist-content">
          <div className="empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"></path>
            </svg>
          </div>
          <p>Start building your watchlist!</p>
          <Link to="/trending" className="watchlist-btn">Explore Trending Coins</Link>
        </div>
      </div>
    );
  }

  // Calculate visible coins (up to 3)
  const visibleCoins = watchlist.slice(currentIndex, currentIndex + 3);
  const hasMoreCoins = watchlist.length > 3;
  
  // Handle navigation
  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex(prev => Math.min(watchlist.length - 3, prev + 1));
  };

  return (
    <div className="watchlist-preview">
      <div className="watchlist-preview-header">
        <h2>Your Watchlist</h2>
        <Link to="/watchlist" className="view-all">View All</Link>
      </div>
      
      <div className="watchlist-preview-content">
        {visibleCoins.map((coin, index) => (
          <div key={`${coin.id}-${index}`} className="preview-coin-card">
            <div className="preview-coin-header">
              <FadeInImage 
                src={coin.image} 
                alt={coin.name} 
                className="preview-coin-image" 
              />
              <div className="preview-coin-info">
                <Link to={`/coin/${coin.id}`}>
                  <h3>{coin.name}</h3>
                </Link>
                {coin.symbol && <span className="preview-coin-symbol">{coin.symbol}</span>}
              </div>
            </div>
            <div className="preview-coin-price">
              <span>{coin.price}</span>
            </div>
          </div>
        ))}
        
        {/* Show navigation controls if there are more than 3 coins */}
        {hasMoreCoins && (
          <div className="preview-navigation">
            <button 
              onClick={handlePrev} 
              disabled={currentIndex === 0}
              className="nav-button"
            >
              ←
            </button>
            <span className="nav-indicator">
              {currentIndex + 1}-{Math.min(currentIndex + 3, watchlist.length)} of {watchlist.length}
            </span>
            <button 
              onClick={handleNext} 
              disabled={currentIndex >= watchlist.length - 3}
              className="nav-button"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistPreview;