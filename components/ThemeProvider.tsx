'use client';

import { useEffect, useState } from 'react';
import { applyTheme, getStoredTheme, ThemeKey } from '@/lib/theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeKey>('midnight');

  useEffect(() => {
    const storedTheme = getStoredTheme();
    setTheme(storedTheme);
    applyTheme(storedTheme);
  }, []);

  const handleThemeChange = (newTheme: ThemeKey) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleThemeChange }}>
      {children}
    </ThemeContext.Provider>
  );
}

import { createContext, useContext } from 'react';

const ThemeContext = createContext<{
  theme: ThemeKey;
  setTheme: (theme: ThemeKey) => void;
}>({
  theme: 'midnight',
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);
