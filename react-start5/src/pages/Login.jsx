import React from "react";
import { Link } from "react-router-dom";
import "../components/css/styles.css"; 

function Login() {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top" id="mainNav">
        <div className="container">
          <a className="navbar-brand" href="#page-top">Ramen Crypto</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive"
            aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            Menu
            <i className="fas fa-bars"></i>
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link className="nav-link" to="/home">Home</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/trending">Trending</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/watchlist">Watchlist</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/">Login</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <header className="masthead">
        <div className="container d-flex h-100 align-items-center">
          <div className="mx-auto text-center">
            <h1 className="text-white">Welcome to Ramen Crypto</h1>
            <br />
            <a className="btn" href="#">Login and Hit Home to Get Started</a>
          </div>
        </div>
      </header>

      {/* Login Section */}
      <section id="login" className="text-center">
        <div className="container">
          <h2 className="text-white">Login to Begin</h2>
          <form action="#" method="POST" id="login-form" className="form-inline d-flex flex-column align-items-center">
            <div className="form-group mb-3">
              <input type="email" id="email" name="email" className="form-control" placeholder="Enter your username" required />
            </div>
            <div className="form-group mb-3">
              <input type="password" id="password" name="password" className="form-control" placeholder="Enter your password" required />
            </div>
            <button type="submit" className="btn">Login</button>
          </form>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer text-center">
        <div className="container">
          <p className="text-muted">Powered by Ramen Crypto</p>
          <a href="https://github.com/matthewrahm/startup.git" target="_blank" rel="noopener noreferrer" className="text-black">GitHub</a>
        </div>
      </footer>

      {/* Bootstrap JS */}
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </>
  );
}

export default Login;
