'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

const footerGroups = [
  {
    title: 'Collections',
    links: ['Lotus Collections', 'Lion Collections', 'Artist Outfits', 'Co-ord Sets', 'Studio Dresses', 'Gallery Layers', 'All Collections'],
  },
  {
    title: 'Useful Links',
    links: ['Track Your Order', 'Shipping Policy', 'Return & Exchange Policy', 'Privacy Policy', 'About Us', 'Contact Us', 'FAQs'],
  },
  {
    title: 'Payment Options',
    links: ['VISA', 'MASTER CARD', 'NETBANKING', 'ALL CREDIT/DEBIT CARDS', 'UPI & WALLETS', 'COD'],
  },
];

const Footer = () => {
  const [email, setEmail] = useState('');
  const [cmsFooter, setCmsFooter] = useState<any[] | null>(null);
  const [theme, setTheme] = useState<any>(null);

  useEffect(() => {
    api.get('/cms/site').then(({ data }) => {
      if (Array.isArray(data.footer) && data.footer.length) setCmsFooter(data.footer);
      if (data.theme) setTheme(data.theme);
    }).catch(() => undefined);
  }, []);

  const handleNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      toast.error('Enter an email address');
      return;
    }
    toast.success('Newsletter signup saved');
    setEmail('');
  };

  return (
    <footer className="bg-white text-[#1c1c1c]">
      <div className="border-b border-[#dddddd] px-4 py-10 sm:px-8">
        <div className="mx-auto grid max-w-[1440px] gap-8 md:grid-cols-[1.2fr_1fr]">
          <div>
            <h3 className="text-2xl uppercase tracking-[0.18em]">Lotus & Lion</h3>
            <p className="mt-3 max-w-lg text-sm leading-7 text-[#666]">
              Premium everyday and occasion wear crafted with clean silhouettes, reliable fabrics, and timeless color.
            </p>
          </div>
          <form onSubmit={handleNewsletter} className="md:justify-self-end">
            <label className="block text-[12px] uppercase tracking-[0.18em]">Newsletter</label>
            <div className="mt-4 flex min-w-[300px] border-b border-[#1c1c1c]">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="E-mail"
                className="w-full bg-transparent py-3 text-sm outline-none"
              />
              <button className="px-3 text-[12px] uppercase tracking-[0.18em]">Subscribe</button>
            </div>
          </form>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-12 sm:px-8 md:grid-cols-3">
        {(cmsFooter || footerGroups).map((group: any) => (
          <div key={group.heading || group.title}>
            <h4 className="mb-5 text-[13px] uppercase tracking-[0.18em]">{group.heading || group.title}</h4>
            <ul className="space-y-3">
              {group.links.map((link: any) => (
                <li key={link.label || link}>
                  <Link href={link.href || '/products'} className="text-sm text-[#555] hover:text-[#df0029]">
                    {link.label || link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-[#dddddd] px-4 py-5 sm:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-3 text-[12px] text-[#666] md:flex-row md:items-center">
          <p>© 2026 - LOTUS & LION - Original Atelier Storefront</p>
          <div className="flex gap-5">
            <Link href="https://instagram.com" target="_blank" className="hover:text-[#df0029]">Instagram</Link>
            <Link href="https://x.com" target="_blank" className="hover:text-[#df0029]">Twitter</Link>
            <Link href="https://pinterest.com" target="_blank" className="hover:text-[#df0029]">Pinterest</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
