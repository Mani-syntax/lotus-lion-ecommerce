# 🚀 Deployment Guide - Image Display Fixes

## ✅ Issues Fixed

### 1. Admin Portal Collection Hero Error (CRITICAL)
**Problem**: "Could not find the 'hero' column of 'collections' in the schema cache"
**Solution**: Added `hero` JSONB column to collections table
**Migration**: `supabase/migrations/006_add_collection_hero.sql`
**Impact**: Admin can now upload and manage collection hero images

### 2. Product Page Image Sizing (FEATURE)
**Problem**: Product images were too small on product detail page
**Solution**: 
- Changed layout from 50/50 grid to 60/40 (image/details)
- Increased image size to 3:4 aspect ratio (portrait)
- Made details section sticky on desktop
- Enlarged text sizes and buttons
**Impact**: Products display prominently with better visual hierarchy

### 3. Collection Page Display (FEATURE)
**Problem**: Collection hero images not displaying properly
**Solution**:
- Updated collection page to support hero section
- Full-height hero with hero image, title, subtitle
- 3:4 aspect ratio product grid items
**Impact**: Collections display with beautiful hero images and better layout

---

## 🚀 Deployment Steps

### Step 1: Apply Database Migration

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql
   - Click "New Query" or go to SQL Editor

2. **Execute this migration:**

```sql
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
```

3. **Verify the migration**
   - Go to Collections table structure
   - Confirm `hero` column is now present

---

### Step 2: Deploy Frontend Changes

#### Option A: Deploy via Git Push (Recommended)
```bash
# From project root
git add .
git commit -m "feat: add collection hero images and improve product page image sizing"
git push origin main
```

The Vercel deployment will automatically trigger and deploy your changes.

#### Option B: Manual Vercel Deployment
1. Go to https://vercel.com/dashboard
2. Select the Lotus & Lion project
3. Trigger a redeploy from the "Deployments" tab
4. Or push a new commit to trigger automatic deployment

---

### Step 3: Test Deployment

#### Test 1: Collection Hero Upload
1. Go to: https://your-domain.com/admin/collections/lotus
2. Scroll to "Collection Hero" section
3. Upload an image for the hero section
4. Fill in: Eyebrow, Title, Subtitle
5. Click "Save Collection"
6. Verify no errors appear

#### Test 2: View Collection Page
1. Go to: https://your-domain.com/collections/lotus
2. Verify the hero image displays full-screen
3. Verify hero title and subtitle display
4. Check product grid displays in 3:4 aspect ratio

#### Test 3: Product Page Image Display
1. Go to: https://your-domain.com/product/blazer (or any product)
2. Verify the main product image is large and prominent
3. Check image aspect ratio is 3:4 (portrait)
4. Verify thumbnail grid displays 5 items across
5. Click thumbnails to change main image

---

## 📝 Files Modified

### Database
- `supabase/migrations/006_add_collection_hero.sql` - NEW

### Frontend
- `frontend/src/app/(shop)/product/[slug]/page.tsx` - MODIFIED
  - Updated grid layout (60/40 instead of 50/50)
  - Increased image size to 3:4 aspect ratio
  - Made details sticky
  - Enlarged typography
  
- `frontend/src/app/(shop)/collections/[slug]/page.tsx` - MODIFIED
  - Added hero interface
  - Enhanced hero section to full-screen
  - Updated product grid aspect ratio
  - Better spacing and typography

### Backend
- No changes needed (API already supports hero field)

---

## 🔍 Verification Checklist

- [ ] Database migration applied successfully
- [ ] Collection hero column exists in Supabase
- [ ] Frontend deployment completed
- [ ] Admin collection hero upload works
- [ ] Collection pages display hero images
- [ ] Product pages show large images
- [ ] Responsive design works on mobile
- [ ] No console errors

---

## ⚠️ Important Notes

1. **Existing Collections**: Old collections without hero images will use `banner_url` as fallback
2. **No Data Loss**: Migration adds column without affecting existing data
3. **Backward Compatible**: Frontend works with both old and new image format
4. **Image Optimization**: Ensure hero images are optimized (recommend 2000x2500px for best quality)

---

## 🆘 Troubleshooting

### Issue: Still seeing "Could not find the 'hero' column" error
**Solution**: 
- Refresh the browser cache: Ctrl+Shift+Delete
- Clear browser localStorage: Chrome DevTools > Application > Clear all
- Make sure migration was successfully applied in Supabase

### Issue: Images not displaying on collection page
**Solution**:
- Verify image URL is public/accessible
- Check Supabase Storage permissions are set to "public"
- Ensure image is properly uploaded to storage

### Issue: Product image looks distorted
**Solution**:
- Verify image aspect ratio is close to 3:4
- Use Next.js Image component optimization (already implemented)
- Check image dimensions in storage

---

## 📞 Need Help?

If you encounter any issues:
1. Check the browser console for errors (F12)
2. Verify Supabase database migration was applied
3. Check Supabase logs for any errors
4. Review the files in `/supabase/migrations/` directory
