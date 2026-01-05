import { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { settingsService } from '../services/api';

const ThemeInitializer: React.FC = () => {
  const { initializeTheme, theme, isThemeInitialized } = useTheme();
  const initializedRef = useRef(false);

  useEffect(() => {
    const loadThemeSettings = async () => {
      try {
        const settings = await settingsService.getSettings();
        initializeTheme(settings);
      } catch (error) {
        console.error('Error loading theme settings:', error);
      }
    };

    // Загружаем настройки из API для инициализации темы из бэкенда
    // Это перезапишет тему, определенную в ThemeContext, если настройки были изменены на сервере
    if (!initializedRef.current) {
      loadThemeSettings();
      initializedRef.current = true;
    }
  }, [initializeTheme]);

  return null;
};

export default ThemeInitializer;