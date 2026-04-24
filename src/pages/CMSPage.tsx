import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { wpService } from '../services/wp-api';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import type { WPPost } from '../types/wordpress';
import { Loader2, ShieldCheck, Info, HelpCircle, Cookie } from 'lucide-react';

const PrivacyFallback: React.FC = () => (
  <div className="max-w-[900px] mx-auto">
    <div className="space-y-12">
      {[
        { title: 'Information We Collect', body: 'We collect information you provide directly to us when you create an account, place a bid, make a purchase, or contact us for support. This includes your name, email address, phone number, shipping address, and payment information.' },
        { title: 'How We Use Your Information', body: 'We use the information we collect to process transactions, send order confirmations and updates, respond to your comments and questions, send marketing communications (with your consent), and improve our platform.' },
        { title: 'Information Sharing', body: 'We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except to trusted third parties who assist us in operating our website, conducting our business, or servicing you — provided those parties agree to keep this information confidential.' },
        { title: 'Data Security', body: 'We implement a variety of security measures to maintain the safety of your personal information. All transactions are processed through a secure gateway provider and are not stored or processed on our servers.' },
        { title: 'Cookies', body: 'We use cookies to understand and save your preferences for future visits, keep track of advertisements, and compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.' },
        { title: 'Your Rights', body: 'You have the right to access, update, or delete the information we have on you. You may also object to processing of your personal data, ask us to restrict processing of your personal data, or request portability of your personal data.' },
        { title: 'Contact Us', body: 'If you have any questions about this Privacy Policy, please contact us at support@bidsnbuy.ng or through our Contact page.' },
      ].map((section, i) => (
        <div key={i} className="border-b border-gray-100 pb-12 last:border-0">
          <h2 className="text-2xl font-black text-gray-900 mb-4">{section.title}</h2>
          <p className="text-gray-500 leading-relaxed">{section.body}</p>
        </div>
      ))}
    </div>
    <div className="mt-16 p-10 bg-brand-blue rounded-[40px] text-center text-white">
      <h3 className="text-2xl font-black mb-3">Questions about your data?</h3>
      <p className="text-white/70 mb-8 font-medium">Our team is available 24/7 to address any privacy concerns.</p>
      <Link to="/contact" className="bg-white text-brand-blue px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-orange hover:text-white transition-all inline-block shadow-xl">
        Contact Support
      </Link>
    </div>
  </div>
);

const CookieFallback: React.FC = () => (
  <div className="max-w-[900px] mx-auto">
    <div className="space-y-12">
      {[
        { title: 'What Are Cookies', body: 'Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the website owners.' },
        { title: 'How We Use Cookies', body: 'BidsnBuy uses cookies to remember your preferences and settings, keep you signed in, understand how you use our platform, personalise content and ads, and improve our services.' },
        { title: 'Types of Cookies We Use', body: 'Essential cookies are required for the platform to function. Performance cookies help us understand how visitors interact with our site. Functional cookies remember your preferences. Marketing cookies track your activity to deliver relevant advertising.' },
        { title: 'Managing Cookies', body: 'You can control and manage cookies in your browser settings. Please note that removing or blocking cookies may impact your user experience and parts of our platform may no longer be fully accessible.' },
        { title: 'Third-Party Cookies', body: 'We may use third-party services such as Google Analytics and payment processors that set their own cookies. We have no control over these cookies and recommend you check the respective privacy policies of these third parties.' },
        { title: 'Updates to This Policy', body: 'We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated effective date.' },
      ].map((section, i) => (
        <div key={i} className="border-b border-gray-100 pb-12 last:border-0">
          <h2 className="text-2xl font-black text-gray-900 mb-4">{section.title}</h2>
          <p className="text-gray-500 leading-relaxed">{section.body}</p>
        </div>
      ))}
    </div>
    <div className="mt-16 p-10 bg-brand-dark rounded-[40px] text-center text-white">
      <h3 className="text-2xl font-black mb-3">Cookie Preferences</h3>
      <p className="text-white/60 mb-8 font-medium">You can manage your cookie preferences at any time through your browser settings.</p>
      <Link to="/contact" className="bg-brand-orange text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-brand-dark transition-all inline-block shadow-xl">
        Contact Us
      </Link>
    </div>
  </div>
);

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

  // Icon based on slug
  const getPageIcon = () => {
    if (slug?.includes('about')) return <Info className="w-8 h-8 text-brand-blue" />;
    if (slug?.includes('privacy') || slug?.includes('terms')) return <ShieldCheck className="w-8 h-8 text-brand-blue" />;
    if (slug?.includes('cookie')) return <Cookie className="w-8 h-8 text-brand-blue" />;
    if (slug?.includes('help') || slug?.includes('faq')) return <HelpCircle className="w-8 h-8 text-brand-blue" />;
    return <Info className="w-8 h-8 text-brand-blue" />;
  };

  const getFallbackTitle = () => {
    if (slug === 'privacy-policy') return 'Privacy Policy';
    if (slug === 'cookie-policy') return 'Cookie Policy';
    return null;
  };

  const getFallbackContent = () => {
    if (slug === 'privacy-policy') return <PrivacyFallback />;
    if (slug === 'cookie-policy') return <CookieFallback />;
    return null;
  };

  if (error || !page) {
    const fallbackTitle = getFallbackTitle();
    const fallbackContent = getFallbackContent();

    if (fallbackTitle && fallbackContent) {
      return (
        <div className="bg-white min-h-screen">
          <div className="bg-gray-50 border-b border-gray-100 py-24">
            <div className="container mx-auto px-4 text-center max-w-[1000px]">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-xl shadow-gray-200/50">
                {getPageIcon()}
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tighter mb-6">{fallbackTitle}</h1>
              <p className="text-gray-400 text-sm font-medium">Last updated: {new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <div className="container mx-auto px-4 py-24">
            {fallbackContent}
          </div>
        </div>
      );
    }

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

  return (
    <div className="bg-white min-h-screen">
      {/* Dynamic Page Header */}      <div className="bg-gray-50 border-b border-gray-100 py-24">
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
