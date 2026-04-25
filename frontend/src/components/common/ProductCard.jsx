import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(star => (
        <span key={star} className={`text-sm ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
      ))}
    </div>
  );
};

const ProductCard = ({ product }) => {
  const { addToCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to add items to cart'); navigate('/login'); return; }
    await addToCart(product._id);
  };

  const categoryColors = {
    electronics: 'bg-blue-100 text-blue-700',
    clothing: 'bg-purple-100 text-purple-700',
    footwear: 'bg-green-100 text-green-700',
    accessories: 'bg-orange-100 text-orange-700',
  };

  return (
    <Link to={`/products/${product._id}`} className="card group hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={product.image || `https://via.placeholder.com/400x400?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = `https://via.placeholder.com/400x400?text=${encodeURIComponent(product.name)}`; }}
        />
        {product.featured && (
          <span className="absolute top-2 left-2 bg-accent-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Featured</span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 font-semibold px-3 py-1 rounded-full text-sm">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className={`badge ${categoryColors[product.category] || 'bg-gray-100 text-gray-600'} text-xs`}>
            {product.category}
          </span>
          <span className="text-xs text-gray-400">{product.brand}</span>
        </div>
        <h3 className="font-semibold text-gray-800 line-clamp-2 mb-1 text-sm leading-snug">{product.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          <StarRating rating={product.rating?.average || 0} />
          <span className="text-xs text-gray-400">({product.rating?.count || 0})</span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
          <button
            onClick={handleAddToCart}
            disabled={loading || !product.inStock}
            className="btn-primary py-1.5 px-3 text-sm"
          >
            {loading ? <span className="spinner" style={{width:16,height:16,borderWidth:2}} /> : '+ Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
