import React from 'react';
import { Mail, MapPin, Phone, Truck, ShieldCheck, HelpCircle as FAQIcon, Search } from 'lucide-react';

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

export const TrackOrderPage: React.FC = () => (
  <div className="bg-white min-h-screen flex flex-col items-center justify-center py-20">
    <div className="container mx-auto px-4">
      <div className="max-w-xl mx-auto bg-white rounded-[40px] shadow-2xl shadow-brand-blue/5 border border-gray-100 p-12 text-center">
        <div className="w-20 h-20 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <Truck className="w-10 h-10 text-brand-blue" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Track Your Order</h1>
        <p className="text-gray-500 font-medium mb-10">Enter your order ID and the email address you used during checkout to track its status.</p>
        
        <form className="space-y-6 text-left">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 pl-2">Order ID</label>
            <input type="text" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-blue font-bold" placeholder="e.g. #12345" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 pl-2">Billing Email</label>
            <input type="email" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-blue font-bold" placeholder="email@example.com" />
          </div>
          <button className="w-full bg-brand-dark text-white py-5 rounded-2xl text-lg font-black uppercase tracking-widest hover:bg-brand-blue transition-all shadow-xl shadow-brand-dark/10">
            Track Now
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-center space-x-8">
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-6 h-6 text-green-500 mb-2" />
            <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">Secure Tracking</span>
          </div>
          <div className="flex flex-col items-center">
            <Truck className="w-6 h-6 text-brand-blue mb-2" />
            <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">Real-time Updates</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);