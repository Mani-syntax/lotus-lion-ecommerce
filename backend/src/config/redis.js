const Redis = require('ioredis');
const logger = require('../utils/logger');

let client = null;
let isRedisConnected = false;

const connectRedis = () => {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

    client = new Redis(redisUrl, {
      lazyConnect: true,
      connectTimeout: 5000,
      maxRetriesPerRequest: 1,
      retryStrategy: (times) => {
        if (times > 2) return null; // stop retrying after 2 attempts
        return Math.min(times * 200, 1000);
      },
    });

    client.on('connect', () => {
      isRedisConnected = true;
      logger.info('[Redis] Connected successfully');
    });

    client.on('error', (err) => {
      if (isRedisConnected) {
        logger.warn(`[Redis] Connection lost: ${err.message}. Running without cache.`);
      }
      isRedisConnected = false;
    });

    client.on('close', () => {
      isRedisConnected = false;
    });

    client.connect().catch(() => {
      logger.warn('[Redis] Could not connect. Running without cache (graceful fallback).');
      isRedisConnected = false;
    });
  } catch (err) {
    logger.warn(`[Redis] Setup failed: ${err.message}. Running without cache.`);
    isRedisConnected = false;
  }
};

const getRedisClient = () => client;
const getIsRedisConnected = () => isRedisConnected;

module.exports = { connectRedis, getRedisClient, getIsRedisConnected };
