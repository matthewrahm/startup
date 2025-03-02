import React, { useState, useEffect, useRef } from 'react';
import './css/price-ticker.css';

const SolanaPriceTicker = ({ initialPrice, refreshInterval = 15000 }) => {
  const [price, setPrice] = useState(initialPrice || '$0.00');
  const [rawPrice, setRawPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(null); // 'up', 'down', or null
  const [expanded, setExpanded] = useState(false);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const tickerRef = useRef(null);
  const expandedRef = useRef(null);

  // Parse the initial price to get a numeric value
  useEffect(() => {
    if (initialPrice) {
      const numericPrice = parseFloat(initialPrice.replace(/[^0-9.]/g, ''));
      if (!isNaN(numericPrice)) {
        setRawPrice(numericPrice);
        // Initialize price history with the current price
        setPriceHistory([
          { price: numericPrice, timestamp: new Date().toLocaleTimeString() }
        ]);
      }
    }
  }, [initialPrice]);

  // Fetch updated price at regular intervals
  useEffect(() => {
    const fetchPrice = async () => {
      setLoading(true);
      try {
        // Simulate API call with random price fluctuation
        // In a real app, replace this with actual API call to CoinGecko
        const fluctuation = (Math.random() * 2 - 1) * (rawPrice * 0.01); // ±1% change
        const newRawPrice = rawPrice + fluctuation;
        const formattedPrice = `$${newRawPrice.toFixed(2)}`;
        
        // Determine if price went up or down
        if (newRawPrice > rawPrice) {
          setPriceChange('up');
        } else if (newRawPrice < rawPrice) {
          setPriceChange('down');
        }
        
        // Update price and raw price
        setPrice(formattedPrice);
        setRawPrice(newRawPrice);
        
        // Add to price history (keep last 10 entries)
        setPriceHistory(prev => {
          const newHistory = [
            { price: newRawPrice, timestamp: new Date().toLocaleTimeString() },
            ...prev
          ].slice(0, 10);
          return newHistory;
        });
        
        // Reset price change indicator after animation completes
        setTimeout(() => {
          setPriceChange(null);
        }, 1000);
      } catch (error) {
        console.error('Error fetching Solana price:', error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchPrice();
    
    // Set up interval for regular updates
    const intervalId = setInterval(fetchPrice, refreshInterval);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [rawPrice, refreshInterval]);

  // Handle click outside to close expanded view
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (expandedRef.current && !expandedRef.current.contains(event.target) &&
          tickerRef.current && !tickerRef.current.contains(event.target)) {
        setExpanded(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate price change percentage for history items
  const calculateChangePercentage = (current, previous) => {
    if (!previous) return '0.00%';
    const percentChange = ((current - previous) / previous) * 100;
    const sign = percentChange >= 0 ? '+' : '';
    return `${sign}${percentChange.toFixed(2)}%`;
  };

  return (
    <div className="solana-price-container">
      <div 
        ref={tickerRef}
        className={`solana-price-ticker ${priceChange ? `price-${priceChange}` : ''} ${loading ? 'loading' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="ticker-content">
          <span className="ticker-label">SOL/USD:</span>
          <span className="ticker-price">{price}</span>
          {priceChange === 'up' && <span className="ticker-arrow up">↑</span>}
          {priceChange === 'down' && <span className="ticker-arrow down">↓</span>}
        </div>
      </div>
      
      {expanded && (
        <div ref={expandedRef} className="price-expanded">
          <div className="expanded-header">
            <h3>Solana Price History</h3>
            <button className="close-btn" onClick={() => setExpanded(false)}>×</button>
          </div>
          <div className="price-history">
            {priceHistory.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Price</th>
                    <th>Change</th>
                  </tr>
                </thead>
                <tbody>
                  {priceHistory.map((entry, index) => {
                    const prevEntry = priceHistory[index + 1];
                    const changePercentage = calculateChangePercentage(entry.price, prevEntry?.price);
                    const isPositive = !changePercentage.includes('-');
                    
                    return (
                      <tr key={index}>
                        <td>{entry.timestamp}</td>
                        <td>${entry.price.toFixed(2)}</td>
                        <td className={isPositive ? 'positive' : 'negative'}>
                          {changePercentage}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p>No price history available yet</p>
            )}
          </div>
          <div className="ticker-controls">
            <label>
              Update Speed:
              <select 
                onChange={(e) => {
                  const newInterval = parseInt(e.target.value);
                  // This would need to be handled by a parent component in a real implementation
                  console.log(`Update interval changed to ${newInterval}ms`);
                }}
                defaultValue={refreshInterval}
              >
                <option value="5000">Fast (5s)</option>
                <option value="15000">Normal (15s)</option>
                <option value="30000">Slow (30s)</option>
              </select>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolanaPriceTicker;