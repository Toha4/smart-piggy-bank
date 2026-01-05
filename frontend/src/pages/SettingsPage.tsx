import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Goal } from '../types';
import { settingsService, goalService } from '../services/api';
import SettingsForm from '../components/SettingsForm';
import GoalSettingsForm from '../components/GoalSettingsForm';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettingsAndGoal = async () => {
      try {
        // Fetch settings
        const settingsData = await settingsService.getSettings();
        setSettings(settingsData);
        
        // Fetch the first goal for settings (in a real app, we might have a specific goal for settings)
        const goals = await goalService.getAllGoals();
        if (goals.length > 0) {
          setGoal(goals[0]);
        } else {
          // If no goals exist, create a default structure
          setGoal({
            id: 0,
            title: 'New Goal',
            target_amount: 0,
            current_balance: 0,
            target_date: new Date().toISOString(),
            is_active: true,
            created_at: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error('Error fetching settings and goal:', error);
        
        // Initialize with default settings if fetch fails
        const defaultSettings = {
          id: 1,
          theme: 'light',
          currency: 'RUB',
          language: 'ru',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setSettings(defaultSettings);
        
        // Initialize with default goal
        setGoal({
          id: 0,
          title: 'New Goal',
          target_amount: 0,
          current_balance: 0,
          target_date: new Date().toISOString(),
          is_active: true,
          created_at: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettingsAndGoal();
  }, []);


  const handleSettingsChange = (updatedSettings: Partial<Settings>) => {
    if (settings) {
      const newSettings = { ...settings, ...updatedSettings };
      setSettings(newSettings);
    }
  };

  const handleGoalChange = (updatedGoal: Partial<Goal>) => {
    if (goal) {
      setGoal({ ...goal, ...updatedGoal });
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    
    try {
      // Update the settings via API
      const updatedSettings = await settingsService.updateSettings(settings);
      setSettings(updatedSettings);
      
      setSaveStatus('Settings saved successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('Error saving settings. Please try again.');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleSaveGoalSettings = async () => {
    if (!goal) return;
    
    try {
      if (goal.id > 0) {
        // Update existing goal
        const updatedGoal = await goalService.updateGoal(goal.id, goal);
        setGoal(updatedGoal);
      } else {
        // Create new goal if it doesn't exist
        const newGoal = await goalService.createGoal({
          title: goal.title,
          target_amount: goal.target_amount,
          target_date: goal.target_date,
          description: goal.description || '',
          image_url: goal.image_url || '',
          is_active: true
        });
        setGoal(newGoal);
      }
      
      setSaveStatus('Goal settings saved successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Error saving goal settings:', error);
      setSaveStatus('Error saving goal settings. Please try again.');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleResetProgress = async () => {
    if (!goal) return;
    
    try {
      // Вызываем API для сброса прогресса
      const updatedGoal = await goalService.resetGoalProgress(goal.id);
      setGoal(updatedGoal);
      
      setSaveStatus('Progress reset successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Error resetting progress:', error);
      setSaveStatus('Error resetting progress. Please try again.');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        
        {settings && (
          <SettingsForm
            settings={settings}
            onChange={handleSettingsChange}
            onSave={handleSaveSettings}
          />
        )}
        
        {goal && (
          <GoalSettingsForm
            goal={goal}
            onChange={handleGoalChange}
            onSave={handleSaveGoalSettings}
            onResetProgress={handleResetProgress}
          />
        )}
        
        {saveStatus && (
          <div className={`mt-4 p-3 rounded-md ${saveStatus.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {saveStatus}
          </div>
        )}
        
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Информация о приложении</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Smart Piggy Bank v1.0.0
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Эффективно управляйте своими целями накопления с помощью нашего интуитивного приложения.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;