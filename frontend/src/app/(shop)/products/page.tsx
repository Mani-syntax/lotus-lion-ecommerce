'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  image: string;
  brand: string;
  category: string;
  collectionType: 'lotus' | 'lion' | 'artist';
  countInStock: number;
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams();
        const category = searchParams.get('category');
        const collectionType = searchParams.get('collectionType');
        if (category) params.set('category', category);
        if (collectionType) params.set('collectionType', collectionType);
        const { data } = await api.get(`/products${params.toString() ? `?${params.toString()}` : ''}`);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white py-10 text-[#1c1c1c]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl uppercase tracking-[0.18em]">All Collections</h1>
          <p className="mt-3 text-sm text-[#666]">Refined essentials, dresses, sets, and occasion wear.</p>
        </div>

        <div className="mb-8 flex flex-col justify-between gap-4 border-y border-[#dddddd] py-4 md:flex-row md:items-center">
          <button className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.18em]">
            <SlidersHorizontal size={16} />
            Filter
          </button>
          <div className="flex items-center gap-6">
            <span className="text-[12px] uppercase tracking-[0.18em] text-[#666]">{products.length} products</span>
            <button className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.18em]">
              Sort by
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-[#f7f7f7]" />
                <div className="mx-auto mt-4 h-4 w-2/3 bg-[#f7f7f7]" />
                <div className="mx-auto mt-2 h-4 w-1/3 bg-[#f7f7f7]" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="py-24 text-center">
            <p className="uppercase tracking-[0.18em] text-[#666]">No products found in this collection.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white py-24 text-center uppercase tracking-[0.18em] text-[#666]">Loading collection...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
