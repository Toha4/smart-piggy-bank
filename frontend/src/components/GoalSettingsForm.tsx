import React, { useState, ChangeEvent, useCallback } from 'react';
import { Goal } from '../types';
import ConfirmationModal from './ConfirmationModal';

interface GoalSettingsFormProps {
  goal: Goal;
  onChange: (goal: Partial<Goal>) => void;
  onSave: () => void;
  onResetProgress: (goalTitle: string) => Promise<void>;
}

const GoalSettingsForm: React.FC<GoalSettingsFormProps> = ({ goal, onChange, onSave, onResetProgress }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(goal.image_url || null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleResetProgressClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleModalConfirm = useCallback(() => {
    onResetProgress(goal.title);
    setIsModalOpen(false);
  }, [onResetProgress, goal.title]);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        onChange({ image_url: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Настройки цели</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="goalTitle">
          Название цели
        </label>
        <input
          id="goalTitle"
          type="text"
          value={goal.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="goalAmount">
          Сумма цели
        </label>
        <input
          id="goalAmount"
          type="number"
          value={goal.target_amount}
          onChange={(e) => onChange({ target_amount: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="goalDate">
          Дедлайн
        </label>
        <input
          id="goalDate"
          type="date"
          value={goal.target_date.split('T')[0]}
          onChange={(e) => onChange({ target_date: new Date(e.target.value).toISOString() })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="goalImage">
          Изображение цели
        </label>
        <input
          id="goalImage"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        
        {imagePreview && (
          <div className="mt-4">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-md border border-gray-300 dark:border-gray-600"
            />
          </div>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <button
          type="button"
          onClick={onSave}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Сохранить настройки цели
        </button>
        
        <button
          type="button"
          onClick={handleResetProgressClick}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Сбросить прогресс
        </button>

        {isModalOpen && (
          <ConfirmationModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onConfirm={handleModalConfirm}
            goalTitle={goal.title}
            message="Вы уверены, что хотите сбросить прогресс? Это действие установит баланс в 0 и удалит всю историю пополнений."
          />
        )}
      </div>
    </div>
  );
};

export default GoalSettingsForm;