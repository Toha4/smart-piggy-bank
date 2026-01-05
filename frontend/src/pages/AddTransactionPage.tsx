import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Transaction } from '../types';
import { transactionService, goalService } from '../services/api';
import TransactionForm from '../components/TransactionForm';
import { Goal } from '../types';

const AddTransactionPage: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const data = await goalService.getAllGoals();
        setGoals(data);
      } catch (error) {
        console.error('Error fetching goals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const handleSubmit = async (transactionData: Omit<Transaction, 'id' | 'created_at'>) => {
    try {
      const newTransaction = await transactionService.createTransaction(transactionData);
      console.log('Transaction added:', newTransaction);
      // Reset form or redirect to another page
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleCancel = () => {
    // Navigate back to previous page or home
    window.history.back();
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
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="text-blue-500 hover:underline">
          &larr; Back to Goals
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Add Transaction</h1>
        
        <TransactionForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
        
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h2>
          
          <div className="space-y-3">
            {/* This would typically show recent transactions */}
            <p className="text-gray-600 dark:text-gray-400">No recent transactions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionPage;