import React, { useState } from 'react';
import { Mail, Zap, Loader2 } from 'lucide-react';
import { wpService } from '../services/wp-api';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    try {
      setSubscribing(true);
      setError(null);
      await wpService.subscribeNewsletter(email);
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      console.error('Subscription error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-[1440px]">
        <div className="relative bg-brand-blue rounded-[60px] p-12 lg:p-24 overflow-hidden shadow-2xl shadow-brand-blue/20">
          {/* Background Accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full text-white text-[10px] font-black tracking-widest uppercase mb-6">
                <Mail className="w-4 h-4" />
                <span>Join the Insider List</span>
              </div>
              <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 tracking-tighter leading-tight">
                Get Exclusive Access to <br />
                <span className="text-brand-orange italic">Hidden Auctions.</span>
              </h2>
              <p className="text-white/70 text-lg font-medium max-w-lg">
                Subscribe to our newsletter and be the first to know about private bidding events and special flash deals.
              </p>
            </div>

            <div className="lg:w-2/5 w-full">
              {subscribed ? (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-[40px] text-center animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-brand-orange rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-orange/20">
                    <Zap className="w-10 h-10 text-white fill-current" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">You're on the list!</h3>
                  <p className="text-white/60 font-medium uppercase tracking-widest text-[10px]">Welcome to the BidsnBuy Inner Circle</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <form onSubmit={handleSubscribe} className="bg-white p-4 rounded-[40px] shadow-2xl flex flex-col sm:flex-row gap-4 group focus-within:ring-4 ring-brand-orange/20 transition-all duration-500">
                    <input 
                      type="email" 
                      placeholder="Enter your email address" 
                      className="flex-grow bg-transparent border-none px-6 py-4 text-gray-900 font-bold focus:ring-0 placeholder:text-gray-400"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button 
                      type="submit"
                      disabled={subscribing}
                      className="bg-brand-dark hover:bg-brand-blue text-white px-10 py-5 rounded-[30px] font-black uppercase tracking-widest text-xs transition-all shadow-xl disabled:opacity-50 flex items-center justify-center min-w-[180px]"
                    >
                      {subscribing ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        'Subscribe Now'
                      )}
                    </button>
                  </form>
                  {error && (
                    <p className="text-red-300 text-[10px] font-black uppercase tracking-widest text-center animate-in fade-in duration-300">
                      {error}
                    </p>
                  )}
                </div>
              )}
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest text-center mt-6">
                We respect your privacy. No spam, ever.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
