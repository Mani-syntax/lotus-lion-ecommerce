const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const extractToken = (req) => {
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

const protect = async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { data: user, error } = await supabase
      .from('profiles')
      .select('id, name, email, role, is_blocked')
      .eq('id', decoded.id)
      .single();

    if (!user || error) {
      res.status(401);
      return next(new Error('Not authorized, user not found'));
    }

    if (user.is_blocked) {
      res.status(403);
      return next(new Error('Your account has been blocked'));
    }

    req.user = {
      ...user,
      is_active: !user.is_blocked,
      isAdmin: ['admin', 'super-admin', 'editor'].includes(user.role)
    };
    next();
  } catch (error) {
    res.status(401);
    next(new Error('Not authorized, token failed'));
  }
};

const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'editor' || req.user.role === 'admin' || req.user.role === 'super-admin' || req.user.isAdmin)) {
    next();
  } else {
    res.status(403);
    next(new Error('Not authorized as an admin'));
  }
};

const superAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'super-admin') {
    next();
  } else {
    res.status(403);
    next(new Error('Super-admin access required'));
  }
};

module.exports = { protect, admin, superAdmin };
