import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-900 text-gray-400 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="text-white font-extrabold text-xl flex items-center gap-2 mb-3">
            <span>🛍️</span> ShopAI
          </Link>
          <p className="text-sm leading-relaxed">AI-powered e-commerce with smart recommendations tailored just for you.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Shop</h4>
          <ul className="space-y-2 text-sm">
            {[['Electronics','/products?category=electronics'],['Clothing','/products?category=clothing'],['Footwear','/products?category=footwear'],['Accessories','/products?category=accessories']].map(([l,h])=>(
              <li key={l}><Link to={h} className="hover:text-white transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Account</h4>
          <ul className="space-y-2 text-sm">
            {[['Login','/login'],['Register','/register'],['My Orders','/orders'],['Cart','/cart']].map(([l,h])=>(
              <li key={l}><Link to={h} className="hover:text-white transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Tech Stack</h4>
          <ul className="space-y-2 text-sm">
            {['React 18','Node + Express','MongoDB Atlas','TensorFlow.js','Razorpay','Tailwind CSS'].map(t=>(
              <li key={t} className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-primary-400 rounded-full" />{t}</li>
            ))}
          </ul>
        </div>
      </div>
      <hr className="border-gray-800 mb-6" />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <p>© {new Date().getFullYear()} ShopAI. Built with ❤️ using MERN stack.</p>
        <p className="flex items-center gap-2">🔒 Payments secured by <span className="text-white font-semibold">Razorpay</span></p>
      </div>
    </div>
  </footer>
);

export default Footer;
