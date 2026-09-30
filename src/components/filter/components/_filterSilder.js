// components/FilterSlider.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatNumberWithWords } from '../utils/formatters';

const FilterSlider = ({
  selectedCategory,
  selectedNeighborhoods,
  selectedFeatures,
  rangeFilters,
  sortBy,
  hasActiveFilters,
  onFilterModalOpen,
  onFilterModalOpenForCategory,
  onCategoryRemove,
  onNeighborhoodRemove,
  onFeatureRemove,
  onRangeFilterRemove,
  onSortRemove,
  onResetAll,
  getSortDisplayText,
  activeFiltersCount,
  // New props for field filters
  fieldValues = {},
  activeFieldFilters = [],
  onFieldFilterRemove,
  categoryFields = {},
}) => {
  
  // Helper to format field display text
  const formatFieldDisplayText = (field) => {
    let displayText = '';
    
    if (field.isRange) {
      // For range fields (normal fields with min/max)
      const { min, max } = field.value || {};
      
      if (min && min !== '' && min !== '0' && max && max !== '' && max !== '0') {
        displayText = `${field.name}: از ${formatNumberWithWords(min)} تا ${formatNumberWithWords(max)}`;
      } else if (min && min !== '' && min !== '0') {
        displayText = `${field.name}: از ${formatNumberWithWords(min)}`;
      } else if (max && max !== '' && max !== '0') {
        displayText = `${field.name}: تا ${formatNumberWithWords(max)}`;
      }
    } else {
      // For predefine fields (dropdown selections)
      // Find the selected option label
      const fieldConfig = (categoryFields.predefine || []).find(f => f.slug === field.slug);
      if (fieldConfig) {
        const selectedOption = fieldConfig.options?.find(opt => 
          opt.value === field.value || opt.id === field.value
        );
        if (selectedOption) {
          displayText = `${field.name}: ${selectedOption.label || selectedOption.value || selectedOption.name}`;
        } else if (field.value) {
          displayText = `${field.name}: ${field.value}`;
        }
      } else {
        displayText = field.name;
      }
    }
    
    // Add unit if exists
    if (field.unit && displayText) {
      displayText += ` ${field.unit}`;
    }
    
    return displayText;
  };

  // Helper to check if there are any active filters
  const hasAnyFilter = () => {
    if (!hasActiveFilters && activeFiltersCount === 0) return false;
    
    return (
      selectedCategory ||
      (selectedNeighborhoods && selectedNeighborhoods.length > 0) ||
      (selectedFeatures && selectedFeatures.length > 0) ||
      (rangeFilters && rangeFilters.some(f => f.low !== '' || f.high !== '')) ||
      (sortBy && sortBy !== 'newest') ||
      (activeFieldFilters && activeFieldFilters.length > 0)
    );
  };

  if (!hasAnyFilter()) {
    return (
      <TouchableOpacity
        style={styles.filterSlider}
        onPress={onFilterModalOpen}
      >
        <Text style={styles.filterSliderText}>فیلترها</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.filterSlider}>
      {/* Scrollable area for filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.selectedFiltersScroll}
        contentContainerStyle={styles.scrollContent}
      >

        {/* Clear All Button - Only show if more than 1 filter active */}
        {activeFiltersCount > 1 && (
          <TouchableOpacity 
            style={styles.clearAllChip}
            onPress={onResetAll}
          >
            <Text style={styles.clearAllText}>حذف همه</Text>
            <Icon name="close" size={16} color="#b92a31" />
          </TouchableOpacity>
        )}
        
        {/* Selected Category - Opens directly to category section */}
        {selectedCategory && (
          <TouchableOpacity 
            style={styles.categoryChip}  
            onPress={onFilterModalOpenForCategory}
          >
            <Text style={styles.categoryChipText}>
              {selectedCategory.name || selectedCategory.title}
            </Text>
            <TouchableOpacity 
              onPress={(e) => {
                e.stopPropagation();
                onCategoryRemove();
              }}
              style={styles.chipRemoveIcon}
            >
              <Icon name="close" size={16} color="#666" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}

        {/* Selected Neighborhoods - with close buttons */}
        {selectedNeighborhoods && selectedNeighborhoods.map((neighborhood) => (
          <FilterChip
            key={`neighborhood-${neighborhood.id}`}
            text={`محله: ${neighborhood.name || neighborhood.label || neighborhood.title}`}
            onRemove={() => onNeighborhoodRemove(neighborhood)}
            type="neighborhood" 
          />
        ))}

        {/* Selected Features - with close buttons */}
        {selectedFeatures && selectedFeatures.map((feature) => (
          <FilterChip
            key={`feature-${feature.value || feature.id}`}
            text={`دارای ${feature.name || feature.value || feature.label}`}
            onRemove={() => onFeatureRemove(feature)}
            type="feature"
          />
        ))}

        {/* Range Filters - with close buttons */}
        {rangeFilters && rangeFilters.map((filter) => {
          if (filter.low !== '' || filter.high !== '') {
            let label = `${filter.name}: `;
            
            if (filter.low !== '' && filter.high !== '') {
              label += `${formatNumberWithWords(filter.low)} تا ${formatNumberWithWords(filter.high)} ${filter.unit || ''}`;
            } else if (filter.low !== '') {
              label += `از ${formatNumberWithWords(filter.low)} ${filter.unit || ''}`;
            } else if (filter.high !== '') {
              label += `تا ${formatNumberWithWords(filter.high)} ${filter.unit || ''}`;
            }
            
            return (
              <FilterChip
                key={`range-${filter.id}`}
                text={label}
                onRemove={() => onRangeFilterRemove(filter.id, 'low', '')}
                type="range"
              />
            );
          }
          return null;
        }).filter(Boolean)}

        {/* Sort Filter - with close button */}
        {sortBy && sortBy !== 'newest' && (
          <FilterChip
            text={`مرتب‌سازی: ${getSortDisplayText()}`}
            onRemove={onSortRemove}
            type="sort"
          />
        )}

        {/* Field Filters (Normal/Range and Predefine) - with close buttons */}
        {activeFieldFilters && activeFieldFilters.map((field) => {
          const displayText = formatFieldDisplayText(field);
          if (displayText) {
            return (
              <FilterChip
                key={`field-${field.slug}`}
                text={displayText}
                onRemove={() => onFieldFilterRemove(field.slug)}
                type="field"
              />
            );
          }
          return null;
        }).filter(Boolean)}

      </ScrollView>

      {/* Filter Button with Count */}
      <TouchableOpacity 
        style={styles.filterButton}
        onPress={onFilterModalOpen}
      >
        <Text style={styles.filterButtonText}>فیلترها</Text>
        {activeFiltersCount > 0 && (
          <View style={styles.filterCountBadge}>
            <Text style={styles.filterCountText}>
              {activeFiltersCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const FilterChip = ({ text, onRemove, type = 'default' }) => (
  <View style={[
    styles.activeFilterChip,
    type === 'field' && styles.fieldFilterChip,
    type === 'neighborhood' && styles.neighborhoodFilterChip,
    type === 'feature' && styles.featureFilterChip,
    type === 'range' && styles.rangeFilterChip,
    type === 'sort' && styles.sortFilterChip,
  ]}>
    <Text style={[
      styles.activeFilterChipText,
      type === 'field' && styles.fieldFilterChipText,
    ]} numberOfLines={1}>
      {text}
    </Text>
    <TouchableOpacity 
      onPress={onRemove}
      style={styles.removeButton}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Icon name="close" size={16} color={type === 'field' ? '#b92a31' : '#666'} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#b92a31',
    marginLeft: 10,
    position: 'relative',
    height: 40,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#b92a31',
    fontFamily: 'iransans',
    fontWeight: '500',
  },
  filterCountBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#b92a31',
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  filterCountText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'iransans',
    fontWeight: 'bold',
    paddingHorizontal: 4,
  },
  filterSlider: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    minHeight: 56,
  },
  selectedFiltersScroll: {
    flex: 1,
    marginRight: 8,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 4,
  },
  filterSliderText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
    fontFamily: 'iransans',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  categoryChipText: {
    fontSize: 12,
    fontFamily: 'iransans',
    color: '#495057',
    marginLeft: 6,
  },
  chipRemoveIcon: {
    marginLeft: 6,
    padding: 2,
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
    maxWidth: 200, // Prevent chips from being too wide
  },
  fieldFilterChip: {
    backgroundColor: '#fef5f5',
    borderColor: '#b92a31',
    borderWidth: 1.5,
  },
  neighborhoodFilterChip: {
    backgroundColor: '#e8f4fd',
    borderColor: '#4dabf7',
  },
  featureFilterChip: {
    backgroundColor: '#e7f5e9',
    borderColor: '#69db7c',
  },
  rangeFilterChip: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffc107',
  },
  sortFilterChip: {
    backgroundColor: '#f8f9fa',
    borderColor: '#adb5bd',
  },
  activeFilterChipText: {
    fontSize: 12,
    color: '#495057',
    fontFamily: 'iransans',
    marginLeft: 6,
  },
  fieldFilterChipText: {
    color: '#b92a31',
    fontWeight: '500',
  },
  removeButton: {
    marginLeft: 6,
    padding: 2,
  },
  clearAllChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 8,
    borderWidth: 1.5,
    borderColor: '#b92a31',
  },
  clearAllText: {
    fontSize: 12,
    fontFamily: 'iransans',
    color: '#b92a31',
    marginLeft: 6,
    fontWeight: '500',
  },
});

export default FilterSlider;