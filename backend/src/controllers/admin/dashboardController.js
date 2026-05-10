const supabase = require('../../config/supabase');
const { remember } = require('../../services/cacheService');

const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await remember('admin:dashboard:stats', async () => {
      const [
        { count: totalOrders },
        { count: totalUsers },
        { count: totalProducts },
        { data: allOrders }
      ] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total_price, created_at, status, is_paid')
      ]);
      const totalRevenue = allOrders ? allOrders.reduce((acc, o) => acc + (((o.status && o.status.toLowerCase() === 'paid') || o.is_paid) ? Number(o.total_price || 0) : 0), 0) : 0;

      const [
        { data: recentOrders },
        { data: topProducts },
        { data: lowStockProducts }
      ] = await Promise.all([
        supabase.from('orders').select('*, user:profiles(name, email)').order('created_at', { ascending: false }).limit(10),
        supabase.from('products').select('*, images:product_images(*)').order('stock_quantity', { ascending: false }).limit(5),
        supabase.from('products').select('*, images:product_images(*)').gt('stock_quantity', 0).lt('stock_quantity', 10).limit(5)
      ]);

      const mapProduct = (p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        countInStock: p.stock_quantity,
        category: p.category,
        image: p.images?.[0]?.image_url || p.image_url
      });

      return {
        totalRevenue,
        totalOrders: totalOrders || 0,
        totalUsers: totalUsers || 0,
        totalProducts: totalProducts || 0,
        recentOrders: (recentOrders || []).map(o => ({
          id: o.id,
          totalPrice: o.total_price,
          status: o.status,
          isPaid: o.is_paid,
          isDelivered: o.is_delivered,
          user: o.user
        })),
        topSellingProducts: (topProducts || []).map(mapProduct),
        lowStockProducts: (lowStockProducts || []).map(mapProduct),
        revenueChart: (allOrders || []).slice(0, 7).map(o => ({
          date: new Date(o.created_at).toLocaleDateString(),
          revenue: o.total_price
        }))
      };
    }, 60);

    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    res.json(stats);
  } catch (error) { next(error); }
};

module.exports = { getDashboardStats };
