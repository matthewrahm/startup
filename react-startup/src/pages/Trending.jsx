import React from 'react';
import '../assets/css/dark-theme.css';

function Trending() {
  return (
    <div>
      {/* Header */}
      <header>
        <nav className="navbar">
          <div className="logo">
            <img src="/logo.png" alt="Website Logo" />
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

      {/* Coin List */}
      <main>
        <section className="coin-list">
          <table>
            <thead>
              <tr>
                <th>Token</th><th>Price</th><th>Age</th><th>TXNS</th><th>Volume</th>
                <th>5m</th><th>1h</th><th>24h</th><th>Liquidity</th><th>Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td><img src="/coin-logo-placeholder.png" alt="Coin Logo" />WebSocket</td>
                  <td>$</td><td>h</td><td></td><td>$</td><td></td>
                  <td>%</td><td>%</td><td>$</td><td>$</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <div>
          <a href="https://github.com/your-github" target="_blank" id="github-link" rel="noopener noreferrer">GitHub</a>
        </div>
      </footer>
    </div>
  );
}

export default Trending;
