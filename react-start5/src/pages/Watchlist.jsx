import React from "react";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";
import { useWatchlist } from "../context/WatchlistContext";
import "/src/components/css/dark-theme.css"; 


function Watchlist() {
  const { user } = useAuth();
  const { watchlist, removeFromWatchlist, notification } = useWatchlist();

  return (
    <>
      <Navbar />
      <main>
        <section className="user-info">
          <h2>Welcome, <span id="username">{user?.email || 'User'}</span></h2>
          <h3>Your Watchlist</h3>

          {watchlist.length === 0 ? (
            <p>No coins in your watchlist yet. Add some from the Home or Trending page!</p>
          ) : (
            <div className="watchlist-grid">
              {watchlist.map((coin) => (
                <div key={coin.id} className="watchlist-item">
                  <h3>{coin.name}</h3>
                  <div className="coin-stats">
                    <p>Price: {coin.price}</p>
                    <p>Volume: {coin.volume}</p>
                    <p>TXNS: {coin.txns}</p>
                  </div>
                  <div className="watchlist-action">
                    <button
                      onClick={() => removeFromWatchlist(coin)}
                      className="remove-btn"
                    >
                      Remove from Watchlist
                    </button>
                    {notification.show && notification.coinId === coin.id && notification.page === 'watchlist' && (
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
          )}
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

export default Watchlist;