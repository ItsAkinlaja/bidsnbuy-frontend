const WP_BASE_URL = import.meta.env.VITE_WP_API_URL || 'https://bidsnbuy.ng/wp-json';
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export interface AuthResponse {
  token: string;
  user_email: string;
  user_nicename: string;
  user_display_name: string;
}

export const authService = {
  // Login to get JWT Token
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${WP_BASE_URL}/jwt-auth/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data));
    return data;
  },

  async register(email: string, username: string, password: string): Promise<AuthResponse> {
    // Attempting to register via WooCommerce Customers endpoint
    // This requires the consumer key and secret which are available in wp-api.ts
    // For a production app, this should ideally be handled by a secure backend or specific registration plugin
    const CONSUMER_KEY = import.meta.env.VITE_WC_CONSUMER_KEY;
    const CONSUMER_SECRET = import.meta.env.VITE_WC_CONSUMER_SECRET;

    const response = await fetch(`${WP_BASE_URL}/wc/v3/customers?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        username,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed. The username or email might already be in use.');
    }

    // After successful registration, we automatically log the user in to get the JWT token
    return this.login(username, password);
  },

  // Logout
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Get current token
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Get current user data
  getUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }
};
