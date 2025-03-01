import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from './Navbar';
import { useWatchlist } from '../context/WatchlistContext';
import FadeInImage from '../components/FadeInImage';
import { fetchCoinDetails } from '../services/api';

function CoinDetails() {
  const { id } = useParams();
  const { addToWatchlist, notification } = useWatchlist();
  const [coinData, setCoinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log(`Fetching details for coin: ${id}`);
        const data = await fetchCoinDetails(id);
        console.log(`Coin details received:`, data);
        setCoinData(data);
        setError(null);
      } catch (err) {
        console.error(`Error fetching coin ${id}:`, err);
        setError(`Failed to load data for ${id}. Please try again.`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddToWatchlist = () => {
    if (!coinData) return;
    
    const watchlistCoin = {
      id: coinData.id,
      name: coinData.name,
      symbol: coinData.symbol,
      price: coinData.price,
      volume: coinData.volume,
      txns: coinData.txns || "0",
      image: coinData.image
    };
    
    addToWatchlist(watchlistCoin);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">Loading {id} data...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <Link to="/home" className="watchlist-btn">
            Return to Home
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="coin-details-page">
        <div className="container">
          <div className="back-link">
            <Link to="/home">&larr; Back to Home</Link>
          </div>
          
          <div className="coin-details-header">
            <div className="coin-details-image">
              <FadeInImage 
                src={coinData?.image} 
                alt={`${coinData?.name} Logo`} 
                className="coin-logo-large"
              />
            </div>
            <div className="coin-details-title">
              <h1>{coinData?.name} <span className="coin-symbol">({coinData?.symbol})</span></h1>
              <div className="coin-price-container">
                <span className="coin-price">{coinData?.price}</span>
                <span className={`coin-change ${coinData?.change24h.startsWith('-') ? 'negative' : 'positive'}`}>
                  {coinData?.change24h}
                </span>
              </div>
            </div>
            <div className="coin-details-action">
              <button
                onClick={handleAddToWatchlist}
                className="watchlist-btn"
              >
                Add to Watchlist
              </button>
              {notification.show && notification.coinId === coinData?.id && (
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
          
          <div className="coin-stats-grid">
            <div className="coin-stat-card">
              <h3>Market Cap</h3>
              <p>{coinData?.marketCap}</p>
            </div>
            <div className="coin-stat-card">
              <h3>Volume (24h)</h3>
              <p>{coinData?.volume}</p>
            </div>
            <div className="coin-stat-card">
              <h3>Transactions (24h)</h3>
              <p>{coinData?.txns}</p>
            </div>
          </div>
          
          <div className="coin-chart-container">
            <h2>Price Chart</h2>
            <div className="coin-chart-placeholder">
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                Price Chart Coming Soon
              </div>
            </div>
          </div>
          
          <div className="coin-description">
            <h2>About {coinData?.name}</h2>
            <p>{coinData?.description || `${coinData?.name} is a cryptocurrency that uses blockchain technology.`}</p>
          </div>
          
          {coinData?.website && (
            <div className="coin-links">
              <h2>Resources</h2>
              <div className="links-grid">
                <a href={coinData.website} target="_blank" rel="noopener noreferrer" className="resource-link">
                  <span className="link-icon">🌐</span>
                  <span className="link-text">Website</span>
                </a>
                {coinData.github && (
                  <a href={coinData.github} target="_blank" rel="noopener noreferrer" className="resource-link">
                    <span className="link-icon">💻</span>
                    <span className="link-text">GitHub</span>
                  </a>
                )}
                {coinData.reddit && (
                  <a href={coinData.reddit} target="_blank" rel="noopener noreferrer" className="resource-link">
                    <span className="link-icon">🔄</span>
                    <span className="link-text">Reddit</span>
                  </a>
                )}
                {coinData.twitter && (
                  <a href={coinData.twitter} target="_blank" rel="noopener noreferrer" className="resource-link">
                    <span className="link-icon">🐦</span>
                    <span className="link-text">Twitter</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer>
        <div>
          <a href="https://github.com/matthewrahm/startup.git" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
      </footer>
    </>
  );
}

export default CoinDetails;