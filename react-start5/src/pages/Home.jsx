import React from "react";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";
import { useWatchlist } from "../context/WatchlistContext";
import "/src/components/css/dark-theme.css"; 


const dummyCoins = [
  { id: 1, name: "Coin 1", price: "$100", volume: "$1M", txns: "10K" },
  { id: 2, name: "Coin 2", price: "$200", volume: "$2M", txns: "20K" },
  { id: 3, name: "Coin 3", price: "$300", volume: "$3M", txns: "30K" },
];

function Home() {
  const { user } = useAuth();
  const { addToWatchlist, notification } = useWatchlist();

  return (
    <>
      <Navbar />
      <main>
        <div className="coin-info">
          <div className="coin-header">
            <img src="/solana.png" alt="Solana Logo" />
          </div>
          <div className="coin-stats">
            <span>24h Volume: $<span id="volume">1.5B</span></span>
            <span>24h TXNS: <span id="txns">2.3M</span></span>
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
          {dummyCoins.map((coin) => (
            <div className="coin-detail" key={coin.id}>
              <h3>{coin.name}</h3>
              <div className="coin-stats">
                <p>Price: {coin.price}</p>
                <p>Volume: {coin.volume}</p>
                <p>TXNS: {coin.txns}</p>
              </div>
              <div className="watchlist-action">
                <button
                  onClick={() => addToWatchlist(coin)}
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