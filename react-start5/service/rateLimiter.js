const rateLimit = require('express-rate-limit');

// Create rate limiters with different configurations
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: 'Too many requests', message },
    standardHeaders: true,
    legacyHeaders: false
  });
};

// Rate limiters for different endpoints
const rateLimiters = {
  // General API rate limiter
  api: createRateLimiter(
    60 * 1000, // 1 minute
    60,        // 60 requests per minute
    'Too many requests, please try again in a minute'
  ),

  // Stricter rate limiter for price updates
  price: createRateLimiter(
    30 * 1000, // 30 seconds
    20,        // 20 requests per 30 seconds
    'Too many price requests, please wait'
  ),

  // More lenient rate limiter for static data
  static: createRateLimiter(
    60 * 1000, // 1 minute
    120,       // 120 requests per minute
    'Too many requests for static data'
  )
};

module.exports = rateLimiters;