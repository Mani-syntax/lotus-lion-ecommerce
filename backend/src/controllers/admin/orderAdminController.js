const supabase = require('../../config/supabase');

const mapOrder = (o) => {
  if (!o) return null;
  return {
    ...o,
    _id: o.id,
    user: o.user_id,
    orderItems: o.order_items || [],
    shippingAddress: o.shipping_address || {},
    paymentMethod: o.payment_method,
    paymentResult: o.payment_result || {},
    taxPrice: o.tax_price,
    shippingPrice: o.shipping_price,
    totalPrice: o.total_price,
    isPaid: o.is_paid,
    paidAt: o.paid_at,
    isDelivered: o.is_delivered,
    deliveredAt: o.delivered_at,
    status: o.status || 'Pending'
  };
};

// @route GET /api/admin/orders
const getAdminOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status = '' } = req.query;
    const from = (Number(page) - 1) * Number(limit);
    const to = from + Number(limit) - 1;

    let query = supabase.from('orders').select('*, profile:profiles(name, email)', { count: 'exact' });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, count, error } = await query.order('created_at', { ascending: false }).range(from, to);
    if (error) throw error;

    res.json({
      orders: data.map(mapOrder),
      page: Number(page),
      pages: Math.ceil((count || 0) / limit),
      total: count
    });
  } catch (error) { next(error); }
};

// @route GET /api/admin/orders/:id
const getAdminOrderById = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, profile:profiles(*)')
      .eq('id', req.params.id)
      .single();

    if (error || !data) {
      res.status(404);
      throw new Error('Order not found');
    }
    res.json(mapOrder(data));
  } catch (error) { next(error); }
};

// @route PUT /api/admin/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { data, error } = await supabase.from('orders').update({ status }).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ message: `Order status updated to "${status}"`, order: mapOrder(data) });
  } catch (error) { next(error); }
};

module.exports = { getAdminOrders, getAdminOrderById, updateOrderStatus };
