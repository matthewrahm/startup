import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const watchlistItemSchema = new mongoose.Schema({
  coinId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  watchlist: [watchlistItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
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

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Add watchlist methods
userSchema.methods.addToWatchlist = async function(coin) {
  if (this.watchlist.some(item => item.coinId === coin.id)) {
    throw new Error('Coin already in watchlist');
  }
  
  this.watchlist.push({
    coinId: coin.id,
    name: coin.name,
    symbol: coin.symbol
  });
  
  return this.save();
};

userSchema.methods.removeFromWatchlist = async function(coinId) {
  this.watchlist = this.watchlist.filter(item => item.coinId !== coinId);
  return this.save();
};

const User = mongoose.model('User', userSchema);

export default User;