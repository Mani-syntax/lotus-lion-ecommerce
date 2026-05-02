const mongoose = require('mongoose');

const homepageSectionSchema = mongoose.Schema({
  key: { type: String, required: true, unique: true, lowercase: true, trim: true },
  type: {
    type: String,
    enum: ['hero', 'collection-grid', 'product-rail', 'banner', 'marquee', 'journal', 'editorial', 'trust-bar', 'custom'],
    default: 'custom',
  },
  title: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  body: { type: String, default: '' },
  media: {
    image: String,
    video: String,
    alt: String,
  },
  ctas: [{ label: String, href: String, style: { type: String, default: 'primary' } }],
  items: { type: mongoose.Schema.Types.Mixed, default: [] },
  settings: { type: mongoose.Schema.Types.Mixed, default: {} },
  order: { type: Number, default: 0 },
  isEnabled: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('HomepageSection', homepageSectionSchema);
