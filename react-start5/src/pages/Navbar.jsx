import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/SearchBar';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/solana.png" alt="Website Logo" />
      </div>
      <div className="nav-items">
        {user ? (
          <>
            <Link to="/home">Home</Link>
            <Link to="/trending">Trending</Link>
            <Link to="/watchlist">Watchlist</Link>
            <SearchBar />
            <button onClick={handleLogout} className="watchlist-btn">Logout</button>
          </>
        ) : (
          <Link to="/">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;