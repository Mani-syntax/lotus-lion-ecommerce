const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  excerpt: { type: String, default: '' },
  body: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  category: { type: String, default: 'Journal' },
  author: {
    name: { type: String, default: 'Lotus & Lion Studio' },
    avatar: String,
  },
  tags: [String],
  isFeatured: { type: Boolean, default: false },
  status: { type: String, enum: ['draft', 'scheduled', 'published'], default: 'draft' },
  publishAt: Date,
  seo: {
    title: String,
    description: String,
    ogImage: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
