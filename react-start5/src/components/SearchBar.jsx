import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchCoins } from '../services/api';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim() === '') {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchCoins(searchTerm);
        setSuggestions(results);
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search requests
    const timeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSearch = (value) => {
    setSearchTerm(value);
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
      {isActive && (
        <div className="search-suggestions">
          {isLoading ? (
            <div className="suggestion-item">
              <span>Loading...</span>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((coin) => (
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
            ))
          ) : searchTerm ? (
            <div className="suggestion-item no-results">
              No coins found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default SearchBar;