const supabase = require('../config/supabase');
const logger = require('../utils/logger');
const path = require('path');

const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'lotus-lion';

/**
 * Upload a buffer to Supabase Storage.
 * @param {Buffer} buffer - File buffer from multer
 * @param {string} folder - Folder path (e.g. 'products')
 * @returns {Promise<{ url: string, publicId: string }>}
 */
const uploadBuffer = async (buffer, folder = 'products') => {
  try {
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
    const filePath = `${folder}/${filename}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: 'image/webp',
        upsert: true
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return {
      url: publicUrl,
      publicId: filePath
    };
  } catch (error) {
    logger.error(`[Supabase Storage] Upload failed: ${error.message}`);
    throw error;
  }
};

/**
 * Upload multiple buffers to Supabase in parallel.
 * @param {Buffer[]} buffers
 * @param {string} folder
 * @returns {Promise<Array<{ url: string, publicId: string }>>}
 */
const uploadMultiple = async (buffers, folder = 'products') => {
  return Promise.all(buffers.map((buf) => uploadBuffer(buf, folder)));
};

/**
 * Delete an image from Supabase Storage by public_id (file path).
 * @param {string} publicId
 */
const deleteImage = async (publicId) => {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([publicId]);

    if (error) throw error;
    logger.info(`[Supabase Storage] Deleted: ${publicId}`);
  } catch (err) {
    logger.warn(`[Supabase Storage] Delete failed for ${publicId}: ${err.message}`);
  }
};

module.exports = { uploadBuffer, uploadMultiple, deleteImage };
