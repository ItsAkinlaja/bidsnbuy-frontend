import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { wpService } from '../services/wp-api';
import type { WPPost } from '../types/wordpress';
import { Loader2, ArrowRight, Calendar } from 'lucide-react';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await wpService.getPosts({ per_page: 12 });
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load blog posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-brand-blue mb-4" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading BidsnBuy Insider...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-brand-dark py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(30,92,234,0.15),transparent)]" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter mb-6">
            BidsnBuy <span className="text-brand-orange">Insider</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Your ultimate guide to mastering auctions, finding the best deals, and staying updated with the luxury lifestyle.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 max-w-[1440px]">
        {error ? (
          <div className="text-center py-20 bg-red-50 rounded-[40px] border border-red-100">
            <p className="text-red-600 font-bold">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {posts.map((post) => (
              <article key={post.id} className="group flex flex-col h-full">
                <Link to={`/blog/${post.slug}`} className="block relative aspect-[16/10] rounded-[40px] overflow-hidden mb-8 bg-gray-100 shadow-xl group-hover:shadow-brand-blue/10 transition-all duration-500">
                  <img 
                    src={post._embedded?.['wp:featuredmedia']?.[0]?.source_url || "https://images.unsplash.com/photo-1491933382434-500287f9b54b?auto=format&fit=crop&q=80&w=800"} 
                    alt={post.title.rendered}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
                
                <div className="flex-grow">
                  <div className="flex items-center space-x-4 mb-6 text-brand-blue font-black text-[10px] uppercase tracking-[0.2em]">
                    <span className="bg-brand-blue/5 px-3 py-1 rounded-lg">Insights</span>
                    <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  
                  <Link to={`/blog/${post.slug}`}>
                    <h2 className="text-3xl font-black text-gray-900 mb-6 group-hover:text-brand-blue transition-colors leading-tight" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                  </Link>
                  
                  <div 
                    className="text-gray-500 font-medium leading-relaxed mb-8 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                  />
                </div>

                <Link 
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center text-brand-blue font-black uppercase tracking-widest text-xs group-hover:translate-x-2 transition-transform duration-300"
                >
                  Read Full Story
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
