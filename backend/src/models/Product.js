const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
    },
    image: {
      type: String,
      required: true,
    },
    images: [{ type: String }],
    videos: [{ type: String }],
    brand: {
      type: String,
      required: true,
      default: 'Lotus & Lion',
    },
    category: {
      type: String,
      required: true,
    },
    subcategory: {
      type: String,
      default: '',
    },
    collectionName: {
      type: String,
      enum: ['lotus', 'lion'],
      default: 'lotus',
      index: true,
    },
    collectionType: {
      type: String,
      enum: ['lotus', 'lion', 'artist'],
      default: 'lotus',
    },
    description: {
      type: String,
      required: true,
    },
    richDescription: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    sku: {
      type: String,
      uppercase: true,
      trim: true,
      index: true,
    },
    // Size-based stock e.g. { XS: 10, S: 20, M: 15, L: 5, XL: 0 }
    sizes: {
      type: Map,
      of: Number,
      default: {},
    },
    colors: [{
      name: String,
      value: String,
    }],
    // Total stock (auto-calculated or manual)
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      required: true,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    visibility: {
      type: String,
      enum: ['visible', 'hidden', 'scheduled'],
      default: 'visible',
    },
    relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    seo: {
      title: String,
      description: String,
      keywords: [String],
      ogImage: String,
    },
    sizeChart: {
      type: String,
      default: '',
    },
    flashSale: {
      type: Boolean,
      default: false,
    },
    tags: [{ type: String }],
    releaseDate: {
      type: Date,
    },
    hideWhenOutOfStock: {
      type: Boolean,
      default: true,
    },
    stockHistory: [{
      date: { type: Date, default: Date.now },
      previousStock: Number,
      newStock: Number,
      reason: String,
    }],
  },
  {
    timestamps: true,
  }
);

// Virtual: effective price (discount or full)
productSchema.virtual('effectivePrice').get(function () {
  return this.discountPrice > 0 ? this.discountPrice : this.price;
});

// Virtual: low stock check (< 10)
productSchema.virtual('isLowStock').get(function () {
  return this.countInStock > 0 && this.countInStock < 10;
});

productSchema.virtual('collection').get(function() {
  return this.collectionName;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
