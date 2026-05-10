const supabase = require('../../config/supabase');
const { flush } = require('../../services/cacheService');

const getOrCreate = async (key, type, defaultData) => {
  const { data: existing, error } = await supabase.from('content').select('*').eq('key', key).maybeSingle();
  if (existing) return existing;

  const { data: created, error: cError } = await supabase
    .from('content')
    .insert({ key, type, data: defaultData })
    .select()
    .single();
  
  if (cError) throw cError;
  return created;
};

const getHero = async (req, res, next) => {
  try {
    const hero = await getOrCreate('hero', 'hero', {});
    res.json(hero);
  } catch (error) { next(error); }
};

const updateHero = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('content').update({ data: req.body }).eq('key', 'hero').select().single();
    if (error) throw error;
    await flush('content:*');
    res.json(data);
  } catch (error) { next(error); }
};

const getNavbar = async (req, res, next) => {
  try {
    const nav = await getOrCreate('navbar', 'navbar', []);
    res.json(nav);
  } catch (error) { next(error); }
};

const updateNavbar = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('content').update({ data: req.body.items }).eq('key', 'navbar').select().single();
    if (error) throw error;
    await flush('content:*');
    res.json(data);
  } catch (error) { next(error); }
};

const getFooter = async (req, res, next) => {
  try {
    const footer = await getOrCreate('footer', 'footer', []);
    res.json(footer);
  } catch (error) { next(error); }
};

const updateFooter = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('content').update({ data: req.body.groups }).eq('key', 'footer').select().single();
    if (error) throw error;
    await flush('content:*');
    res.json(data);
  } catch (error) { next(error); }
};

const getHome = async (req, res, next) => {
  try {
    const home = await getOrCreate('home', 'home', {});
    res.json(home);
  } catch (error) { next(error); }
};

const updateHome = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('content').update({ data: req.body }).eq('key', 'home').select().single();
    if (error) throw error;
    await flush('content:*');
    res.json(data);
  } catch (error) { next(error); }
};

const getPages = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('content').select('*').eq('type', 'page').order('title');
    if (error) throw error;
    res.json(data);
  } catch (error) { next(error); }
};

const createPage = async (req, res, next) => {
  try {
    const { title, slug, body, isPublished } = req.body;
    const { data, error } = await supabase.from('content').insert({
      type: 'page', key: slug, title, data: { body, isPublished }
    }).select().single();
    if (error) throw error;
    await flush('content:*');
    res.status(201).json(data);
  } catch (error) { next(error); }
};

const updatePage = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('content').update(req.body).eq('id', req.params.id).select().single();
    if (error) throw error;
    await flush('content:*');
    res.json(data);
  } catch (error) { next(error); }
};

const deletePage = async (req, res, next) => {
  try {
    const { error } = await supabase.from('content').delete().eq('id', req.params.id);
    if (error) throw error;
    await flush('content:*');
    res.json({ message: 'Page deleted' });
  } catch (error) { next(error); }
};

module.exports = {
  getHero, updateHero, getHome, updateHome, getNavbar, updateNavbar, getFooter, updateFooter,
  getPages, createPage, updatePage, deletePage
};
