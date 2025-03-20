import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // Load MongoDB configuration
    const dbConfig = {
      hostname: process.env.MONGODB_HOST || 'cluster0.y4vm3.mongodb.net',
      username: process.env.MONGODB_USER || 'mongo',
      password: process.env.MONGODB_PASSWORD || 'Matt1100321140!'
    };

    // Construct MongoDB URI with proper format
    const uri = `mongodb+srv://${dbConfig.username}:${encodeURIComponent(dbConfig.password)}@${dbConfig.hostname}/?retryWrites=true&w=majority`;

    // Connect with enhanced options
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4 // Force IPv4
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Set up error handlers
    conn.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });

    conn.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    conn.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    throw error;
  }
};

export default connectDB;