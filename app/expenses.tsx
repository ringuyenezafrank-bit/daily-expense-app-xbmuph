
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import { useExpenses } from '../hooks/useExpenses';
import ExpenseCard from '../components/ExpenseCard';
import Icon from '../components/Icon';

export default function ExpensesScreen() {
  const { expenses, deleteExpense, getTotalAmount } = useExpenses();
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');

  const sortedExpenses = [...expenses].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'amount':
        return b.amount - a.amount;
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  const totalAmount = getTotalAmount(expenses);

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={commonStyles.title}>All Expenses</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Summary */}
        <View style={[commonStyles.section, commonStyles.card]}>
          <View style={commonStyles.row}>
            <View>
              <Text style={commonStyles.textSecondary}>Total Expenses</Text>
              <Text style={[commonStyles.title, { color: colors.accent }]}>
                ${totalAmount.toFixed(2)}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={commonStyles.textSecondary}>Transactions</Text>
              <Text style={commonStyles.subtitle}>{expenses.length}</Text>
            </View>
          </View>
        </View>

        {/* Sort Options */}
        <View style={commonStyles.section}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <View style={styles.sortContainer}>
            {[
              { key: 'date', label: 'Date' },
              { key: 'amount', label: 'Amount' },
              { key: 'category', label: 'Category' },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.sortButton,
                  sortBy === option.key && styles.activeSortButton,
                ]}
                onPress={() => setSortBy(option.key as any)}
              >
                <Text
                  style={[
                    styles.sortButtonText,
                    sortBy === option.key && styles.activeSortButtonText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Expenses List */}
        <View style={commonStyles.section}>
          {sortedExpenses.length === 0 ? (
            <View style={[commonStyles.card, commonStyles.center, { padding: 40 }]}>
              <Icon name="receipt-outline" size={48} color={colors.textSecondary} />
              <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
                No expenses found
              </Text>
              <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
                Start adding your expenses to see them here
              </Text>
            </View>
          ) : (
            sortedExpenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onDelete={() => deleteExpense(expense.id)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    ...commonStyles.section,
    ...commonStyles.row,
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  sortContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  activeSortButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeSortButtonText: {
    color: colors.backgroundAlt,
  },
});
