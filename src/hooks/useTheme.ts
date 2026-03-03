import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'kanban-theme';

type Theme = 'dark' | 'light';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, theme);
      const html = document.documentElement;
      if (theme === 'light') {
        html.classList.add('light');
      } else {
        html.classList.remove('light');
      }
    }
  }, [theme, isLoaded]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setDarkMode = useCallback(() => {
    setTheme('dark');
  }, []);

  const setLightMode = useCallback(() => {
    setTheme('light');
  }, []);

  return {
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    isLoaded,
    toggleTheme,
    setDarkMode,
    setLightMode,
  };
}
