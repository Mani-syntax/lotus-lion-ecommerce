const Blog = require('../../models/Blog');
const Collection = require('../../models/Collection');
const HomepageSection = require('../../models/HomepageSection');
const Announcement = require('../../models/Announcement');
const Theme = require('../../models/Theme');
const Product = require('../../models/Product');
const Content = require('../../models/Content');
const { flush } = require('../../services/cacheService');

const slugify = (value = '') => value.toString().toLowerCase().trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const defaults = {
  lotus: {
    key: 'lotus',
    title: 'Lotus Collection',
    subtitle: 'Expressive womenswear',
    description: 'Fluid dresses, co-ords, and occasion-ready pieces built around soft structure and atelier detail.',
    categories: [{ name: 'Dresses', slug: 'dresses' }, { name: 'Co-ords', slug: 'co-ords' }],
    hero: { eyebrow: 'Lotus', title: 'Lotus Collections', subtitle: 'Soft power, studio lines, and modern womenswear.', ctaText: 'Shop Lotus', ctaLink: '/products?collectionType=lotus' },
  },
  lion: {
    key: 'lion',
    title: 'Lion Collection',
    subtitle: 'Composed menswear',
    description: 'Crisp shirts, relaxed tailoring, and quiet detail for everyday confidence.',
    categories: [{ name: 'Shirts', slug: 'shirts' }, { name: 'Layers', slug: 'layers' }],
    hero: { eyebrow: 'Lion', title: 'Lion Collections', subtitle: 'Clean proportions and precise wardrobe staples.', ctaText: 'Shop Lion', ctaLink: '/products?collectionType=lion' },
  },
};

const ensureCollection = async (key) => {
  let collection = await Collection.findOne({ key });
  if (!collection) collection = await Collection.create(defaults[key]);
  return collection;
};

const listCollections = async (req, res, next) => {
  try {
    await Promise.all([ensureCollection('lotus'), ensureCollection('lion')]);
    const collections = await Collection.find({ key: { $in: ['lotus', 'lion'] } }).populate('featuredProductIds', 'name image price discountPrice collectionType');
    res.json(collections);
  } catch (error) { next(error); }
};

const getCollection = async (req, res, next) => {
  try {
    const key = req.params.key;
    if (!['lotus', 'lion'].includes(key)) {
      res.status(404);
      throw new Error('Collection not found');
    }
    const collection = await ensureCollection(key);
    const products = await Product.find({ collectionType: key }).sort('-createdAt').limit(80);
    res.json({ collection, products });
  } catch (error) { next(error); }
};

const updateCollection = async (req, res, next) => {
  try {
    const collection = await ensureCollection(req.params.key);
    Object.assign(collection, req.body);
    collection.key = req.params.key;
    await collection.save();
    await flush('content:*');
    await flush('products:*');
    res.json(collection);
  } catch (error) { next(error); }
};

const listBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).sort('-updatedAt');
    res.json(blogs);
  } catch (error) { next(error); }
};

const getPublishedBlogs = async (req, res, next) => {
  try {
    const now = new Date();
    const blogs = await Blog.find({
      status: 'published',
      $or: [{ publishAt: { $exists: false } }, { publishAt: null }, { publishAt: { $lte: now } }],
    }).sort('-publishAt -createdAt');
    res.json(blogs);
  } catch (error) { next(error); }
};

const upsertBlog = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    payload.slug = slugify(payload.slug || payload.title);
    if (!payload.slug) {
      res.status(400);
      throw new Error('Blog title or slug is required');
    }
    const blog = payload._id
      ? await Blog.findByIdAndUpdate(payload._id, payload, { new: true, runValidators: true })
      : await Blog.create(payload);
    await flush('content:*');
    res.status(payload._id ? 200 : 201).json(blog);
  } catch (error) { next(error); }
};

const deleteBlog = async (req, res, next) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    await flush('content:*');
    res.json({ message: 'Blog deleted' });
  } catch (error) { next(error); }
};

const listSections = async (req, res, next) => {
  try {
    const sections = await HomepageSection.find({}).sort('order updatedAt');
    res.json(sections);
  } catch (error) { next(error); }
};

const upsertSection = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    payload.key = slugify(payload.key || payload.title || payload.type);
    if (!payload.key) payload.key = `section-${Date.now()}`;
    const section = payload._id
      ? await HomepageSection.findByIdAndUpdate(payload._id, payload, { new: true, runValidators: true })
      : await HomepageSection.create(payload);
    await flush('content:*');
    res.status(payload._id ? 200 : 201).json(section);
  } catch (error) { next(error); }
};

const deleteSection = async (req, res, next) => {
  try {
    await HomepageSection.findByIdAndDelete(req.params.id);
    await flush('content:*');
    res.json({ message: 'Homepage section deleted' });
  } catch (error) { next(error); }
};

const listAnnouncements = async (req, res, next) => {
  try {
    res.json(await Announcement.find({}).sort('-updatedAt'));
  } catch (error) { next(error); }
};

const upsertAnnouncement = async (req, res, next) => {
  try {
    const announcement = req.body._id
      ? await Announcement.findByIdAndUpdate(req.body._id, req.body, { new: true, runValidators: true })
      : await Announcement.create(req.body);
    await flush('content:*');
    res.status(req.body._id ? 200 : 201).json(announcement);
  } catch (error) { next(error); }
};

const getTheme = async (req, res, next) => {
  try {
    const theme = await Theme.findOneAndUpdate({ key: 'default' }, { $setOnInsert: { key: 'default' } }, { new: true, upsert: true });
    res.json(theme);
  } catch (error) { next(error); }
};

const updateTheme = async (req, res, next) => {
  try {
    const theme = await Theme.findOneAndUpdate({ key: 'default' }, req.body, { new: true, upsert: true, runValidators: true });
    await flush('content:*');
    res.json(theme);
  } catch (error) { next(error); }
};

const getControlCenter = async (req, res, next) => {
  try {
    const [collections, blogs, sections, announcements, theme, pages, products] = await Promise.all([
      Collection.find({ key: { $in: ['lotus', 'lion'] } }),
      Blog.find({}).sort('-updatedAt').limit(6),
      HomepageSection.find({}).sort('order').limit(20),
      Announcement.find({}).sort('-updatedAt').limit(6),
      Theme.findOneAndUpdate({ key: 'default' }, { $setOnInsert: { key: 'default' } }, { new: true, upsert: true }),
      Content.find({ type: 'page' }).sort('title'),
      Product.find({}).sort('-updatedAt').limit(8),
    ]);

    res.json({
      modules: [
        'Homepage Builder', 'Navbar', 'Footer', 'Lotus Collection', 'Lion Collection',
        'Products', 'Drops', 'Blogs', 'Static Pages', 'Theme', 'Announcements', 'Analytics',
      ],
      collections,
      blogs,
      sections,
      announcements,
      theme,
      pages,
      products,
    });
  } catch (error) { next(error); }
};

module.exports = {
  listCollections,
  getCollection,
  updateCollection,
  listBlogs,
  getPublishedBlogs,
  upsertBlog,
  deleteBlog,
  listSections,
  upsertSection,
  deleteSection,
  listAnnouncements,
  upsertAnnouncement,
  getTheme,
  updateTheme,
  getControlCenter,
};
