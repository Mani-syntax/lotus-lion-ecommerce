-- ===================================================
-- Add Hero Column to Collections Table
-- ===================================================

-- Add hero JSONB column to store hero section data
ALTER TABLE collections
ADD COLUMN IF NOT EXISTS hero JSONB DEFAULT NULL;

-- Add comment documenting the hero field structure
COMMENT ON COLUMN collections.hero IS 
'JSON object containing hero section data: {
  "eyebrow": "Optional eyebrow text",
  "title": "Hero title",
  "subtitle": "Hero subtitle/description",
  "image": "URL to hero image",
  "ctaText": "Call-to-action button text",
  "ctaLink": "Call-to-action button link"
}';

-- Create index for better query performance on hero data
CREATE INDEX IF NOT EXISTS idx_collections_hero ON collections USING GIN(hero);
