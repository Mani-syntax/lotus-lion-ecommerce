const supabase = require('../../config/supabase');
const { flush, get, set } = require('../../services/cacheService');

const getSettings = async (req, res, next) => {
  try {
    const cacheKey = 'settings:all';
    
    // Try cache first
    let formatted = await get(cacheKey);
    if (formatted) {
      return res.json(formatted);
    }

    const { data, error } = await supabase.from('content').select('*').eq('key', 'settings').single();
    if (error && error.code !== 'PGRST116') throw error;
    
    const settingsData = data?.data || {};
    
    // Map to frontend expectation
    formatted = {
      siteMeta: { value: { 
        name: settingsData.site_name || 'Lotus & Lion', 
        tagline: settingsData.site_description || '', 
        whatsapp: settingsData.whatsapp_number || '',
        instagram: settingsData.instagram_url || '',
        twitter: settingsData.twitter_url || '',
        pinterest: settingsData.pinterest_url || ''
      } },
    };
    
    // Cache for 10 minutes
    await set(cacheKey, formatted, 600);
    res.json(formatted);
  } catch (error) { next(error); }
};

const updateSettings = async (req, res, next) => {
  try {
    const { siteMeta } = req.body;
    const metaValue = siteMeta?.value || {};
    
    const settingsData = {
      site_name: metaValue.name || 'Lotus & Lion',
      site_description: metaValue.tagline || '',
      whatsapp_number: metaValue.whatsapp || '',
      instagram_url: metaValue.instagram || '',
      twitter_url: metaValue.twitter || '',
      pinterest_url: metaValue.pinterest || ''
    };

    // Use explicit upsert with better error handling
    const { data, error } = await supabase.from('content').upsert({
      key: 'settings',
      type: 'settings',
      data: settingsData
    }, { 
      onConflict: 'key',
      ignoreDuplicates: false
    }).select().single();

    if (error) {
      console.error('[Settings] Update error:', error);
      throw error;
    }

    // Invalidate cache after successful update
    await flush('settings:*');
    
    // Return the updated formatted settings
    const formatted = {
      siteMeta: { value: {
        name: settingsData.site_name || 'Lotus & Lion',
        tagline: settingsData.site_description || '',
        whatsapp: settingsData.whatsapp_number || '',
        instagram: settingsData.instagram_url || '',
        twitter: settingsData.twitter_url || '',
        pinterest: settingsData.pinterest_url || ''
      } }
    };
    
    res.json(formatted);
  } catch (error) { 
    console.error('[Settings] Controller error:', error);
    next(error); 
  }
};

module.exports = { getSettings, updateSettings, updateSetting: updateSettings };
