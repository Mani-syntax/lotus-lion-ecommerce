const supabase = require('../config/supabase');
const { remember, flush } = require('../services/cacheService');

const mapToCamelCase = (p) => {
  if (!p) return null;
  
  // Handle joined images array - items can be objects {image_url: '...'} or plain strings
  let images = [];
  if (p.images && Array.isArray(p.images) && p.images.length > 0) {
    images = p.images
      .map(img => (typeof img === 'string' ? img : img?.image_url))
      .filter(Boolean);
  }
  const mainImage = images[0] || null;

  return {
    _id: p.id,
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    richDescription: p.rich_description,
    price: p.price,
    discountPrice: p.discount_price,
    category: p.category,
    collection: p.collection_id,
    collectionType: p.collection_id,
    countInStock: p.stock_quantity,
    isFeatured: p.is_featured,
    isVisible: p.is_visible,
    image: mainImage,
    images: images,
    variants: p.variants || [],
    brand: 'Lotus & Lion'
  };
};

// Helper: Create cache key for product queries
const getProductsCacheKey = (query) => {
  const { keyword, category, collectionType, page = 1, limit = 12 } = query;
  return `products:list:${collectionType || 'all'}:${category || 'all'}:${keyword || 'all'}:p${page}:l${limit}`;
};

// @route GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const { keyword, category, collectionType, page = 1, limit = 12 } = req.query;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit))); // Cap at 100
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    const cacheKey = getProductsCacheKey(req.query);
    
    // Use longer cache TTL (10 min) since products change less frequently
    const data = await remember(cacheKey, async () => {
      let query = supabase
        .from('products')
        .select('id, name, slug, price, discount_price, category, stock_quantity, is_featured, is_visible, collection_id, images:product_images(image_url)', { count: 'exact' })
        .eq('is_visible', true);

      if (keyword) query = query.ilike('name', `%${keyword}%`);
      if (category) query = query.eq('category', category);
      if (collectionType) query = query.eq('collection_id', collectionType);

      const { data: products, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      return products.map(mapToCamelCase);
    }, 600); // 10 min cache for better performance

    // Browser cache: 60s, CDN stale-while-revalidate: 1200s (20 min)
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=1200');
    res.json(data);
  } catch (error) { next(error); }
};

// @route GET /api/products/:slug
const getProductBySlug = async (req, res, next) => {
  try {
    const identifier = req.params.slug.toLowerCase().trim();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
    const cacheKey = `product:${isUuid ? 'id' : 'slug'}:${identifier}`;
    
    const data = await remember(cacheKey, async () => {
      let query = supabase
        .from('products')
        .select('id, name, slug, description, rich_description, price, discount_price, category, stock_quantity, is_featured, is_visible, collection_id, images:product_images(image_url), variants:product_variants(*)')
        .eq('is_visible', true);

      query = isUuid ? query.eq('id', identifier) : query.eq('slug', identifier);

      const { data: product, error } = await query.single();

      if (error || !product) {
        return null;
      }
      return mapToCamelCase(product);
    }, 1800); // 30 min cache for individual product pages

    if (!data) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Aggressive caching for product detail pages
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    res.json(data);
  } catch (error) { next(error); }
};

// @route GET /api/products/featured
const getFeaturedProducts = async (req, res, next) => {
  try {
    const cacheKey = 'products:featured:latest';
    
    const data = await remember(cacheKey, async () => {
      const { data: products, error } = await supabase
        .from('products')
        .select('id, name, slug, price, discount_price, stock_quantity, is_featured, is_visible, collection_id, images:product_images(image_url)')
        .eq('is_featured', true)
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;
      return products.map(mapToCamelCase);
    }, 900); // 15 min cache for featured products

    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=1800');
    res.json(data);
  } catch (error) { next(error); }
};

module.exports = {
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  getTrendingProducts: async (req, res) => res.json([]),
};
