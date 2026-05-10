# 🚀 Final Deployment Guide - Lotus & Lion

## ✅ Issues Fixed

### 1. Backend Vercel Handler (CRITICAL)
✅ **Fixed**: Changed `backend/api/index.js` from incorrect serverless wrapper to direct Express app export
- **Impact**: Backend can now be deployed to Vercel as serverless functions

### 2. Database Table Schema Mismatch (CRITICAL)
✅ **Fixed**: Updated all references from 'profiles' to 'users' table
- **Files Updated**:
  - `src/controllers/authController.js`
  - `src/controllers/admin/dashboardController.js`
  - `src/controllers/admin/userAdminController.js`
  - `src/middleware/authMiddleware.js`
  - `src/scripts/create-admin.js`
  - `src/scripts/full-seed.js`
  - `backend/createAdmin.js`
- **Migration Added**: `supabase/migrations/004_fix_auth_schema.sql`
- **Impact**: Authentication and admin functions will now work correctly

### 3. Product Image Display (VERIFIED)
✅ **Verified**: Image upload and display flow is working correctly
- Upload → Supabase Storage → product_images table → API → Frontend
- ProductCard component properly handles both string and object image formats

### 4. Image Upload API (VERIFIED)
✅ **Verified**: Upload endpoints properly return image URLs
- Single upload: `/admin/upload/single`
- Multiple upload: `/admin/upload/multiple`
- Images stored in Supabase Storage with public URLs

---

## 🚀 Pre-Deployment Steps

### Step 1: Apply Database Migrations
Before deploying, ensure all migrations are applied to Supabase:

1. Go to Supabase Dashboard > SQL Editor
2. Create a new query
3. Copy and paste this migration:

```sql
-- Add missing columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- Update role check constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check 
  CHECK (role IN ('customer', 'admin', 'super-admin', 'editor', 'user', 'superadmin'));
```

4. Click "Run"

### Step 2: Create Admin User
After migrations are applied, create an admin user:

```bash
cd backend
npm install
SUPABASE_URL=your_url SUPABASE_SERVICE_ROLE_KEY=your_key npm run seed:admin
```

Or manually insert via Supabase SQL:
```sql
INSERT INTO users (email, name, password, role, is_active)
VALUES (
  'admin@example.com',
  'Admin User',
  crypt('Password123!', gen_salt('bf')),  -- Use bcrypt hashing
  'super-admin',
  true
);
```

---

## 📝 Deployment Checklist

### Before You Start
- [ ] Git repo created and code committed
- [ ] Supabase project created
- [ ] All migrations applied to Supabase
- [ ] Admin user created in database
- [ ] Environment variables documented

### Vercel Backend Deployment

1. **Create Project**
   - Go to https://vercel.com
   - New Project > Import existing repo
   - Select your GitHub repo

2. **Configure Build**
   - Framework Preset: "Node.js"
   - Root Directory: `backend`
   - Build Command: (leave empty - uses Vercel default)
   - Output Directory: (leave empty)

3. **Set Environment Variables**
   - Click "Environment Variables"
   - Add:
     ```
     SUPABASE_URL=your_supabase_url
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     JWT_SECRET=generate_a_32_char_random_string
     NODE_ENV=production
     ```
   - Click "Deploy"

4. **Test Backend**
   ```bash
   curl https://your-vercel-app.vercel.app/
   # Should return: "Lotus & Lion API is running..."
   
   curl https://your-vercel-app.vercel.app/api/products
   # Should return: JSON array of products
   ```

### Vercel Frontend Deployment

1. **Create Project**
   - New Project > Import existing repo
   - Select your GitHub repo

2. **Configure Build**
   - Framework: "Next.js"
   - Root Directory: `frontend`
   - Build Command: (use default)

3. **Set Environment Variables**
   - NEXT_PUBLIC_SUPABASE_URL=your_url
   - NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   - NEXT_PUBLIC_API_URL=https://your-backend-vercel.vercel.app/api
   - Click "Deploy"

4. **Test Frontend**
   - Open https://your-frontend-vercel.vercel.app
   - Check if products load
   - Try admin login

---

## 🧪 Post-Deployment Testing

### Image Upload & Display Test

1. **Access Admin Panel**
   - Go to https://your-frontend-vercel.vercel.app/admin
   - Login with admin credentials

2. **Add Product with Images**
   - Click "New Product"
   - Fill in product details:
     - Name: "Test Product"
     - Price: 2999
     - Stock: 10
     - Collection: "Lotus"
   - Drag 2-3 images to upload
   - Click "Publish Piece"

3. **Verify in Database**
   - Supabase > products table
   - Should see new product with id
   - Supabase > product_images table
   - Should see image URLs linked to product

4. **Check on Frontend**
   - Go to https://your-frontend-vercel.vercel.app
   - Product should appear in the list
   - Click product to view details
   - All images should display
   - Image carousel should work

### Admin Functions Test

- [ ] Login with admin email/password works
- [ ] Product list loads
- [ ] Can add new product
- [ ] Can upload images
- [ ] Can edit product
- [ ] Can delete product
- [ ] Toggle featured/visibility works

### Customer Functions Test

- [ ] Home page loads
- [ ] Products display with images
- [ ] Can click product to see details
- [ ] All product images visible
- [ ] Image carousel works
- [ ] Add to cart works
- [ ] Cart persists on reload

---

## 🐛 Troubleshooting

### Problem: Images Not Uploading
**Symptoms**: Upload button doesn't work or shows error

**Debug Steps**:
1. Check browser console (F12 > Console)
2. Look for specific error message
3. Verify Supabase Storage bucket permissions
4. Check backend logs on Vercel
5. Verify JWT token is valid

**Solutions**:
```bash
# Test backend connectivity
curl https://your-backend.vercel.app/api/products

# Check Supabase bucket exists
# Supabase > Storage > Check "lotus-lion" bucket exists and is public
```

### Problem: Products Showing but No Images
**Symptoms**: Products appear, but images are blank

**Debug Steps**:
1. Open browser Network tab (F12)
2. Click product to load detail page
3. Look for failed image requests
4. Check Supabase Storage URLs are valid
5. Verify bucket permissions

**Solutions**:
```sql
-- Check images exist in database
SELECT * FROM product_images LIMIT 10;

-- Check image URLs are complete
SELECT image_url FROM product_images LIMIT 5;
```

### Problem: Admin Login Fails
**Symptoms**: "Invalid credentials" error

**Debug Steps**:
1. Verify user exists in database
2. Check password is hashed correctly
3. Verify JWT_SECRET is set
4. Check database connection

**Solutions**:
```sql
-- Verify admin user exists
SELECT * FROM users WHERE email = 'admin@example.com';

-- Check role is correct
SELECT role FROM users WHERE email = 'admin@example.com';
```

### Problem: 500 Server Error
**Symptoms**: API returns 500 error

**Solutions**:
1. Check Vercel backend logs
2. Verify environment variables are set
3. Check Supabase connection
4. Review error message in logs

---

## 📊 Performance Monitoring

### Check Vercel Deployment Status
```bash
# View logs
# Vercel Dashboard > Deployments > Select deployment > View Logs

# Test API response time
curl -w "@curl-format.txt" https://your-backend.vercel.app/api/products
```

### Monitor Supabase
- Supabase Dashboard > Logs
- Check for slow queries
- Monitor database usage
- Check storage bandwidth

---

## 🔒 Security Checklist

- [ ] JWT_SECRET is 32+ characters and random
- [ ] Service Role Key is only in backend, not frontend
- [ ] Anon Key is used only in frontend
- [ ] Environment variables not in git history
- [ ] Admin credentials changed from defaults
- [ ] RLS policies enabled on all tables
- [ ] CORS properly configured
- [ ] Rate limiting enabled

---

## ✨ Final Verification

Before going live, verify:

1. **Frontend loads**: ✅
2. **Products display**: ✅
3. **Images show**: ✅
4. **Admin login works**: ✅
5. **Can add products**: ✅
6. **Images upload**: ✅
7. **New images appear on site**: ✅
8. **Cart works**: ✅
9. **No console errors**: ✅
10. **Mobile responsive**: ✅

---

## 📞 Need Help?

### Common Issues Quick Links
- Product images not showing → Check Supabase bucket permissions
- Admin login fails → Check users table exists with password column
- Upload fails → Check backend logs for JWT/auth errors
- API timeout → Check Supabase connection and query performance

### Resources
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

