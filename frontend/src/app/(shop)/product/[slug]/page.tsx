'use client';

import { useEffect, useState, use } from 'react';
import { productsService } from '@/lib/services/productsService';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  rich_description: string;
  price: number;
  discount_price: number;
  stock_quantity: number;
  collection: { id: string; name: string; slug: string };
  images: Array<{ id: string; image_url: string; alt_text: string }>;
  variants: Array<{ id: string; size: string; color: string; quantity: number }>;
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const addToCart = useStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productsService.getProductBySlug(slug);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      product: product.id,
      name: product.name,
      image: product.images?.[0]?.image_url || '',
      price: product.discount_price || product.price,
      countInStock: product.stock_quantity,
      qty: quantity,
    });

    toast.success('Added to cart!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Product not found</div>
      </div>
    );
  }

  const sizes = [...new Set(product.variants?.map((v) => v.size) || [])];
  const colors = [...new Set(product.variants?.map((v) => v.color) || [])];

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto px-0 py-0 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_1.2fr] gap-0 lg:gap-0 min-h-screen">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col bg-gray-50"
          >
            <div className="relative w-full bg-gray-100 overflow-hidden flex-1 flex items-center justify-center" style={{ aspectRatio: '3/4', minHeight: '100vh' }}>
              {product.images?.[selectedImage] ? (
                <Image
                  src={product.images[selectedImage].image_url}
                  alt={product.name}
                  fill
                  className="object-contain w-full h-full"
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <Image
                  src="https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=1000"
                  alt="Placeholder"
                  fill
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            <div className="grid grid-cols-4 gap-2 md:gap-3 bg-gray-50 p-4">
              {product.images?.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(idx)}
                  className={`rounded-lg overflow-hidden border-2 relative transition-all h-24 md:h-28 ${ idx === selectedImage ? 'border-black shadow-lg' : 'border-gray-300 hover:border-gray-400'}`}
                  style={{ aspectRatio: '3/4' }}
                >
                  <Image
                    src={img.image_url}
                    alt={`${product.name} ${idx}`}
                    fill
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="overflow-y-auto px-6 md:px-8 py-8 md:py-12 bg-white"
          >
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">{product.name}</h1>
              <p className="text-base text-gray-600">
                Collection: <span className="font-semibold text-black">{product.collection?.name}</span>
              </p>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-5xl font-bold text-black">
                ₹{product.discount_price || product.price}
              </span>
              {product.discount_price && (
                <span className="text-2xl text-gray-500 line-through">
                  ₹{product.price}
                </span>
              )}
            </div>

            <div 
              className="text-gray-700 mb-10 prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="mb-8">
                <label className="block text-base font-bold mb-3">Size</label>
                <div className="flex gap-3 flex-wrap">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 border-2 rounded-lg transition text-base font-medium ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 text-black hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {colors.length > 0 && (
              <div className="mb-8">
                <label className="block text-base font-bold mb-3">Color</label>
                <div className="flex gap-3 flex-wrap">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-3 border-2 rounded-lg transition text-base font-medium ${
                        selectedColor === color
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 text-black hover:border-black'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-base font-bold mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-5 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-100 text-xl font-bold"
                >
                  −
                </button>
                <span className="text-2xl font-bold min-w-12 text-center">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity(
                      Math.min(product.stock_quantity, quantity + 1)
                    )
                  }
                  className="px-5 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-100 text-xl font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Stock */}
            <div className="mb-10">
              {product.stock_quantity > 0 ? (
                <p className="text-lg text-green-600 font-bold">✓ In Stock</p>
              ) : (
                <p className="text-lg text-red-600 font-bold">Out of Stock</p>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
              className="w-full bg-black text-white py-5 rounded-lg font-bold text-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
          </motion.div>
        </div>

        {/* Description */}
        {product.rich_description && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-16 border-t-2 border-gray-200 pt-8"
          >
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <div
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: product.rich_description }}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
