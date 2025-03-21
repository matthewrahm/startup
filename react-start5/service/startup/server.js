import express from 'express';
import cors from 'cors';
import path from 'path';
import { Server } from 'socket.io';
import http from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import connectDB from '../../src/config/db.js';
import { auth } from '../../src/middleware/auth.js';
import { authService } from '../../src/services/authService.js';
import { watchlistService } from '../../src/services/watchlistService.js';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:4000', 'https://startup.ramencrypto.click'],
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB().catch(console.error);

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

// API Routes
const apiRouter = express.Router();

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes
apiRouter.post('/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.register(email, password);
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

apiRouter.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Watchlist routes (protected by auth middleware)
apiRouter.get('/watchlist', auth, async (req, res) => {
  try {
    const watchlist = await watchlistService.getWatchlist(req.user._id);
    res.json(watchlist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

apiRouter.post('/watchlist/add', auth, async (req, res) => {
  try {
    const watchlist = await watchlistService.addToWatchlist(req.user._id, req.body.coin);
    res.json(watchlist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

apiRouter.delete('/watchlist/:coinId', auth, async (req, res) => {
  try {
    const watchlist = await watchlistService.removeFromWatchlist(req.user._id, req.params.coinId);
    res.json(watchlist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Use API router
app.use('/api', apiRouter);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', '..', 'build', 'public')));

// All other GET requests not handled before will return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'build', 'public', 'index.html'));
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`WebSocket server available at ws://localhost:${PORT}`);
});

export default server;