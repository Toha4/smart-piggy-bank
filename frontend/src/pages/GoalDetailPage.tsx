import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Goal, Transaction } from '../types';
import { goalService, transactionService } from '../services/api';
import TransactionForm from '../components/TransactionForm';

const GoalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  useEffect(() => {
    const fetchGoalData = async () => {
      try {
        if (id) {
          const goalData = await goalService.getGoalById(parseInt(id, 10));
          setGoal(goalData);
          
          // Fetch transactions related to this goal
          const allTransactions = await transactionService.getAllTransactions();
          const goalTransactions = allTransactions.filter(
            transaction => transaction.goal_id === parseInt(id, 10)
          );
          // Сортируем транзакции по дате создания (новые сверху)
          const sortedTransactions = goalTransactions.sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setTransactions(sortedTransactions);
        }
      } catch (error) {
        console.error('Error fetching goal data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoalData();
  }, [id]);

  const handleAddTransaction = async (transactionData: Omit<Transaction, 'id' | 'created_at'>) => {
    try {
      const transaction = {
        ...transactionData,
        goal_id: goal?.id,
      };
      
      const newTransaction = await transactionService.createTransaction(transaction);
      setTransactions([newTransaction, ...transactions]);
      
      // Update goal amount
      if (goal) {
        const updatedGoal = { ...goal };
        if (transaction.transaction_type === 'deposit') {
          updatedGoal.current_balance += transaction.amount;
        } else {
          updatedGoal.current_balance -= transaction.amount;
        }
        setGoal(updatedGoal);
      }
      
      setShowTransactionForm(false);
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

  if (!goal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Goal not found</h1>
        <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">
          Back to Goals
        </Link>
      </div>
    );
  }

  const progressPercentage = Math.min(100, (goal.current_balance / goal.target_amount) * 10);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="text-blue-500 hover:underline">
          &larr; Back to Goals
        </Link>
        <button
          onClick={() => setShowTransactionForm(!showTransactionForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {showTransactionForm ? 'Cancel' : 'Add Transaction'}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{goal.title}</h1>
        
        <div className="mb-6">
          <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white mb-1">
            <span>{goal.current_balance.toFixed(2)} USD</span>
            <span>of {goal.target_amount.toFixed(2)} USD</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-4 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
            <span>{progressPercentage.toFixed(1)}% Complete</span>
            <span>Deadline: {new Date(goal.target_date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {showTransactionForm && (
        <TransactionForm
          onSubmit={handleAddTransaction}
          onCancel={() => setShowTransactionForm(false)}
        />
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Transactions</h2>
        
        {transactions.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No transactions yet for this goal.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {transaction.description}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${transaction.transaction_type === 'deposit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {transaction.transaction_type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(transaction.created_at + 'Z').toLocaleString('ru-RU', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalDetailPage;