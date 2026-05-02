const User = require('../../models/User');
const Order = require('../../models/Order');

const getAdminUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '', role = '' } = req.query;
    const query = {};
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
    if (role) query.role = role;
    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort({ createdAt: -1 })
        .skip((page - 1) * limit).limit(Number(limit)),
      User.countDocuments(query),
    ]);
    res.json({ users, page: Number(page), pages: Math.ceil(total / limit), total });
  } catch (error) { next(error); }
};

const getAdminUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) { res.status(404); throw new Error('User not found'); }
    res.json(user);
  } catch (error) { next(error); }
};

const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.params.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) { next(error); }
};

const updateAdminUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) { res.status(404); throw new Error('User not found'); }
    const { isBlocked, role } = req.body;
    if (isBlocked !== undefined) user.isBlocked = Boolean(isBlocked);
    if (role && ['user', 'admin', 'super-admin'].includes(role)) user.role = role;
    await user.save();
    res.json({ message: 'User updated', user: { _id: user._id, name: user.name, email: user.email, role: user.role, isBlocked: user.isBlocked } });
  } catch (error) { next(error); }
};

const deleteAdminUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) { res.status(404); throw new Error('User not found'); }
    if (req.user._id.toString() === req.params.id) {
      res.status(400); throw new Error('Cannot delete your own account');
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed' });
  } catch (error) { next(error); }
};

module.exports = { getAdminUsers, getAdminUserById, getUserOrders, updateAdminUser, deleteAdminUser };
