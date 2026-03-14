import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import { decodeHtml } from '../utils/decode';

const Breadcrumbs: React.FC = () => {
  const { customTitle, setCustomTitle } = useBreadcrumb();
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Clear custom title on route change to prevent leakage
  React.useEffect(() => {
    setCustomTitle('');
  }, [location.pathname, setCustomTitle]);

  // Don't show breadcrumbs on homepage
  if (location.pathname === '/') return null;

  const getLabel = (path: string) => {
    // Mapping common slugs to readable labels
    const mapping: { [key: string]: string } = {
      'auctions': 'Live Auctions',
      'products': 'Shop All',
      'buy-it-now': 'Buy It Now',
      'flash-deals': 'Flash Deals',
      'deals': 'Mega Deals',
      'blog': 'Insider Blog',
      'contact': 'Contact Us',
      'faqs': 'Help Center',
      'track-order': 'Track Order',
      'recently-viewed': 'Recently Viewed',
      'recent': 'Recent Items',
      'page': 'Information',
      'product': 'Product Detail'
    };

    return mapping[path] || path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
  };

  return (
    <div className="w-full bg-white border-b border-gray-100/80">
      <div className="container mx-auto px-4 max-w-[1440px]">
        <nav className="flex items-center h-12 sm:h-14 overflow-hidden">
          <ol className="flex items-center space-x-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400 overflow-x-auto whitespace-nowrap scrollbar-hide no-scrollbar py-2">
            <li className="flex items-center flex-shrink-0">
              <Link 
                to="/" 
                className="flex items-center hover:text-brand-blue transition-all duration-300 group"
              >
                <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-brand-blue/5 transition-colors mr-2">
                  <Home className="w-3.5 h-3.5 group-hover:text-brand-blue" />
                </div>
                <span className="group-hover:text-brand-blue">Home</span>
              </Link>
            </li>

            {pathnames.map((value, index) => {
              const last = index === pathnames.length - 1;
              const to = `/${pathnames.slice(0, index + 1).join('/')}`;
              const label = (last && customTitle) ? customTitle : getLabel(value);

              return (
                <li key={to} className="flex items-center flex-shrink-0">
                  <ChevronRight className="w-3.5 h-3.5 mx-3 text-gray-300 shrink-0" />
                  {last ? (
                    <span className="text-brand-dark font-black truncate max-w-[150px] sm:max-w-xs bg-brand-blue/5 px-3 py-1.5 rounded-lg border border-brand-blue/10">
                      {decodeHtml(label)}
                    </span>
                  ) : (
                    <Link 
                      to={to} 
                      className="hover:text-brand-blue transition-colors"
                    >
                      {decodeHtml(label)}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumbs;
