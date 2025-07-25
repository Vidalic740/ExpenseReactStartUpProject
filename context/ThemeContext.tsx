import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

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
    accent: '#059669',
    surface: '#ffffff',
  },
  dark: {
    mode: 'dark',
    background: '#0f0f1c',
    card: '#1c1b29',
    text: '#f1f1f1',
    subText: '#94a3b8',
    input: '#334155',
    border: '#475569',
    accent: '#a855f7',
    surface: '#1a1a1a',
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

const STORAGE_THEME_KEY = 'APP_THEME';
const STORAGE_ACCENT_KEY = 'APP_ACCENT_COLOR';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [accentColor, setAccentColor] = useState<string>(themes.light.accent);

  // Load saved theme and accentColor from AsyncStorage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(STORAGE_THEME_KEY);
        if (storedTheme === 'light' || storedTheme === 'dark') {
          setTheme(storedTheme);
        }

        const storedAccent = await AsyncStorage.getItem(STORAGE_ACCENT_KEY);
        if (storedAccent) {
          setAccentColor(storedAccent);
        }
      } catch (error) {
        console.error('Failed to load theme settings', error);
      }
    };
    loadSettings();
  }, []);

  // Save theme to AsyncStorage whenever it changes
  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      AsyncStorage.setItem(STORAGE_THEME_KEY, next).catch(console.error);
      return next;
    });
  };

  // Save accent color to AsyncStorage whenever it changes
  const updateAccentColor = (color: string) => {
    setAccentColor(color);
    AsyncStorage.setItem(STORAGE_ACCENT_KEY, color).catch(console.error);
  };

  const baseColors = themes[theme];

  const colors: ThemeColors = {
    ...baseColors,
    accent: accentColor,
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
