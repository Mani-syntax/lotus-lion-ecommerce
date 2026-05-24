'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Crown, Flower2, Heart, LogOut, Menu, Search, Shield, ShoppingBag, User, X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const navLinks = [
  { label: 'WOMEN', href: '/collections/lotus' },
  { label: 'MEN', href: '/collections/lion' },
  { label: 'THE SUMMER EDIT', href: '/collections/summer' },
  { label: 'SALE / BEST SELLER', href: '/collections/sale' },
  { label: 'ABOUT', href: '/about' },
];

const Navbar = () => {
  const { userInfo, setUserInfo, cartItems } = useStore();
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  const [isOpen, setIsOpen] = useState(false);
  const [navItems, setNavItems] = useState<any[]>(navLinks);
  const [announcement, setAnnouncement] = useState<any>(null);

  useEffect(() => {
    // Force use of the requested navLinks
    setNavItems(navLinks);
    
    api.get('/cms/site').then(({ data }) => {
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

  const cartCount = safeCartItems.reduce((acc, item) => acc + (Number(item.qty) || 0), 0);
  const isAdmin = userInfo?.role === 'admin' || userInfo?.role === 'super-admin' || userInfo?.isAdmin;

  return (
    <header className="sticky top-0 z-50 bg-white text-[#1c1c1c]">
      {announcement?.message && (
        <div className="bg-[#1c1c1c] px-4 py-2 text-center text-[11px] uppercase tracking-[0.18em] text-white">
          {announcement.linkHref ? <Link href={announcement.linkHref} className="hover:text-[#c8a45d]">{announcement.message}</Link> : announcement.message}
        </div>
      )}
      <div className="border-b border-[#dddddd]">
        <div className="mx-auto max-w-[1440px] px-3 sm:px-8">
          <div className="grid h-20 grid-cols-[44px_minmax(0,1fr)_86px] items-center md:h-20 md:grid-cols-3">
            {/* Left Section: Menu */}
            <div className="flex items-center">
              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] md:hidden"
                aria-label="Open menu"
              >
                <Menu size={31} strokeWidth={1.8} /> <span className="hidden">Menu</span>
              </button>

              <nav className="hidden items-center gap-7 md:flex">
                {navItems.slice(0, 2).map((item) => (
                  <Link key={`primary-${item.label}`} href={item.href} className="text-[12px] uppercase tracking-[0.18em] text-[#1c1c1c] hover:text-[#df0029]">
                    {item.label === 'Heritage' && <Flower2 size={14} className="inline -mt-0.5 mr-2" />}
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Center Section: Logo */}
            <div className="flex justify-center">
              <Link href="/" className="flex items-center gap-2 sm:gap-3 text-center">
                <span className="lotus-symbol hidden md:inline-grid" aria-hidden="true"><Flower2 /></span>
                <span className="brand-heading block whitespace-nowrap text-[22px] uppercase sm:text-2xl">Lotus & Lion</span>
                <span className="lion-symbol hidden md:inline-grid" aria-hidden="true"><Crown /></span>
              </Link>
            </div>

            {/* Right Section: Icons */}
            <div className="flex items-center justify-end gap-3 sm:gap-5">
              <Link href="/products" aria-label="Search">
                <Search size={28} strokeWidth={1.8} className="md:h-[19px] md:w-[19px]" />
              </Link>
              <Link href="/wishlist" aria-label="Wishlist" className="hidden sm:block">
                <Heart size={19} />
              </Link>
              {userInfo ? (
                <>
                  {isAdmin && (
                    <Link href="/admin" aria-label="Admin portal" className="hidden md:block">
                      <Shield size={19} />
                    </Link>
                  )}
                  <Link href={isAdmin ? "/admin" : "/"} aria-label="Account" className="hidden md:block">
                    <User size={19} className={isAdmin ? "text-primary" : ""} />
                  </Link>
                  <button onClick={logoutHandler} aria-label="Logout" className="hidden sm:block">
                    <LogOut size={19} />
                  </button>
                </>
              ) : (
                <Link href="/login" aria-label="Account" className="hidden md:block">
                  <User size={19} />
                </Link>
              )}
              <Link href="/cart" className="relative" aria-label="Cart">
                <ShoppingBag size={28} strokeWidth={1.8} className="md:h-5 md:w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center bg-[#df0029] px-1 text-[9px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
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
