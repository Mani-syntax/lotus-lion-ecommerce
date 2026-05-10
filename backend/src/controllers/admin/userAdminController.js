const supabase = require('../../config/supabase');

const mapUser = (u) => {
  if (!u) return null;
  return {
    ...u,
    _id: u.id,
    isBlocked: u.is_blocked,
    isAdmin: ['admin', 'super-admin'].includes(u.role)
  };
};

const getAdminUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '', role = '' } = req.query;
    const from = (Number(page) - 1) * Number(limit);
    const to = from + Number(limit) - 1;

    let query = supabase.from('profiles').select('*', { count: 'exact' });

    if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    if (role) query = query.eq('role', role);

    const { data, count, error } = await query.order('created_at', { ascending: false }).range(from, to);
    if (error) throw error;

    res.json({
      users: data.map(mapUser),
      page: Number(page),
      pages: Math.ceil((count || 0) / limit),
      total: count
    });
  } catch (error) { next(error); }
};

const getAdminUserById = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', req.params.id).single();
    if (error || !data) { res.status(404); throw new Error('User not found'); }
    res.json(mapUser(data));
  } catch (error) { next(error); }
};

const getUserOrders = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('orders').select('*').eq('user_id', req.params.id).order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) { next(error); }
};

const updateAdminUser = async (req, res, next) => {
  try {
    const { isBlocked, is_blocked, role } = req.body;
    const blockValue = isBlocked !== undefined ? isBlocked : is_blocked;
    
    const { data, error } = await supabase
      .from('profiles')
      .update({
        is_blocked: blockValue !== undefined ? Boolean(blockValue) : undefined,
        role: role || undefined
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'User updated', user: mapUser(data) });
  } catch (error) { next(error); }
};

const deleteAdminUser = async (req, res, next) => {
  try {
    if (req.user.id === req.params.id) {
      res.status(400); throw new Error('Cannot delete your own account');
    }
    const { error } = await supabase.from('profiles').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'User removed' });
  } catch (error) { next(error); }
};

module.exports = { getAdminUsers, getAdminUserById, getUserOrders, updateAdminUser, deleteAdminUser };
