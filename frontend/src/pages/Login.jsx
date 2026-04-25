import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) { toast.success('Welcome back!'); navigate(from, { replace: true }); }
    else toast.error(result.message);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-extrabold text-primary-600">🛍️ ShopAI</Link>
          <h2 className="text-2xl font-bold text-gray-900 mt-4">Welcome back</h2>
          <p className="text-gray-500 mt-1">Sign in to continue shopping</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" required value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                className="input" placeholder="you@example.com" autoFocus />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input type="password" required value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))}
                className="input" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2 mt-2">
              {loading ? <><span className="spinner" style={{width:18,height:18,borderWidth:2}} /> Signing in...</> : 'Sign In'}
            </button>
          </form>
          <div className="mt-5 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">Create one</Link>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-600">
            <strong>Demo:</strong> Register a new account to get started with full access.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
