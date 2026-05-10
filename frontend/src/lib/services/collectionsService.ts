import { supabase } from '@/lib/supabase';

export const collectionsService = {
  // Fetch all active collections
  async getCollections() {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching collections:', error);
      return [];
    }
  },

  // Fetch single collection by slug
  async getCollectionBySlug(slug: string) {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching collection:', error);
      return null;
    }
  },

  // Fetch collection with products
  async getCollectionWithProducts(slug: string) {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          products(
            *,
            images:product_images(id, image_url, alt_text)
          )
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching collection with products:', error);
      return null;
    }
  },

  // Fetch featured collections
  async getFeaturedCollections() {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(2);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching featured collections:', error);
      return [];
    }
  },
};
