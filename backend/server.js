const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/recommendations', require('./routes/recommendations'));

// API Docs route
app.get('/api/docs', (req, res) => {
  res.json({
    name: 'E-Commerce AI Store API',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register a new user',
        'POST /api/auth/login': 'Login and get JWT token',
        'GET /api/auth/me': 'Get current user (auth required)'
      },
      products: {
        'GET /api/products': 'Get all products (query: category, minPrice, maxPrice, search, page, limit)',
        'GET /api/products/:id': 'Get single product',
        'POST /api/products': 'Create product (admin)',
        'PUT /api/products/:id': 'Update product (admin)',
        'DELETE /api/products/:id': 'Delete product (admin)'
      },
      cart: {
        'GET /api/cart': 'Get user cart (auth required)',
        'POST /api/cart/add': 'Add item to cart (auth required)',
        'PUT /api/cart/update': 'Update cart item quantity (auth required)',
        'DELETE /api/cart/remove/:productId': 'Remove item from cart (auth required)',
        'DELETE /api/cart/clear': 'Clear entire cart (auth required)'
      },
      orders: {
        'POST /api/orders/create-razorpay-order': 'Create Razorpay order (auth required)',
        'POST /api/orders/verify-payment': 'Verify payment and create order (auth required)',
        'GET /api/orders/my-orders': 'Get user orders (auth required)'
      },
      recommendations: {
        'GET /api/recommendations/:productId': 'Get AI recommendations for a product',
        'GET /api/recommendations/user/personalized': 'Get personalized recommendations (auth required)'
      }
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📖 API Docs: http://localhost:${PORT}/api/docs`);
});

module.exports = app;
