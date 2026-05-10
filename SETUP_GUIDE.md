# Lotus & Lion - Production Setup Guide

## Overview
Complete production-level luxury fashion e-commerce platform built with:
- **Frontend**: Next.js, React, Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL)
- **Payments**: Razorpay (INR)
- **Images**: Cloudinary
- **Deployment**: Vercel (Frontend), Supabase (Backend)

---

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (https://supabase.com)
- Cloudinary account (https://cloudinary.com)
- Razorpay account (https://razorpay.com)
- Vercel account (https://vercel.com)

---

## 🔧 Step 1: Supabase Setup

### 1.1 Create Supabase Project
1. Go to https://supabase.com and sign up/login
2. Click "New Project"
3. Fill in:
   - Project name: `lotus-lion`
   - Database password: (save this)
   - Region: Choose closest to you
4. Wait for project to be created (5-10 minutes)

### 1.2 Get API Keys
1. Go to Settings > API
2. Copy:
   - `NEXT_PUBLIC_SUPABASE_URL` (Project URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Anon/Public Key)

### 1.3 Create Database Schema
1. Go to SQL Editor in Supabase dashboard
2. Create a new query
3. Copy and paste the entire content from `/supabase/migrations/001_init_schema.sql`
4. Click "Run"
5. Wait for tables to be created

### 1.4 Enable Realtime (Optional)
1. Go to Realtime in the left sidebar
2. Enable for `products`, `orders`, `blogs` tables

---

## 🎨 Step 2: Cloudinary Setup

### 2.1 Get Cloudinary Credentials
1. Sign up at https://cloudinary.com
2. Go to Dashboard
3. Copy:
   - `Cloud Name`
   - `API Key`
   - `API Secret`

### 2.2 Create Upload Preset (Optional but Recommended)
1. Go to Settings > Upload
2. Scroll to "Upload presets"
3. Click "Add upload preset"
4. Name: `lotus-lion`
5. Signing Mode: Unsigned (for frontend uploads)
6. Save `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

---

## 💳 Step 3: Razorpay Setup

### 3.1 Get Razorpay Credentials
1. Sign up at https://razorpay.com (India only)
2. Go to Settings > API Keys
3. Copy:
   - `Key ID` → `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - `Key Secret` → `RAZORPAY_KEY_SECRET`

### 3.2 Enable Test Mode
- Start with test keys for development
- Switch to live keys in production

---

## 📱 Step 4: Frontend Setup

### 4.1 Environment Variables
Create `.env.local` in `/frontend`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=lotus-lion
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# URLs
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4.2 Install Dependencies
```bash
cd frontend
npm install
```

### 4.3 Run Development Server
```bash
npm run dev
```
Open http://localhost:3000

---

## 🧪 Step 5: Testing

### 5.1 Test Admin Panel
1. Go to http://localhost:3000/admin
2. Login with:
   - Email: `admin@example.com`
   - Password: (Set in Supabase via Auth > Users)

### 5.2 Add Sample Data
1. Go to Admin Dashboard
2. Click "Manage Products"
3. Add a test product with:
   - Name: "Test Product"
   - Price: 2999
   - Stock: 10
   - Collection: "Lotus"

### 5.3 Test Cart
1. Go to home page
2. Add product to cart
3. Check cart persists (Zustand + localStorage)

### 5.4 Test Checkout
1. Go to checkout
2. Fill form
3. Click "Pay with Razorpay"
4. Use test card: `4111 1111 1111 1111`

---

## 🚀 Step 6: Deployment to Vercel

### 6.1 Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main
```

### 6.2 Deploy Frontend
1. Go to https://vercel.com
2. Click "New Project"
3. Import from GitHub
4. Select `lotus-lion` repository
5. Root Directory: `frontend`
6. Add Environment Variables (from `.env.local`)
7. Click Deploy

### 6.3 Domain Setup
1. In Vercel project settings
2. Add custom domain
3. Update DNS records

---

## 📊 Database Schema Overview

### Users
```
id, email, name, role, phone, is_active, created_at
```

### Collections
```
id, name, slug, description, banner_url, color_primary, is_active
```

### Products
```
id, name, slug, price, discount_price, collection_id, 
stock_quantity, is_featured, is_visible, release_date, created_at
```

### Orders
```
id, user_id, order_number, status, total_amount, 
payment_status, razorpay_order_id, created_at
```

### Blogs
```
id, title, slug, content, author_id, is_published, published_at
```

### Homepage Sections
```
id, section_key, section_type, title, content, is_active
```

---

## 🛣️ API Routes to Create (Backend)

Create these in `/api` folder:

### POST `/api/razorpay/create-order`
Creates Razorpay order

### POST `/api/razorpay/verify-payment`
Verifies payment signature

### POST `/api/cloudinary/delete`
Deletes image from Cloudinary

### POST `/api/admin/products`
Create/update products (admin only)

### GET `/api/admin/stats`
Dashboard analytics

---

## 🔐 Security Checklist

- [ ] Enable Row Level Security (RLS) on all Supabase tables
- [ ] Set admin-only policies for product updates
- [ ] Use environment variables for all secrets
- [ ] Implement rate limiting
- [ ] Validate all inputs
- [ ] Use HTTPS in production
- [ ] Enable CORS only for your domain
- [ ] Implement password hashing
- [ ] Setup 2FA for admin accounts

---

## 📈 Performance Optimization

1. **Image Optimization**
   - Use Cloudinary URLs with transformations
   - Example: `url + "?w=500&q=auto&f=auto"`

2. **Caching**
   - Enable Supabase query caching
   - Use Vercel Edge Caching

3. **Code Splitting**
   - Next.js auto code splitting
   - Lazy load heavy components with dynamic()

4. **Database**
   - Create indexes (already in schema)
   - Use pagination for lists

---

## 🐛 Troubleshooting

### Supabase Connection Error
- Check NEXT_PUBLIC_SUPABASE_URL is correct
- Verify ANON_KEY is not SERVICE_ROLE_KEY
- Ensure RLS policies allow your role

### Image Upload Fails
- Check Cloudinary credentials
- Verify unsigned upload preset
- Check file size < 100MB

### Payment Gateway Not Working
- Verify Razorpay KEY_ID is in frontend
- Check Key Secret is in backend env
- Use test keys first

### Admin Access Denied
- Verify user role is 'admin' in Supabase
- Check RLS policy allows admin access
- Clear browser cache

---

## 📚 Useful Links

- Supabase Docs: https://supabase.com/docs
- Cloudinary Docs: https://cloudinary.com/documentation
- Razorpay Docs: https://razorpay.com/docs
- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs

---

## 🎯 Next Steps

1. Customize brand colors
2. Add your logo and images
3. Set up email notifications
4. Configure payment webhook
5. Setup analytics (Google Analytics)
6. Create support documentation
7. Setup monitoring and error tracking
8. Create backup strategy

---

## 📞 Support

For issues or questions:
1. Check Supabase status page
2. Check Cloudinary dashboard
3. Review error logs in Vercel
4. Check browser console for client errors

---

**Version**: 1.0.0  
**Last Updated**: May 8, 2026  
**Status**: Production Ready
