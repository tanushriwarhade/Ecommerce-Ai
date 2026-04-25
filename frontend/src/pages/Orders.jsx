import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../utils/api';

const statusColors = {
  processing: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersAPI.getMyOrders().then(({ data }) => setOrders(data.orders)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-32"><div className="spinner" style={{width:48,height:48,borderWidth:4}} /></div>;

  if (orders.length === 0) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="text-7xl mb-6">📦</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-3">No orders yet</h2>
      <p className="text-gray-500 mb-8">Your orders will appear here after checkout</p>
      <Link to="/products" className="btn-primary inline-block">Start Shopping</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order._id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Order ID</p>
                <p className="font-mono text-sm font-semibold text-gray-700">{order._id.slice(-12).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Date</p>
                <p className="text-sm text-gray-700">{new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Total</p>
                <p className="font-bold text-gray-900">₹{order.totalAmount.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Status</p>
                <span className={`badge ${statusColors[order.orderStatus]} capitalize`}>{order.orderStatus}</span>
              </div>
            </div>
            <hr className="border-gray-100 mb-4" />
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                  <p className="font-semibold text-sm text-gray-700 shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
            {order.paymentInfo?.razorpayPaymentId && (
              <p className="text-xs text-gray-400 mt-4">Payment ID: {order.paymentInfo.razorpayPaymentId}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
