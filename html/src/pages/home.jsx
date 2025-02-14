import React from 'react';
import '../assets/css/dark-theme.css';

function Home() {
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

      <section className="user-login">
        <h3>Welcome, <span id="username">User</span></h3> 
      </section>

      <footer>
        <div>
          <a href="https://github.com/matthewrahm/startup.git" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </footer>
    </div>
  );
}

export default Home;
