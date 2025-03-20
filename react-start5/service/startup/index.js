import server from './server.js';
import app from './api.js';

// Export both servers for PM2
export { server, app };

// Log startup
console.log('Main server and API server started');