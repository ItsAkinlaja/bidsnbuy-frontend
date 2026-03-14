import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { wpService } from '../services/wp-api';
import { authService } from '../services/auth';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import { useNotification } from '../context/NotificationContext';
import AuthModal from '../components/AuthModal';
import type { WPProduct } from '../types/wordpress';
import { 
  Loader2, 
  Hammer, 
  Clock, 
  TrendingUp, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Users,
  Trophy,
  History,
  Info
} from 'lucide-react';

const PRODUCT_TABS = [
  { id: 'description', label: 'Description', icon: <Info className="w-4 h-4" /> },
  { id: 'specifications', label: 'Specifications', icon: <ShoppingBag className="w-4 h-4" /> },
  { id: 'shipping', label: 'Shipping & Returns', icon: <Truck className="w-4 h-4" /> }
] as const;

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { setCustomTitle } = useBreadcrumb();
  const { showNotification } = useNotification();
  const [product, setProduct] = useState<WPProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [placingBid, setPlacingBid] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'shipping'>('description');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await wpService.getProductBySlug(slug);
        if (data) {
          setProduct(data);
          setCustomTitle(data.name);
          const initialBid = parseFloat(data.current_bid || data.price || '0');
          setBidAmount(initialBid + 1000); // Default next bid
          
          // Add to recently viewed
          const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
          const updatedRecent = [data.id, ...recent.filter((id: number) => id !== data.id)].slice(0, 10);
          localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecent));
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug, setCustomTitle]);

  useEffect(() => {
    if (product?.is_auction && product.auction_end_time) {
      const timer = setInterval(() => {
        const end = new Date(product.auction_end_time!).getTime();
        const now = new Date().getTime();
        const diff = end - now;

        if (diff <= 0) {
          setTimeLeft('Ended');
          clearInterval(timer);
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(`${days > 0 ? days + 'd ' : ''}${hours}h ${mins}m ${secs}s`);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [product]);

  const handlePlaceBid = async () => {
    if (!authService.isAuthenticated()) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!product) return;

    try {
      setPlacingBid(true);
      await wpService.placeBid(product.id, bidAmount);
      showNotification({
        title: 'Bid Successful!',
        message: 'Your bid has been placed. Good luck!',
        type: 'success'
      });
      // Refresh product data to show new current bid
      const updatedProduct = await wpService.getProductBySlug(slug!);
      if (updatedProduct) setProduct(updatedProduct);
    } catch (err) {
      console.error('Error placing bid:', err);
      showNotification({
        title: 'Bid Failed',
        message: 'Ensure your bid is higher than the current one and the auction is still active.',
        type: 'error'
      });
    } finally {
      setPlacingBid(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-white">
        <div className="relative mb-6">
          <div className="w-28 h-28 bg-brand-blue/5 rounded-full flex items-center justify-center">
            <img 
              src="https://bidsnbuy.ng/wp-content/uploads/2025/11/Bidnbuylogo-removebg-preview.png" 
              alt="Loading" 
              className="h-16 w-auto object-contain animate-pulse"
            />
          </div>
          <div className="absolute -bottom-1 -right-1">
            <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
          </div>
        </div>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">Fetching Details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-black text-gray-900 mb-4">{error || 'Product Not Found'}</h2>
        <button 
          onClick={() => navigate('/products')}
          className="bg-brand-dark text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-blue transition-all"
        >
          Back to Store
        </button>
      </div>
    );
  }

  const isAuction = product.is_auction || product.type === 'auction' || product.categories.some(c => c.slug === 'auctions' || c.slug === 'bidding');

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="hidden lg:flex items-center space-x-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-12">
          <button onClick={() => navigate('/')} className="hover:text-brand-blue">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/products')} className="hover:text-brand-blue">Store</button>
          <span>/</span>
          <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-square rounded-[40px] overflow-hidden bg-gray-50 border border-gray-100">
              <img 
                src={product.images[currentImageIndex]?.src || 'https://via.placeholder.com/800x800?text=No+Image'} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {product.images.length > 1 && (
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                  <button 
                    onClick={() => setCurrentImageIndex(prev => (prev === 0 ? product.images.length - 1 : prev - 1))}
                    className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all pointer-events-auto"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => setCurrentImageIndex(prev => (prev === product.images.length - 1 ? 0 : prev + 1))}
                    className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all pointer-events-auto"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button 
                  key={img.id}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${currentImageIndex === idx ? 'border-brand-blue scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img.src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <div className="mb-6">
              {product.categories.map(cat => (
                <span key={cat.id} className="inline-block bg-brand-blue/5 text-brand-blue text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest mr-2 mb-2">
                  {cat.name}
                </span>
              ))}
            </div>

            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-6">
              {product.name}
            </h1>

            {isAuction ? (
              <>
                <div className="bg-brand-blue rounded-[30px] p-8 text-white shadow-2xl shadow-brand-blue/20 mb-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-md">
                      <Hammer className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">Live Auction</span>
                    </div>
                    <div className="flex items-center space-x-2 text-white/80 font-bold">
                      <Clock className="w-5 h-5" />
                      <span className="tabular-nums">{timeLeft}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Current Bid</p>
                      <p className="text-4xl font-black tabular-nums">₦{parseFloat(product.current_bid || product.price || '0').toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Total Bids</p>
                      <p className="text-4xl font-black tabular-nums">{product.bid_count || 0}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-brand-blue">₦</span>
                      <input 
                        type="number" 
                        value={bidAmount}
                        onChange={(e) => setBidAmount(Number(e.target.value))}
                        className="w-full bg-white text-gray-900 rounded-2xl py-5 pl-10 pr-4 text-2xl font-black focus:outline-none"
                      />
                    </div>
                    <button 
                      onClick={handlePlaceBid}
                      disabled={placingBid}
                      className="w-full bg-brand-dark text-white py-5 rounded-2xl text-xl font-black hover:bg-brand-orange transition-all shadow-xl flex items-center justify-center space-x-3 disabled:opacity-50"
                    >
                      {placingBid ? <Loader2 className="animate-spin" /> : <TrendingUp className="w-6 h-6" />}
                      <span>{placingBid ? 'Processing...' : 'Place Your Bid'}</span>
                    </button>
                    <p className="text-center text-[10px] text-white/60 font-bold uppercase tracking-widest">
                      Bids cannot be cancelled once placed
                    </p>
                  </div>
                </div>

                {/* Bidder History List */}
                <div className="bg-gray-50 rounded-[30px] p-8 mb-10 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <History className="w-5 h-5 text-brand-blue" />
                      <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Bidder History</h3>
                    </div>
                    <span className="text-[10px] font-black text-brand-blue uppercase bg-brand-blue/5 px-3 py-1 rounded-full">Live Updates</span>
                  </div>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                    {product.bidder_history && product.bidder_history.length > 0 ? (
                      product.bidder_history.map((bid, idx: number) => (
                        <div key={idx} className={`flex items-center justify-between p-4 rounded-2xl border ${idx === 0 ? 'bg-white border-brand-blue/20 shadow-md ring-1 ring-brand-blue/5' : 'bg-white/50 border-gray-100'}`}>
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${idx === 0 ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-400'}`}>
                              {idx === 0 ? <Trophy className="w-5 h-5" /> : idx + 1}
                            </div>
                            <div>
                              <p className="text-xs font-black text-gray-900">{bid.user_name || 'Anonymous'}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase">{new Date(bid.date).toLocaleTimeString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-black ${idx === 0 ? 'text-brand-blue' : 'text-gray-900'}`}>₦{parseFloat(bid.bid).toLocaleString()}</p>
                            {idx === 0 && <span className="text-[8px] font-black text-brand-orange uppercase tracking-tighter">Current Leader</span>}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10">
                        <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No bids placed yet</p>
                        <p className="text-[10px] text-gray-300 mt-1">Be the first to bid on this item!</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="mb-10">
                <div className="flex items-baseline space-x-4 mb-8">
                  <span className="text-5xl font-black text-gray-900">₦{parseFloat(product.price || '0').toLocaleString()}</span>
                  {product.regular_price && product.regular_price !== product.price && (
                    <span className="text-2xl text-gray-400 line-through font-bold">₦{parseFloat(product.regular_price).toLocaleString()}</span>
                  )}
                </div>

                <button className="w-full bg-brand-dark text-white py-5 rounded-2xl text-xl font-black hover:bg-brand-blue transition-all shadow-xl shadow-brand-dark/10 flex items-center justify-center space-x-3 group">
                  <ShoppingBag className="w-6 h-6" />
                  <span>Add to Cart</span>
                </button>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex gap-4 mb-10">
              <button className="flex-1 bg-gray-50 text-gray-900 py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-brand-blue hover:text-white transition-all">
                <Heart className="w-5 h-5" />
                <span>Wishlist</span>
              </button>
              <button className="flex-1 bg-gray-50 text-gray-900 py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-brand-blue hover:text-white transition-all">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Details Revamp - Full Width Section */}
        <div className="mt-24 pt-20 border-t border-gray-100">
          <div className="max-w-5xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex justify-center space-x-4 md:space-x-12 border-b border-gray-100 mb-16 overflow-x-auto scrollbar-hide pb-px">
              {PRODUCT_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 pb-6 text-sm font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap group ${
                    activeTab === tab.id ? 'text-brand-blue' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <span className={`transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-blue rounded-full animate-in fade-in slide-in-from-bottom-1" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === 'description' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-8">
                      <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center space-x-3">
                        <div className="w-8 h-8 bg-brand-blue/10 rounded-lg flex items-center justify-center">
                          <Info className="w-4 h-4 text-brand-blue" />
                        </div>
                        <span>Product Overview</span>
                      </h3>
                      <div 
                        className="text-gray-600 leading-relaxed font-medium prose prose-blue max-w-none
                          prose-headings:font-black prose-headings:text-brand-dark prose-headings:tracking-tight
                          prose-p:mb-6 prose-li:mb-2 prose-strong:text-brand-dark prose-img:rounded-[30px] prose-img:shadow-lg"
                        dangerouslySetInnerHTML={{ __html: product.description || product.short_description }}
                      />
                    </div>
                    <div className="lg:col-span-4 space-y-6">
                      <div className="bg-gray-50 rounded-[40px] p-8 border border-gray-100">
                        <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-6">Quick Highlights</h4>
                        <ul className="space-y-4">
                          <li className="flex items-start space-x-3">
                            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <ShieldCheck className="w-3 h-3 text-green-600" />
                            </div>
                            <span className="text-sm font-bold text-gray-600">Verified Authentic Item</span>
                          </li>
                          <li className="flex items-start space-x-3">
                            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Truck className="w-3 h-3 text-brand-blue" />
                            </div>
                            <span className="text-sm font-bold text-gray-600">Secure Insured Delivery</span>
                          </li>
                          <li className="flex items-start space-x-3">
                            <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Clock className="w-3 h-3 text-brand-orange" />
                            </div>
                            <span className="text-sm font-bold text-gray-600">Limited Time Auction</span>
                          </li>
                        </ul>
                      </div>
                      
                      {/* Featured Categories/Badges */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-brand-blue/5 rounded-3xl p-6 text-center border border-brand-blue/10">
                          <Trophy className="w-6 h-6 text-brand-blue mx-auto mb-2" />
                          <p className="text-[10px] font-black text-brand-blue uppercase">Top Rated</p>
                        </div>
                        <div className="bg-brand-orange/5 rounded-3xl p-6 text-center border border-brand-orange/10">
                          <TrendingUp className="w-6 h-6 text-brand-orange mx-auto mb-2" />
                          <p className="text-[10px] font-black text-brand-orange uppercase">Hot Item</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="max-w-3xl mx-auto">
                    <h3 className="text-2xl font-black text-gray-900 mb-10 flex items-center justify-center space-x-3">
                      <div className="w-8 h-8 bg-brand-orange/10 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 text-brand-orange" />
                      </div>
                      <span>Technical Specifications</span>
                    </h3>
                    
                    {product.attributes && product.attributes.length > 0 ? (
                      <div className="bg-gray-50 rounded-[40px] overflow-hidden border border-gray-100">
                        {product.attributes?.map((attr, idx) => (
                          <div 
                            key={idx} 
                            className={`flex items-center px-8 py-6 ${idx !== (product.attributes?.length ?? 0) - 1 ? 'border-b border-gray-100' : ''} hover:bg-white transition-colors`}
                          >
                            <span className="w-1/3 text-xs font-black text-gray-400 uppercase tracking-widest" dangerouslySetInnerHTML={{ __html: attr.name }} />
                            <span className="w-2/3 text-sm font-black text-gray-900" dangerouslySetInnerHTML={{ __html: attr.options.join(', ') }} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-20 text-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                          <Info className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No detailed specifications provided</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="group bg-white p-10 rounded-[40px] border border-gray-100 hover:border-brand-blue/30 hover:shadow-2xl hover:shadow-brand-blue/5 transition-all duration-500">
                      <div className="w-14 h-14 bg-brand-blue/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500">
                        <Truck className="w-7 h-7 text-brand-blue group-hover:text-white" />
                      </div>
                      <h4 className="font-black text-gray-900 uppercase tracking-widest text-sm mb-4">Shipping Policy</h4>
                      <p className="text-gray-600 leading-relaxed font-medium mb-6">
                        We offer nationwide shipping across Nigeria. Orders are typically processed within 24-48 hours. 
                        Delivery times vary by location: Lagos (1-2 days), Other States (3-5 days).
                      </p>
                      <div className="flex items-center space-x-2 text-[10px] font-black text-brand-blue uppercase tracking-widest bg-brand-blue/5 px-4 py-2 rounded-full w-fit">
                        <div className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-pulse" />
                        <span>Real-time Tracking Included</span>
                      </div>
                    </div>

                    <div className="group bg-white p-10 rounded-[40px] border border-gray-100 hover:border-green-500/30 hover:shadow-2xl hover:shadow-green-500/5 transition-all duration-500">
                      <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-green-500 group-hover:text-white transition-all duration-500">
                        <RotateCcw className="w-7 h-7 text-green-600 group-hover:text-white" />
                      </div>
                      <h4 className="font-black text-gray-900 uppercase tracking-widest text-sm mb-4">Returns & Refunds</h4>
                      <p className="text-gray-600 leading-relaxed font-medium mb-6">
                        Auction wins are final. However, if the item received is not as described or damaged during transit, 
                        please contact our support within 24 hours for a full refund or replacement.
                      </p>
                      <div className="flex items-center space-x-2 text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-4 py-2 rounded-full w-fit">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse" />
                        <span>Buyer Protection Guaranteed</span>
                      </div>
                    </div>
                  </div>

                  {/* Trust Badges Integrated */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                    {[
                      { icon: <ShieldCheck className="w-5 h-5" />, label: 'Secure Payment', color: 'blue' },
                      { icon: <Truck className="w-5 h-5" />, label: 'Insured Shipping', color: 'orange' },
                      { icon: <Users className="w-5 h-5" />, label: 'Verified Seller', color: 'green' },
                      { icon: <Clock className="w-5 h-5" />, label: '24/7 Support', color: 'dark' }
                    ].map((badge, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-3xl p-6 text-center border border-gray-100 hover:bg-white hover:shadow-lg transition-all cursor-default">
                        <div className={`text-brand-${badge.color} mb-3 flex justify-center`}>{badge.icon}</div>
                        <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{badge.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default ProductDetail;
