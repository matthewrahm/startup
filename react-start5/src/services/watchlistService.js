import User from '../models/User.js';
import { s3Client, BUCKET_NAME } from '../config/s3.js';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

export const watchlistService = {
  async addToWatchlist(userId, coin) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Check if coin already exists in watchlist
      const exists = user.watchlist.some(item => item.coinId === coin.id);
      if (exists) {
        throw new Error('Coin already in watchlist');
      }

      // Add to watchlist
      user.watchlist.push({
        coinId: coin.id,
        name: coin.name,
        symbol: coin.symbol
      });

      await user.save();

      // Store additional coin data in S3
      const s3Key = `watchlist/${userId}/${coin.id}.json`;
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: JSON.stringify(coin),
        ContentType: 'application/json'
      });

      await s3Client.send(command);

      return user.watchlist;
    } catch (error) {
      throw error;
    }
  },

  async removeFromWatchlist(userId, coinId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Remove from watchlist
      user.watchlist = user.watchlist.filter(item => item.coinId !== coinId);
      await user.save();

      return user.watchlist;
    } catch (error) {
      throw error;
    }
  },

  async getWatchlist(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Get detailed coin data from S3 for each watchlist item
      const watchlistData = await Promise.all(
        user.watchlist.map(async (item) => {
          try {
            const command = new GetObjectCommand({
              Bucket: BUCKET_NAME,
              Key: `watchlist/${userId}/${item.coinId}.json`
            });
            
            const response = await s3Client.send(command);
            const coinData = JSON.parse(await response.Body.transformToString());
            
            return {
              ...item.toObject(),
              ...coinData
            };
          } catch (error) {
            console.error(`Error fetching data for coin ${item.coinId}:`, error);
            return item.toObject();
          }
        })
      );

      return watchlistData;
    } catch (error) {
      throw error;
    }
  }
};