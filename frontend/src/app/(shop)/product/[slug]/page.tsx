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
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              {product.images?.[selectedImage] ? (
                <Image
                  src={product.images[selectedImage].image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <Image
                  src="https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=1000"
                  alt="Placeholder"
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images?.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 relative ${
                    idx === selectedImage ? 'border-black' : 'border-gray-300'
                  }`}
                >
                  <Image
                    src={img.image_url}
                    alt={`${product.name} ${idx}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-bold text-black mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-6">
              Collection: {product.collection?.name}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-black">
                ₹{product.discount_price || product.price}
              </span>
              {product.discount_price && (
                <span className="text-xl text-gray-500 line-through">
                  ₹{product.price}
                </span>
              )}
            </div>

            <div 
              className="text-gray-700 mb-8 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-bold mb-2">Size</label>
                <div className="flex gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border-2 rounded-lg transition ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 text-black'
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
              <div className="mb-6">
                <label className="block text-sm font-bold mb-2">Color</label>
                <div className="flex gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border-2 rounded-lg transition ${
                        selectedColor === color
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 text-black'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  −
                </button>
                <span className="text-xl font-bold">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity(
                      Math.min(product.stock_quantity, quantity + 1)
                    )
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Stock */}
            <div className="mb-8">
              {product.stock_quantity > 0 ? (
                <p className="text-green-600 font-bold">In Stock</p>
              ) : (
                <p className="text-red-600 font-bold">Out of Stock</p>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
              className="w-full bg-black text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
