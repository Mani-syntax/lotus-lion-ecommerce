const storageService = require('./storageService');

// This file is kept for backward compatibility with existing imports
// It now routes all "Cloudinary" calls to Supabase Storage
module.exports = {
  uploadBuffer: storageService.uploadBuffer,
  uploadMultiple: storageService.uploadMultiple,
  deleteImage: storageService.deleteImage
};
