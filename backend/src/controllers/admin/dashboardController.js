const Order = require('../../models/Order');
const Product = require('../../models/Product');
const User = require('../../models/User');
const { remember } = require('../../services/cacheService');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const [totalOrders, totalUsers, totalProducts, orders] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      Product.countDocuments(),
      Order.find({}).select('totalPrice createdAt isPaid'),
    ]);

    const totalRevenue = orders.reduce((acc, o) => acc + (o.isPaid ? o.totalPrice : 0), 0);

    // 7-day revenue chart
    const revenueChart = await buildRevenueChart();

    const [recentOrders, topSellingProducts, lowStockProducts] = await Promise.all([
      Order.find({})
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('user', 'name email'),

      Product.aggregate([
        { $match: { isPublished: true } },
        { $sort: { countInStock: -1 } },
        { $limit: 5 },
      ]),

      Product.find({ countInStock: { $gt: 0, $lt: 10 } })
        .select('name countInStock category image')
        .limit(10),
    ]);

    res.json({
      totalRevenue,
      totalOrders,
      totalUsers,
      totalProducts,
      recentOrders,
      topSellingProducts,
      lowStockProducts,
      revenueChart,
    });
  } catch (error) {
    next(error);
  }
};

// Build last 7 days revenue data for chart
const buildRevenueChart = async () => {
  const days = 7;
  const result = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const start = new Date(now);
    start.setDate(now.getDate() - i);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      createdAt: { $gte: start, $lte: end },
      isPaid: true,
    }).select('totalPrice');

    const revenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);

    result.push({
      date: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: parseFloat(revenue.toFixed(2)),
      orders: orders.length,
    });
  }

  return result;
};

module.exports = { getDashboardStats };
