import React from 'react';
import '../assets/css/dark-theme.css';

function Trending() {
  return (
    <div>
      <header>
        <nav className="navbar">
          <div className="logo">
            <img src="../assets/images/logo.png" alt="Website Logo" />
          </div>
          <div className="nav-items">
            <a href="/">Login</a>
            <a href="/home">Home</a>
            <a href="/trending">Trending</a>
            <a href="/watchlist">Watchlist</a>
            <div className="search-bar">
              <input type="text" placeholder="Search..." />
            </div>
          </div>
        </nav>
      </header>

      <main>
        <section className="coin-list">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Price</th>
                <th>Age</th>
                <th>TXNS</th>
                <th>Volume</th>
                <th>Market Cap</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Coin 1</td>
                <td>$100</td>
                <td>1y</td>
                <td>500</td>
                <td>$1M</td>
                <td>$50M</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>

      <footer>
        <div>
          <a href="https://github.com/your-github" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </footer>
    </div>
  );
}

export default Trending;
