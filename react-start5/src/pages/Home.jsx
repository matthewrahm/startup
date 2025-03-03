import React, { useState, useEffect } from "react";
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
              symbol: "BTC",
              price: "$45,000", 
              volume: "$28B", 
              txns: "500K", 
              image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
              currentPrice: 45000,
              change: "+5.2%"
            },
            { 
              id: 'ethereum', 
              name: "Ethereum", 
              symbol: "ETH",
              price: "$2,800", 
              volume: "$15B", 
              txns: "800K", 
              image: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
              currentPrice: 2800,
              change: "+3.8%"
            },
            { 
              id: 'ripple', 
              name: "XRP", 
              symbol: "XRP",
              price: "$0.50", 
              volume: "$3B", 
              txns: "300K", 
              image: "https://cryptologos.cc/logos/xrp-xrp-logo.png",
              currentPrice: 0.50,
              change: "+2.1%"
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
          { id: 'bitcoin', name: "Bitcoin", symbol: "BTC", price: "$45,000", volume: "$28B", txns: "500K", image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png", currentPrice: 45000, change: "+5.2%" },
          { id: 'ethereum', name: "Ethereum", symbol: "ETH", price: "$2,800", volume: "$15B", txns: "800K", image: "https://cryptologos.cc/logos/ethereum-eth-logo.png", currentPrice: 2800, change: "+3.8%" },
          { id: 'ripple', name: "XRP", symbol: "XRP", price: "$0.50", volume: "$3B", txns: "300K", image: "https://cryptologos.cc/logos/xrp-xrp-logo.png", currentPrice: 0.50, change: "+2.1%" }
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
          { id: 'bitcoin', name: "Bitcoin", symbol: "BTC", price: "$45,000", volume: "$28B", txns: "500K", image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png", currentPrice: 45000, change: "+5.2%" },
          { id: 'ethereum', name: "Ethereum", symbol: "ETH", price: "$2,800", volume: "$15B", txns: "800K", image: "https://cryptologos.cc/logos/ethereum-eth-logo.png", currentPrice: 2800, change: "+3.8%" },
          { id: 'ripple', name: "XRP", symbol: "XRP", price: "$0.50", volume: "$3B", txns: "300K", image: "https://cryptologos.cc/logos/xrp-xrp-logo.png", currentPrice: 0.50, change: "+2.1%" }
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
              <p className="solana-subtitle">The Future of Blockchain</p>
            </Link>
          </div>
          <div className="coin-stats">
            <SolanaPriceTicker initialPrice={solanaData?.price || "$98.00"} refreshInterval={10000} />
            <SolanaDataTicker dataType="volume" initialValue={solanaData?.volume || "$1.5B"} refreshInterval={10000} label="24h Volume:" />
            <SolanaDataTicker dataType="txns" initialValue={solanaData?.txns || "2.3M"} refreshInterval={10000} label="24h TXNS:" />
          </div>
          <div className="coin-chart">
            <PriceChart coinId="solana" />
          </div>
        </div>

        {/* Tabbed Section with Big Movers and Ramen's Favorites */}
        <BigMovers featuredCoins={featuredCoins} />

        {/* Watchlist Preview Section */}
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