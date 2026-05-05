'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAdminData } from '@/hooks/useAdminData';
import AdminHeader from '@/components/admin/AdminHeader';
import ImageUploader from '@/components/admin/ImageUploader';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { Save, X, Package, Tag, DollarSign, Layers, Calendar, Star, Eye, Zap, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProductFormPage() {
  const router = useRouter();
  const { id } = useParams();
  const isNew = id === 'new';
  
  const { data: product, loading } = useAdminData(isNew ? '' : `/admin/products/${id}`);
  
  const [formData, setFormData] = useState<any>({
    name: '',
    description: '',
    price: 0,
    discountPrice: 0,
    category: 'Lotus Collections',
    collection: 'lotus',
    collectionType: 'lotus',
    countInStock: 0,
    sizes: { S: 0, M: 0, L: 0, XL: 0 },
    isFeatured: false,
    isVisible: true,
    isPublished: true,
    flashSale: false,
    releaseDate: '',
    tags: [],
    image: '',
    images: [],
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product && !isNew) {
      setFormData({
        ...product,
        releaseDate: product.releaseDate ? new Date(product.releaseDate).toISOString().split('T')[0] : '',
      });
    }
  }, [product, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) {
        await api.post('/admin/products', formData);
        toast.success('Product created successfully');
      } else {
        await api.put(`/admin/products/${id}`, formData);
        toast.success('Product updated successfully');
      }
      router.push('/admin/products');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error saving product');
    } finally {
      setSaving(false);
    }
  };

  const updateSize = (size: string, qty: number) => {
    setFormData({
      ...formData,
      sizes: { ...formData.sizes, [size]: qty },
      countInStock: Object.values({ ...formData.sizes, [size]: qty }).reduce((a: any, b: any) => a + b, 0)
    });
  };

  if (loading && !isNew) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  return (
    <div className="space-y-12 pb-24">
      <div className="flex items-center justify-between">
        <AdminHeader 
          title={isNew ? "New Creation" : "Edit Piece"} 
          subtitle={isNew ? "Add a new luxury item to your catalog." : `Refining ${product?.name}`} 
        />
        <div className="flex gap-4">
           <button 
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:bg-white/5 transition-all"
           >
             Discard
           </button>
           <button 
            onClick={handleSubmit}
            disabled={saving}
            className="bg-primary text-black px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-primary-hover transition-all"
           >
             {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
             {isNew ? 'Publish Piece' : 'Commit Changes'}
           </button>
        </div>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-8" onSubmit={handleSubmit}>
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
           <section className="bg-[#111] border border-white/5 rounded-2xl p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-lg"><Package size={20} /></div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-white">Product Identity</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs focus:border-primary outline-none text-white font-bold"
                    placeholder="e.g. Signature Oversized Hoodie"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Description (HTML Content)</label>
                  <RichTextEditor 
                    content={formData.description}
                    onChange={(html) => setFormData({...formData, description: html})}
                  />
                </div>
              </div>
           </section>

           <section className="bg-[#111] border border-white/5 rounded-2xl p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 text-red-500 rounded-lg"><Tag size={20} /></div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-white">Collection Path</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Store Collection</label>
                  <select
                    value={formData.collection}
                    onChange={(e) => {
                      const type = e.target.value;
                      setFormData({
                        ...formData,
                        collection: type,
                        collectionType: type,
                        category: type === 'lotus' ? 'Lotus Collections' : 'Lion Collections',
                      });
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs focus:border-primary outline-none"
                  >
                    <option value="lotus">Lotus Collection</option>
                    <option value="lion">Lion Collection</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Category Label</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs focus:border-primary outline-none"
                  />
                </div>
              </div>
           </section>

           <section className="bg-[#111] border border-white/5 rounded-2xl p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Layers size={20} /></div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-white">Visual Assets</h2>
              </div>
              <ImageUploader 
                existingImages={formData.images.length > 0 ? formData.images : (formData.image ? [formData.image] : [])}
                onUpload={(urls) => setFormData({...formData, images: urls, image: urls[0]})}
                folder={`lotus-lion/products/${formData.collectionType}`}
              />
           </section>

           <section className="bg-[#111] border border-white/5 rounded-2xl p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg"><Zap size={20} /></div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-white">Size-Specific Inventory</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                 {['S', 'M', 'L', 'XL'].map((size) => (
                   <div key={size} className="space-y-2 p-4 bg-white/5 rounded-xl border border-white/5">
                      <label className="text-[10px] uppercase font-bold text-gray-500 block text-center">Size {size}</label>
                      <input 
                        type="number" 
                        value={formData.sizes[size] || 0}
                        onChange={(e) => updateSize(size, Number(e.target.value))}
                        className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-center text-xs font-bold focus:border-primary outline-none"
                      />
                   </div>
                 ))}
              </div>
           </section>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-8">
           <section className="bg-[#111] border border-white/5 rounded-2xl p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 text-green-500 rounded-lg"><DollarSign size={20} /></div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-white">Pricing (INR)</h2>
              </div>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-gray-500">Base Price (INR)</label>
                    <input 
                      type="number" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs focus:border-primary outline-none"
                      required
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-gray-500">Sale Price (INR)</label>
                    <input 
                      type="number" 
                      value={formData.discountPrice}
                      onChange={(e) => setFormData({...formData, discountPrice: Number(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs focus:border-primary outline-none text-primary"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-gray-500">Total Stock (Auto-calculated)</label>
                    <input 
                      type="number" 
                      value={formData.countInStock}
                      onChange={(e) => setFormData({...formData, countInStock: Number(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs focus:border-primary outline-none text-blue-400 font-bold"
                    />
                    <p className="text-[8px] text-gray-600 uppercase font-bold leading-relaxed">
                      Auto-updated from size inventory. Override manually if needed.
                    </p>
                 </div>
              </div>
           </section>

           <section className="bg-[#111] border border-white/5 rounded-2xl p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg"><Star size={20} /></div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-white">Visibility & Flags</h2>
              </div>
              <div className="space-y-4">
                 <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2">
                       <Star size={14} className={formData.isFeatured ? 'text-yellow-500' : 'text-gray-600'} />
                       <span className="text-[10px] font-bold uppercase text-gray-400">Featured Piece</span>
                    </div>
                    <input type="checkbox" className="hidden" checked={formData.isFeatured} onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})} />
                    <div className={`w-10 h-5 rounded-full transition-all relative ${formData.isFeatured ? 'bg-yellow-500' : 'bg-white/10'}`}>
                       <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${formData.isFeatured ? 'right-0.5' : 'left-0.5'}`} />
                    </div>
                 </label>

                 <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2">
                       <Eye size={14} className={formData.isVisible ? 'text-green-500' : 'text-gray-600'} />
                       <span className="text-[10px] font-bold uppercase text-gray-400">Public Visibility</span>
                    </div>
                    <input type="checkbox" className="hidden" checked={formData.isVisible} onChange={(e) => setFormData({...formData, isVisible: e.target.checked, isPublished: e.target.checked})} />
                    <div className={`w-10 h-5 rounded-full transition-all relative ${formData.isVisible ? 'bg-green-500' : 'bg-white/10'}`}>
                       <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${formData.isVisible ? 'right-0.5' : 'left-0.5'}`} />
                    </div>
                 </label>

                 <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2">
                       <Zap size={14} className={formData.flashSale ? 'text-primary' : 'text-gray-600'} />
                       <span className="text-[10px] font-bold uppercase text-gray-400">Flash Sale Active</span>
                    </div>
                    <input type="checkbox" className="hidden" checked={formData.flashSale} onChange={(e) => setFormData({...formData, flashSale: e.target.checked})} />
                    <div className={`w-10 h-5 rounded-full transition-all relative ${formData.flashSale ? 'bg-primary' : 'bg-white/10'}`}>
                       <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${formData.flashSale ? 'right-0.5' : 'left-0.5'}`} />
                    </div>
                 </label>
              </div>
           </section>

           <section className="bg-[#111] border border-white/5 rounded-2xl p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg"><Calendar size={20} /></div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-white">Schedule Drop</h2>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-500">Release Date/Time</label>
                <input 
                  type="date" 
                  value={formData.releaseDate}
                  onChange={(e) => setFormData({...formData, releaseDate: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs focus:border-primary outline-none"
                />
                <p className="text-[8px] text-gray-600 uppercase font-bold leading-relaxed mt-2">
                  System will automatically publish this piece at the specified date.
                </p>
              </div>
           </section>
        </div>
      </form>
    </div>
  );
}
