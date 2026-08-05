import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ChromeStorage } from '../storage/chromeStorage';

/**
 * Creates a dynamically configured Axios instance pointing to user's specified backend URL
 * and automatically injecting JWT authorization header.
 */
export async function getApiClient(): Promise<AxiosInstance> {
  const baseURL = await ChromeStorage.getBackendUrl();
  const token = await ChromeStorage.getToken();

  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 15000,
  });

  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const currentToken = await ChromeStorage.getToken();
      if (currentToken && config.headers) {
        config.headers.Authorization = currentToken;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
}
