import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../react-start5/src/context/AuthContext';
import { WatchlistProvider } from '../react-start5/src/context/WatchlistContext';
import Login from './src/pages/Login';
import Home from './src/pages/Home';
import Trending from './src/pages/Trending';
import Watchlist from './src/pages/Watchlist';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Show loading indicator while checking authentication
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  // Render children if authenticated
  return children;
};

function App() {
  return (
    <AuthProvider>
      <WatchlistProvider>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trending"
              element={
                <ProtectedRoute>
                  <Trending />
                </ProtectedRoute>
              }
            />
            <Route
              path="/watchlist"
              element={
                <ProtectedRoute>
                  <Watchlist />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </WatchlistProvider>
    </AuthProvider>
  );
}

export default App;