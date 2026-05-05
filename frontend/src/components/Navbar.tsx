'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Crown, Flower2, Heart, LogOut, Menu, Search, Shield, ShoppingBag, User, X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const fallbackNav = [
  { label: 'New Arrivals', href: '/products?category=New Arrivals' },
  { label: 'Mens', href: '/products?category=Mens' },
  { label: 'Womens', href: '/products?category=Womens' },
  { label: 'Essentials', href: '/products?category=Essentials' },
  { label: 'Heritage', href: '/heritage' },
  { label: 'Accessories', href: '/products?category=Accessories' },
  { label: 'Sale', href: '/products?sale=true' },
];

const Navbar = () => {
  const { userInfo, setUserInfo, cartItems } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [navItems, setNavItems] = useState<any[]>(fallbackNav);
  const [announcement, setAnnouncement] = useState<any>(null);

  useEffect(() => {
    api.get('/cms/site').then(({ data }) => {
      if (Array.isArray(data.navbar) && data.navbar.length) {
        setNavItems(data.navbar.sort((a: any, b: any) => (a.order || 0) - (b.order || 0)));
      }
      const topBar = data.announcements?.find?.((item: any) => item.placement === 'top-bar') || data.announcements?.[0];
      setAnnouncement(topBar || null);
    }).catch(() => undefined);
  }, []);

  const logoutHandler = async () => {
    try {
      await api.post('/auth/logout');
      toast.success('Signed out');
    } catch {
      toast.success('Signed out');
    } finally {
      setUserInfo(null);
      localStorage.removeItem('lotus-lion-storage');
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const isAdmin = userInfo?.role === 'admin' || userInfo?.role === 'super-admin' || userInfo?.isAdmin;

  return (
    <header className="sticky top-0 z-50 bg-white text-[#1c1c1c]">
      {announcement?.message && (
        <div className="bg-[#1c1c1c] px-4 py-2 text-center text-[11px] uppercase tracking-[0.18em] text-white">
          {announcement.linkHref ? <Link href={announcement.linkHref} className="hover:text-[#c8a45d]">{announcement.message}</Link> : announcement.message}
        </div>
      )}
      <div className="border-b border-[#dddddd]">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-4 sm:px-8">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] md:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} /> Menu
          </button>

          <nav className="hidden items-center gap-7 md:flex">
            {navItems.slice(0, 2).map((item) => (
              <Link key={`primary-${item.label}`} href={item.href} className="text-[12px] uppercase tracking-[0.18em] text-[#1c1c1c] hover:text-[#df0029]">
                {item.label === 'Heritage' && <Flower2 size={14} className="inline -mt-0.5 mr-2" />}
                {item.label}
              </Link>
            ))}
          </nav>

          <Link href="/" className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 sm:gap-3 text-center">
            <span className="lotus-symbol hidden sm:inline-grid" aria-hidden="true"><Flower2 /></span>
            <span className="brand-heading block text-lg sm:text-2xl uppercase whitespace-nowrap">Lotus & Lion</span>
            <span className="lion-symbol hidden sm:inline-grid" aria-hidden="true"><Crown /></span>
          </Link>

          <div className="flex items-center gap-5">
            <Link href="/products" aria-label="Search">
              <Search size={19} />
            </Link>
            <Link href="/wishlist" aria-label="Wishlist" className="hidden sm:block">
              <Heart size={19} />
            </Link>
            {userInfo ? (
              <>
                {isAdmin && (
                  <Link href="/admin" aria-label="Admin portal">
                    <Shield size={19} />
                  </Link>
                )}
                <Link href="/dashboard" aria-label="Account">
                  <User size={19} />
                </Link>
                <button onClick={logoutHandler} aria-label="Logout">
                  <LogOut size={19} />
                </button>
              </>
            ) : (
              <Link href="/login" aria-label="Account">
                <User size={19} />
              </Link>
            )}
            <Link href="/cart" className="relative" aria-label="Cart">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center bg-[#df0029] px-1 text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden border-b border-[#dddddd] md:block">
        <nav className="mx-auto flex h-12 max-w-[1440px] items-center justify-center gap-10 px-8">
          {navItems.map((item) => (
            <Link key={`nav-${item.label}`} href={item.href} className="text-[12px] uppercase tracking-[0.18em] text-[#1c1c1c] hover:text-[#df0029]">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[80] bg-white text-[#1c1c1c] md:hidden">
          <div className="flex h-16 items-center justify-between border-b border-[#dddddd] px-5">
            <span className="text-sm font-bold uppercase tracking-[0.2em]">Lotus & Lion</span>
            <button onClick={() => setIsOpen(false)} aria-label="Close menu">
              <X size={22} />
            </button>
          </div>
          <div className="divide-y divide-[#dddddd]">
            {navItems.map((item, idx) => (
              <Link
                key={`mobile-${item.label}-${idx}`}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-5 py-5 text-sm uppercase tracking-[0.18em]"
              >
                {item.label === 'Heritage' && <Flower2 size={14} className="inline -mt-0.5 mr-2" />}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
