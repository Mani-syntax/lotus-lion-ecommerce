const Order = require('../../models/Order');

const STATUS_MAP = {
  pending: { isPaid: false, isDelivered: false },
  paid: { isPaid: true, isDelivered: false },
  shipped: { isPaid: true, isDelivered: false },
  delivered: { isPaid: true, isDelivered: true },
};

// ─── GET ALL ORDERS ──────────────────────────────────────────────────────────
// @route GET /api/admin/orders
const getAdminOrders = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      status = '',
      search = '',
      startDate = '',
      endDate = '',
      sort = '-createdAt',
    } = req.query;

    const query = {};

    if (status === 'paid') query.isPaid = true;
    else if (status === 'pending') query.isPaid = false;
    else if (status === 'delivered') query.isDelivered = true;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate('user', 'name email'),
      Order.countDocuments(query),
    ]);

    res.json({
      orders,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET SINGLE ORDER ────────────────────────────────────────────────────────
// @route GET /api/admin/orders/:id
const getAdminOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email role');
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

// ─── UPDATE ORDER STATUS ─────────────────────────────────────────────────────
// @route PUT /api/admin/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'paid', 'shipped', 'delivered'];
    if (!validStatuses.includes(status)) {
      res.status(400);
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    const updates = STATUS_MAP[status];
    order.isPaid = updates.isPaid;
    order.isDelivered = updates.isDelivered;
    order.status = status;

    if (updates.isPaid && !order.paidAt) order.paidAt = Date.now();
    if (updates.isDelivered && !order.deliveredAt) order.deliveredAt = Date.now();

    const updated = await order.save();
    res.json({ message: `Order status updated to "${status}"`, order: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAdminOrders, getAdminOrderById, updateOrderStatus };
