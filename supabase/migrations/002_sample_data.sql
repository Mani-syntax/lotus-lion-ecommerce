-- Sample data for Lotus & Lion

-- Insert sample admin user
INSERT INTO users (email, name, role) 
VALUES ('admin@lotusandlion.com', 'Admin User', 'admin')
ON CONFLICT DO NOTHING;

-- Insert sample products for Lotus collection
INSERT INTO products (name, slug, description, price, collection_id, is_featured, is_visible, is_new_arrival)
VALUES 
  ('Lotus Flow Dress', 'lotus-flow-dress', 'Elegant fluid dress inspired by natural forms', 4999, (SELECT id FROM collections WHERE slug = 'lotus'), TRUE, TRUE, TRUE),
  ('Lotus Coordinate Set', 'lotus-coordinate-set', 'Matching top and bottom set for effortless style', 6499, (SELECT id FROM collections WHERE slug = 'lotus'), TRUE, TRUE, TRUE),
  ('Lotus Linen Shirt', 'lotus-linen-shirt', 'Breathable linen shirt perfect for warm days', 3499, (SELECT id FROM collections WHERE slug = 'lotus'), FALSE, TRUE, TRUE)
ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  is_featured = EXCLUDED.is_featured,
  is_visible = EXCLUDED.is_visible,
  is_new_arrival = EXCLUDED.is_new_arrival;

-- Insert sample products for Lion collection  
INSERT INTO products (name, slug, description, price, collection_id, is_featured, is_visible, is_new_arrival)
VALUES
  ('Lion Crisp Shirt', 'lion-crisp-shirt', 'Structured shirt with clean proportions', 3999, (SELECT id FROM collections WHERE slug = 'lion'), TRUE, TRUE, TRUE),
  ('Lion Tailored Trousers', 'lion-tailored-trousers', 'Well-fitted trousers for professional look', 5499, (SELECT id FROM collections WHERE slug = 'lion'), TRUE, TRUE, TRUE),
  ('Lion Canvas Overshirt', 'lion-canvas-overshirt', 'Layerable overshirt in premium canvas', 7999, (SELECT id FROM collections WHERE slug = 'lion'), FALSE, TRUE, FALSE)
ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  is_featured = EXCLUDED.is_featured,
  is_visible = EXCLUDED.is_visible,
  is_new_arrival = EXCLUDED.is_new_arrival;

-- Insert product variants (sizes)
INSERT INTO product_variants (product_id, size, color, quantity)
SELECT id, size, color, qty
FROM (
  SELECT (SELECT id FROM products WHERE slug = 'lotus-flow-dress') as id, 'XS' as size, 'Black' as color, 10 as qty
  UNION ALL
  SELECT (SELECT id FROM products WHERE slug = 'lotus-flow-dress'), 'S', 'Black', 15
  UNION ALL
  SELECT (SELECT id FROM products WHERE slug = 'lotus-flow-dress'), 'M', 'Black', 20
  UNION ALL
  SELECT (SELECT id FROM products WHERE slug = 'lotus-coordinate-set'), 'S', 'Navy', 8
  UNION ALL
  SELECT (SELECT id FROM products WHERE slug = 'lotus-coordinate-set'), 'M', 'Navy', 12
  UNION ALL
  SELECT (SELECT id FROM products WHERE slug = 'lion-crisp-shirt'), 'S', 'White', 10
  UNION ALL
  SELECT (SELECT id FROM products WHERE slug = 'lion-crisp-shirt'), 'M', 'White', 15
  UNION ALL
  SELECT (SELECT id FROM products WHERE slug = 'lion-crisp-shirt'), 'L', 'White', 12
) AS sizes
ON CONFLICT DO NOTHING;

-- Insert sample product images (using placeholder image URLs)
INSERT INTO product_images (product_id, image_url, alt_text, display_order)
SELECT id, image_url, alt_text, ord
FROM (
  SELECT (SELECT id FROM products WHERE slug = 'lotus-flow-dress') as id, 'https://images.unsplash.com/photo-1595777707802-41d339d60280?w=500&h=600' as image_url, 'Lotus Flow Dress' as alt_text, 1 as ord
  UNION ALL
  SELECT (SELECT id FROM products WHERE slug = 'lotus-coordinate-set'), 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&h=600', 'Lotus Coordinate Set', 1
  UNION ALL
  SELECT (SELECT id FROM products WHERE slug = 'lion-crisp-shirt'), 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=600', 'Lion Crisp Shirt', 1
  UNION ALL
  SELECT (SELECT id FROM products WHERE slug = 'lion-tailored-trousers'), 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=600', 'Lion Tailored Trousers', 1
) AS images
ON CONFLICT DO NOTHING;

-- Insert sample blog post
INSERT INTO blogs (title, slug, content, excerpt, is_published, published_at, author_id)
VALUES 
  ('The Art of Minimalist Fashion', 'the-art-of-minimalist-fashion', 
   '<h1>The Art of Minimalist Fashion</h1><p>Discover how simplicity and quality craftsmanship come together to create timeless pieces that transcend trends.</p><p>At Lotus & Lion, we believe in the power of restraint. Every piece is designed to be worn, loved, and kept for years to come.</p>',
   'Explore our philosophy on minimalist fashion and quality design',
   TRUE, 
   NOW(),
   (SELECT id FROM users WHERE email = 'admin@lotusandlion.com' LIMIT 1)
  )
ON CONFLICT DO NOTHING;

-- Insert homepage sections
INSERT INTO homepage_sections (section_key, section_type, title, subtitle, description, is_active, display_order)
VALUES
  ('hero_banner', 'banner', 'Lotus & Lion', 'Luxury Fashion', 'Handcrafted pieces for those who appreciate quality', TRUE, 1),
  ('featured_products', 'product_carousel', 'Featured Pieces', 'Our Best Sellers', 'Explore our most loved designs', TRUE, 2),
  ('about_section', 'text_section', 'About Us', 'Our Story', 'Lotus & Lion is a luxury fashion brand focusing on quality, timeless design, and sustainable practices.', TRUE, 3)
ON CONFLICT DO NOTHING;

-- Insert website settings
UPDATE website_settings 
SET 
  site_url = 'https://lotusandlion.com',
  support_email = 'support@lotusandlion.com',
  support_phone = '+91 9876543210'
WHERE site_name = 'Lotus & Lion';

COMMIT;
