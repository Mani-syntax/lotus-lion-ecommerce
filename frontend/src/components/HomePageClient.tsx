'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Crown, Flower2, Headphones, RefreshCcw, ShieldCheck, Truck } from 'lucide-react';
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

const collectionUrlByKey: Record<string, string> = {
  lotus: '/collections/lotus',
  lion: '/collections/lion',
  artist: '/products?category=Artist%20Outfits',
};

type HomeCollection = {
  slug?: string;
  name?: string;
  title?: string;
  href?: string;
  description?: string;
  body?: string;
  banner_url?: string;
  hero?: {
    image?: string;
    title?: string;
    subtitle?: string;
  };
};

type HomeProduct = {
  _id: string;
  id?: string;
  name: string;
  slug?: string;
  price: number;
  discountPrice?: number;
  image: string;
  brand: string;
  category: string;
  collectionType?: 'lotus' | 'lion' | 'artist';
  countInStock: number;
  images?: (string | { image_url: string })[];
};

type HomeCms = {
  home?: {
    slides?: unknown[];
  };
  lotusProducts?: HomeProduct[];
  lionProducts?: HomeProduct[];
  collections?: HomeCollection[];
};

function ProductRail({ title, href, products }: { title: string; href: string; products: HomeProduct[] }) {
  const railRef = useRef<HTMLDivElement>(null);

  const scrollRail = (direction: 'previous' | 'next') => {
    const rail = railRef.current;
    if (!rail) return;
    const amount = Math.min(rail.clientWidth * 0.9, 900);
    rail.scrollBy({ left: direction === 'next' ? amount : -amount, behavior: 'smooth' });
  };

  if (!products.length) return null;

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto mb-8 flex max-w-[1440px] items-center justify-between px-4 sm:px-8">
        <button
          type="button"
          onClick={() => scrollRail('previous')}
          className="grid h-12 w-12 place-items-center rounded-full border border-[#dddddd] bg-white transition hover:bg-[#f7f7f7]"
          aria-label={`Previous ${title} products`}
        >
          <ChevronLeft size={19} />
        </button>
        <Link href={href} className="brand-heading text-center text-2xl uppercase hover:underline sm:text-4xl">
          {title}
        </Link>
        <button
          type="button"
          onClick={() => scrollRail('next')}
          className="grid h-12 w-12 place-items-center rounded-full border border-[#dddddd] bg-white transition hover:bg-[#f7f7f7]"
          aria-label={`Next ${title} products`}
        >
          <ChevronRight size={19} />
        </button>
      </div>

      <div
        ref={railRef}
        className="product-rail flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 sm:gap-7 sm:px-8 lg:px-[5vw]"
      >
        {products.map((product: HomeProduct, index: number) => (
          <div
            key={product.id || product._id || index}
            className="w-[82vw] flex-none snap-start sm:w-[54vw] md:w-[38vw] lg:w-[30vw] xl:w-[29vw] 2xl:w-[28vw]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}

function getCollectionKey(collection: HomeCollection) {
  const source = `${collection?.slug || ''} ${collection?.name || ''} ${collection?.title || ''}`.toLowerCase();
  if (source.includes('lotus')) return 'lotus';
  if (source.includes('lion')) return 'lion';
  if (source.includes('artist')) return 'artist';
  return collection?.slug || '';
}

function getCollectionHref(collection: HomeCollection) {
  const key = getCollectionKey(collection);
  if (collectionUrlByKey[key]) return collectionUrlByKey[key];
  if (collection?.slug) return `/collections/${collection.slug}`;
  return collection?.href || '/products';
}

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



export default function HomePageClient({ initialData }: { initialData: HomeCms | null }) {
  const [siteCms] = useState<HomeCms>(initialData || {});
  
  const homeContent = {
    slides: siteCms?.home?.slides || [{ title: 'Lotus & Lion', subtitle: 'Modern luxury clothing.', eyebrow: 'Online Exclusive' }],
    lotusProducts: siteCms?.lotusProducts || [],
    lionProducts: siteCms?.lionProducts || [],
    collections: siteCms?.collections || []
  };

  const lotusRail = homeContent.lotusProducts || [];
  const lionRail = homeContent.lionProducts || [];

  const liveCollections = siteCms.collections?.length ? siteCms.collections : null;

  return (
    <div className="bg-white text-[#1c1c1c]">
      <HeroSlider slides={homeContent.slides} />

      <ProductRail title="Lotus Collections" href="/collections/lotus" products={lotusRail.slice(0, 8)} />

      <section className="mx-auto max-w-[1440px] space-y-10 px-4 py-8 sm:px-8">
        {(liveCollections || fallbackCollections).map((collection: HomeCollection, index: number) => {
          const collectionKey = getCollectionKey(collection);
          const collectionHref = getCollectionHref(collection);
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

      <ProductRail title="Lion Collections" href="/collections/lion" products={lionRail.slice(0, 8)} />

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
