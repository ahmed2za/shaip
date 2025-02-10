import axios, { AxiosResponse } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  gender: 'ذكر' | 'أنثى';
  avatar: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    gender: string;
    avatar: string;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await axios.post(`${API_URL}/api/login`, credentials);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      return { success: true, token, user };
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, data);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      return { success: true, token, user };
    } catch (error) {
      throw this.handleError(error);
    }
  },

  logout() {
    localStorage.removeItem('token');
  },

  async getCurrentUser() {
    try {
      const token = this.getToken();
      if (!token) return null;

      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.user;
    } catch (error) {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  async isAdmin(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user && user.role === 'admin';
  },

  handleError(error: any): Error {
    if (error.response) {
      return new Error(error.response.data.message || 'Authentication failed');
    }
    return new Error('Network error occurred');
  }
};
