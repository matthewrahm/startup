class WebSocketService {
  constructor() {
    this.socket = null;
    this.subscribers = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000; // 3 seconds
    this.isConnected = false;
    this.connectionPromise = null;
    this.reconnectTimeout = null;
  }

  connect() {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.isConnected = true;
        resolve();
        return;
      }

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}`;
      
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        resolve();
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.notifySubscribers(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        this.handleReconnect();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnected = false;
        reject(error);
      };
    });

    return this.connectionPromise;
  }

  handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      this.connectionPromise = null;
      return;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      this.connectionPromise = null;
      this.connect().catch(error => {
        console.error('Reconnection failed:', error);
      });
    }, this.reconnectDelay);
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    if (this.socket) {
      this.socket.close();
    }
    this.isConnected = false;
    this.connectionPromise = null;
  }

  subscribe(eventType, callback) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    this.subscribers.get(eventType).add(callback);
  }

  unsubscribe(eventType, callback) {
    if (this.subscribers.has(eventType)) {
      this.subscribers.get(eventType).delete(callback);
    }
  }

  notifySubscribers(data) {
    if (!data || !data.type) return;
    
    const callbacks = this.subscribers.get(data.type);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data.data);
        } catch (error) {
          console.error('Error in subscriber callback:', error);
        }
      });
    }
  }

  getConnectionState() {
    return this.isConnected;
  }
}

// Export a singleton instance
export const websocketService = new WebSocketService(); 