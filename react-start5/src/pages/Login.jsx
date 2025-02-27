import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import "../components/css/Login.css";

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
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <h1>Welcome to Ramen Crypto</h1>
          <p>Enter any username to start tracking crypto</p>
        </div>
        
        <div className="login-form-container">
          <h2>Login to Begin</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <input 
                type="text" 
                id="username" 
                name="username" 
                className="login-input"
                placeholder="Enter your username" 
                value={formData.username}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <input 
                type="password" 
                id="password" 
                name="password" 
                className="login-input"
                placeholder="Enter your password" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
            </div>
            <button 
              type="submit" 
              className="login-button"
            >
              Login
            </button>
          </form>
          <div className="login-help">
            <p>Enter any username and password to continue</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;