import { useState, useEffect, useCallback } from 'react';
import { ChromeStorage } from '../storage/chromeStorage';
import { AuthService } from '../services/auth';
import { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const savedToken = await ChromeStorage.getToken();
      const savedUser = await ChromeStorage.getUser();

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(savedUser);
      } else {
        setToken(null);
        setUser(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to restore session');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await AuthService.login(username, pass);
      setToken(result.token);
      setUser(result.user);
      return result;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Authentication failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username: string, email: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      await AuthService.signup(username, email, pass);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Signup failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    await AuthService.logout();
    setUser(null);
    setToken(null);
    setLoading(false);
  };

  return {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    error,
    login,
    signup,
    logout,
    refetchAuth: checkAuth,
  };
}
