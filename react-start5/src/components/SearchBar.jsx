import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Combine all coins data for search
const allCoins = [
  // Home page coins
  { id: 1, name: "Coin 1", page: "home" },
  { id: 2, name: "Coin 2", page: "home" },
  { id: 3, name: "Coin 3", page: "home" },
  
  // Trending page coins
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', page: "trending" },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', page: "trending" },
  { id: 'sol', name: 'Solana', symbol: 'SOL', page: "trending" },
  { id: 'ada', name: 'Cardano', symbol: 'ADA', page: "trending" },
  { id: 'dot', name: 'Polkadot', symbol: 'DOT', page: "trending" },
  
  // Additional trending coins
  { id: 1, name: "WebSocket", page: "trending" },
  { id: 2, name: "DeFi Token", page: "trending" },
  { id: 3, name: "GameFi", page: "trending" },
  { id: 4, name: "NFT Market", page: "trending" },
  { id: 5, name: "MetaToken", page: "trending" }
];

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    // Handle clicks outside of search component
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsActive(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.trim() === '') {
      setSuggestions([]);
      return;
    }

    const searchResults = allCoins.filter(coin => 
      coin.name.toLowerCase().includes(value.toLowerCase()) ||
      (coin.symbol && coin.symbol.toLowerCase().includes(value.toLowerCase()))
    );

    setSuggestions(searchResults);
    setIsActive(true);
  };

  const handleSelect = (coin) => {
    setSearchTerm('');
    setSuggestions([]);
    setIsActive(false);
    navigate(`/${coin.page}`);
  };

  return (
    <div className="search-container" ref={searchRef}>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search coins..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsActive(true)}
        />
      </div>
      {isActive && suggestions.length > 0 && (
        <div className="search-suggestions">
          {suggestions.map((coin) => (
            <div
              key={`${coin.id}-${coin.page}`}
              className="suggestion-item"
              onClick={() => handleSelect(coin)}
            >
              <span className="suggestion-name">{coin.name}</span>
              {coin.symbol && (
                <span className="suggestion-symbol">{coin.symbol}</span>
              )}
              <span className="suggestion-page">{coin.page}</span>
            </div>
          ))}
        </div>
      )}
      {isActive && searchTerm && suggestions.length === 0 && (
        <div className="search-suggestions">
          <div className="suggestion-item no-results">
            No coins found
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;