
export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: number;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const DEFAULT_CATEGORIES: ExpenseCategory[] = [
  { id: '1', name: 'Food', icon: 'restaurant', color: '#FF5722' },
  { id: '2', name: 'Transport', icon: 'car', color: '#2196F3' },
  { id: '3', name: 'Shopping', icon: 'bag', color: '#9C27B0' },
  { id: '4', name: 'Entertainment', icon: 'game-controller', color: '#FF9800' },
  { id: '5', name: 'Health', icon: 'medical', color: '#4CAF50' },
  { id: '6', name: 'Bills', icon: 'receipt', color: '#795548' },
  { id: '7', name: 'Education', icon: 'school', color: '#3F51B5' },
  { id: '8', name: 'Other', icon: 'ellipsis-horizontal', color: '#607D8B' },
];
