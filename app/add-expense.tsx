
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import { useExpenses } from '../hooks/useExpenses';
import CategorySelector from '../components/CategorySelector';
import Icon from '../components/Icon';

export default function AddExpenseScreen() {
  const { addExpense } = useExpenses();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddExpense = async () => {
    if (!amount || !category || !description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      await addExpense({
        amount: numericAmount,
        category,
        description,
        date: new Date().toISOString(),
      });
      
      console.log('Expense added successfully - navigating back');
      
      // Clear form
      setAmount('');
      setDescription('');
      setCategory('Food');
      
      // Navigate back immediately after adding
      router.back();
    } catch (error) {
      console.error('Error adding expense:', error);
      Alert.alert('Error', 'Failed to add expense');
    } finally {
      setLoading(false);
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
          <Text style={commonStyles.title}>Add Expense</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={commonStyles.section}>
          {/* Amount Input */}
          <View style={styles.amountContainer}>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
              autoFocus
            />
            <Text style={styles.currencySymbol}>RWF</Text>
          </View>

          {/* Category Selection */}
          <CategorySelector
            selectedCategory={category}
            onSelectCategory={setCategory}
          />

          {/* Description Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={commonStyles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="What did you spend on?"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Date Display */}
          <View style={styles.dateContainer}>
            <Text style={styles.inputLabel}>Date</Text>
            <View style={styles.dateDisplay}>
              <Icon name="calendar" size={20} color={colors.primary} />
              <Text style={styles.dateText}>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
            </View>
          </View>

          {/* Add Button */}
          <TouchableOpacity
            style={[commonStyles.button, loading && styles.disabledButton]}
            onPress={handleAddExpense}
            disabled={loading}
          >
            <Text style={commonStyles.buttonText}>
              {loading ? 'Adding...' : 'Add Expense'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    ...commonStyles.section,
    ...commonStyles.row,
    marginBottom: 32,
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
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    paddingVertical: 20,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 8,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: '300',
    color: colors.text,
    textAlign: 'center',
    minWidth: 200,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 8,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  dateContainer: {
    marginBottom: 32,
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
