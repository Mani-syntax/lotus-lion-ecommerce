const { getRedisClient, getIsRedisConnected } = require('../config/redis');
const logger = require('../utils/logger');

const DEFAULT_TTL = 300; // 5 minutes

/**
 * Get a cached value. Returns null if not cached or Redis unavailable.
 */
const get = async (key) => {
  if (!getIsRedisConnected()) return null;
  try {
    const client = getRedisClient();
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    logger.warn(`[Cache] GET error for key "${key}": ${err.message}`);
    return null;
  }
};

/**
 * Set a cached value with optional TTL (seconds).
 */
const set = async (key, value, ttl = DEFAULT_TTL) => {
  if (!getIsRedisConnected()) return;
  try {
    const client = getRedisClient();
    await client.setex(key, ttl, JSON.stringify(value));
  } catch (err) {
    logger.warn(`[Cache] SET error for key "${key}": ${err.message}`);
  }
};

/**
 * Delete a specific cache key.
 */
const del = async (key) => {
  if (!getIsRedisConnected()) return;
  try {
    const client = getRedisClient();
    await client.del(key);
  } catch (err) {
    logger.warn(`[Cache] DEL error for key "${key}": ${err.message}`);
  }
};

/**
 * Delete all keys matching a pattern (e.g. 'products:*').
 */
const flush = async (pattern) => {
  if (!getIsRedisConnected()) return;
  try {
    const client = getRedisClient();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
      logger.info(`[Cache] Flushed ${keys.length} key(s) matching "${pattern}"`);
    }
  } catch (err) {
    logger.warn(`[Cache] FLUSH error for pattern "${pattern}": ${err.message}`);
  }
};

/**
 * Cache-aside helper: get from cache, or fetch from DB and cache result.
 */
const remember = async (key, fetcher, ttl = DEFAULT_TTL) => {
  const cached = await get(key);
  if (cached !== null) return cached;

  const fresh = await fetcher();
  await set(key, fresh, ttl);
  return fresh;
};

module.exports = { get, set, del, flush, remember };
