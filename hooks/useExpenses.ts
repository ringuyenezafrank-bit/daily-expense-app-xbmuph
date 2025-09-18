
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense } from '../types/expense';

const EXPENSES_STORAGE_KEY = 'expenses_data';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const storedExpenses = await AsyncStorage.getItem(EXPENSES_STORAGE_KEY);
      if (storedExpenses) {
        const parsedExpenses = JSON.parse(storedExpenses);
        setExpenses(parsedExpenses);
        console.log('Loaded expenses:', parsedExpenses.length);
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveExpenses = async (newExpenses: Expense[]) => {
    try {
      await AsyncStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(newExpenses));
      setExpenses(newExpenses);
      console.log('Saved expenses:', newExpenses.length);
    } catch (error) {
      console.error('Error saving expenses:', error);
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    const updatedExpenses = [...expenses, newExpense];
    await saveExpenses(updatedExpenses);
  };

  const deleteExpense = async (id: string) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    await saveExpenses(updatedExpenses);
  };

  const updateExpense = async (id: string, updatedExpense: Partial<Expense>) => {
    const updatedExpenses = expenses.map(expense =>
      expense.id === id ? { ...expense, ...updatedExpense } : expense
    );
    await saveExpenses(updatedExpenses);
  };

  // Helper functions for calculations
  const getTodayExpenses = () => {
    const today = new Date().toDateString();
    return expenses.filter(expense => new Date(expense.date).toDateString() === today);
  };

  const getMonthExpenses = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });
  };

  const getTotalAmount = (expenseList: Expense[]) => {
    return expenseList.reduce((total, expense) => total + expense.amount, 0);
  };

  const getExpensesByCategory = () => {
    const categoryTotals: { [key: string]: number } = {};
    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    return categoryTotals;
  };

  return {
    expenses,
    loading,
    addExpense,
    deleteExpense,
    updateExpense,
    getTodayExpenses,
    getMonthExpenses,
    getTotalAmount,
    getExpensesByCategory,
  };
};
