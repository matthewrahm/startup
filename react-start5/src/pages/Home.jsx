import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";
import { useWatchlist } from "../context/WatchlistContext";
import "/src/components/css/dark-theme.css"; 
import FadeInImage from "../components/FadeInImage";
import PriceChart from "../components/PriceChart";
import SolanaPriceTicker from "../components/SolanaPriceTicker";
import WatchlistPreview from "../components/WatchlistPreview";
import BigMovers from "../components/BigMovers";
import SolanaDataTicker from "../components/SolanaDataTicker";
import { fetchCoinDetails, fetchTopCoins } from '../services/api';
import { websocketService } from '../services/websocketService';

function Home() {
  const { user } = useAuth();
  const { addToWatchlist, notification } = useWatchlist();
  const [solanaData, setSolanaData] = useState(null);
  const [featuredCoins, setFeaturedCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [helpExpanded, setHelpExpanded] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);

  const updateData = useCallback((data) => {
    if (data.solana) {
      setSolanaData(prev => {
        // Only update if the data has changed
        if (JSON.stringify(prev) !== JSON.stringify(data.solana)) {
          return data.solana;
        }
        return prev;
      });
    }
    if (data.topCoins) {
      setFeaturedCoins(prev => {
        // Only update if the data has changed
        if (JSON.stringify(prev) !== JSON.stringify(data.topCoins)) {
          return data.topCoins;
        }
        return prev;
      });
    }
  }, []);

  useEffect(() => {
    console.log("Home component mounted");
    
    let mounted = true;
    let wsCleanup = null;

    const initializeWebSocket = async () => {
      try {
        // Wait for WebSocket connection
        await websocketService.connect();
        if (!mounted) return;

        setWsConnected(true);

        // Subscribe to WebSocket updates
        const handleInitialData = (data) => {
          if (!mounted) return;
          updateData(data);
          setLoading(false);
          setError(null);
        };

        const handleUpdate = (data) => {
          if (!mounted) return;
          updateData(data);
        };

        websocketService.subscribe('initialData', handleInitialData);
        websocketService.subscribe('update', handleUpdate);

        wsCleanup = () => {
          websocketService.unsubscribe('initialData', handleInitialData);
          websocketService.unsubscribe('update', handleUpdate);
        };
      } catch (error) {
        console.error('WebSocket connection failed:', error);
        if (!mounted) return;
        // Fallback to REST API
        fetchData();
      }
    };

    const fetchData = async () => {
      if (!mounted) return;
      
      setLoading(true);
      try {
        console.log("Home: Fetching Solana data and featured coins from CoinGecko...");
        
        const [solana, topCoinsData] = await Promise.all([
          fetchCoinDetails('solana'),
          fetchTopCoins()
        ]);
        
        if (!mounted) return;
        
        console.log("Home: Data received from CoinGecko:", { 
          solana: solana?.name || 'No data', 
          topCoins: topCoinsData ? topCoinsData.length : 'No data'
        });
        
        setSolanaData(solana);

        const targetCoins = ['bitcoin', 'ethereum', 'ripple'];
        let selectedCoins = [];
        
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
        
        if (selectedCoins.length < 3) {
          selectedCoins = [
            { id: 'bitcoin', name: "Bitcoin", symbol: "BTC", price: "$45,000", volume: "$28B", txns: "500K", image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png", currentPrice: 45000, change: "+5.2%" },
            { id: 'ethereum', name: "Ethereum", symbol: "ETH", price: "$2,800", volume: "$15B", txns: "800K", image: "https://cryptologos.cc/logos/ethereum-eth-logo.png", currentPrice: 2800, change: "+3.8%" },
            { id: 'ripple', name: "XRP", symbol: "XRP", price: "$0.50", volume: "$3B", txns: "300K", image: "https://cryptologos.cc/logos/xrp-xrp-logo.png", currentPrice: 0.50, change: "+2.1%" }
          ];
        }
        
        setFeaturedCoins(selectedCoins);
        setError(null);
      } catch (err) {
        console.error('Home: Error fetching data from CoinGecko:', err);
        if (!mounted) return;
        setError('Failed to load cryptocurrency data. Please try again.');
        
        setFeaturedCoins([
          { id: 'bitcoin', name: "Bitcoin", symbol: "BTC", price: "$45,000", volume: "$28B", txns: "500K", image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png", currentPrice: 45000, change: "+5.2%" },
          { id: 'ethereum', name: "Ethereum", symbol: "ETH", price: "$2,800", volume: "$15B", txns: "800K", image: "https://cryptologos.cc/logos/ethereum-eth-logo.png", currentPrice: 2800, change: "+3.8%" },
          { id: 'ripple', name: "XRP", symbol: "XRP", price: "$0.50", volume: "$3B", txns: "300K", image: "https://cryptologos.cc/logos/xrp-xrp-logo.png", currentPrice: 0.50, change: "+2.1%" }
        ]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Initialize WebSocket first
    initializeWebSocket();

    // Cleanup
    return () => {
      mounted = false;
      if (wsCleanup) {
        wsCleanup();
      }
      websocketService.disconnect();
    };
  }, [updateData]);

  const handleAddToWatchlist = (coin) => {
    const watchlistCoin = {
      ...coin,
      image: coin.image || "/solana.png",
      price: coin.price || "$0.00",
      volume: coin.volume || "$0",
      txns: coin.txns || "0"
    };
    
    addToWatchlist(watchlistCoin);
  };

  const handleRetry = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [solana, topCoinsData] = await Promise.all([
        fetchCoinDetails('solana'),
        fetchTopCoins()
      ]);
      
      setSolanaData(solana);
      
      const targetCoins = ['bitcoin', 'ethereum', 'ripple'];
      let selectedCoins = [];
      
      targetCoins.forEach(targetId => {
        const foundCoin = topCoinsData.find(coin => coin.id === targetId);
        if (foundCoin) {
          selectedCoins.push(foundCoin);
        }
      });
      
      if (selectedCoins.length < 3) {
        selectedCoins = [
          { id: 'bitcoin', name: "Bitcoin", symbol: "BTC", price: "$45,000", volume: "$28B", txns: "500K", image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png", currentPrice: 45000, change: "+5.2%" },
          { id: 'ethereum', name: "Ethereum", symbol: "ETH", price: "$2,800", volume: "$15B", txns: "800K", image: "https://cryptologos.cc/logos/ethereum-eth-logo.png", currentPrice: 2800, change: "+3.8%" },
          { id: 'ripple', name: "XRP", symbol: "XRP", price: "$0.50", volume: "$3B", txns: "300K", image: "https://cryptologos.cc/logos/xrp-xrp-logo.png", currentPrice: 0.50, change: "+2.1%" }
        ];
      }
      
      setFeaturedCoins(selectedCoins);
      setError(null);
    } catch (err) {
      console.error('Home: Error retrying data fetch:', err);
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
        <div className={`help-section ${helpExpanded ? 'expanded' : 'collapsed'}`}>
          <h2 onClick={() => setHelpExpanded(!helpExpanded)}>
            New to Crypto?
          </h2>
          <div className="help-grid">
            <div className="help-card">
              <h3>What is Solana?</h3>
              <p>Solana is a fast, secure, and scalable blockchain platform that enables developers to build powerful applications. It's known for its high speed and low transaction costs.</p>
            </div>
            <div className="help-card">
              <h3>Understanding Price Changes</h3>
              <p>Cryptocurrency prices can change quickly. The percentage shown indicates how much the price has moved in the last 24 hours. Green means up, red means down.</p>
            </div>
            <div className="help-card">
              <h3>Using Your Watchlist</h3>
              <p>Add coins to your watchlist to track their prices and changes. Click the star icon on any coin to add it. You can view your full watchlist in the navigation menu.</p>
            </div>
            <div className="help-card">
              <h3>Market Volume</h3>
              <p>Volume shows how much trading activity there is for a cryptocurrency. Higher volume usually means more market interest and potentially more stable prices.</p>
            </div>
          </div>
        </div>

        <div className="coin-info">
          <div className="info-tab">
            Track Solana's real-time price, volume, and transaction data. The chart shows historical price movements.
          </div>
          
          <div className="coin-header">
            <Link to={`/coin/solana`}>
              <h1 className="solana-title">Solana</h1>
              <p className="solana-subtitle">The Future of Blockchain</p>
            </Link>
          </div>
          
          <div className="coin-stats">
            <SolanaPriceTicker initialPrice={solanaData?.price || "$98.00"} refreshInterval={10000} />
            <SolanaDataTicker 
              dataType="volume" 
              initialValue={solanaData?.volume || "$1.5B"} 
              refreshInterval={10000} 
              label="24h Volume:" 
            />
            <SolanaDataTicker 
              dataType="txns" 
              initialValue={solanaData?.txns || "2.3M"} 
              refreshInterval={10000} 
              label="24h TXNS:" 
            />
          </div>

          <div className="coin-chart">
            <PriceChart coinId="solana" />
          </div>
        </div>

        <div className="section-header">
          <div className="info-tab">
            These are the cryptocurrencies with the biggest price movements in the last 24 hours.
          </div>
        </div>
        <BigMovers featuredCoins={featuredCoins} />

        <div className="section-header">
          <div className="info-tab">
            Keep track of your favorite cryptocurrencies by adding them to your watchlist.
          </div>
        </div>
        <WatchlistPreview />
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