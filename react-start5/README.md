## 🚀 WebSocket deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Backend listens for WebSocket connection** - Implemented WebSocket server in `server.js` using the `ws` package. The server fetches real-time cryptocurrency data from CoinGecko API and broadcasts updates to connected clients. Added connection handling with a 30-second heartbeat interval to maintain stable connections.

- [x] **Frontend makes WebSocket connection** - Created WebSocket service in `src/services/websocketService.js` that establishes and maintains connections to the crypto data server. The service handles automatic reconnection and provides real-time updates for Solana price data and top cryptocurrencies.

- [x] **Data sent over WebSocket connection** - Implemented real-time transmission of cryptocurrency market data, including Solana's current price, market cap, 24h volume, and price changes. The server sends initial data on connection and updates every 30 seconds to keep the information current.

- [x] **WebSocket data displayed** - Updated the Home component to display real-time cryptocurrency data. The UI shows live price updates, market statistics, and top coins list. Implemented smooth loading states and fallback to REST API when WebSocket connection is unavailable.

- [x] **Application is fully functional** - The crypto application successfully maintains WebSocket connections for real-time price updates. Users can see live cryptocurrency data without manual refreshing, with proper error handling and automatic reconnection if the connection is lost.
