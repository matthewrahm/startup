import React from "react";
import Navbar from "./Navbar"
import { useWatchlist } from "../context/WatchlistContext";
import "../components/css/trending.css";
import FadeInImage from "../components/FadeInImage";


// Top 5 coins data
const topCoins = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: '$45,000', change: '+5.2%', volume: '$28B', marketCap: '$850B', image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', price: '$2,800', change: '+3.8%', volume: '$15B', marketCap: '$330B', image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  { id: 'sol', name: 'Solana', symbol: 'SOL', price: '$98', change: '+7.5%', volume: '$4B', marketCap: '$38B', image: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
  { id: 'ada', name: 'Cardano', symbol: 'ADA', price: '$1.20', change: '+2.9%', volume: '$2B', marketCap: '$40B', image: 'https://cryptologos.cc/logos/cardano-ada-logo.png' },
  { id: 'dot', name: 'Polkadot', symbol: 'DOT', price: '$18', change: '+4.1%', volume: '$1.5B', marketCap: '$18B', image: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png' }
];

// Regular trending coins data
const trendingCoins = [
  { id: 1, name: "WebSocket", price: "$0.50", age: "2h", txns: "5K", volume: "$500K", fiveMin: "+2.5%", oneHour: "+5%", twentyFourHr: "+10%", liquidity: "$2M", marketCap: "$10M" },
  { id: 2, name: "DeFi Token", price: "$1.20", age: "4h", txns: "8K", volume: "$800K", fiveMin: "+1.8%", oneHour: "+3%", twentyFourHr: "+8%", liquidity: "$3M", marketCap: "$15M" },
  { id: 3, name: "GameFi", price: "$0.75", age: "1h", txns: "3K", volume: "$300K", fiveMin: "+3.2%", oneHour: "+6%", twentyFourHr: "+12%", liquidity: "$1.5M", marketCap: "$8M" },
  { id: 4, name: "NFT Market", price: "$2.50", age: "3h", txns: "10K", volume: "$1M", fiveMin: "+1.5%", oneHour: "+4%", twentyFourHr: "+15%", liquidity: "$5M", marketCap: "$25M" },
  { id: 5, name: "MetaToken", price: "$0.90", age: "5h", txns: "6K", volume: "$600K", fiveMin: "+2.0%", oneHour: "+4.5%", twentyFourHr: "+9%", liquidity: "$2.5M", marketCap: "$12M" }
];

function Trending() {
  const { addToWatchlist, notification } = useWatchlist();

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

  return (
    <>
      <Navbar />
      <div className="trending-page">
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
                    <h3>{coin.name}</h3>
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
                    <span className="stat-value positive">{coin.change}</span>
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
                          src="/solana.png" 
                          alt="Coin Logo" 
                          className="coin-icon" 
                        />
                        <span>{coin.name}</span>
                      </div>
                    </td>
                    <td>{coin.price}</td>
                    <td>{coin.age}</td>
                    <td>{coin.txns}</td>
                    <td>{coin.volume}</td>
                    <td className="positive">{coin.fiveMin}</td>
                    <td className="positive">{coin.oneHour}</td>
                    <td className="positive">{coin.twentyFourHr}</td>
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