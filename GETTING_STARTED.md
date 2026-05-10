# 🚀 Getting Started Checklist

## Phase 1: Setup (1-2 hours)

### ✅ Supabase Setup
- [ ] Create Supabase account (https://supabase.com)
- [ ] Create new project
- [ ] Get `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Run SQL schema from `/supabase/migrations/001_init_schema.sql`
- [ ] Create admin user in Supabase Auth
- [ ] Update admin user role to 'admin' in users table

### ✅ Cloudinary Setup
- [ ] Create Cloudinary account (https://cloudinary.com)
- [ ] Get `Cloud Name`, `API Key`, `API Secret`
- [ ] Create unsigned upload preset named `lotus-lion`
- [ ] Copy to `.env.local`

### ✅ Razorpay Setup
- [ ] Create Razorpay account (https://razorpay.com) - **India only**
- [ ] Get test `Key ID` and `Key Secret`
- [ ] Copy to `.env.local`

### ✅ Frontend Setup
- [ ] Copy `.env.example` to `.env.local`
- [ ] Fill in all environment variables
- [ ] Run `npm install` in `/frontend`
- [ ] Run `npm run dev`
- [ ] Access http://localhost:3000

### ✅ Verify Setup
- [ ] Homepage loads without errors
- [ ] Admin panel accessible at /admin
- [ ] Can view products
- [ ] Can add product to cart
- [ ] Cart persists after page reload

---

## Phase 2: Core Features (2-3 hours)

### ✅ Product Management
- [ ] Create test products in admin
- [ ] Assign to collections (Lotus/Lion)
- [ ] Upload product images
- [ ] Set variants (sizes/colors)
- [ ] Test product page loads
- [ ] Test collection filtering

### ✅ Collections
- [ ] Verify Lotus collection exists
- [ ] Verify Lion collection exists
- [ ] View collection pages
- [ ] Check products filtered correctly
- [ ] Verify collection banners load

### ✅ Cart & Checkout
- [ ] Test adding items to cart
- [ ] Test removing items
- [ ] Test quantity updates
- [ ] Test cart persistence
- [ ] View checkout page

### ✅ Authentication
- [ ] Test signup flow
- [ ] Test login flow
- [ ] Test logout
- [ ] Verify JWT token storage
- [ ] Test protected routes

---

## Phase 3: Advanced Features (3-4 hours)

### ✅ Payment Integration
- [ ] Configure Razorpay test keys
- [ ] Test order creation
- [ ] Test payment modal
- [ ] Verify payment signature
- [ ] Test order confirmation
- [ ] Check order in database

### ✅ Blog System
- [ ] Create test blog post
- [ ] Add featured image
- [ ] Publish blog
- [ ] View blog listing
- [ ] View blog detail page
- [ ] Test search functionality

### ✅ Admin Features
- [ ] Dashboard loads stats
- [ ] Product CRUD works
- [ ] Order management
- [ ] User management (view users)
- [ ] Settings page
- [ ] Content editor

### ✅ CMS System
- [ ] Edit homepage sections
- [ ] Update navbar links
- [ ] Update footer links
- [ ] Change website settings
- [ ] Verify frontend reflects changes

---

## Phase 4: Optimization & Deployment (2-3 hours)

### ✅ Performance
- [ ] Test image optimization
- [ ] Check page load times
- [ ] Verify lazy loading works
- [ ] Test on mobile device
- [ ] Check responsive design
- [ ] Run Lighthouse audit (target: >90)

### ✅ Security
- [ ] Enable HTTPS
- [ ] Test RLS policies
- [ ] Verify admin-only endpoints
- [ ] Test input validation
- [ ] Check CORS headers
- [ ] Verify no sensitive data in frontend

### ✅ Testing
- [ ] Test all happy paths
- [ ] Test error states
- [ ] Test edge cases
- [ ] Test on different browsers
- [ ] Test on different devices
- [ ] Test payment with test card

### ✅ Deployment
- [ ] Push code to GitHub
- [ ] Deploy to Vercel
- [ ] Set environment variables
- [ ] Test deployed site
- [ ] Setup custom domain (optional)
- [ ] Setup monitoring

---

## Environment Variables Template

Copy and fill this in `.env.local`:

```env
# ===== SUPABASE =====
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ===== CLOUDINARY =====
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=lotus-lion
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abc123def456

# ===== RAZORPAY =====
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_1234567890
RAZORPAY_KEY_SECRET=abcdefghijklmnopqrst

# ===== URLS =====
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Useful Commands

```bash
# Development
cd frontend
npm run dev                  # Start dev server
npm run build              # Build for production
npm start                  # Run production build

# Database
# Access Supabase SQL Editor to run migrations

# Deployment
# Push to GitHub → Auto-deploy to Vercel
```

---

## Key File Locations

```
Services:
- Products: lib/services/productsService.ts
- Collections: lib/services/collectionsService.ts
- Orders: lib/services/ordersService.ts
- Blogs: lib/services/blogsService.ts
- CMS: lib/services/cmsService.ts
- Razorpay: lib/services/razorpayService.ts
- Cloudinary: lib/services/cloudinaryService.ts

Components:
- Admin Dashboard: components/admin/Dashboard.tsx
- Admin Products: components/admin/ProductManagement.tsx

Pages:
- Collections: app/(shop)/collections/[slug]/page.tsx
- Product Detail: app/(shop)/product/[slug]/page.tsx

Stores:
- Cart & Auth: store/useStore.ts

API Routes:
- Razorpay Create Order: app/api/razorpay/create-order/route.ts
- Razorpay Verify: app/api/razorpay/verify-payment/route.ts
- Cloudinary Delete: app/api/cloudinary/delete/route.ts
- Cloudinary Metadata: app/api/cloudinary/metadata/route.ts
```

---

## Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| Supabase connection error | Check URL and ANON_KEY in .env.local |
| Cloudinary upload fails | Verify cloud name and upload preset |
| Razorpay payment fails | Check KEY_ID in frontend, KEY_SECRET in backend |
| Admin can't edit | Verify user role is 'admin' in users table |
| Products not showing | Check is_visible=true and release_date is null or past |
| Images not loading | Check Cloudinary credentials |
| Cart not persisting | Check browser localStorage enabled |
| 404 on collection page | Verify collection slug in database |

---

## Support Resources

1. **Supabase Dashboard**: https://supabase.com/dashboard
2. **Cloudinary Dashboard**: https://cloudinary.com/console
3. **Razorpay Dashboard**: https://dashboard.razorpay.com
4. **Vercel Dashboard**: https://vercel.com/dashboard

---

## Final Checklist Before Production

- [ ] All environment variables set
- [ ] Database backed up
- [ ] Images backed up to Cloudinary
- [ ] Payment in live mode (not test)
- [ ] SSL certificate active
- [ ] Error tracking enabled
- [ ] Analytics configured
- [ ] Support email configured
- [ ] Monitoring setup
- [ ] Disaster recovery plan

---

**Estimated Total Time**: 8-12 hours for complete setup and testing

**Version**: 1.0.0  
**Last Updated**: May 8, 2026
