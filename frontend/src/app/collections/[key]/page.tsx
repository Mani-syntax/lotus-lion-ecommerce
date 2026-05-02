'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';

export default function DynamicCollectionPage() {
  const { key } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/cms/collections/${key}`).then((response) => setData(response.data)).finally(() => setLoading(false));
  }, [key]);

  if (loading) return <div className="min-h-screen bg-white py-24 text-center uppercase tracking-[0.18em] text-[#777]">Loading collection...</div>;
  if (!data?.collection) return <div className="min-h-screen bg-white py-24 text-center uppercase tracking-[0.18em] text-[#777]">Collection not found</div>;

  const { collection, products } = data;

  return (
    <main className="bg-white text-[#1c1c1c]">
      <section className="relative min-h-[520px] border-b border-[#dddddd]">
        {collection.hero?.image ? <img src={collection.hero.image} alt={collection.title} className="absolute inset-0 h-full w-full object-cover" /> : <div className="hero-editorial absolute inset-0" />}
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 mx-auto flex min-h-[520px] max-w-4xl flex-col items-center justify-center px-6 text-center text-white">
          <p className="text-[12px] uppercase tracking-[0.28em]">{collection.hero?.eyebrow || collection.subtitle}</p>
          <h1 className="brand-heading mt-5 text-5xl uppercase md:text-7xl">{collection.hero?.title || collection.title}</h1>
          <p className="mt-6 max-w-2xl text-sm leading-7">{collection.hero?.subtitle || collection.description}</p>
          <Link href={collection.hero?.ctaLink || `/products?collectionType=${key}`} className="mt-9 bg-white px-10 py-4 text-[12px] uppercase tracking-[0.18em] text-[#1c1c1c]">{collection.hero?.ctaText || 'Shop All'}</Link>
        </div>
      </section>
      {!!collection.homepageSections?.length && (
        <section className="mx-auto max-w-[1440px] space-y-8 px-4 py-12 sm:px-8">
          {collection.homepageSections.filter((section: any) => section.isEnabled !== false).sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map((section: any) => (
            <div key={section._id || `${section.title}-${section.order}`} className="grid items-center gap-8 border-y border-[#dddddd] py-10 md:grid-cols-2">
              {section.image ? <img src={section.image} alt={section.title} className="aspect-[3/4] w-full object-cover" /> : <div className="atelier-visual aspect-[3/4]" />}
              <div className="max-w-xl">
                <h2 className="brand-heading text-3xl uppercase">{section.title}</h2>
                <p className="mt-5 text-[15px] leading-8 text-[#555]">{section.body}</p>
                {section.link && <Link href={section.link} className="mt-6 inline-block border-b border-[#1c1c1c] pb-1 text-[12px] uppercase tracking-[0.18em]">Explore</Link>}
              </div>
            </div>
          ))}
        </section>
      )}
      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-8">
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
          {products.map((product: any) => <ProductCard key={product._id} product={product} />)}
        </div>
      </section>
    </main>
  );
}
