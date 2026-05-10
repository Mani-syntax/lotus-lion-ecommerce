const express = require('express');
const {
  authUser,
  registerUser,
  getUserProfile,
  logoutUser,
  getMe,
  seedData,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', authUser);
router.post('/logout', logoutUser);
router.post('/register', registerUser);
router.get('/profile', protect, getUserProfile);
router.get('/me', protect, getMe);
router.get('/seed', seedData);

module.exports = router;
