import React, { useEffect, useState } from 'react';
import { wpService } from '../services/wp-api';
import type { WPProduct } from '../types/wordpress';
import ProductCard from '../components/ProductCard';
import { History, Trash2, ShoppingBag, Loader2 } from 'lucide-react';

const RecentlyViewed: React.FC = () => {
  const [products, setProducts] = useState<WPProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      const recentIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      if (recentIds.length > 0) {
        try {
          setLoading(true);
          const data = await wpService.getProductsByIds(recentIds);
          // Sort products in the order they appear in recentIds (most recent first)
          const sortedData = recentIds.map((id: number) => data.find(p => p.id === id)).filter(Boolean) as WPProduct[];
          setProducts(sortedData);
        } catch (err) {
          console.error('Error fetching recent products:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchRecentProducts();
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('recentlyViewed');
    setProducts([]);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 text-brand-blue font-black text-sm tracking-widest uppercase mb-4">
                <History className="w-5 h-5" />
                <span>Your Browsing History</span>
              </div>
              <h1 className="text-5xl font-black text-gray-900 tracking-tight">
                Recently <span className="text-gray-400">Viewed</span>
              </h1>
            </div>
            
            {products.length > 0 && (
              <button 
                onClick={clearHistory}
                className="flex items-center space-x-2 text-red-500 font-bold hover:bg-red-50 px-6 py-3 rounded-2xl transition-all"
              >
                <Trash2 className="w-5 h-5" />
                <span>Clear History</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
             <div className="relative mb-6">
                <div className="w-20 h-20 bg-brand-blue/5 rounded-full flex items-center justify-center">
                  <img 
                    src="https://bidsnbuy.ng/wp-content/uploads/2025/11/Bidnbuylogo-removebg-preview.png" 
                    alt="History Loading" 
                    className="h-10 w-auto object-contain animate-pulse"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1">
                  <Loader2 className="w-6 h-6 animate-spin text-brand-orange" />
                </div>
             </div>
             <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">Loading your history...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
              <History className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Your history is empty</h3>
            <p className="text-gray-500 font-medium max-w-sm mx-auto mb-8">
              Looks like you haven't browsed any products yet. Explore our auctions and shop to see them here!
            </p>
            <button 
               onClick={() => window.location.href = '/products'}
               className="bg-brand-blue text-white px-10 py-4 rounded-2xl font-black hover:bg-brand-dark transition-all shadow-xl shadow-brand-blue/20 flex items-center mx-auto space-x-2"
            >
               <ShoppingBag className="w-5 h-5" />
               <span>Start Shopping</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentlyViewed;