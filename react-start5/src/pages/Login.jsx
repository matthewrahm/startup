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
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      if (!formData.email || !formData.password) {
        throw new Error('Please fill in all fields');
      }

      if (!formData.email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Login will automatically create a new account if it doesn't exist
      await login(formData);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      setFormData(prev => ({ ...prev, password: '' }));
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
          <p>Enter your email to get started</p>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
            <button 
              className="error-close" 
              onClick={() => setError('')}
              aria-label="Close error message"
            >
              ×
            </button>
          </div>
        )}

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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Continue'}
          </button>
        </form>
        <div className="login-help">
          <p>Your account will be created automatically if it doesn't exist</p>
        </div>
      </div>
    </div>
  );
}

export default Login;