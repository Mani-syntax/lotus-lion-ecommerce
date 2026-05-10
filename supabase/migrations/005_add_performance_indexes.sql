-- 🚀 PERFORMANCE OPTIMIZATION MIGRATION
-- Add indexes to speed up queries dramatically

-- ===== PRODUCTS TABLE INDEXES =====
-- Speed up product visibility checks
CREATE INDEX IF NOT EXISTS idx_products_visibility 
  ON products(is_visible);

-- Speed up featured products queries  
CREATE INDEX IF NOT EXISTS idx_products_featured 
  ON products(is_featured, is_visible);

-- Speed up collection filtering
CREATE INDEX IF NOT EXISTS idx_products_collection_visible
  ON products(collection_id, is_visible);

-- Speed up category filtering
CREATE INDEX IF NOT EXISTS idx_products_category_visible
  ON products(category, is_visible);

-- Speed up slug lookups (used in product detail pages)
CREATE INDEX IF NOT EXISTS idx_products_slug_visible
  ON products(slug, is_visible);

-- Speed up search queries
CREATE INDEX IF NOT EXISTS idx_products_name_search
  ON products USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- ===== USERS TABLE INDEXES =====
-- Speed up email lookups for auth
CREATE INDEX IF NOT EXISTS idx_users_email
  ON users(email);

-- Speed up role-based queries
CREATE INDEX IF NOT EXISTS idx_users_role
  ON users(role, is_active);

-- ===== PRODUCT_IMAGES TABLE INDEXES =====
-- Speed up image lookups by product
CREATE INDEX IF NOT EXISTS idx_product_images_product_id
  ON product_images(product_id);

-- ===== COLLECTIONS TABLE INDEXES =====
-- Speed up collection slug lookups
CREATE INDEX IF NOT EXISTS idx_collections_slug
  ON collections(slug);

-- Speed up collection visibility queries
CREATE INDEX IF NOT EXISTS idx_collections_visible
  ON collections(is_visible);

-- ===== ORDERS TABLE INDEXES =====
-- Speed up user order lookups
CREATE INDEX IF NOT EXISTS idx_orders_user_id
  ON orders(user_id);

-- Speed up order status queries
CREATE INDEX IF NOT EXISTS idx_orders_status
  ON orders(status);

-- ===== CONTENT TABLE INDEXES =====
-- Speed up content key lookups (for settings)
CREATE INDEX IF NOT EXISTS idx_content_key
  ON content(key);

-- Speed up content type queries
CREATE INDEX IF NOT EXISTS idx_content_type
  ON content(type);

-- ===== COMPOSITE INDEXES =====
-- Speed up collection-based product queries with pagination
CREATE INDEX IF NOT EXISTS idx_products_collection_created
  ON products(collection_id, created_at DESC, is_visible);

-- Speed up category-based product queries
CREATE INDEX IF NOT EXISTS idx_products_category_created
  ON products(category, created_at DESC, is_visible);

-- Speed up user active status with role
CREATE INDEX IF NOT EXISTS idx_users_active_role
  ON users(is_active, role);

-- ===== FOREIGN KEY INDEXES (if not auto-created) =====
-- These ensure JOINs are fast
CREATE INDEX IF NOT EXISTS idx_products_user_id
  ON products(user_id);

CREATE INDEX IF NOT EXISTS idx_orders_product_id
  ON orders(product_id);

-- ===== CREATED_AT INDEXES (for sorting/pagination) =====
CREATE INDEX IF NOT EXISTS idx_products_created_at
  ON products(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orders_created_at
  ON orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_users_created_at
  ON users(created_at DESC);

-- Add comment explaining the indexes
COMMENT ON INDEX idx_products_visibility IS 'Speed up filtering visible products';
COMMENT ON INDEX idx_products_collection_visible IS 'Speed up collection-based product filtering';
COMMENT ON INDEX idx_products_name_search IS 'Speed up product search queries using full-text search';
COMMENT ON INDEX idx_users_email IS 'Speed up email lookups for authentication';
COMMENT ON INDEX idx_product_images_product_id IS 'Speed up product image relationship lookups';
COMMENT ON INDEX idx_products_collection_created IS 'Speed up paginated collection queries';
