'use client';

import { motion } from 'framer-motion';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  name: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  change?: number;
  delay?: number;
}

export default function StatCard({ name, value, icon: Icon, color, change, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white p-6 border border-[#dddddd] hover:border-[#1c1c1c] transition-all group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon size={80} />
      </div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-2 bg-[#f7f7f7] ${color}`}>
          <Icon size={20} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-widest ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-[#666] text-[10px] uppercase tracking-widest font-bold mb-1">{name}</p>
        <h3 className="brand-heading text-3xl tracking-tight text-[#1c1c1c]">{value}</h3>
      </div>
    </motion.div>
  );
}
