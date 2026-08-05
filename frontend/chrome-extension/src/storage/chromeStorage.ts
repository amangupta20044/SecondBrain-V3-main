import { StorageData, User, ThemeMode, OfflineQueueItem } from '../types';

const DEFAULT_BACKEND_URL = 'http://localhost:3000';

export class ChromeStorage {
  private static isChromeStorageAvailable(): boolean {
    return typeof chrome !== 'undefined' && !!chrome.storage && !!chrome.storage.local;
  }

  static async get<K extends keyof StorageData>(key: K): Promise<StorageData[K] | undefined> {
    if (this.isChromeStorageAvailable()) {
      return new Promise((resolve) => {
        chrome.storage.local.get([key], (result) => {
          resolve(result[key]);
        });
      });
    } else {
      const val = localStorage.getItem(`sb_${key}`);
      return val ? JSON.parse(val) : undefined;
    }
  }

  static async set<K extends keyof StorageData>(key: K, value: StorageData[K]): Promise<void> {
    if (this.isChromeStorageAvailable()) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, () => {
          resolve();
        });
      });
    } else {
      localStorage.setItem(`sb_${key}`, JSON.stringify(value));
    }
  }

  static async remove(key: keyof StorageData): Promise<void> {
    if (this.isChromeStorageAvailable()) {
      return new Promise((resolve) => {
        chrome.storage.local.remove([key as string], () => {
          resolve();
        });
      });
    } else {
      localStorage.removeItem(`sb_${key}`);
    }
  }

  static async clear(): Promise<void> {
    if (this.isChromeStorageAvailable()) {
      return new Promise((resolve) => {
        chrome.storage.local.clear(() => {
          resolve();
        });
      });
    } else {
      localStorage.clear();
    }
  }

  // Token & Auth Convenience Methods
  static async getToken(): Promise<string | undefined> {
    return this.get('token');
  }

  static async setToken(token: string): Promise<void> {
    await this.set('token', token);
  }

  static async getUser(): Promise<User | undefined> {
    return this.get('user');
  }

  static async setUser(user: User): Promise<void> {
    await this.set('user', user);
  }

  static async getBackendUrl(): Promise<string> {
    const url = await this.get('backendUrl');
    return url || DEFAULT_BACKEND_URL;
  }

  static async setBackendUrl(url: string): Promise<void> {
    // Strip trailing slash if present
    const cleanUrl = url.trim().replace(/\/+$/, '');
    await this.set('backendUrl', cleanUrl);
  }

  static async getTheme(): Promise<ThemeMode> {
    const theme = await this.get('theme');
    return theme || 'system';
  }

  static async setTheme(theme: ThemeMode): Promise<void> {
    await this.set('theme', theme);
  }

  static async getOfflineQueue(): Promise<OfflineQueueItem[]> {
    const queue = await this.get('offlineQueue');
    return queue || [];
  }

  static async setOfflineQueue(queue: OfflineQueueItem[]): Promise<void> {
    await this.set('offlineQueue', queue);
  }
}
