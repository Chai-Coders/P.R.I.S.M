import React, { createContext, useContext, useState } from 'react';
import { ThemeMode } from '../types/drive';

export interface ThemeColors {
  background: string;
  cardBackground: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string; // Google Blue
  primaryLight: string;
  border: string;
  inputBg: string;
  iconBg: string;
  badgeBg: string;
  shadowColor: string;
  accentBlue: string;
  cardBorder: string;
}

const lightColors: ThemeColors = {
  background: '#F8F9FA',
  cardBackground: '#FFFFFF',
  text: '#1F1F1F',
  textSecondary: '#444746',
  textMuted: '#747775',
  primary: '#1A73E8', // Google Blue
  primaryLight: '#E8F0FE',
  border: '#E0E0E0',
  inputBg: '#EDF2FC',
  iconBg: '#F1F3F4',
  badgeBg: '#E8F0FE',
  shadowColor: 'rgba(60, 64, 67, 0.12)',
  accentBlue: '#1A73E8',
  cardBorder: '#E5E7EB',
};

const darkColors: ThemeColors = {
  background: '#121212',
  cardBackground: '#1E1E1E',
  text: '#F3F4F6',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  primary: '#4285F4', // Google Blue for dark mode
  primaryLight: '#1E293B',
  border: '#2E2E2E',
  inputBg: '#28292A',
  iconBg: '#2D2D2D',
  badgeBg: '#1E293B',
  shadowColor: 'rgba(0, 0, 0, 0.5)',
  accentBlue: '#4285F4',
  cardBorder: '#2D2D2D',
};

interface ThemeContextType {
  theme: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
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
