const mongoose = require('mongoose');

/**
 * Settings model — global site configuration key/value store.
 * Each setting is one document with a unique key.
 * Values can be any type (Boolean, Number, String, Object).
 * 
 * Default keys:
 *   'globalDiscount'     — { enabled: false, percentage: 0 }
 *   'flashSale'          — { enabled: false, label: 'Flash Sale' }
 *   'maintenanceMode'    — { enabled: false, message: '' }
 *   'siteMeta'           — { name: 'Lotus & Lion', tagline: '...' }
 *   'shippingThreshold'  — { free: 150, cost: 10 }
 */
const settingsSchema = mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
