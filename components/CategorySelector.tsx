
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { DEFAULT_CATEGORIES } from '../types/expense';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';

interface CategorySelectorProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        {DEFAULT_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryItem,
              selectedCategory === category.name && styles.selectedCategory,
            ]}
            onPress={() => onSelectCategory(category.name)}
          >
            <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
              <Icon 
                name={category.icon as any} 
                size={24} 
                color={colors.backgroundAlt}
              />
            </View>
            <Text style={[
              styles.categoryText,
              selectedCategory === category.name && styles.selectedCategoryText,
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  scrollView: {
    flexGrow: 0,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 2,
    borderColor: colors.border,
    minWidth: 80,
  },
  selectedCategory: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: colors.primary,
    fontWeight: '600',
  },
});

export default CategorySelector;
