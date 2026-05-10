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
        className="relative h-96 bg-gray-900 overflow-hidden"
      >
        {collection.banner_url && (
          <Image
            src={collection.banner_url}
            alt={collection.name}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold text-white"
          >
            {collection.name}
          </motion.h1>
        </div>
      </motion.div>

      {/* Description */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <p className="text-gray-600 text-lg mb-8">{collection.description}</p>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collection.products?.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/product/${product.slug}`}>
                <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-lg mb-4">
                  {product.images?.[0]?.image_url && (
                    <Image
                      src={product.images[0].image_url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                  {product.is_featured && (
                    <div className="absolute top-2 right-2 bg-black text-white px-3 py-1 rounded-full text-sm">
                      Featured
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-black mb-2">{product.name}</h3>
                <p className="text-xl font-bold text-black">₹{product.price}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
