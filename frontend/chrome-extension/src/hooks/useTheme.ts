import { useState, useEffect } from 'react';
import { ChromeStorage } from '../storage/chromeStorage';
import { ThemeMode } from '../types';

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>('system');

  useEffect(() => {
    ChromeStorage.getTheme().then((savedTheme) => {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    });
  }, []);

  const applyTheme = (mode: ThemeMode) => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else if (mode === 'light') {
      root.classList.remove('dark');
    } else {
      // System preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const setTheme = async (mode: ThemeMode) => {
    setThemeState(mode);
    await ChromeStorage.setTheme(mode);
    applyTheme(mode);
  };

  return { theme, setTheme };
}
