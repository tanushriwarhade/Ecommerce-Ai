# 🛍️ ShopAI — E-Commerce Store with AI Recommendations

A full-stack MERN e-commerce application with AI-powered product recommendations, Razorpay payments, JWT authentication, and a responsive Tailwind CSS UI.

---

## 🚀 Tech Stack

| Layer      | Technology                              |
|------------|----------------------------------------|
| Frontend   | React 18, Tailwind CSS, React Router v6 |
| Backend    | Node.js, Express.js                    |
| Database   | MongoDB Atlas                          |
| Auth       | JWT (JSON Web Tokens)                  |
| Payments   | Razorpay (Test Mode)                   |
| AI/ML      | Content-based filtering (Cosine Similarity) |

---

## ✨ Features

- 🔐 **User Authentication** — Register, login, JWT-protected routes
- 🛒 **Product Catalog** — 20 seeded products across electronics, clothing, footwear, accessories
- 🛍️ **Shopping Cart** — Add, remove, update quantity, persisted in MongoDB
- 💳 **Razorpay Checkout** — Full test-mode payment flow with signature verification
- 🤖 **AI Recommendations** — Content-based filtering using cosine similarity on category/price/rating
- 🎯 **Personalized Recs** — User purchase history drives personalized homepage suggestions
- 📦 **Order History** — Complete order tracking post-payment
- 📱 **Responsive UI** — Mobile-first design with Tailwind CSS
- 📖 **API Documentation** — Self-documenting at `/api/docs`

---

## 📁 Project Structure

```
ecommerce-ai/
├── backend/
│   ├── models/          # Mongoose models (User, Product, Cart, Order)
│   ├── routes/          # Express routes (auth, products, cart, orders, recommendations)
│   ├── middleware/      # JWT auth middleware
│   ├── seed/            # Database seeder (20 products)
│   ├── server.js        # Express app entry point
│   ├── vercel.json      # Vercel deployment config
│   └── .env.example     # Environment variable template
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # Navbar, Footer, ProductCard, ProtectedRoute
│   │   ├── context/     # AuthContext, CartContext (React Context API)
│   │   ├── pages/       # Home, Products, ProductDetail, Cart, Login, Register, Orders
│   │   └── utils/       # Axios API client
│   ├── tailwind.config.js
│   └── .env.example
├── netlify.toml         # Netlify deploy config
├── package.json         # Root scripts (run both servers concurrently)
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- Razorpay account (test mode keys)

---

### 1. Clone & Install

```bash
# Install all dependencies (backend + frontend)
npm run install:all

# Or manually:
cd backend && npm install
cd ../frontend && npm install
```

---

### 2. Configure Environment Variables

**Backend** — copy `.env.example` to `.env`:
```bash
cp backend/.env.example backend/.env
```

Fill in your values:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/ecommerce
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**Frontend** — copy `.env.example` to `.env`:
```bash
cp frontend/.env.example frontend/.env
```

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxxxxxx
```

---

### 3. Seed the Database

```bash
npm run seed
# OR
cd backend && node seed/seedProducts.js
```

This inserts 20 products into MongoDB (electronics, clothing, footwear, accessories).

---

### 4. Run the App

```bash
# Run both backend + frontend together
npm run dev

# Or separately:
npm run dev:backend    # http://localhost:5000
npm run dev:frontend   # http://localhost:3000
```

---

## 💳 Razorpay Test Mode

Use these test card details during checkout:

| Field      | Value                  |
|------------|------------------------|
| Card No.   | 4111 1111 1111 1111    |
| Expiry     | Any future date        |
| CVV        | Any 3 digits           |
| OTP        | 1234                   |

Get free test keys at: https://dashboard.razorpay.com/

---

## 🤖 AI Recommendation Engine

The recommendation system uses **content-based filtering** with cosine similarity:

- Each product is encoded as a feature vector: `[category (one-hot), normalized price, normalized rating, featured flag]`
- Cosine similarity is computed between products to find the most similar items
- On the product detail page → shows 6 most similar products
- On homepage (logged-in users) → personalized recs based on purchase history

**Cold start**: New users without purchase history receive featured products.

---

## 📖 API Reference

Base URL: `http://localhost:5000/api`  
Full docs: `GET /api/docs`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | Login, get JWT |
| GET | `/auth/me` | ✅ | Get current user |
| GET | `/products` | No | List products (filter/sort/paginate) |
| GET | `/products/:id` | No | Get single product |
| GET | `/cart` | ✅ | Get user's cart |
| POST | `/cart/add` | ✅ | Add item to cart |
| PUT | `/cart/update` | ✅ | Update item quantity |
| DELETE | `/cart/remove/:id` | ✅ | Remove cart item |
| POST | `/orders/create-razorpay-order` | ✅ | Initiate payment |
| POST | `/orders/verify-payment` | ✅ | Verify & create order |
| GET | `/orders/my-orders` | ✅ | List user's orders |
| GET | `/recommendations/:productId` | No | Similar product recs |
| GET | `/recommendations/user/personalized` | ✅ | Personalized recs |

---

## 🚢 Deployment

### Backend → Vercel

```bash
cd backend
npm i -g vercel
vercel

# Add environment variables in Vercel dashboard or via CLI:
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add RAZORPAY_KEY_ID
vercel env add RAZORPAY_KEY_SECRET
vercel env add FRONTEND_URL
```

### Frontend → Netlify

```bash
cd frontend
npm run build

# Deploy via Netlify CLI:
npm i -g netlify-cli
netlify deploy --prod --dir=build

# Set env variables in Netlify dashboard:
# REACT_APP_API_URL = https://your-backend.vercel.app/api
# REACT_APP_RAZORPAY_KEY_ID = rzp_test_xxx
```

Or connect your GitHub repo to Netlify for automatic deploys — `netlify.toml` is pre-configured.

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install all dependencies |
| `npm run dev` | Run frontend + backend concurrently |
| `npm run dev:backend` | Backend only (port 5000) |
| `npm run dev:frontend` | Frontend only (port 3000) |
| `npm run seed` | Seed 20 products into MongoDB |
| `npm run build:frontend` | Production build of React app |

---

## 📄 License

MIT License — free to use and modify.
