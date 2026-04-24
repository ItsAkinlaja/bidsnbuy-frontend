import React, { useState } from 'react';
import { Zap, Loader2 } from 'lucide-react';
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
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 max-w-[1440px]">
        <div className="relative bg-brand-dark rounded-[40px] p-12 lg:p-24 overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <p className="text-brand-orange font-black text-xs uppercase tracking-[0.3em] mb-4">Insider Access</p>
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
                Get Exclusive Access to <br />
                <span className="text-brand-orange">Hidden Auctions.</span>
              </h2>
              <p className="text-white/50 text-base font-normal max-w-lg leading-relaxed">
                Subscribe and be the first to know about private bidding events and special flash deals.
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
                  <form onSubmit={handleSubscribe} className="bg-white/5 border border-white/10 p-3 rounded-2xl flex flex-col sm:flex-row gap-3 focus-within:border-white/20 transition-all duration-300">
                    <input 
                      type="email" 
                      placeholder="Enter your email address" 
                      className="flex-grow bg-transparent border-none px-4 py-3 text-white font-medium focus:ring-0 placeholder:text-white/30 text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button 
                      type="submit"
                      disabled={subscribing}
                      className="bg-brand-orange hover:bg-brand-blue text-white px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-xs transition-all disabled:opacity-50 flex items-center justify-center min-w-[160px]"
                    >
                      {subscribing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Subscribe'
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
              <p className="text-white/20 text-xs font-normal text-center mt-4">
                No spam, ever. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
