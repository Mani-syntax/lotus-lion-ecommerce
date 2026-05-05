const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');
const fs = require('fs/promises');
const path = require('path');
const logger = require('../utils/logger');

// Cloudinary is configured from env vars automatically if set
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a buffer to Cloudinary via stream.
 * @param {Buffer} buffer - File buffer from multer
 * @param {string} folder - Cloudinary folder (e.g. 'lotus-lion/products')
 * @returns {Promise<{ url: string, publicId: string }>}
 */
const uploadBuffer = (buffer, folder = 'lotus-lion/products') => {
  const hasCredentials = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;
  const isPlaceholder = process.env.CLOUDINARY_API_KEY === 'placeholder' || process.env.CLOUDINARY_CLOUD_NAME === 'placeholder';
  
  if (!hasCredentials || isPlaceholder) {
    return saveLocalImage(buffer, folder);
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
          { width: 1200, crop: 'limit' },
        ],
      },
      (error, result) => {
        if (error) {
          logger.error(`[Cloudinary] Upload failed: ${error.message}`);
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );

    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(stream);
  });
};

const saveLocalImage = async (buffer, folder = 'lotus-lion/products') => {
  const safeFolder = folder.replace(/[^a-z0-9/_-]/gi, '').replace(/\/+/g, '/');
  const uploadDir = path.join(__dirname, '..', '..', 'uploads', safeFolder);
  await fs.mkdir(uploadDir, { recursive: true });

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, buffer);

  const publicPath = `/uploads/${safeFolder}/${filename}`.replace(/\\/g, '/');
  const baseUrl = process.env.API_PUBLIC_URL || `http://localhost:${process.env.PORT || 5000}`;

  return {
    url: `${baseUrl}${publicPath}`,
    publicId: publicPath,
  };
};

/**
 * Upload multiple buffers to Cloudinary in parallel.
 * @param {Buffer[]} buffers
 * @param {string} folder
 * @returns {Promise<Array<{ url: string, publicId: string }>>}
 */
const uploadMultiple = async (buffers, folder = 'lotus-lion/products') => {
  return Promise.all(buffers.map((buf) => uploadBuffer(buf, folder)));
};

/**
 * Delete an image from Cloudinary by public_id.
 * @param {string} publicId
 */
const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    logger.info(`[Cloudinary] Deleted: ${publicId}`);
  } catch (err) {
    logger.warn(`[Cloudinary] Delete failed for ${publicId}: ${err.message}`);
  }
};

module.exports = { uploadBuffer, uploadMultiple, deleteImage };
