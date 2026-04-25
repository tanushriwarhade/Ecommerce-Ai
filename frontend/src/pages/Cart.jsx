import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, fetchCart } = useCart();
  const { user } = useAuth();
  const [checkingOut, setCheckingOut] = useState(false);
  const [address, setAddress] = useState({ street: '', city: '', state: '', zipCode: '' });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!address.street || !address.city || !address.state || !address.zipCode) {
      toast.error('Please fill in your shipping address');
      setShowAddressForm(true);
      return;
    }
    setCheckingOut(true);
    try {
      const { data } = await ordersAPI.createRazorpayOrder(cart.totalAmount);
      const options = {
        key: data.keyId || process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'ShopAI',
        description: 'Order Payment',
        order_id: data.orderId,
        handler: async (response) => {
          try {
            await ordersAPI.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              shippingAddress: address,
            });
            await fetchCart();
            toast.success('🎉 Order placed successfully!');
            navigate('/orders');
          } catch { toast.error('Payment verification failed'); }
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: '#2563eb' },
        modal: { ondismiss: () => setCheckingOut(false) }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error('Failed to initiate payment');
      setCheckingOut(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Discover amazing products and add them to your cart!</p>
        <Link to="/products" className="btn-primary inline-block">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart ({cart.items.length} items)</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const product = item.product;
            if (!product) return null;
            return (
              <div key={item._id} className="card p-4 flex gap-4">
                <img src={product.image || `https://via.placeholder.com/100x100`} alt={product.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shrink-0 bg-gray-50"
                  onError={e => { e.target.src = 'https://via.placeholder.com/100x100'; }} />
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${product._id}`} className="font-semibold text-gray-800 hover:text-primary-600 line-clamp-2 text-sm sm:text-base transition-colors">{product.name}</Link>
                  <p className="text-xs text-gray-400 capitalize mt-0.5">{product.category} • {product.brand}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => item.quantity > 1 ? updateQuantity(product._id, item.quantity - 1) : removeFromCart(product._id)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 font-bold text-gray-600">−</button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(product._id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 font-bold text-gray-600">+</button>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                      <div className="text-xs text-gray-400">₹{item.price.toLocaleString('en-IN')} each</div>
                    </div>
                    <button onClick={() => removeFromCart(product._id)} className="text-red-400 hover:text-red-600 ml-2 p-1 rounded transition-colors" title="Remove">✕</button>
                  </div>
                </div>
              </div>
            );
          })}
          <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors">🗑 Clear Cart</button>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="font-bold text-gray-800 mb-4 text-lg">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart.items.reduce((s,i) => s+i.quantity,0)} items)</span>
                <span>₹{cart.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600"><span>Shipping</span><span className="text-green-600 font-medium">FREE</span></div>
              <div className="flex justify-between text-gray-600"><span>Taxes (18% GST)</span><span>₹{Math.round(cart.totalAmount * 0.18).toLocaleString('en-IN')}</span></div>
            </div>
            <hr className="my-3 border-gray-100" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{Math.round(cart.totalAmount * 1.18).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Address */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-800">Shipping Address</h2>
              <button onClick={() => setShowAddressForm(!showAddressForm)} className="text-xs text-primary-600 font-medium">{showAddressForm ? 'Hide' : 'Edit'}</button>
            </div>
            {(showAddressForm || !address.city) && (
              <div className="space-y-2">
                {[['street','Street Address'],['city','City'],['state','State'],['zipCode','ZIP Code']].map(([key,label]) => (
                  <input key={key} placeholder={label} value={address[key]}
                    onChange={e => setAddress(a => ({...a, [key]: e.target.value}))}
                    className="input text-sm" />
                ))}
              </div>
            )}
            {!showAddressForm && address.city && (
              <p className="text-sm text-gray-600">{address.street}, {address.city}, {address.state} - {address.zipCode}</p>
            )}
          </div>

          <button onClick={handleCheckout} disabled={checkingOut} className="btn-primary w-full text-base py-3 flex items-center justify-center gap-2">
            {checkingOut ? <><span className="spinner" style={{width:20,height:20,borderWidth:2}} /> Processing...</> : '🔒 Proceed to Payment'}
          </button>
          <p className="text-xs text-gray-400 text-center">Powered by Razorpay • 100% Secure</p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
