import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import "../components/css/styles.css";

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();
  const { user, login } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Accept any username/password combination
    login({ username: formData.username });
    navigate('/home');
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
            <p className="text-white-50">Enter any username to start tracking crypto</p>
          </div>
        </div>
      </header>

      {/* Login Section */}
      <section id="login" className="text-center">
        <div className="container">
          <h2 className="text-white mb-4">Login to Begin</h2>
          <form onSubmit={handleSubmit} className="form-inline d-flex flex-column align-items-center">
            <div className="form-group mb-3">
              <input 
                type="text" 
                id="username" 
                name="username" 
                className="form-control" 
                placeholder="Enter your username" 
                value={formData.username}
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
            <p>Enter any username and password to continue</p>
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