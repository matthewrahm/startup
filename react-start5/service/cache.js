const NodeCache = require('node-cache');

// Initialize cache with default TTL of 30 seconds
const cache = new NodeCache({
  stdTTL: 30,
  checkperiod: 5,
  useClones: false
});

// Cache middleware
const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      console.log(`Cache hit for ${key}`);
      return res.json(cachedResponse);
    }

    // Override res.json to cache the response
    const originalJson = res.json;
    res.json = function(body) {
      cache.set(key, body, duration);
      return originalJson.call(this, body);
    };

    next();
  };
};

// Cache durations for different endpoints
const CACHE_DURATIONS = {
  PRICE: 10,      // 10 seconds for price data
  MARKET: 30,     // 30 seconds for market data
  STATIC: 300     // 5 minutes for more static data
};

module.exports = {
  cache,
  cacheMiddleware,
  CACHE_DURATIONS
};