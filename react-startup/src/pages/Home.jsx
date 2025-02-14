import React from 'react';
import '../assets/css/dark-theme.css'; 

function Home() {
  return (
    <div>
      {/* Header */}
      <header>
        <nav className="navbar">
          <div className="logo">
            <img src="/solana.png" alt="Website Logo" />
          </div>
          <div className="nav-items">
            <a href="/login">Login</a>
            <a href="/home">Home</a>
            <a href="/trending">Trending</a>
            <a href="/watchlist">Watchlist</a>
            <div className="search-bar">
              <input type="text" placeholder="Search..." />
            </div>
          </div>
        </nav>
      </header>

      {/* Welcome Section */}
      <section className="user-login">
        <h3>Welcome, <span id="username">User</span></h3> 
      </section>

      {/* Coin Info */}
      <main>
        <div className="coin-info">
          <div className="coin-header">
            <img src="/solana.png" alt="Coin Logo" style={{ width: '220px', height: '200px' }} />
          </div>
          <div className="coin-stats">
            <span>24h Volume: $<span id="volume">Waiting for WebSocket data...</span></span>
            <span>24h TXNS: <span id="txns">Waiting for WebSocket data...</span></span>
          </div>
          <div className="coin-chart">
            <img src="/chart.png" alt="Price Chart" />
          </div>
        </div>

        {/* Coin Details */}
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

        {/* Watchlist */}
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

      {/* Footer */}
      <footer>
        <div>
          <a href="https://github.com/matthewrahm/startup.git" target="_blank" id="github-link" rel="noopener noreferrer">GitHub</a>
        </div>
      </footer>
    </div>
  );
}

export default Home;
