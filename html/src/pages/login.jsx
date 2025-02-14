import React from 'react';
import '../assets/css/styles.css';

function Login() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
        <div className="container">
          <a className="navbar-brand" href="/">Ramen Crypto</a>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><a className="nav-link" href="/home">Home</a></li>
              <li className="nav-item"><a className="nav-link" href="/trending">Trending</a></li>
              <li className="nav-item"><a className="nav-link" href="/watchlist">Watchlist</a></li>
              <li className="nav-item"><a className="nav-link" href="/">Login</a></li>
            </ul>
          </div>
        </div>
      </nav>

      <header className="masthead">
        <div className="container d-flex h-100 align-items-center">
          <div className="mx-auto text-center">
            <h1 className="text-white">Welcome to Ramen Crypto</h1>
            <a className="btn" href="/">Login and Hit Home to Get Started</a>
          </div>
        </div>
      </header>

      <footer className="footer text-center">
        <div className="container">
          <p className="text-muted">Powered by Ramen Crypto</p>
          <a href="https://github.com/matthewrahm/startup.git" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </footer>
    </div>
  );
}

export default Login;
