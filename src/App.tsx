import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Auctions from './pages/Auctions';
import Deals from './pages/Deals';
import RecentlyViewed from './pages/RecentlyViewed';
import Blog from './pages/Blog';
import PostDetail from './pages/PostDetail';
import CMSPage from './pages/CMSPage';
import { ContactPage, FAQPage, TrackOrderPage } from './pages/Support';
import Checkout from './pages/Checkout';
import Header from './components/Header';
import Breadcrumbs from './components/Breadcrumbs';
import ScrollToTop from './components/ScrollToTop';
import { BreadcrumbProvider } from './context/BreadcrumbContext';
import { NotificationProvider } from './context/NotificationContext';
import { CartProvider } from './context/CartContext';
import Newsletter from './components/Newsletter';
import BackToTop from './components/BackToTop';
import './App.css';

import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const App: React.FC = () => {
  return (
    <Router>
      <BreadcrumbProvider>
        <NotificationProvider>
          <CartProvider>
            <ScrollToTop />
            <div className="min-h-screen bg-white font-sans text-gray-900 antialiased pt-[130px] lg:pt-[170px]">
              <Header />

              {/* Main Content Area */}
              <main id="main-content">
                <Breadcrumbs />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/buy-it-now" element={<Products />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:slug" element={<ProductDetail />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/auctions" element={<Auctions />} />
                  <Route path="/flash-deals" element={<Deals />} />
                  <Route path="/recently-viewed" element={<RecentlyViewed />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<PostDetail />} />
                  <Route path="/page/:slug" element={<CMSPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/faqs" element={<FAQPage />} />
                  <Route path="/track-order" element={<TrackOrderPage />} />
                </Routes>
              </main>

              <Newsletter />
              <BackToTop />

              {/* Premium Footer */}
              <footer className="bg-brand-blue pt-16 pb-32 md:pb-8 text-white">
                <div className="container mx-auto px-4 max-w-[1440px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    <div className="space-y-4">
                      <Link 
                        to="/" 
                        onClick={(e) => {
                          if (window.location.pathname === '/') {
                            e.preventDefault();
                            document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="flex items-center"
                      >
                        <img 
                          src="https://bidsnbuy.ng/wp-content/uploads/2025/11/Bidnbuylogo-removebg-preview.png" 
                          alt="BidsnBuy Logo" 
                          className="h-24 lg:h-32 w-auto object-contain"
                        />
                      </Link>
                      <p className="text-white font-medium leading-relaxed text-sm">
                        The most trusted bidding platform in Nigeria. Buy premium items at prices you decide.
                      </p>
                      <div className="flex space-x-4 pt-2">
                        <a href="#" className="w-10 h-10 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-all cursor-pointer shadow-lg group">
                            <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="#" className="w-10 h-10 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-all cursor-pointer shadow-lg group">
                            <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="#" className="w-10 h-10 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-all cursor-pointer shadow-lg group">
                            <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="#" className="w-10 h-10 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-all cursor-pointer shadow-lg group">
                            <Youtube className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </a>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-black text-brand-orange uppercase tracking-widest text-[10px] mb-6">Platform</h4>
                      <ul className="space-y-3 font-bold text-xs text-white">
                        <li><Link to="/auctions" className="hover:text-brand-orange transition-colors">Live Auctions</Link></li>
                        <li><Link to="/page/how-it-works" className="hover:text-brand-orange transition-colors">How it Works</Link></li>
                        <li><Link to="/products" className="hover:text-brand-orange transition-colors">Shop All Items</Link></li>
                        <li><Link to="/blog" className="hover:text-brand-orange transition-colors">Latest News</Link></li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-black text-brand-orange uppercase tracking-widest text-[10px] mb-6">Support</h4>
                      <ul className="space-y-3 font-bold text-xs text-white">
                        <li><Link to="/contact" className="hover:text-brand-orange transition-colors">Contact Us</Link></li>
                        <li><Link to="/faqs" className="hover:text-brand-orange transition-colors">Help & FAQ</Link></li>
                        <li><Link to="/track-order" className="hover:text-brand-orange transition-colors">Track Order</Link></li>
                        <li><Link to="/page/terms-and-conditions" className="hover:text-brand-orange transition-colors">Terms of Service</Link></li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-black text-white uppercase tracking-widest text-[10px] mb-6 flex items-center">
                        Experience BidsnBuy
                        <span className="ml-2 bg-brand-orange text-white text-[8px] px-2 py-0.5 rounded-full uppercase tracking-tighter">Soon</span>
                      </h4>
                      <p className="text-white font-medium text-sm mb-6">Download our mobile app for the fastest bidding experience.</p>
                      <div className="flex flex-row items-center space-x-3 opacity-50 grayscale">
                        <div className="block cursor-not-allowed">
                          <img 
                            src="https://bidsnbuy.ng/wp-content/uploads/2024/01/shop28-app-1.png" 
                            alt="App Store" 
                            className="h-8 lg:h-10 w-auto object-contain"
                          />
                        </div>
                        <div className="block cursor-not-allowed">
                          <img 
                            src="https://bidsnbuy.ng/wp-content/uploads/2024/01/shop28-app-2.png" 
                            alt="Google Play" 
                            className="h-8 lg:h-10 w-auto object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/60">© 2026 BidsnBuy.ng. All rights reserved.</p>
                    </div>
                    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 text-[10px] font-black uppercase tracking-widest text-white/60 text-center md:text-left">
                      <div className="flex space-x-8">
                        <a href="#" className="hover:text-brand-orange transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-brand-orange transition-colors">Cookie Policy</a>
                      </div>
                      <a 
                        href="https://www.avariodigitals.com" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-brand-orange transition-all duration-300"
                      >
                        Designed and developed by Avario Digitals
                      </a>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </CartProvider>
        </NotificationProvider>
      </BreadcrumbProvider>
    </Router>
  );
};

export default App;
