# Lotus & Lion - Luxury E-Commerce Platform

A production-ready, scalable, and dynamic clothing brand platform built with the MERN stack (MongoDB, Express, React/Next.js, Node.js).

## Tech Stack
- **Frontend**: Next.js 15 (App Router), Tailwind CSS v4, Lucide Icons, Framer Motion, Zustand.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt.
- **Payment**: Stripe Integration ready.
- **Images**: Cloudinary ready.

## Core Features
1. **Premium UI/UX**: Minimal luxury theme (Black, White, Gold).
2. **Dynamic Collection**: Admin panel to add/edit/delete products instantly.
3. **Cart & Checkout**: Persistent cart and secure checkout flow.
4. **Auth System**: JWT-based login and registration.
5. **Inventory Management**: Real-time stock tracking and price updates.
6. **Mobile First**: Fully responsive design for all devices.

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB
- Stripe Account (for API keys)
- Cloudinary Account (for image hosting)

### 2. Environment Setup
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

Create a `.env.local` file in the `frontend/` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Installation & Seeding
```bash
# Install backend dependencies
cd backend
npm install
npm run data:import # Seed sample data

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
