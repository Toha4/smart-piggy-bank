import React from 'react';
import { Goal } from '../types';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: number) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete }) => {
  const progressPercentage = Math.min(100, (goal.current_balance / goal.target_amount) * 100);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{goal.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {goal.current_balance.toFixed(2)} / {goal.target_amount.toFixed(2)} USD
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(goal)}
            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            Delete
          </button>
        </div>
      </div>
     <div className="mt-4">
       <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
         <div
           className="bg-blue-600 h-2.5 rounded-full"
           style={{ width: `${progressPercentage}%` }}
         ></div>
       </div>
       <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
         <span>{progressPercentage.toFixed(1)}%</span>
         <span>Deadline: {new Date(goal.target_date).toLocaleDateString()}</span>
       </div>
     </div>
   </div>
  );
};

export default GoalCard;