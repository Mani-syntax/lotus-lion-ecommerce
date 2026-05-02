const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Extract JWT token from:
 * 1. httpOnly cookie (preferred, production)
 * 2. Authorization Bearer header (backwards compatibility)
 */
const extractToken = (req) => {
  // 1. Cookie
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  // 2. Bearer header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

// ─── Protect: any authenticated user ────────────────────────────────────────
const protect = async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401);
      return next(new Error('Not authorized, user not found'));
    }

    if (user.isBlocked) {
      res.status(403);
      return next(new Error('Your account has been blocked'));
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    next(new Error('Not authorized, token failed'));
  }
};

// ─── Admin: admin OR super-admin ─────────────────────────────────────────────
const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'editor' || req.user.role === 'admin' || req.user.role === 'super-admin' || req.user.isAdmin)) {
    next();
  } else {
    res.status(403);
    next(new Error('Not authorized as an admin'));
  }
};

const roleGuard = (...roles) => (req, res, next) => {
  if (req.user && roles.includes(req.user.role)) {
    next();
  } else {
    res.status(403);
    next(new Error('Insufficient role permissions'));
  }
};

// ─── Super Admin only ────────────────────────────────────────────────────────
const superAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'super-admin') {
    next();
  } else {
    res.status(403);
    next(new Error('Super-admin access required'));
  }
};

module.exports = { protect, admin, superAdmin, roleGuard };
