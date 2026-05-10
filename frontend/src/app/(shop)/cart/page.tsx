'use client';

import { useStore } from '@/store/useStore';
import Link from 'next/link';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { formatINR } from '@/lib/currency';

export default function CartPage() {
  const { cartItems, removeFromCart, addToCart } = useStore();
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  const subtotal = safeCartItems.reduce((acc, item) => acc + (Number(item.qty) || 0) * (Number(item.price) || 0), 0);

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
                <div key={item.product} className="flex gap-6 pb-8 border-b border-border">
                  <div className="w-24 h-32 md:w-32 md:h-44 bg-secondary flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
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
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => addToCart({ ...item, qty: Math.max(1, item.qty - 1) })}
                          className="px-3 py-1 hover:bg-secondary transition-colors border-r border-border text-xs"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 text-xs font-medium">{item.qty}</span>
                        <button
                          onClick={() => addToCart({ ...item, qty: Math.min(item.countInStock, item.qty + 1) })}
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
              <Link
                href="/checkout"
                className="w-full bg-black dark:bg-white text-white dark:text-black py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-primary dark:hover:bg-primary transition-all flex items-center justify-center gap-2"
              >
                Checkout
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
