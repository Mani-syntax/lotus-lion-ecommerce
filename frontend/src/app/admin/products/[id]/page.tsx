'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminData } from '@/hooks/useAdminData';
import AdminHeader from '@/components/admin/AdminHeader';
import ImageUploader from '@/components/admin/ImageUploader';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { Save, Package, Tag, DollarSign, Layers, Calendar, Star, Eye, Zap, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProductFormPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const isNew = id === 'new';
  
  const { data: product, loading } = useAdminData(isNew ? '' : `/admin/products/${id}`);
  
  const [enableColors, setEnableColors] = useState(false);
  const [colorsInput, setColorsInput] = useState('');

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
    variants: [],
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
      const formattedDate = product.releaseDate 
        ? (() => {
            const date = new Date(product.releaseDate);
            return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
          })() 
        : '';

      const productVariants = product.variants || [];
      const hasActualColors = productVariants.some((v: any) => v.color && v.color !== 'Default');
      const uniqueColors = [...new Set(productVariants.map((v: any) => v.color || 'Default'))].filter(c => c !== 'Default') as string[];
      
      setEnableColors(hasActualColors);
      setColorsInput(hasActualColors ? uniqueColors.join(', ') : '');

      setFormData({
        ...formData, // Keep defaults for missing fields
        ...product,
        variants: productVariants,
        sizes: product.sizes || formData.sizes,
        images: Array.isArray(product.images) ? product.images : (product.image ? [product.image] : []),
        releaseDate: formattedDate,
      });
    }
  }, [product, isNew]);

  useEffect(() => {
    if (isNew) {
      const initialVariants = ['S', 'M', 'L', 'XL'].map(size => ({
        color: 'Default',
        size,
        quantity: 0
      }));
      setFormData((prev: any) => ({
        ...prev,
        variants: initialVariants
      }));
    }
  }, [isNew]);

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
    const currentVariants = [...(formData.variants || [])];
    const idx = currentVariants.findIndex((v: any) => v.color === 'Default' && v.size === size);
    if (idx >= 0) {
      currentVariants[idx].quantity = qty;
    } else {
      currentVariants.push({ color: 'Default', size, quantity: qty });
    }

    const newSizes = { ...formData.sizes, [size]: qty };
    const totalStock = Object.values(newSizes).reduce((a: any, b: any) => a + b, 0);

    setFormData({
      ...formData,
      sizes: newSizes,
      variants: currentVariants,
      countInStock: totalStock
    });
  };

  const updateVariantQty = (color: string, size: string, qty: number) => {
    const currentVariants = [...(formData.variants || [])];
    const idx = currentVariants.findIndex((v: any) => v.color === color && v.size === size);
    if (idx >= 0) {
      currentVariants[idx].quantity = qty;
    } else {
      currentVariants.push({ color, size, quantity: qty });
    }
    
    const totalStock = currentVariants.reduce((sum: number, v: any) => sum + (Number(v.quantity) || 0), 0);
    
    setFormData({
      ...formData,
      variants: currentVariants,
      countInStock: totalStock
    });
  };

  const handleColorsInputChange = (val: string) => {
    setColorsInput(val);
    const newColors = val.split(',').map(c => c.trim()).filter(Boolean);
    const activeColors = newColors.length > 0 ? newColors : ['Default'];
    
    const sizesList = ['S', 'M', 'L', 'XL'];
    const newVariants: any[] = [];
    
    activeColors.forEach((color) => {
      sizesList.forEach((size) => {
        const existing = formData.variants?.find((v: any) => v.color === color && v.size === size);
        newVariants.push({
          color,
          size,
          quantity: existing ? existing.quantity : 0
        });
      });
    });

    const totalStock = newVariants.reduce((sum: number, v: any) => sum + (Number(v.quantity) || 0), 0);
    
    setFormData({
      ...formData,
      variants: newVariants,
      countInStock: totalStock
    });
  };

  if (loading && !isNew) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  if (!product && !isNew) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <p className="text-gray-400">Piece not found in the archives.</p>
      <button onClick={() => router.push('/admin/products')} className="text-primary text-[10px] uppercase font-bold tracking-widest">Back to catalog</button>
    </div>
  );

  return (
    <div className="space-y-12 pb-24 text-white">
      <div className="flex items-center justify-between">
        <AdminHeader 
          title={isNew ? "New Creation" : "Edit Piece"} 
          subtitle={isNew ? "Add a new luxury item to your catalog." : `Refining ${product?.name}`} 
        />
        <div className="flex gap-4">
           <button 
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:bg-white/5 transition-all animate-none cursor-pointer"
           >
             Discard
           </button>
           <button 
            onClick={handleSubmit}
            disabled={saving}
            className="bg-primary text-black px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-primary-hover transition-all cursor-pointer"
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
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs focus:border-primary outline-none text-white bg-[#111]"
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
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs focus:border-primary outline-none text-white"
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg"><Layers size={20} /></div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-white">Size & Color Inventory</h2>
                </div>
                
                {/* Color Option Toggle */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <span className="text-[10px] font-bold uppercase text-gray-400">Enable Colors</span>
                  <input 
                    type="checkbox" 
                    checked={enableColors} 
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setEnableColors(checked);
                      if (checked) {
                        handleColorsInputChange(colorsInput || 'Black, White');
                      } else {
                        const defaultVariants = ['S', 'M', 'L', 'XL'].map(size => {
                          const existing = formData.variants?.find((v: any) => v.size === size);
                          return {
                            color: 'Default',
                            size,
                            quantity: existing ? existing.quantity : 0
                          };
                        });
                        const totalStock = defaultVariants.reduce((sum: number, v: any) => sum + (Number(v.quantity) || 0), 0);
                        setFormData({
                          ...formData,
                          variants: defaultVariants,
                          countInStock: totalStock
                        });
                      }
                    }}
                    className="rounded bg-white/5 border-white/10 text-primary focus:ring-0 cursor-pointer"
                  />
                </label>
              </div>

              {enableColors && (
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Colors (comma-separated)</label>
                  <input 
                    type="text" 
                    value={colorsInput}
                    onChange={(e) => handleColorsInputChange(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs focus:border-primary outline-none text-white"
                    placeholder="e.g. Black, White, Gold"
                  />
                </div>
              )}

              <div className="space-y-6">
                {enableColors ? (
                  (colorsInput.split(',').map(c => c.trim()).filter(Boolean).length > 0 
                    ? colorsInput.split(',').map(c => c.trim()).filter(Boolean) 
                    : ['Default']
                  ).map((color) => (
                    <div key={color} className="space-y-3 p-4 bg-white/5 rounded-xl border border-white/5">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-primary">{color}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {['S', 'M', 'L', 'XL'].map((size) => {
                          const variant = formData.variants?.find((v: any) => v.color === color && v.size === size);
                          const qty = variant ? variant.quantity : 0;
                          return (
                            <div key={size} className="space-y-1">
                              <label className="text-[9px] uppercase font-bold text-gray-500 block text-center">Size {size}</label>
                              <input 
                                type="number" 
                                value={qty}
                                onChange={(e) => updateVariantQty(color, size, Number(e.target.value))}
                                className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-center text-xs font-bold focus:border-primary outline-none text-white"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                     {['S', 'M', 'L', 'XL'].map((size) => {
                       const variant = formData.variants?.find((v: any) => v.color === 'Default' && v.size === size);
                       const qty = variant ? variant.quantity : 0;
                       return (
                         <div key={size} className="space-y-2 p-4 bg-white/5 rounded-xl border border-white/5">
                            <label className="text-[10px] uppercase font-bold text-gray-500 block text-center">Size {size}</label>
                            <input 
                              type="number" 
                              value={qty}
                              onChange={(e) => updateSize(size, Number(e.target.value))}
                              className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-center text-xs font-bold focus:border-primary outline-none text-white"
                            />
                         </div>
                       );
                     })}
                  </div>
                )}
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
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs focus:border-primary outline-none text-white"
                      required
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-gray-500">Sale Price (INR)</label>
                    <input 
                      type="number" 
                      value={formData.discountPrice}
                      onChange={(e) => setFormData({...formData, discountPrice: Number(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs focus:border-primary outline-none text-white text-white"
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
                    <p className="text-[8px] text-gray-600 uppercase font-bold leading-relaxed mt-2">
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs focus:border-primary outline-none text-white"
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
