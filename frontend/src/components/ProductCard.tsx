'use client';

import Link from 'next/link';
import type { MouseEvent } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useStore } from '@/store/useStore';
import toast from 'react-hot-toast';
import { formatINR } from '@/lib/currency';
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
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
}

const ProductCard = ({ product }: { product: Product }) => {
  const addToCart = useStore((state) => state.addToCart);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const images = useMemo(() => {
    const gallery = product.images && product.images.length > 0 ? product.images : [product.image];
    return gallery
      .map((img) => (typeof img === 'string' ? img : img?.image_url))
      .filter(Boolean);
  }, [product.image, product.images]);

  useEffect(() => {
    if (images.length < 2) return;
    const timer = window.setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % images.length);
    }, 3400);
    return () => window.clearInterval(timer);
  }, [images.length]);

  const currentPrice = product.discountPrice ? product.discountPrice : product.price;
  const regularPrice = product.discountPrice ? product.price : null;
  const savings = regularPrice ? Math.round(((regularPrice - currentPrice) / regularPrice) * 100) : 0;
  const productIdentifier = product.slug || product.id || product._id;
  const productHref = productIdentifier ? `/product/${productIdentifier}` : '/products';
  const activeImageIndex = images.length ? currentImageIdx % images.length : 0;

  const handleAddToCart = (e: MouseEvent) => {
    e.preventDefault();
    addToCart({
      product: productIdentifier,
      name: product.name,
      image: product.image,
      price: currentPrice,
      countInStock: product.countInStock,
      qty: 1,
    });
    toast.success('Added to bag');
  };

  return (
    <Link href={productHref} className="group block bg-white text-[#1c1c1c]">
      <div className="group/card relative aspect-[4/5] overflow-hidden bg-[#f7f7f7]">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImageIndex}
            src={images[activeImageIndex] || 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=1000'}
            alt={product.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                }}
                aria-label="Previous product image"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow-sm transition hover:bg-white"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                }}
                aria-label="Next product image"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow-sm transition hover:bg-white"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="absolute inset-x-0 bottom-12 flex justify-center gap-1.5 opacity-0 transition-opacity group-hover/card:opacity-100">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 w-1.5 rounded-full transition-all ${
                    activeImageIndex === idx ? 'bg-primary w-3' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
        {product.countInStock === 0 ? (
          <span className="absolute left-3 top-3 bg-[#efefef] px-2 py-1 text-[11px] uppercase tracking-[0.08em] text-[#1c1c1c]">
            Out of Stock
          </span>
        ) : product.countInStock <= 5 ? (
          <span className="absolute left-3 top-3 bg-[#ff9900] px-2 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white">
            Only {product.countInStock} Left
          </span>
        ) : savings > 0 ? (
          <span className="absolute left-3 top-3 bg-[#df0029] px-2 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white">
            Save {savings}%
          </span>
        ) : null}
        <button
          onClick={handleAddToCart}
          disabled={product.countInStock === 0}
          className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-[#1c1c1c] py-3 text-[12px] uppercase tracking-[0.18em] text-white opacity-0 transition-opacity group-hover/card:opacity-100 disabled:bg-[#777]"
        >
          <ShoppingBag size={14} />
          Choose options
        </button>
      </div>

      <div className="pt-4 text-center">
        <p className="text-[13px] leading-5">{product.name}</p>
        <p className="mt-2 text-[13px] text-[#df0029]">{formatINR(currentPrice)}</p>
        {regularPrice && <p className="text-[12px] text-[#777] line-through">{formatINR(regularPrice)}</p>}
      </div>
    </Link>
  );
};

export default ProductCard;
