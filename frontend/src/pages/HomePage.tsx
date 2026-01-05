import React, { useState, useEffect } from 'react';
import { Goal } from '../types';
import { goalService, transactionService } from '../services/api';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { formatCurrency, parseCurrency } from '../utils';

const HomePage: React.FC = () => {
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  // Загрузка текущей цели
  useEffect(() => {
    const fetchCurrentGoal = async () => {
      try {
        const goals = await goalService.getAllGoals();
        // Предполагаем, что текущая цель - это активная цель или последняя добавленная
        const activeGoal = goals.find(goal => goal.is_active) || goals[0];
        setCurrentGoal(activeGoal || null);
      } catch (error) {
        console.error('Error fetching goal:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentGoal();
  }, []);

  // Запускаем анимацию конфетти при достижении цели
  useEffect(() => {
    if (currentGoal) {
      const progressPercentage = Math.min(100, (currentGoal.current_balance / currentGoal.target_amount) * 100);
      if (progressPercentage >= 100) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  }, [currentGoal]);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentGoal || !amount) return;
    
    try {
      // Парсим сумму перед отправкой на сервер
      const numericAmount = parseCurrency(amount);
      
      const transactionData = {
        goal_id: currentGoal.id,
        amount: numericAmount,
        transaction_type: 'deposit' as const,
        description: description || 'Пополнение копилки'
      };
      
      await transactionService.createTransaction(transactionData);
      
      // Обновляем цель после добавления транзакции
      const updatedGoal = await goalService.getGoalById(currentGoal.id);
      setCurrentGoal(updatedGoal);
      
      // Сбрасываем форму
      setAmount('');
      setDescription('');
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

 if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentGoal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Цель для накопления не установлена</p>
          <Link
            to="/add-goal"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Создать цель
          </Link>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.min(100, (currentGoal.current_balance / currentGoal.target_amount) * 100);
  
  // Определяем цвет прогресс-бара в зависимости от прогресса
  let progressBarColor = 'bg-blue-600'; // по умолчанию
  if (progressPercentage >= 100) {
    progressBarColor = 'bg-green-500';
  } else if (progressPercentage >= 75) {
    progressBarColor = 'bg-orange-500';
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
          {/* Заголовок и изображение цели */}
          <div className="flex flex-col items-center mb-6">
            {currentGoal.image_url && (
              <div className="mb-4">
                <img
                  src={currentGoal.image_url}
                  alt={currentGoal.title}
                  className="w-80 h-80 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                />
              </div>
            )}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{currentGoal.title}</h1>
              <p className="text-gray-600 dark:text-gray-300">
                {formatCurrency(currentGoal.current_balance)} из {formatCurrency(currentGoal.target_amount)} ₽
              </p>
            </div>
          </div>

          {/* Прогресс-бар */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-6 dark:bg-gray-700">
              <div
                className={`${progressBarColor} h-6 rounded-full transition-all duration-500 ease-in-out`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">
              <span>{progressPercentage.toFixed(1)}%</span>
              {currentGoal.target_date && (
                <span>Дедлайн: {new Date(currentGoal.target_date).toLocaleDateString('ru-RU')}</span>
              )}
            </div>
          </div>

          {/* Форма добавления средств */}
          <form onSubmit={handleAddTransaction} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Сумма пополнения (₽)
                </label>
                <input
                  id="amount"
                  type="text"
                  value={amount}
                  onChange={(e) => {
                    // Сохраняем значение как есть при изменении
                    setAmount(e.target.value);
                  }}
                  onBlur={(e) => {
                    // При потере фокуса форматируем значение
                    if (e.target.value) {
                      const numericValue = parseCurrency(e.target.value);
                      setAmount(formatCurrency(numericValue));
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Введите сумму"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Комментарий
                </label>
                <input
                  id="description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Комментарий"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Пополнить копилку
              </button>
            </div>
          </form>
        </div>

        {/* Дополнительные действия */}
        {/* Убраны кнопки, так как есть меню в шапке */}
      </div>
    </div>
  );
};

export default HomePage;