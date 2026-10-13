import React, { createContext, useContext, useEffect } from 'react';

export type Theme = 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  availableThemes: { id: Theme; name: string; color: string }[];
}

const DEFAULT_THEME: { id: Theme; name: string; color: string }[] = [
  { id: 'dark', name: 'Dark Cinematic', color: '#ffffff' },
];

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
  availableThemes: DEFAULT_THEME,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Clear any legacy multi-theme states and lock to clean dark root
    localStorage.removeItem('portfolio_theme');
    document.documentElement.removeAttribute('data-theme');
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme: 'dark',
        setTheme: () => {},
        availableThemes: DEFAULT_THEME,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
