'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  lowStockProducts: number;
  pendingOrders: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    pendingOrders: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('id, total_amount, status');

      if (ordersError) throw ordersError;

      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, stock_quantity');

      if (productsError) throw productsError;

      const totalOrders = ordersData?.length || 0;
      const totalRevenue = ordersData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      const totalProducts = productsData?.length || 0;
      const lowStockProducts = productsData?.filter((p) => p.stock_quantity < 10).length || 0;
      const pendingOrders = ordersData?.filter((o) => o.status === 'pending').length || 0;

      setStats({
        totalOrders,
        totalRevenue,
        totalProducts,
        lowStockProducts,
        pendingOrders,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon }: { title: string; value: string | number; icon: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-2 border-black p-6 rounded-lg"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-4xl font-bold mb-8 text-black"
        >
          Admin Dashboard
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard title="Total Orders" value={stats.totalOrders} icon="📦" />
          <StatCard title="Revenue (₹)" value={stats.totalRevenue.toLocaleString()} icon="💰" />
          <StatCard title="Products" value={stats.totalProducts} icon="👕" />
          <StatCard title="Low Stock" value={stats.lowStockProducts} icon="⚠️" />
          <StatCard title="Pending Orders" value={stats.pendingOrders} icon="⏳" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black text-white p-8 rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/products"
              className="bg-white text-black p-4 rounded-lg hover:bg-gray-100 transition text-center font-bold"
            >
              Manage Products
            </Link>
            <Link
              href="/admin/orders"
              className="bg-white text-black p-4 rounded-lg hover:bg-gray-100 transition text-center font-bold"
            >
              View Orders
            </Link>
            <Link
              href="/admin/blog"
              className="bg-white text-black p-4 rounded-lg hover:bg-gray-100 transition text-center font-bold"
            >
              Manage Blogs
            </Link>
            <Link
              href="/admin/cms"
              className="bg-white text-black p-4 rounded-lg hover:bg-gray-100 transition text-center font-bold"
            >
              CMS Settings
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
