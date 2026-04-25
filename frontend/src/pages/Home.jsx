import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, recommendationsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/common/ProductCard';

const Hero = () => (
  <div className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white blur-3xl" />
      <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white blur-3xl" />
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium mb-6">
          <span>🤖</span> AI-Powered Recommendations
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
          Shop Smarter <br />
          <span className="text-yellow-300">with AI</span>
        </h1>
        <p className="text-lg text-blue-100 mb-8 max-w-xl">
          Discover products tailored just for you. Our AI learns your preferences and recommends the perfect items every time.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link to="/products" className="bg-white text-primary-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
            Shop Now →
          </Link>
          <Link to="/register" className="bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/30 transition-colors border border-white/30">
            Get Started Free
          </Link>
        </div>
      </div>
    </div>
  </div>
);

const CategoryCard = ({ icon, name, count, href }) => (
  <Link to={href} className="card p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-4 group">
    <div className="text-3xl">{icon}</div>
    <div>
      <div className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">{name}</div>
      <div className="text-sm text-gray-400">{count} products</div>
    </div>
    <span className="ml-auto text-gray-300 group-hover:text-primary-400 transition-colors">→</span>
  </Link>
);

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const [featRes] = await Promise.all([
          productsAPI.getAll({ featured: true, limit: 8 }),
        ]);
        setFeatured(featRes.data.products);
        if (isAuthenticated) {
          const recRes = await recommendationsAPI.getPersonalized();
          setRecommendations(recRes.data.recommendations);
        }
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen">
      <Hero />

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CategoryCard icon="📱" name="Electronics" count="8" href="/products?category=electronics" />
          <CategoryCard icon="👕" name="Clothing" count="6" href="/products?category=clothing" />
          <CategoryCard icon="👟" name="Footwear" count="3" href="/products?category=footwear" />
          <CategoryCard icon="⌚" name="Accessories" count="4" href="/products?category=accessories" />
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">⭐ Featured Products</h2>
          <Link to="/products" className="text-primary-600 font-medium text-sm hover:underline">View All →</Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-16"><div className="spinner" style={{width:40,height:40,borderWidth:4}} /></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>

      {/* AI Recommendations (authenticated users) */}
      {isAuthenticated && recommendations.length > 0 && (
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 border-t border-primary-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🤖</span>
              <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
            </div>
            <p className="text-gray-500 text-sm mb-6">Based on your purchase history and preferences</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {recommendations.slice(0, 8).map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </div>
      )}

      {/* Features banner */}
      <div className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: '🚚', title: 'Free Shipping', desc: 'On orders above ₹999' },
              { icon: '🔒', title: 'Secure Payment', desc: 'Razorpay protected' },
              { icon: '🤖', title: 'AI Powered', desc: 'Smart recommendations' },
              { icon: '↩️', title: 'Easy Returns', desc: '30-day return policy' },
            ].map(f => (
              <div key={f.title}>
                <div className="text-3xl mb-2">{f.icon}</div>
                <div className="font-semibold">{f.title}</div>
                <div className="text-xs text-gray-400 mt-0.5">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
