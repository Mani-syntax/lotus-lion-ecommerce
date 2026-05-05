'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Crown, Flower2, Headphones, RefreshCcw, ShieldCheck, Truck } from 'lucide-react';
import api from '@/lib/api';
import { formatINR } from '@/lib/currency';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamic fetching handled in useEffect

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

type HomeRailProduct = {
  name: string;
  price: string;
  regular: string;
  save: string;
  image?: string;
  images?: string[];
  href?: string;
};

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

function ProductTile({ product, index }: { product: HomeRailProduct; index: number }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const images = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);

  return (
    <Link href={product.href || '/products'} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f7f7f7] group/tile">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIdx}
            src={images[currentIdx]}
            alt={product.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full object-cover"
          />
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 opacity-0 group-hover/tile:opacity-100 transition-opacity z-30">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                }}
                className="p-1 bg-white/80 hover:bg-white rounded-full shadow-sm"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                }}
                className="p-1 bg-white/80 hover:bg-white rounded-full shadow-sm"
              >
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="absolute bottom-12 inset-x-0 flex justify-center gap-1 opacity-0 group-hover/tile:opacity-100 transition-opacity z-30">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1 h-1 rounded-full transition-all ${
                    currentIdx === idx ? 'bg-primary w-2' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <span className="absolute left-3 top-3 z-20 bg-[#df0029] px-2 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white">
          {product.save}
        </span>
        <span className="absolute inset-x-0 bottom-0 z-20 bg-[#1c1c1c] py-3 text-center text-[12px] uppercase tracking-[0.18em] text-white opacity-0 transition-opacity group-hover:opacity-100">
          Choose options
        </span>
      </div>
      <div className="pt-4 text-center">
        <p className="min-h-10 text-[13px] leading-5 text-[#1c1c1c]">{product.name}</p>
        <p className="mt-2 text-[13px] text-[#df0029]">{product.price}</p>
        <p className="text-[12px] text-[#777] line-through">{product.regular}</p>
      </div>
    </Link>
  );
}

export default function Home() {
  const [homeContent, setHomeContent] = useState<any>(null);
  const [siteCms, setSiteCms] = useState<any>(null);
  const [dynamicLotus, setDynamicLotus] = useState<any[]>([]);
  const [dynamicLion, setDynamicLion] = useState<any[]>([]);

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const [{ data: cmsData }, { data: lotusData }, { data: lionData }] = await Promise.all([
          api.get('/cms/site'),
          api.get('/products?collection=lotus'),
          api.get('/products?collection=lion')
        ]);
        setSiteCms(cmsData);
        setHomeContent(cmsData.home);
        setDynamicLotus(lotusData);
        setDynamicLion(lionData);
      } catch (err) {
        console.error('Error fetching dynamic content', err);
      }
    };
    fetchHome();
  }, []);

  const slide = homeContent?.slides?.[0];
  const cmsCollections = homeContent?.collections || {};
  const featuredProducts = siteCms?.featuredProducts?.length ? siteCms.featuredProducts.map((product: any) => ({
    name: product.name,
    price: formatINR(product.discountPrice || product.price || 0),
    regular: product.discountPrice ? formatINR(product.price || 0) : '',
    save: product.discountPrice ? 'Featured' : 'New',
    image: product.image,
    images: product.images,
    href: `/products/${product._id}`,
  })) : null;
  const lotusRail = dynamicLotus.length ? dynamicLotus.map((product: any) => ({
    name: product.name,
    price: formatINR(product.discountPrice || product.price || 0),
    regular: product.discountPrice ? formatINR(product.price || 0) : '',
    save: product.discountPrice ? 'Sale' : product.isNewArrival ? 'New' : 'Featured',
    image: product.image,
    images: product.images,
    href: `/products/${product._id}`,
  })) : null;
  const lionRail = dynamicLion.length ? dynamicLion.map((product: any) => ({
    name: product.name,
    price: formatINR(product.discountPrice || product.price || 0),
    regular: product.discountPrice ? formatINR(product.price || 0) : '',
    save: product.discountPrice ? 'Sale' : product.isNewArrival ? 'New' : 'Featured',
    image: product.image,
    images: product.images,
    href: `/products/${product._id}`,
  })) : null;
  const cmsBlogs = siteCms?.blogs?.length ? siteCms.blogs : null;
  const liveCollections = siteCms?.collections?.length ? siteCms.collections : null;

  return (
    <div className="bg-white text-[#1c1c1c]">
      <section className="relative h-[72vh] min-h-[560px] overflow-hidden border-b border-[#dddddd]">
        {slide?.image ? (
          <img src={slide.image} alt={slide.title || 'Lotus & Lion'} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="hero-editorial absolute inset-0" />
        )}
        <div className="absolute inset-0 bg-[#1c1c1c]/20" />
        <button aria-label="Previous slide" className="absolute left-5 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center border border-white/50 text-white">
          <ChevronLeft size={20} />
        </button>
        <button aria-label="Next slide" className="absolute right-5 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center border border-white/50 text-white">
          <ChevronRight size={20} />
        </button>
        <div className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center text-white">
          <div className="max-w-4xl">
            <p className="mb-5 text-[13px] uppercase tracking-[0.32em]">{slide?.eyebrow || 'Online Exclusive Sale'}</p>
            <h1 className="text-3xl font-light uppercase tracking-[0.24em] md:text-7xl">{slide?.title || 'Lotus & Lion'}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7">
              {slide?.subtitle || 'Lotus Collections for women. Lion Collections for men. Original artist-led outfits for everyday and occasion wear.'}
            </p>
            <Link href={slide?.ctaLink || '/products'} className="mt-9 inline-flex bg-white px-12 py-4 text-[12px] uppercase tracking-[0.18em] text-[#1c1c1c] hover:bg-[#1c1c1c] hover:text-white">
              {slide?.ctaText || 'Shop Now'}
            </Link>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          <span className="h-1.5 w-8 bg-white" />
          <span className="h-1.5 w-8 bg-white/50" />
          <span className="h-1.5 w-8 bg-white/50" />
        </div>
      </section>

      <section id="journal" className="mx-auto max-w-[1440px] px-4 py-14 sm:px-8">
        <div className="mb-8 flex items-center justify-between">
          <button aria-label="Previous" className="grid h-10 w-10 place-items-center border border-[#dddddd]"><ChevronLeft size={18} /></button>
          <h2 className="brand-heading text-center text-2xl uppercase">Lotus Collections</h2>
          <button aria-label="Next" className="grid h-10 w-10 place-items-center border border-[#dddddd]"><ChevronRight size={18} /></button>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-6">
          {(lotusRail || []).slice(0, 4).map((product: any, index: number) => <ProductTile key={product.name} product={product} index={index} />)}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] space-y-10 px-4 py-8 sm:px-8">
        {(liveCollections || fallbackCollections).map((collection: any, index: number) => {
          const collectionKey = collection.key || (collection.title?.startsWith?.('Lotus') ? 'lotus' : collection.title?.startsWith?.('Lion') ? 'lion' : 'artist');
          const collectionHref = collection.key ? `/collections/${collection.key}` : collection.href;
          const collectionImage = collection.hero?.image || cmsCollections[collectionKey]?.image;
          return (
          <div key={collection._id || collection.title} className={`grid items-center gap-8 border-y border-[#dddddd] py-10 md:grid-cols-2 ${index % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}>
            <Link href={collectionHref} className="block">
              {collectionImage ? (
                <img
                  src={collectionImage}
                  alt={collection.title || collection.hero?.title}
                  className="aspect-[3/4] w-full object-cover"
                />
              ) : (
                <ArtPanel index={index} label={collection.subtitle || collection.hero?.eyebrow} />
              )}
            </Link>
            <div className="mx-auto max-w-xl text-center md:text-left">
              {(collectionKey === 'lotus' ? <Flower2 className="mb-5 inline-block" size={28} /> : collectionKey === 'lion' ? <Crown className="mb-5 inline-block" size={28} /> : <ShieldCheck className="mb-5 inline-block" size={28} />)}
              <h2 className="brand-heading text-3xl uppercase">{collection.title || collection.hero?.title}</h2>
              <p className="mt-5 text-[15px] leading-8 text-[#555]">{collection.description || collection.body || collection.hero?.subtitle}</p>
              <Link href={collectionHref} className="mt-7 inline-block border-b border-[#1c1c1c] pb-1 text-[12px] uppercase tracking-[0.18em]">
                View collection
              </Link>
            </div>
          </div>
        )})}
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-8">
        <div className="mb-8 flex items-center justify-between">
          <button aria-label="Previous" className="grid h-10 w-10 place-items-center border border-[#dddddd]"><ChevronLeft size={18} /></button>
          <h2 className="brand-heading text-center text-2xl uppercase">Lion Collections</h2>
          <button aria-label="Next" className="grid h-10 w-10 place-items-center border border-[#dddddd]"><ChevronRight size={18} /></button>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-6">
          {(lionRail || []).slice(0, 4).map((product: any, index: number) => <ProductTile key={product.name} product={product} index={index + 1} />)}
        </div>
      </section>

      {siteCms?.sections?.map((section: any) => (
        <section key={section._id || section.key} className="border-y border-[#dddddd] bg-white px-4 py-12 sm:px-8">
          <div className="mx-auto grid max-w-[1440px] items-center gap-8 md:grid-cols-2">
            {section.media?.image ? (
              <img src={section.media.image} alt={section.media.alt || section.title} className="aspect-[16/10] w-full object-cover" />
            ) : (
              <ArtPanel index={section.order || 0} label={section.type || 'CMS'} />
            )}
            <div className="max-w-xl">
              <p className="mb-3 text-[12px] uppercase tracking-[0.22em] text-[#df0029]">{section.eyebrow}</p>
              <h2 className="brand-heading text-3xl uppercase">{section.title}</h2>
              <p className="mt-5 text-[15px] leading-8 text-[#555]">{section.body || section.subtitle}</p>
              {section.ctas?.[0]?.href && (
                <Link href={section.ctas[0].href} className="mt-7 inline-block border-b border-[#1c1c1c] pb-1 text-[12px] uppercase tracking-[0.18em]">
                  {section.ctas[0].label || 'Explore'}
                </Link>
              )}
            </div>
          </div>
        </section>
      ))}

      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-8">
        <h2 className="brand-heading mb-8 text-center text-2xl uppercase">Studio Journal</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {(cmsBlogs || journals).slice(0, 3).map((entry: any, index: number) => (
            <article key={entry._id || entry}>
              <ArtPanel index={index} label="Journal" />
              <p className="mt-5 text-[12px] uppercase tracking-[0.14em] text-[#777]">{entry.category || 'artist wardrobe notes'}</p>
              <h3 className="mt-2 brand-heading text-xl uppercase">{entry.title || entry}</h3>
              <p className="mt-3 text-sm leading-7 text-[#555]">{entry.excerpt || 'Original editorial notes about line, movement, fabric, and practical styling for studio-born clothing.'}</p>
              <Link href={entry.slug ? `/blog/${entry.slug}` : '/heritage'} className="mt-4 inline-block border-b border-[#1c1c1c] pb-1 text-[12px] uppercase tracking-[0.18em]">
                Read more
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#dddddd] bg-[#f7f7f7] px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-5xl space-y-6 text-[15px] leading-8 text-[#444]">
          <h2 className="brand-heading text-3xl uppercase text-[#1c1c1c]">Original Fashion With A Studio Soul.</h2>
          <p>Lotus & Lion is an original clothing store concept built around two symbols: Lotus for expressive womenswear and Lion for composed menswear. Every page, panel, label, and visual on this storefront is custom-made for the brand.</p>
          <h3 className="brand-heading text-2xl uppercase text-[#1c1c1c]">Artist Outfits, Not Copied Catalogues</h3>
          <p>The collection language is inspired by atelier practice: brushline panels, gallery neutrals, strong red accents, and clean product cards that support real buying flows.</p>
          <div className="pt-3 text-sm">
            <strong className="uppercase tracking-[0.14em] text-[#1c1c1c]">Popular Searches</strong>
            <p className="mt-3 leading-8">
              {searches.map((item, index) => (
                <span key={item}>
                  <Link href="/products" className="hover:text-[#df0029]">{item}</Link>
                  {index < searches.length - 1 ? ' | ' : ''}
                </span>
              ))}
            </p>
          </div>
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
