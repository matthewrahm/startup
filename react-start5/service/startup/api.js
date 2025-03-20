import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import { fetchCoinDetails, fetchTopCoins, fetchTrendingCoins } from '../../src/services/api.js';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 4001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
const apiRouter = express.Router();

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Coin endpoints
apiRouter.get('/coins/top', async (req, res) => {
  try {
    const coins = await fetchTopCoins();
    res.json(coins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.get('/coins/trending', async (req, res) => {
  try {
    const coins = await fetchTrendingCoins();
    res.json(coins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.get('/coins/:id', async (req, res) => {
  try {
    const coin = await fetchCoinDetails(req.params.id);
    res.json(coin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Use API router
app.use('/api', apiRouter);

// Start server
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

export default app;