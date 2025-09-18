
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import { useExpenses } from '../hooks/useExpenses';
import ExpenseSummaryCard from '../components/ExpenseSummaryCard';
import ExpenseCard from '../components/ExpenseCard';
import Icon from '../components/Icon';

export default function HomeScreen() {
  const { 
    expenses, 
    loading, 
    getTodayExpenses, 
    getMonthExpenses, 
    getTotalAmount,
    deleteExpense 
  } = useExpenses();

  const todayExpenses = getTodayExpenses();
  const monthExpenses = getMonthExpenses();
  const recentExpenses = expenses.slice(-5).reverse();

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.container, commonStyles.center]}>
          <Text style={commonStyles.text}>Loading expenses...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={commonStyles.title}>Expense Tracker</Text>
            <Text style={commonStyles.textSecondary}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>
          <Link href="/reports" asChild>
            <TouchableOpacity style={styles.reportsButton}>
              <Icon name="bar-chart" size={24} color={colors.primary} />
            </TouchableOpacity>
          </Link>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <ExpenseSummaryCard
            title="Today"
            amount={getTotalAmount(todayExpenses)}
            icon="today"
            color={colors.accent}
            subtitle={`${todayExpenses.length} transactions`}
          />
          <ExpenseSummaryCard
            title="This Month"
            amount={getTotalAmount(monthExpenses)}
            icon="calendar"
            color={colors.primary}
            subtitle={`${monthExpenses.length} transactions`}
          />
        </View>

        {/* Quick Actions */}
        <View style={commonStyles.section}>
          <Link href="/add-expense" asChild>
            <TouchableOpacity style={styles.addButton}>
              <Icon name="add" size={24} color={colors.backgroundAlt} />
              <Text style={styles.addButtonText}>Add Expense</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Recent Expenses */}
        <View style={commonStyles.section}>
          <View style={styles.sectionHeader}>
            <Text style={commonStyles.subtitle}>Recent Expenses</Text>
            <Link href="/expenses" asChild>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {recentExpenses.length === 0 ? (
            <View style={[commonStyles.card, commonStyles.center, { padding: 40 }]}>
              <Icon name="receipt-outline" size={48} color={colors.textSecondary} />
              <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
                No expenses yet
              </Text>
              <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
                Start tracking your daily expenses
              </Text>
            </View>
          ) : (
            recentExpenses.map((expense) => (
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
  reportsButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  addButtonText: {
    color: colors.backgroundAlt,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionHeader: {
    ...commonStyles.row,
    marginBottom: 16,
  },
  seeAllText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
