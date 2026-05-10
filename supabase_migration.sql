-- MASTER MIGRATION FOR LOTUS & LION (FINAL)
-- MATCHES ALL FRONTEND SERVICES (blogsService, productsService, cmsService)

DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS homepage_sections CASCADE;
DROP TABLE IF EXISTS navbar_config CASCADE;
DROP TABLE IF EXISTS footer_config CASCADE;
DROP TABLE IF EXISTS website_settings CASCADE;
DROP TABLE IF EXISTS content CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS collections CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 1. Profiles (Users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'user',
    is_blocked BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Collections
CREATE TABLE collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    banner_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    rich_description TEXT,
    price DECIMAL(12,2) NOT NULL DEFAULT 0,
    discount_price DECIMAL(12,2),
    category TEXT,
    stock_quantity INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_trending BOOLEAN DEFAULT false,
    is_visible BOOLEAN DEFAULT true,
    is_flash_sale BOOLEAN DEFAULT false,
    release_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Product Images
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    cloudinary_public_id TEXT,
    alt_text TEXT,
    display_order INTEGER DEFAULT 0,
    is_main BOOLEAN DEFAULT false
);

-- 5. Product Variants
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    size TEXT,
    color TEXT,
    quantity INTEGER DEFAULT 0,
    price_override DECIMAL(12,2)
);

-- 6. Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending',
    total_price DECIMAL(12,2) NOT NULL,
    shipping_price DECIMAL(12,2) DEFAULT 0,
    tax_price DECIMAL(12,2) DEFAULT 0,
    items_price DECIMAL(12,2) NOT NULL,
    shipping_address JSONB,
    payment_method TEXT,
    payment_result JSONB,
    order_items JSONB,
    is_paid BOOLEAN DEFAULT false,
    paid_at TIMESTAMP WITH TIME ZONE,
    is_delivered BOOLEAN DEFAULT false,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. Blogs
CREATE TABLE blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    body TEXT,
    cover_image TEXT,
    category TEXT,
    status TEXT DEFAULT 'draft',
    is_published BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 8. CMS / Site Config (Direct Supabase Access Tables)
CREATE TABLE navbar_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    items JSONB NOT NULL DEFAULT '[]',
    logo_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE footer_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    columns JSONB NOT NULL DEFAULT '[]',
    copyright_text TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE website_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_name TEXT DEFAULT 'Lotus & Lion',
    site_description TEXT,
    whatsapp_number TEXT,
    instagram_url TEXT DEFAULT 'https://instagram.com/lotuslion',
    twitter_url TEXT DEFAULT 'https://twitter.com/lotuslion',
    pinterest_url TEXT DEFAULT 'https://pinterest.com/lotuslion',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 9. Homepage Sections
CREATE TABLE homepage_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT UNIQUE NOT NULL,
    title TEXT,
    subtitle TEXT,
    type TEXT,
    content JSONB,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

-- 10. Legacy Content Table (For the Backend API)
CREATE TABLE content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    type TEXT,
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 11. Announcements
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message TEXT NOT NULL,
    link_href TEXT,
    is_active BOOLEAN DEFAULT true,
    placement TEXT DEFAULT 'top-bar',
    display_order INTEGER DEFAULT 0
);

-- SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE navbar_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ ACCESS
CREATE POLICY "Public read" ON collections FOR SELECT USING (true);
CREATE POLICY "Public read" ON products FOR SELECT USING (true);
CREATE POLICY "Public read" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public read" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Public read" ON blogs FOR SELECT USING (true);
CREATE POLICY "Public read" ON navbar_config FOR SELECT USING (true);
CREATE POLICY "Public read" ON footer_config FOR SELECT USING (true);
CREATE POLICY "Public read" ON website_settings FOR SELECT USING (true);
CREATE POLICY "Public read" ON homepage_sections FOR SELECT USING (true);
CREATE POLICY "Public read" ON content FOR SELECT USING (true);
CREATE POLICY "Public read" ON announcements FOR SELECT USING (true);

-- PRIVATE ACCESS
CREATE POLICY "Own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Own orders" ON orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
