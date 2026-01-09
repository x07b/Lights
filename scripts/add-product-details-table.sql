-- ============================================
-- PRODUCT DETAILS SECTIONS TABLE
-- ============================================
-- Add this table to store product detail sections ("Détails du produit")
-- These are the accordion sections that appear on the product detail page

CREATE TABLE IF NOT EXISTS product_details_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_product_details_sections_product_id ON product_details_sections(product_id);
CREATE INDEX IF NOT EXISTS idx_product_details_sections_order ON product_details_sections(product_id, order_index);

-- Enable RLS
ALTER TABLE product_details_sections ENABLE ROW LEVEL SECURITY;

-- Public read access
DROP POLICY IF EXISTS "Product details sections are viewable by everyone" ON product_details_sections;
CREATE POLICY "Product details sections are viewable by everyone"
  ON product_details_sections FOR SELECT
  USING (true);

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_product_details_sections_updated_at ON product_details_sections;
CREATE TRIGGER update_product_details_sections_updated_at
  BEFORE UPDATE ON product_details_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
