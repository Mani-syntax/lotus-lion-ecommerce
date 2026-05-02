'use client';

import { useStore } from '@/store/useStore';
import { Bell, Search, User } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const { userInfo } = useStore();

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="brand-heading text-3xl uppercase mb-1 text-[#1c1c1c]">{title}</h1>
        {subtitle && (
          <p className="text-[#666] text-[10px] uppercase tracking-[0.2em] font-bold">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" size={16} />
          <input 
            type="text" 
            placeholder="Search everything..." 
            className="bg-white border border-[#dddddd] py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-[#1c1c1c] transition-colors w-64"
          />
        </div>

        <button className="p-2 bg-white border border-[#dddddd] text-[#666] hover:text-[#1c1c1c] transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#df0029] border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-[#dddddd]">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold uppercase text-[#1c1c1c] leading-tight">{userInfo?.name}</p>
            <p className="text-[10px] uppercase text-[#df0029] font-bold tracking-widest">{userInfo?.role}</p>
          </div>
          <div className="w-10 h-10 border border-[#1c1c1c] flex items-center justify-center text-[#1c1c1c] font-bold overflow-hidden">
             <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
