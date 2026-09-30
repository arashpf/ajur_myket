import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CategoryFilters = ({ categories, selectedCategory, onCategorySelect }) => {
  return (
    <ScrollView style={styles.filterContent}>
      <Text style={styles.sectionTitle}>انتخاب دسته‌بندی</Text>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryItem,
            selectedCategory?.id === category.id && styles.categoryItemSelected,
          ]}
          onPress={() => onCategorySelect(category)}
        >
          {selectedCategory?.id === category.id ? (
            <Icon name="radio-button-checked" size={20} color="#b92a31" />
          ) : (
            <Icon name="radio-button-unchecked" size={20} color="#666" />
          )}
          <Text style={styles.categoryText}>{category.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  filterContent: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    fontFamily: 'iransans',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryItemSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#b92a31',
  },
  categoryText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginRight: 12,
    fontFamily: 'iransans',
  },
});

export default CategoryFilters;