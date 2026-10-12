import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'midnight' | 'sunset' | 'forest' | 'ocean' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  availableThemes: { id: Theme; name: string; color: string }[];
}

const THEMES: { id: Theme; name: string; color: string }[] = [
  { id: 'midnight', name: 'Midnight Cyber', color: '#3b82f6' },
  { id: 'sunset', name: 'Sunset Glow', color: '#f97316' },
  { id: 'forest', name: 'Emerald Forest', color: '#10b981' },
  { id: 'ocean', name: 'Deep Ocean', color: '#06b6d4' },
  { id: 'light', name: 'Clean Light', color: '#6366f1' },
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  defaultTheme?: Theme;
}> = ({ children, defaultTheme = 'midnight' }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('portfolio_theme') as Theme;
    return saved || defaultTheme;
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('portfolio_theme', newTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'midnight') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        availableThemes: THEMES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
