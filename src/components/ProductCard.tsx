import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Hammer, Clock, Users, Flame, ChevronRight } from 'lucide-react';
import type { WPProduct } from '../types/wordpress';

interface ProductCardProps {
  product: WPProduct;
  isAuction?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isAuction }) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: string;
    mins: string;
    secs: string;
    isEnded: boolean;
    isEndingSoon: boolean;
  }>({
    hours: '00',
    mins: '00',
    secs: '00',
    isEnded: false,
    isEndingSoon: false
  });

  useEffect(() => {
    if ((isAuction || product.is_auction)) {
      const updateTimer = () => {
        if (!product.auction_end_time) {
          setTimeLeft({
            hours: '00',
            mins: '00',
            secs: '00',
            isEnded: true,
            isEndingSoon: false
          });
          return true;
        }

        let end;
        // Check if auction_end_time is a timestamp (numeric string) or a date string
        if (/^\d+$/.test(product.auction_end_time!)) {
          end = parseInt(product.auction_end_time!) * 1000; // Convert seconds to ms
        } else {
          end = new Date(product.auction_end_time!).getTime();
        }
        
        const now = new Date().getTime();
        const diff = end - now;

        if (isNaN(end) || diff <= 0) {
          setTimeLeft({
            hours: '00',
            mins: '00',
            secs: '00',
            isEnded: true,
            isEndingSoon: false
          });
          return true; // Stop timer
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((diff % (1000 * 60)) / 1000);
          
          setTimeLeft({
            hours: hours.toString().padStart(2, '0'),
            mins: mins.toString().padStart(2, '0'),
            secs: secs.toString().padStart(2, '0'),
            isEnded: false,
            isEndingSoon: diff < (1000 * 60 * 30) // Less than 30 mins
          });
          return false; // Continue timer
        }
      };

      // Wrap the initial state setting in requestAnimationFrame to avoid synchronous setState warning
      const frameId = requestAnimationFrame(() => {
        updateTimer();
      });

      const timer = setInterval(() => {
        const isEnded = updateTimer();
        if (isEnded) clearInterval(timer);
      }, 1000);

      return () => {
        cancelAnimationFrame(frameId);
        clearInterval(timer);
      };
    }
  }, [isAuction, product.is_auction, product.auction_end_time]);

  const imageUrl = product.images?.[0]?.src || 'https://via.placeholder.com/300x300?text=No+Image';

  const currentBidFormatted = useMemo(() => {
    return parseFloat(product.current_bid || product.price || '0').toLocaleString();
  }, [product.current_bid, product.price]);

  return (
    <div className={`group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full relative ${timeLeft.isEndingSoon && !timeLeft.isEnded ? 'ring-2 ring-brand-orange ring-offset-4' : ''}`}>
      {/* Hot/Ending Soon Badge */}
      {isAuction && timeLeft.isEndingSoon && !timeLeft.isEnded && (
        <div className="absolute top-4 right-4 z-20 bg-brand-orange text-white px-3 py-1 rounded-full text-[10px] font-black flex items-center animate-bounce shadow-lg">
          <Flame className="w-3 h-3 mr-1" />
          ENDING SOON
        </div>
      )}

      {/* Image Container */}
      <Link to={`/product/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-gray-50 block">
        <img 
          src={imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        
        {/* Overlay Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isAuction && (
            <div className="bg-brand-blue/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black flex items-center shadow-lg tracking-widest uppercase">
              <Hammer className="w-3 h-3 mr-2" />
              Live Auction
            </div>
          )}
          {product.on_sale && !isAuction && (
            <div className="bg-brand-orange/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black shadow-lg tracking-widest uppercase">
              Special Offer
            </div>
          )}
        </div>

        {/* Auction Progress/Bid Count */}
        {isAuction && (
          <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl flex items-center justify-between text-white shadow-xl">
             <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-brand-orange" />
                <span className="text-xs font-black">{product.bid_count || 0} Bidders</span>
             </div>
             <div className="h-1.5 w-24 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-brand-orange w-2/3" /> {/* Mock progress */}
             </div>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {product.categories?.slice(0, 1).map(cat => (
              <span key={cat.id} className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">
                {cat.name}
              </span>
            ))}
          </div>
          {isAuction && !timeLeft.isEnded && (
            <div className="flex items-center text-brand-orange animate-pulse">
               <div className="w-1.5 h-1.5 rounded-full bg-brand-orange mr-2" />
               <span className="text-[10px] font-black uppercase tracking-tighter">Active Now</span>
            </div>
          )}
        </div>
        
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-xl font-black text-brand-dark mb-4 line-clamp-2 leading-tight group-hover:text-brand-blue transition-colors">
            {product.name}
          </h3>
        </Link>

        {isAuction || product.is_auction ? (
          <div className="mt-auto space-y-4">
            {/* Auction Info Grid */}
            <div className="grid grid-cols-2 gap-3">
               <div className="bg-brand-blue/5 p-4 rounded-2xl border border-brand-blue/10">
                  <p className="text-[10px] text-brand-blue font-black uppercase tracking-widest mb-1">Current Bid</p>
                  <p className="text-2xl font-black text-brand-blue tracking-tighter">₦{currentBidFormatted}</p>
               </div>
               <div className={`p-4 rounded-2xl border transition-colors ${timeLeft.isEndingSoon ? 'bg-brand-orange/5 border-brand-orange/10' : 'bg-gray-50 border-gray-100'}`}>
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-1 flex items-center ${timeLeft.isEndingSoon ? 'text-brand-orange' : 'text-gray-400'}`}>
                    <Clock className="w-3 h-3 mr-1" /> {timeLeft.isEnded ? 'Auction Ended' : 'Ends In'}
                  </p>
                  <div className={`text-lg font-black tracking-tight tabular-nums ${timeLeft.isEndingSoon ? 'text-brand-orange' : 'text-gray-900'}`}>
                    {timeLeft.isEnded ? '00:00:00' : `${timeLeft.hours}:${timeLeft.mins}:${timeLeft.secs}`}
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link 
                to={`/product/${product.slug}`}
                className={`w-full font-black py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 shadow-lg active:scale-95 transform uppercase tracking-widest text-[9px] ${
                  timeLeft.isEnded 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-brand-dark hover:bg-brand-blue text-white'
                }`}
              >
                <Hammer className="w-3.5 h-3.5" />
                <span>{timeLeft.isEnded ? 'Closed' : 'Bid Now'}</span>
              </Link>
              <Link 
                to={`/product/${product.slug}`}
                className="w-full bg-gray-50 hover:bg-gray-100 text-brand-dark font-black py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 uppercase tracking-widest text-[9px] border border-gray-100"
              >
                <span>Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
            <div className="flex flex-col">
              {product.regular_price && product.regular_price !== product.price && (
                <span className="text-xs text-gray-400 line-through font-bold">₦{parseFloat(product.regular_price).toLocaleString()}</span>
              )}
              <span className="text-2xl font-black text-brand-dark tracking-tighter">₦{parseFloat(product.price || '0').toLocaleString()}</span>
            </div>
            <Link 
              to={`/product/${product.slug}`}
              className="bg-brand-blue/10 hover:bg-brand-blue text-brand-blue hover:text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300"
            >
              Buy Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
