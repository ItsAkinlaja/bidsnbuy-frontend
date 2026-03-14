import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { wpService } from '../services/wp-api';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import type { WPPost } from '../types/wordpress';
import { Loader2, Calendar, User, ArrowLeft, ArrowRight, Facebook, Twitter, Link2 } from 'lucide-react';

const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { setCustomTitle } = useBreadcrumb();
  const [post, setPost] = useState<WPPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await wpService.getPostBySlug(slug);
        if (data) {
          setPost(data);
          setCustomTitle(data.title.rendered);
        } else {
          setError('Post not found.');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    window.scrollTo(0, 0);
  }, [slug, setCustomTitle]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-brand-blue mb-4" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Unfolding the story...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-black text-gray-900 mb-6">{error || 'Post Not Found'}</h2>
        <Link to="/blog" className="text-brand-blue font-black uppercase tracking-widest text-sm flex items-center justify-center hover:translate-x-[-4px] transition-transform">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
        </Link>
      </div>
    );
  }

  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || "https://images.unsplash.com/photo-1491933382434-500287f9b54b?auto=format&fit=crop&q=80&w=1200";

  return (
    <article className="bg-white min-h-screen">
      {/* Hero Header */}
      <div className="relative h-[60vh] lg:h-[70vh] w-full overflow-hidden bg-brand-dark">
        <img 
          src={featuredImage} 
          alt={post.title.rendered}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-20 max-w-[1000px]">
            <Link to="/blog" className="inline-flex items-center text-brand-blue font-black uppercase tracking-[0.2em] text-[10px] mb-8 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg hover:bg-brand-blue hover:text-white transition-all">
              <ArrowLeft className="w-3 h-3 mr-2" /> Back to Insider
            </Link>
            <div className="flex items-center space-x-4 mb-6 text-brand-blue font-black text-xs uppercase tracking-[0.2em]">
              <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {new Date(post.date).toLocaleDateString()}</span>
              <span className="w-1 h-1 bg-brand-blue/30 rounded-full" />
              <span>BidsnBuy Insights</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-gray-900 leading-tight tracking-tighter" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-[800px] mx-auto">
          {/* Social Share */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-10 mb-12">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-brand-blue/5 rounded-2xl flex items-center justify-center">
                <User className="w-6 h-6 text-brand-blue" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Written By</p>
                <p className="text-sm font-black text-gray-900">BidsnBuy Editorial</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="w-10 h-10 bg-gray-50 hover:bg-brand-blue hover:text-white rounded-xl flex items-center justify-center transition-all">
                <Facebook className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 bg-gray-50 hover:bg-brand-blue hover:text-white rounded-xl flex items-center justify-center transition-all">
                <Twitter className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 bg-gray-50 hover:bg-brand-blue hover:text-white rounded-xl flex items-center justify-center transition-all">
                <Link2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Body */}
          <div 
            className="prose prose-lg prose-blue max-w-none 
              prose-headings:font-black prose-headings:text-gray-900 prose-headings:tracking-tight
              prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-8
              prose-img:rounded-[40px] prose-img:shadow-2xl prose-img:my-16
              prose-a:text-brand-blue prose-a:font-bold prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-4 prose-blockquote:border-brand-blue prose-blockquote:bg-brand-blue/5 prose-blockquote:p-8 prose-blockquote:rounded-3xl prose-blockquote:italic"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />

          {/* Footer Navigation */}
          <div className="mt-24 pt-12 border-t border-gray-100 flex items-center justify-center">
            <Link 
              to="/blog"
              className="bg-brand-dark text-white px-12 py-5 rounded-[30px] font-black uppercase tracking-[0.2em] text-xs hover:bg-brand-blue transition-all shadow-2xl shadow-brand-dark/20 flex items-center space-x-3"
            >
              <span>Explore More Stories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostDetail;
