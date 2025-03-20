import { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';

const RECONNECT_INTERVAL = 5000; // 5 seconds
const MAX_RETRY_ATTEMPTS = 5;
const STALE_DATA_THRESHOLD = 30000; // 30 seconds

export const useRealtimeData = (endpoint, initialData = null) => {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStale, setIsStale] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const socketRef = useRef(null);
  const retryTimeoutRef = useRef(null);
  const staleCheckIntervalRef = useRef(null);

  // Function to check if data is stale
  const checkDataFreshness = useCallback(() => {
    if (!lastUpdated) return;
    
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdated;
    setIsStale(timeSinceLastUpdate > STALE_DATA_THRESHOLD);
  }, [lastUpdated]);

  // Function to handle connection errors
  const handleConnectionError = useCallback((error) => {
    console.error('Socket connection error:', error);
    setError('Connection lost. Attempting to reconnect...');
    
    if (retryCount < MAX_RETRY_ATTEMPTS) {
      retryTimeoutRef.current = setTimeout(() => {
        console.log(`Attempting to reconnect (attempt ${retryCount + 1}/${MAX_RETRY_ATTEMPTS})...`);
        setRetryCount(prev => prev + 1);
        initializeSocket();
      }, RECONNECT_INTERVAL);
    } else {
      setError('Unable to establish connection. Please refresh the page.');
    }
  }, [retryCount]);

  // Function to initialize socket connection
  const initializeSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const socket = io(window.location.origin, {
      path: '/socket.io',
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      console.log('Socket connected');
      setError(null);
      setRetryCount(0);
      socket.emit('subscribe', endpoint);
    });

    socket.on('data', (newData) => {
      setData(newData);
      setLastUpdated(Date.now());
      setIsLoading(false);
      setIsStale(false);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
      handleConnectionError(error);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      handleConnectionError('Disconnected from server');
    });

    socketRef.current = socket;
  }, [endpoint, handleConnectionError]);

  // Initialize socket connection
  useEffect(() => {
    initializeSocket();
    
    // Set up stale data check interval
    staleCheckIntervalRef.current = setInterval(checkDataFreshness, 5000);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (staleCheckIntervalRef.current) {
        clearInterval(staleCheckIntervalRef.current);
      }
    };
  }, [initializeSocket, checkDataFreshness]);

  // Function to manually refresh data
  const refresh = useCallback(() => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('refresh', endpoint);
      setIsLoading(true);
    } else {
      initializeSocket();
    }
  }, [endpoint, initializeSocket]);

  return {
    data,
    isLoading,
    error,
    isStale,
    lastUpdated,
    refresh
  };
};