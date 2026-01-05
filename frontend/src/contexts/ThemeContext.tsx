import React, { createContext, useContext, useEffect, useState } from 'react';
import { settingsService } from '../services/api';
import { Settings } from '../types';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  initializeTheme: (settings: Settings) => void;
  isThemeInitialized: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Синхронно загружаем тему из localStorage или определяем системную тему
  const getInitialTheme = (): Theme => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      return savedTheme;
    }
    
    // Проверяем системную тему
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark ? 'dark' : 'light';
  };

  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [isThemeInitialized, setIsThemeInitialized] = useState(false);

  // Функция для инициализации темы из настроек
  const initializeTheme = (settings: Settings) => {
    const settingsTheme = settings.theme as Theme;
    setThemeState(settingsTheme);
    localStorage.setItem('theme', settingsTheme);
    setIsThemeInitialized(true);
  };

 useEffect(() => {
    // Применяем тему к корневому элементу
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Сохраняем тему в localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

 return (
    <ThemeContext.Provider value={{ theme, setTheme, initializeTheme, isThemeInitialized }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};