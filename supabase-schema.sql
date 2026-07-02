-- SQL Schema for Supabase (PostgreSQL)
-- This schema establishes all the required tables and columns for the chemical factory management system.
-- It is designed to work natively in PostgreSQL / Supabase, using standard identity types and foreign key definitions.

-- Clean up existing tables if running as a reset script (Optional)
-- DROP TABLE IF EXISTS purchase_packs CASCADE;
-- DROP TABLE IF EXISTS inventory_pack CASCADE;
-- DROP TABLE IF EXISTS prechecks CASCADE;
-- DROP TABLE IF EXISTS grns CASCADE;
-- DROP TABLE IF EXISTS purchase_order_items CASCADE;
-- DROP TABLE IF EXISTS purchase_orders CASCADE;
-- DROP TABLE IF EXISTS packing_orders CASCADE;
-- DROP TABLE IF EXISTS production_orders CASCADE;
-- DROP TABLE IF EXISTS bom_items CASCADE;
-- DROP TABLE IF EXISTS bom_recipes CASCADE;
-- DROP TABLE IF EXISTS raw_materials CASCADE;
-- DROP TABLE IF EXISTS products CASCADE;
-- DROP TABLE IF EXISTS customers CASCADE;

-- 1. Customers Table (ข้อมูลลูกค้าและแบรนด์)
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(255),
    phone VARCHAR(100),
    email VARCHAR(255),
    tax_id VARCHAR(100),
    address TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products Table (ข้อมูลผลิตภัณฑ์)
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) DEFAULT 'Liquid',
    version VARCHAR(50) DEFAULT 'v1.0',
    status VARCHAR(50) DEFAULT 'active'
);

-- 3. Raw Materials Table (คลังสินค้าและวัตถุดิบเคมีภัณฑ์)
CREATE TABLE IF NOT EXISTS raw_materials (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    stock_qty DECIMAL(12,4) DEFAULT 0.0000,
    min_stock DECIMAL(12,4) DEFAULT 0.0000,
    status VARCHAR(50) DEFAULT 'active'
);

-- 4. BOM Recipes Table (สูตรการผลิตแม่บท)
CREATE TABLE IF NOT EXISTS bom_recipes (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    version VARCHAR(50) DEFAULT 'v1.0',
    status VARCHAR(50) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4b. BOM Items Table (รายการวัตถุดิบและสัดส่วนในสูตร)
CREATE TABLE IF NOT EXISTS bom_items (
    id SERIAL PRIMARY KEY,
    bom_id INT NOT NULL REFERENCES bom_recipes(id) ON DELETE CASCADE,
    raw_material_id INT REFERENCES raw_materials(id) ON DELETE SET NULL,
    material_name VARCHAR(255) NOT NULL,
    quantity DECIMAL(12,4) NOT NULL DEFAULT 0.0000,
    unit VARCHAR(50) DEFAULT 'กก.',
    notes VARCHAR(255)
);

-- 5. Production Orders Table (ใบสั่งผลิตเคมีภัณฑ์)
CREATE TABLE IF NOT EXISTS production_orders (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    customer_id INT NOT NULL REFERENCES customers(id),
    product_id INT NOT NULL REFERENCES products(id),
    quantity DECIMAL(12,4) NOT NULL,
    unit VARCHAR(50) DEFAULT 'ลิตร',
    status VARCHAR(50) DEFAULT 'pending',
    due_date DATE NOT NULL,
    staff VARCHAR(255),
    date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Packing Orders Table (ใบสั่งบรรจุภัณฑ์)
CREATE TABLE IF NOT EXISTS packing_orders (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    production_order_id INT NOT NULL REFERENCES production_orders(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    quantity DECIMAL(12,4) NOT NULL,
    unit VARCHAR(50) DEFAULT 'ขวด',
    status VARCHAR(50) DEFAULT 'pending'
);

-- 7. Purchase Orders Table (ใบสั่งซื้อเคมีภัณฑ์และวัตถุดิบ)
CREATE TABLE IF NOT EXISTS purchase_orders (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    supplier VARCHAR(255) NOT NULL,
    order_date DATE,
    status VARCHAR(50) DEFAULT 'pending',
    total_amount DECIMAL(14,2) DEFAULT 0.00
);

-- 7b. Purchase Order Items Table (รายการวัตถุดิบที่สั่งซื้อ)
CREATE TABLE IF NOT EXISTS purchase_order_items (
    id SERIAL PRIMARY KEY,
    purchase_order_id INT NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    raw_material_id INT REFERENCES raw_materials(id) ON DELETE SET NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity DECIMAL(12,3) NOT NULL DEFAULT 0.000,
    unit VARCHAR(50) DEFAULT 'กก.',
    unit_price DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    subtotal DECIMAL(14,2) NOT NULL DEFAULT 0.00
);

-- 8. GRNs Table (ใบรับสินค้าเข้าคลัง - Goods Received Notes)
CREATE TABLE IF NOT EXISTS grns (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    purchase_order_id INT NOT NULL REFERENCES purchase_orders(id),
    raw_material_id INT NOT NULL REFERENCES raw_materials(id),
    lot_number VARCHAR(100) NOT NULL,
    expiry_date DATE,
    received_qty DECIMAL(12,4) DEFAULT 0.0000,
    receiver VARCHAR(255),
    receive_date DATE,
    status VARCHAR(50) DEFAULT 'received'
);

-- 9. Prechecks Table (ใบตรวจสอบสารเคมีก่อนทำการผลิต)
CREATE TABLE IF NOT EXISTS prechecks (
    id SERIAL PRIMARY KEY,
    material VARCHAR(255) NOT NULL,
    lot VARCHAR(100) NOT NULL,
    expiry DATE,
    inspector VARCHAR(255),
    date DATE,
    result VARCHAR(50) DEFAULT 'pending'
);

-- 10. Inventory Pack Table (คลังขวด ฝา กล่อง และฉลาก)
CREATE TABLE IF NOT EXISTS inventory_pack (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    type VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    qty DECIMAL(12,4) DEFAULT 0.0000,
    unit VARCHAR(50) DEFAULT 'ชิ้น',
    status VARCHAR(50) DEFAULT 'active'
);

-- 11. Purchase Packs Table (การจัดซื้อบรรจุภัณฑ์และฝา)
CREATE TABLE IF NOT EXISTS purchase_packs (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    supplier VARCHAR(255) NOT NULL,
    item VARCHAR(255) NOT NULL,
    qty DECIMAL(12,4) DEFAULT 0.0000,
    price DECIMAL(12,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'pending'
);


-- ==========================================================
-- SEED SAMPLE DATA (ตัวอย่างข้อมูลตารางละ 1-5 รายการ)
-- ==========================================================

-- 1. Customers Seed Data
INSERT INTO customers (id, code, name, contact, phone, email, tax_id, address, status) VALUES
(1, 'C001', 'บจก. คลีน โปรดักส์ สยาม', 'คุณวิชัย รัตนชัย', '081-234-5678', 'wichai@cleanproducts.com', '0105561000123', '99/9 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110', 'active'),
(2, 'C002', 'หจก. พลังเขียว เคมิคอล', 'คุณสุดา ทรัพย์เจริญ', '089-876-5432', 'suda@greenpower.co.th', '0203554000456', '456 หมู่ 3 ต.บางปู อ.เมือง สมุทรปราการ 10280', 'active'),
(3, 'C003', 'บจก. ยูนิเวิร์ส นวัตกรรมสารทำความสะอาด', 'คุณมานพ เลิศวิจิตร', '02-444-5555', 'manop@universe-innovation.com', '0105564000789', '78/2 ถ.พระราม 2 แขวงแสมดำ เขตบางขุนเทียน กรุงเทพฯ 10150', 'active')
ON CONFLICT (code) DO NOTHING;

-- 2. Products Seed Data
INSERT INTO products (id, code, name, type, version, status) VALUES
(1, 'P-001', 'น้ำยาเคลือบเงารถยนต์ สูตรซิลิโคนแวกซ์ (Silicone Wax)', 'Liquid', 'v1.2', 'active'),
(2, 'P-002', 'แชมพูล้างรถสูตรโฟมเข้มข้น (Car Foam Shampoo)', 'Liquid', 'v1.0', 'active'),
(3, 'P-003', 'สารฆ่าเชื้อสุขอนามัย (Sanitizer Active Clean)', 'Liquid', 'v2.1', 'active')
ON CONFLICT (code) DO NOTHING;

-- 3. Raw Materials Seed Data
INSERT INTO raw_materials (id, code, name, unit, stock_qty, min_stock, status) VALUES
(1, 'RM-001', 'หัวเชื้อสารลดแรงตึงผิว SLES (Sodium Lauryl Ether Sulfate)', 'กก.', 1500.0000, 300.0000, 'active'),
(2, 'RM-002', 'ซิลิโคนออยล์บริสุทธิ์ 350 (Silicone Oil 350 cSt)', 'กก.', 850.5000, 150.0000, 'active'),
(3, 'RM-003', 'สารฆ่าเชื้อเบนซาลโคเนียม คลอไรด์ (BKC 80%)', 'กก.', 120.0000, 200.0000, 'active'),
(4, 'RM-004', 'กลิ่นสวีทออเรนจ์ (Sweet Orange Fragrance)', 'ลิตร', 45.0000, 10.0000, 'active'),
(5, 'RM-005', 'สีผสมเคมี สีน้ำเงินเข้ม (Deep Blue Pigment)', 'กก.', 12.4000, 5.0000, 'active')
ON CONFLICT (code) DO NOTHING;

-- Adjust standard autoincrement sequences after inserts
SELECT setval(pg_get_serial_sequence('customers', 'id'), coalesce(max(id), 1)) FROM customers;
SELECT setval(pg_get_serial_sequence('products', 'id'), coalesce(max(id), 1)) FROM products;
SELECT setval(pg_get_serial_sequence('raw_materials', 'id'), coalesce(max(id), 1)) FROM raw_materials;

-- 4. BOM Recipes Seed Data
INSERT INTO bom_recipes (id, product_id, version, status, notes) VALUES
(1, 1, 'v1.2', 'active', 'สูตรเคลือบเงารถยนต์เกรดพรีเมียม ป้องกันรังสียูวี'),
(2, 2, 'v1.0', 'active', 'สูตรโฟมเนียนนุ่ม สารทำความสะอาดจากพืช ปลอดภัยต่อสีผิวรถ'),
(3, 3, 'v2.1', 'active', 'สารฆ่าเชื้อประสิทธิภาพสูง สำหรับโรงงานอุตสาหกรรมอาหาร')
ON CONFLICT (id) DO NOTHING;

-- 4b. BOM Items Seed Data
INSERT INTO bom_items (id, bom_id, raw_material_id, material_name, quantity, unit, notes) VALUES
(1, 1, 2, 'ซิลิโคนออยล์บริสุทธิ์ 350 (Silicone Oil 350 cSt)', 0.1500, 'กก.', 'ผสมในขั้นตอนแรก'),
(2, 1, 4, 'กลิ่นสวีทออเรนจ์ (Sweet Orange Fragrance)', 0.0050, 'ลิตร', 'เติมในช่วงแต่งกลิ่นท้ายสุด'),
(3, 2, 1, 'หัวเชื้อสารลดแรงตึงผิว SLES (Sodium Lauryl Ether Sulfate)', 0.3500, 'กก.', 'กวนจนละลายหมดก่อนทำขั้นตอนถัดไป'),
(4, 2, 5, 'สีผสมเคมี สีน้ำเงินเข้ม (Deep Blue Pigment)', 0.0002, 'กก.', 'ละลายน้ำก่อนหยดผสม'),
(5, 3, 3, 'สารฆ่าเชื้อเบนซาลโคเนียม คลอไรด์ (BKC 80%)', 0.5000, 'กก.', 'สวมอุปกรณ์ป้องกันสารเคมีขณะผสม')
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('bom_recipes', 'id'), coalesce(max(id), 1)) FROM bom_recipes;
SELECT setval(pg_get_serial_sequence('bom_items', 'id'), coalesce(max(id), 1)) FROM bom_items;

-- 5. Production Orders Seed Data
INSERT INTO production_orders (id, code, customer_id, product_id, quantity, unit, status, due_date, staff, date) VALUES
(1, 'PO-2026-0001', 1, 1, 1000.0000, 'ลิตร', 'completed', '2026-07-15', 'นายปรีชา สารสุข', '2026-07-01'),
(2, 'PO-2026-0002', 2, 2, 2500.0000, 'ลิตร', 'processing', '2026-07-20', 'น.ส. นารี รักดี', '2026-07-02'),
(3, 'PO-2026-0003', 3, 3, 500.0000, 'ลิตร', 'pending', '2026-07-28', 'นายสุทิน มงคล', '2026-07-03')
ON CONFLICT (code) DO NOTHING;

-- 6. Packing Orders Seed Data
INSERT INTO packing_orders (id, code, production_order_id, item_name, quantity, unit, status) VALUES
(1, 'PK-2026-0001', 1, 'ขวดพลาสติก HDPE สีขาวกลม 1 ลิตร', 1000.0000, 'ขวด', 'completed'),
(2, 'PK-2026-0002', 2, 'แกลลอนพลาสติกสี่เหลี่ยม 5 ลิตร', 500.0000, 'ขกล.', 'pending')
ON CONFLICT (code) DO NOTHING;

-- 7. Purchase Orders Seed Data
INSERT INTO purchase_orders (id, code, supplier, order_date, status, total_amount) VALUES
(1, 'PR-2026-0001', 'บจก. สยามเคมีคอล ดิสทริบิวเตอร์', '2026-06-25', 'completed', 45800.00),
(2, 'PR-2026-0002', 'หจก. น่ำเซียน เคมิเคิลส์ (กรุงเทพ)', '2026-07-02', 'pending', 12500.00)
ON CONFLICT (code) DO NOTHING;

-- 7b. Purchase Order Items Seed Data
INSERT INTO purchase_order_items (id, purchase_order_id, raw_material_id, item_name, quantity, unit, unit_price, subtotal) VALUES
(1, 1, 1, 'หัวเชื้อสารลดแรงตึงผิว SLES (Sodium Lauryl Ether Sulfate)', 500.000, 'กก.', 80.00, 40000.00),
(2, 1, 5, 'สีผสมเคมี สีน้ำเงินเข้ม (Deep Blue Pigment)', 10.000, 'กก.', 580.00, 5800.00),
(3, 2, 4, 'กลิ่นสวีทออเรนจ์ (Sweet Orange Fragrance)', 10.000, 'ลิตร', 1250.00, 12500.00)
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('production_orders', 'id'), coalesce(max(id), 1)) FROM production_orders;
SELECT setval(pg_get_serial_sequence('packing_orders', 'id'), coalesce(max(id), 1)) FROM packing_orders;
SELECT setval(pg_get_serial_sequence('purchase_orders', 'id'), coalesce(max(id), 1)) FROM purchase_orders;
SELECT setval(pg_get_serial_sequence('purchase_order_items', 'id'), coalesce(max(id), 1)) FROM purchase_order_items;

-- 8. GRNs Seed Data
INSERT INTO grns (id, code, purchase_order_id, raw_material_id, lot_number, expiry_date, received_qty, receiver, receive_date, status) VALUES
(1, 'GRN-2026-0001', 1, 1, 'LOT-SLES-26A', '2028-06-25', 500.0000, 'สมชาย ใจงาม', '2026-06-28', 'received')
ON CONFLICT (code) DO NOTHING;

-- 9. Prechecks Seed Data
INSERT INTO prechecks (id, material, lot, expiry, inspector, date, result) VALUES
(1, 'หัวเชื้อสารลดแรงตึงผิว SLES (RM-001)', 'LOT-SLES-26A', '2028-06-25', 'น.ส. รินรดา อ่อนหวาน', '2026-06-29', 'pass'),
(2, 'ซิลิโคนออยล์บริสุทธิ์ 350 (RM-002)', 'LOT-SO-26B', '2028-04-10', 'น.ส. รินรดา อ่อนหวาน', '2026-07-01', 'pass'),
(3, 'สารฆ่าเชื้อเบนซาลโคเนียม คลอไรด์ (RM-003)', 'LOT-BKC-25H', '2027-08-15', 'น.ส. รินรดา อ่อนหวาน', '2026-07-02', 'pending')
ON CONFLICT (id) DO NOTHING;

-- 10. Inventory Pack Seed Data
INSERT INTO inventory_pack (id, code, type, name, qty, unit, status) VALUES
(1, 'PK-001', 'ขวด', 'ขวด HDPE สีขาวทึบ ขนาด 1 ลิตร', 2450.0000, 'ชิ้น', 'active'),
(2, 'PK-002', 'ฝา', 'ฝาสกรูพลาสติกกันรั่ว สีน้ำเงิน', 4800.0000, 'ชิ้น', 'active'),
(3, 'PK-003', 'ฉลาก', 'ฉลากสติกเกอร์เคลือบเงา น้ำยา P-001', 1500.0000, 'ชิ้น', 'active')
ON CONFLICT (code) DO NOTHING;

-- 11. Purchase Packs Seed Data
INSERT INTO purchase_packs (id, code, supplier, item, qty, price, status) VALUES
(1, 'PPR-2026-0001', 'บจก. ยูเนี่ยนพลาสติกแพ็คเกจ', 'ขวด HDPE สีขาวทึบ ขนาด 1 ลิตร', 5000.0000, 15000.00, 'completed'),
(2, 'PPR-2026-0002', 'หจก. ทรีดีไซน์ พริ้นติ้งกรุ๊ป', 'ฉลากสติกเกอร์เคลือบเงา น้ำยา P-001', 2000.0000, 3200.00, 'pending')
ON CONFLICT (code) DO NOTHING;

SELECT setval(pg_get_serial_sequence('grns', 'id'), coalesce(max(id), 1)) FROM grns;
SELECT setval(pg_get_serial_sequence('prechecks', 'id'), coalesce(max(id), 1)) FROM prechecks;
SELECT setval(pg_get_serial_sequence('inventory_pack', 'id'), coalesce(max(id), 1)) FROM inventory_pack;
SELECT setval(pg_get_serial_sequence('purchase_packs', 'id'), coalesce(max(id), 1)) FROM purchase_packs;

-- ==========================================================
-- END OF SCHEMA SCRIPT
-- ==========================================================
