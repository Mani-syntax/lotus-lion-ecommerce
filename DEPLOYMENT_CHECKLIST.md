# 🚀 Lotus & Lion - Deployment Checklist & Guide

## Critical Issues Found & Fixed

### ✅ Issue 1: Backend Vercel Deployment Handler
**Status**: FIXED
- **Problem**: `backend/api/index.js` had incorrect serverless function wrapper
- **Solution**: Changed to directly export Express app
- **File**: `backend/api/index.js`

### ✅ Issue 2: Image Upload & Display Flow
**Status**: Verified Working
- Images upload to `/admin/upload/multiple`
- Stored in Supabase with URLs
- Retrieved via product_images join table
- Properly mapped to camelCase in API response
- ProductCard component handles both string and object image formats

### ✅ Issue 3: Network Errors on Live Site
**Likely Causes**:
1. Vercel backend environment variables not set
2. Redis cache not configured (but gracefully falls back to memory)
3. CORS or API routing issues

---

## 🔐 Environment Variables Setup

### Backend Environment Variables
Set these in your Vercel project settings under "Environment Variables":

```env
# Supabase (REQUIRED)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Security (REQUIRED)
JWT_SECRET=your_jwt_secret_key_min_32_chars

# Optional
SUPABASE_STORAGE_BUCKET=lotus-lion
NODE_ENV=production
```

**How to get these**:
1. **SUPABASE_URL**: Go to Supabase Project Settings > API > Project URL
2. **SUPABASE_SERVICE_ROLE_KEY**: Go to Supabase Project Settings > API > Service Role (secret)
3. **JWT_SECRET**: Generate a random 32+ character string using: `openssl rand -base64 32`

### Frontend Environment Variables
Set these in Vercel project settings (or `.env.local` for local dev):

```env
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Optional (defaults to /api which works when frontend and backend are same domain)
NEXT_PUBLIC_API_URL=https://your-vercel-domain.vercel.app
```

---

## 📋 Pre-Deployment Checklist

### Database & Storage
- [ ] Supabase project created and accessible
- [ ] All migrations applied (001, 002, 003)
- [ ] Storage bucket `lotus-lion` created
- [ ] Bucket has public access permissions
- [ ] RLS policies properly configured

### Backend
- [ ] `backend/api/index.js` exports Express app correctly ✅
- [ ] Environment variables set on Vercel
- [ ] All required npm packages in `backend/package.json`
- [ ] Supabase client configured correctly
- [ ] JWT_SECRET is 32+ characters and secure

### Frontend
- [ ] Environment variables set on Vercel
- [ ] Supabase credentials are for ANON key (not service role)
- [ ] API endpoints properly configured
- [ ] Build succeeds: `npm run build`

### Vercel Configuration
- [ ] `vercel.json` in root directory
- [ ] Routes correctly map `/api/*` to backend
- [ ] Frontend routes map to Next.js app

---

## 🚀 Deployment Steps

### Step 1: Prepare Code
```bash
# From project root
git add .
git commit -m "Fix: Vercel backend deployment handler and prepare for production"
git push origin main
```

### Step 2: Deploy Backend
1. Go to https://vercel.com/dashboard
2. Create or select your project
3. Go to Settings > Environment Variables
4. Add all backend variables:
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
   - JWT_SECRET
5. Deploy or trigger deployment from git

**Test Backend**:
```bash
curl https://your-backend-vercel-domain.vercel.app/
# Should return: "Lotus & Lion API is running..."

curl https://your-backend-vercel-domain.vercel.app/api/products
# Should return JSON array of products
```

### Step 3: Deploy Frontend
1. Go to https://vercel.com/dashboard
2. Create or select your frontend project
3. Set Root Directory: `frontend`
4. Go to Settings > Environment Variables
5. Add all frontend variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - NEXT_PUBLIC_API_URL (if backend is different domain)
6. Deploy or trigger deployment from git

**Test Frontend**:
- Open https://your-frontend-vercel-domain.vercel.app
- Verify products load
- Test admin panel login

---

## 🧪 Testing Checklist

### Product Upload & Display
- [ ] Login to admin panel
- [ ] Add new product with multiple images
- [ ] Verify images upload without errors
- [ ] Save product
- [ ] Check Supabase: product appears in products table
- [ ] Check Supabase: images appear in product_images table
- [ ] Go to home page and verify product appears with images
- [ ] Click product to view details
- [ ] Verify all images display correctly

### Image Functionality
- [ ] Image carousel works on product card
- [ ] All images display on product detail page
- [ ] Images load fast (Supabase CDN)
- [ ] Images display on admin product list

### API Endpoints
- [ ] GET `/api/products` - returns all visible products with images
- [ ] GET `/api/products/:slug` - returns single product with all images
- [ ] GET `/api/admin/products` - admin list (protected)
- [ ] POST `/api/admin/products` - create with images (protected)
- [ ] PUT `/api/admin/products/:id` - update with new images (protected)

### Admin Functions
- [ ] Admin login works
- [ ] Product list loads
- [ ] Add product works
- [ ] Edit product works
- [ ] Delete product works
- [ ] Images upload in admin form
- [ ] Toggle featured/visibility works

---

## 🐛 Troubleshooting

### Images Not Showing on Live Site
**Symptoms**: Images show in admin but not on main website

**Solutions**:
1. Check Supabase Storage Bucket permissions
   - Go to Supabase > Storage > lotus-lion bucket
   - Ensure it allows public read access
2. Verify images are actually in database
   - Query Supabase: `SELECT * FROM product_images`
3. Check browser console for CORS errors
4. Verify image URLs are complete and valid
5. Clear browser cache and reload

### Admin Upload Fails
**Symptoms**: "Upload failed" toast message

**Solutions**:
1. Check backend environment variables are set correctly
2. Verify Supabase credentials
3. Check Supabase Storage bucket exists
4. Look at browser Network tab to see actual error
5. Check Vercel backend logs

### Products Not Showing
**Symptoms**: Blank product list

**Solutions**:
1. Verify products exist in database: `SELECT * FROM products WHERE is_visible = true`
2. Check if images are linked: `SELECT * FROM product_images`
3. Test API directly: `GET /api/products`
4. Check browser Network tab for API errors
5. Verify Supabase connection

### Network Error When Opening Product
**Symptoms**: "Network error" message when clicking product

**Solutions**:
1. This might be due to slow/timeout API response
2. Check backend is deployed and responding
3. Verify Supabase query performance
4. Check Vercel logs for timeout errors
5. Consider implementing request caching

---

## 📊 Performance Optimization

### For Production
1. **Enable Supabase Query Caching**: 5 minute cache for product lists
2. **Vercel Edge Caching**: Cache GET requests for 60 seconds
3. **Image Optimization**: Use Supabase CDN (automatic)
4. **Database Indexes**: Already added in schema
5. **Connection Pooling**: Supabase handles automatically

### Monitoring
- Check Vercel dashboard for function duration
- Monitor Supabase database usage
- Check storage bucket bandwidth
- Review slow queries in Supabase logs

---

## ✅ Final Checklist Before Go-Live

- [ ] All environment variables set on Vercel
- [ ] Backend and Frontend both deployed
- [ ] Database migrations applied
- [ ] Admin account created and tested
- [ ] Product images upload and display correctly
- [ ] Cart functionality works
- [ ] Checkout process complete
- [ ] Admin dashboard loads
- [ ] No console errors on live site
- [ ] Images load fast
- [ ] Mobile responsive
- [ ] All links work correctly

---

## 📞 Support

For issues:
1. Check Vercel logs: Vercel Dashboard > Deployments > View Logs
2. Check Supabase logs: Supabase Dashboard > Logs
3. Check browser console: F12 > Console tab
4. Check Network tab: F12 > Network tab (filter API calls)

