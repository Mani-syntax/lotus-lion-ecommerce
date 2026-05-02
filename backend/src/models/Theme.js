const mongoose = require('mongoose');

const themeSchema = mongoose.Schema({
  key: { type: String, unique: true, default: 'default' },
  logo: String,
  favicon: String,
  colors: {
    background: { type: String, default: '#ffffff' },
    foreground: { type: String, default: '#1c1c1c' },
    gold: { type: String, default: '#c8a45d' },
    accent: { type: String, default: '#df0029' },
  },
  fonts: {
    heading: { type: String, default: 'Georgia' },
    body: { type: String, default: 'Geist' },
  },
  analytics: {
    googleAnalyticsId: String,
    metaPixelId: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Theme', themeSchema);
