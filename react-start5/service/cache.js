import NodeCache from 'node-cache';

// Initialize cache with default TTL of 30 seconds
export const cache = new NodeCache({
  stdTTL: 30,
  checkperiod: 5,
  useClones: false
});

// Cache middleware
export const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      console.log(`✅ Cache hit for ${key}`);
      return res.json(cachedResponse);
    }

    const originalJson = res.json;
    res.json = function(body) {
      cache.set(key, body, duration);
      return originalJson.call(this, body);
    };

    next();
  };
};

// Cache durations for different endpoints
export const CACHE_DURATIONS = {
  PRICE: 10,
  MARKET: 30,
  STATIC: 300
};
