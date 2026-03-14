import axios from 'axios';

const WP_BASE_URL = import.meta.env.VITE_WP_API_URL || 'https://bidsnbuy.ng/wp-json';

export interface AuthResponse {
  token: string;
  user_email: string;
  user_nicename: string;
  user_display_name: string;
}

export const authService = {
  // Login to get JWT Token
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await axios.post(`${WP_BASE_URL}/jwt-auth/v1/token`, {
      username,
      password,
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current token
  getToken() {
    return localStorage.getItem('token');
  },

  // Get current user data
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }
};
