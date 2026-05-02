const rateLimit = require('express-rate-limit');

// Login rate limiter — 5 attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: 'Too many login attempts. Please try again in 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// Admin API rate limiter — 100 requests per minute
const adminLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    message: 'Too many requests to the admin API. Please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiter — 200 requests per minute
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: {
    message: 'Too many requests. Please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginLimiter, adminLimiter, apiLimiter };
