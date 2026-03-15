import axios from 'axios';
import type { WPPost, WPProduct, WPCategory } from '../types/wordpress';
import { authService } from './auth';

const WP_BASE_URL = import.meta.env.VITE_WP_API_URL || 'https://bidsnbuy.ng/wp-json';
const CONSUMER_KEY = import.meta.env.VITE_WC_CONSUMER_KEY;
const CONSUMER_SECRET = import.meta.env.VITE_WC_CONSUMER_SECRET;

const api = axios.create({
  baseURL: WP_BASE_URL,
});

const wcApi = axios.create({
  baseURL: WP_BASE_URL,
  params: {
    consumer_key: CONSUMER_KEY,
    consumer_secret: CONSUMER_SECRET,
  },
});

// Helper to map YITH Auction meta data to standard fields
const mapAuctionData = (product: WPProduct): WPProduct => {
  if (!product) return product;
  
  const meta = product.meta_data || [];
  const getMeta = (key: string) => {
    const value = meta.find((m) => m.key === key)?.value;
    if (value === undefined || value === null) return undefined;
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch {
        return undefined;
      }
    }
    return String(value);
  };

  const isYithAuctionFlag = getMeta('_yith_is_an_auction_product') === 'yes' || getMeta('_yith_is_an_auction_product') === '1';
  
  // Check if it's actually an auction
  const isAuctionType = product.type === 'auction';
  const hasAuctionCategory = product.categories?.some(c => 
    c.slug === 'auctions' || 
    c.slug === 'auction' || 
    c.name.toLowerCase().includes('auction') ||
    c.name.toLowerCase().includes('bid')
  );
  const hasAuctionMeta = meta.some(m => 
    m.key === '_yith_auction' || 
    m.key === '_yith_auction_for' ||
    m.key.startsWith('_yith_auction_') || 
    m.key.startsWith('_auction_')
  );

  if (!isAuctionType && !hasAuctionCategory && !hasAuctionMeta && !isYithAuctionFlag) {
    return product;
  }

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

  // Map end time with every possible YITH and WooCommerce Auction key (underscored and non-underscored)
  const auction_end_time = getMeta('_yith_auction_to') || 
                          getMeta('yith_auction_to') ||
                          getMeta('_yith_auction_for') || 
                          getMeta('yith_auction_for') ||
                          getMeta('_auction_dates_to') || 
                          getMeta('auction_dates_to') ||
                          getMeta('_yith_auction_end_date') ||
                          getMeta('yith_auction_end_date') ||
                          getMeta('_auction_end_date') ||
                          getMeta('auction_end_date') ||
                          getMeta('_yith_auction_date_to') ||
                          getMeta('yith_auction_date_to') ||
                          getMeta('_yith_auction_stop') ||
                          getMeta('yith_auction_stop') ||
                          product.yith_auction_to ||
                          product.auction_end_time;

  // Map start time with every possible YITH and WooCommerce Auction key
  const auction_start_time = getMeta('_yith_auction_from') || 
                            getMeta('yith_auction_from') ||
                            getMeta('_auction_dates_from') ||
                            getMeta('auction_dates_from') ||
                            getMeta('_yith_auction_start_date') ||
                            getMeta('yith_auction_start_date') ||
                            getMeta('_auction_start_date') ||
                            getMeta('auction_start_date') ||
                            getMeta('_yith_auction_date_from') ||
                            getMeta('yith_auction_date_from') ||
                            getMeta('_yith_auction_start') ||
                            getMeta('yith_auction_start') ||
                            product.yith_auction_from ||
                            product.auction_start_time;

  // Extra check: Search meta for ANY key that might contain date info if we still don't have it
  let fallback_end = auction_end_time;
  if (!fallback_end) {
    // Try to find any meta key that contains 'auction' and some date-related keyword
    const dateMeta = meta.find(m => {
      const k = m.key.toLowerCase();
      return k.includes('auction') && (k.includes('to') || k.includes('end') || k.includes('stop') || k.includes('date'));
    });
    if (dateMeta) fallback_end = String(dateMeta.value);
  }

  return {
    ...product,
    is_auction: true,
    current_bid: getMeta('_yith_auction_current_bid') || getMeta('current_bid') || getMeta('_auction_current_bid') || product.price,
    bid_count: parseInt(getMeta('_yith_auction_bid_count') || getMeta('bid_count') || getMeta('_auction_bid_count') || '0'),
    auction_end_time: fallback_end,
    auction_start_time,
    auction_start_price: getMeta('_yith_auction_start_price') || getMeta('start_price') || getMeta('_auction_start_price'),
    auction_bid_increment: getMeta('_yith_auction_bid_increment') || getMeta('bid_increment') || getMeta('_auction_bid_increment'),
    auction_min_bid: getMeta('_yith_auction_min_bid') || getMeta('min_bid') || getMeta('_auction_min_bid'),
    auction_status: (getMeta('_yith_auction_closed') === 'yes' || getMeta('_auction_closed') === 'yes' || product.auction_status === 'finished' ? 'finished' : 'active') as 'active' | 'finished' | 'not-started',
    bidder_history: bidderHistory
  } as WPProduct;
};

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
      return response.data.map(mapAuctionData);
    } catch (error) {
      console.warn('WooCommerce V3 failed, trying Store API fallback:', error);
      try {
        const response = await api.get<WPProduct[]>('/wc/store/v1/products', { params });
        return response.data.map(mapAuctionData);
      } catch (e) {
        console.error('Failed to fetch products:', e);
        return [];
      }
    }
  },

  async getProductBySlug(slug: string) {
    try {
      const response = await wcApi.get<WPProduct[]>(`/wc/v3/products?slug=${slug}`);
      return mapAuctionData(response.data[0]);
    } catch (error) {
      console.warn('V3 product slug fetch failed, trying Store API:', error);
      try {
        const response = await api.get<WPProduct[]>(`/wc/store/v1/products?slug=${slug}`);
        return mapAuctionData(response.data[0]);
      } catch (e) {
        console.error('Failed to fetch product by slug:', e);
        return null;
      }
    }
  },

  // Get products by IDs
  async getProductsByIds(ids: number[]) {
    try {
      if (!ids.length) return [];
      const response = await wcApi.get('/wc/v3/products', {
        params: { include: ids.join(',') }
      });
      return response.data.map(mapAuctionData);
    } catch (error) {
      console.error('Error fetching products by IDs:', error);
      return [];
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
    
    // Filter to only auctions (mapAuctionData adds is_auction: true)
    const auctionProducts = allProducts.filter(p => p.is_auction);

    if (auctionProducts.length === 0) {
      console.warn('No auction products found after broad filter. Check meta_data or categories.');
    }

    return auctionProducts.slice(0, finalLimit);
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
  },

  // --- CUSTOMER DASHBOARD API ---

  // Get current customer details
  async getCustomer() {
    try {
      // Since we're using JWT, we can't easily get the ID from the token without decoding
      // But we can fetch /wc/v3/customers/me which uses the current authenticated session
      const response = await wcApi.get('/wc/v3/customers/me');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch customer:', error);
      return null;
    }
  },

  // Get customer orders
  async getCustomerOrders(customerId: number) {
    try {
      const response = await wcApi.get('/wc/v3/orders', {
        params: { customer: customerId }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch customer orders:', error);
      return [];
    }
  },

  // Get customer downloads (for digital products if any)
  async getCustomerDownloads(customerId: number) {
    try {
      const response = await wcApi.get(`/wc/v3/customers/${customerId}/downloads`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch customer downloads:', error);
      return [];
    }
  },

  // Get order by ID
  async getOrderById(orderId: number) {
    try {
      const response = await wcApi.get(`/wc/v3/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch order:', error);
      return null;
    }
  }
};
