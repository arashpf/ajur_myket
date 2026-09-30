// parts/EmptyState.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const EmptyState = ({ isSearching = false, searchQuery = '' }) => {
  return (
    <View style={styles.container}>
      <Ionicons 
        name={isSearching ? "search-outline" : "people-outline"} 
        size={64} 
        color="#9e9e9e" 
      />
      <Text style={styles.title}>
        {isSearching ? 'نتیجه‌ای یافت نشد' : 'هیچ مخاطبی وجود ندارد'}
      </Text>
      <Text style={styles.description}>
        {isSearching 
          ? `هیچ مخاطبی برای "${searchQuery}" یافت نشد`
          : 'برای شروع، مخاطب جدیدی اضافه کنید'
        }
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#757575',
    marginTop: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#9e9e9e',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default EmptyState;