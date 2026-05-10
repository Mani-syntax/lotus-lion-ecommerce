const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/auth/login
const authUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (!user || error) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    if (user.is_blocked) {
      res.status(403);
      throw new Error('Your account is blocked');
    }

    // Update last login
    await supabase.from('profiles').update({ last_login: new Date().toISOString() }).eq('id', user.id);

    const token = generateToken(user.id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAdmin: ['admin', 'super-admin', 'editor'].includes(user.role),
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      res.status(400);
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: user, error } = await supabase
      .from('profiles')
      .insert({
        name,
        email,
        password: hashedPassword,
        role: 'customer',
        is_blocked: false
      })
      .select()
      .single();

    if (error) throw error;

    const token = generateToken(user.id);
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAdmin: false,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
const logoutUser = async (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get current user profile
const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

module.exports = {
  authUser,
  logoutUser,
  getMe,
  registerUser,
  getUserProfile: async (req, res) => res.json(req.user),
  seedData: async (req, res) => res.status(501).json({ message: 'Seeding not yet implemented for Supabase' })
};
