
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';

interface ExpenseSummaryCardProps {
  title: string;
  amount: number;
  icon: string;
  color?: string;
  subtitle?: string;
}

const ExpenseSummaryCard: React.FC<ExpenseSummaryCardProps> = ({ 
  title, 
  amount, 
  icon, 
  color = colors.primary,
  subtitle 
}) => {
  return (
    <View style={[styles.card, commonStyles.card]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <Icon name={icon as any} size={24} color={colors.backgroundAlt} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={[styles.amount, { color }]}>{amount.toLocaleString('en-RW')} RWF</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    flex: 1,
  },
  amount: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default ExpenseSummaryCard;
