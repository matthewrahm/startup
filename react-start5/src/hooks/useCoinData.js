import { useState, useEffect, useCallback } from 'react';
import { fetchCoinPrice, fetchMarketData } from '../services/api';

const REFRESH_INTERVAL = 30000; // 30 seconds
const STALE_THRESHOLD = 60000; // 1 minute

export const useCoinData = (coinId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isStale, setIsStale] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [priceData, marketData] = await Promise.all([
        fetchCoinPrice(coinId),
        fetchMarketData(coinId)
      ]);
      
      setData({ ...priceData, ...marketData });
      setLastUpdated(Date.now());
      setIsStale(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [coinId]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set up refresh interval
  useEffect(() => {
    const intervalId = setInterval(fetchData, REFRESH_INTERVAL);
    
    // Check for stale data
    const staleCheckId = setInterval(() => {
      if (lastUpdated && Date.now() - lastUpdated > STALE_THRESHOLD) {
        setIsStale(true);
      }
    }, 10000);

    return () => {
      clearInterval(intervalId);
      clearInterval(staleCheckId);
    };
  }, [fetchData, lastUpdated]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    isStale,
    lastUpdated,
    refresh
  };
};