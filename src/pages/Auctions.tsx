import React, { useEffect, useState, useMemo } from 'react';
import { wpService } from '../services/wp-api';
import type { WPProduct } from '../types/wordpress';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import LoadingBar from '../components/LoadingBar';
import { 
  Hammer, 
  Search, 
  SlidersHorizontal, 
  Users,
  Trophy,
  Zap,
  Clock,
  LayoutGrid,
  List,
  ChevronRight,
  Filter
} from 'lucide-react';

const Auctions: React.FC = () => {
  const [auctions, setAuctions] = useState<WPProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'ending_soon' | 'newest' | 'price_asc' | 'price_desc'>('ending_soon');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        const data = await wpService.getAuctions({ 
          per_page: 100,
          search: searchTerm,
          _fields: 'id,name,slug,price,regular_price,on_sale,images,categories,type,meta_data,date_created'
        });
        setAuctions(data);
      } catch (err) {
        console.error('Error fetching auctions:', err);
        setError('Failed to load live auctions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, [searchTerm]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    auctions.forEach(a => a.categories.forEach(c => cats.add(c.name)));
    return ['all', ...Array.from(cats)];
  }, [auctions]);

  const filteredAndSortedAuctions = useMemo(() => {
    const result = auctions.filter(a => 
      activeCategory === 'all' || a.categories.some(c => c.name === activeCategory)
    );

    switch (sortBy) {
      case 'ending_soon':
        result.sort((a, b) => {
          const timeA = a.auction_end_time ? new Date(a.auction_end_time).getTime() : Infinity;
          const timeB = b.auction_end_time ? new Date(b.auction_end_time).getTime() : Infinity;
          return timeA - timeB;
        });
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime());
        break;
      case 'price_asc':
        result.sort((a, b) => parseFloat(a.current_bid || a.price || '0') - parseFloat(b.current_bid || b.price || '0'));
        break;
      case 'price_desc':
        result.sort((a, b) => parseFloat(b.current_bid || b.price || '0') - parseFloat(a.current_bid || a.price || '0'));
        break;
    }
    return result;
  }, [auctions, sortBy, activeCategory]);

  return (
    <div className="bg-gray-50 min-h-screen pb-24 font-sans">
      <LoadingBar isLoading={loading} />
      {/* Professional Auction Floor Header */}
      <div className="bg-white border-b border-gray-100 pt-16 pb-20 relative overflow-hidden">
        {/* Subtle Geometric Background */}
        <div className="absolute top-0 right-0 w-full h-full opacity-[0.02] pointer-events-none select-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
              <div className="space-y-6 max-w-2xl">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-brand-blue/5 text-brand-blue px-3 py-1 rounded-md border border-brand-blue/10">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue"></span>
                    </span>
                    <span className="text-[10px] font-black tracking-widest uppercase">Live Floor</span>
                  </div>
                  <div className="h-4 w-px bg-gray-200" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Bidding Active</span>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-black text-brand-dark tracking-tighter leading-tight">
                  The <span className="text-brand-blue underline decoration-brand-blue/20 underline-offset-8">Auction Floor</span>
                </h1>
                
                <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-xl">
                  Browse the current collection of active lots. Real-time updates and secure bidding for verified participants.
                </p>

                <div className="flex items-center space-x-8 pt-2">
                  <div className="flex items-center space-x-3">
                    <Trophy className="w-5 h-5 text-brand-blue" />
                    <div>
                      <p className="text-lg font-black text-brand-dark leading-none">{auctions.length}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Active Lots</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-brand-orange" />
                    <div>
                      <p className="text-lg font-black text-brand-dark leading-none">2.8k+</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Bidders Online</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Functional Control Panel */}
              <div className="w-full lg:w-[480px] bg-gray-50 p-6 lg:p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="space-y-4">
                  <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-blue transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search for lots by name or keyword..." 
                      className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-12 pr-6 text-sm font-bold placeholder:text-gray-400 focus:border-brand-blue/30 focus:outline-none transition-all shadow-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <SlidersHorizontal className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select 
                        className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-12 pr-10 text-[10px] font-black text-brand-dark uppercase tracking-widest appearance-none focus:border-brand-blue/30 focus:outline-none cursor-pointer shadow-sm"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'ending_soon' | 'newest' | 'price_asc' | 'price_desc')}
                      >
                        <option value="ending_soon">Ending Soon</option>
                        <option value="newest">Recently Added</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                      </select>
                    </div>
                    <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                      <button 
                        onClick={() => setViewMode('grid')}
                        className={`flex-1 flex items-center justify-center py-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-brand-dark text-white' : 'text-gray-400 hover:text-brand-dark'}`}
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setViewMode('list')}
                        className={`flex-1 flex items-center justify-center py-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-brand-dark text-white' : 'text-gray-400 hover:text-brand-dark'}`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Filter Bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto flex items-center h-16 overflow-x-auto scrollbar-hide">
            <div className="flex items-center space-x-2 min-w-max">
              <Filter className="w-4 h-4 text-brand-blue mr-4" />
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeCategory === cat 
                    ? 'bg-brand-blue text-white shadow-md' 
                    : 'bg-transparent text-gray-400 hover:text-brand-dark hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <ProductSkeleton key={i} isAuction={true} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-24 bg-red-50/50 rounded-[48px] border border-red-100 max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Zap className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-black text-brand-dark mb-4 tracking-tight">Sync interrupted</h3>
              <p className="text-red-600 font-bold mb-10 px-10">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-brand-dark text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-600 transition-all shadow-2xl shadow-brand-dark/20"
              >
                Retry Connection
              </button>
            </div>
          ) : (
            <>
              {/* Results Stats */}
              <div className="flex items-center justify-between mb-12">
                <p className="text-sm font-black text-gray-900 uppercase tracking-widest">
                  Showing <span className="text-brand-blue">{filteredAndSortedAuctions.length}</span> Results
                </p>
                <div className="flex items-center space-x-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <Clock className="w-4 h-4" />
                  <span>Real-time Sync Active</span>
                </div>
              </div>

              {/* Grid View */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                  {filteredAndSortedAuctions.map(product => (
                    <ProductCard key={product.id} product={product} isAuction={true} />
                  ))}
                </div>
              ) : (
                /* List View */
                <div className="space-y-6">
                  {filteredAndSortedAuctions.map(product => (
                    <div key={product.id} className="group bg-white rounded-[40px] border border-gray-100 p-6 flex flex-col md:flex-row items-center gap-8 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500">
                      <div className="w-full md:w-64 aspect-[4/3] rounded-[32px] overflow-hidden bg-gray-50 flex-shrink-0">
                        <img 
                          src={product.images[0]?.src || 'https://via.placeholder.com/300x300'} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      <div className="flex-grow space-y-4">
                        <div className="flex items-center space-x-2">
                          {product.categories.slice(0, 1).map(cat => (
                            <span key={cat.id} className="text-[10px] font-black text-brand-blue uppercase tracking-widest bg-brand-blue/5 px-3 py-1 rounded-full">{cat.name}</span>
                          ))}
                        </div>
                        <h3 className="text-2xl font-black text-brand-dark group-hover:text-brand-blue transition-colors">{product.name}</h3>
                        <div className="flex flex-wrap gap-6 pt-2">
                          <div className="flex items-center space-x-2">
                            <Hammer className="w-4 h-4 text-brand-orange" />
                            <span className="text-sm font-black text-gray-900">₦{parseFloat(product.current_bid || product.price || '0').toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-bold text-gray-500">{product.bid_count || 0} Bidders</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full md:w-auto flex flex-col gap-3">
                        <button 
                          onClick={() => window.location.href = `/product/${product.slug}`}
                          className="bg-brand-dark text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-blue transition-all shadow-xl shadow-brand-dark/10 flex items-center justify-center space-x-2"
                        >
                          <span>Place Bid</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {filteredAndSortedAuctions.length === 0 && (
                <div className="text-center py-40 bg-white rounded-[60px] border border-dashed border-gray-100 shadow-sm max-w-4xl mx-auto">
                  <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-10">
                    <Hammer className="w-12 h-12 text-gray-200" />
                  </div>
                  <h3 className="text-4xl font-black text-brand-dark mb-6 tracking-tighter">Lot synchronization empty</h3>
                  <p className="text-gray-400 font-bold max-w-md mx-auto mb-12 leading-relaxed uppercase tracking-[0.2em] text-[11px]">
                    We are currently cataloging new exclusive assets for our upcoming auction sessions.
                  </p>
                  <button 
                     onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
                     className="bg-brand-blue text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-brand-dark transition-all shadow-2xl shadow-brand-blue/30"
                  >
                     Reset Filter Cloud
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auctions;
