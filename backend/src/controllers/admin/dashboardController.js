const supabase = require('../../config/supabase');
const { remember } = require('../../services/cacheService');

const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await remember('admin:dashboard:stats', async () => {
      const [
        { count: totalOrders, error: ordersCountError },
        { count: totalUsers, error: usersCountError },
        { count: totalProducts, error: productsCountError },
        { data: allOrders, error: ordersError }
      ] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total_price, created_at, status, is_paid')
      ]);

      if (ordersCountError || usersCountError || productsCountError || ordersError) {
        console.log('Supabase count errors:', { ordersCountError, usersCountError, productsCountError, ordersError });
      }

      const totalRevenue = allOrders ? allOrders.reduce((acc, o) => acc + (((o.status && o.status.toLowerCase() === 'paid') || o.is_paid) ? Number(o.total_price || 0) : 0), 0) : 0;

      const [
        { data: recentOrders, error: recentOrdersError },
        { data: topProducts, error: topProductsError },
        { data: lowStockProducts, error: lowStockError }
      ] = await Promise.all([
        supabase.from('orders').select('*, user:profiles(name, email)').order('created_at', { ascending: false }).limit(10),
        supabase.from('products').select('*, images:product_images(*)').order('stock_quantity', { ascending: false }).limit(5),
        supabase.from('products').select('*, images:product_images(*)').gt('stock_quantity', 0).lt('stock_quantity', 10).limit(5)
      ]);

      if (recentOrdersError || topProductsError || lowStockError) {
        console.log('Supabase fetch errors:', { recentOrdersError, topProductsError, lowStockError });
      }

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
  } catch (error) {
    console.error('[Dashboard Error]', error);
    // Return default stats instead of erroring
    res.status(500).json({
      totalRevenue: 0,
      totalOrders: 0,
      totalUsers: 0,
      totalProducts: 0,
      recentOrders: [],
      topSellingProducts: [],
      lowStockProducts: [],
      revenueChart: [],
      error: error.message
    });
  }
};

module.exports = { getDashboardStats };
