import React, { createContext, useContext, useState } from 'react';

type Theme = 'light' | 'dark';

const themes = {
  light: {
    mode: 'light',
    background: '#fdfdfd',
    card: '#f8f8f8',
    text: '#1e293b',
    subText: '#64748B',
    accent: '#059669',
  },
  dark: {
    mode: 'dark',
    background: '#0f0f1c',
    card: '#1c1b29',
    text: '#f1f1f1',
    subText: '#a3a3b5',
    accent: '#a855f7',
  },
};

type ThemeColors = typeof themes.light;

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  colors: ThemeColors;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const colors = themes[theme];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useAppTheme must be used within ThemeProvider');
  return context;
};
