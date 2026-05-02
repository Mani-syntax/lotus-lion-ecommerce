const mongoose = require('mongoose');

/**
 * Content model — powers the CMS.
 * 
 * Types:
 *   'hero'   — homepage hero section config (data: { title, subtitle, cta, image })
 *   'navbar' — navigation items (data: [ { label, href, order } ])
 *   'footer' — footer link groups (data: [ { heading, links: [{ label, href }] } ])
 *   'page'   — static pages like About, Contact, Privacy etc.
 * 
 * Each document has a unique `key` (e.g. 'hero', 'navbar', 'footer', 'about', 'contact').
 */
const contentSchema = mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['hero', 'home', 'navbar', 'footer', 'page', 'settings', 'theme'],
      required: true,
    },
    key: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      default: '',
    },
    // Slug for page URLs (e.g. 'about', 'contact', 'privacy-policy')
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    // Rich HTML body (for pages via TipTap editor)
    body: {
      type: String,
      default: '',
    },
    // Flexible JSON payload (used by hero/navbar/footer)
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    metaTitle: {
      type: String,
      default: '',
    },
    metaDescription: {
      type: String,
      default: '',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
