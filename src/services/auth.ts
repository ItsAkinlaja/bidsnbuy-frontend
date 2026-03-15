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
    // Attempting to register via standard WP REST API or common registration plugin endpoint
    // Many headless setups use /wp/v2/users/register
    const response = await fetch(`${WP_BASE_URL}/wp/v2/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({ 
        email, 
        username, 
        password,
        // Standard WP fields
        name: username,
        first_name: username.split(' ')[0],
        last_name: username.split(' ').slice(1).join(' ')
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    // After successful registration, we automatically log the user in
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
