const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Content-based filtering using cosine similarity on feature vectors
function buildFeatureVector(product, allCategories, priceRange) {
  const vector = [];
  // One-hot encode category
  allCategories.forEach(cat => vector.push(product.category === cat ? 1 : 0));
  // Normalized price
  vector.push((product.price - priceRange.min) / (priceRange.max - priceRange.min || 1));
  // Normalized rating
  vector.push(product.rating.average / 5);
  // Featured flag
  vector.push(product.featured ? 1 : 0);
  return vector;
}

function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

// GET /api/recommendations/:productId
router.get('/:productId', async (req, res) => {
  try {
    const targetProduct = await Product.findById(req.params.productId);
    if (!targetProduct) return res.status(404).json({ success: false, message: 'Product not found' });

    const allProducts = await Product.find({ _id: { $ne: req.params.productId } });
    if (allProducts.length === 0) return res.json({ success: true, recommendations: [] });

    const allCategories = ['electronics', 'clothing', 'accessories', 'footwear'];
    const prices = allProducts.map(p => p.price);
    const priceRange = { min: Math.min(...prices), max: Math.max(...prices) };

    const targetVector = buildFeatureVector(targetProduct, allCategories, priceRange);

    const scored = allProducts.map(product => ({
      product,
      score: cosineSimilarity(targetVector, buildFeatureVector(product, allCategories, priceRange))
    }));

    scored.sort((a, b) => b.score - a.score);
    const recommendations = scored.slice(0, 6).map(({ product, score }) => ({
      ...product.toObject(),
      similarityScore: Math.round(score * 100) / 100
    }));

    res.json({ success: true, recommendations, basedOn: { productId: req.params.productId, productName: targetProduct.name } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/recommendations/user/personalized
router.get('/user/personalized', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const allProducts = await Product.find();

    if (!user.purchaseHistory || user.purchaseHistory.length === 0) {
      // Cold start: return featured + top-rated
      const fallback = await Product.find({ featured: true }).limit(6);
      return res.json({ success: true, recommendations: fallback, strategy: 'featured' });
    }

    // Build category preference scores from purchase history
    const categoryScores = {};
    const priceHistory = [];
    user.purchaseHistory.forEach(({ category, price }) => {
      categoryScores[category] = (categoryScores[category] || 0) + 1;
      priceHistory.push(price);
    });
    const avgPrice = priceHistory.reduce((a, b) => a + b, 0) / priceHistory.length;

    // Get purchased product IDs
    const purchasedIds = user.purchaseHistory.map(h => h.productId?.toString()).filter(Boolean);

    // Score products based on user preferences
    const scored = allProducts
      .filter(p => !purchasedIds.includes(p._id.toString()))
      .map(product => {
        let score = 0;
        score += (categoryScores[product.category] || 0) * 2;
        const priceDiff = Math.abs(product.price - avgPrice) / avgPrice;
        score += Math.max(0, 1 - priceDiff);
        score += product.rating.average / 5;
        if (product.featured) score += 0.5;
        return { product, score };
      });

    scored.sort((a, b) => b.score - a.score);
    const recommendations = scored.slice(0, 8).map(({ product }) => product);

    res.json({ success: true, recommendations, strategy: 'personalized', preferredCategories: Object.keys(categoryScores) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
