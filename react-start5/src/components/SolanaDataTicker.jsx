import React, { useState, useEffect, useRef } from 'react';
import { fetchSolanaData } from '../services/api';
import './css/price-ticker.css';

const SolanaDataTicker = ({ 
  dataType, 
  initialValue, 
  refreshInterval = 10000,
  label
}) => {
  const [value, setValue] = useState(initialValue || '0');
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);
  const previousValueRef = useRef(null);

  // Parse the initial value to get a numeric value (if applicable)
  useEffect(() => {
    if (initialValue) {
      // Store the initial value for reference
      previousValueRef.current = initialValue;
    }
  }, [initialValue]);

  // Fetch updated data at regular intervals
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Solana data from API
        const solanaData = await fetchSolanaData();
        
        if (solanaData) {
          let newValue;
          
          // Get the appropriate value based on dataType
          switch(dataType) {
            case 'volume':
              newValue = solanaData.volume;
              break;
            case 'txns':
              newValue = solanaData.txns;
              break;
            default:
              newValue = initialValue;
          }
          
          // Update value if we got a valid response
          if (newValue) {
            setValue(newValue);
            previousValueRef.current = newValue;
          }
        }
      } catch (error) {
        console.error(`Error fetching Solana ${dataType}:`, error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchData();
    
    // Set up interval for regular updates
    intervalRef.current = setInterval(fetchData, refreshInterval);
    
    // Clean up interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [dataType, initialValue, refreshInterval]);

  return (
    <div className="solana-data-container">
      <div className={`solana-data-ticker ${loading ? 'loading' : ''}`}>
        <div className="ticker-content">
          <span className="ticker-label">{label || `${dataType}:`}</span>
          <span className="ticker-value">{value}</span>
        </div>
      </div>
    </div>
  );
};

export default SolanaDataTicker;