const Product = require('../../models/Product');
const { flush, remember } = require('../../services/cacheService');
const { uploadBuffer, uploadMultiple } = require('../../services/cloudinaryService');

const parseMaybeJson = (value, fallback) => {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch { return fallback; }
  }
  return value;
};

const parseBool = (value, fallback = false) => {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'boolean') return value;
  return value === 'true';
};

const slugify = (value = '') => value.toString().toLowerCase().trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

// ─── GET ALL PRODUCTS (admin, all published states) ──────────────────────────
// @route GET /api/admin/products
const getAdminProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      category = '',
      sort = '-createdAt',
      lowStock = false,
      collectionType = '',
    } = req.query;

    const query = {};
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
    if (category) query.category = category;
    if (collectionType) query.collectionType = collectionType;
    if (lowStock === 'true') query.countInStock = { $gt: 0, $lt: 10 };

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    res.json({
      products,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET SINGLE PRODUCT ──────────────────────────────────────────────────────
// @route GET /api/admin/products/:id
const getAdminProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// ─── CREATE PRODUCT ──────────────────────────────────────────────────────────
// @route POST /api/admin/products
const createProduct = async (req, res, next) => {
  try {
    const {
      name, slug, description, richDescription, price, discountPrice, category, subcategory, collectionType,
      countInStock, sizes, isFeatured, isVisible, isPublished,
      flashSale, releaseDate, tags, imageUrl, image: bodyImage, images: bodyImages,
      videos, sku, colors, isTrending, isNewArrival, visibility, seo, sizeChart, hideWhenOutOfStock,
    } = req.body;

    let images = parseMaybeJson(bodyImages, Array.isArray(bodyImages) ? bodyImages : []);
    let image = imageUrl || bodyImage || images[0] || '';

    // Handle uploaded files
    if (req.files && req.files.length > 0) {
      const uploaded = await uploadMultiple(req.files.map(f => f.buffer));
      image = uploaded[0]?.url || image;
      images = uploaded.map(u => u.url);
    }

    const product = await Product.create({
      name: name || 'New Product',
      slug: slugify(slug || name || `product-${Date.now()}`),
      description: description || '',
      richDescription: richDescription || '',
      price: Number(price) || 0,
      discountPrice: Number(discountPrice) || 0,
      category: category || 'Uncategorized',
      subcategory: subcategory || '',
      collectionType: collectionType || 'lotus',
      countInStock: Number(countInStock) || 0,
      sizes: parseMaybeJson(sizes, {}),
      colors: parseMaybeJson(colors, []),
      isFeatured: parseBool(isFeatured, false),
      isTrending: parseBool(isTrending, false),
      isNewArrival: parseBool(isNewArrival, false),
      isVisible: isVisible !== 'false',
      isPublished: isPublished !== 'false',
      visibility: visibility || (isVisible === 'false' ? 'hidden' : 'visible'),
      flashSale: parseBool(flashSale, false),
      releaseDate: releaseDate || null,
      tags: parseMaybeJson(tags, []),
      videos: parseMaybeJson(videos, []),
      sku,
      seo: parseMaybeJson(seo, {}),
      sizeChart: sizeChart || '',
      hideWhenOutOfStock: parseBool(hideWhenOutOfStock, true),
      image,
      images,
      brand: 'Lotus & Lion',
    });

    await flush('products:*');
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// ─── UPDATE PRODUCT ──────────────────────────────────────────────────────────
// @route PUT /api/admin/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const {
      name, slug, description, richDescription, price, discountPrice, category, subcategory, collectionType,
      countInStock, sizes, isFeatured, isVisible, isPublished,
      flashSale, releaseDate, tags, imageUrl, image: bodyImage, images: bodyImages, existingImages,
      videos, sku, colors, isTrending, isNewArrival, visibility, seo, sizeChart, hideWhenOutOfStock,
    } = req.body;

    let image = product.image;
    let images = product.images || [];

    // Handle new file uploads
    if (req.files && req.files.length > 0) {
      const uploaded = await uploadMultiple(req.files.map(f => f.buffer));
      image = uploaded[0]?.url || image;
      // Merge new uploads with kept existing images
      const kept = parseMaybeJson(existingImages, []);
      images = [...kept, ...uploaded.map(u => u.url)];
    } else {
      images = parseMaybeJson(bodyImages, images);
      image = imageUrl || bodyImage || images[0] || image;
    }

    product.name = name || product.name;
    product.slug = slug !== undefined ? slugify(slug || product.name) : (product.slug || slugify(product.name));
    product.description = description || product.description;
    product.richDescription = richDescription !== undefined ? richDescription : product.richDescription;
    product.price = price !== undefined ? Number(price) : product.price;
    product.discountPrice = discountPrice !== undefined ? Number(discountPrice) : product.discountPrice;
    product.category = category || product.category;
    product.subcategory = subcategory !== undefined ? subcategory : product.subcategory;
    product.collectionType = collectionType || product.collectionType;
    product.countInStock = countInStock !== undefined ? Number(countInStock) : product.countInStock;
    product.sizes = sizes !== undefined ? parseMaybeJson(sizes, product.sizes) : product.sizes;
    product.colors = colors !== undefined ? parseMaybeJson(colors, product.colors) : product.colors;
    product.isFeatured = isFeatured !== undefined ? parseBool(isFeatured, product.isFeatured) : product.isFeatured;
    product.isTrending = isTrending !== undefined ? parseBool(isTrending, product.isTrending) : product.isTrending;
    product.isNewArrival = isNewArrival !== undefined ? parseBool(isNewArrival, product.isNewArrival) : product.isNewArrival;
    product.isVisible = isVisible !== undefined ? isVisible !== 'false' : product.isVisible;
    product.isPublished = isPublished !== undefined ? isPublished !== 'false' : product.isPublished;
    product.visibility = visibility || (product.isVisible ? 'visible' : 'hidden');
    product.flashSale = flashSale !== undefined ? parseBool(flashSale, product.flashSale) : product.flashSale;
    product.releaseDate = releaseDate || product.releaseDate;
    product.tags = tags !== undefined ? parseMaybeJson(tags, product.tags) : product.tags;
    product.videos = videos !== undefined ? parseMaybeJson(videos, product.videos) : product.videos;
    product.sku = sku !== undefined ? sku : product.sku;
    product.seo = seo !== undefined ? parseMaybeJson(seo, product.seo) : product.seo;
    product.sizeChart = sizeChart !== undefined ? sizeChart : product.sizeChart;
    product.hideWhenOutOfStock = hideWhenOutOfStock !== undefined ? parseBool(hideWhenOutOfStock, product.hideWhenOutOfStock) : product.hideWhenOutOfStock;
    product.image = image;
    product.images = images;

    const updated = await product.save();
    await flush('products:*');
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// ─── DELETE PRODUCT ──────────────────────────────────────────────────────────
// @route DELETE /api/admin/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    await Product.deleteOne({ _id: product._id });
    await flush('products:*');
    res.json({ message: 'Product removed' });
  } catch (error) {
    next(error);
  }
};

// ─── TOGGLE FEATURED ─────────────────────────────────────────────────────────
// @route PATCH /api/admin/products/:id/featured
const toggleFeatured = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) { res.status(404); throw new Error('Product not found'); }
    product.isFeatured = !product.isFeatured;
    await product.save();
    await flush('products:*');
    res.json({ isFeatured: product.isFeatured });
  } catch (error) {
    next(error);
  }
};

// ─── TOGGLE VISIBILITY ────────────────────────────────────────────────────────
// @route PATCH /api/admin/products/:id/visibility
const toggleVisibility = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) { res.status(404); throw new Error('Product not found'); }
    product.isVisible = !product.isVisible;
    product.isPublished = product.isVisible;
    await product.save();
    await flush('products:*');
    res.json({ isVisible: product.isVisible });
  } catch (error) {
    next(error);
  }
};

// ─── APPLY GLOBAL DISCOUNT ────────────────────────────────────────────────────
// @route POST /api/admin/products/bulk-discount
const applyBulkDiscount = async (req, res, next) => {
  try {
    const { percentage, category } = req.body;
    if (!percentage || percentage < 0 || percentage > 100) {
      res.status(400);
      throw new Error('Invalid discount percentage');
    }

    const query = category ? { category } : {};
    const products = await Product.find(query);

    await Promise.all(products.map(p => {
      p.discountPrice = parseFloat((p.price * (1 - percentage / 100)).toFixed(2));
      return p.save();
    }));

    await flush('products:*');
    res.json({ message: `Discount of ${percentage}% applied to ${products.length} products` });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFeatured,
  toggleVisibility,
  applyBulkDiscount,
};
