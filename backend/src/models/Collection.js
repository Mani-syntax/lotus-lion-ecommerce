const mongoose = require('mongoose');

const campaignSchema = mongoose.Schema({
  title: String,
  subtitle: String,
  image: String,
  ctaText: String,
  ctaLink: String,
  startsAt: Date,
  endsAt: Date,
  isActive: { type: Boolean, default: true },
}, { _id: true });

const dropScheduleSchema = mongoose.Schema({
  title: String,
  launchAt: Date,
  endAt: Date,
  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  countdownEnabled: { type: Boolean, default: true },
  status: { type: String, enum: ['draft', 'scheduled', 'live', 'ended'], default: 'draft' },
}, { _id: true });

const collectionSchema = mongoose.Schema({
  key: { type: String, enum: ['lotus', 'lion'], unique: true, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
  categories: [{ name: String, slug: String, isVisible: { type: Boolean, default: true } }],
  hero: {
    eyebrow: String,
    title: String,
    subtitle: String,
    image: String,
    video: String,
    ctaText: String,
    ctaLink: String,
  },
  banners: [campaignSchema],
  campaigns: [campaignSchema],
  dropSchedules: [dropScheduleSchema],
  featuredProductIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  homepageSections: [{
    type: { type: String, default: 'editorial' },
    title: String,
    body: String,
    image: String,
    link: String,
    order: { type: Number, default: 0 },
    isEnabled: { type: Boolean, default: true },
  }],
  seo: {
    title: String,
    description: String,
    ogImage: String,
  },
  isEnabled: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Collection', collectionSchema);
