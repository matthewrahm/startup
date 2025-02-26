import React, { useState } from "react";
import {  useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import "../components/css/styles.css";
function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
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
    
    // Accept any username/password combination
    login({ username: formData.username });
    navigate('/home');
  };

  return (
    <div style={{ backgroundColor: "#121212", color: "#E0E0E0", minHeight: "100vh" }}>
      {/* Navbar */}
      <nav style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        backgroundColor: "#1A1A1A", 
        padding: "1rem 2rem" 
      }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img 
            src="/solana.png" 
            alt="Website Logo" 
            style={{ 
              height: "40px", 
              width: "40px", 
              borderRadius: "50%", 
              boxShadow: "0 0 10px rgba(20, 241, 149, 0.3)" 
            }} 
          />
        </div>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <a href="/" style={{ color: "#E0E0E0", textDecoration: "none" }}>Login</a>
        </div>
      </nav>

      {/* Header Section */}
      <header style={{ 
        minHeight: "400px", 
        padding: "8rem 0", 
        textAlign: "center", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center" 
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#E0E0E0" }}>
              Welcome to Ramen Crypto
            </h1>
            <p style={{ color: "#888", fontSize: "1.2rem", marginBottom: "2rem" }}>
              Enter any username to start tracking crypto
            </p>
          </div>
        </div>
      </header>

      {/* Login Section */}
      <section style={{ padding: "4rem 0", textAlign: "center" }}>
        <div style={{ maxWidth: "400px", margin: "0 auto", padding: "0 1rem" }}>
          <h2 style={{ marginBottom: "2rem", color: "#E0E0E0" }}>Login to Begin</h2>
          <form 
            onSubmit={handleSubmit} 
            style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "1rem", 
              width: "100%", 
              maxWidth: "400px", 
              margin: "0 auto" 
            }}
          >
            <div style={{ marginBottom: "1.5rem" }}>
              <input 
                type="text" 
                id="username" 
                name="username" 
                style={{ 
                  width: "100%", 
                  padding: "0.75rem", 
                  marginBottom: "1rem", 
                  border: "1px solid #888", 
                  borderRadius: "4px", 
                  background: "#1A1A1A", 
                  color: "#E0E0E0" 
                }} 
                placeholder="Enter your username" 
                value={formData.username}
                onChange={handleChange}
                required 
              />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <input 
                type="password" 
                id="password" 
                name="password" 
                style={{ 
                  width: "100%", 
                  padding: "0.75rem", 
                  marginBottom: "1rem", 
                  border: "1px solid #888", 
                  borderRadius: "4px", 
                  background: "#1A1A1A", 
                  color: "#E0E0E0" 
                }} 
                placeholder="Enter your password" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
            </div>
            <button 
              type="submit" 
              style={{ 
                background: "linear-gradient(45deg, #9945FF, #14F195)", 
                color: "#E0E0E0", 
                border: "none", 
                padding: "0.75rem 1.5rem", 
                borderRadius: "6px", 
                cursor: "pointer", 
                fontWeight: "600", 
                width: "100%", 
                marginTop: "1rem" 
              }}
            >
              Login
            </button>
          </form>
          <div style={{ marginTop: "1.5rem", color: "#888" }}>
            <p>Enter any username and password to continue</p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer style={{ 
        textAlign: "center", 
        padding: "2rem", 
        backgroundColor: "#1A1A1A", 
        marginTop: "auto" 
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          <p>Powered by Ramen Crypto</p>
          <a 
            href="https://github.com/matthewrahm/startup.git" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: "#14F195", textDecoration: "none" }}
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Login;