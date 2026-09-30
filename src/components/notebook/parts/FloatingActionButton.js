import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';

const FloatingActionButton = ({ onPress, style, icon }) => {
  const getIcon = () => {
    if (icon === 'search') {
      return <Ionicons name="search" size={24} color="white" />;
    }
    // Default to add icon
    return <Text style={styles.fabIcon}>＋</Text>;
  };

  return (
    <TouchableOpacity 
      style={[styles.fab, style]}
      onPress={onPress}
    >
      {getIcon()}
    </TouchableOpacity>
  );
};

export default FloatingActionButton;