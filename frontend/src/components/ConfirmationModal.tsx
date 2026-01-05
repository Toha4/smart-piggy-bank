import React, { useState } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  goalTitle: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  goalTitle,
  message 
}) => {
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (userInput.trim() !== goalTitle) {
      setError(`Название цели введено неверно. Пожалуйста, введите "${goalTitle}".`);
      return;
    }

    onConfirm();
    // Сброс состояния при закрытии
    setUserInput('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black opacity-50" 
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Подтверждение действия</h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4">{message}</p>
        
        <p className="text-red-600 dark:text-red-400 mb-4 font-semibold">
          Это действие необратимо и удалит всю историю пополнений.
        </p>
        
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Для подтверждения введите название цели: <span className="font-semibold">{goalTitle}</span>
          </label>
          <input
            type="text"
            value={userInput}
            onChange={(e) => {
              setUserInput(e.target.value);
              if (error) setError(''); // Сброс ошибки при вводе
            }}
            className={`w-full px-3 py-2 border ${
              error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
            placeholder={`Введите "${goalTitle}"`}
          />
          {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;