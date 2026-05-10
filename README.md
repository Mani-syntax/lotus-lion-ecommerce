# 🌸 Lotus & Lion - Luxury Fashion E-Commerce Platform

> A production-ready, scalable luxury clothing brand platform built with Next.js, Supabase, and modern web technologies.

## 🎯 Overview

Lotus & Lion is a complete luxury fashion e-commerce platform featuring:

- **Dynamic Collections**: Lotus and Lion collections with separate products and branding
- **Full Admin Control**: CMS, product management, order tracking, blog system
- **Advanced Features**: Scheduled drops, inventory management, rich content editing
- **Premium Design**: Black, white, and gold luxury aesthetic with smooth animations
- **Production Ready**: Real-world scalable architecture with best practices

## 💻 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, React 19, Tailwind CSS, Framer Motion |
| **Backend** | Supabase (PostgreSQL), APIs |
| **Authentication** | Supabase Auth with JWT |
| **Payments** | Razorpay (INR) |
| **Images** | Cloudinary |
| **State** | Zustand + localStorage |
| **Hosting** | Vercel (Frontend), Supabase (Backend) |

## 🚀 Quick Start

### 1️⃣ Prerequisites
- Node.js 18+
- Supabase account
- Cloudinary account
- Razorpay account (India)

### 2️⃣ Environment Setup
```bash
cd frontend
cp .env.example .env.local
# Fill in your credentials from Supabase, Cloudinary, and Razorpay
```

### 3️⃣ Install & Run
```bash
npm install
npm run dev
# Open http://localhost:3000
```

## 📁 Project Structure

```
lotus-lion/
├── frontend/              # Next.js application
│   ├── src/app/          # Pages and routes
│   ├── components/       # React components
│   ├── lib/              # Services and utilities
│   ├── store/            # Zustand stores
│   └── public/           # Static assets
├── supabase/             # Database schema
│   └── migrations/       # SQL migrations
├── SETUP_GUIDE.md        # Detailed setup instructions
└── IMPLEMENTATION_GUIDE.md # Feature checklist
```

## 🚀 Core Features

### For Customers ✨
- Luxurious, responsive design
- Dynamic product browsing
- Persistent shopping cart
- Razorpay payment (INR)
- Blog reading
- Account management

### For Admins 📊
- Analytics dashboard
- Product management (CRUD)
- Collection management
- Blog management
- Order management
- CMS & content editing
- Inventory tracking
- Email notifications

## 📚 Documentation

**Start here**:
1. [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Complete setup with credentials
2. [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - Feature checklist

## 💳 Payments

**Razorpay** (India-only):
- INR currency support
- Test and live modes
- Payment verification
- Order creation

## 🖼️ Images

**Cloudinary**:
- Optimized delivery
- Automatic resizing
- CDN caching

# Install frontend dependencies
cd ../frontend
npm install --ignore-scripts # Use ignore-scripts if you encounter build errors
```

### 4. Running Locally
```bash
# Start backend (from /backend)
npm run dev

# Start frontend (from /frontend)
npm run dev
```

## Admin Access
- **Email**: `admin@example.com`
- **Password**: `password123`
- Access the management panel at `/admin/products`.

## Deployment

### Frontend (Vercel)
1. Push the code to GitHub.
2. Connect your repo to Vercel.
3. Set the `Root Directory` to `frontend`.
4. Add environment variables.

### Backend (Render / Heroku / AWS)
1. Deploy the `backend` folder as a separate web service.
2. Ensure `MONGODB_URI` and other secrets are set in the environment.
3. Update `NEXT_PUBLIC_API_URL` on the frontend to point to your live backend URL.

---
Built with excellence by Lotus & Lion.
