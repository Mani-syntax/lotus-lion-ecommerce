'use client';

import { useStore } from '@/store/useStore';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { formatINR } from '@/lib/currency';
import api from '@/lib/api';

type CartAvailability = {
  available: boolean;
  stock: number;
  message?: string;
};

export default function CartPage() {
  const { cartItems, removeFromCart, addToCart } = useStore();
  const [availability, setAvailability] = useState<Record<string, CartAvailability>>({});
  const [checkingStock, setCheckingStock] = useState(true);
  const safeCartItems = useMemo(() => Array.isArray(cartItems) ? cartItems : [], [cartItems]);

  useEffect(() => {
    let mounted = true;

    const checkCartStock = async () => {
      if (safeCartItems.length === 0) {
        setAvailability({});
        setCheckingStock(false);
        return;
      }

      setCheckingStock(true);
      const results = await Promise.all(
        safeCartItems.map(async (item) => {
          try {
            const { data } = await api.get(`/products/${item.product}`);
            const stock = Number(data.countInStock ?? data.stock_quantity ?? 0);
            const requestedQty = Number(item.qty) || 0;
            return [item.product, {
              available: stock > 0 && stock >= requestedQty,
              stock,
              message: stock <= 0 ? 'Out of stock' : stock < requestedQty ? `Only ${stock} left` : undefined,
            }] as const;
          } catch {
            return [item.product, {
              available: false,
              stock: 0,
              message: 'No longer available',
            }] as const;
          }
        })
      );

      if (mounted) {
        setAvailability(Object.fromEntries(results));
        setCheckingStock(false);
      }
    };

    checkCartStock();
    return () => {
      mounted = false;
    };
  }, [safeCartItems]);

  const unavailableItems = safeCartItems.filter((item) => availability[item.product]?.available === false);
  const canCheckout = !checkingStock && unavailableItems.length === 0;
  const subtotal = safeCartItems.reduce((acc, item) => {
    if (availability[item.product]?.available === false) return acc;
    return acc + (Number(item.qty) || 0) * (Number(item.price) || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold uppercase tracking-tight mb-12">Your Bag</h1>

        {safeCartItems.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-border">
            <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-6" />
            <p className="text-gray-500 uppercase tracking-widest mb-8">Your bag is empty.</p>
            <Link
              href="/products"
              className="inline-block bg-black dark:bg-white text-white dark:text-black px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-primary dark:hover:bg-primary transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-8">
              {safeCartItems.map((item) => (
                <div key={item.product} className={`flex gap-6 pb-8 border-b border-border ${availability[item.product]?.available === false ? 'opacity-70' : ''}`}>
                  <div className="w-24 h-32 md:w-32 md:h-44 bg-secondary flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-grow flex flex-col justify-between py-2">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm font-bold uppercase tracking-wide">{item.name}</h3>
                        <button
                          onClick={() => removeFromCart(item.product)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-primary font-medium tracking-widest">{formatINR(item.price)}</p>
                      {availability[item.product]?.available === false && (
                        <p className="mt-2 inline-block bg-red-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-red-600">
                          {availability[item.product]?.message || 'Out of stock'}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => addToCart({ ...item, qty: Math.max(1, item.qty - 1) })}
                          disabled={availability[item.product]?.available === false}
                          className="px-3 py-1 hover:bg-secondary transition-colors border-r border-border text-xs"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 text-xs font-medium">{item.qty}</span>
                        <button
                          onClick={() => addToCart({ ...item, countInStock: availability[item.product]?.stock ?? item.countInStock, qty: Math.min(availability[item.product]?.stock ?? item.countInStock, item.qty + 1) })}
                          disabled={availability[item.product]?.available === false}
                          className="px-3 py-1 hover:bg-secondary transition-colors border-l border-border text-xs"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm font-bold tracking-widest uppercase">
                        {formatINR(item.qty * item.price)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-secondary dark:bg-[#111] p-8 h-fit border border-border">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-8">Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-xs tracking-widest uppercase">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs tracking-widest uppercase">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-green-600">Complimentary</span>
                </div>
                <div className="pt-4 border-t border-border flex justify-between font-bold text-sm tracking-widest uppercase">
                  <span>Total</span>
                  <span className="text-primary">{formatINR(subtotal)}</span>
                </div>
              </div>
              {unavailableItems.length > 0 && (
                <p className="mb-6 bg-red-50 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-red-600">
                  Remove unavailable or out-of-stock products before checkout.
                </p>
              )}
              <Link
                href="/checkout"
                aria-disabled={!canCheckout}
                onClick={(e) => {
                  if (!canCheckout) e.preventDefault();
                }}
                className={`w-full py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                  canCheckout
                    ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-primary dark:hover:bg-primary'
                    : 'pointer-events-none bg-gray-300 text-gray-500'
                }`}
              >
                {checkingStock ? 'Checking Stock...' : 'Checkout'}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="mt-6 text-[10px] text-center text-gray-500 uppercase tracking-widest">
                Prices include all applicable taxes and duties.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
