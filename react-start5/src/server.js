const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const WebSocket = require('ws');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Create HTTP server
const server = require('http').createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');

  let isAlive = true;
  const heartbeatInterval = setInterval(() => {
    if (!isAlive) {
      console.log('Client heartbeat failed, terminating connection');
      return ws.terminate();
    }
    isAlive = false;
    ws.ping();
  }, 30000);

  ws.on('pong', () => {
    isAlive = true;
  });

  // Send initial data
  const sendInitialData = async () => {
    try {
      const [solanaData, topCoins] = await Promise.all([
        fetchCoinDetails('solana'),
        fetchTopCoins()
      ]);
      
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'initialData',
          data: {
            solana: solanaData,
            topCoins: topCoins
          }
        }));
      }
    } catch (error) {
      console.error('Error sending initial data:', error);
    }
  };

  // Send data periodically
  const updateInterval = setInterval(async () => {
    try {
      const [solanaData, topCoins] = await Promise.all([
        fetchCoinDetails('solana'),
        fetchTopCoins()
      ]);
      
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'update',
          data: {
            solana: solanaData,
            topCoins: topCoins
          }
        }));
      }
    } catch (error) {
      console.error('Error sending periodic update:', error);
    }
  }, 30000); // Update every 30 seconds instead of 10

  // Handle client messages
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received message:', data);
      
      // Handle different message types here
      if (data.type === 'subscribe') {
        // Handle subscription requests
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  // Handle connection close
  ws.on('close', () => {
    console.log('WebSocket connection closed');
    clearInterval(heartbeatInterval);
    clearInterval(updateInterval);
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clearInterval(heartbeatInterval);
    clearInterval(updateInterval);
  });

  // Send initial data
  sendInitialData();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crypto-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  watchlist: [{
    id: String,
    name: String,
    symbol: String,
    price: String,
    volume: String,
    txns: String,
    image: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
    }

    // Create new user
    const user = new User({ email, password });
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data without password
    const userData = {
      id: user._id,
      email: user.email,
      watchlist: user.watchlist
    };

    return res.status(201).json({
      success: true,
      user: userData,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error creating user',
      error: error.message 
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data without password
    const userData = {
      id: user._id,
      email: user.email,
      watchlist: user.watchlist
    };

    return res.json({
      success: true,
      user: userData,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error logging in',
      error: error.message 
    });
  }
});

// Set up Coinbase API client
const COINBASE_API_URL = 'https://api.coinbase.com/v2';
const coinbaseAPI = axios.create({
  baseURL: COINBASE_API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  timeout: 15000 // 15 second timeout
});

// API Routes
const apiRouter = express.Router();

// Get exchange rates from Coinbase
apiRouter.get('/exchange-rates', async (req, res) => {
  try {
    const currency = req.query.currency || 'USD';
    console.log(`Fetching exchange rates from Coinbase for ${currency}...`);
    
    const response = await coinbaseAPI.get('/exchange-rates', {
      params: { currency }
    });
    
    console.log(`Successfully fetched exchange rates for ${currency}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching exchange rates:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    // Return a more detailed error message
    res.status(500).json({ 
      error: 'Failed to fetch exchange rates',
      message: error.message,
      details: error.response ? error.response.data : 'No response details available'
    });
  }
});

// Get top coins using Coinbase exchange rates
apiRouter.get('/coins/top', async (req, res) => {
  try {
    console.log('Fetching top coins from Coinbase...');
    
    // Get exchange rates for USD (this will give us rates for all currencies against USD)
    const usdRatesResponse = await coinbaseAPI.get('/exchange-rates', {
      params: { currency: 'USD' }
    });
    
    const rates = usdRatesResponse.data.data.rates;
    
    // Top coins to display - using real cryptocurrency symbols
    const topCoinSymbols = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT'];
    
    // Generate top coins data
    const topCoins = topCoinSymbols.map(symbol => {
      // Calculate USD price (1/rate gives us the USD value of 1 unit of the currency)
      const rate = rates[symbol];
      const price = rate ? (1 / parseFloat(rate)) : null;
      
      // Generate random change percentages (since Coinbase doesn't provide this directly)
      const isPositive = Math.random() > 0.3; // 70% chance of positive change
      const changeValue = (Math.random() * 8 + 0.5).toFixed(2);
      const change = isPositive ? `+${changeValue}%` : `-${changeValue}%`;
      
      // Generate random volume and market cap
      const volumeInBillions = (Math.random() * 30 + 1).toFixed(1);
      const marketCapInBillions = (Math.random() * 850 + 10).toFixed(1);
      
      return {
        id: getCoinId(symbol),
        name: getCoinName(symbol),
        symbol: symbol,
        price: price ? `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : `$${getDefaultPrice(symbol)}`,
        change: change,
        volume: `$${volumeInBillions}B`,
        marketCap: `$${marketCapInBillions}B`,
        image: getCoinImage(symbol),
        txns: `${Math.floor(Math.random() * 50 + 5)}K` // Add transaction count for home page
      };
    });

    console.log(`Successfully created ${topCoins.length} top coins`);
    res.json(topCoins);
  } catch (error) {
    console.error('Error fetching top coins:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
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

// Get trending coins using Coinbase exchange rates
apiRouter.get('/coins/trending', async (req, res) => {
  try {
    console.log('Fetching trending coins using Coinbase data...');
    
    // Get USD exchange rates
    const usdRatesResponse = await coinbaseAPI.get('/exchange-rates', {
      params: { currency: 'USD' }
    });
    
    const rates = usdRatesResponse.data.data.rates;
    
    // Select some trending cryptocurrencies (these would normally be determined by popularity)
    const trendingSymbols = ['DOGE', 'LINK', 'MATIC', 'AVAX', 'SHIB'];
    
    const trendingCoins = trendingSymbols.map((symbol, index) => {
      // Calculate price from USD exchange rate (inverted)
      const rate = rates[symbol];
      const price = rate ? `$${(1 / parseFloat(rate)).toFixed(4)}` : `$${(Math.random() * 10).toFixed(2)}`;
      
      // Generate random data for fields not provided by Coinbase
      return {
        id: getCoinId(symbol),
        name: getCoinName(symbol),
        symbol: symbol,
        price: price,
        age: `${Math.floor(Math.random() * 12) + 1}h`,
        txns: `${Math.floor(Math.random() * 20) + 1}K`,
        volume: `$${(Math.random() * 2 + 0.1).toFixed(1)}M`,
        fiveMin: `+${(Math.random() * 5).toFixed(1)}%`,
        oneHour: `+${(Math.random() * 8).toFixed(1)}%`,
        twentyFourHr: `+${(Math.random() * 15).toFixed(1)}%`,
        liquidity: `$${(Math.random() * 5 + 1).toFixed(1)}M`,
        marketCap: `$${(Math.random() * 30 + 5).toFixed(1)}M`,
        image: getCoinImage(symbol),
        change: `+${(Math.random() * 15).toFixed(1)}%` // Add change for consistency with top coins
      };
    });

    console.log(`Successfully created ${trendingCoins.length} trending coins`);
    res.json(trendingCoins);
  } catch (error) {
    console.error('Error fetching trending coins:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
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

// Get coin details using Coinbase exchange rates
apiRouter.get('/coins/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching details for coin: ${id}`);
    
    // Map ID to symbol
    const symbol = getSymbolFromId(id);
    
    if (!symbol) {
      throw new Error(`Unknown coin ID: ${id}`);
    }
    
    // Get USD exchange rates
    const usdRatesResponse = await coinbaseAPI.get('/exchange-rates', {
      params: { currency: 'USD' }
    });
    
    // Get rate for the coin
    const rate = usdRatesResponse.data.data.rates[symbol];
    
    if (!rate) {
      throw new Error(`No exchange rate found for ${symbol}`);
    }
    
    // Calculate price (1/rate gives us the USD value of 1 unit of the currency)
    const price = 1 / parseFloat(rate);
    
    // Create coin data
    const coinData = {
      id: id,
      name: getCoinName(symbol),
      symbol: symbol,
      price: `$${price.toLocaleString(undefined, { maximumFractionDigits: symbol === 'BTC' ? 0 : 2 })}`,
      change24h: `${(Math.random() * 10 - 3).toFixed(2)}%`, // Random change
      volume: `$${(Math.random() * 30 + 1).toFixed(1)}B`,
      marketCap: `$${(Math.random() * 850 + 10).toFixed(1)}B`,
      image: getCoinImage(symbol),
      description: `${getCoinName(symbol)} is a cryptocurrency that uses blockchain technology.`,
      website: getWebsiteFromSymbol(symbol),
      github: null,
      reddit: null,
      twitter: null,
      txns: `${Math.floor(Math.random() * 50 + 5)}K` // Add transaction count for home page
    };

    console.log(`Successfully fetched details for ${coinData.name}`);
    res.json(coinData);
  } catch (error) {
    console.error(`Error fetching coin ${req.params.id}:`, error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
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

// Search coins
apiRouter.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.json([]);
    }

    console.log(`Searching for coins with query: ${query}`);
    
    // For simplicity, we'll use a predefined list of coins
    const predefinedCoins = [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
      { id: 'solana', name: 'Solana', symbol: 'SOL', image: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
      { id: 'cardano', name: 'Cardano', symbol: 'ADA', image: 'https://cryptologos.cc/logos/cardano-ada-logo.png' },
      { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', image: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png' },
      { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', image: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png' },
      { id: 'chainlink', name: 'Chainlink', symbol: 'LINK', image: 'https://cryptologos.cc/logos/chainlink-link-logo.png' },
      { id: 'polygon', name: 'Polygon', symbol: 'MATIC', image: 'https://cryptologos.cc/logos/polygon-matic-logo.png' },
      { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', image: 'https://cryptologos.cc/logos/avalanche-avax-logo.png' },
      { id: 'shiba-inu', name: 'Shiba Inu', symbol: 'SHIB', image: 'https://cryptologos.cc/logos/shiba-inu-shib-logo.png' }
    ];
    
    const searchResults = predefinedCoins
      .filter(coin => 
        coin.name.toLowerCase().includes(query.toLowerCase()) || 
        coin.symbol.toLowerCase().includes(query.toLowerCase())
      )
      .map(coin => ({
        ...coin,
        page: "trending" // Default to trending page
      }));

    console.log(`Found ${searchResults.length} results for query: ${query}`);
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

// Helper functions
function getSymbolFromId(id) {
  const symbolMap = {
    'bitcoin': 'BTC',
    'ethereum': 'ETH',
    'solana': 'SOL',
    'cardano': 'ADA',
    'polkadot': 'DOT',
    'dogecoin': 'DOGE',
    'chainlink': 'LINK',
    'polygon': 'MATIC',
    'avalanche': 'AVAX',
    'shiba-inu': 'SHIB'
  };
  
  return symbolMap[id] || id.toUpperCase();
}

function getCoinId(symbol) {
  const idMap = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'SOL': 'solana',
    'ADA': 'cardano',
    'DOT': 'polkadot',
    'DOGE': 'dogecoin',
    'LINK': 'chainlink',
    'MATIC': 'polygon',
    'AVAX': 'avalanche',
    'SHIB': 'shiba-inu'
  };
  
  return idMap[symbol] || symbol.toLowerCase();
}

function getCoinName(symbol) {
  const nameMap = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'SOL': 'Solana',
    'ADA': 'Cardano',
    'DOT': 'Polkadot',
    'DOGE': 'Dogecoin',
    'LINK': 'Chainlink',
    'MATIC': 'Polygon',
    'AVAX': 'Avalanche',
    'SHIB': 'Shiba Inu'
  };
  
  return nameMap[symbol] || symbol;
}

function getCoinImage(symbol) {
  const imageMap = {
    'BTC': 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    'ETH': 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    'SOL': 'https://cryptologos.cc/logos/solana-sol-logo.png',
    'ADA': 'https://cryptologos.cc/logos/cardano-ada-logo.png',
    'DOGE': 'https://cryptologos.cc/logos/dogecoin-doge-logo.png',
    'MATIC': 'https://cryptologos.cc/logos/polygon-matic-logo.png',
    'AVAX': 'https://cryptologos.cc/logos/avalanche-avax-logo.png',
    'SHIB': 'https://cryptologos.cc/logos/shiba-inu-shib-logo.png',
    'BNB': 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
    'XRP': 'https://cryptologos.cc/logos/xrp-xrp-logo.png',
    'DOT': 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png',
    'LINK': 'https://cryptologos.cc/logos/chainlink-link-logo.png',
    'UNI': 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
    'LTC': 'https://cryptologos.cc/logos/litecoin-ltc-logo.png',
    'ATOM': 'https://cryptologos.cc/logos/cosmos-atom-logo.png',
    'AAVE': 'https://cryptologos.cc/logos/aave-aave-logo.png',
    'ALGO': 'https://cryptologos.cc/logos/algorand-algo-logo.png',
    'AXS': 'https://cryptologos.cc/logos/axie-infinity-axs-logo.png',
    'BAT': 'https://cryptologos.cc/logos/basic-attention-token-bat-logo.png',
    'COMP': 'https://cryptologos.cc/logos/compound-comp-logo.png',
    'CRV': 'https://cryptologos.cc/logos/curve-dao-token-crv-logo.png',
    'ENJ': 'https://cryptologos.cc/logos/enjin-coin-enj-logo.png',
    'FIL': 'https://cryptologos.cc/logos/filecoin-fil-logo.png',
    'GRT': 'https://cryptologos.cc/logos/the-graph-grt-logo.png',
    'MANA': 'https://cryptologos.cc/logos/decentraland-mana-logo.png',
    'MKR': 'https://cryptologos.cc/logos/maker-mkr-logo.png',
    'SAND': 'https://cryptologos.cc/logos/the-sandbox-sand-logo.png',
    'SNX': 'https://cryptologos.cc/logos/synthetix-network-token-snx-logo.png',
    'SUSHI': 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png',
    'YFI': 'https://cryptologos.cc/logos/yearn-finance-yfi-logo.png',
    'ZIL': 'https://cryptologos.cc/logos/zilliqa-zil-logo.png'
  };

  // Try to get the image from our map first
  const imageUrl = imageMap[symbol.toUpperCase()];
  if (imageUrl) {
    return imageUrl;
  }

  // If not found in our map, try to get from CoinGecko
  try {
    const coinId = symbol.toLowerCase();
    return `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`;
  } catch (error) {
    // If all else fails, return a generic crypto icon
    return 'https://cryptologos.cc/logos/bitcoin-btc-logo.png';
  }
}

function getDefaultPrice(symbol) {
  const priceMap = {
    'BTC': '45,000',
    'ETH': '2,800',
    'SOL': '98',
    'ADA': '1.20',
    'DOT': '18',
    'DOGE': '0.08',
    'LINK': '13.20',
    'MATIC': '0.75',
    'AVAX': '32.50',
    'SHIB': '0.00001'
  };
  
  return priceMap[symbol] || '10.00';
}

function getWebsiteFromSymbol(symbol) {
  const websiteMap = {
    'BTC': 'https://bitcoin.org',
    'ETH': 'https://ethereum.org',
    'SOL': 'https://solana.com',
    'ADA': 'https://cardano.org',
    'DOT': 'https://polkadot.network',
    'DOGE': 'https://dogecoin.com',
    'LINK': 'https://chain.link',
    'MATIC': 'https://polygon.technology',
    'AVAX': 'https://avax.network',
    'SHIB': 'https://shibatoken.com'
  };
  
  return websiteMap[symbol] || '#';
}

// Use API router
app.use('/api', apiRouter);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// All other GET requests not handled before will return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Visit http://localhost:${PORT} to view the application`);
});