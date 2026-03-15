import React, { useState } from 'react';
import { Mail, MapPin, Phone, Truck, ShieldCheck, HelpCircle as FAQIcon, Search, Package, Calendar, CreditCard, AlertCircle, Loader2, ChevronRight, CheckCircle2 } from 'lucide-react';
import { wpService } from '../services/wp-api';
import type { WPOrder } from '../types/wordpress';

export const ContactPage: React.FC = () => (
  <div className="bg-white min-h-screen">
    <div className="bg-brand-blue py-20 text-center text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-brand-orange rounded-full blur-3xl" />
      </div>
      <h1 className="text-5xl font-black mb-4 relative z-10">Contact Us</h1>
      <p className="text-white/70 max-w-xl mx-auto font-medium relative z-10">
        Have questions about an auction or your order? We're here to help you 24/7.
      </p>
    </div>

    <div className="container mx-auto px-4 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 bg-white rounded-[40px] shadow-2xl shadow-brand-blue/5 border border-gray-100 p-8 sm:p-12">
          <h2 className="text-3xl font-black text-gray-900 mb-8">Send us a message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Full Name</label>
                <input type="text" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-blue" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Email Address</label>
                <input type="email" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-blue" placeholder="john@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">Subject</label>
              <input type="text" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-blue" placeholder="Auction Inquiry" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">Message</label>
              <textarea rows={5} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-blue" placeholder="How can we help?"></textarea>
            </div>
            <button className="w-full bg-brand-blue text-white py-5 rounded-2xl text-lg font-black uppercase tracking-widest hover:bg-brand-dark transition-all shadow-xl shadow-brand-blue/20">
              Send Message
            </button>
          </form>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-50 rounded-[30px] p-8">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 text-brand-blue">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Email Us</h3>
            <p className="text-gray-500 font-medium mb-4">Support is available via email 24/7.</p>
            <p className="text-brand-blue font-black">support@bidsnbuy.ng</p>
          </div>

          <div className="bg-gray-50 rounded-[30px] p-8">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 text-brand-orange">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Call Us</h3>
            <p className="text-gray-500 font-medium mb-4">Mon-Fri from 8am to 5pm.</p>
            <p className="text-brand-blue font-black">+234 800 BIDS N BUY</p>
          </div>

          <div className="bg-gray-50 rounded-[30px] p-8">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 text-gray-900">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Office</h3>
            <p className="text-gray-500 font-medium">Lagos, Nigeria</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const FAQPage: React.FC = () => (
  <div className="bg-white min-h-screen">
    <div className="bg-gray-50 py-20 border-b border-gray-100">
      <div className="container mx-auto px-4 text-center">
        <div className="inline-flex items-center space-x-2 text-brand-blue font-black text-sm tracking-widest uppercase mb-4">
          <FAQIcon className="w-5 h-5" />
          <span>Help Center</span>
        </div>
        <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-6">Frequently Asked <span className="text-gray-400">Questions</span></h1>
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input type="text" className="w-full bg-white border-2 border-gray-100 rounded-3xl py-5 pl-16 pr-8 text-sm font-bold focus:border-brand-blue focus:outline-none transition-all" placeholder="Search for answers..." />
        </div>
      </div>
    </div>

    <div className="container mx-auto px-4 py-20">
      <div className="max-w-3xl mx-auto space-y-6">
        {[
          { q: "How do I place a bid?", a: "To place a bid, you must first create an account and log in. Once logged in, navigate to the product page and enter your bid amount in the bidding section." },
          { q: "Is there a buyer protection policy?", a: "Yes! We ensure that all items are as described. If an item doesn't match the description or doesn't arrive, you are covered by our buyer protection program." },
          { q: "How long does shipping take?", a: "Shipping typically takes 3-5 business days within Nigeria, depending on your location and the item's origin." },
          { q: "Can I cancel a bid?", a: "No, once a bid is placed, it cannot be cancelled as it forms a binding agreement to purchase the item if you win." }
        ].map((item, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-xl hover:shadow-brand-blue/5 transition-all group">
            <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-brand-blue/10 text-brand-blue rounded-lg flex items-center justify-center mr-4 text-sm shrink-0">?</span>
              {item.q}
            </h3>
            <p className="text-gray-500 font-medium leading-relaxed pl-12">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const TrackOrderPage: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<WPOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !email) return;

    setError(null);
    setOrder(null);
    setIsLoading(true);

    try {
      const numericId = parseInt(orderId.replace('#', ''));
      if (isNaN(numericId)) {
        throw new Error('Invalid Order ID format.');
      }

      const fetchedOrder = await wpService.getOrderById(numericId);
      
      if (!fetchedOrder) {
        throw new Error('Order not found. Please check your ID.');
      }

      // WooCommerce API returns the order if ID is correct, 
      // but for security we should verify the email matches the billing email
      // Note: The /wc/v3/orders/:id endpoint requires authentication which we have via the JWT/Keys
      if (fetchedOrder.billing?.email?.toLowerCase() !== email.toLowerCase()) {
        throw new Error('Email address does not match this order.');
      }

      setOrder(fetchedOrder);
    } catch (err: unknown) {
      console.error('Tracking error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Could not find your order.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen py-20">
      <div className="container mx-auto px-4">
        {!order ? (
          <div className="max-w-xl mx-auto bg-white rounded-[40px] shadow-2xl shadow-brand-blue/5 border border-gray-100 p-8 sm:p-12 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-brand-blue/10 rounded-[30px] flex items-center justify-center mx-auto mb-8">
              <Truck className="w-10 h-10 text-brand-blue" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Track Your Order</h1>
            <p className="text-gray-500 font-medium mb-10">Enter your order details below to get real-time delivery updates.</p>
            
            <form onSubmit={handleTrack} className="space-y-6 text-left">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-2">Order ID</label>
                <div className="relative">
                  <Package className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                  <input 
                    type="text" 
                    required
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 pl-14 pr-6 focus:bg-white focus:border-brand-blue focus:outline-none transition-all font-bold text-gray-900" 
                    placeholder="e.g. #12345" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-2">Billing Email</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 pl-14 pr-6 focus:bg-white focus:border-brand-blue focus:outline-none transition-all font-bold text-gray-900" 
                    placeholder="email@example.com" 
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center space-x-3 text-xs font-bold animate-shake">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-brand-dark text-white py-5 rounded-2xl text-lg font-black uppercase tracking-widest hover:bg-brand-blue transition-all shadow-xl shadow-brand-dark/10 flex items-center justify-center space-x-3 disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span>Track Now</span>
                    <ChevronRight className="w-6 h-6" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-center space-x-8">
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-6 h-6 text-green-500 mb-2" />
                <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">Secure</span>
              </div>
              <div className="flex flex-col items-center">
                <Truck className="w-6 h-6 text-brand-blue mb-2" />
                <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">Real-time</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <button 
              onClick={() => setOrder(null)}
              className="flex items-center space-x-2 text-gray-400 hover:text-brand-blue transition-colors font-black uppercase text-[10px] tracking-widest"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              <span>Track another order</span>
            </button>

            {/* Order Header Card */}
            <div className="bg-white rounded-[40px] shadow-2xl shadow-brand-blue/5 border border-gray-100 p-8 sm:p-12 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-brand-blue rounded-3xl flex items-center justify-center shadow-xl shadow-brand-blue/20">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Order #{order.id}</h2>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{order.status}</span>
                      <span className="text-gray-400 font-bold text-xs">Placed on {new Date(order.date_created).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order Total</p>
                  <p className="text-3xl font-black text-brand-dark">₦{parseFloat(order.total).toLocaleString()}</p>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="mt-16 relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2" />
                <div className="absolute top-1/2 left-0 h-1 bg-brand-blue -translate-y-1/2 transition-all duration-1000" style={{ width: order.status === 'completed' ? '100%' : '50%' }} />
                
                <div className="relative flex justify-between">
                  {[
                    { label: 'Order Placed', icon: CheckCircle2, active: true },
                    { label: 'Processing', icon: Package, active: ['processing', 'completed', 'shipping'].includes(order.status) },
                    { label: 'Out for Delivery', icon: Truck, active: ['shipping', 'completed'].includes(order.status) },
                    { label: 'Delivered', icon: CheckCircle2, active: order.status === 'completed' }
                  ].map((step, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 relative z-10 ${step.active ? 'bg-brand-blue text-white scale-110' : 'bg-white text-gray-300 border-2 border-gray-100'}`}>
                        <step.icon className="w-5 h-5" />
                      </div>
                      <span className={`mt-4 text-[10px] font-black uppercase tracking-widest ${step.active ? 'text-brand-blue' : 'text-gray-400'}`}>{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-[32px] shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-6 flex items-center">
                  <Package className="w-5 h-5 mr-3 text-brand-blue" />
                  Items Ordered
                </h3>
                <div className="space-y-4">
                  {order.line_items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100">
                          <Package className="w-5 h-5 text-gray-300" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-400 font-bold">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-sm font-black text-brand-dark">₦{parseFloat(item.total).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-[32px] shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-6 flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-brand-orange" />
                  Delivery Details
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Shipping Address</p>
                    <div className="text-sm font-bold text-gray-700 leading-relaxed">
                      {order.shipping.first_name} {order.shipping.last_name}<br />
                      {order.shipping.address_1}, {order.shipping.city}<br />
                      {order.shipping.state}, {order.shipping.country}
                    </div>
                  </div>
                  <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Payment Method</p>
                      <div className="flex items-center text-sm font-black text-gray-900">
                        <CreditCard className="w-4 h-4 mr-2 text-brand-blue" />
                        {order.payment_method_title || 'Direct Transfer'}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Expected Delivery</p>
                      <div className="flex items-center text-sm font-black text-green-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        3-5 Days
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
