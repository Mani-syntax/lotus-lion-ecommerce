'use client';

import { useDashboard } from '@/hooks/useAdminData';
import AdminHeader from '@/components/admin/AdminHeader';
import StatCard from '@/components/admin/StatCard';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Package,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import Link from 'next/link';
import { formatINR } from '@/lib/currency';

export default function AdminDashboard() {
  const { data: stats, loading } = useDashboard();

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-primary text-xs font-bold uppercase tracking-[0.5em] animate-pulse">
        Lotus & Lion Analytics Syncing...
      </div>
    </div>
  );

  const statCards = [
    { name: 'Total Revenue', value: formatINR(stats?.totalRevenue), icon: TrendingUp, color: 'text-green-500', change: 12 },
    { name: 'Total Orders', value: stats?.totalOrders, icon: ShoppingBag, color: 'text-primary', change: 8 },
    { name: 'Total Users', value: stats?.totalUsers, icon: Users, color: 'text-blue-500', change: 5 },
    { name: 'Total Products', value: stats?.totalProducts, icon: Package, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <AdminHeader 
        title="Grand Overview" 
        subtitle="Real-time performance of your luxury empire." 
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <StatCard key={stat.name} {...stat} delay={idx * 0.1} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-[#111] border border-white/5 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white">Revenue Performance (7 Days)</h2>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Revenue</span>
               </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.revenueChart}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#666' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#666' }}
                  tickFormatter={(val) => formatINR(val)}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: 'var(--primary)', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="var(--primary)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Low Stock Alerts */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#111] border border-white/5 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white">Inventory Alerts</h2>
            <AlertCircle size={16} className="text-red-500" />
          </div>
          
          <div className="space-y-4">
            {stats?.lowStockProducts?.length > 0 ? (
              stats.lowStockProducts.map((product: any) => (
                <div key={product._id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-red-500/30 transition-all">
                  <img src={product.image} className="w-10 h-12 object-cover rounded" alt="" />
                  <div className="flex-grow">
                    <p className="text-[10px] font-bold uppercase text-white truncate w-32">{product.name}</p>
                    <p className="text-[8px] uppercase text-gray-500 font-bold tracking-widest">{product.category}</p>
                  </div>
                  <div className="text-right text-red-500 font-bold">
                    <p className="text-[10px]">{product.countInStock} Left</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                 <Package className="mx-auto text-gray-700 mb-2" size={32} />
                 <p className="text-[10px] uppercase text-gray-600 font-bold">All stock levels healthy.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white">Recent Orders</h2>
            <Link href="/admin/orders" className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] hover:underline flex items-center gap-1">
              Full Ledger <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Order ID</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Customer</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Total</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats?.recentOrders?.map((order: any) => (
                  <tr key={order._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-[10px] font-mono text-gray-400">#{order._id.slice(-8)}</td>
                    <td className="px-6 py-4">
                       <p className="text-[10px] font-bold uppercase text-white">{order.user?.name}</p>
                       <p className="text-[8px] text-gray-500">{order.user?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-primary">{formatINR(order.totalPrice)}</td>
                    <td className="px-6 py-4">
                      <OrderStatusBadge isPaid={order.isPaid} isDelivered={order.isDelivered} status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Sellers */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
           <h2 className="text-xs font-bold uppercase tracking-widest text-white mb-6">Top Performers</h2>
           <div className="space-y-6">
              {stats?.topSellingProducts?.map((product: any) => (
                <div key={product._id} className="flex gap-4 items-center">
                  <img src={product.image} className="w-12 h-16 object-cover bg-white/5 rounded" alt="" />
                  <div className="flex-grow">
                    <h4 className="text-[10px] font-bold uppercase tracking-wide text-white">{product.name}</h4>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">{formatINR(product.price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-500">{product.countInStock} Left</p>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
