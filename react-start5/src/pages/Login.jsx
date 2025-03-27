import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import "../components/css/Login.css";

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login, loading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate('/home');
    }
  }, [user, loading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(formData);
      navigate('/home');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <h1>Welcome to Ramen Crypto</h1>
          <p>Login to start tracking crypto</p>
        </div>
        
        <div className="login-form-container">
          <h2>Login to Begin</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <input 
                type="email" 
                id="email" 
                name="email" 
                className="login-input"
                placeholder="Enter your email" 
                value={formData.email}
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
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;