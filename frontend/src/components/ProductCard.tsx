'use client';

import Link from 'next/link';
import type { MouseEvent } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useStore } from '@/store/useStore';
import toast from 'react-hot-toast';
import { formatINR } from '@/lib/currency';

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  image: string;
  brand: string;
  category: string;
  collectionType?: 'lotus' | 'lion' | 'artist';
  countInStock: number;
}

const ProductCard = ({ product }: { product: Product }) => {
  const addToCart = useStore((state) => state.addToCart);
  const regularPrice = product.discountPrice && product.discountPrice > product.price ? product.discountPrice : null;
  const savings = regularPrice ? Math.round(((regularPrice - product.price) / regularPrice) * 100) : 30;

  const handleAddToCart = (e: MouseEvent) => {
    e.preventDefault();
    addToCart({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
      qty: 1,
    });
    toast.success('Added to bag');
  };

  return (
    <Link href={`/products/${product._id}`} className="group block bg-white text-[#1c1c1c]">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f7f7f7]">
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="atelier-visual h-full w-full transition-transform duration-500 group-hover:scale-105" aria-label={product.name} />
        )}
        {product.countInStock === 0 ? (
          <span className="absolute left-3 top-3 bg-[#efefef] px-2 py-1 text-[11px] uppercase tracking-[0.08em] text-[#1c1c1c]">
            Sold Out
          </span>
        ) : (
          <span className="absolute left-3 top-3 bg-[#df0029] px-2 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white">
            Save {savings}%
          </span>
        )}
        <button
          onClick={handleAddToCart}
          disabled={product.countInStock === 0}
          className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-[#1c1c1c] py-3 text-[12px] uppercase tracking-[0.18em] text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:bg-[#777]"
        >
          <ShoppingBag size={14} />
          Choose options
        </button>
      </div>

      <div className="pt-4 text-center">
        <p className="text-[13px] leading-5">{product.name}</p>
        <p className="mt-2 text-[13px] text-[#df0029]">{formatINR(product.price)}</p>
        {regularPrice && <p className="text-[12px] text-[#777] line-through">{formatINR(regularPrice)}</p>}
      </div>
    </Link>
  );
};

export default ProductCard;
