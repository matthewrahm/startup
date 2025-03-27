import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on component mount
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
    } finally {
      // Set loading to false after checking authentication
      setLoading(false);
    }
  }, []);

  const login = async (userData) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password
        })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      // Create user info object with the response data
      const userInfo = {
        ...data.user,
        token: data.token,
        isAuthenticated: true,
        loginTime: new Date().toISOString()
      };
      
      // Update user state
      setUser(userInfo);
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      return userInfo;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    // Clear user state
    setUser(null);
    
    // Remove from localStorage
    try {
      localStorage.removeItem('user');
    } catch (error) {
      console.error("Error removing user from localStorage:", error);
    }
  };

  // Provide auth context values
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};