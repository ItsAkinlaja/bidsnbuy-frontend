import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { wpService } from '../services/wp-api';
import { authService } from '../services/auth';
import type { WPCustomer, WPOrder } from '../types/wordpress';
import LoadingBar from '../components/LoadingBar';
import SEO from '../components/SEO';
import { 
  User, 
  Package, 
  Settings, 
  LogOut, 
  ChevronRight, 
  ShoppingBag, 
  Hammer, 
  Clock, 
  MapPin, 
  CreditCard, 
  Bell,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Star,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'auctions' | 'profile'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [customer, setCustomer] = useState<WPCustomer | null>(null);
  const [orders, setOrders] = useState<WPOrder[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = authService.getUser();
    if (!user) {
      navigate('/');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const customerData = await wpService.getCustomer();
        if (customerData) {
          setCustomer(customerData);
          const orderData = await wpService.getCustomerOrders(customerData.id);
          setOrders(orderData);
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleTabChange = (tab: 'overview' | 'orders' | 'auctions' | 'profile') => {
    setActiveTab(tab);
    // Auto-scroll to content section on mobile
    if (window.innerWidth < 1024 && contentRef.current) {
      const yOffset = -100; // Adjust for sticky header
      const y = contentRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
    window.location.reload();
  };

  // Calculate real stats from orders
  const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingBar isLoading={true} />
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin" />
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Loading Dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <SEO title="User Dashboard | BidsnBuy" />
      
      {/* Header Profile Section */}
      <div className="bg-brand-dark text-white pt-12 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-brand-orange/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white/10 backdrop-blur-md rounded-[40px] flex items-center justify-center border-2 border-white/20 shadow-2xl overflow-hidden">
                {customer?.avatar_url ? (
                  <img src={customer.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 md:w-16 md:h-16 text-white" />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-2xl border-4 border-brand-dark flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div className="text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter">
                  Welcome, {customer?.first_name || authService.getUser()?.user_display_name}!
                </h1>
                <span className="bg-brand-orange px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mx-auto md:mx-0">Premium Member</span>
              </div>
              <p className="text-white/60 font-medium text-sm md:text-base max-w-xl">
                Manage your bids, track your orders, and update your premium profile all in one place.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/10">
                  <Star className="w-4 h-4 text-brand-orange fill-brand-orange" />
                  <span className="text-xs font-bold">{String(customer?.meta_data?.find(m => m.key === '_points_balance')?.value || 0)} Points</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/10">
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-bold">Verified Account</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <aside className="lg:w-1/4">
            <div className="bg-white rounded-[32px] shadow-xl shadow-gray-200/50 border border-gray-100 p-4 space-y-2">
              <button 
                onClick={() => handleTabChange('overview')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${activeTab === 'overview' ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30' : 'hover:bg-gray-50 text-gray-500'}`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-xl ${activeTab === 'overview' ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-brand-blue/10'}`}>
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest">Overview</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'overview' ? 'translate-x-1' : ''}`} />
              </button>

              <button 
                onClick={() => handleTabChange('orders')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${activeTab === 'orders' ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30' : 'hover:bg-gray-50 text-gray-500'}`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-xl ${activeTab === 'orders' ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-brand-blue/10'}`}>
                    <Package className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest">My Orders</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'orders' ? 'translate-x-1' : ''}`} />
              </button>

              <button 
                onClick={() => handleTabChange('auctions')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${activeTab === 'auctions' ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30' : 'hover:bg-gray-50 text-gray-500'}`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-xl ${activeTab === 'auctions' ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-brand-blue/10'}`}>
                    <Hammer className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest">Active Bids</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'auctions' ? 'translate-x-1' : ''}`} />
              </button>

              <button 
                onClick={() => handleTabChange('profile')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${activeTab === 'profile' ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30' : 'hover:bg-gray-50 text-gray-500'}`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-xl ${activeTab === 'profile' ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-brand-blue/10'}`}>
                    <Settings className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest">Profile</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'profile' ? 'translate-x-1' : ''}`} />
              </button>

              <div className="pt-4 mt-4 border-t border-gray-100">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-4 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all group"
                >
                  <div className="p-2 bg-red-100 rounded-xl group-hover:bg-red-200 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest">Sign Out</span>
                </button>
              </div>
            </div>

            {/* Support Card */}
            <div className="mt-8 bg-brand-orange/10 border border-brand-orange/20 rounded-[32px] p-6 relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand-orange/10 rounded-full blur-2xl transition-transform group-hover:scale-150 duration-700" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-brand-orange text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-brand-orange/20">
                  <Bell className="w-6 h-6 animate-swing" />
                </div>
                <h4 className="text-brand-dark font-black text-sm uppercase tracking-widest mb-2">Need Help?</h4>
                <p className="text-gray-500 text-xs font-medium leading-relaxed mb-4">
                  Our 24/7 premium support team is here for you.
                </p>
                <button className="text-brand-orange font-black text-[10px] uppercase tracking-widest flex items-center space-x-2 group">
                  <span>Contact Support</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </aside>

          {/* Tab Content */}
          <main className="lg:w-3/4 space-y-8" ref={contentRef}>
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-gray-200/50 border border-gray-50 flex items-center space-x-6 group hover:border-brand-blue transition-all">
                    <div className="w-14 h-14 bg-brand-blue/5 rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-gray-900">{orders.length}</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Orders</p>
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-gray-200/50 border border-gray-50 flex items-center space-x-6 group hover:border-brand-orange transition-all">
                    <div className="w-14 h-14 bg-brand-orange/5 rounded-2xl flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all">
                      <Hammer className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-gray-900">{String(customer?.meta_data?.find(m => m.key === '_active_bids_count')?.value || 0)}</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Bids</p>
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-gray-200/50 border border-gray-50 flex items-center space-x-6 group hover:border-green-500 transition-all">
                    <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 group-hover:bg-green-500 group-hover:text-white transition-all">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-gray-900">₦{totalSpent.toLocaleString()}</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Spent</p>
                    </div>
                  </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white rounded-[32px] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                  <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Recent Activity</h3>
                    <button 
                      onClick={() => setActiveTab('orders')}
                      className="text-[10px] font-black text-brand-blue uppercase tracking-widest hover:text-brand-orange transition-colors"
                    >
                      View All
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    {orders.length > 0 ? (
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50/50">
                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {orders.slice(0, 5).map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                              <td className="px-8 py-6">
                                <span className="text-sm font-black text-gray-900">#{order.id}</span>
                              </td>
                              <td className="px-8 py-6">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                  order.status === 'completed' ? 'bg-green-100 text-green-600' : 
                                  order.status === 'processing' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-8 py-6">
                                <span className="text-sm font-black text-gray-900">₦{parseFloat(order.total).toLocaleString()}</span>
                              </td>
                              <td className="px-8 py-6">
                                <span className="text-xs font-bold text-gray-400">{new Date(order.date_created).toLocaleDateString()}</span>
                              </td>
                              <td className="px-8 py-6">
                                <button className="text-[10px] font-black text-brand-blue uppercase tracking-widest hover:text-brand-orange transition-all flex items-center space-x-1 group-hover:translate-x-1">
                                  <span>Details</span>
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="p-12 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-[30px] flex items-center justify-center mx-auto mb-6">
                          <Package className="w-10 h-10 text-gray-200" />
                        </div>
                        <p className="text-gray-400 font-bold text-sm mb-4">No orders found yet.</p>
                        <button 
                          onClick={() => navigate('/products')}
                          className="bg-brand-blue text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-brand-blue/20"
                        >
                          Start Shopping
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-brand-blue to-brand-dark p-8 rounded-[40px] text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20 shadow-xl">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <h4 className="text-xl font-black tracking-tight mb-2">Shipping Addresses</h4>
                      <p className="text-white/60 text-xs font-medium mb-6">Manage your primary and secondary delivery addresses.</p>
                      <button className="bg-white text-brand-dark px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 hover:bg-brand-orange hover:text-white transition-all">
                        <span>Manage Addresses</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-50 relative overflow-hidden group hover:border-brand-orange transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-brand-orange/10 rounded-2xl flex items-center justify-center mb-6 border border-brand-orange/20 shadow-xl text-brand-orange">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <h4 className="text-xl font-black tracking-tight text-gray-900 mb-2">Payment Methods</h4>
                      <p className="text-gray-400 text-xs font-medium mb-6">Securely manage your saved cards and payment preferences.</p>
                      <button className="bg-brand-dark text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 hover:bg-brand-blue transition-all">
                        <span>Manage Payments</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
               <div className="bg-white rounded-[32px] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="p-8 border-b border-gray-50">
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Order History</h3>
                    <p className="text-gray-400 text-xs font-medium mt-1">Showing all your past and current orders.</p>
                  </div>
                  <div className="p-8">
                     {orders.length > 0 ? (
                        <div className="space-y-4">
                           {orders.map((order) => (
                             <div key={order.id} className="p-6 border border-gray-100 rounded-3xl hover:border-brand-blue transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center space-x-6">
                                   <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:bg-brand-blue/5 group-hover:border-brand-blue/20 transition-all">
                                      <Package className="w-8 h-8 text-gray-300 group-hover:text-brand-blue transition-colors" />
                                   </div>
                                   <div>
                                      <div className="flex items-center space-x-3 mb-1">
                                         <h4 className="text-base font-black text-gray-900">Order #{order.id}</h4>
                                         <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter ${
                                            order.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-brand-blue/10 text-brand-blue'
                                         }`}>{order.status}</span>
                                      </div>
                                      <p className="text-xs text-gray-400 font-bold mb-2">Placed on {new Date(order.date_created).toLocaleDateString()}</p>
                                      <div className="flex flex-wrap gap-2">
                                         {order.line_items.map((item, idx) => (
                                            <span key={idx} className="bg-gray-50 text-[10px] font-black text-gray-500 px-2 py-1 rounded-lg border border-gray-100">{item.name} x {item.quantity}</span>
                                         ))}
                                      </div>
                                   </div>
                                </div>
                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                                   <div className="text-right">
                                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</p>
                                      <p className="text-xl font-black text-brand-dark">₦{parseFloat(order.total).toLocaleString()}</p>
                                   </div>
                                   <button className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-blue transition-all">Track Order</button>
                                </div>
                             </div>
                           ))}
                        </div>
                     ) : (
                        <div className="p-12 text-center">
                          <div className="w-20 h-20 bg-gray-50 rounded-[30px] flex items-center justify-center mx-auto mb-6">
                            <Package className="w-10 h-10 text-gray-200" />
                          </div>
                          <p className="text-gray-400 font-bold text-sm mb-4">No orders found yet.</p>
                          <button 
                            onClick={() => navigate('/products')}
                            className="bg-brand-blue text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em]"
                          >
                            Start Shopping
                          </button>
                        </div>
                     )}
                  </div>
               </div>
            )}

            {activeTab === 'auctions' && (
               <div className="bg-white rounded-[32px] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="p-8 border-b border-gray-50">
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Active Bids</h3>
                    <p className="text-gray-400 text-xs font-medium mt-1">Track your current bids and auction statuses.</p>
                  </div>
                  <div className="p-12 text-center">
                    <div className="w-20 h-20 bg-brand-orange/10 rounded-[30px] flex items-center justify-center mx-auto mb-6">
                      <Hammer className="w-10 h-10 text-brand-orange" />
                    </div>
                    <p className="text-gray-400 font-bold text-sm mb-4">You have no active bids at the moment.</p>
                    <button 
                      onClick={() => navigate('/auctions')}
                      className="bg-brand-orange text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-brand-orange/20"
                    >
                      Explore Auctions
                    </button>
                  </div>
               </div>
            )}

            {activeTab === 'profile' && (
               <div className="bg-white rounded-[32px] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="p-8 border-b border-gray-50">
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Profile Settings</h3>
                    <p className="text-gray-400 text-xs font-medium mt-1">Manage your account information and preferences.</p>
                  </div>
                  <div className="p-8 space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">First Name</label>
                           <input 
                              type="text" 
                              defaultValue={customer?.first_name}
                              className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-brand-blue focus:outline-none transition-all" 
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Last Name</label>
                           <input 
                              type="text" 
                              defaultValue={customer?.last_name}
                              className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-brand-blue focus:outline-none transition-all" 
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Email Address</label>
                           <input 
                              type="email" 
                              disabled
                              defaultValue={customer?.email}
                              className="w-full bg-gray-100 border-2 border-transparent rounded-2xl py-4 px-6 text-sm font-bold text-gray-400 cursor-not-allowed" 
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Phone Number</label>
                           <input 
                              type="tel" 
                              defaultValue={customer?.billing?.phone}
                              className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-brand-blue focus:outline-none transition-all" 
                           />
                        </div>
                     </div>

                     <div className="pt-8 border-t border-gray-50">
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-6">Security Settings</h4>
                        <div className="space-y-4">
                           <button className="flex items-center justify-between w-full p-6 bg-gray-50 rounded-3xl hover:bg-gray-100 transition-all group">
                              <div className="flex items-center space-x-4">
                                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                    <Clock className="w-5 h-5 text-gray-400" />
                                 </div>
                                 <div className="text-left">
                                    <p className="text-xs font-black text-gray-900">Change Password</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Last changed 3 months ago</p>
                                 </div>
                              </div>
                              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:translate-x-1 transition-transform" />
                           </button>
                           <button className="flex items-center justify-between w-full p-6 bg-gray-50 rounded-3xl hover:bg-gray-100 transition-all group">
                              <div className="flex items-center space-x-4">
                                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                    <ShieldCheck className="w-5 h-5 text-green-500" />
                                 </div>
                                 <div className="text-left">
                                    <p className="text-xs font-black text-gray-900">Two-Factor Authentication</p>
                                    <p className="text-[10px] text-green-500 font-bold uppercase tracking-tighter">Active and Secure</p>
                                 </div>
                              </div>
                              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:translate-x-1 transition-transform" />
                           </button>
                        </div>
                     </div>

                     <div className="pt-8 flex justify-end">
                        <button className="bg-brand-blue text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-brand-blue/30 hover:bg-brand-dark transition-all active:scale-95">
                           Save Changes
                        </button>
                     </div>
                  </div>
               </div>
            )}
          </main>
        </div>
      </div>

      {error && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-4 animate-in slide-in-from-bottom-8 duration-500 z-[100]">
          <AlertCircle className="w-6 h-6" />
          <span className="text-sm font-black uppercase tracking-widest">{error}</span>
          <button onClick={() => setError(null)} className="p-1 hover:bg-white/20 rounded-lg">
            <LogOut className="w-4 h-4 rotate-90" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;