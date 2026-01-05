import React from 'react';
import { Settings } from '../types';

interface SettingsFormProps {
  settings: Settings;
  onChange: (settings: Partial<Settings>) => void;
  onSave: () => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ settings, onChange, onSave }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Appearance Settings</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Theme
        </label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={settings.theme === 'light'}
              onChange={() => onChange({ theme: 'light' })}
              className="form-radio text-blue-600"
            />
            <span className="ml-2 dark:text-gray-300">Light</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={settings.theme === 'dark'}
              onChange={() => onChange({ theme: 'dark' })}
              className="form-radio text-blue-600"
            />
            <span className="ml-2 dark:text-gray-300">Dark</span>
          </label>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onSave}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsForm;