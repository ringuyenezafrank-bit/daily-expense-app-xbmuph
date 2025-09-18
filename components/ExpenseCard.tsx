
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Expense, DEFAULT_CATEGORIES } from '../types/expense';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';

interface ExpenseCardProps {
  expense: Expense;
  onPress?: () => void;
  onDelete?: () => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onPress, onDelete }) => {
  const category = DEFAULT_CATEGORIES.find(cat => cat.name === expense.category);
  const formattedDate = new Date(expense.date).toLocaleDateString();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={[styles.iconContainer, { backgroundColor: category?.color || colors.textSecondary }]}>
            <Icon 
              name={category?.icon as any || 'ellipsis-horizontal'} 
              size={20} 
              color={colors.backgroundAlt}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.category}>{expense.category}</Text>
            <Text style={styles.description}>{expense.description}</Text>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.amount}>-{expense.amount.toLocaleString('en-RW')} RWF</Text>
          {onDelete && (
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <Icon name="trash" size={16} color={colors.error} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    ...commonStyles.card,
    marginVertical: 4,
    padding: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: 4,
  },
  deleteButton: {
    padding: 4,
  },
});

export default ExpenseCard;
