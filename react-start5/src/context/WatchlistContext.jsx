import React, { createContext, useContext, useState, useEffect } from 'react';

const WatchlistContext = createContext(null);

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    coinId: null,
    type: 'success',
    page: null
  });

  useEffect(() => {
    // Load watchlist from localStorage on mount
    const savedWatchlist = localStorage.getItem('watchlist');
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }
  }, []);

  const showNotification = (message, coinId, type = 'success', page) => {
    // Clear any existing notification first
    setNotification({ show: false, message: '', coinId: null, type: 'success', page: null });
    
    // Set new notification after a brief delay to ensure animation triggers
    setTimeout(() => {
      setNotification({ show: true, message, coinId, type, page });
    }, 100);

    // Hide notification after delay
    setTimeout(() => {
      setNotification({ show: false, message: '', coinId: null, type: 'success', page: null });
    }, 3000);
  };

  const addToWatchlist = (coin) => {
    // Check if coin is already in watchlist
    if (watchlist.some(item => item.id === coin.id)) {
      showNotification(`${coin.name} is already in your watchlist!`, coin.id, 'success', window.location.pathname.includes('trending') ? 'trending' : 'home');
      return;
    }

    const updatedWatchlist = [...watchlist, coin];
    setWatchlist(updatedWatchlist);
    localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
    showNotification(`${coin.name} added to watchlist!`, coin.id, 'success', window.location.pathname.includes('trending') ? 'trending' : 'home');
  };

  const removeFromWatchlist = (coin) => {
    const updatedWatchlist = watchlist.filter(item => item.id !== coin.id);
    setWatchlist(updatedWatchlist);
    localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
    showNotification(`${coin.name} removed from watchlist!`, coin.id, 'remove', 'watchlist');
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, notification }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};