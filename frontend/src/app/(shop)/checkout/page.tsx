'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { CreditCard, Truck, ShieldCheck, ArrowRight } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, userInfo, clearCart } = useStore();
  
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  useEffect(() => {
    if (!userInfo) {
      router.push('/login?redirect=/checkout');
    }
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, [userInfo, cartItems, router]);

  const placeOrderHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderData = {
        orderItems: cartItems,
        shippingAddress: { address, city, postalCode, country },
        paymentMethod: 'Stripe',
        itemsPrice: subtotal,
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: subtotal,
      };
      
      const { data } = await api.post('/orders', orderData);
      toast.success('Order placed successfully');
      clearCart();
      router.push(`/orders/${data._id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold uppercase tracking-tight mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <form onSubmit={placeOrderHandler} className="space-y-12">
              {/* Shipping section */}
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black font-bold text-xs">1</div>
                  <h2 className="text-xl font-bold uppercase tracking-wider">Shipping Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Street Address</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">City</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Postal Code</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Country</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>
                </div>
              </section>

              {/* Payment section */}
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black font-bold text-xs">2</div>
                  <h2 className="text-xl font-bold uppercase tracking-wider">Payment Method</h2>
                </div>
                <div className="border border-primary bg-primary/5 p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <CreditCard className="w-6 h-6 text-primary" />
                    <span className="text-sm font-bold uppercase tracking-widest">Stripe Secure Payment</span>
                  </div>
                  <div className="flex gap-2">
                     <div className="w-8 h-5 bg-gray-200 rounded" />
                     <div className="w-8 h-5 bg-gray-200 rounded" />
                  </div>
                </div>
              </section>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black dark:bg-white text-white dark:text-black py-5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-primary dark:hover:bg-primary transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Place Secure Order'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-secondary dark:bg-[#111] p-8 border border-border">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-8">Order Review</h2>
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2 mb-8">
                {cartItems.map((item) => (
                  <div key={item.product} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-12 h-16 object-cover bg-white" />
                    <div className="flex-grow">
                      <h4 className="text-[10px] font-bold uppercase tracking-wide truncate w-32">{item.name}</h4>
                      <p className="text-[10px] text-gray-500 uppercase">Qty: {item.qty}</p>
                      <p className="text-[10px] font-bold text-primary">${(item.qty * item.price).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-8 border-t border-border space-y-4">
                <div className="flex justify-between text-xs tracking-widest uppercase font-bold">
                  <span>Total</span>
                  <span className="text-primary text-lg">${subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[10px] text-gray-500 uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                SSL Encrypted Connection
              </div>
              <div className="flex items-center gap-3 text-[10px] text-gray-500 uppercase tracking-widest">
                <Truck className="w-4 h-4 text-primary" />
                Insured Global Shipping
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
