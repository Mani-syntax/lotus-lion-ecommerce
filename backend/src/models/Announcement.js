const mongoose = require('mongoose');

const announcementSchema = mongoose.Schema({
  message: { type: String, required: true },
  linkLabel: String,
  linkHref: String,
  placement: { type: String, enum: ['top-bar', 'homepage', 'checkout'], default: 'top-bar' },
  startsAt: Date,
  endsAt: Date,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
