import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Auctions from './pages/Auctions';
import Deals from './pages/Deals';
import RecentlyViewed from './pages/RecentlyViewed';
import Blog from './pages/Blog';
import PostDetail from './pages/PostDetail';
import CMSPage from './pages/CMSPage';
import { ContactPage, FAQPage, TrackOrderPage } from './pages/Support';
import Header from './components/Header';
import Breadcrumbs from './components/Breadcrumbs';
import ScrollToTop from './components/ScrollToTop';
import { BreadcrumbProvider } from './context/BreadcrumbContext';
import { NotificationProvider } from './context/NotificationContext';
import Newsletter from './components/Newsletter';
import BackToTop from './components/BackToTop';
import './App.css';

import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const App: React.FC = () => {
  return (
    <Router>
      <BreadcrumbProvider>
        <NotificationProvider>
          <ScrollToTop />
          <div className="min-h-screen bg-white font-sans text-gray-900 antialiased pt-[100px] lg:pt-[140px]">
            <Header />

            {/* Main Content Area */}
            <main>
              <Breadcrumbs />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/buy-it-now" element={<Products />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
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
                    <Link to="/" className="flex items-center">
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
                    <h4 className="font-black text-white uppercase tracking-widest text-[10px] mb-6">Platform</h4>
                    <ul className="space-y-3 font-bold text-xs text-white">
                      <li><Link to="/auctions" className="hover:text-brand-orange transition-colors">Live Auctions</Link></li>
                      <li><Link to="/page/how-it-works" className="hover:text-brand-orange transition-colors">How it Works</Link></li>
                      <li><Link to="/shipping" className="hover:text-brand-orange transition-colors">Shipping Info</Link></li>
                      <li><Link to="/protection" className="hover:text-brand-orange transition-colors">Buyer Protection</Link></li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-black text-white uppercase tracking-widest text-[10px] mb-6">Company</h4>
                    <ul className="space-y-3 font-bold text-xs text-white">
                      <li><Link to="/about" className="hover:text-brand-orange transition-colors">About Us</Link></li>
                      <li><Link to="/blog" className="hover:text-brand-orange transition-colors">Insider Blog</Link></li>
                      <li><Link to="/contact" className="hover:text-brand-orange transition-colors">Contact Support</Link></li>
                      <li><Link to="/page/careers" className="hover:text-brand-orange transition-colors">Careers</Link></li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-black text-white uppercase tracking-widest text-[10px] mb-6">Support</h4>
                    <ul className="space-y-3 font-bold text-xs text-white">
                      <li><Link to="/faqs" className="hover:text-brand-orange transition-colors">Help Center</Link></li>
                      <li><Link to="/contact" className="hover:text-brand-orange transition-colors">Contact Us</Link></li>
                      <li><Link to="/track-order" className="hover:text-brand-orange transition-colors">Track Order</Link></li>
                      <li><Link to="/privacy" className="hover:text-brand-orange transition-colors">Privacy Policy</Link></li>
                    </ul>
                  </div>
                </div>
                
                {/* Payment Methods */}
                <div className="py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-center gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Secure Payments</span>
                    <div className="flex items-center gap-4 grayscale-0 opacity-100 transition-all duration-500">
                      <img src="https://bidsnbuy.ng/wp-content/uploads/2024/01/shop28-payment.png" alt="Payment Methods" className="h-8 w-auto mix-blend-multiply brightness-110 contrast-125" />
                    </div>
                  </div>
                </div>
                
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
                  <p className="text-white text-[10px] font-bold order-1">
                    &copy; {new Date().getFullYear()} BidsnBuy.ng. All rights reserved.
                  </p>
                  
                  <div className="flex flex-col items-center md:items-end gap-4 md:gap-2 order-2">
                    <div className="flex space-x-6 text-[10px] font-black text-white uppercase tracking-widest">
                      <Link to="/privacy" className="hover:text-brand-orange transition-colors">Privacy Policy</Link>
                      <Link to="/terms" className="hover:text-brand-orange transition-colors">Terms of Service</Link>
                    </div>
                    <p className="text-white text-xs md:text-[10px] font-bold text-center md:text-right">
                      Designed and Developed by <a href="https://www.avariodigitals.com" target="_blank" rel="noopener noreferrer" className="text-brand-orange md:text-white hover:text-brand-orange transition-colors underline underline-offset-4 decoration-white/20 font-black md:font-bold">Avario Digitals</a>
                    </p>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </NotificationProvider>
      </BreadcrumbProvider>
    </Router>
  );
};

export default App;
