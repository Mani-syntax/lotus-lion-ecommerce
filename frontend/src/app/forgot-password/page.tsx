'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success('Password reset instructions queued');
    setEmail('');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <Link href="/login" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-primary mb-10">
          <ArrowLeft size={14} /> Back To Sign In
        </Link>
        <div className="mb-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-4">Account Recovery</p>
          <h1 className="text-3xl font-bold uppercase tracking-tight text-white mb-3">Reset Password</h1>
          <p className="text-sm text-gray-400 leading-6">
            Enter your account email and the storefront will show a clear confirmation while backend email delivery is connected.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-400">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors tracking-wide"
            />
          </div>
          <button className="w-full bg-white text-black py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-primary transition-all flex items-center justify-center gap-2">
            <Mail size={16} /> Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}
