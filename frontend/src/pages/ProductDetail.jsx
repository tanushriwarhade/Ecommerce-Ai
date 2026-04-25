import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI, recommendationsAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/common/ProductCard';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [prodRes, recRes] = await Promise.all([
          productsAPI.getById(id),
          recommendationsAPI.getForProduct(id),
        ]);
        setProduct(prodRes.data.product);
        setRecommendations(recRes.data.recommendations);
      } catch { navigate('/products'); }
      finally { setLoading(false); }
    };
    load();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error('Please login first'); navigate('/login'); return; }
    setAddingToCart(true);
    await addToCart(product._id, quantity);
    setAddingToCart(false);
  };

  if (loading) return <div className="flex justify-center py-32"><div className="spinner" style={{width:48,height:48,borderWidth:4}} /></div>;
  if (!product) return null;

  const stars = Math.round(product.rating?.average || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid md:grid-cols-2 gap-10 mb-14">
        {/* Image */}
        <div className="card overflow-hidden">
          <img src={product.image || `https://via.placeholder.com/600x600?text=${encodeURIComponent(product.name)}`}
            alt={product.name} className="w-full aspect-square object-cover"
            onError={e => { e.target.src = `https://via.placeholder.com/600x600?text=${encodeURIComponent(product.name)}`; }} />
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <span className="badge bg-primary-100 text-primary-700 capitalize">{product.category}</span>
            {product.featured && <span className="badge bg-orange-100 text-orange-700">⭐ Featured</span>}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <div className="text-sm text-gray-500 mb-3">by <span className="font-medium text-gray-700">{product.brand}</span></div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">{[1,2,3,4,5].map(s => <span key={s} className={`text-lg ${s <= stars ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>)}</div>
            <span className="text-sm text-gray-500">{product.rating?.average?.toFixed(1)} ({product.rating?.count?.toLocaleString()} reviews)</span>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 mb-4">₹{product.price.toLocaleString('en-IN')}</div>
          <p className="text-gray-600 mb-5 leading-relaxed">{product.description}</p>

          {product.features?.length > 0 && (
            <div className="mb-5">
              <h3 className="font-semibold text-gray-800 mb-2">Key Features</h3>
              <ul className="space-y-1">
                {product.features.map((f, i) => <li key={i} className="flex items-center gap-2 text-sm text-gray-600"><span className="text-primary-500">✓</span> {f}</li>)}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-3 mb-5">
            <label className="text-sm font-medium text-gray-700">Qty:</label>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 text-lg font-bold text-gray-600 transition-colors">−</button>
              <span className="w-10 text-center font-semibold text-sm">{quantity}</span>
              <button onClick={() => setQuantity(q => q+1)} className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 text-lg font-bold text-gray-600 transition-colors">+</button>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button onClick={handleAddToCart} disabled={addingToCart || !product.inStock} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {addingToCart ? <><span className="spinner" style={{width:18,height:18,borderWidth:2}} /> Adding...</> : '🛒 Add to Cart'}
            </button>
            <button onClick={() => { handleAddToCart().then(() => navigate('/cart')); }} disabled={!product.inStock} className="btn-secondary">
              Buy Now
            </button>
          </div>

          {!product.inStock && <p className="text-red-500 text-sm mt-3 font-medium">⚠️ Currently out of stock</p>}

          {product.tags?.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-5">
              {product.tags.map(tag => <span key={tag} className="badge bg-gray-100 text-gray-500 text-xs">#{tag}</span>)}
            </div>
          )}
        </div>
      </div>

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🤖</span>
            <h2 className="text-xl font-bold text-gray-900">AI-Recommended Similar Products</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {recommendations.slice(0, 6).map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
