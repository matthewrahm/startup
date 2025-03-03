import axios from 'axios';

// Create axios instance for our backend API
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 15000, // 15 second timeout
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Create axios instance for CoinGecko API
const cryptoApiClient = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  response => response,
  async error => {
    console.error('API Error:', error.message);
    
    // Check if error is due to timeout or network issues
    if (error.code === 'ECONNABORTED' || !error.response) {
      console.error('Network error or timeout');
    }
    
    // Log detailed error information if available
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

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

// Format price based on value
const formatPrice = (price) => {
  if (typeof price !== 'number') {
    console.warn('Invalid price value:', price);
    return '0.00';
  }
  
  if (price >= 1000) {
    return price.toLocaleString(undefined, { maximumFractionDigits: 0 });
  } else if (price >= 1) {
    return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else if (price >= 0.01) {
    return price.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  } else if (price >= 0.0001) {
    return price.toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6 });
  } else {
    return price.toLocaleString(undefined, { minimumFractionDigits: 8, maximumFractionDigits: 8 });
  }
};

/**
 * Enhanced API request function without caching
 * @param {Object} client - The axios client to use
 * @param {string} method - HTTP method (get, post, etc.)
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Request parameters
 * @returns {Promise<Object>} - API response
 */
const makeRequest = async (client, method, endpoint, params = {}) => {
  try {
    // Make the actual API request
    const response = await client[method.toLowerCase()](endpoint, { params });
    return response;
  } catch (error) {
    // If we get a rate limit error, throw a more specific error
    if (error.response && error.response.status === 429) {
      throw new Error('API rate limit exceeded. Please try again later.');
    }
    throw error;
  }
};

// Fetch exchange rates from our backend or CoinGecko
export const fetchExchangeRates = async (currency = 'USD') => {
  try {
    console.log(`Fetching exchange rates for ${currency} from CoinGecko...`);
    
    // Use CoinGecko's exchange rates endpoint
    const response = await makeRequest(
      cryptoApiClient, 
      'get', 
      '/exchange_rates', 
      {}
    );
    
    // Transform the data to match our expected format
    const rates = response.data.rates;
    const formattedData = {
      data: {
        currency: currency,
        rates: {}
      }
    };
    
    // If we're looking for BTC rates, we need to calculate them differently
    if (currency === 'BTC') {
      // For each currency in the rates object, calculate its BTC value
      Object.keys(rates).forEach(key => {
        // BTC rate is 1/rate of the currency to BTC
        if (key === 'btc') {
          formattedData.data.rates[key.toUpperCase()] = '1';
        } else {
          // Calculate the rate relative to BTC
          const btcRate = rates['btc'].value;
          const currRate = rates[key].value;
          formattedData.data.rates[key.toUpperCase()] = (btcRate / currRate).toString();
        }
      });
    } else {
      // For other currencies, just use the rates directly
      Object.keys(rates).forEach(key => {
        formattedData.data.rates[key.toUpperCase()] = rates[key].value.toString();
      });
    }
    
    console.log('Exchange rates received from CoinGecko');
    return formattedData;
  } catch (error) {
    console.error('Error fetching exchange rates from CoinGecko:', error);
    
    // Return fallback data for BTC exchange rates
    if (currency === 'BTC') {
      return {
        data: {
          currency: 'BTC',
          rates: {
            USD: '0.000022',  // Approx. $45,000 per BTC
            EUR: '0.000020',  // Approx. €50,000 per BTC
            GBP: '0.000017',  // Approx. £58,000 per BTC
            JPY: '0.0033'     // Approx. ¥3,000,000 per BTC
          }
        }
      };
    }
    
    // Fallback for USD rates
    return {
      data: {
        currency: 'USD',
        rates: {
          BTC: '45000',
          ETH: '2800',
          SOL: '98',
          ADA: '1.20',
          DOT: '18',
          DOGE: '0.08',
          LINK: '13.20',
          MATIC: '0.75',
          AVAX: '32.50',
          SHIB: '0.00001'
        }
      }
    };
  }
};

// Fetch real-time Solana price from CoinGecko
export const fetchSolanaPrice = async () => {
  try {
    console.log('Fetching real-time Solana price from CoinGecko...');
    
    const response = await makeRequest(
      cryptoApiClient,
      'get',
      '/simple/price',
      {
        ids: 'solana',
        vs_currencies: 'usd',
        include_24hr_change: true
      }
    );
    
    const price = response.data.solana.usd;
    const change24h = response.data.solana.usd_24h_change;
    
    console.log('Solana price data received:', { price, change24h });
    
    return {
      price: `$${formatPrice(price)}`,
      change24h: `${change24h >= 0 ? '+' : ''}${change24h.toFixed(2)}%`,
      rawPrice: price
    };
  } catch (error) {
    console.error('Error fetching Solana price from CoinGecko:', error);
    // Return fallback data
    return {
      price: '$98.00',
      change24h: '+5.0%',
      rawPrice: 98.00
    };
  }
};

// Fetch comprehensive Solana data (price, volume, transactions)
export const fetchSolanaData = async () => {
  try {
    console.log('Fetching comprehensive Solana data...');
    
    // Get basic price data
    const priceResponse = await makeRequest(
      cryptoApiClient,
      'get',
      '/simple/price',
      {
        ids: 'solana',
        vs_currencies: 'usd',
        include_24hr_change: true,
        include_24hr_vol: true,
        include_market_cap: true
      }
    );
    
    // Get more detailed data
    const detailsResponse = await makeRequest(
      cryptoApiClient,
      'get',
      '/coins/solana',
      {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false
      }
    );
    
    const price = priceResponse.data.solana.usd;
    const change24h = priceResponse.data.solana.usd_24h_change;
    const volume = detailsResponse.data.market_data.total_volume.usd;
    
    // Generate a realistic but random transaction count based on volume
    // In reality, this would come from a blockchain explorer API
    const baseTransactions = Math.floor(volume / 10000);
    const randomFactor = 0.8 + (Math.random() * 0.4); // Random factor between 0.8 and 1.2
    const transactions = Math.floor(baseTransactions * randomFactor);
    
    console.log('Comprehensive Solana data received:', { 
      price, 
      change24h, 
      volume,
      transactions
    });
    
    return {
      price: `$${formatPrice(price)}`,
      change24h: `${change24h >= 0 ? '+' : ''}${change24h.toFixed(2)}%`,
      rawPrice: price,
      volume: `$${(volume / 1000000000).toFixed(1)}B`,
      rawVolume: volume,
      txns: `${(transactions / 1000).toFixed(1)}K`,
      rawTxns: transactions
    };
  } catch (error) {
    console.error('Error fetching comprehensive Solana data:', error);
    // Return fallback data
    return {
      price: '$98.00',
      change24h: '+5.0%',
      rawPrice: 98.00,
      volume: '$1.5B',
      rawVolume: 1500000000,
      txns: '2.3M',
      rawTxns: 2300000
    };
  }
};

// Fetch big movers (coins with significant price changes)
export const fetchBigMovers = async () => {
  try {
    console.log('Fetching big movers from CoinGecko...');
    
    const response = await makeRequest(
      cryptoApiClient,
      'get',
      '/coins/markets',
      {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100, // Get a larger sample to find big movers
        page: 1,
        sparkline: false,
        price_change_percentage: '24h'
      }
    );
    
    // Sort by absolute price change percentage to find biggest movers
    const sortedByChange = [...response.data].sort((a, b) => {
      return Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h);
    });
    
    // Take top 3 movers
    const bigMovers = sortedByChange.slice(0, 3).map(coin => {
      return {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        price: `$${formatPrice(coin.current_price)}`,
        change: `${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}%`,
        image: coin.image,
        volume: `$${(coin.total_volume / 1000000000).toFixed(1)}B`,
        txns: `${Math.floor(Math.random() * 50 + 5)}K`, // Random transaction count
        currentPrice: coin.current_price
      };
    });
    
    console.log('Big movers data received:', bigMovers.map(m => `${m.name}: ${m.change}`));
    return bigMovers;
  } catch (error) {
    console.error('Error fetching big movers from CoinGecko:', error);
    // Return fallback data
    return [
      { id: 'solana', name: 'Solana', symbol: 'SOL', price: '$98.00', change: '+15.2%', image: 'https://cryptologos.cc/logos/solana-sol-logo.png', volume: '$4B', txns: '30K' },
      { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', price: '$32.50', change: '+12.8%', image: 'https://cryptologos.cc/logos/avalanche-avax-logo.png', volume: '$1.2B', txns: '15K' },
      { id: 'polygon', name: 'Polygon', symbol: 'MATIC', price: '$0.75', change: '-8.3%', image: 'https://cryptologos.cc/logos/polygon-matic-logo.png', volume: '$0.8B', txns: '12K' }
    ];
  }
};

// Fetch top coins from CoinGecko API
export const fetchTopCoins = async () => {
  try {
    console.log('Fetching top coins from CoinGecko API...');
    
    const response = await makeRequest(
      cryptoApiClient,
      'get',
      '/coins/markets',
      {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h'
      }
    );
    
    console.log('Top coins data received from CoinGecko:', response.data.length);
    
    // Transform the data to match our application's expected format
    const formattedCoins = response.data.map(coin => {
      // Format price with appropriate decimal places based on value
      const formattedPrice = formatPrice(coin.current_price);
      
      return {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        price: `$${formattedPrice}`,
        change: `${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}%`,
        volume: `$${(coin.total_volume / 1000000000).toFixed(1)}B`,
        marketCap: `$${(coin.market_cap / 1000000000).toFixed(1)}B`,
        image: coin.image,
        txns: `${Math.floor(Math.random() * 50 + 5)}K`, // Random transaction count as API doesn't provide this
        currentPrice: coin.current_price // Add raw price for reference
      };
    });
    
    console.log('Sample formatted coin (BTC):', formattedCoins.find(coin => coin.id === 'bitcoin'));
    return formattedCoins;
  } catch (error) {
    console.error('Error fetching top coins from CoinGecko API:', error);
    // Return fallback data if API fails
    return [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: '$45,000', change: '+5.2%', volume: '$28B', marketCap: '$850B', image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', txns: '25K', currentPrice: 45000 },
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: '$2,800', change: '+3.8%', volume: '$15B', marketCap: '$330B', image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', txns: '18K', currentPrice: 2800 },
      { id: 'ripple', name: 'XRP', symbol: 'XRP', price: '$0.50', change: '+2.1%', volume: '$3B', marketCap: '$25B', image: 'https://cryptologos.cc/logos/xrp-xrp-logo.png', txns: '15K', currentPrice: 0.50 },
      { id: 'solana', name: 'Solana', symbol: 'SOL', price: '$98', change: '+7.5%', volume: '$4B', marketCap: '$38B', image: 'https://cryptologos.cc/logos/solana-sol-logo.png', txns: '30K', currentPrice: 98 },
      { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: '$1.20', change: '+2.9%', volume: '$2B', marketCap: '$40B', image: 'https://cryptologos.cc/logos/cardano-ada-logo.png', txns: '12K', currentPrice: 1.20 }
    ];
  }
};

// Fetch trending coins from CoinGecko API
export const fetchTrendingCoins = async () => {
  try {
    console.log('Fetching trending coins from CoinGecko API...');
    
    const response = await makeRequest(
      cryptoApiClient,
      'get',
      '/search/trending',
      {}
    );
    
    console.log('Trending coins data received from CoinGecko:', response.data.coins.length);
    
    // Get detailed information for each trending coin
    const trendingIds = response.data.coins.map(coin => coin.item.id).join(',');
    
    const detailedResponse = await makeRequest(
      cryptoApiClient,
      'get',
      '/coins/markets',
      {
        vs_currency: 'usd',
        ids: trendingIds,
        order: 'market_cap_desc',
        per_page: 10,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h'
      }
    );
    
    console.log('Detailed trending coin data received:', detailedResponse.data.length);
    
    // Transform the data to match our application's expected format
    const formattedCoins = detailedResponse.data.map(coin => {
      // Generate random data for fields not provided by the API
      const randomHours = Math.floor(Math.random() * 12) + 1;
      const randomTxns = Math.floor(Math.random() * 20) + 1;
      const randomFiveMin = (Math.random() * 5).toFixed(1);
      const randomOneHour = (Math.random() * 8).toFixed(1);
      const randomLiquidity = (Math.random() * 5 + 1).toFixed(1);
      
      // Format price with appropriate decimal places based on value
      const formattedPrice = formatPrice(coin.current_price);
      
      return {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        price: `$${formattedPrice}`,
        age: `${randomHours}h`,
        txns: `${randomTxns}K`,
        volume: `$${(coin.total_volume / 1000000).toFixed(1)}M`,
        fiveMin: `+${randomFiveMin}%`,
        oneHour: `+${randomOneHour}%`,
        twentyFourHr: `${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(1)}%`,
        liquidity: `$${randomLiquidity}M`,
        marketCap: `$${(coin.market_cap / 1000000).toFixed(1)}M`,
        image: coin.image,
        change: `${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(1)}%`,
        currentPrice: coin.current_price // Add raw price for reference
      };
    });
    
    return formattedCoins;
  } catch (error) {
    console.error('Error fetching trending coins from CoinGecko API:', error);
    // Return fallback data if API fails
    return [
      { id: 'dogecoin', name: "Dogecoin", symbol: "DOGE", price: "$0.08", age: "2h", txns: "5K", volume: "$500K", fiveMin: "+2.5%", oneHour: "+5%", twentyFourHr: "+10%", liquidity: "$2M", marketCap: "$10M", image: "https://cryptologos.cc/logos/dogecoin-doge-logo.png", change: "+10%", currentPrice: 0.08 },
      { id: 'chainlink', name: "Chainlink", symbol: "LINK", price: "$13.20", age: "4h", txns: "8K", volume: "$800K", fiveMin: "+1.8%", oneHour: "+3%", twentyFourHr: "+8%", liquidity: "$3M", marketCap: "$15M", image: "https://cryptologos.cc/logos/chainlink-link-logo.png", change: "+8%", currentPrice: 13.20 },
      { id: 'polygon', name: "Polygon", symbol: "MATIC", price: "$0.75", age: "1h", txns: "3K", volume: "$300K", fiveMin: "+3.2%", oneHour: "+6%", twentyFourHr: "+12%", liquidity: "$1.5M", marketCap: "$8M", image: "https://cryptologos.cc/logos/polygon-matic-logo.png", change: "+12%", currentPrice: 0.75 },
      { id: 'avalanche', name: "Avalanche", symbol: "AVAX", price: "$32.50", age: "3h", txns: "10K", volume: "$1M", fiveMin: "+1.5%", oneHour: "+4%", twentyFourHr: "+15%", liquidity: "$5M", marketCap: "$25M", image: "https://cryptologos.cc/logos/avalanche-avax-logo.png", change: "+15%", currentPrice: 32.50 },
      { id: 'shiba-inu', name: "Shiba Inu", symbol: "SHIB", price: "$0.00001", age: "5h", txns: "6K", volume: "$600K", fiveMin: "+2.0%", oneHour: "+4.5%", twentyFourHr: "+9%", liquidity: "$2.5M", marketCap: "$12M", image: "https://cryptologos.cc/logos/shiba-inu-shib-logo.png", change: "+9%", currentPrice: 0.00001 }
    ];
  }
};

// Fetch coin details from CoinGecko API
export const fetchCoinDetails = async (coinId) => {
  try {
    console.log(`Fetching details for coin: ${coinId} from CoinGecko API`);
    
    // Get coin details with market data
    const detailsResponse = await makeRequest(
      cryptoApiClient,
      'get',
      `/coins/${coinId}`,
      {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false
      }
    );
    
    const coin = detailsResponse.data;
    const marketData = coin.market_data;
    
    console.log(`Raw ${coinId} price data:`, marketData.current_price.usd);
    
    // Calculate 24h volume
    const volumeInBillions = (marketData.total_volume.usd / 1000000000).toFixed(1);
    
    // Format price with appropriate decimal places based on value
    const formattedPrice = formatPrice(marketData.current_price.usd);
    
    // Format the coin data
    const coinData = {
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: `$${formattedPrice}`,
      change24h: `${marketData.price_change_percentage_24h >= 0 ? '+' : ''}${marketData.price_change_percentage_24h.toFixed(2)}%`,
      volume: `$${volumeInBillions}B`,
      marketCap: `$${(marketData.market_cap.usd / 1000000000).toFixed(1)}B`,
      image: coin.image.large,
      description: coin.description.en ? (coin.description.en.split('. ')[0] + '.') : `${coin.name} is a cryptocurrency.`,
      website: coin.links.homepage[0] || '#',
      github: coin.links.repos_url.github[0] || null,
      reddit: coin.links.subreddit_url || null,
      twitter: coin.links.twitter_screen_name ? `https://twitter.com/${coin.links.twitter_screen_name}` : null,
      txns: `${Math.floor(Math.random() * 5000) + 100}K`, // Random transaction count as API doesn't provide this
      currentPrice: marketData.current_price.usd // Add raw price for chart
    };

    console.log(`Successfully fetched details for ${coinData.name} from CoinGecko API`);
    console.log(`Formatted price: ${coinData.price}, Raw price: ${coinData.currentPrice}`);
    return coinData;
  } catch (error) {
    console.error(`Error fetching coin ${coinId} from CoinGecko API:`, error);
    
    // Return fallback data if API fails
    const fallbackData = {
      'solana': {
        id: 'solana',
        name: 'Solana',
        symbol: 'SOL',
        price: "$98.00",
        change24h: "+5.0%",
        volume: "$1.5B",
        marketCap: "$38B",
        image: "https://cryptologos.cc/logos/solana-sol-logo.png",
        txns: "2.3M",
        currentPrice: 98.00, 
        description: "Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale.",
        website: "https://solana.com"
      },
      'bitcoin': {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        price: "$45,000.00",
        change24h: "+2.5%",
        volume: "$28B",
        marketCap: "$850B",
        image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
        txns: "500K",
        currentPrice: 45000.00,
        description: "Bitcoin is the first successful internet money based on peer-to-peer technology.",
        website: "https://bitcoin.org"
      },
      'ethereum': {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        price: "$2,800.00",
        change24h: "+3.8%",
        volume: "$15B",
        marketCap: "$330B",
        image: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
        txns: "800K",
        currentPrice: 2800.00,
        description: "Ethereum is a decentralized platform that runs smart contracts.",
        website: "https://ethereum.org"
      },
      'ripple': {
        id: 'ripple',
        name: 'XRP',
        symbol: 'XRP',
        price: "$0.50",
        change24h: "+2.1%",
        volume: "$3B",
        marketCap: "$25B",
        image: "https://cryptologos.cc/logos/xrp-xrp-logo.png",
        txns: "300K",
        currentPrice: 0.50,
        description: "XRP is the native cryptocurrency of the XRP Ledger, which facilitates fast, low-cost transactions.",
        website: "https://ripple.com"
      }
    };
    
    // If we have fallback data for this coin, use it
    if (fallbackData[coinId]) {
      console.log(`Using fallback data for ${coinId}`);
      return fallbackData[coinId];
    }
    
    // Otherwise, generate generic fallback data
    console.log(`Generating generic fallback data for ${coinId}`);
    return {
      id: coinId,
      name: coinId.charAt(0).toUpperCase() + coinId.slice(1).replace(/-/g, ' '),
      symbol: coinId.substring(0, 3).toUpperCase(),
      price: "$100.00",
      change24h: "+5.0%",
      volume: "$1.5B",
      marketCap: "$10B",
      image: "/solana.png",
      txns: "15K",
      currentPrice: 100.00,
      description: `${coinId.charAt(0).toUpperCase() + coinId.slice(1).replace(/-/g, ' ')} is a cryptocurrency that uses blockchain technology.`,
      website: "#"
    };
  }
};

// Fetch market chart data for a coin
export const fetchCoinMarketChart = async (coinId, days = 7) => {
  try {
    console.log(`Fetching market chart data for ${coinId} over ${days} days from CoinGecko API`);
    
    const response = await makeRequest(
      cryptoApiClient,
      'get',
      `/coins/${coinId}/market_chart`,
      {
        vs_currency: 'usd',
        days: days,
        interval: days > 30 ? 'daily' : undefined
      }
    );
    
    console.log(`Market chart data received for ${coinId}:`, response.data.prices.length, 'data points');
    
    // Format the data for Chart.js
    const chartData = {
      labels: response.data.prices.map(price => new Date(price[0])),
      prices: response.data.prices.map(price => price[1]),
      volumes: response.data.total_volumes.map(volume => volume[1])
    };
    
    return chartData;
  } catch (error) {
    console.error(`Error fetching market chart data for ${coinId}:`, error);
    
    // Generate fallback data
    const fallbackData = {
      labels: [],
      prices: [],
      volumes: []
    };
    
    // Generate data for the specified number of days
    const now = new Date();
    let basePrice = 0;
    
    // Set base price based on coin
    switch (coinId) {
      case 'bitcoin':
        basePrice = 45000;
        break;
      case 'ethereum':
        basePrice = 2800;
        break;
      case 'solana':
        basePrice = 98;
        break;
      case 'ripple':
        basePrice = 0.5;
        break;
      default:
        basePrice = 100;
    }
    
    // Generate random price data
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Random price fluctuation (±5%)
      const randomFactor = 0.9 + (Math.random() * 0.2);
      const price = basePrice * randomFactor;
      
      // Random volume
      const volume = basePrice * 1000000 * (0.5 + Math.random());
      
      fallbackData.labels.push(date);
      fallbackData.prices.push(price);
      fallbackData.volumes.push(volume);
      
      // Update base price for next iteration (slight drift)
      basePrice = price;
    }
    
    return fallbackData;
  }
};

// Search coins using CoinGecko API
export const searchCoins = async (query) => {
  try {
    console.log(`Searching for coins with query: ${query} using CoinGecko API`);
    
    const response = await makeRequest(
      cryptoApiClient,
      'get',
      '/search',
      { query }
    );
    
    // Filter and format the results
    const coins = response.data.coins.slice(0, 10).map(coin => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      image: coin.large || coin.thumb
    }));
    
    console.log(`Search results for "${query}" from CoinGecko API:`, coins.length);
    return coins;
  } catch (error) {
    console.error('Error searching coins with CoinGecko API:', error);
    // Return fallback search results
    return [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
      { id: 'solana', name: 'Solana', symbol: 'SOL', image: 'https://cryptologos.cc/logos/solana-sol-logo.png' }
    ].filter(coin => 
      coin.name.toLowerCase().includes(query.toLowerCase()) || 
      coin.symbol.toLowerCase().includes(query.toLowerCase())
    );
  }
};