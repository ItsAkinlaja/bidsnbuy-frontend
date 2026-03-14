import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { wpService } from '../services/wp-api';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import type { WPPost } from '../types/wordpress';
import { Loader2, ShieldCheck, Info, HelpCircle } from 'lucide-react';

const CMSPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { setCustomTitle } = useBreadcrumb();
  const [page, setPage] = useState<WPPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await wpService.getPageBySlug(slug);
        if (data) {
          setPage(data);
          setCustomTitle(data.title.rendered);
        } else {
          setError('Page not found.');
        }
      } catch (err) {
        console.error('Error fetching page:', err);
        setError('Failed to load page content.');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
    window.scrollTo(0, 0);
  }, [slug, setCustomTitle]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-brand-blue mb-4" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Fetching Platform Data...</p>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h2 className="text-4xl font-black text-gray-900 mb-6">{error || 'Page Not Found'}</h2>
        <p className="text-gray-500 mb-10 max-w-md mx-auto">The page you are looking for might have been moved or deleted from our CMS.</p>
        <Link to="/" className="inline-flex bg-brand-blue text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-dark transition-all shadow-xl shadow-brand-blue/20">
          Return Home
        </Link>
      </div>
    );
  }

  // Icon based on slug
  const getPageIcon = () => {
    if (slug?.includes('about')) return <Info className="w-8 h-8 text-brand-blue" />;
    if (slug?.includes('privacy') || slug?.includes('terms')) return <ShieldCheck className="w-8 h-8 text-brand-blue" />;
    if (slug?.includes('help') || slug?.includes('faq')) return <HelpCircle className="w-8 h-8 text-brand-blue" />;
    return <Info className="w-8 h-8 text-brand-blue" />;
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Dynamic Page Header */}
      <div className="bg-gray-50 border-b border-gray-100 py-24">
        <div className="container mx-auto px-4 text-center max-w-[1000px]">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-xl shadow-gray-200/50">
            {getPageIcon()}
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tighter mb-6 leading-tight" dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
          <div className="flex items-center justify-center space-x-2 text-brand-blue font-black text-[10px] uppercase tracking-[0.3em]">
            <div className="w-8 h-px bg-brand-blue" />
            <span>Official BidsnBuy Documentation</span>
            <div className="w-8 h-px bg-brand-blue" />
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-[900px] mx-auto">
          <div 
            className="prose prose-xl prose-blue max-w-none 
              prose-headings:font-black prose-headings:text-gray-900 prose-headings:tracking-tight
              prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-10
              prose-img:rounded-[40px] prose-img:shadow-2xl prose-img:my-16
              prose-a:text-brand-blue prose-a:font-black prose-a:no-underline hover:prose-a:underline
              prose-ul:list-disc prose-ul:pl-6 prose-li:text-gray-600 prose-li:mb-4
              prose-strong:text-gray-900 prose-strong:font-black"
            dangerouslySetInnerHTML={{ __html: page.content.rendered }}
          />
          
          <div className="mt-32 p-12 bg-brand-blue rounded-[50px] text-center text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <h3 className="text-3xl font-black mb-4 relative z-10">Need more assistance?</h3>
             <p className="text-white/70 mb-10 relative z-10 font-medium">Our support team is available 24/7 to help you with any questions.</p>
             <Link to="/contact" className="bg-white text-brand-blue px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-brand-orange hover:text-white transition-all inline-block relative z-10 shadow-2xl shadow-black/10">
                Contact Support
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSPage;
