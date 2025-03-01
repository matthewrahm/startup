import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar"
import { useWatchlist } from "../context/WatchlistContext";
import "../components/css/trending.css";
import FadeInImage from "../components/FadeInImage";
import { fetchTopCoins, fetchTrendingCoins, fetchExchangeRates } from '../services/api';

function Trending() {
  const [topCoins, setTopCoins] = useState([]);
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [exchangeRates, setExchangeRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToWatchlist, notification } = useWatchlist();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("Trending page: Fetching coin data from CoinGecko API with API key...");
        
        // Fetch all data in parallel
        const [topCoinsData, trendingCoinsData, ratesData] = await Promise.all([
          fetchTopCoins(),
          fetchTrendingCoins(),
          fetchExchangeRates('BTC')
        ]);
        
        console.log("Trending page: Data received from CoinGecko API", { 
          topCoins: topCoinsData.length, 
          trendingCoins: trendingCoinsData.length,
          exchangeRates: ratesData ? 'received' : 'failed'
        });
        
        // Important: Set state with the fetched data
        setTopCoins(topCoinsData.slice(0, 5)); // Only show top 5 coins
        setTrendingCoins(trendingCoinsData);
        setExchangeRates(ratesData.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching data from CoinGecko API:', err);
        setError('Failed to load cryptocurrency data. Please try again.');
        
        // Set fallback data if API fails
        setTopCoins([
          { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: '$45,000', change: '+5.2%', volume: '$28B', marketCap: '$850B', image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
          { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: '$2,800', change: '+3.8%', volume: '$15B', marketCap: '$330B', image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
          { id: 'solana', name: 'Solana', symbol: 'SOL', price: '$98', change: '+7.5%', volume: '$4B', marketCap: '$38B', image: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
          { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: '$1.20', change: '+2.9%', volume: '$2B', marketCap: '$40B', image: 'https://cryptologos.cc/logos/cardano-ada-logo.png' },
          { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', price: '$18', change: '+4.1%', volume: '$1.5B', marketCap: '$18B', image: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png' }
        ]);
        
        setTrendingCoins([
          { id: 'dogecoin', name: "Dogecoin", symbol: "DOGE", price: "$0.08", age: "2h", txns: "5K", volume: "$500K", fiveMin: "+2.5%", oneHour: "+5%", twentyFourHr: "+10%", liquidity: "$2M", marketCap: "$10M", image: "https://cryptologos.cc/logos/dogecoin-doge-logo.png" },
          { id: 'chainlink', name: "Chainlink", symbol: "LINK", price: "$13.20", age: "4h", txns: "8K", volume: "$800K", fiveMin: "+1.8%", oneHour: "+3%", twentyFourHr: "+8%", liquidity: "$3M", marketCap: "$15M", image: "https://cryptologos.cc/logos/chainlink-link-logo.png" },
          { id: 'polygon', name: "Polygon", symbol: "MATIC", price: "$0.75", age: "1h", txns: "3K", volume: "$300K", fiveMin: "+3.2%", oneHour: "+6%", twentyFourHr: "+12%", liquidity: "$1.5M", marketCap: "$8M", image: "https://cryptologos.cc/logos/polygon-matic-logo.png" },
          { id: 'avalanche', name: "Avalanche", symbol: "AVAX", price: "$32.50", age: "3h", txns: "10K", volume: "$1M", fiveMin: "+1.5%", oneHour: "+4%", twentyFourHr: "+15%", liquidity: "$5M", marketCap: "$25M", image: "https://cryptologos.cc/logos/avalanche-avax-logo.png" },
          { id: 'shiba-inu', name: "Shiba Inu", symbol: "SHIB", price: "$0.00001", age: "5h", txns: "6K", volume: "$600K", fiveMin: "+2.0%", oneHour: "+4.5%", twentyFourHr: "+9%", liquidity: "$2.5M", marketCap: "$12M", image: "https://cryptologos.cc/logos/shiba-inu-shib-logo.png" }
        ]);
      } finally {
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
      // Re-fetch data in parallel
      const [topCoinsData, trendingCoinsData, ratesData] = await Promise.all([
        fetchTopCoins(),
        fetchTrendingCoins(),
        fetchExchangeRates('BTC')
      ]);
      
      setTopCoins(topCoinsData.slice(0, 5));
      setTrendingCoins(trendingCoinsData);
      setExchangeRates(ratesData.data);
      setError(null);
    } catch (err) {
      console.error('Error retrying data fetch from CoinGecko API:', err);
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

  if (error && (!topCoins.length || !trendingCoins.length)) {
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
      <div className="trending-page">
        {/* Exchange Rate Info */}
        {exchangeRates && (
          <section className="exchange-rate-section">
            <h2 className="section-title">Current BTC Exchange Rates</h2>
            <div className="exchange-rate-container">
              <div className="exchange-rate-card">
                <p className="exchange-rate-title">BTC/USD</p>
                <p className="exchange-rate-value">${(1 / parseFloat(exchangeRates.rates.USD)).toLocaleString()}</p>
              </div>
              <div className="exchange-rate-card">
                <p className="exchange-rate-title">BTC/EUR</p>
                <p className="exchange-rate-value">€{(1 / parseFloat(exchangeRates.rates.EUR)).toLocaleString()}</p>
              </div>
              <div className="exchange-rate-card">
                <p className="exchange-rate-title">BTC/GBP</p>
                <p className="exchange-rate-value">£{(1 / parseFloat(exchangeRates.rates.GBP)).toLocaleString()}</p>
              </div>
              <div className="exchange-rate-card">
                <p className="exchange-rate-title">BTC/JPY</p>
                <p className="exchange-rate-value">¥{(1 / parseFloat(exchangeRates.rates.JPY)).toLocaleString()}</p>
              </div>
            </div>
          </section>
        )}

        {/* Top 5 Coins Section */}
        <section className="top-coins-section">
          <h2 className="section-title">Top 5 Coins</h2>
          <div className="top-coins-grid">
            {topCoins.map((coin) => (
              <div key={coin.id} className="top-coin-card">
                <div className="coin-header">
                  <FadeInImage 
                    src={coin.image} 
                    alt={coin.name} 
                    className="coin-logo" 
                  />
                  <div className="coin-title">
                    <Link to={`/coin/${coin.id}`}>
                      <h3>{coin.name}</h3>
                    </Link>
                    <span className="coin-symbol">{coin.symbol}</span>
                  </div>
                </div>
                <div className="coin-stats">
                  <div className="stat-row">
                    <span className="stat-label">Price:</span>
                    <span className="stat-value">{coin.price}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">24h Change:</span>
                     <span className={`stat-value ${coin.change.startsWith('-') ? 'negative' : 'positive'}`}>
                      {coin.change}
                    </span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Volume:</span>
                    <span className="stat-value">{coin.volume}</span>
                  </div>
                </div>
                <div className="watchlist-action">
                  <button
                    onClick={() => handleAddToWatchlist(coin)}
                    className="watchlist-btn"
                  >
                    Add to Watchlist
                  </button>
                  {notification.show && notification.coinId === coin.id && notification.page === 'trending' && (
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
        </section>

        {/* Trending Coins Table */}
        <section className="trending-coins-section">
          <h2 className="section-title">Trending Coins</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Price</th>
                  <th>Age</th>
                  <th>TXNS</th>
                  <th>Volume</th>
                  <th>5m</th>
                  <th>1h</th>
                  <th>24h</th>
                  <th>Liquidity</th>
                  <th>Market Cap</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {trendingCoins.map((coin) => (
                  <tr key={coin.id}>
                    <td>
                      <div className="coin-cell">
                        <FadeInImage 
                          src={coin.image || "/solana.png"} 
                          alt={`${coin.name} Logo`} 
                          className="coin-icon" 
                        />
                        <Link to={`/coin/${coin.id}`}>
                          <span>{coin.name}</span>
                        </Link>
                      </div>
                    </td>
                    <td>{coin.price}</td>
                    <td>{coin.age}</td>
                    <td>{coin.txns}</td>
                    <td>{coin.volume}</td>
                    <td className="positive">{coin.fiveMin}</td>
                    <td className="positive">{coin.oneHour}</td>
                    <td className={coin.twentyFourHr.startsWith('-') ? 'negative' : 'positive'}>{coin.twentyFourHr}</td>
                    <td>{coin.liquidity}</td>
                    <td>{coin.marketCap}</td>
                    <td>
                      <div className="watchlist-action">
                        <button
                          onClick={() => handleAddToWatchlist(coin)}
                          className="watchlist-btn-small"
                        >
                          Add
                        </button>
                        {notification.show && notification.coinId === coin.id && notification.page === 'trending' && (
                          <div className={`notification-inline ${notification.type}`}>
                            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                            </svg>
                            <span>{notification.message}</span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

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

export default Trending;