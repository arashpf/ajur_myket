import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import styles from './styles';

const CategoryTabs = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.categoryContainer}
      contentContainerStyle={styles.categoryContent}
    >
      {categories.map(category => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryButton,
            { backgroundColor: activeCategory === category.id ? category.color : '#8e8b8bff' }
          ]}
          onPress={() => onCategoryChange(category.id)}
        >
          <Text style={[
            styles.categoryText,
            { color:  'white' }
          ]}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default CategoryTabs;