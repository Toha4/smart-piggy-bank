import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeInitializer from './components/ThemeInitializer';
import ThemeLoader from './components/ThemeLoader';
import HomePage from './pages/HomePage';
import TransactionPage from './pages/TransactionPage';
import SettingsPage from './pages/SettingsPage';
import HomeIcon from './components/icons/HomeIcon';
import TransactionIcon from './components/icons/TransactionIcon';
import SettingsIcon from './components/icons/SettingsIcon';
import './App.css';

const App: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Закрытие мобильного меню при клике вне его области
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const mobileMenu = document.getElementById('mobile-menu');
      const mobileMenuButton = document.getElementById('mobile-menu-button');

      if (
        isMobileMenuOpen &&
        mobileMenu &&
        mobileMenuButton &&
        !mobileMenu.contains(event.target as Node) &&
        !mobileMenuButton.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isMobileMenuOpen]);

  return (
    <ThemeProvider>
      <ThemeInitializer />
      <ThemeLoader>
        <Router>
          <div className="flex flex-col min-h-screen text-gray-900 dark:text-gray-100">
            <header className="bg-white dark:bg-gray-800 shadow-sm">
              <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <img src="/src/static/image/logo.png" alt="Логотип" className="h-14 w-14" />
                  <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Копилка</h1>
                </div>
                <nav className="md:hidden">
                  <button
                    id="mobile-menu-button"
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
                    onClick={toggleMobileMenu}
                    aria-expanded={isMobileMenuOpen}
                    aria-label="Toggle navigation menu"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                  </button>
                </nav>
                <nav className="hidden md:block">
                  <ul className="flex space-x-6">
                    <li>
                      <Link to="/" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                        <HomeIcon className="h-6 w-6 mr-2" />
                        Главная
                      </Link>
                    </li>
                    <li>
                      <Link to="/transactions" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                        <TransactionIcon className="h-6 w-6 mr-2" />
                        Операции
                      </Link>
                    </li>
                    <li>
                      <Link to="/settings" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                        <SettingsIcon className="h-6 w-6 mr-2" />
                        Настройки
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
              <div
                id="mobile-menu"
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden container mx-auto px-4 py-1 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700`}
              >
                <ul className="flex flex-col space-y-2">
                  <li>
                    <Link to="/" className="flex items-center py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" onClick={() => setIsMobileMenuOpen(false)}>
                      <HomeIcon className="h-6 w-6 mr-2" />
                      Главная
                    </Link>
                  </li>
                  <li>
                    <Link to="/transactions" className="flex items-center py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" onClick={() => setIsMobileMenuOpen(false)}>
                    <TransactionIcon className="h-6 w-6 mr-2" />
                    Операции
                  </Link>
                </li>
                  <li>
                    <Link to="/settings" className="flex items-center py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" onClick={() => setIsMobileMenuOpen(false)}>
                      <SettingsIcon className="h-6 w-6 mr-2" />
                      Настройки
                    </Link>
                  </li>
                </ul>
              </div>
            </header>
            
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/transactions" element={<TransactionPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </main>
            
            <footer className="bg-white dark:bg-gray-800 py-6">
              <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
                <p>© {new Date().getFullYear()} Smart Piggy Bank. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </Router>
      </ThemeLoader>
    </ThemeProvider>
  );
};

export default App;