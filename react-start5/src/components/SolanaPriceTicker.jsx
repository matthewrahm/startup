import React, { useState, useEffect, useRef } from 'react';
import { fetchSolanaPrice } from '../services/api';
import './css/price-ticker.css';

const SolanaPriceTicker = ({ initialPrice, refreshInterval = 10000 }) => {
  const [price, setPrice] = useState(initialPrice || '$0.00');
  const [rawPrice, setRawPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(null); // 'up', 'down', or null
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);
  const previousPriceRef = useRef(null);

  // Parse the initial price to get a numeric value
  useEffect(() => {
    if (initialPrice) {
      const numericPrice = parseFloat(initialPrice.replace(/[^0-9.]/g, ''));
      if (!isNaN(numericPrice) && numericPrice > 0) {
        setRawPrice(numericPrice);
        previousPriceRef.current = numericPrice;
      }
    }
  }, [initialPrice]);

  // Fetch updated price at regular intervals
  useEffect(() => {
    const fetchPrice = async () => {
      setLoading(true);
      try {
        // Fetch real Solana price from API
        const solanaData = await fetchSolanaPrice();
        
        if (solanaData && solanaData.rawPrice) {
          const newRawPrice = solanaData.rawPrice;
          
          // Determine if price went up or down compared to previous price
          if (previousPriceRef.current !== null) {
            if (newRawPrice > previousPriceRef.current) {
              setPriceChange('up');
            } else if (newRawPrice < previousPriceRef.current) {
              setPriceChange('down');
            }
          }
          
          // Update price and raw price
          setPrice(solanaData.price);
          setRawPrice(newRawPrice);
          previousPriceRef.current = newRawPrice;
        }
        
        // Reset price change indicator after animation completes
        setTimeout(() => {
          setPriceChange(null);
        }, 2000);
      } catch (error) {
        console.error('Error fetching Solana price:', error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchPrice();
    
    // Set up interval for regular updates
    intervalRef.current = setInterval(fetchPrice, refreshInterval);
    
    // Clean up interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshInterval]);

  return (
    <div className="solana-price-container">
      <div className={`solana-price-ticker ${priceChange ? `price-${priceChange}` : ''} ${loading ? 'loading' : ''}`}>
        <div className="ticker-content">
          <span className="ticker-label">SOL/USD:</span>
          <span className="ticker-price">{price}</span>
          {priceChange === 'up' && <span className="ticker-arrow up">↑</span>}
          {priceChange === 'down' && <span className="ticker-arrow down">↓</span>}
        </div>
      </div>
    </div>
  );
};

export default SolanaPriceTicker;