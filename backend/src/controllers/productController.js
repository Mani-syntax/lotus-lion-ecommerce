const Product = require('../models/Product');
const { remember } = require('../services/cacheService');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { collection, category } = req.query;
    
    // Cache key based on query params
    const cacheKey = `products:public:${collection || 'all'}:${category || 'all'}`;

    const products = await remember(cacheKey, async () => {
      const now = new Date();
      const query = { 
        isVisible: true,
        $or: [
          { releaseDate: { $lte: now } },
          { releaseDate: { $exists: false } },
          { releaseDate: null }
        ]
      };

      if (category) query.category = category;
      if (collection) query.collectionName = collection;

      return await Product.find(query).sort('-createdAt');
    });

    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const product = new Product({
      name: 'Sample name',
      price: 0,
      image: '/images/sample.jpg',
      brand: 'Sample brand',
      category: 'Sample category',
      countInStock: 0,
      description: 'Sample description',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const {
      name,
      price,
      description,
      image,
      brand,
      category,
      countInStock,
      isPublished,
      releaseDate,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.image = image || product.image;
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.countInStock = countInStock || product.countInStock;
      product.isPublished = isPublished !== undefined ? isPublished : product.isPublished;
      product.releaseDate = releaseDate || product.releaseDate;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
};
