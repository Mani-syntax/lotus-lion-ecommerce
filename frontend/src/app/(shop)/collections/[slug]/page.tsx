'use client';

import { useEffect, useState, use } from 'react';
import { collectionsService } from '@/lib/services/collectionsService';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: Array<{ image_url: string; alt_text: string }>;
  is_featured: boolean;
}

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  banner_url: string;
  color_primary: string;
  color_secondary: string;
  hero?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    image?: string;
    ctaText?: string;
    ctaLink?: string;
  };
  products: Product[];
}

export default function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const data = await collectionsService.getCollectionWithProducts(slug);
        setCollection(data);
      } catch (error) {
        console.error('Error fetching collection:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Collection not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-screen max-h-[90vh] bg-gray-900 overflow-hidden flex items-center justify-center"
      >
        {/* Background Image */}
        {(collection.hero?.image || collection.banner_url) && (
          <Image
            src={collection.hero?.image || collection.banner_url}
            alt={collection.name}
            fill
            className="object-cover object-center"
            priority
          />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
          {collection.hero?.eyebrow && (
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm md:text-base uppercase tracking-widest text-white/90 mb-4"
            >
              {collection.hero.eyebrow}
            </motion.p>
          )}
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            {collection.hero?.title || collection.name}
          </motion.h1>
          
          {collection.hero?.subtitle && (
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto"
            >
              {collection.hero.subtitle}
            </motion.p>
          )}
          
          {collection.hero?.ctaText && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                href={collection.hero.ctaLink || `#products`}
                className="inline-block bg-white text-black px-8 py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors"
              >
                {collection.hero.ctaText}
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Description */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {collection.description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-700 text-lg mb-12 max-w-3xl"
          >
            {collection.description}
          </motion.p>
        )}

        {/* Products Grid */}
        <div id="products" className="scroll-mt-16">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-12">Collection Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {collection.products?.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="group"
              >
                <Link href={`/product/${product.slug}`}>
                  <div className="relative overflow-hidden bg-gray-100 rounded-lg mb-6" style={{ aspectRatio: '3/4' }}>
                    {product.images?.[0]?.image_url && (
                      <Image
                        src={product.images[0].image_url}
                        alt={product.name}
                        fill
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    {product.is_featured && (
                      <div className="absolute top-3 right-3 bg-black text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest">
                        Featured
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-black mb-2 group-hover:text-gray-700 transition-colors">{product.name}</h3>
                  <p className="text-xl font-bold text-black">₹{product.price}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
