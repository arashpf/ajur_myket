import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const NeighborhoodFilters = ({ neighborhoods, selectedNeighborhoods, onNeighborhoodToggle }) => {
  return (
    <ScrollView style={styles.filterContent}>
      <Text style={styles.sectionTitle}>انتخاب محلات</Text>
      {neighborhoods.map((neighborhood) => {
        const isSelected = selectedNeighborhoods.some(n => n.id === neighborhood.id);
        return (
          <TouchableOpacity
            key={neighborhood.id}
            style={[
              styles.neighborhoodItem,
              isSelected && styles.neighborhoodItemSelected,
            ]}
            onPress={() => onNeighborhoodToggle(neighborhood)}
          >
            {isSelected ? (
              <Icon name="check-box" size={20} color="#b92a31" />
            ) : (
              <Icon name="check-box-outline-blank" size={20} color="#666" />
            )}
            <Text style={styles.neighborhoodText}>{neighborhood.name}</Text>
          </TouchableOpacity>
        );
      })}
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
  neighborhoodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
  },
  neighborhoodItemSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#b92a31',
  },
  neighborhoodText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginRight: 12,
    fontFamily: 'iransans',
  },
});

export default NeighborhoodFilters;