import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import "../components/css/styles.css";

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const validCredentials = {
      email: 'user@example.com',
      password: 'password123'
    };

    if (formData.email === validCredentials.email && formData.password === validCredentials.password) {
      const userData = {
        email: formData.email,
        isAuthenticated: true,
        loginTime: new Date().toISOString()
      };
      login(userData);
      navigate('/home');
    } else {
      setError('Invalid email or password');
    }
  };

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
            <p className="text-white-50">Login to access real-time crypto tracking</p>
          </div>
        </div>
      </header>

      {/* Login Section */}
      <section id="login" className="text-center">
        <div className="container">
          <h2 className="text-white mb-4">Login to Begin</h2>
          {error && <div className="alert alert-danger mb-3">{error}</div>}
          <form onSubmit={handleSubmit} className="form-inline d-flex flex-column align-items-center">
            <div className="form-group mb-3">
              <input 
                type="email" 
                id="email" 
                name="email" 
                className="form-control" 
                placeholder="Enter your email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group mb-3">
              <input 
                type="password" 
                id="password" 
                name="password" 
                className="form-control" 
                placeholder="Enter your password" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
          <div className="mt-3 text-white-50">
            <p>Test credentials:</p>
            <p>Email: user@example.com</p>
            <p>Password: password123</p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer text-center">
        <div className="container">
          <p className="text-muted">Powered by Ramen Crypto</p>
          <a href="https://github.com/matthewrahm/startup.git" target="_blank" rel="noopener noreferrer" className="text-black">GitHub</a>
        </div>
      </footer>
    </>
  );
}

export default Login;