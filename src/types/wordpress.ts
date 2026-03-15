export interface WPPost {
  id: number;
  date: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  featured_media: number;
  slug: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

export interface WPProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  date_created: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  status: string;
  stock_status: string;
  images: {
    id: number;
    src: string;
    name: string;
    alt: string;
  }[];
  categories: {
    id: number;
    name: string;
    slug: string;
  }[];
  meta_data?: Array<{
    id?: number;
    key: string;
    value: string | number | boolean | object | Array<unknown>;
  }>;
  // Auction / Bidding Fields (Custom or via Woo Auctions)
  type?: string;
  is_auction?: boolean;
  current_bid?: string;
  bid_count?: number;
  auction_end_time?: string;
  auction_start_time?: string;
  yith_auction_to?: string;
  yith_auction_from?: string;
  auction_start_price?: string;
  auction_bid_increment?: string;
  auction_reserved_price?: string;
  auction_min_bid?: string;
  auction_status?: 'active' | 'finished' | 'not-started';
  auction_last_bidder?: string;
  bidder_history?: Array<{
    user_name: string;
    bid: string;
    date: string;
  }>;
  attributes?: Array<{
    id: number;
    name: string;
    position: number;
    visible: boolean;
    variation: boolean;
    options: string[];
  }>;
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent: number;
  count: number;
  image?: {
    id: number;
    src: string;
    name: string;
    alt: string;
  };
}

export interface WPCustomer {
  id: number;
  date_created: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  username: string;
  billing: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    postcode: string;
    country: string;
    state: string;
    email: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    postcode: string;
    country: string;
    state: string;
  };
  avatar_url: string;
  meta_data?: Array<{
    id?: number;
    key: string;
    value: string | number | boolean | object | Array<unknown>;
  }>;
}

export interface WPOrder {
  id: number;
  status: string;
  currency: string;
  date_created: string;
  total: string;
  customer_id: number;
  line_items: Array<{
    id: number;
    name: string;
    product_id: number;
    variation_id: number;
    quantity: number;
    total: string;
  }>;
}
