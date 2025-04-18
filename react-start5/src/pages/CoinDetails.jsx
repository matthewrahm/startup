import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from './Navbar';
import { useWatchlist } from '../context/WatchlistContext';
import FadeInImage from '../components/FadeInImage';
import PriceChart from '../components/PriceChart';
import { fetchCoinDetails } from '../services/api';
import OnboardingTooltip from '../components/OnboardingTooltip';

function CoinDetails() {
  const { id } = useParams();
  const { addToWatchlist, notification } = useWatchlist();
  const [coinData, setCoinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Create a memoized fetch function to avoid recreating it on each render
  const fetchData = useCallback(async (showRefreshing = true) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      console.log(`CoinDetails: Fetching live data for coin: ${id}`);
      const data = await fetchCoinDetails(id);
      console.log(`CoinDetails: Live data received for ${id}:`, {
        name: data.name,
        price: data.price,
        rawPrice: data.currentPrice
      });
      setCoinData(data);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(`CoinDetails: Error fetching live data for ${id}:`, err);
      setError(`Failed to load live data for ${id}. Please try again.`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  // Initial data fetch
  useEffect(() => {
    fetchData(false);
  }, [fetchData]);

  // Set up auto-refresh interval (every 60 seconds)
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log(`CoinDetails: Auto-refreshing data for ${id}`);
      fetchData(true);
    }, 60000); // 60 seconds

    return () => clearInterval(intervalId);
  }, [fetchData, id]);

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

  const handleRefresh = () => {
    fetchData(true);
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return '';
    
    return lastUpdated.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading && !refreshing) {
    return (
      <>
        <Navbar />
        <div className="loading">Loading live data for {id}...</div>
      </>
    );
  }

  if (error && !coinData) {
    return (
      <>
        <Navbar />
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={handleRefresh} className="watchlist-btn">
              Try Again
            </button>
            <Link to="/home" className="watchlist-btn secondary">
              Return to Home
            </Link>
          </div>
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
            <div className="refresh-container">
              {lastUpdated && (
                <span className="last-updated">
                  Last updated: {formatLastUpdated()}
                </span>
              )}
              <button 
                onClick={handleRefresh} 
                className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
                disabled={refreshing}
              >
                <span className="refresh-icon">↻</span> 
                {refreshing ? 'Refreshing...' : 'Refresh Data'}
              </button>
            </div>
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
              <OnboardingTooltip 
                content="The current price and 24-hour price change percentage. Green means the price went up, red means it went down."
                position="bottom"
              >
                <div className="coin-price-container">
                  <span className="coin-price">{coinData?.price}</span>
                  <span className={`coin-change ${coinData?.change24h.startsWith('-') ? 'negative' : 'positive'}`}>
                    {coinData?.change24h}
                  </span>
                </div>
              </OnboardingTooltip>
            </div>
            <div className="coin-details-action">
              <OnboardingTooltip 
                content="Add this cryptocurrency to your watchlist to track its price and changes."
                position="left"
              >
                <button
                  onClick={handleAddToWatchlist}
                  className="watchlist-btn"
                >
                  Add to Watchlist
                </button>
              </OnboardingTooltip>
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
            <OnboardingTooltip 
              content="Market cap is the total value of all coins in circulation. It's calculated by multiplying the current price by the total number of coins."
              position="top"
            >
              <div className="coin-stat-card">
                <h3>Market Cap</h3>
                <p>{coinData?.marketCap}</p>
              </div>
            </OnboardingTooltip>

            <OnboardingTooltip 
              content="Volume shows how much trading activity there is in the last 24 hours. Higher volume usually means more market interest."
              position="top"
            >
              <div className="coin-stat-card">
                <h3>Volume (24h)</h3>
                <p>{coinData?.volume}</p>
              </div>
            </OnboardingTooltip>

            <OnboardingTooltip 
              content="The number of transactions processed on the blockchain in the last 24 hours. This shows how actively the network is being used."
              position="top"
            >
              <div className="coin-stat-card">
                <h3>Transactions (24h)</h3>
                <p>{coinData?.txns}</p>
              </div>
            </OnboardingTooltip>
          </div>
          
          <OnboardingTooltip 
            content="This chart shows the price history over time. You can hover over it to see specific prices at different times."
            position="top"
          >
            <div className="coin-chart-container">
              <h2>Price Chart</h2>
              <PriceChart coinId={id} />
            </div>
          </OnboardingTooltip>
          
          <div className="coin-description">
            <h2>About {coinData?.name}</h2>
            <p>{coinData?.description || `${coinData?.name} is a cryptocurrency that uses blockchain technology.`}</p>
          </div>
          
          {coinData?.website && (
            <div className="coin-links">
              <h2>Resources</h2>
              <div className="links-grid">
                <OnboardingTooltip 
                  content="Visit the official website to learn more about this cryptocurrency."
                  position="top"
                >
                  <a href={coinData.website} target="_blank" rel="noopener noreferrer" className="resource-link">
                    <span className="link-icon">🌐</span>
                    <span className="link-text">Website</span>
                  </a>
                </OnboardingTooltip>

                {coinData.github && (
                  <OnboardingTooltip 
                    content="View the source code and development activity on GitHub."
                    position="top"
                  >
                    <a href={coinData.github} target="_blank" rel="noopener noreferrer" className="resource-link">
                      <span className="link-icon">💻</span>
                      <span className="link-text">GitHub</span>
                    </a>
                  </OnboardingTooltip>
                )}

                {coinData.reddit && (
                  <OnboardingTooltip 
                    content="Join the community discussion on Reddit."
                    position="top"
                  >
                    <a href={coinData.reddit} target="_blank" rel="noopener noreferrer" className="resource-link">
                      <span className="link-icon">🔄</span>
                      <span className="link-text">Reddit</span>
                    </a>
                  </OnboardingTooltip>
                )}

                {coinData.twitter && (
                  <OnboardingTooltip 
                    content="Follow official updates and announcements on Twitter."
                    position="top"
                  >
                    <a href={coinData.twitter} target="_blank" rel="noopener noreferrer" className="resource-link">
                      <span className="link-icon">🐦</span>
                      <span className="link-text">Twitter</span>
                    </a>
                  </OnboardingTooltip>
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