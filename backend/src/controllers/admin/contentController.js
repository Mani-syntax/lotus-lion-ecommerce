const Content = require('../../models/Content');
const { flush, remember } = require('../../services/cacheService');

// Default hero content
const DEFAULT_HERO = {
  title: 'The New Standard.',
  subtitle: 'Spring / Summer 2026',
  ctaText: 'Explore Collection',
  ctaLink: '/products',
  secondaryCtaText: 'Our Heritage',
  secondaryCtaLink: '/heritage',
  image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070',
};

const DEFAULT_NAVBAR = [
  { label: 'Lotus', href: '/collections/lotus', order: 1 },
  { label: 'Lion', href: '/collections/lion', order: 2 },
  { label: 'All Products', href: '/products', order: 3 },
  { label: 'Journal', href: '/#journal', order: 4 },
  { label: 'Heritage', href: '/about', order: 5 },
];

const DEFAULT_FOOTER = [
  {
    heading: 'Collections',
    links: [
      { label: 'Lotus Collection', href: '/collections/lotus' },
      { label: 'Lion Collection', href: '/collections/lion' },
      { label: 'New Arrivals', href: '/products?category=New Arrivals' },
      { label: 'The Essentials', href: '/products?category=Essentials' },
    ],
  },
  {
    heading: 'Experience',
    links: [
      { label: 'Our Heritage', href: '/about' },
      { label: 'Sustainability', href: '/sustainability' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Shipping & Returns', href: '/shipping' },
    ],
  },
];

const DEFAULT_HOME = {
  slides: [
    {
      eyebrow: 'Online Exclusive Sale',
      title: 'Lotus & Lion',
      subtitle: 'Lotus Collections for women. Lion Collections for men. Original artist-led outfits for everyday and occasion wear.',
      ctaText: 'Shop Now',
      ctaLink: '/products',
      image: '',
    },
  ],
  collections: {
    lotus: { title: 'Lotus Collections', subtitle: 'Women', image: '', link: '/products?collectionType=lotus' },
    lion: { title: 'Lion Collections', subtitle: 'Men', image: '', link: '/products?collectionType=lion' },
    artist: { title: 'Artist Outfits', subtitle: 'Atelier Looks', image: '', link: '/products?collectionType=artist' },
  },
};

// Helper: get or create a content doc with defaults
const getOrCreate = async (key, type, defaultData) => {
  let doc = await Content.findOne({ key });
  if (!doc) {
    doc = await Content.create({ key, type, data: defaultData });
  }
  return doc;
};

// ─── HERO ─────────────────────────────────────────────────────────────────────
const getHero = async (req, res, next) => {
  try {
    const hero = await getOrCreate('hero', 'hero', DEFAULT_HERO);
    res.json(hero);
  } catch (error) { next(error); }
};

const updateHero = async (req, res, next) => {
  try {
    const hero = await getOrCreate('hero', 'hero', DEFAULT_HERO);
    hero.data = { ...hero.data, ...req.body };
    await hero.save();
    await flush('content:*');
    res.json(hero);
  } catch (error) { next(error); }
};

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
const getNavbar = async (req, res, next) => {
  try {
    const nav = await getOrCreate('navbar', 'navbar', DEFAULT_NAVBAR);
    res.json(nav);
  } catch (error) { next(error); }
};

const updateNavbar = async (req, res, next) => {
  try {
    const nav = await getOrCreate('navbar', 'navbar', DEFAULT_NAVBAR);
    // req.body.items is an array of { label, href, order }
    nav.data = req.body.items || nav.data;
    await nav.save();
    await flush('content:*');
    res.json(nav);
  } catch (error) { next(error); }
};

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const getFooter = async (req, res, next) => {
  try {
    const footer = await getOrCreate('footer', 'footer', DEFAULT_FOOTER);
    res.json(footer);
  } catch (error) { next(error); }
};

const updateFooter = async (req, res, next) => {
  try {
    const footer = await getOrCreate('footer', 'footer', DEFAULT_FOOTER);
    footer.data = req.body.groups || footer.data;
    await footer.save();
    await flush('content:*');
    res.json(footer);
  } catch (error) { next(error); }
};

// Home page visual CMS
const getHome = async (req, res, next) => {
  try {
    const home = await getOrCreate('home', 'home', DEFAULT_HOME);
    res.json(home);
  } catch (error) { next(error); }
};

const updateHome = async (req, res, next) => {
  try {
    const home = await getOrCreate('home', 'home', DEFAULT_HOME);
    home.data = { ...DEFAULT_HOME, ...home.data, ...req.body };
    await home.save();
    await flush('content:*');
    res.json(home);
  } catch (error) { next(error); }
};

// ─── STATIC PAGES ─────────────────────────────────────────────────────────────
const getPages = async (req, res, next) => {
  try {
    const pages = await Content.find({ type: 'page' }).sort({ title: 1 });
    res.json(pages);
  } catch (error) { next(error); }
};

const getPageBySlug = async (req, res, next) => {
  try {
    const page = await Content.findOne({ slug: req.params.slug, type: 'page' });
    if (!page) { res.status(404); throw new Error('Page not found'); }
    res.json(page);
  } catch (error) { next(error); }
};

const createPage = async (req, res, next) => {
  try {
    const { title, slug, body, metaTitle, metaDescription, isPublished } = req.body;
    if (!title || !slug) { res.status(400); throw new Error('Title and slug are required'); }
    const existing = await Content.findOne({ key: slug });
    if (existing) { res.status(400); throw new Error('A page with this slug already exists'); }
    const page = await Content.create({
      type: 'page',
      key: slug,
      slug,
      title,
      body: body || '',
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || '',
      isPublished: isPublished !== false,
    });
    await flush('content:*');
    res.status(201).json(page);
  } catch (error) { next(error); }
};

const updatePage = async (req, res, next) => {
  try {
    const page = await Content.findById(req.params.id);
    if (!page) { res.status(404); throw new Error('Page not found'); }
    const { title, slug, body, metaTitle, metaDescription, isPublished } = req.body;
    if (title) page.title = title;
    if (slug) { page.slug = slug; page.key = slug; }
    if (body !== undefined) page.body = body;
    if (metaTitle) page.metaTitle = metaTitle;
    if (metaDescription !== undefined) page.metaDescription = metaDescription;
    if (isPublished !== undefined) page.isPublished = Boolean(isPublished);
    await page.save();
    await flush('content:*');
    res.json(page);
  } catch (error) { next(error); }
};

const deletePage = async (req, res, next) => {
  try {
    const page = await Content.findById(req.params.id);
    if (!page) { res.status(404); throw new Error('Page not found'); }
    await Content.deleteOne({ _id: page._id });
    await flush('content:*');
    res.json({ message: 'Page deleted' });
  } catch (error) { next(error); }
};

module.exports = {
  getHero, updateHero,
  getHome, updateHome,
  getNavbar, updateNavbar,
  getFooter, updateFooter,
  getPages, getPageBySlug, createPage, updatePage, deletePage,
};
