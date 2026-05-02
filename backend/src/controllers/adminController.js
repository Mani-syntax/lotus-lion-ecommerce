const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name');

    // Simple top selling products (can be improved with aggregation)
    const topSellingProducts = await Product.find({}).sort({ numReviews: -1 }).limit(4);

    res.json({
      totalRevenue,
      totalOrders,
      totalUsers,
      totalProducts,
      recentOrders,
      topSellingProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user (block/unblock)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.isBlocked = req.body.isBlocked !== undefined ? req.body.isBlocked : user.isBlocked;
      await user.save();
      res.json({ message: 'User status updated' });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = req.body.status === 'delivered';
      if (order.isDelivered) order.deliveredAt = Date.now();
      await order.save();
      res.json({ message: 'Order status updated' });
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  updateOrderStatus
};
