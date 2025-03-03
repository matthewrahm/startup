import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import FadeInImage from './FadeInImage';
import './css/big-movers.css';
import { fetchBigMovers } from '../services/api';

const BigMovers = ({ featuredCoins = [] }) => {
  const [movers, setMovers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('movers'); // 'movers' or 'favorites'
  const { addToWatchlist, notification } = useWatchlist();

  useEffect(() => {
    const loadBigMovers = async () => {
      setLoading(true);
      try {
        const data = await fetchBigMovers();
        setMovers(data);
      } catch (error) {
        console.error('Error loading big movers:', error);
        // Fallback data
        setMovers([
          { id: 'solana', name: 'Solana', symbol: 'SOL', price: '$98.00', change: '+15.2%', image: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
          { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', price: '$32.50', change: '+12.8%', image: 'https://cryptologos.cc/logos/avalanche-avax-logo.png' },
          { id: 'polygon', name: 'Polygon', symbol: 'MATIC', price: '$0.75', change: '-8.3%', image: 'https://cryptologos.cc/logos/polygon-matic-logo.png' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadBigMovers();
  }, []);

  const handleAddToWatchlist = (coin) => {
    // Ensure the coin has all required properties for the watchlist
    const watchlistCoin = {
      ...coin,
      // Add default values for any missing properties
      image: coin.image || "/solana.png", // Use default image if none provided
      price: coin.price || "$0.00",
      volume: coin.volume || "$0",
      txns: coin.txns || "0"
    };
    
    addToWatchlist(watchlistCoin);
  };

  const renderTabContent = () => {
    if (activeTab === 'movers') {
      if (loading) {
        return <div className="big-movers-loading">Loading market data...</div>;
      }
      
      return (
        <div className="big-movers-grid">
          {movers.map((coin) => (
            <div key={coin.id} className="mover-card">
              <div className="mover-header">
                <FadeInImage 
                  src={coin.image} 
                  alt={coin.name} 
                  className="mover-image" 
                />
                <div className="mover-info">
                  <Link to={`/coin/${coin.id}`}>
                    <h3>{coin.name}</h3>
                  </Link>
                  <span className="mover-symbol">{coin.symbol}</span>
                </div>
              </div>
              
              <div className="mover-data">
                <div className="mover-price">{coin.price}</div>
                <div className={`mover-change ${coin.change.startsWith('-') ? 'negative' : 'positive'}`}>
                  {coin.change}
                </div>
              </div>
              
              <div className="mover-action">
                <button
                  onClick={() => handleAddToWatchlist(coin)}
                  className="watchlist-btn"
                >
                  Add to Watchlist
                </button>
                {notification.show && notification.coinId === coin.id && notification.page === 'home' && (
                  <div className={`notification-inline ${notification.type}`}>
                    <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                      <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                      <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                    <span>{notification.message}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      // Render RAMEN'S FAVORITES tab
      return (
        <div className="big-movers-grid">
          {featuredCoins.map((coin) => (
            <div key={coin.id} className="mover-card">
              <div className="mover-header">
                <FadeInImage 
                  src={coin.image} 
                  alt={coin.name} 
                  className="mover-image" 
                />
                <div className="mover-info">
                  <Link to={`/coin/${coin.id}`}>
                    <h3>{coin.name}</h3>
                  </Link>
                  <span className="mover-symbol">{coin.symbol}</span>
                </div>
              </div>
              
              <div className="mover-data">
                <div className="mover-price">{coin.price}</div>
                {coin.change && (
                  <div className={`mover-change ${coin.change?.startsWith('-') ? 'negative' : 'positive'}`}>
                    {coin.change}
                  </div>
                )}
              </div>
              
              <div className="mover-action">
                <button
                  onClick={() => handleAddToWatchlist(coin)}
                  className="watchlist-btn"
                >
                  Add to Watchlist
                </button>
                {notification.show && notification.coinId === coin.id && notification.page === 'home' && (
                  <div className={`notification-inline ${notification.type}`}>
                    <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                      <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                      <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                    <span>{notification.message}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="big-movers-section">
      <div className="tabs-container">
        <div className="tabs-header">
          <button 
            className={`tab-button ${activeTab === 'movers' ? 'active' : ''}`}
            onClick={() => setActiveTab('movers')}
          >
            <h1 className="tab-title">Big Movers</h1>
            <p className="tab-subtitle">Today's Most Volatile Coins</p>
          </button>
          <button 
            className={`tab-button ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <h1 className="tab-title">Ramen's Favorites</h1>
            <p className="tab-subtitle">Quant's Top Picks</p>
          </button>
        </div>
      </div>
      
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default BigMovers;