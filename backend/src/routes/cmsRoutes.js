const express = require('express');
const Content = require('../models/Content');
const Collection = require('../models/Collection');
const HomepageSection = require('../models/HomepageSection');
const Announcement = require('../models/Announcement');
const Theme = require('../models/Theme');
const Blog = require('../models/Blog');
const Product = require('../models/Product');
const { remember } = require('../services/cacheService');

const router = express.Router();

router.get('/site', async (req, res, next) => {
  try {
    const data = await remember('content:site', async () => {
      const now = new Date();
      const [home, navbar, footer, pages, collections, sections, announcements, theme, blogs, featuredProducts, lotusProducts, lionProducts] = await Promise.all([
        Content.findOne({ key: 'home' }),
        Content.findOne({ key: 'navbar' }),
        Content.findOne({ key: 'footer' }),
        Content.find({ type: 'page', isPublished: true }).select('title slug metaTitle metaDescription updatedAt'),
        Collection.find({ isEnabled: true }),
        HomepageSection.find({ isEnabled: true }).sort('order'),
        Announcement.find({
          isActive: true,
          $and: [
            { $or: [{ startsAt: { $exists: false } }, { startsAt: null }, { startsAt: { $lte: now } }] },
            { $or: [{ endsAt: { $exists: false } }, { endsAt: null }, { endsAt: { $gte: now } }] },
          ],
        }).sort('-updatedAt'),
        Theme.findOne({ key: 'default' }),
        Blog.find({ status: 'published' }).sort('-publishAt -createdAt').limit(6),
        Product.find({ isPublished: true, isVisible: true, isFeatured: true }).sort('-updatedAt').limit(12),
        Product.find({ isPublished: true, isVisible: true, collectionType: 'lotus' }).sort('-createdAt').limit(8),
        Product.find({ isPublished: true, isVisible: true, collectionType: 'lion' }).sort('-createdAt').limit(8),
      ]);
      return {
        home: home?.data || null,
        navbar: navbar?.data || [],
        footer: footer?.data || [],
        pages,
        collections,
        sections,
        announcements,
        theme,
        blogs,
        featuredProducts,
        lotusProducts,
        lionProducts,
      };
    }, 60);
    res.json(data);
  } catch (error) { next(error); }
});

router.get('/blogs', async (req, res, next) => {
  try {
    const blogs = await Blog.find({ status: 'published' }).sort('-publishAt -createdAt');
    res.json(blogs);
  } catch (error) { next(error); }
});

router.get('/blogs/:slug', async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: 'published' });
    if (!blog) {
      res.status(404);
      throw new Error('Blog not found');
    }
    res.json(blog);
  } catch (error) { next(error); }
});

router.get('/collections/:key', async (req, res, next) => {
  try {
    const collection = await Collection.findOne({ key: req.params.key, isEnabled: true });
    if (!collection) {
      res.status(404);
      throw new Error('Collection not found');
    }
    const products = await Product.find({ collectionType: req.params.key, isPublished: true, isVisible: true }).sort('-createdAt');
    res.json({ collection, products });
  } catch (error) { next(error); }
});

module.exports = router;
