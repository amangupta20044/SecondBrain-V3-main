import { getApiClient } from './api';
import { ChromeStorage } from '../storage/chromeStorage';
import { User } from '../types';

export interface LoginResponse {
  token: string;
  user: User;
  message?: string;
}

export class AuthService {
  static async login(username: string, password: string): Promise<LoginResponse> {
    const api = await getApiClient();
    const response = await api.post('/api/v1/user/signin', { username, password });
    
    if (response.data && response.data.token) {
      await ChromeStorage.setToken(response.data.token);
      if (response.data.user) {
        await ChromeStorage.setUser(response.data.user);
      }
      return response.data;
    }
    throw new Error(response.data?.message || 'Login failed. Invalid response structure.');
  }

  static async signup(username: string, email: string, password: string): Promise<void> {
    const api = await getApiClient();
    const response = await api.post('/api/v1/user/signup', { username, email, password });
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Signup failed.');
    }
  }

  static async logout(): Promise<void> {
    await ChromeStorage.remove('token');
    await ChromeStorage.remove('user');
  }

  static async getCurrentUser(): Promise<User | null> {
    const user = await ChromeStorage.getUser();
    return user || null;
  }
}
