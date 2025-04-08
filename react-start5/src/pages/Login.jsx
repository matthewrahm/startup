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
  const [isRegistering, setIsRegistering] = useState(false);
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
    setIsRegistering(false);
    
    try {
      await login(formData);
      navigate('/home');
    } catch (err) {
      // If the error is about registration, show a more user-friendly message
      if (err.message.includes('already exists')) {
        setError('This email is already registered. Please try logging in.');
      } else if (err.message.includes('registration')) {
        setIsRegistering(true);
        setError('Creating your account...');
        // Try registration again
        try {
          await login(formData);
          navigate('/home');
        } catch (registerErr) {
          setError('Failed to create account. Please try again.');
        }
      } else {
        setError(err.message || 'An error occurred. Please try again.');
      }
      // Clear password field on error
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
          <p>{isRegistering ? 'Creating your account...' : 'Enter your email to get started'}</p>
        </div>
        
        <div className="login-form-container">
          <h2>{isRegistering ? 'Create Account' : 'Login'}</h2>
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
              {isLoading ? 'Processing...' : isRegistering ? 'Creating Account...' : 'Continue'}
            </button>
          </form>
          <div className="login-help">
            <p>Your account will be created automatically if it doesn't exist</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;