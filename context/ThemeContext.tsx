import React, { createContext, useContext, useState } from 'react';

type Theme = 'light' | 'dark';

const themes = {
  light: {
    mode: 'light',
    background: '#fdfdfd',
    card: '#f8f8f8',
    text: '#1e293b',
    input: '#ffffff',
    border: '#cbd5e1',
    subText: '#64748B',
    accent: '#059669', // default
  },
  dark: {
    mode: 'dark',
    background: '#0f0f1c',
    card: '#1c1b29',
    text: '#f1f1f1',
    subText: '#94a3b8',
    input: '#334155',
    border: '#475569',
    accent: '#a855f7', // default
  },
};

type ThemeColors = typeof themes.light;

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  colors: ThemeColors;
  accentColor: string;
  updateAccentColor: (color: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [accentColor, setAccentColor] = useState<string>(themes.light.accent); // default

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      // optional: set new default accent when toggling theme
      // setAccentColor(themes[next].accent);
      return next;
    });
  };

  const updateAccentColor = (color: string) => {
    setAccentColor(color);
  };

  const baseColors = themes[theme];

  const colors: ThemeColors = {
    ...baseColors,
    accent: accentColor, // override default accent
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        colors,
        accentColor,
        updateAccentColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useAppTheme must be used within ThemeProvider');
  return context;
};
