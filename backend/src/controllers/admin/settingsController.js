const Settings = require('../../models/Settings');
const { flush } = require('../../services/cacheService');

const DEFAULT_SETTINGS = [
  { key: 'globalDiscount', value: { enabled: false, percentage: 0 }, label: 'Global Discount', description: 'Apply a discount % to all products' },
  { key: 'flashSale', value: { enabled: false, label: 'Flash Sale', endsAt: null }, label: 'Flash Sale', description: 'Toggle flash sale mode globally' },
  { key: 'maintenanceMode', value: { enabled: false, message: 'We are back soon!' }, label: 'Maintenance Mode', description: 'Put the site in maintenance mode' },
  { key: 'siteMeta', value: { name: 'Lotus & Lion', tagline: 'Modern luxury clothing for the pioneer' }, label: 'Site Meta', description: 'Site name and tagline' },
  { key: 'shipping', value: { freeThreshold: 150, cost: 10 }, label: 'Shipping', description: 'Free shipping threshold and default cost' },
];

// ─── GET ALL SETTINGS ─────────────────────────────────────────────────────────
const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.find({});
    // Seed defaults if empty
    if (settings.length === 0) {
      await Settings.insertMany(DEFAULT_SETTINGS);
      settings = await Settings.find({});
    }
    // Return as key-value map
    const map = {};
    settings.forEach(s => { map[s.key] = { value: s.value, label: s.label, description: s.description }; });
    res.json(map);
  } catch (error) { next(error); }
};

// ─── UPDATE SETTING ───────────────────────────────────────────────────────────
const updateSetting = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    if (value === undefined) { res.status(400); throw new Error('Value is required'); }

    const setting = await Settings.findOneAndUpdate(
      { key },
      { $set: { value } },
      { new: true, upsert: true }
    );
    await flush('settings:*');
    res.json({ key, value: setting.value });
  } catch (error) { next(error); }
};

// ─── UPDATE MULTIPLE SETTINGS ─────────────────────────────────────────────────
const updateSettings = async (req, res, next) => {
  try {
    const updates = req.body; // { key: value, ... }
    await Promise.all(
      Object.entries(updates).map(([key, value]) =>
        Settings.findOneAndUpdate({ key }, { $set: { value } }, { new: true, upsert: true })
      )
    );
    await flush('settings:*');
    res.json({ message: 'Settings updated' });
  } catch (error) { next(error); }
};

module.exports = { getSettings, updateSetting, updateSettings };
