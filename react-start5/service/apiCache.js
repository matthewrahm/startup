/**
 * API Cache Service
 * 
 * This service provides caching functionality for API requests to reduce
 * the number of calls made to external APIs and prevent rate limiting.
 */

// Cache storage - stores data with expiration times
const cache = new Map();

// Default cache duration in milliseconds (60 seconds)
const DEFAULT_CACHE_DURATION = 60000;

// Cache configuration for different endpoints
const CACHE_CONFIG = {
  // CoinGecko endpoints
  '/coins/markets': 60000,           // 1 minute
  '/simple/price': 30000,            // 30 seconds
  '/search': 300000,                 // 5 minutes
  '/coins/': 120000,                 // 2 minutes for coin details
  '/exchange_rates': 300000,         // 5 minutes
  '/search/trending': 300000,        // 5 minutes
  
  // Default fallback
  'default': DEFAULT_CACHE_DURATION
};

/**
 * Gets the appropriate cache duration for a given endpoint
 * @param {string} endpoint - The API endpoint
 * @returns {number} - Cache duration in milliseconds
 */
const getCacheDuration = (endpoint) => {
  // Check for exact matches first
  if (CACHE_CONFIG[endpoint]) {
    return CACHE_CONFIG[endpoint];
  }
  
  // Check for partial matches
  for (const key of Object.keys(CACHE_CONFIG)) {
    if (endpoint.includes(key)) {
      return CACHE_CONFIG[key];
    }
  }
  
  // Return default duration if no match
  return CACHE_CONFIG.default;
};

/**
 * Generates a cache key from the endpoint and params
 * @param {string} endpoint - The API endpoint
 * @param {Object} params - The request parameters
 * @returns {string} - A unique cache key
 */
const generateCacheKey = (endpoint, params = {}) => {
  const sortedParams = Object.entries(params || {})
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .join('&');
    
  return `${endpoint}${sortedParams ? `?${sortedParams}` : ''}`;
};

/**
 * Checks if a cached item is still valid
 * @param {Object} cacheItem - The cached item with expiration
 * @returns {boolean} - Whether the item is still valid
 */
const isValidCache = (cacheItem) => {
  if (!cacheItem) return false;
  return Date.now() < cacheItem.expiration;
};

/**
 * Gets data from cache if available and valid
 * @param {string} endpoint - The API endpoint
 * @param {Object} params - The request parameters
 * @returns {Object|null} - The cached data or null if not found/expired
 */
exports.getFromCache = (endpoint, params) => {
  const cacheKey = generateCacheKey(endpoint, params);
  const cacheItem = cache.get(cacheKey);
  
  if (isValidCache(cacheItem)) {
    console.log(`Cache hit for ${cacheKey}`);
    return cacheItem.data;
  }
  
  console.log(`Cache miss for ${cacheKey}`);
  return null;
};

/**
 * Stores data in the cache with an expiration time
 * @param {string} endpoint - The API endpoint
 * @param {Object} params - The request parameters
 * @param {Object} data - The data to cache
 * @param {number} duration - Optional custom duration in milliseconds
 */
exports.storeInCache = (endpoint, params, data, duration) => {
  const cacheKey = generateCacheKey(endpoint, params);
  const cacheDuration = duration || getCacheDuration(endpoint);
  
  cache.set(cacheKey, {
    data,
    expiration: Date.now() + cacheDuration
  });
  
  console.log(`Cached data for ${cacheKey} (expires in ${cacheDuration/1000}s)`);
};

/**
 * Clears a specific item from the cache
 * @param {string} endpoint - The API endpoint
 * @param {Object} params - The request parameters
 */
exports.clearCacheItem = (endpoint, params) => {
  const cacheKey = generateCacheKey(endpoint, params);
  cache.delete(cacheKey);
};

/**
 * Clears all expired items from the cache
 */
exports.clearExpiredCache = () => {
  for (const [key, value] of cache.entries()) {
    if (!isValidCache(value)) {
      cache.delete(key);
    }
  }
};

/**
 * Clears the entire cache
 */
exports.clearCache = () => {
  cache.clear();
  console.log('Cache cleared');
};

// Set up periodic cache cleanup
setInterval(exports.clearExpiredCache, 300000); // Clean up every 5 minutes