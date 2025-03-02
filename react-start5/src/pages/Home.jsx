import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";
import { useWatchlist } from "../context/WatchlistContext";
import "/src/components/css/dark-theme.css"; 
import FadeInImage from "../components/FadeInImage";
import PriceChart from "../components/PriceChart";
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
        console.log("Home: Fetching Solana data and featured coins from CoinGecko...");
        
        // Fetch data in parallel
        const [solana, topCoinsData] = await Promise.all([
          fetchCoinDetails('solana'),
          fetchTopCoins()
        ]);
        
        console.log("Home: Data received from CoinGecko:", { 
          solana: solana?.name || 'No data', 
          topCoins: topCoinsData ? topCoinsData.length : 'No data'
        });
        
        // Log the raw price data for debugging
        console.log("Home: Solana price data:", {
          formattedPrice: solana?.price,
          rawPrice: solana?.currentPrice
        });
        
        setSolanaData(solana);

        // Filter for Bitcoin, Ethereum, and XRP
        const targetCoins = ['bitcoin', 'ethereum', 'ripple'];
        let selectedCoins = [];
        
        // Find the target coins in the top coins data
        targetCoins.forEach(targetId => {
          const foundCoin = topCoinsData.find(coin => coin.id === targetId);
          if (foundCoin) {
            console.log(`Home: Found ${targetId} in top coins:`, {
              name: foundCoin.name,
              formattedPrice: foundCoin.price,
              rawPrice: foundCoin.currentPrice
            });
            selectedCoins.push(foundCoin);
          }
        });
        
        // If we couldn't find all three coins, use fallback data
        if (selectedCoins.length < 3) {
          console.log("Home: Using fallback data for featured coins");
          selectedCoins = [
            { 
              id: 'bitcoin', 
              name: "Bitcoin", 
              price: "$45,000", 
              volume: "$28B", 
              txns: "500K", 
              image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
              currentPrice: 45000
            },
            { 
              id: 'ethereum', 
              name: "Ethereum", 
              price: "$2,800", 
              volume: "$15B", 
              txns: "800K", 
              image: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
              currentPrice: 2800
            },
            { 
              id: 'ripple', 
              name: "XRP", 
              price: "$0.50", 
              volume: "$3B", 
              txns: "300K", 
              image: "https://cryptologos.cc/logos/xrp-xrp-logo.png",
              currentPrice: 0.50
            }
          ];
        }
        
        setFeaturedCoins(selectedCoins);
        setError(null);
      } catch (err) {
        console.error('Home: Error fetching data from CoinGecko:', err);
        setError('Failed to load cryptocurrency data. Please try again.');
        
        // Set fallback data
        setFeaturedCoins([
          { id: 'bitcoin', name: "Bitcoin", price: "$45,000", volume: "$28B", txns: "500K", image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png", currentPrice: 45000 },
          { id: 'ethereum', name: "Ethereum", price: "$2,800", volume: "$15B", txns: "800K", image: "https://cryptologos.cc/logos/ethereum-eth-logo.png", currentPrice: 2800 },
          { id: 'ripple', name: "XRP", price: "$0.50", volume: "$3B", txns: "300K", image: "https://cryptologos.cc/logos/xrp-xrp-logo.png", currentPrice: 0.50 }
        ]);
      } finally {
        console.log("Home: Setting loading to false");
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
      
      console.log("Home: Retry - Solana price data:", {
        formattedPrice: solana?.price,
        rawPrice: solana?.currentPrice
      });
      
      setSolanaData(solana);
      
      // Filter for Bitcoin, Ethereum, and XRP
      const targetCoins = ['bitcoin', 'ethereum', 'ripple'];
      let selectedCoins = [];
      
      // Find the target coins in the top coins data
      targetCoins.forEach(targetId => {
        const foundCoin = topCoinsData.find(coin => coin.id === targetId);
        if (foundCoin) {
          console.log(`Home: Retry - Found ${targetId} in top coins:`, {
            name: foundCoin.name,
            formattedPrice: foundCoin.price,
            rawPrice: foundCoin.currentPrice
          });
          selectedCoins.push(foundCoin);
        }
      });
      
      // If we couldn't find all three coins, use fallback data
      if (selectedCoins.length < 3) {
        selectedCoins = [
          { id: 'bitcoin', name: "Bitcoin", price: "$45,000", volume: "$28B", txns: "500K", image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png", currentPrice: 45000 },
          { id: 'ethereum', name: "Ethereum", price: "$2,800", volume: "$15B", txns: "800K", image: "https://cryptologos.cc/logos/ethereum-eth-logo.png", currentPrice: 2800 },
          { id: 'ripple', name: "XRP", price: "$0.50", volume: "$3B", txns: "300K", image: "https://cryptologos.cc/logos/xrp-xrp-logo.png", currentPrice: 0.50 }
        ];
      }
      
      setFeaturedCoins(selectedCoins);
      setError(null);
    } catch (err) {
      console.error('Home: Error retrying data fetch from CoinGecko:', err);
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
            <Link to={`/coin/solana`}>
              <h1 className="solana-title">Solana</h1>
              <p className="solana-subtitle">$SOL</p>
            </Link>
          </div>
          <div className="coin-stats">
            <span>SOL/USD: <span id="sol-price">{solanaData?.price || "$98.00"}</span></span>
            <span>24h Volume: <span id="volume">{solanaData?.volume || "$1.5B"}</span></span>
            <span>24h TXNS: <span id="txns">{solanaData?.txns || "2.3M"}</span></span>
          </div>
          <div className="coin-chart">
            <PriceChart coinId="solana" />
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
                <Link to={`/coin/${coin.id}`}>
                  <h3>{coin.name}</h3>
                </Link>
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