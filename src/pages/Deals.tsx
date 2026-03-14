import React, { useEffect, useState } from 'react';
import { wpService } from '../services/wp-api';
import type { WPProduct } from '../types/wordpress';
import ProductCard from '../components/ProductCard';
import { 
  Zap, 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  ShoppingBag,
  Loader2
} from 'lucide-react';

const Deals: React.FC = () => {
  const [deals, setDeals] = useState<WPProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const data = await wpService.getProducts({ 
          per_page: 20,
          on_sale: true,
          search: searchTerm
        });
        setDeals(data);
      } catch (err) {
        console.error('Error fetching deals:', err);
        setError('Failed to load flash deals. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [searchTerm]);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-brand-orange py-20 relative overflow-hidden">
        {/* Decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-black tracking-widest uppercase mb-6">
            <Zap className="w-4 h-4 fill-current" />
            <span>Limited Time Offers</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter mb-6">
            Flash <span className="text-brand-blue">Deals</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto font-medium">
            Don't wait. Our flash sales are live with discounts up to 70% off. Grab them before they're gone!
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-16 bg-white p-6 rounded-[30px] shadow-xl shadow-brand-orange/5 border border-gray-100">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search flash deals..." 
              className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-brand-orange transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-gray-500 mr-4">
                <div className="flex items-center space-x-2 text-brand-orange">
                   <Sparkles className="w-4 h-4" />
                   <span>Featured Deals</span>
                </div>
                <div className="flex items-center space-x-2 hover:text-brand-orange transition-colors cursor-pointer">
                   <ShoppingBag className="w-4 h-4" />
                   <span>Shop All Sale</span>
                </div>
             </div>
             <button className="bg-brand-dark text-white p-4 rounded-2xl hover:bg-brand-orange transition-colors shadow-xl">
               <SlidersHorizontal className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
             <div className="relative mb-6">
                <div className="w-20 h-20 bg-brand-orange/10 rounded-full flex items-center justify-center">
                  <img 
                    src="https://bidsnbuy.ng/wp-content/uploads/2025/11/Bidnbuylogo-removebg-preview.png" 
                    alt="Loading" 
                    className="h-10 w-auto object-contain animate-pulse"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1">
                  <Loader2 className="w-6 h-6 animate-spin text-brand-blue" />
                </div>
             </div>
             <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">Finding Best Prices...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-orange-50 rounded-[40px] border border-orange-100">
            <p className="text-orange-600 font-bold text-lg">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 bg-brand-orange text-white px-10 py-4 rounded-2xl font-black hover:bg-brand-dark transition-all shadow-lg shadow-orange-200"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {deals.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {deals.length === 0 && (
              <div className="text-center py-32 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <Zap className="w-10 h-10 text-gray-200" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">No flash deals found</h3>
                <p className="text-gray-500 font-medium max-w-sm mx-auto">
                  We don't have any active flash deals matching your criteria right now. Check back soon!
                </p>
                <button 
                   onClick={() => setSearchTerm('')}
                   className="mt-8 text-brand-orange font-black uppercase tracking-widest text-xs hover:text-brand-blue transition-colors"
                >
                   Clear All Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Deals;