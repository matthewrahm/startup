import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";
import "/src/components/css/dark-theme.css"; 
import solanaLogo from "/solana.png"; 
import chartImage from "../styles/solana.png"; 
import logoImage from "../styles/solana.png"; 

function Home() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      
      {/* User Login Section */}
      <section className="user-login">
        <h3>
          Welcome, <span id="username">{user?.email || 'User'}</span>
        </h3>
      </section>

      {/* Main Section */}
      <main>
        <div className="coin-info">
          <div className="coin-header">
            <img src={solanaLogo} alt="Coin Logo" style={{ width: "220px", height: "200px" }} />
          </div>
          <div className="coin-stats">
            <span>
              24h Volume: $<span id="volume">Waiting for WebSocket data...</span>
            </span>
            <span>
              24h TXNS: <span id="txns">Waiting for WebSocket data...</span>
            </span>
          </div>
          <div className="coin-chart">
            <img src={chartImage} alt="Price Chart" />
          </div>
        </div>

        {/* Coin Details Section */}
        <section className="coin-details">
          {[...Array(3)].map((_, index) => (
            <div className="coin-detail" key={index}>
              <label>Price:</label>
              <input type="text" placeholder="Waiting for WebSocket data..." />

              <label>Age:</label>
              <input type="text" placeholder="Waiting for WebSocket data..." />

              <label>TXNS:</label>
              <input type="text" placeholder="Waiting for WebSocket data..." />

              <label>Volume:</label>
              <input type="text" placeholder="Waiting for WebSocket data..." />

              <label htmlFor={`favorite-coin-${index}`}>Add to Watchlist</label>
              <input type="checkbox" id={`favorite-coin-${index}`} />
            </div>
          ))}
        </section>

        {/* Watchlist Section */}
        <section className="watchlist">
          <h2>Watchlist</h2>
          <p>Store favorited coins in this area</p>
          {[...Array(4)].map((_, index) => (
            <div className="watchlist-item" key={index}>
              <input type="text" placeholder="Loading..." /> Logo
            </div>
          ))}
        </section>
      </main>

      {/* Footer Section */}
      <footer>
        <div>
          <a href="https://github.com/matthewrahm/startup.git" target="_blank" rel="noopener noreferrer" id="github-link">
            GitHub
          </a>
        </div>
      </footer>
    </>
  );
}

export default Home;