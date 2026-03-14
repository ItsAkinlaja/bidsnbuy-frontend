import axios from 'axios';
import type { WPPost, WPProduct, WPCategory } from '../types/wordpress';
import { authService } from './auth';

const WP_BASE_URL = import.meta.env.VITE_WP_API_URL || 'https://bidsnbuy.ng/wp-json';
const CONSUMER_KEY = import.meta.env.VITE_WC_CONSUMER_KEY;
const CONSUMER_SECRET = import.meta.env.VITE_WC_CONSUMER_SECRET;

const api = axios.create({
  baseURL: WP_BASE_URL,
});

// Create a specialized instance for WooCommerce V3 with Basic Auth (Preferred for HTTPS)
const wcApi = axios.create({
  baseURL: WP_BASE_URL,
  auth: {
    username: CONSUMER_KEY!,
    password: CONSUMER_SECRET!,
  },
});

// Add Interceptor for JWT token to the standard api
api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add Interceptor for JWT token to the WooCommerce api (for customer-specific actions)
wcApi.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const wpService = {
  // Fetch Posts (Blog) with embedded media
  async getPosts(params: Record<string, unknown> = {}) {
    const response = await api.get<WPPost[]>('/wp/v2/posts', { 
      params: { ...params, _embed: 1 } 
    });
    return response.data;
  },

  async getPostBySlug(slug: string) {
    const response = await api.get<WPPost[]>(`/wp/v2/posts?slug=${slug}&_embed=1`);
    return response.data[0];
  },

  // Fetch Pages (CMS)
  async getPages(params: Record<string, unknown> = {}) {
    const response = await api.get<WPPost[]>('/wp/v2/pages', { 
      params: { ...params, _embed: 1 } 
    });
    return response.data;
  },

  async getPageBySlug(slug: string) {
    const response = await api.get<WPPost[]>(`/wp/v2/pages?slug=${slug}&_embed=1`);
    return response.data[0];
  },

  // Fetch Products (WooCommerce)
  async getProducts(params: Record<string, unknown> = {}) {
    try {
      // Try WooCommerce V3 first with our API keys for full data access (like auctions)
      const response = await wcApi.get<WPProduct[]>('/wc/v3/products', { params });
      return response.data;
    } catch (error) {
      console.warn('WooCommerce V3 failed, trying Store API fallback:', error);
      try {
        const response = await api.get<WPProduct[]>('/wc/store/v1/products', { params });
        return response.data;
      } catch (e) {
        console.error('Failed to fetch products:', e);
        return [];
      }
    }
  },

  async getProductBySlug(slug: string) {
    try {
      const response = await wcApi.get<WPProduct[]>(`/wc/v3/products?slug=${slug}`);
      return response.data[0];
    } catch (error) {
      console.warn('V3 product slug fetch failed, trying Store API:', error);
      try {
        const response = await api.get<WPProduct[]>(`/wc/store/v1/products?slug=${slug}`);
        return response.data[0];
      } catch (e) {
        console.error('Failed to fetch product by slug:', e);
        return null;
      }
    }
  },

  // Fetch products by IDs
  async getProductsByIds(ids: number[]) {
    if (!ids.length) return [];
    try {
      const response = await wcApi.get<WPProduct[]>('/wc/v3/products', {
        params: { include: ids.join(',') }
      });
      return response.data;
    } catch (error) {
      console.warn('V3 IDs fetch failed, trying Store API:', error);
      try {
        const response = await api.get<WPProduct[]>('/wc/store/v1/products', {
          params: { include: ids.join(',') }
        });
        return response.data;
      } catch (e) {
        console.error('Failed to fetch products by IDs:', e);
        return [];
      }
    }
  },

  // Custom Bidding/Auction filter (YITH Support)
  async getAuctions(params: Record<string, unknown> = {}) {
    // Extract per_page for the final result, but use a larger number for the initial fetch
    const finalLimit = (params.per_page as number) || 10;
    
    // Fetch products that are specifically marked as auctions or have auction-related meta
    // Broadening the initial fetch to ensure we don't miss any auctions
    const allProducts = await this.getProducts({ 
      ...params, 
      per_page: 100, // Fetch a larger set to filter through for auctions
      status: 'publish',
      orderby: 'date',
      order: 'desc'
    });
    
    // Filter and map to include auction-specific fields
    const auctionProducts = allProducts.filter(product => {
      const isAuctionType = product.type === 'auction';
      const hasAuctionCategory = product.categories?.some(c => 
        c.slug === 'auctions' || 
        c.slug === 'auction' || 
        c.name.toLowerCase().includes('auction') ||
        c.name.toLowerCase().includes('bid')
      );
      // YITH uses meta_data for auction specifics
      const hasAuctionMeta = product.meta_data?.some(m => 
        m.key === '_yith_auction' || 
        m.key === '_yith_auction_for' ||
        m.key.startsWith('_yith_auction_') || 
        m.key.startsWith('_auction_')
      );

      return isAuctionType || hasAuctionCategory || hasAuctionMeta;
    });

    if (auctionProducts.length === 0) {
      console.warn('No auction products found after broad filter. Check meta_data or categories.');
    }

    // Map and then limit to finalLimit
    return auctionProducts.slice(0, finalLimit).map(product => {
      const meta = product.meta_data || [];
      
      const getMeta = (key: string) => {
        const value = meta.find((m) => m.key === key)?.value;
        return value !== undefined ? String(value) : undefined;
      };

      // Extract bidder history from meta if available (YITH specific)
      const bidderHistoryRaw = getMeta('_yith_auction_bid_history');
      let bidderHistory = [];
      try {
        if (bidderHistoryRaw) {
          bidderHistory = JSON.parse(bidderHistoryRaw);
        }
      } catch (e) {
        console.warn('Failed to parse bidder history:', e);
      }

      return {
        ...product,
        is_auction: true,
        current_bid: getMeta('_yith_auction_current_bid') || getMeta('_auction_current_bid') || product.price,
        bid_count: parseInt(getMeta('_yith_auction_bid_count') || getMeta('_auction_bid_count') || '0'),
        auction_end_time: getMeta('_yith_auction_to') || getMeta('_auction_dates_to'),
        auction_start_time: getMeta('_yith_auction_from') || getMeta('_auction_dates_from'),
        auction_start_price: getMeta('_yith_auction_start_price') || getMeta('_auction_start_price'),
        auction_bid_increment: getMeta('_yith_auction_bid_increment') || getMeta('_auction_bid_increment'),
        auction_min_bid: getMeta('_yith_auction_min_bid') || getMeta('_auction_min_bid'),
        auction_status: (getMeta('_yith_auction_closed') === 'yes' || getMeta('_auction_closed') === 'yes' ? 'finished' : 'active') as 'active' | 'finished' | 'not-started',
        bidder_history: bidderHistory
      } as WPProduct;
    });
  },

  // Fetch Categories
  async getCategories(params: Record<string, unknown> = {}) {
    try {
      const response = await wcApi.get<WPCategory[]>('/wc/v3/products/categories', { 
        params: { ...params, per_page: 100 }
      });
      return response.data;
    } catch (error) {
      console.warn('V3 categories failed, trying Store API:', error);
      try {
        const response = await api.get<WPCategory[]>('/wc/store/v1/products/categories', { params });
        return response.data;
      } catch (e) {
        console.error('Failed to fetch categories:', e);
        return [];
      }
    }
  },

  // Get categories organized by parent
  async getCategoryTree() {
    const allCategories = await this.getCategories();
    const parents = allCategories.filter(cat => cat.parent === 0);
    return parents.map(parent => ({
      ...parent,
      children: allCategories.filter(cat => cat.parent === parent.id)
    }));
  },

  // Newsletter signup (Mock or actual endpoint if available)
  async subscribeNewsletter(email: string) {
    try {
      // If there's a specific WP plugin like Mailchimp for WP, use its endpoint
      // Otherwise, we can use a generic contact form or custom endpoint
      const response = await api.post('/wp/v2/newsletter/subscribe', { email });
      return response.data;
    } catch (error) {
      console.error('Newsletter subscription failed:', error);
      // Fallback for demo if endpoint doesn't exist
      return { success: true, message: 'Subscribed successfully (demo)' };
    }
  },

  // Place a Bid (YITH Auctions API endpoint example)
  async placeBid(productId: number, bidAmount: number) {
    if (!authService.isAuthenticated()) {
      throw new Error('User not logged in');
    }

    try {
      // YITH WooCommerce Auctions typically requires a POST to a specific endpoint
      // or using the WooCommerce V3 products endpoint with custom data
      const response = await wcApi.post(`/wc/v3/products/${productId}/bid`, {
        bid_amount: bidAmount
      });
      return response.data;
    } catch (error) {
      console.error('Error placing bid:', error);
      // If V3 bid endpoint doesn't exist, try a custom YITH endpoint if you've set one up
      try {
        const response = await api.post('/bidsnbuy/v1/place-bid', {
          product_id: productId,
          bid_amount: bidAmount
        });
        return response.data;
      } catch {
        throw new Error('Could not place bid. Please ensure the auction is active and your bid is higher than the current one.');
      }
    }
  }
};
