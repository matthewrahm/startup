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

  const login = (userData) => {
    const userInfo = {
      username: userData.username,
      isAuthenticated: true,
      loginTime: new Date().toISOString()
    };
    
    // Update user state
    setUser(userInfo);
    
    // Save to localStorage
    try {
      localStorage.setItem('user', JSON.stringify(userInfo));
    } catch (error) {
      console.error("Error saving user to localStorage:", error);
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