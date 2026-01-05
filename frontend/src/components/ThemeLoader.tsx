import { useTheme } from '../contexts/ThemeContext';

const ThemeLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isThemeInitialized } = useTheme();

  if (!isThemeInitialized) {
    // Показываем минимальный индикатор загрузки с базовыми стилями
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ThemeLoader;