const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('[DB] MONGODB_URI is not defined in .env');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10s to find a server
      socketTimeoutMS: 45000,          // 45s for operations
    });

    isConnected = true;
    console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      console.warn('[DB] MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      isConnected = true;
      console.log('[DB] MongoDB reconnected.');
    });

    mongoose.connection.on('error', (err) => {
      isConnected = false;
      console.error(`[DB] MongoDB connection error: ${err.message}`);
    });

  } catch (error) {
    console.error(`[DB] Connection Failed: ${error.message}`);
    console.error('[DB] Make sure MongoDB is running and MONGODB_URI in .env is correct.');
    process.exit(1); // Hard exit — do not run in mock mode
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
