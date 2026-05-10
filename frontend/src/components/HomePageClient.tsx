'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Crown, Flower2, Headphones, RefreshCcw, ShieldCheck, Truck } from 'lucide-react';
import { formatINR } from '@/lib/currency';
import HeroSlider from '@/components/HeroSlider';
import ProductCard from '@/components/ProductCard';

const fallbackCollections = [
  {
    title: 'Lotus Collections',
    subtitle: 'Women',
    icon: Flower2,
    body: 'Fluid dresses, co-ords, and occasion-ready pieces shaped around hand-drawn lines, soft contrast, and gallery-day comfort.',
    href: '/products?category=Womens',
  },
  {
    title: 'Lion Collections',
    subtitle: 'Men',
    icon: Crown,
    body: 'Crisp shirts, relaxed tailoring, and structured layers for men who like clean proportions and quiet detail.',
    href: '/products?category=Mens',
  },
  {
    title: 'Artist Outfits',
    subtitle: 'Atelier Looks',
    icon: ShieldCheck,
    body: 'Outfits composed like a canvas: tonal panels, drawn seams, and expressive silhouettes for studio, stage, and celebration.',
    href: '/products?category=Artist Outfits',
  },
];

const journals = [
  'How Artist Wardrobes Balance Comfort And Drama',
  'Drawing Lines Into Fabric: Our Studio Notes',
  'Building A Two-Color Capsule That Still Feels Alive',
];

const searches = ['Lotus Collections', 'Lion Collections', 'Artist Outfits', 'Co-ord Sets', 'Studio Dresses', 'Overshirts', 'Linen', 'Canvas Cotton', 'Gallery Wear', 'Occasion Wear', 'Daily Sets', 'Sale'];

function ArtPanel({ index = 0, label }: { index?: number; label: string }) {
  return (
    <div className="atelier-visual aspect-[3/4]">
      <div className="absolute inset-x-8 bottom-8 z-10 border border-[#1c1c1c] bg-white/80 px-4 py-3 text-center">
        <p className="brand-heading text-sm uppercase">{label}</p>
      </div>
      <div
        className="absolute z-10 h-24 w-24 rounded-full border border-[#df0029]"
        style={{
          left: `${18 + index * 11}%`,
          top: `${16 + index * 8}%`,
        }}
      />
    </div>
  );
}



export default function HomePageClient({ initialData }: { initialData: any }) {
  const [siteCms] = useState(initialData || {});
  
  const homeContent = {
    slides: siteCms?.home?.slides || [{ title: 'Lotus & Lion', subtitle: 'Modern luxury clothing.', eyebrow: 'Online Exclusive' }],
    lotusProducts: siteCms?.lotusProducts || [],
    lionProducts: siteCms?.lionProducts || [],
    collections: siteCms?.collections || []
  };

  const featuredProducts = siteCms?.featuredProducts?.length ? siteCms.featuredProducts.map((product: any) => ({
    name: product.name,
    price: formatINR(product.price || 0),
    regular: product.price ? formatINR(product.price || 0) : '',
    save: 'Featured',
    images: product.images && product.images.length > 0 ? product.images : [],
    href: `/products/${product.slug || product.id || ''}`,
  })) : null;

  const lotusRail = homeContent.lotusProducts || [];
  const lionRail = homeContent.lionProducts || [];

  const liveCollections = siteCms.collections?.length ? siteCms.collections : null;

  return (
    <div className="bg-white text-[#1c1c1c]">
      <HeroSlider slides={homeContent.slides} />

      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-8">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/products?category=Womens" className="grid h-10 w-10 place-items-center border border-[#dddddd]"><ChevronLeft size={18} /></Link>
          <Link href="/products?category=Womens" className="brand-heading text-center text-2xl uppercase hover:underline">Lotus Collections</Link>
          <Link href="/products?category=Womens" className="grid h-10 w-10 place-items-center border border-[#dddddd]"><ChevronRight size={18} /></Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-6">
          {lotusRail.slice(0, 4).map((product: any, index: number) => <ProductCard key={product.id || index} product={product} />)}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] space-y-10 px-4 py-8 sm:px-8">
        {(liveCollections || fallbackCollections).map((collection: any, index: number) => {
          const collectionKey = collection.slug || (collection.title?.startsWith?.('Lotus') ? 'lotus' : 'lion');
          const collectionHref = collection.slug ? `/collections/${collection.slug}` : (collection.href || '/products');
          const collectionImage = collection.hero?.image || collection.banner_url;
          return (
            <div key={index} className={`grid items-center gap-8 border-y border-[#dddddd] py-10 md:grid-cols-2 ${index % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}>
              <Link href={collectionHref} className="block">
                {collectionImage ? (
                  <img src={collectionImage} alt="" className="aspect-[3/4] w-full object-cover" />
                ) : (
                  <ArtPanel index={index} label={collection.name || collection.title} />
                )}
              </Link>
              <div className="mx-auto max-w-xl text-center md:text-left">
                {(collectionKey === 'lotus' ? <Flower2 className="mb-5 inline-block" size={28} /> : <Crown className="mb-5 inline-block" size={28} />)}
                <h2 className="brand-heading text-3xl uppercase">{collection.name || collection.title || collection.hero?.title}</h2>
                <p className="mt-5 text-[15px] leading-8 text-[#555]">{collection.description || collection.body || collection.hero?.subtitle}</p>
                <Link href={collectionHref} className="mt-7 inline-block border-b border-[#1c1c1c] pb-1 text-[12px] uppercase tracking-[0.18em]">
                  View collection
                </Link>
              </div>
            </div>
          );
        })}
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-8">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/products?category=Mens" className="grid h-10 w-10 place-items-center border border-[#dddddd]"><ChevronLeft size={18} /></Link>
          <Link href="/products?category=Mens" className="brand-heading text-center text-2xl uppercase hover:underline">Lion Collections</Link>
          <Link href="/products?category=Mens" className="grid h-10 w-10 place-items-center border border-[#dddddd]"><ChevronRight size={18} /></Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-6">
          {lionRail.slice(0, 4).map((product: any, index: number) => <ProductCard key={product.id || index} product={product} />)}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 text-center sm:px-8">
        <h2 className="brand-heading text-3xl uppercase">Studio Journal</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {journals.map((title, i) => (
            <div key={i} className="text-left">
               <ArtPanel index={i} label="Journal" />
               <h3 className="mt-4 brand-heading text-lg uppercase">{title}</h3>
               <Link href="/blog" className="mt-3 inline-block text-[10px] uppercase tracking-widest border-b border-black">Read More</Link>
            </div>
          ))}
        </div>
      </section>
      
      <section className="mx-auto grid max-w-[1440px] grid-cols-2 gap-px border-b border-[#dddddd] bg-[#dddddd] md:grid-cols-4">
        {[
          { icon: ShieldCheck, title: 'Original Design', body: 'Symbols, panels, and copy made for Lotus & Lion' },
          { icon: Truck, title: 'Delivery Ready', body: 'Shipping flows connect through checkout' },
          { icon: RefreshCcw, title: 'Easy Returns', body: 'Return-policy pages are live' },
          { icon: Headphones, title: 'Admin Support', body: 'Products, orders, users, CMS and settings stay wired' },
        ].map((item) => (
          <div key={item.title} className="bg-white px-5 py-8 text-center">
            <item.icon className="mx-auto mb-4" size={26} />
            <h3 className="text-[13px] uppercase tracking-[0.18em]">{item.title}</h3>
            <p className="mt-2 text-sm text-[#666]">{item.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
