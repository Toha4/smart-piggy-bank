import axios from 'axios';
import { Goal, Transaction, Settings } from '../types';

// Определяем URL в зависимости от среды
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Goal services
export const goalService = {
  getAllGoals: async (): Promise<Goal[]> => {
    const response = await api.get('/goals/');
    return response.data;
  },

  getGoalById: async (id: number): Promise<Goal> => {
    const response = await api.get(`/goals/${id}`);
    return response.data;
  },

  createGoal: async (goal: Omit<Goal, 'id' | 'current_balance' | 'created_at'>): Promise<Goal> => {
    const response = await api.post('/goals/', goal);
    return response.data;
  },

  updateGoal: async (id: number, goal: Partial<Goal>): Promise<Goal> => {
    const response = await api.put(`/goals/${id}`, goal);
    return response.data;
  },

  deleteGoal: async (id: number): Promise<void> => {
    await api.delete(`/goals/${id}`);
  },
};

// Transaction services
export const transactionService = {
  getAllTransactions: async (): Promise<Transaction[]> => {
    const response = await api.get('/transactions/');
    return response.data;
  },

  getTransactionById: async (id: number): Promise<Transaction> => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  createTransaction: async (
    transaction: Omit<Transaction, 'id' | 'created_at'>
  ): Promise<Transaction> => {
    const response = await api.post('/transactions/', transaction);
    return response.data;
  },

  updateTransaction: async (id: number, transaction: Partial<Transaction>): Promise<Transaction> => {
    const response = await api.put(`/transactions/${id}`, transaction);
    return response.data;
  },

  deleteTransaction: async (id: number): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },
};

// Settings services
export const settingsService = {
  getSettings: async (): Promise<Settings> => {
    const response = await api.get('/settings/');
    return response.data;
  },

  updateSettings: async (settings: Partial<Settings>): Promise<Settings> => {
    const response = await api.put('/settings/', settings);
    return response.data;
  },
};