import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { wpService } from '../services/wp-api';
import { authService, type AuthResponse } from '../services/auth';
import type { WPPost, WPProduct, WPCategory } from '../types/wordpress';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import LoadingBar from '../components/LoadingBar';
import AuthModal from '../components/AuthModal';
import SEO from '../components/SEO';
import { 
  Loader2, 
  Hammer, 
  ChevronRight, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Trophy, 
  TrendingUp,
  Sparkles,
  Smartphone,
  Shirt,
  Home as HomeIcon,
  Heart,
  Laptop,
  Gamepad2,
  Baby,
  Dumbbell,
  Car,
  UtensilsCrossed
} from 'lucide-react';

const categoryHierarchy = [
  {
    name: "Electronics & Gadgets",
    icon: Smartphone,
    subcategories: [
      { name: "Smartphones & Tablets" },
      { name: "Laptops & Computers" },
      { name: "Smartwatches & Wearables" },
      { name: "Headphones, Earbuds & Speakers" },
      { name: "Gaming Consoles & Accessories" },
      { name: "TV" },
      { name: "Cameras" }
    ]
  },
  {
    name: "Fashion & Style",
    icon: Shirt,
    subcategories: [
      { name: "Men’s Wear" },
      { name: "Women’s Wear" },
      { name: "Kids’ Fashion" },
      { name: "Shoes, Sneakers & Sandals" },
      { name: "Bags, Purses & Wallets" },
      { name: "Jewelry & Watches" }
    ]
  },
  {
    name: "Home & Living",
    icon: HomeIcon,
    subcategories: [
      { name: "Home Appliances" },
      { name: "Kitchenware & Cookware" },
      { name: "Furniture & Decor" },
      { name: "Bedding & Curtains" }
    ]
  },
  {
    name: "Beauty & Personal Care",
    icon: Heart,
    subcategories: [
      { name: "Skincare Products" },
      { name: "Makeup & Cosmetics" },
      { name: "Perfumes & Fragrances" },
      { name: "Hair Care Products" },
      { name: "Health & Wellness Essentials" }
    ]
  },
  {
    name: "Computers & Accessories",
    icon: Laptop,
    subcategories: [
      { name: "Keyboards, Mice & Monitors" },
      { name: "Storage Devices & Hard Drives" },
      { name: "Networking Equipment" },
      { name: "Printers & Office Supplies" }
    ]
  },
  {
    name: "Gaming & Entertainment",
    icon: Gamepad2,
    subcategories: [
      { name: "Game Consoles" },
      { name: "Video Games" },
      { name: "VR Headsets" },
      { name: "Gaming Accessories" }
    ]
  },
  {
    name: "Kids & Baby Essentials",
    icon: Baby,
    subcategories: [
      { name: "Toys & Games" },
      { name: "Baby Clothing" },
      { name: "Baby Care Products" }
    ]
  },
  {
    name: "Sports & Fitness",
    icon: Dumbbell,
    subcategories: [
      { name: "Fitness Equipment" },
      { name: "Sportswear & Sneakers" },
      { name: "Outdoor & Camping Gear" }
    ]
  },
  {
    name: "Automotive & Tools",
    icon: Car,
    subcategories: [
      { name: "Car Accessories" },
      { name: "Power Tools & Hand Tools" },
      { name: "Motorcycle Accessories" }
    ]
  },
  {
    name: "Food & Beverages",
    icon: UtensilsCrossed,
    subcategories: [
      { name: "Packaged Food & Snacks" },
      { name: "Beverages & Soft Drinks" },
      { name: "Wines & Spirits" },
      { name: "Groceries & Cooking Essentials" }
    ]
  },
  {
    name: "Flash Deals & Auctions",
    icon: Zap,
    path: "/auctions",
    subcategories: [
      { name: "Limited-time flash sales" },
      { name: "Hot auction items" },
      { name: "Daily mega discounts" }
    ]
  }
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [auctions, setAuctions] = useState<WPProduct[]>([]);
  const [newArrivals, setNewArrivals] = useState<WPProduct[]>([]);
  const [justForYou, setJustForYou] = useState<WPProduct[]>([]);
  const [categories, setCategories] = useState<WPCategory[]>([]);
  
  // Section-specific loading states for faster perceived performance
  const [auctionsLoading, setAuctionsLoading] = useState(true);
  const [arrivalsLoading, setArrivalsLoading] = useState(true);
  const [dealsLoading, setDealsLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);

  const globalLoading = auctionsLoading || arrivalsLoading || dealsLoading || postsLoading;

  // Preloader state for snappier initial load
  const [showInitialLoader, setShowInitialLoader] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(() => authService.getUser());

  // Helper to find WP category ID
  const getWPId = (name: string) => {
    const wpCat = categories.find(c => c.name.toLowerCase().includes(name.split(' & ')[0].toLowerCase()));
    return wpCat?.id;
  };

  const slides = [
    {
      id: 1,
      title: (
        <>
          Bid. Win. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-orange to-brand-blue bg-[length:200%_auto] animate-gradient">
            Buy Now.
          </span>
        </>
      ),
      description: "Nigeria's premier destination for both thrill-seekers and direct shoppers. Bid on high-end items or buy directly from our exclusive collection.",
      image: "https://bidsnbuy.ng/wp-content/uploads/2025/11/Untitled-design-8.png",
      mobileBg: "https://images.unsplash.com/photo-1554224155-1696413575b3?auto=format&fit=crop&q=80&w=1000",
      accent: "bg-brand-blue/10 text-brand-blue",
      accentText: "NG'S #1 BID & BUY DESTINATION"
    },
    {
      id: 2,
      title: (
        <>
          Premium <br />
          <span className="text-brand-orange">Gadgets.</span>
        </>
      ),
      description: "Get the latest MacBooks, iPhones, and high-end tech at a fraction of the retail price through bidding, or secure yours immediately with 'Buy It Now'.",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
      mobileBg: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1000",
      accent: "bg-brand-orange/10 text-brand-orange",
      accentText: "TECH & ELECTRONICS EXCLUSIVES"
    },
    {
      id: 3,
      title: (
        <>
          Luxury <br />
          <span className="text-brand-blue">Lifestyle.</span>
        </>
      ),
      description: "From designer watches to luxury collectibles. Bid on the finest items or shop our curated luxury catalog for instant ownership.",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
      mobileBg: "https://images.unsplash.com/photo-1614165933834-1db5bb284bc4?auto=format&fit=crop&q=80&w=1000",
      accent: "bg-brand-blue/10 text-brand-blue",
      accentText: "LUXURY & STYLE AUCTIONS"
    }
  ];

  useEffect(() => {
    // Fast exit for preloader
    const loaderTimer = setTimeout(() => setShowInitialLoader(false), 800);
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => {
      clearInterval(timer);
      clearTimeout(loaderTimer);
    };
  }, [slides.length]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await wpService.getPosts({ per_page: 3 });
        setPosts(fetchedPosts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load some content. Please check your connection.');
      } finally {
        setPostsLoading(false);
      }
    };

    const fetchAuctions = async () => {
      try {
        const fetchedAuctions = await wpService.getAuctions({ 
          per_page: 4,
          _fields: 'id,name,slug,price,regular_price,on_sale,images,categories,type,meta_data,date_created'
        });
        setAuctions(fetchedAuctions);
      } catch (err) {
        console.error('Error fetching auctions:', err);
        setError('Failed to load some content. Please check your connection.');
      } finally {
        setAuctionsLoading(false);
      }
    };

    const fetchArrivals = async () => {
      try {
        const fetchedNewArrivals = await wpService.getProducts({ 
          per_page: 4, 
          orderby: 'date', 
          order: 'desc',
          _fields: 'id,name,slug,price,regular_price,on_sale,images,categories,type,meta_data,date_created'
        });
        setNewArrivals(fetchedNewArrivals);
      } catch (err) {
        console.error('Error fetching arrivals:', err);
        setError('Failed to load some content. Please check your connection.');
      } finally {
        setArrivalsLoading(false);
      }
    };

    const fetchDeals = async () => {
      try {
        const fetchedJustForYou = await wpService.getProducts({ 
          per_page: 8, 
          orderby: 'random',
          _fields: 'id,name,slug,price,regular_price,on_sale,images,categories,type,meta_data,date_created'
        });
        setJustForYou(fetchedJustForYou);
      } catch (err) {
        console.error('Error fetching deals:', err);
        setError('Failed to load some content. Please check your connection.');
      } finally {
        setDealsLoading(false);
      }
    };

    const fetchCats = async () => {
      try {
        const fetchedCategories = await wpService.getCategories({ per_page: 15, hide_empty: true });
        setCategories(fetchedCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load some content. Please check your connection.');
      }
    };

    // Parallel fetching for performance
    fetchPosts();
    fetchAuctions();
    fetchArrivals();
    fetchDeals();
    fetchCats();
  }, []);

  return (
    <div className="bg-white selection:bg-brand-blue/10 selection:text-brand-blue">
      <SEO />
      <LoadingBar isLoading={globalLoading} />
      {/* --- INITIAL TOP-LEVEL PRELOADER (Ultra-Fast) --- */}
      {showInitialLoader && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center transition-opacity duration-500">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-brand-blue/5 rounded-[32px] flex items-center justify-center">
              <img 
                src="https://bidsnbuy.ng/wp-content/uploads/2025/11/Bidnbuylogo-removebg-preview.png" 
                alt="Logo" 
                className="h-14 w-auto object-contain animate-pulse"
              />
            </div>
            <div className="absolute -bottom-2 -right-2">
              <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
            </div>
          </div>
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Welcome to BidsnBuy</p>
        </div>
      )}
      {/* --- MOBILE CATEGORY QUICK LINKS --- */}
      <div className="lg:hidden bg-white border-b border-gray-50 overflow-x-auto custom-scrollbar-hide z-40 shadow-sm">
        <div className="flex items-center space-x-6 px-6 py-4 whitespace-nowrap min-w-max">
          {categoryHierarchy.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                if (item.path) navigate(item.path);
                else {
                  const id = getWPId(item.name);
                  navigate(id ? `/products?category=${id}` : '/products');
                }
              }}
              className="flex flex-col items-center space-y-2 group"
            >
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center active:bg-brand-blue active:text-white transition-all shadow-sm border border-gray-100">
                <item.icon className="w-6 h-6 text-gray-400 group-active:text-white transition-colors" />
              </div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-active:text-brand-blue">
                {item.name.split(' & ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative bg-[#f8fafc] overflow-hidden mb-16 min-h-[600px] lg:min-h-0">
        {/* Background Accents (Desktop Only) */}
        <div className="hidden lg:block absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[1000px] h-[1000px] bg-brand-blue/5 rounded-full blur-[120px] opacity-40" />
        <div className="hidden lg:block absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[800px] h-[800px] bg-brand-orange/5 rounded-full blur-[120px] opacity-30" />
        
        <div className="container mx-auto px-0 lg:px-4 relative z-10 max-w-[1440px]">
          <div className="flex flex-col items-center py-0 lg:py-12">
            
            {/* --- HERO SLIDER CONTENT --- */}
            <div className="w-full relative h-[650px] lg:h-[750px]">
              {slides.map((slide, index) => (
                <div 
                  key={slide.id}
                  className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 transition-all duration-1000 absolute inset-0 ${index === currentSlide ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-20 pointer-events-none'}`}
                  style={{ position: index === currentSlide ? 'relative' : 'absolute' }}
                >
                  {/* Mobile Captivating Background */}
                  <div className="lg:hidden absolute inset-0 z-0">
                    <img 
                      src={slide.mobileBg} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/80 via-brand-dark/40 to-brand-dark/90" />
                  </div>

                  <div className="left-side lg:w-1/2 text-center lg:text-left py-12 px-6 lg:px-0 relative z-10">
                    <div className={`inline-flex items-center space-x-2 ${slide.accent} lg:bg-transparent px-4 py-1.5 rounded-full text-xs font-bold mb-6 animate-fade-in`}>
                      <Zap className="w-3 h-3 fill-current" />
                      <span className="lg:text-inherit text-white">{slide.accentText}</span>
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-black text-white lg:text-gray-900 leading-[0.9] mb-6 tracking-tighter">
                      {slide.title}
                    </h1>
                    <p className="text-lg lg:text-xl text-gray-200 lg:text-gray-600 mb-8 max-w-lg leading-relaxed font-medium mx-auto lg:mx-0">
                      {slide.description}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                      <button 
                        onClick={() => navigate('/auctions')}
                        className="bg-brand-orange lg:bg-brand-dark text-white px-8 py-4 rounded-2xl text-base font-black lg:font-bold hover:bg-brand-blue transition-all duration-300 shadow-2xl shadow-brand-dark/10 flex items-center justify-center group"
                      >
                        Live Auctions
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button 
                        onClick={() => navigate('/products')}
                        className="bg-white/10 lg:bg-white backdrop-blur-md lg:backdrop-blur-none text-white lg:text-brand-dark border-2 border-white/20 lg:border-gray-100 px-8 py-4 rounded-2xl text-base font-black lg:font-bold hover:border-brand-blue hover:text-brand-blue transition-all duration-300 flex items-center justify-center"
                      >
                        Shop Now
                      </button>
                    </div>

                    <div className="mt-10 flex items-center justify-center lg:justify-start space-x-8">
                      <div className="flex flex-col">
                        <span className="text-2xl lg:text-xl font-black text-white lg:text-gray-900">50K+</span>
                        <span className="text-[10px] lg:text-xs text-gray-300 lg:text-gray-500 font-bold uppercase tracking-widest text-center lg:text-left">Happy Users</span>
                      </div>
                      <div className="w-px h-10 lg:h-8 bg-white/20 lg:bg-gray-100" />
                      <div className="flex flex-col">
                        <span className="text-2xl lg:text-xl font-black text-white lg:text-gray-900">₦2.5B+</span>
                        <span className="text-[10px] lg:text-xs text-gray-300 lg:text-gray-500 font-bold uppercase tracking-widest text-center lg:text-left">Successful Sales</span>
                      </div>
                    </div>
                  </div>

                  <div className="hidden lg:block lg:w-1/2 relative py-8">
                    <div className="relative z-10 animate-float">
                      <img 
                        src={slide.image} 
                        alt="Premium Product" 
                        className="rounded-[30px] shadow-2xl border-4 lg:border-8 border-white aspect-[4/3] object-cover max-h-[400px] lg:max-h-none w-full"
                      />
                      {/* Floating Stats Card (Only for first slide) */}
                      {index === 0 && (
                        <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-2xl border border-gray-50 animate-bounce-slow z-20">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                              <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Highest Bid</p>
                              <p className="text-xl font-black text-gray-900">₦450,000</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Floating User Card */}
                      <div className="absolute top-4 right-4 bg-white p-4 rounded-2xl shadow-2xl border border-gray-50 animate-float-delayed z-20">
                         <div className="flex -space-x-3 mb-2">
                           {[1,2,3,4].map(i => (
                             <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                               <img src={`https://i.pravatar.cc/150?u=${i + (index * 4)}`} alt="user" />
                             </div>
                           ))}
                           <div className="w-8 h-8 rounded-full border-2 border-white bg-brand-blue text-[10px] text-white flex items-center justify-center font-bold">+{12 + (index * 5)}</div>
                         </div>
                         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active Bidders</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-0 lg:left-0 flex space-x-3 z-30">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-12 bg-brand-blue' : 'w-2 bg-gray-200 hover:bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MARQUEE SECTION --- */}
      <section className="bg-brand-dark py-6 overflow-hidden border-y border-white/5">
        <div className="animate-marquee whitespace-nowrap flex items-center">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center mx-8">
              <span className="text-white text-lg lg:text-xl font-black uppercase tracking-[0.2em]">
                Free Delivery when you spend over <span className="text-brand-orange">₦150,000</span>
              </span>
              <div className="mx-8 w-2 h-2 bg-brand-blue rounded-full" />
              <Zap className="w-5 h-5 text-brand-orange fill-current" />
            </div>
          ))}
        </div>
      </section>

      {/* --- NEW ARRIVALS SECTION --- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-[1440px]">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-16 gap-8 text-center md:text-left">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-3 text-brand-orange font-black text-sm tracking-[0.3em] uppercase mb-4 justify-center md:justify-start">
                <Sparkles className="w-5 h-5" />
                <span>Warehouse Direct</span>
              </div>
              <h2 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tight">New <span className="text-gray-400 italic">Arrivals</span></h2>
            </div>
            <button 
              onClick={() => navigate('/products')}
              className="bg-white hover:bg-brand-dark hover:text-white text-brand-dark border-2 border-gray-100 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center group shadow-sm hover:shadow-xl"
            >
              Shop All New
              <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {arrivalsLoading ? (
              [1, 2, 3, 4].map(i => (
                <ProductSkeleton key={i} />
              ))
            ) : (
              newArrivals.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>

          {error && (
            <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 font-medium text-center">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* --- LIVE AUCTIONS SECTION --- */}
      <section className="py-24 bg-gray-50/50 border-y border-gray-100">
        <div className="container mx-auto px-4 max-w-[1440px]">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-16 gap-8 text-center md:text-left">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-3 text-brand-blue font-black text-sm tracking-[0.3em] uppercase mb-4 justify-center md:justify-start">
                <div className="w-10 h-px bg-brand-blue/30 hidden md:block" />
                <Hammer className="w-5 h-5" />
                <span>Real-time Bidding</span>
              </div>
              <h2 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tight">Live <span className="text-gray-400 italic">Auctions</span></h2>
            </div>
            <button 
              onClick={() => navigate('/auctions')}
              className="bg-white hover:bg-brand-dark hover:text-white text-brand-dark border-2 border-gray-100 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center group shadow-sm hover:shadow-xl"
            >
              View All Auctions
              <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {auctionsLoading ? (
              [1, 2, 3, 4].map(i => (
                <ProductSkeleton key={i} isAuction={true} />
              ))
            ) : auctions.length > 0 ? (
              auctions.map(product => (
                <ProductCard key={product.id} product={product} isAuction={true} />
              ))
            ) : (
              // Empty State Mockups for Bidding
              [1, 2, 3, 4].map(i => (
                <div key={i} className="opacity-40 grayscale pointer-events-none">
                  <ProductCard 
                    product={{
                      id: i,
                      name: "Sample Auction Item",
                      price: "150000",
                      images: [{ src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400", id: 1, name: "", alt: "" }],
                      categories: [{ id: 1, name: "Electronics", slug: "electronics" }],
                      auction_end_time: new Date(Date.now() + 3600000 * i).toISOString(),
                      date_created: new Date().toISOString(),
                      current_bid: "45000",
                      is_auction: true,
                      slug: "", description: "", short_description: "", regular_price: "", sale_price: "", on_sale: false, status: "", stock_status: ""
                    }} 
                    isAuction={true} 
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* --- JUST FOR YOU SECTION --- */}
      <section className="py-24 bg-gray-50/50">
        <div className="container mx-auto px-4 max-w-[1440px]">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-2 text-brand-orange font-black text-sm tracking-widest uppercase mb-4">
              <Sparkles className="w-5 h-5" />
              <span>Recommended Picks</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tight">Just For <span className="text-gray-400 italic">You</span></h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {dealsLoading ? (
              [1, 2, 3, 4].map(i => (
                <ProductSkeleton key={i} />
              ))
            ) : (
              justForYou.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-32">
        <div className="container mx-auto px-4 max-w-[1440px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="group p-12 rounded-[50px] bg-white border border-gray-100 hover:border-brand-blue transition-all duration-500 hover:shadow-2xl hover:shadow-brand-blue/5">
              <div className="w-20 h-20 bg-brand-blue/5 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-brand-blue transition-colors">
                <ShieldCheck className="w-10 h-10 text-brand-blue group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">Secure Bidding</h3>
              <p className="text-xl text-gray-500 leading-relaxed font-medium">
                Our advanced verification system ensures every bid is authentic and every winner is protected.
              </p>
            </div>
            
            <div className="group p-12 rounded-[50px] bg-white border border-gray-100 hover:border-brand-orange transition-all duration-500 hover:shadow-2xl hover:shadow-brand-orange/5">
              <div className="w-20 h-20 bg-brand-orange/5 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-brand-orange transition-colors">
                <Trophy className="w-10 h-10 text-brand-orange group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">Fair Play Guarantee</h3>
              <p className="text-xl text-gray-500 leading-relaxed font-medium">
                Transparent auction logs and anti-sniper protection for a level playing field for everyone.
              </p>
            </div>

            <div className="group p-12 rounded-[50px] bg-white border border-gray-100 hover:border-green-600 transition-all duration-500 hover:shadow-2xl hover:shadow-green-50">
              <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-green-600 transition-colors">
                <Zap className="w-10 h-10 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">Instant Payouts</h3>
              <p className="text-xl text-gray-500 leading-relaxed font-medium">
                Won an auction? Our streamlined checkout process gets your items moving in minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- LATEST UPDATES (BLOG) --- */}
      <section className="py-12 md:py-20 bg-brand-dark text-white rounded-[32px] md:rounded-[60px] mx-4 mb-12 md:mb-20 overflow-hidden relative">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(30,92,234,0.15),transparent)]" />
        
        <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-[1440px]">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-10 md:mb-16 gap-6 text-center md:text-left">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-3 text-brand-blue font-black text-[10px] md:text-xs tracking-[0.3em] uppercase mb-3 md:mb-4">
                <div className="w-6 md:w-10 h-px bg-brand-blue" />
                <span>BidsnBuy Insider</span>
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1] md:leading-[0.9]">
                Master the Art <br className="hidden md:block" />
                <span className="text-brand-orange">of Bidding.</span>
              </h2>
            </div>
            <button className="bg-white text-brand-dark px-8 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-sm md:text-base hover:bg-brand-blue hover:text-white transition-all duration-500 flex items-center group shadow-2xl">
              Read All Stories
              <ChevronRight className="ml-2 md:ml-3 w-4 md:w-5 h-4 md:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
            {postsLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white/5 aspect-[16/10] rounded-[24px] md:rounded-[40px] mb-6 md:mb-8" />
                  <div className="h-4 bg-white/5 rounded w-1/3 mb-4" />
                  <div className="h-6 md:h-8 bg-white/5 rounded w-full mb-4" />
                  <div className="h-4 bg-white/5 rounded w-1/2" />
                </div>
              ))
            ) : (
              posts.map((post) => (
                <article key={post.id} className="group cursor-pointer">
                  <div className="relative aspect-[16/10] rounded-[24px] md:rounded-[40px] overflow-hidden mb-6 md:mb-10 bg-gray-800 shadow-2xl">
                    <img 
                      src={post._embedded?.['wp:featuredmedia']?.[0]?.source_url || "https://images.unsplash.com/photo-1491933382434-500287f9b54b?auto=format&fit=crop&q=80&w=800"} 
                      alt={post.title.rendered}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-80" />
                  </div>
                  <div className="flex items-center space-x-3 md:space-x-4 mb-4 md:mb-6 text-brand-blue font-black text-[10px] md:text-xs uppercase tracking-[0.2em]">
                    <span className="bg-brand-blue/10 px-2.5 md:px-3 py-1 rounded-md md:rounded-lg">Auction Guide</span>
                    <span className="w-1 h-1 bg-white/20 rounded-full" />
                    <span className="text-white/40">5 Min Read</span>
                  </div>
                  <h3 className="text-xl md:text-3xl font-black text-white mb-4 md:mb-6 group-hover:text-brand-orange transition-colors leading-tight" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                  <div className="flex items-center text-white/40 font-bold text-sm md:text-base group-hover:text-white transition-colors">
                    <span>Continue Reading</span>
                    <ArrowRight className="ml-2 w-4 md:w-5 h-4 md:h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-20 md:py-32 text-center">
        <div className="container mx-auto px-4 max-w-[1440px]">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-brand-blue to-indigo-900 rounded-[40px] md:rounded-[80px] p-12 md:p-24 relative overflow-hidden shadow-2xl shadow-brand-blue/20">
            {/* Decoration */}
            <Hammer className="absolute -top-10 -left-10 w-48 md:w-64 h-48 md:h-64 text-white/10 -rotate-12" />
            <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-white mb-6 md:mb-8 tracking-tighter leading-[1.1] md:leading-[0.9]">Ready to win your first auction?</h2>
              <p className="text-white/70 text-lg md:text-2xl mb-8 md:mb-12 font-medium max-w-3xl mx-auto leading-relaxed">
                Join thousands of happy bidders and start winning premium items at unbelievable prices today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
                {user ? (
                  <button 
                    onClick={() => navigate('/auctions')}
                    className="bg-white text-brand-blue px-10 md:px-16 py-4 md:py-6 rounded-2xl md:rounded-3xl text-lg md:text-2xl font-black hover:bg-brand-dark hover:text-white transition-all duration-500 shadow-2xl"
                  >
                    Go to Auctions
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-white text-brand-blue px-10 md:px-16 py-4 md:py-6 rounded-2xl md:rounded-3xl text-lg md:text-2xl font-black hover:bg-brand-dark hover:text-white transition-all duration-500 shadow-2xl"
                  >
                    Create Free Account
                  </button>
                )}
                <button 
                  onClick={() => navigate('/products')}
                  className="bg-brand-orange text-white border-2 border-brand-orange/30 px-10 md:px-16 py-4 md:py-6 rounded-2xl md:rounded-3xl text-lg md:text-2xl font-black hover:bg-white hover:text-brand-dark transition-all duration-500"
                >
                  Explore Items
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={(userData: AuthResponse) => {
          setUser(userData);
          setIsAuthModalOpen(false);
        }}
      />

      {/* --- STICKY NAV CTA (MOBILE) --- */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 md:hidden w-full px-6 max-w-sm animate-fade-in">
        <button 
          onClick={() => navigate('/auctions')}
          className="w-full bg-brand-dark/95 backdrop-blur-xl text-white px-8 py-4.5 rounded-[24px] font-black shadow-[0_20px_50px_-12px_rgba(30,92,234,0.3)] flex items-center justify-between group active:scale-95 transition-all border border-white/10"
        >
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-orange rounded-full animate-ping opacity-20" />
              <div className="relative w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center shadow-lg shadow-brand-orange/20">
                <Hammer className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.2em] mb-0.5">Live Now</span>
              <span className="text-sm font-black tracking-tight">Enter Auction Floor</span>
            </div>
          </div>
          <div className="bg-white/10 p-2 rounded-xl group-hover:bg-brand-blue transition-colors">
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default Home;
