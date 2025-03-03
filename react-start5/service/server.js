const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Import API functions
const api = require('./api');

// Middleware
app.use(cors());
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
    }
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

// API Routes
const apiRouter = express.Router();

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get exchange rates
apiRouter.get('/exchange-rates', async (req, res) => {
  try {
    const currency = req.query.currency || 'USD';
    console.log(`Fetching exchange rates for ${currency} from CoinGecko...`);
    
    const exchangeRates = await api.fetchExchangeRates(currency);
    res.json(exchangeRates);
  } catch (error) {
    console.error('Error fetching exchange rates:', error.message);
    
    // Return a more detailed error message
    res.status(500).json({ 
      error: 'Failed to fetch exchange rates',
      message: error.message,
      details: error.response ? error.response.data : 'No response details available'
    });
  }
});

// Get top coins
apiRouter.get('/coins/top', async (req, res) => {
  try {
    console.log('Fetching top coins from CoinGecko...');
    
    const topCoins = await api.fetchTopCoins();
    res.json(topCoins);
  } catch (error) {
    console.error('Error fetching top coins:', error.message);
    
    // Return fallback data on error
    const fallbackCoins = [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: '$45,000', change: '+5.2%', volume: '$28B', marketCap: '$850B', image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', txns: '25K' },
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: '$2,800', change: '+3.8%', volume: '$15B', marketCap: '$330B', image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', txns: '18K' },
      { id: 'solana', name: 'Solana', symbol: 'SOL', price: '$98', change: '+7.5%', volume: '$4B', marketCap: '$38B', image: 'https://cryptologos.cc/logos/solana-sol-logo.png', txns: '30K' },
      { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: '$1.20', change: '+2.9%', volume: '$2B', marketCap: '$40B', image: 'https://cryptologos.cc/logos/cardano-ada-logo.png', txns: '12K' },
      { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', price: '$18', change: '+4.1%', volume: '$1.5B', marketCap: '$18B', image: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png', txns: '8K' }
    ];
    console.log('Returning fallback top coins data');
    res.json(fallbackCoins);
  }
});

// Get trending coins
apiRouter.get('/coins/trending', async (req, res) => {
  try {
    console.log('Fetching trending coins from CoinGecko...');
    
    const trendingCoins = await api.fetchTrendingCoins();
    res.json(trendingCoins);
  } catch (error) {
    console.error('Error fetching trending coins:', error.message);
    
    // Return fallback data on error
    const fallbackTrending = [
      { id: 'dogecoin', name: "Dogecoin", symbol: "DOGE", price: "$0.08", age: "2h", txns: "5K", volume: "$500K", fiveMin: "+2.5%", oneHour: "+5%", twentyFourHr: "+10%", liquidity: "$2M", marketCap: "$10M", image: "https://cryptologos.cc/logos/dogecoin-doge-logo.png", change: "+10%" },
      { id: 'chainlink', name: "Chainlink", symbol: "LINK", price: "$13.20", age: "4h", txns: "8K", volume: "$800K", fiveMin: "+1.8%", oneHour: "+3%", twentyFourHr: "+8%", liquidity: "$3M", marketCap: "$15M", image: "https://cryptologos.cc/logos/chainlink-link-logo.png", change: "+8%" },
      { id: 'polygon', name: "Polygon", symbol: "MATIC", price: "$0.75", age: "1h", txns: "3K", volume: "$300K", fiveMin: "+3.2%", oneHour: "+6%", twentyFourHr: "+12%", liquidity: "$1.5M", marketCap: "$8M", image: "https://cryptologos.cc/logos/polygon-matic-logo.png", change: "+12%" },
      { id: 'avalanche', name: "Avalanche", symbol: "AVAX", price: "$32.50", age: "3h", txns: "10K", volume: "$1M", fiveMin: "+1.5%", oneHour: "+4%", twentyFourHr: "+15%", liquidity: "$5M", marketCap: "$25M", image: "https://cryptologos.cc/logos/avalanche-avax-logo.png", change: "+15%" },
      { id: 'shiba-inu', name: "Shiba Inu", symbol: "SHIB", price: "$0.00001", age: "5h", txns: "6K", volume: "$600K", fiveMin: "+2.0%", oneHour: "+4.5%", twentyFourHr: "+9%", liquidity: "$2.5M", marketCap: "$12M", image: "https://cryptologos.cc/logos/shiba-inu-shib-logo.png", change: "+9%" }
    ];
    console.log('Returning fallback trending coins data');
    res.json(fallbackTrending);
  }
});

// Get coin details
apiRouter.get('/coins/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching details for coin: ${id}`);
    
    const coinData = await api.fetchCoinDetails(id);
    res.json(coinData);
  } catch (error) {
    console.error(`Error fetching coin ${req.params.id}:`, error.message);
    
    // Return fallback data on error
    const fallbackCoin = {
      id: req.params.id,
      name: req.params.id.charAt(0).toUpperCase() + req.params.id.slice(1),
      symbol: req.params.id.substring(0, 3).toUpperCase(),
      price: "$100.00",
      change24h: "+5.0%",
      volume: "$1.5B",
      marketCap: "$10B",
      image: "/solana.png",
      txns: "15K"
    };
    console.log(`Returning fallback data for ${req.params.id}`);
    res.json(fallbackCoin);
  }
});

// Get market chart data
apiRouter.get('/coins/:id/market_chart', async (req, res) => {
  try {
    const { id } = req.params;
    const days = parseInt(req.query.days || '7', 10);
    
    console.log(`Fetching market chart data for ${id} over ${days} days`);
    
    const chartData = await api.fetchCoinMarketChart(id, days);
    res.json(chartData);
  } catch (error) {
    console.error(`Error fetching market chart for ${req.params.id}:`, error.message);
    
    // Return fallback data
    const fallbackData = {
      labels: [],
      prices: [],
      volumes: []
    };
    
    // Generate some random data points
    const now = new Date();
    const days = parseInt(req.query.days || '7', 10);
    let basePrice = 100; // Default price
    
    // Adjust base price based on coin
    if (req.params.id === 'bitcoin') basePrice = 45000;
    else if (req.params.id === 'ethereum') basePrice = 2800;
    else if (req.params.id === 'solana') basePrice = 98;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Random price fluctuation (±5%)
      const randomFactor = 0.95 + (Math.random() * 0.1);
      const price = basePrice * randomFactor;
      
      // Random volume
      const volume = basePrice * 1000000 * (0.5 + Math.random());
      
      fallbackData.labels.push(date);
      fallbackData.prices.push(price);
      fallbackData.volumes.push(volume);
      
      // Update base price for next iteration (slight drift)
      basePrice = price;
    }
    
    res.json(fallbackData);
  }
});

// Search coins
apiRouter.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.json([]);
    }

    console.log(`Searching for coins with query: ${query}`);
    
    const searchResults = await api.searchCoins(query);
    res.json(searchResults);
  } catch (error) {
    console.error('Error searching coins:', error.message);
    
    // Fallback search results
    const fallbackResults = [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', page: 'trending' },
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', page: 'trending' },
      { id: 'solana', name: 'Solana', symbol: 'SOL', image: 'https://cryptologos.cc/logos/solana-sol-logo.png', page: 'trending' }
    ].filter(coin => 
      coin.name.toLowerCase().includes(req.query.query.toLowerCase()) || 
      coin.symbol.toLowerCase().includes(req.query.query.toLowerCase())
    );
    
    res.json(fallbackResults);
  }
});

// Solana price endpoint
apiRouter.get('/solana/price', async (req, res) => {
  try {
    console.log('Fetching Solana price data...');
    
    const solanaData = await api.fetchSolanaPrice();
    res.json(solanaData);
  } catch (error) {
    console.error('Error fetching Solana price:', error.message);
    
    // Return fallback data
    res.json({
      price: '$98.00',
      change24h: '+5.0%',
      rawPrice: 98.00
    });
  }
});

// Solana data endpoint
apiRouter.get('/solana/data', async (req, res) => {
  try {
    console.log('Fetching comprehensive Solana data...');
    
    const solanaData = await api.fetchSolanaData();
    res.json(solanaData);
  } catch (error) {
    console.error('Error fetching Solana data:', error.message);
    
    // Return fallback data
    res.json({
      price: '$98.00',
      change24h: '+5.0%',
      rawPrice: 98.00,
      volume: '$1.5B',
      rawVolume: 1500000000,
      txns: '2.3M',
      rawTxns: 2300000
    });
  }
});

// Big movers endpoint
apiRouter.get('/big-movers', async (req, res) => {
  try {
    console.log('Fetching big movers...');
    
    const bigMovers = await api.fetchBigMovers();
    res.json(bigMovers);
  } catch (error) {
    console.error('Error fetching big movers:', error.message);
    
    // Return fallback data
    res.json([
      { id: 'solana', name: 'Solana', symbol: 'SOL', price: '$98.00', change: '+15.2%', image: 'https://cryptologos.cc/logos/solana-sol-logo.png', volume: '$4B', txns: '30K' },
      { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', price: '$32.50', change: '+12.8%', image: 'https://cryptologos.cc/logos/avalanche-avax-logo.png', volume: '$1.2B', txns: '15K' },
      { id: 'polygon', name: 'Polygon', symbol: 'MATIC', price: '$0.75', change: '-8.3%', image: 'https://cryptologos.cc/logos/polygon-matic-logo.png', volume: '$0.8B', txns: '12K' }
    ]);
  }
});

// New endpoint: Get a random quote
apiRouter.get('/quote', async (req, res) => {
  try {
    console.log('Fetching random quote...');
    
    const quote = await api.fetchRandomQuote();
    res.json(quote);
  } catch (error) {
    console.error('Error fetching random quote:', error.message);
    
    // Return fallback quote
    res.json({
      content: "The future of money is digital currency.",
      author: "Bill Gates"
    });
  }
});

// Use API router
app.use('/api', apiRouter);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'public')));

// All other GET requests not handled before will return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Visit http://localhost:${PORT} to view the application`);
});

// Export server for testing or programmatic use
module.exports = server;