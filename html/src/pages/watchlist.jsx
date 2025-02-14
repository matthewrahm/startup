import React from 'react';
import '../assets/css/dark-theme.css';

function Watchlist() {
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
          </div>
        </nav>
      </header>

      <main>
        <h2>Your Watchlist</h2>
        <p>Saved favorite coins</p>
      </main>

      <footer>
        <div>
          <a href="https://github.com/your-github" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </footer>
    </div>
  );
}

export default Watchlist;
