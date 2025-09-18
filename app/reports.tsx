
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import { useExpenses } from '../hooks/useExpenses';
import { DEFAULT_CATEGORIES } from '../types/expense';
import Icon from '../components/Icon';

const { width } = Dimensions.get('window');

export default function ReportsScreen() {
  const { 
    expenses, 
    getTodayExpenses, 
    getMonthExpenses, 
    getTotalAmount, 
    getExpensesByCategory 
  } = useExpenses();
  
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'month' | 'all'>('month');

  const getExpensesForPeriod = () => {
    switch (selectedPeriod) {
      case 'today':
        return getTodayExpenses();
      case 'month':
        return getMonthExpenses();
      case 'all':
        return expenses;
      default:
        return getMonthExpenses();
    }
  };

  const periodExpenses = getExpensesForPeriod();
  const totalAmount = getTotalAmount(periodExpenses);
  const categoryTotals = getExpensesByCategory();

  // Calculate category percentages for the selected period
  const periodCategoryTotals: { [key: string]: number } = {};
  periodExpenses.forEach(expense => {
    periodCategoryTotals[expense.category] = (periodCategoryTotals[expense.category] || 0) + expense.amount;
  });

  const categoryData = Object.entries(periodCategoryTotals)
    .map(([category, amount]) => {
      const categoryInfo = DEFAULT_CATEGORIES.find(cat => cat.name === category);
      return {
        category,
        amount,
        percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
        color: categoryInfo?.color || colors.textSecondary,
        icon: categoryInfo?.icon || 'ellipsis-horizontal',
      };
    })
    .sort((a, b) => b.amount - a.amount);

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'today':
        return 'Today';
      case 'month':
        return 'This Month';
      case 'all':
        return 'All Time';
      default:
        return 'This Month';
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={commonStyles.title}>Reports</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Period Selector */}
        <View style={commonStyles.section}>
          <View style={styles.periodContainer}>
            {[
              { key: 'today', label: 'Today' },
              { key: 'month', label: 'Month' },
              { key: 'all', label: 'All Time' },
            ].map((period) => (
              <TouchableOpacity
                key={period.key}
                style={[
                  styles.periodButton,
                  selectedPeriod === period.key && styles.activePeriodButton,
                ]}
                onPress={() => setSelectedPeriod(period.key as any)}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    selectedPeriod === period.key && styles.activePeriodButtonText,
                  ]}
                >
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Total Summary */}
        <View style={[commonStyles.section, commonStyles.card]}>
          <Text style={styles.summaryLabel}>{getPeriodLabel()} Total</Text>
          <Text style={[styles.summaryAmount, { color: colors.accent }]}>
            {totalAmount.toLocaleString('en-RW')} RWF
          </Text>
          <Text style={commonStyles.textSecondary}>
            {periodExpenses.length} transactions
          </Text>
        </View>

        {/* Category Breakdown */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>Category Breakdown</Text>
          
          {categoryData.length === 0 ? (
            <View style={[commonStyles.card, commonStyles.center, { padding: 40 }]}>
              <Icon name="pie-chart-outline" size={48} color={colors.textSecondary} />
              <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
                No data for {getPeriodLabel().toLowerCase()}
              </Text>
            </View>
          ) : (
            <>
              {/* Simple Progress Bars */}
              <View style={commonStyles.card}>
                {categoryData.map((item, index) => (
                  <View key={item.category} style={styles.categoryItem}>
                    <View style={styles.categoryHeader}>
                      <View style={styles.categoryInfo}>
                        <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
                          <Icon name={item.icon as any} size={16} color={colors.backgroundAlt} />
                        </View>
                        <Text style={styles.categoryName}>{item.category}</Text>
                      </View>
                      <View style={styles.categoryStats}>
                        <Text style={styles.categoryAmount}>{item.amount.toLocaleString('en-RW')} RWF</Text>
                        <Text style={styles.categoryPercentage}>{item.percentage.toFixed(1)}%</Text>
                      </View>
                    </View>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { 
                            width: `${item.percentage}%`, 
                            backgroundColor: item.color 
                          }
                        ]} 
                      />
                    </View>
                  </View>
                ))}
              </View>

              {/* Top Categories */}
              <View style={commonStyles.card}>
                <Text style={styles.sectionTitle}>Top Categories</Text>
                {categoryData.slice(0, 3).map((item, index) => (
                  <View key={item.category} style={styles.topCategoryItem}>
                    <View style={styles.rankContainer}>
                      <Text style={styles.rank}>{index + 1}</Text>
                    </View>
                    <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
                      <Icon name={item.icon as any} size={20} color={colors.backgroundAlt} />
                    </View>
                    <View style={styles.topCategoryInfo}>
                      <Text style={styles.topCategoryName}>{item.category}</Text>
                      <Text style={styles.topCategoryAmount}>{item.amount.toLocaleString('en-RW')} RWF</Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
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
  periodContainer: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activePeriodButton: {
    backgroundColor: colors.primary,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activePeriodButtonText: {
    color: colors.backgroundAlt,
    fontWeight: '600',
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 8,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    ...commonStyles.row,
    marginBottom: 8,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  categoryStats: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  categoryPercentage: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  topCategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rankContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rank: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.backgroundAlt,
  },
  topCategoryInfo: {
    flex: 1,
    marginLeft: 12,
  },
  topCategoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  topCategoryAmount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
