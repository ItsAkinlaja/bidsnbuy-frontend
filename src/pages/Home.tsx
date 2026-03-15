import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { wpService } from '../services/wp-api';
import { decodeHtml } from '../utils/decode';
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
  TrendingUp,
  Smartphone,
  Shirt,
  Home as HomeIcon,
  Heart,
  Laptop,
  Gamepad2,
  Baby,
  Dumbbell,
  Car,
  UtensilsCrossed,
  Truck,
  Grid3X3,
  ShoppingBag
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

const AnimatedCounter: React.FC<{ target: number; duration?: number; prefix?: string; suffix?: string }> = ({ target, duration = 2000, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

const BrandLogo: React.FC<{ brand: { name: string; logo: string } }> = ({ brand }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="mx-10 lg:mx-16 flex-shrink-0">
        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{brand.name}</span>
      </div>
    );
  }

  return (
    <div className="mx-10 lg:mx-16 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500 flex-shrink-0">
      <img 
        src={brand.logo} 
        alt={brand.name} 
        className="h-6 lg:h-8 w-auto object-contain" 
        onError={() => setError(true)}
      />
    </div>
  );
};

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

  // Helper to find WP category ID with fuzzy matching and search fallback
  const handleCategoryClick = (name: string, path?: string) => {
    if (path) {
      navigate(path);
      return;
    }

    // 1. Try exact match
    let wpCat = categories.find(c => c.name.toLowerCase() === name.toLowerCase());
    
    // 2. Try partial match (split ' & ' or ' / ')
    if (!wpCat) {
      const parts = name.split(/[&/]/).map(p => p.trim().toLowerCase());
      wpCat = categories.find(c => {
        const catName = c.name.toLowerCase();
        return parts.some(p => catName.includes(p));
      });
    }

    if (wpCat) {
      navigate(`/products?category=${wpCat.id}`);
    } else {
      // 3. Fallback to search if no category exists yet
      navigate(`/products?search=${encodeURIComponent(name)}`);
    }
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
      mobileBg: "https://bidsnbuy.ng/wp-content/uploads/2025/11/Untitled-design-8.png",
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
      mobileBg: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1000",
      accent: "bg-brand-blue/10 text-brand-blue",
      accentText: "LUXURY & STYLE AUCTIONS"
    }
  ];

  const brands = [
    { name: "Apple", logo: "https://www.vectorlogo.zone/logos/apple/apple-ar21.svg" },
    { name: "Samsung", logo: "https://www.vectorlogo.zone/logos/samsung/samsung-ar21.svg" },
    { name: "Tecno", logo: "https://logos-download.com/wp-content/uploads/2016/10/Tecno_Mobile_logo.png" },
    { name: "Infinix", logo: "https://logos-download.com/wp-content/uploads/2016/10/Infinix_logo.png" },
    { name: "Syinix", logo: "https://logos-download.com/wp-content/uploads/2021/01/Syinix_Logo.png" },
    { name: "HP", logo: "https://www.vectorlogo.zone/logos/hp/hp-2.svg" },
    { name: "Dell", logo: "https://www.vectorlogo.zone/logos/dell/dell-ar21.svg" },
    { name: "Sony", logo: "https://www.vectorlogo.zone/logos/sony/sony-ar21.svg" },
    { name: "LG", logo: "https://www.vectorlogo.zone/logos/lg/lg-ar21.svg" },
    { name: "Canon", logo: "https://www.vectorlogo.zone/logos/canon/canon-ar21.svg" }
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
          _fields: 'id,name,slug,price,regular_price,on_sale,images,categories,type,meta_data,date_created,yith_auction_to,yith_auction_from,current_bid,bid_count'
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
          per_page: 10, // Fetch more to filter out auctions
          orderby: 'date', 
          order: 'desc',
          _fields: 'id,name,slug,price,regular_price,on_sale,images,categories,type,meta_data,date_created,yith_auction_to,yith_auction_from,current_bid,bid_count'
        });
        // Filter out auctions for "Warehouse Direct" section
        setNewArrivals(fetchedNewArrivals.filter(p => !p.is_auction).slice(0, 4));
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
          per_page: 20, // Fetch more to filter and find deals
          on_sale: true,
          _fields: 'id,name,slug,price,regular_price,on_sale,images,categories,type,meta_data,date_created,yith_auction_to,yith_auction_from,current_bid,bid_count'
        });
        // Filter out auctions and keep retail deals
        setJustForYou(fetchedJustForYou.filter(p => !p.is_auction).slice(0, 8));
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

  // Find the highest bid from live auctions for the hero section
  const highestBid = auctions.length > 0 
    ? Math.max(...auctions.map(a => parseFloat(a.current_bid || a.price || '0')))
    : 450000;

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
                src="https://bidsnbuy.ng/wp-content/uploads/2024/01/cropped-Bidnbuylogo.jpg" 
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
              onClick={() => handleCategoryClick(item.name, item.path)}
              className="flex flex-col items-center space-y-2 group"
            >
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center active:bg-brand-blue active:text-white transition-all shadow-sm border border-gray-100">
                <item.icon className="w-6 h-6 text-gray-400 group-active:text-white transition-colors" />
              </div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-active:text-brand-blue">
                {decodeHtml(item.name.split(' & ')[0])}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative bg-[#f8fafc] overflow-hidden mb-8 lg:mb-16 min-h-[550px] lg:min-h-0">
        {/* Background Accents (Desktop Only) */}
        <div className="hidden lg:block absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[1000px] h-[1000px] bg-brand-blue/5 rounded-full blur-[120px] opacity-40" />
        <div className="hidden lg:block absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[800px] h-[800px] bg-brand-orange/5 rounded-full blur-[120px] opacity-30" />
        
        <div className="container mx-auto px-0 lg:px-4 relative z-10 max-w-[1440px]">
          <div className="flex flex-col items-center py-0 lg:py-12">
            
            {/* --- HERO SLIDER CONTENT --- */}
            <div className="w-full relative h-[600px] lg:h-[750px]">
              {slides.map((slide, index) => (
                <div 
                  key={slide.id}
                  className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 transition-all duration-1000 absolute inset-0 ${index === currentSlide ? 'opacity-100 scale-100 z-20 pointer-events-auto' : 'opacity-0 scale-105 z-10 pointer-events-none'}`}
                >
                  {/* Mobile Premium Visual (Improved) */}
                  <div className="lg:hidden absolute inset-0 z-0 bg-white">
                    <img 
                      src={slide.mobileBg} 
                      alt="" 
                      className={`w-full h-full object-cover ${index === 0 ? 'object-top pb-24' : ''} transition-transform duration-[5000ms] ease-out ${index === currentSlide ? 'scale-[1.05]' : 'scale-100'}`}
                    />
                    {/* Premium Gradient Overlay for slides 2 & 3 */}
                    {index !== 0 && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    )}
                    {/* Mobile-only "Shop Now" banner for Slide 1 */}
                    {index === 0 && (
                      <div className="absolute bottom-8 left-0 right-0 px-6 flex justify-center z-20">
                        <button 
                          onClick={() => navigate('/products')}
                          className="w-full max-w-xs bg-brand-blue text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-brand-blue/30 flex items-center justify-center space-x-2 active:scale-95 transition-all"
                        >
                          <span>Shop Now</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {/* Decorative Elements */}
                    <div className="absolute top-20 right-[-10%] w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-[-10%] w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl" />
                  </div>

                  <div className="left-side lg:w-1/2 text-center lg:text-left pt-20 pb-12 px-6 lg:px-0 relative z-10 h-full flex flex-col justify-end lg:justify-center">
                    <div className={`${index === 0 ? 'hidden lg:inline-flex' : 'inline-flex'} items-center space-x-2 ${slide.accent} lg:bg-transparent px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black mb-4 sm:mb-6 mx-auto lg:mx-0 w-fit backdrop-blur-md lg:backdrop-blur-none`}>
                      <Zap className="w-3 h-3 fill-current" />
                      <span className="lg:text-inherit text-white uppercase tracking-widest">{slide.accentText}</span>
                    </div>
                    <h1 className={`${index === 0 ? 'hidden lg:block' : 'block'} text-[42px] sm:text-5xl lg:text-6xl font-black text-white lg:text-gray-900 leading-[0.95] mb-4 sm:mb-6 tracking-tighter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] lg:drop-shadow-none`}>
                      {slide.title}
                    </h1>
                    <p className={`${index === 0 ? 'hidden lg:block' : 'block'} text-base sm:text-lg lg:text-xl text-white lg:text-gray-600 mb-8 sm:mb-10 max-w-lg leading-relaxed font-black lg:font-medium mx-auto lg:mx-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] lg:drop-shadow-none`}>
                      {slide.description}
                    </p>
                    
                    <div className={`${index === 0 ? 'hidden lg:flex' : 'flex'} flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start`}>
                      <button 
                        onClick={() => navigate('/auctions')}
                        className="bg-brand-orange lg:bg-brand-dark text-white px-8 py-4 lg:py-4.5 rounded-2xl text-xs lg:text-sm font-black uppercase tracking-widest hover:bg-brand-blue transition-all duration-300 shadow-2xl shadow-brand-dark/40 flex items-center justify-center group active:scale-95"
                      >
                        Live Auctions
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button 
                        onClick={() => navigate('/products')}
                        className="bg-brand-blue/10 lg:bg-white backdrop-blur-2xl lg:backdrop-blur-none text-brand-blue lg:text-brand-dark border border-brand-blue/20 lg:border-gray-100 px-8 py-4 lg:py-4.5 rounded-2xl text-xs lg:text-sm font-black uppercase tracking-widest hover:border-brand-blue hover:text-brand-blue transition-all duration-300 flex items-center justify-center active:scale-95"
                      >
                        Shop Now
                      </button>
                    </div>

                    <div className={`${index === 0 ? 'hidden lg:flex' : 'flex'} mt-10 sm:mt-12 items-center justify-center lg:justify-start space-x-8 sm:space-x-12 animate-in slide-in-from-bottom duration-700 delay-400`}>
                      <div className="flex flex-col items-center lg:items-start">
                        <span className="text-2xl lg:text-xl font-black text-white lg:text-gray-900">
                          <AnimatedCounter target={5} suffix="K+" />
                        </span>
                        <span className="text-[8px] lg:text-xs text-white/50 lg:text-gray-500 font-black uppercase tracking-[0.2em]">Happy Users</span>
                      </div>
                      <div className="w-px h-10 lg:h-8 bg-white/10 lg:bg-gray-100" />
                      <div className="flex flex-col items-center lg:items-start">
                        <span className="text-2xl lg:text-xl font-black text-white lg:text-gray-900">
                          <AnimatedCounter target={250} prefix="₦" suffix="M+" />
                        </span>
                        <span className="text-[8px] lg:text-xs text-white/50 lg:text-gray-500 font-black uppercase tracking-[0.2em]">Sales</span>
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
                              <p className="text-xl font-black text-gray-900">₦{highestBid.toLocaleString()}</p>
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

      {/* --- BRAND LOGO MARQUEE (Primary Trust Bar) --- */}
      <section className="py-12 bg-white border-b border-gray-50 overflow-hidden relative z-10">
        <div className="container mx-auto px-4 mb-8">
          <div className="flex items-center justify-center space-x-3 text-gray-400 font-black text-[10px] uppercase tracking-[0.3em]">
            <div className="w-8 h-px bg-gray-200" />
            <span>Authorized Premium Retailer</span>
            <div className="w-8 h-px bg-gray-200" />
          </div>
        </div>
        <div className="flex overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap items-center py-4">
            {brands.map((brand, i) => (
              <BrandLogo key={`brand-1-${i}`} brand={brand} />
            ))}
          </div>
          {/* Duplicate for seamless loop */}
          <div className="flex animate-marquee whitespace-nowrap items-center py-4" aria-hidden="true">
            {brands.map((brand, i) => (
              <BrandLogo key={`brand-2-${i}`} brand={brand} />
            ))}
          </div>
        </div>
      </section>

      {/* --- SHOP BY CATEGORY (Visual Grid) --- */}
      <section className="py-16 lg:py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 max-w-[1440px]">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-2 text-brand-blue font-black text-sm tracking-widest uppercase mb-4">
              <Grid3X3 className="w-5 h-5" />
              <span>Explore Departments</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tight">Shop by <span className="text-gray-400 italic">Category</span></h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.length > 0 ? (
              // Use dynamic categories if available, matched with icons
              categories.slice(0, 6).map((cat) => {
                const iconMatch = categoryHierarchy.find(h => 
                  h.name.toLowerCase().includes(cat.name.toLowerCase()) || 
                  cat.name.toLowerCase().includes(h.name.toLowerCase().split(' & ')[0])
                );
                const Icon = iconMatch?.icon || Grid3X3;
                
                return (
                  <button
                    key={cat.id}
                    onClick={() => navigate(`/products?category=${cat.id}`)}
                    className="group relative aspect-[4/5] rounded-[32px] overflow-hidden bg-gray-50 flex flex-col items-center justify-center p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-blue/10 hover:-translate-y-2 border border-gray-100 hover:border-brand-blue/20"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-blue/10 transition-colors" />
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                        <Icon className="w-8 h-8 text-brand-dark group-hover:text-brand-blue transition-colors" />
                      </div>
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest leading-tight">
                        {decodeHtml(cat.name.split(' & ')[0])}
                      </h3>
                      <div className="mt-4 flex items-center text-[10px] font-bold text-brand-blue opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                        <span>BROWSE STORE</span>
                        <ChevronRight className="ml-1 w-3 h-3" />
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              // Fallback to hardcoded hierarchy if API fails or is empty
              categoryHierarchy.slice(0, 6).map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="group relative aspect-[4/5] rounded-[32px] overflow-hidden bg-gray-50 flex flex-col items-center justify-center p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-blue/10 hover:-translate-y-2 border border-gray-100 hover:border-brand-blue/20"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-blue/10 transition-colors" />
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                      <cat.icon className="w-8 h-8 text-brand-dark group-hover:text-brand-blue transition-colors" />
                    </div>
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest leading-tight">
                      {decodeHtml(cat.name.split(' & ')[0])}
                    </h3>
                    <div className="mt-4 flex items-center text-[10px] font-bold text-brand-blue opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                      <span>BROWSE STORE</span>
                      <ChevronRight className="ml-1 w-3 h-3" />
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </section>

      {/* --- LIVE AUCTIONS SECTION --- */}
      <section className="py-16 lg:py-20 bg-gray-50/50 border-y border-gray-100">
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
              className="hidden md:flex bg-white hover:bg-brand-dark hover:text-white text-brand-dark border-2 border-gray-100 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 items-center group shadow-sm hover:shadow-xl"
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
              <div className="col-span-full py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Hammer className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">No Live Auctions</h3>
                <p className="text-gray-500 font-medium">Check back soon for new exciting auctions!</p>
              </div>
            )}
          </div>

          {/* View All Button for Mobile */}
          <div className="mt-12 flex justify-center md:hidden">
            <button 
              onClick={() => navigate('/auctions')}
              className="w-full bg-white hover:bg-brand-dark hover:text-white text-brand-dark border-2 border-gray-100 px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center group shadow-sm active:scale-95"
            >
              View All Auctions
              <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* --- NEW ARRIVALS SECTION --- */}
      <section className="py-16 lg:py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 max-w-[1440px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 text-brand-orange font-black text-sm tracking-widest uppercase mb-4">
                <ShoppingBag className="w-5 h-5" />
                <span>Warehouse Direct</span>
              </div>
              <h2 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tight">New in <span className="text-gray-400 italic">Store</span></h2>
            </div>
            <button 
              onClick={() => navigate('/products')}
              className="group flex items-center justify-center space-x-3 bg-brand-dark text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-brand-blue transition-all duration-500 shadow-xl shadow-brand-dark/10"
            >
              <span>Explore All Products</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

      {/* --- JUST FOR YOU SECTION --- */}
      <section className="py-16 lg:py-20 bg-gray-50/50">
        <div className="container mx-auto px-4 max-w-[1440px]">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-2 text-brand-blue font-black text-sm tracking-widest uppercase mb-4">
              <ShoppingBag className="w-5 h-5" />
              <span>Personalized Selection</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tight">Just For <span className="text-gray-400 italic">You</span></h2>
            <p className="mt-6 text-gray-500 font-medium max-w-2xl mx-auto text-lg">
              Curated warehouse-direct deals based on your browsing history. Premium quality, unbeatable store prices.
            </p>
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
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-[1440px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            <div className="group p-10 lg:p-12 rounded-[40px] lg:rounded-[50px] bg-gray-50/50 border border-gray-100 hover:border-brand-blue transition-all duration-500 hover:shadow-2xl hover:shadow-brand-blue/5 text-center md:text-left">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-brand-blue/5 rounded-2xl lg:rounded-3xl flex items-center justify-center mb-8 lg:mb-10 group-hover:bg-brand-blue transition-colors mx-auto md:mx-0">
                <ShieldCheck className="w-8 h-8 lg:w-10 lg:h-10 text-brand-blue group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-black text-gray-900 mb-4 lg:mb-6 tracking-tight">Verified Quality</h3>
              <p className="text-lg lg:text-xl text-gray-500 leading-relaxed font-medium">
                Every item, from auctions to store direct, is verified for authenticity and quality.
              </p>
            </div>
            
            <div className="group p-10 lg:p-12 rounded-[40px] lg:rounded-[50px] bg-gray-50/50 border border-gray-100 hover:border-brand-orange transition-all duration-500 hover:shadow-2xl hover:shadow-brand-orange/5 text-center md:text-left">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-brand-orange/5 rounded-2xl lg:rounded-3xl flex items-center justify-center mb-8 lg:mb-10 group-hover:bg-brand-orange transition-colors mx-auto md:mx-0">
                <Truck className="w-8 h-8 lg:w-10 lg:h-10 text-brand-orange group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-black text-gray-900 mb-4 lg:mb-6 tracking-tight">Express Delivery</h3>
              <p className="text-lg lg:text-xl text-gray-500 leading-relaxed font-medium">
                Fast, nationwide shipping on all warehouse-direct products and auction wins.
              </p>
            </div>

            <div className="group p-10 lg:p-12 rounded-[40px] lg:rounded-[50px] bg-gray-50/50 border border-gray-100 hover:border-green-600 transition-all duration-500 hover:shadow-2xl hover:shadow-green-50 text-center md:text-left">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-green-50 rounded-2xl lg:rounded-3xl flex items-center justify-center mb-8 lg:mb-10 group-hover:bg-green-600 transition-colors mx-auto md:mx-0">
                <Zap className="w-8 h-8 lg:w-10 lg:h-10 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-black text-gray-900 mb-4 lg:mb-6 tracking-tight">Direct Savings</h3>
              <p className="text-lg lg:text-xl text-gray-500 leading-relaxed font-medium">
                Skip the middleman and save up to 70% on premium warehouse clearance items.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- MOBILE APP SECTION --- */}
      <section className="py-12 lg:py-16 bg-gray-50/50">
        <div className="container mx-auto px-4 max-w-[1440px]">
          <div className="bg-white rounded-[40px] lg:rounded-[60px] p-8 lg:p-16 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-blue/5 rounded-full blur-[120px] translate-x-1/4" />
            
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 relative z-10">
              <div className="lg:w-1/2 text-center lg:text-left">
                <div className="inline-flex items-center space-x-2 bg-brand-blue/10 text-brand-blue px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                  <Smartphone className="w-3 h-3" />
                  <span>Shop on the Go</span>
                </div>
                <h2 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-[1.1]">
                  Download the <span className="text-brand-blue">BidsnBuy</span> App
                  <span className="ml-4 inline-block bg-brand-orange text-white text-[10px] lg:text-xs px-3 py-1 rounded-full uppercase tracking-widest align-middle">Coming Soon</span>
                </h2>
                <p className="text-lg lg:text-xl text-gray-500 mb-10 font-medium leading-relaxed max-w-xl">
                  Get real-time auction notifications, exclusive app-only deals, and track your orders seamlessly from your pocket.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <div className="hover:scale-105 transition-transform duration-300 opacity-50 grayscale cursor-not-allowed">
                    <img src="https://bidsnbuy.ng/wp-content/uploads/2024/01/shop28-app-1.png" alt="App Store" className="h-10 lg:h-12 w-auto" />
                  </div>
                  <div className="hover:scale-105 transition-transform duration-300 opacity-50 grayscale cursor-not-allowed">
                    <img src="https://bidsnbuy.ng/wp-content/uploads/2024/01/shop28-app-2.png" alt="Google Play" className="h-10 lg:h-12 w-auto" />
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-brand-blue/20 blur-[100px] rounded-full" />
                  <img 
                    src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800" 
                    alt="App Preview" 
                    className="relative z-10 w-full max-w-[300px] lg:max-w-[400px] rounded-[40px] shadow-2xl border-8 border-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-[1440px]">
          <div className="relative rounded-[40px] lg:rounded-[60px] overflow-hidden bg-brand-dark px-8 py-12 lg:py-16 text-center">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[140%] bg-brand-blue/20 rounded-full blur-[120px] animate-pulse" />
              <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[140%] bg-brand-orange/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]">
                Your Premium <span className="text-brand-blue italic">Shopping</span> & <span className="text-brand-orange">Auction</span> Hub
              </h2>
              <p className="text-lg lg:text-xl text-gray-400 mb-10 font-medium leading-relaxed">
                Whether you're looking for an adrenaline-filled auction or a direct luxury purchase, BidsnBuy offers the best of both worlds.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => navigate('/auctions')}
                  className="w-full sm:w-auto bg-brand-blue text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-white hover:text-brand-dark transition-all duration-300 shadow-xl shadow-brand-blue/20"
                >
                  Enter Auction Floor
                </button>
                <button 
                  onClick={() => navigate('/products')}
                  className="w-full sm:w-auto bg-white/5 backdrop-blur-md border border-white/10 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-white/10 transition-all duration-300"
                >
                  Browse Store
                </button>
              </div>
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
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1491933382434-500287f9b54b?auto=format&fit=crop&q=80&w=800";
                      }}
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

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={() => {
          setIsAuthModalOpen(false);
          window.location.reload(); // Refresh to update header user state
        }}
      />

      {/* --- STICKY NAV CTA (MOBILE) --- */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden w-full px-6 max-w-[320px] animate-fade-in">
        <button 
          onClick={() => navigate('/auctions')}
          className="w-full bg-brand-dark/95 backdrop-blur-xl text-white px-6 py-3.5 rounded-[20px] font-black shadow-[0_20px_50px_-12px_rgba(30,92,234,0.3)] flex items-center justify-between group active:scale-95 transition-all border border-white/10"
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-orange rounded-full animate-ping opacity-20" />
              <div className="relative w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center shadow-lg shadow-brand-orange/20">
                <Hammer className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[9px] font-black text-brand-orange uppercase tracking-[0.2em] mb-0.5">Live Now</span>
              <span className="text-xs font-black tracking-tight">Enter Auction Floor</span>
            </div>
          </div>
          <div className="bg-white/10 p-1.5 rounded-lg group-hover:bg-brand-blue transition-colors">
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default Home;
