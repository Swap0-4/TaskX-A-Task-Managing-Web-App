import axios from 'axios';
import { User } from './api';

const API_URL = 'http://localhost:5000';

export interface AuthUser extends User {
  token?: string;
  picture?: string;
  provider?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface OAuthResponse {
  user: AuthUser;
  token: string;
}

class AuthService {
  // Store user in localStorage
  setUser(user: AuthUser): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Get user from localStorage
  getUser(): AuthUser | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  // Remove user from localStorage
  removeUser(): void {
    localStorage.removeItem('user');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getUser() !== null;
  }

  // Set auth token in axios headers
  setAuthHeader(token: string | undefined): void {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }

  // Register a new user
  async register(credentials: RegisterCredentials): Promise<AuthUser | null> {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, credentials);
      const { user, token } = response.data;
      
      // Add token to user object
      user.token = token;
      
      // Set user in localStorage
      this.setUser(user);
      
      // Set auth header
      this.setAuthHeader(token);
      
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      return null;
    }
  }

  // Login a user
  async login(credentials: LoginCredentials): Promise<AuthUser | null> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const { user, token } = response.data;
      
      // Add token to user object
      user.token = token;
      
      // Set user in localStorage
      this.setUser(user);
      
      // Set auth header
      this.setAuthHeader(token);
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  // Login with Google OAuth
  async loginWithGoogle(tokenId: string): Promise<AuthUser | null> {
    try {
      const response = await axios.post(`${API_URL}/auth/google`, { tokenId });
      const { user, token } = response.data;
      
      // Add token to user object
      user.token = token;
      
      // Set user in localStorage
      this.setUser(user);
      
      // Set auth header
      this.setAuthHeader(token);
      
      return user;
    } catch (error) {
      console.error('Google OAuth error:', error);
      return null;
    }
  }

  // Login with GitHub OAuth
  async loginWithGithub(code: string): Promise<AuthUser | null> {
    try {
      const response = await axios.post(`${API_URL}/auth/github`, { code });
      const { user, token } = response.data;
      
      // Add token to user object
      user.token = token;
      
      // Set user in localStorage
      this.setUser(user);
      
      // Set auth header
      this.setAuthHeader(token);
      
      return user;
    } catch (error) {
      console.error('GitHub OAuth error:', error);
      return null;
    }
  }

  // Logout
  logout(): void {
    this.removeUser();
    this.setAuthHeader(undefined);
  }

  // Initialize auth on app load
  initAuth(): void {
    const user = this.getUser();
    if (user && user.token) {
      this.setAuthHeader(user.token);
    }
  }
}

export default new AuthService();