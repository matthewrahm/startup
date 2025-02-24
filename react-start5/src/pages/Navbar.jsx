import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
        <img src="/src/styles/solana.png" alt="Website Logo" />
      </div>
      <div className="nav-items">
        {user ? (
          <>
            <Link to="/home">Home</Link>
            <Link to="/trending">Trending</Link>
            <Link to="/watchlist">Watchlist</Link>
            <button onClick={handleLogout} className="nav-link">Logout</button>
            <div className="search-bar">
              <input type="text" placeholder="Search..." />
            </div>
          </>
        ) : (
          <Link to="/">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;