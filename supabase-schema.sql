-- =====================================================
-- VIRTUAL TRY-ON E-COMMERCE DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('upper_body', 'lower_body', 'dresses')),
    price DECIMAL(10, 2) NOT NULL,
    image_1 TEXT NOT NULL,
    image_2 TEXT,
    image_3 TEXT,
    sizes TEXT[] DEFAULT ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors TEXT[] DEFAULT ARRAY['Black', 'White', 'Grey'],
    stock INTEGER DEFAULT 100,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- BRANDS TABLE (for watermark logos)
-- =====================================================
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_name TEXT NOT NULL,
    watermark_logo TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- USERS_TRYONS TABLE (analytics data)
-- =====================================================
CREATE TABLE IF NOT EXISTS users_tryons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_image TEXT NOT NULL,
    size TEXT NOT NULL,
    ip_address TEXT,
    country TEXT,
    city TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- GENERATED_RESULTS TABLE (stores try-on results as base64)
-- =====================================================
CREATE TABLE IF NOT EXISTS generated_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tryon_id UUID NOT NULL REFERENCES users_tryons(id) ON DELETE CASCADE,
    image_base64 TEXT NOT NULL,
    downloaded BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CARTS TABLE (for shopping cart)
-- =====================================================
CREATE TABLE IF NOT EXISTS carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CART_ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    size TEXT NOT NULL,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(cart_id, product_id, size, color)
);

-- =====================================================
-- ORDERS TABLE (for dummy checkout)
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID REFERENCES carts(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
    total DECIMAL(10, 2) NOT NULL,
    customer_email TEXT,
    customer_name TEXT,
    shipping_address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ENABLE RLS (Row Level Security) BUT ALLOW ALL ACCESS
-- =====================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE users_tryons ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE POLICIES TO ALLOW ALL ACCESS (No restrictions)
-- =====================================================

-- Products policies
CREATE POLICY "Allow all access on products" ON products FOR ALL USING (true) WITH CHECK (true);

-- Brands policies
CREATE POLICY "Allow all access on brands" ON brands FOR ALL USING (true) WITH CHECK (true);

-- Users tryons policies
CREATE POLICY "Allow all access on users_tryons" ON users_tryons FOR ALL USING (true) WITH CHECK (true);

-- Generated results policies
CREATE POLICY "Allow all access on generated_results" ON generated_results FOR ALL USING (true) WITH CHECK (true);

-- Carts policies
CREATE POLICY "Allow all access on carts" ON carts FOR ALL USING (true) WITH CHECK (true);

-- Cart items policies
CREATE POLICY "Allow all access on cart_items" ON cart_items FOR ALL USING (true) WITH CHECK (true);

-- Orders policies
CREATE POLICY "Allow all access on orders" ON orders FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- CREATE INDEXES FOR BETTER PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_users_tryons_product_id ON users_tryons(product_id);
CREATE INDEX IF NOT EXISTS idx_users_tryons_created_at ON users_tryons(created_at);
CREATE INDEX IF NOT EXISTS idx_users_tryons_country ON users_tryons(country);
CREATE INDEX IF NOT EXISTS idx_generated_results_tryon_id ON generated_results(tryon_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);

-- =====================================================
-- INSERT DEFAULT BRAND
-- =====================================================
INSERT INTO brands (brand_name, watermark_logo)
VALUES (
    'VTON',
    'https://api.dicebear.com/7.x/initials/svg?seed=VTON&backgroundColor=000000&textColor=ffffff&fontSize=40'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- INSERT SAMPLE PRODUCTS
-- =====================================================

-- Upper Body Products
INSERT INTO products (name, description, category, price, image_1, image_2, image_3, sizes, colors, featured) VALUES
('Classic Black Blazer', 'Elegant tailored blazer with a modern slim fit. Perfect for both formal and smart casual occasions. Features premium wool blend fabric with subtle texture.', 'upper_body', 299.00, 
 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800&q=80',
 ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'],
 ARRAY['Black', 'Charcoal', 'Navy'],
 true),

('Silk Evening Top', 'Luxurious silk evening top with delicate draping. Features a subtle sheen and elegant cowl neckline. Perfect for special occasions.', 'upper_body', 189.00,
 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&q=80',
 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&q=80',
 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&q=80',
 ARRAY['XS', 'S', 'M', 'L'],
 ARRAY['Champagne', 'Rose', 'Black'],
 true),

('Cashmere Sweater', 'Ultra-soft pure cashmere sweater with relaxed fit. Features ribbed cuffs and hem for a refined finish. A timeless wardrobe essential.', 'upper_body', 249.00,
 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80',
 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
 ARRAY['XS', 'S', 'M', 'L', 'XL'],
 ARRAY['Cream', 'Grey', 'Camel', 'Black'],
 true),

('Structured White Shirt', 'Crisp white cotton shirt with structured collar and French cuffs. Features hidden button placket for a clean, modern look.', 'upper_body', 159.00,
 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80',
 'https://images.unsplash.com/photo-1598032895397-b947c9c3bb4b?w=800&q=80',
 ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'],
 ARRAY['White', 'Light Blue'],
 false),

('Leather Biker Jacket', 'Premium lambskin leather biker jacket with asymmetric zip. Features quilted shoulder panels and adjustable belt. A statement piece.', 'upper_body', 599.00,
 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&q=80',
 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=800&q=80',
 ARRAY['XS', 'S', 'M', 'L', 'XL'],
 ARRAY['Black', 'Brown'],
 true);

-- Lower Body Products
INSERT INTO products (name, description, category, price, image_1, image_2, image_3, sizes, colors, featured) VALUES
('Tailored Wool Trousers', 'Expertly tailored wool trousers with a slim fit. Features pressed creases and extended waistband tab for a polished look.', 'lower_body', 199.00,
 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80',
 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80',
 ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'],
 ARRAY['Black', 'Charcoal', 'Navy'],
 true),

('High-Waist Palazzo Pants', 'Flowing high-waist palazzo pants in premium crepe fabric. Features wide legs and concealed side zip. Elegant and comfortable.', 'lower_body', 169.00,
 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80',
 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
 'https://images.unsplash.com/photo-1551854838-212c50b4c184?w=800&q=80',
 ARRAY['XS', 'S', 'M', 'L'],
 ARRAY['Black', 'Cream', 'Burgundy'],
 false),

('Slim Fit Jeans', 'Classic slim fit jeans in premium Japanese denim. Features subtle fading and comfortable stretch. A wardrobe staple.', 'lower_body', 149.00,
 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&q=80',
 ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'],
 ARRAY['Indigo', 'Black', 'Light Wash'],
 true),

('Pleated Midi Skirt', 'Elegant pleated midi skirt in flowing satin fabric. Features knife pleats and comfortable elasticated waist.', 'lower_body', 129.00,
 'https://images.unsplash.com/photo-1583496661160-fb5886a0uj0f?w=800&q=80',
 'https://images.unsplash.com/photo-1592301933927-35b597393c0a?w=800&q=80',
 'https://images.unsplash.com/photo-1577900232427-18219b9166a0?w=800&q=80',
 ARRAY['XS', 'S', 'M', 'L'],
 ARRAY['Black', 'Navy', 'Emerald'],
 false),

('Leather Straight Leg Pants', 'Sleek leather straight leg pants in butter-soft lambskin. Features clean lines and concealed side zip. Sophisticated edge.', 'lower_body', 399.00,
 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80',
 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
 ARRAY['XS', 'S', 'M', 'L'],
 ARRAY['Black', 'Burgundy'],
 true);

-- Dresses
INSERT INTO products (name, description, category, price, image_1, image_2, image_3, sizes, colors, featured) VALUES
('Silk Slip Dress', 'Elegant silk slip dress with delicate spaghetti straps. Features a subtle cowl neckline and flattering bias cut.', 'dresses', 279.00,
 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80',
 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
 ARRAY['XS', 'S', 'M', 'L'],
 ARRAY['Champagne', 'Black', 'Blush'],
 true),

('Cocktail Midi Dress', 'Structured cocktail dress with fit-and-flare silhouette. Features elegant boat neckline and hidden back zip.', 'dresses', 329.00,
 'https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=800&q=80',
 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
 'https://images.unsplash.com/photo-1496217590455-aa63a8350eea?w=800&q=80',
 ARRAY['XS', 'S', 'M', 'L'],
 ARRAY['Black', 'Navy', 'Ruby'],
 true),

('Wrap Maxi Dress', 'Flowing wrap maxi dress in lightweight viscose. Features adjustable tie waist and flattering V-neckline.', 'dresses', 199.00,
 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80',
 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=800&q=80',
 'https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=800&q=80',
 ARRAY['XS', 'S', 'M', 'L', 'XL'],
 ARRAY['Emerald', 'Burgundy', 'Black'],
 false),

('Lace Evening Gown', 'Stunning lace evening gown with illusion neckline. Features intricate floral lace and elegant train.', 'dresses', 599.00,
 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80',
 'https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=800&q=80',
 'https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=800&q=80',
 ARRAY['XS', 'S', 'M', 'L'],
 ARRAY['Ivory', 'Black', 'Dusty Rose'],
 true),

('Midi Shirt Dress', 'Classic shirt dress in crisp cotton poplin. Features belted waist and button-through front. Versatile elegance.', 'dresses', 179.00,
 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80',
 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&q=80',
 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80',
 ARRAY['XS', 'S', 'M', 'L', 'XL'],
 ARRAY['White', 'Navy', 'Black'],
 false);

-- =====================================================
-- GRANT PERMISSIONS TO ALL ROLES
-- =====================================================
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- =====================================================
-- HELPER VIEWS FOR ANALYTICS
-- =====================================================
CREATE OR REPLACE VIEW tryon_analytics AS
SELECT 
    ut.id,
    ut.product_id,
    p.name as product_name,
    p.category,
    ut.size,
    ut.ip_address,
    ut.country,
    ut.city,
    ut.created_at,
    gr.downloaded
FROM users_tryons ut
JOIN products p ON ut.product_id = p.id
LEFT JOIN generated_results gr ON ut.id = gr.tryon_id
ORDER BY ut.created_at DESC;

-- Analytics summary by country
CREATE OR REPLACE VIEW tryon_by_country AS
SELECT 
    country,
    COUNT(*) as total_tryons,
    COUNT(DISTINCT product_id) as unique_products,
    SUM(CASE WHEN downloaded THEN 1 ELSE 0 END) as downloads
FROM users_tryons ut
LEFT JOIN generated_results gr ON ut.id = gr.tryon_id
WHERE country IS NOT NULL
GROUP BY country
ORDER BY total_tryons DESC;

-- Analytics summary by product
CREATE OR REPLACE VIEW tryon_by_product AS
SELECT 
    p.id,
    p.name,
    p.category,
    COUNT(*) as total_tryons,
    SUM(CASE WHEN gr.downloaded THEN 1 ELSE 0 END) as downloads
FROM products p
LEFT JOIN users_tryons ut ON p.id = ut.product_id
LEFT JOIN generated_results gr ON ut.id = gr.tryon_id
GROUP BY p.id, p.name, p.category
ORDER BY total_tryons DESC;
