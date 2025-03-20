const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const axios = require('axios');
const { Server } = require('socket.io');
const http = require('http');
const { cache, cacheMiddleware, CACHE_DURATIONS } = require('./cache');
const rateLimiters = require('./rateLimiter');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:4000', 'https://startup.ramencrypto.click'],
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 4000;

// Import API functions
const api = require('./api');

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:4000', 'https://startup.ramencrypto.click'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 600
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// Create axios instance for CoinGecko API
const cryptoApiClient = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for CoinGecko API
cryptoApiClient.interceptors.response.use(
  response => {
    console.log('CoinGecko API Response:', response.config.url, 'Status:', response.status);
    return response;
  },
  async error => {
    console.error('CoinGecko API Error:', error.message);
    
    if (error.response && error.response.status === 429) {
      console.error('Rate limit exceeded for CoinGecko API');
      // Use cached data if available
      const cachedData = cache.get(error.config.url);
      if (cachedData) {
        console.log('Returning cached data due to rate limit');
        return { data: cachedData };
      }
    }
    
    return Promise.reject(error);
  }
);

// API Routes
const apiRouter = express.Router();

// Apply general rate limiter to all API routes
apiRouter.use(rateLimiters.api);

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Price endpoints with stricter rate limiting and shorter cache
apiRouter.use('/price', rateLimiters.price);
apiRouter.get('/price/:coin', cacheMiddleware(CACHE_DURATIONS.PRICE), async (req, res) => {
  try {
    const data = await api.fetchCoinPrice(req.params.coin);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch price data' });
  }
});

// Market data endpoints with standard caching
apiRouter.get('/market/:coin', cacheMiddleware(CACHE_DURATIONS.MARKET), async (req, res) => {
  try {
    const data = await api.fetchMarketData(req.params.coin);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

// Static data endpoints with longer cache duration
apiRouter.use('/static', rateLimiters.static);
apiRouter.get('/static/:type', cacheMiddleware(CACHE_DURATIONS.STATIC), async (req, res) => {
  try {
    const data = await api.fetchStaticData(req.params.type);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch static data' });
  }
});

// WebSocket connection handling for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('subscribe', async (endpoint) => {
    console.log(`Client subscribed to ${endpoint}`);
    socket.join(endpoint);
    
    // Send initial data (use cache if available)
    try {
      const cachedData = cache.get(endpoint);
      if (cachedData) {
        socket.emit('data', cachedData);
      } else {
        const data = await api.fetchDataForEndpoint(endpoint);
        cache.set(endpoint, data);
        socket.emit('data', data);
      }
    } catch (error) {
      socket.emit('error', 'Failed to fetch initial data');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', 'dist')));

// All other GET requests not handled before will return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`WebSocket server available at ws://localhost:${PORT}`);
});

module.exports = server;