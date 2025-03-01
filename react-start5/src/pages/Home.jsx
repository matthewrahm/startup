import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";
import { useWatchlist } from "../context/WatchlistContext";
import "/src/components/css/dark-theme.css"; 
import FadeInImage from "../components/FadeInImage";
import { fetchCoinDetails, fetchTopCoins } from '../services/api';

function Home() {
  const { user } = useAuth();
  const { addToWatchlist, notification } = useWatchlist();
  const [solanaData, setSolanaData] = useState(null);
  const [featuredCoins, setFeaturedCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Home component mounted");
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("Fetching Solana data and featured coins from CoinGecko...");
        
        // Fetch data in parallel
        const [solana, topCoinsData] = await Promise.all([
          fetchCoinDetails('solana'),
          fetchTopCoins()
        ]);
        
        console.log("Data received from CoinGecko:", { 
          solana: solana?.name || 'No data', 
          topCoins: topCoinsData ? topCoinsData.length : 'No data'
        });
        
        setSolanaData(solana);

        // Filter for Bitcoin, Ethereum, and XRP
        const targetCoins = ['bitcoin', 'ethereum', 'ripple'];
        let selectedCoins = [];
        
        // Find the target coins in the top coins data
        targetCoins.forEach(targetId => {
          const foundCoin = topCoinsData.find(coin => coin.id === targetId);
          if (foundCoin) {
            console.log(`Found ${targetId} in top coins:`, foundCoin);
            selectedCoins.push(foundCoin);
          }
        });
        
        // If we couldn't find all three coins, use fallback data
        if (selectedCoins.length < 3) {
          console.log("Using fallback data for featured coins");
          selectedCoins = [
            { 
              id: 'bitcoin', 
              name: "Bitcoin", 
              price: "$45,000", 
              volume: "$28B", 
              txns: "500K", 
              image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" 
            },
            { 
              id: 'ethereum', 
              name: "Ethereum", 
              price: "$2,800", 
              volume: "$15B", 
              txns: "800K", 
              image: "https://cryptologos.cc/logos/ethereum-eth-logo.png" 
            },
            { 
              id: 'ripple', 
              name: "XRP", 
              price: "$0.50", 
              volume: "$3B", 
              txns: "300K", 
              image: "https://cryptologos.cc/logos/xrp-xrp-logo.png" 
            }
          ];
        }
        
        setFeaturedCoins(selectedCoins);
        setError(null);
      } catch (err) {
        console.error('Error fetching data from CoinGecko:', err);
        setError('Failed to load cryptocurrency data. Please try again.');
        
        // Set fallback data
        setFeaturedCoins([
          { id: 'bitcoin', name: "Bitcoin", price: "$45,000", volume: "$28B", txns: "500K", image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" },
          { id: 'ethereum', name: "Ethereum", price: "$2,800", volume: "$15B", txns: "800K", image: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
          { id: 'ripple', name: "XRP", price: "$0.50", volume: "$3B", txns: "300K", image: "https://cryptologos.cc/logos/xrp-xrp-logo.png" }
        ]);
      } finally {
        console.log("Setting loading to false");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to handle adding a coin to watchlist
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

  // Function to retry loading data
  const handleRetry = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Re-fetch data
      const [solana, topCoinsData] = await Promise.all([
        fetchCoinDetails('solana'),
        fetchTopCoins()
      ]);
      
      setSolanaData(solana);
      
      // Filter for Bitcoin, Ethereum, and XRP
      const targetCoins = ['bitcoin', 'ethereum', 'ripple'];
      let selectedCoins = [];
      
      // Find the target coins in the top coins data
      targetCoins.forEach(targetId => {
        const foundCoin = topCoinsData.find(coin => coin.id === targetId);
        if (foundCoin) {
          selectedCoins.push(foundCoin);
        }
      });
      
      // If we couldn't find all three coins, use fallback data
      if (selectedCoins.length < 3) {
        selectedCoins = [
          { id: 'bitcoin', name: "Bitcoin", price: "$45,000", volume: "$28B", txns: "500K", image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" },
          { id: 'ethereum', name: "Ethereum", price: "$2,800", volume: "$15B", txns: "800K", image: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
          { id: 'ripple', name: "XRP", price: "$0.50", volume: "$3B", txns: "300K", image: "https://cryptologos.cc/logos/xrp-xrp-logo.png" }
        ];
      }
      
      setFeaturedCoins(selectedCoins);
      setError(null);
    } catch (err) {
      console.error('Error retrying data fetch from CoinGecko:', err);
      setError('Failed to load cryptocurrency data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">Loading cryptocurrency data...</div>
      </>
    );
  }

  if (error && !featuredCoins.length) {
    return (
      <>
        <Navbar />
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={handleRetry} className="watchlist-btn">
            Try Again
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        <div className="coin-info">
          <div className="coin-header">
            <FadeInImage 
              src={solanaData?.image || "/solana.png"} 
              alt="Solana Logo" 
            />
          </div>
          <div className="coin-stats">
            <span>SOL/USD: <span id="sol-price">{solanaData?.price || "$98.00"}</span></span>
            <span>24h Volume: <span id="volume">{solanaData?.volume || "$1.5B"}</span></span>
            <span>24h TXNS: <span id="txns">{solanaData?.txns || "2.3M"}</span></span>
          </div>
          <div className="coin-chart">
            <div className="chart-container" style={{ width: '100%', height: '300px', background: 'var(--bg-secondary)', borderRadius: '8px', padding: '16px' }}>
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                Price Chart Coming Soon
              </div>
            </div>
          </div>
        </div>

        <section className="coin-details">
          {featuredCoins.map((coin) => (
            <div className="coin-detail" key={coin.id}>
              <div className="coin-detail-header">
                <FadeInImage 
                  src={coin.image} 
                  alt={coin.name} 
                  className="coin-image" 
                />
                <h3>{coin.name}</h3>
              </div>
              <div className="coin-stats">
                <p>Price: {coin.price}</p>
                <p>Volume: {coin.volume}</p>
                <p>TXNS: {coin.txns}</p>
              </div>
              <div className="watchlist-action">
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
        </section>
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

export default Home;