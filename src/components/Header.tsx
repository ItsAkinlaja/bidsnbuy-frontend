import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { wpService } from '../services/wp-api';
import type { AuthResponse } from '../services/auth';
import type { WPCategory } from '../types/wordpress';
import AuthModal from './AuthModal';
import { 
  ShoppingCart, 
  User, 
  Menu, 
  Search, 
  Hammer,
  ChevronDown, 
  Zap,
  Grid3X3,
  HelpCircle,
  History,
  X,
  LogOut,
  ChevronRight,
  Laptop,
  Shirt,
  Home as HomeIcon,
  Gamepad2,
  Baby,
  Dumbbell,
  Car,
  UtensilsCrossed,
  Heart,
  Smartphone
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

const menuItems = [
  { name: 'Home', path: '/' },
  { name: 'Auctions', path: '/auctions' },
  { name: 'Buy It Now', path: '/buy-it-now' },
  { name: 'Flash Deals', path: '/flash-deals' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact Us', path: '/contact' },
  { name: 'FAQs', path: '/faqs' },
  { name: 'Track Order', path: '/track-order' },
  { name: 'Recently Viewed', path: '/recently-viewed' },
];

const Header: React.FC = () => {
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<AuthResponse | null>(() => authService.getUser());
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [dynamicCategories, setDynamicCategories] = useState<WPCategory[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Fetch dynamic categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await wpService.getCategories();
        setDynamicCategories(data);
      } catch (err) {
        console.error('Header categories fetch failed:', err);
      }
    };
    fetchCats();
  }, []);

  // Handle scroll visibility
  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen || isCatOpen || isSearchOpen) return;
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMobileMenuOpen, isCatOpen, isSearchOpen]);

  // Close menus and reset state on route change
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsMobileMenuOpen(false);
      setIsCatOpen(false);
      setIsSearchOpen(false);
      setIsAuthModalOpen(false);
      setIsVisible(true);
      setUser(authService.getUser());
    });
    return () => cancelAnimationFrame(frame);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    window.location.reload();
  };

  return (
    <>
      <header className={`w-full z-50 bg-white fixed top-0 shadow-sm transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        {/* --- TOP HEADER (Logo & Main Actions) --- */}
        <div className="border-b border-gray-100">
          <div className="container mx-auto px-4 py-3 lg:py-5 flex items-center justify-between gap-4 lg:gap-8">
            
            {/* Logo */}
            <Link to="/" className="flex items-center group flex-shrink-0">
              <img 
                src="https://bidsnbuy.ng/wp-content/uploads/2024/01/cropped-Bidnbuylogo.jpg" 
                alt="BidsnBuy Logo" 
                className="h-16 lg:h-20 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Search Bar (Desktop) */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const query = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
                if (query) navigate(`/products?search=${encodeURIComponent(query)}`);
              }}
              className="hidden lg:flex flex-grow max-w-2xl relative group"
            >
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-blue transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <input 
                name="search"
                type="text" 
                placeholder="Search for auctions, products..." 
                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-3.5 pl-14 pr-6 text-sm font-medium focus:bg-white focus:border-brand-blue focus:outline-none transition-all"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-dark text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-brand-blue transition-colors">
                Search
              </button>
            </form>

            {/* Actions (Cart & Profile & Hamburger) */}
            <div className="flex items-center space-x-2 lg:space-x-6 flex-shrink-0">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-brand-blue"
              >
                <Search className="w-6 h-6" />
              </button>

              <button className="flex flex-col items-center group relative">
                <div className="p-2 text-gray-400 group-hover:text-brand-blue transition-colors">
                  <ShoppingCart className="w-6 h-6 lg:w-7 lg:h-7" />
                  <span className="absolute top-1 right-1 w-5 h-5 bg-brand-orange text-[10px] text-white flex items-center justify-center rounded-full font-bold border-2 border-white">0</span>
                </div>
                <span className="hidden lg:block text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-brand-blue">Cart</span>
              </button>
              
              <div className="hidden sm:block h-8 w-px bg-gray-100" />

              {user ? (
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-3 bg-gray-50 hover:bg-brand-blue/5 p-1.5 lg:p-2 lg:pr-4 rounded-xl lg:rounded-2xl transition-all group">
                    <div className="w-9 h-9 lg:w-10 lg:h-10 bg-brand-blue rounded-lg lg:rounded-xl flex items-center justify-center shadow-sm">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="hidden md:flex flex-col text-left">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Account</span>
                      <span className="text-xs font-black text-gray-900 group-hover:text-brand-blue line-clamp-1">{user.user_display_name}</span>
                    </div>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="hidden sm:block p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center space-x-3 bg-gray-50 hover:bg-brand-blue/5 p-1.5 lg:p-2 lg:pr-4 rounded-xl lg:rounded-2xl transition-all group"
                >
                  <div className="w-9 h-9 lg:w-10 lg:h-10 bg-white rounded-lg lg:rounded-xl flex items-center justify-center shadow-sm group-hover:bg-brand-blue transition-colors">
                    <User className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Welcome</span>
                    <span className="text-xs font-black text-gray-900 group-hover:text-brand-blue">Sign In</span>
                  </div>
                </button>
              )}

              {/* Hamburger (Mobile Only) */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="xl:hidden p-2 text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <Menu className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>

        {/* --- MOBILE SEARCH BAR (Toggleable) --- */}
        {isSearchOpen && (
          <div className="lg:hidden p-4 bg-white border-b border-gray-100 shadow-lg animate-slide-in-top">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                autoFocus
                placeholder="Search BidsnBuy..." 
                className="w-full bg-gray-50 border-2 border-brand-blue rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/products?search=${encodeURIComponent(e.currentTarget.value)}`);
                    setIsSearchOpen(false);
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* --- BOTTOM HEADER (Desktop Categories & Nav) --- */}
        <div className="hidden xl:block border-b border-gray-100 bg-white">
          <div className="container mx-auto px-4 flex items-center h-14">
            {/* Categories Trigger */}
            <div className="relative h-full">
              <button 
                onClick={() => setIsCatOpen(!isCatOpen)}
                className={`h-full flex items-center space-x-3 px-8 font-black text-xs uppercase tracking-[0.2em] transition-all ${isCatOpen ? 'bg-brand-orange text-white' : 'bg-brand-blue text-white hover:bg-brand-orange'}`}
              >
                <Menu className="w-4 h-4" />
                <span>All Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCatOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Category Dropdown Content */}
              {isCatOpen && (
                <div className="absolute top-full left-0 w-[1000px] bg-white shadow-2xl rounded-b-[40px] border-x border-b border-gray-100 p-10 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="grid grid-cols-4 gap-10">
                    {categoryHierarchy.map((item) => (
                      <div key={item.name} className="space-y-4">
                        <button 
                          onClick={() => {
                            if (item.path) {
                              navigate(item.path);
                            } else {
                              const wpCat = dynamicCategories.find(c => c.name.toLowerCase().includes(item.name.split(' & ')[0].toLowerCase()));
                              navigate(wpCat ? `/products?category=${wpCat.id}` : '/products');
                            }
                            setIsCatOpen(false);
                          }}
                          className="flex items-center space-x-3 group"
                        >
                          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-brand-blue transition-colors shadow-sm">
                            <item.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                          </div>
                          <span className="text-sm font-black text-gray-900 group-hover:text-brand-blue uppercase tracking-widest text-left">{item.name}</span>
                        </button>

                        <div className="space-y-2 pl-13">
                          {item.subcategories.map((sub) => (
                            <button 
                              key={sub.name}
                              onClick={() => {
                                const wpSub = dynamicCategories.find(c => c.name.toLowerCase() === sub.name.toLowerCase());
                                navigate(wpSub ? `/products?category=${wpSub.id}` : '/products');
                                setIsCatOpen(false);
                              }}
                              className="block text-xs font-bold text-gray-400 hover:text-brand-orange transition-colors text-left"
                            >
                              {sub.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <Zap className="w-4 h-4 text-brand-orange" />
                          <span>Daily Flash Deals</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <History className="w-4 h-4 text-brand-blue" />
                          <span>Recently Viewed</span>
                        </div>
                    </div>
                    <button 
                      onClick={() => {
                        navigate('/products');
                        setIsCatOpen(false);
                      }}
                      className="bg-brand-blue text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-dark transition-all"
                    >
                      Shop All Categories
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Menu */}
            <nav className="flex items-center flex-grow px-8 space-x-1">
              {menuItems.map((item, idx) => (
                <Link 
                  key={idx}
                  to={item.path}
                  className="px-4 py-2 text-[10px] font-black text-gray-500 hover:text-brand-blue uppercase tracking-[0.2em] transition-colors relative group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand-orange scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              ))}
            </nav>

            {/* Quick Info */}
            <div className="flex items-center space-x-6 text-gray-400 ml-auto">
               <div className="flex items-center space-x-2 border-r border-gray-100 pr-6 group cursor-pointer hover:text-brand-blue transition-colors">
                  <HelpCircle className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Support</span>
               </div>
               <div className="flex items-center space-x-2 group cursor-pointer hover:text-brand-blue transition-colors">
                  <History className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Recent</span>
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- MOBILE/TABLET SIDE MENU --- */}
      {isMobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-[110] flex justify-end">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Content */}
          <div className="relative w-full max-w-[320px] bg-white h-full flex flex-col shadow-2xl animate-slide-in-right">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-brand-dark text-white">
              <div className="flex items-center space-x-3">
                <img 
                  src="https://bidsnbuy.ng/wp-content/uploads/2024/01/cropped-Bidnbuylogo.jpg" 
                  alt="Logo" 
                  className="h-8 w-auto brightness-0 invert"
                />
                <span className="text-lg font-black tracking-tighter uppercase">Menu</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar">
              {/* User Section */}
              <div className="p-6 bg-gray-50 border-b border-gray-100 mb-2 space-y-4">
                {user ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-brand-blue rounded-2xl flex items-center justify-center shadow-sm">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="max-w-[140px]">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account</p>
                        <p className="text-base font-black text-gray-900 truncate">{user.user_display_name}</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-4 text-left group"
                  >
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-brand-blue transition-colors border border-gray-100">
                      <User className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Welcome</p>
                      <p className="text-base font-black text-gray-900 group-hover:text-brand-blue transition-colors">Sign In / Register</p>
                    </div>
                  </button>
                )}

                {user ? (
                  <button 
                    onClick={() => {
                      navigate('/dashboard');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-brand-blue text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-blue/20 flex items-center justify-center space-x-2"
                  >
                    <Grid3X3 className="w-4 h-4" />
                    <span>My Dashboard</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-brand-orange text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-orange/20 flex items-center justify-center space-x-2"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Join Now</span>
                  </button>
                )}
              </div>

              {/* Quick Links Grid */}
              <div className="grid grid-cols-2 gap-2 p-4">
                 <button onClick={() => { navigate('/auctions'); setIsMobileMenuOpen(false); }} className="flex flex-col items-center justify-center p-4 bg-brand-blue/5 rounded-2xl border border-brand-blue/10 group active:scale-95 transition-all">
                    <Hammer className="w-6 h-6 text-brand-blue mb-2" />
                    <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest">Auctions</span>
                 </button>
                 <button onClick={() => { navigate('/flash-deals'); setIsMobileMenuOpen(false); }} className="flex flex-col items-center justify-center p-4 bg-brand-orange/5 rounded-2xl border border-brand-orange/10 group active:scale-95 transition-all">
                    <Zap className="w-6 h-6 text-brand-orange mb-2" />
                    <span className="text-[10px] font-black text-brand-orange uppercase tracking-widest">Deals</span>
                 </button>
              </div>

              {/* Navigation Links */}
              <div className="px-4 py-4">
                <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Main Exploration</p>
                <div className="space-y-1">
                  {menuItems.slice(0, 5).map((item, idx) => (
                    <Link 
                      key={idx} 
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-3.5 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-xl transition-all"
                    >
                      <span>{item.name}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories Section */}
              <div className="px-4 pb-12">
                <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Categories</p>
                <div className="flex flex-col space-y-1">
                  {categoryHierarchy.map((item) => (
                    <div key={item.name} className="flex flex-col">
                      <button 
                        onClick={() => setHoveredCategory(hoveredCategory === item.name ? null : item.name)}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all group ${hoveredCategory === item.name ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg transition-colors ${hoveredCategory === item.name ? 'bg-brand-blue text-white' : 'bg-white border border-gray-100 text-gray-400 group-hover:text-brand-blue'}`}>
                            <item.icon className="w-5 h-5" />
                          </div>
                          <span className={`text-sm font-bold ${hoveredCategory === item.name ? 'text-brand-blue' : 'text-gray-600'}`}>{item.name}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-gray-300 transition-transform ${hoveredCategory === item.name ? 'rotate-90' : ''}`} />
                      </button>
                      
                      {hoveredCategory === item.name && (
                        <div className="pl-16 pr-4 py-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                          {item.subcategories.map((sub) => (
                            <button 
                              key={sub.name}
                              onClick={() => {
                                const wpSub = dynamicCategories.find(c => c.name.toLowerCase() === sub.name.toLowerCase());
                                navigate(wpSub ? `/products?category=${wpSub.id}` : '/products');
                                setIsMobileMenuOpen(false);
                              }}
                              className="block w-full text-left py-2.5 text-xs font-bold text-gray-400 hover:text-brand-orange transition-colors"
                            >
                              {sub.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 mt-auto">
               <div className="flex items-center justify-between text-gray-400">
                  <div className="flex items-center space-x-2 group cursor-pointer hover:text-brand-blue transition-colors">
                    <HelpCircle className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Support Center</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">v1.2.4</span>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal - MOVED OUTSIDE <header> to avoid translate-y animation issues */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};

export default Header;
