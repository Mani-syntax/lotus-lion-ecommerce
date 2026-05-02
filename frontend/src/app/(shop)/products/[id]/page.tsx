'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useStore } from '@/store/useStore';
import { ShoppingBag, ChevronRight, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  countInStock: number;
  category: string;
  collectionType?: 'lotus' | 'lion' | 'artist';
  description: string;
  images?: string[];
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const addToCart = useStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
      qty,
    });
    toast.success('Added to bag');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center uppercase tracking-widest text-xs">Preparing the piece...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center uppercase tracking-widest text-xs">Piece not found.</div>;

  return (
    <div className="min-h-screen bg-white py-12 text-[#1c1c1c] md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-12">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-primary">Collection</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#1c1c1c]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Image Gallery */}
          <div className="space-y-4">
             <div className="relative aspect-[4/5] overflow-hidden bg-[#f7f7f7]">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="atelier-visual h-full w-full">
                    <div className="absolute inset-x-10 bottom-10 z-10 border border-[#1c1c1c] bg-white/80 p-5 text-center">
                      <p className="brand-heading text-xl uppercase">{product.name}</p>
                    </div>
                  </div>
                )}
             </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <span className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-4">{product.category}</span>
            <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-6">{product.name}</h1>
            <p className="text-2xl font-medium tracking-widest text-primary mb-8">${product.price.toFixed(2)}</p>
            
            <p className="mb-12 max-w-lg text-sm leading-relaxed text-[#555] italic">
              "{product.description}"
            </p>

            {/* Quantity Selector */}
            {product.countInStock > 0 && (
              <div className="mb-8">
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-4">Quantity</label>
                <div className="flex items-center border border-border w-fit">
                  <button 
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-4 py-2 hover:bg-secondary transition-colors border-r border-border"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 text-sm font-medium">{qty}</span>
                  <button 
                    onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                    className="px-4 py-2 hover:bg-secondary transition-colors border-l border-border"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4 mb-12">
              <button
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
                className="flex w-full items-center justify-center gap-3 bg-[#1c1c1c] py-5 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-[#df0029] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" />
                {product.countInStock > 0 ? 'Add to Bag' : 'Sold Out'}
              </button>
            </div>

            {/* Product Meta */}
            <div className="border-t border-border pt-8 grid grid-cols-1 gap-6">
              <div className="flex items-center gap-4">
                <Truck className="w-5 h-5 text-primary" />
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest">Complimentary Shipping</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">On all orders above $500</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest">Authenticity Guaranteed</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">Certificate included with every piece</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <RefreshCw className="w-5 h-5 text-primary" />
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest">Returns</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">14-day boutique returns policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
