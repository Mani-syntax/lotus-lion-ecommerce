const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./config/db');
const { connectRedis } = require('./config/redis');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { apiLimiter } = require('./middleware/rateLimiter');

dotenv.config();

connectRedis();

(async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error(`[DB] Failed to connect: ${error.message}`);
  }
})();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

// Also allow any Vercel preview/production URLs

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate Limiting
app.use('/api', apiLimiter);

// Routes
app.get('/', (req, res) => {
  res.send('Lotus & Lion API is running...');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/cms', require('./routes/cmsRoutes'));

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Scheduled Drop System
const cron = require('node-cron');
const Product = require('./models/Product');
const Blog = require('./models/Blog');
const Collection = require('./models/Collection');
const { flush } = require('./services/cacheService');

cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const [productResult, blogResult, stockResult] = await Promise.all([
      Product.updateMany(
      { releaseDate: { $lte: now }, isPublished: false },
      { $set: { isPublished: true, isVisible: true, visibility: 'visible' } }
      ),
      Blog.updateMany(
        { publishAt: { $lte: now }, status: 'scheduled' },
        { $set: { status: 'published' } }
      ),
      Product.updateMany(
        { countInStock: { $lte: 0 }, hideWhenOutOfStock: true, isVisible: true },
        { $set: { isVisible: false, visibility: 'hidden' } }
      ),
    ]);

    const collections = await Collection.find({ 'dropSchedules.launchAt': { $lte: now }, 'dropSchedules.status': 'scheduled' });
    await Promise.all(collections.map(async (collection) => {
      collection.dropSchedules = collection.dropSchedules.map((drop) => {
        if (drop.status === 'scheduled' && drop.launchAt && drop.launchAt <= now) drop.status = 'live';
        if (drop.status === 'live' && drop.endAt && drop.endAt <= now) drop.status = 'ended';
        return drop;
      });
      return collection.save();
    }));

    if (productResult.modifiedCount || blogResult.modifiedCount || stockResult.modifiedCount || collections.length) {
      await flush('content:*');
      await flush('products:*');
      console.log(`[SCHEDULED CMS] products=${productResult.modifiedCount} blogs=${blogResult.modifiedCount} stockHidden=${stockResult.modifiedCount} drops=${collections.length}`);
    }
  } catch (error) {
    console.error('[CRON ERROR]', error);
  }
});

module.exports = app;

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[SERVER] Running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}
