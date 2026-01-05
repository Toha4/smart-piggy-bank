import React, { useState } from 'react';
import { Transaction } from '../types';

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id' | 'created_at'>) => void;
  onCancel: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, onCancel }) => {
  const [description, setDescription] = useState('');
 const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [goalId, setGoalId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const transactionData = {
      description,
      amount: parseFloat(amount),
      transaction_type: transactionType,
      goal_id: goalId ? parseInt(goalId, 10) : undefined,
    };
    
    onSubmit(transactionData);
 };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="description">
          Description
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="amount">
          Amount
        </label>
        <input
          id="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Type
        </label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={transactionType === 'deposit'}
              onChange={() => setTransactionType('deposit')}
              className="form-radio text-blue-600"
            />
            <span className="ml-2 dark:text-gray-30">Deposit</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={transactionType === 'withdrawal'}
              onChange={() => setTransactionType('withdrawal')}
              className="form-radio text-blue-600"
            />
            <span className="ml-2 dark:text-gray-300">Withdrawal</span>
          </label>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="goalId">
          Goal (optional)
        </label>
        <input
          id="goalId"
          type="number"
          value={goalId}
          onChange={(e) => setGoalId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Leave blank for general transaction"
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Transaction
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;