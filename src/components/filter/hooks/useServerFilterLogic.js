// filter/hooks/useServerFilterLogic.js
import { useState, useCallback, useEffect } from 'react';

export const useServerFilterLogic = (onFiltersChange, options = {}) => {
  const { 
    dynamicTickFields = [],
    initialCategory = null,
    fieldValues = {}  // ✅ Added fieldValues parameter
  } = options;

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [rangeFilters, setRangeFilters] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilterSection, setActiveFilterSection] = useState('main');

  useEffect(() => {
    if (initialCategory && initialCategory.id) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const getFeaturesToUse = () => {
    if (dynamicTickFields && dynamicTickFields.length > 0) {
      console.log('🎯 Using dynamic tick fields:', dynamicTickFields.length);
      return dynamicTickFields.map(field => ({
        id: field.id,
        name: field.name,
        value: field.name,
        label: field.label || field.name
      }));
    }
    return [];
  };

  const getApiFilters = useCallback(() => {
    const filters = {};
  
    if (selectedCategory) {
      filters.category_id = selectedCategory.id;
    }
  
    // Use 'neighborhoods' as comma-separated string
    if (selectedNeighborhoods && selectedNeighborhoods.length > 0) {
      const neighborhoodIds = selectedNeighborhoods.map(n => n.id).filter(id => id);
      if (neighborhoodIds.length > 0) {
        filters.neighborhoods = neighborhoodIds.join(',');
        console.log('🏘️ Adding neighborhoods to API filters:', filters.neighborhoods);
      }
    }
  
    if (selectedFeatures && selectedFeatures.length > 0) {
      filters.features = selectedFeatures.map(f => f.name || f.value);
    }
  
    // ✅ Add field values (price, metrage, etc.) to filters
    Object.entries(fieldValues).forEach(([fieldName, value]) => {
      if (typeof value === 'object') {
        // Handle range values (min/max)
        if (value.min && value.min !== '' && value.min !== '0') {
          filters[`${fieldName}_min`] = value.min;
        }
        if (value.max && value.max !== '' && value.max !== '0') {
          filters[`${fieldName}_max`] = value.max;
        }
      } else if (value !== '' && value !== null && value !== undefined && value !== '0') {
        // Handle single values
        filters[fieldName] = value;
      }
    });
  
    // ✅ Add range filters (from FilterModal)
    if (rangeFilters && rangeFilters.length > 0) {
      rangeFilters.forEach(filter => {
        if (filter.low && filter.low !== '' && filter.low !== '0') {
          filters[`${filter.id}_min`] = filter.low;
        }
        if (filter.high && filter.high !== '' && filter.high !== '0') {
          filters[`${filter.id}_max`] = filter.high;
        }
      });
    }
  
    const sortMap = {
      'newest': 'created_at',
      'oldest': 'created_at_asc', 
      'most_viewed': 'views'
    };
    filters.sort_by = sortMap[sortBy] || 'created_at';
  
    // Remove empty values
    Object.keys(filters).forEach(key => {
      if (filters[key] === null || 
          filters[key] === undefined || 
          filters[key] === '' ||
          (Array.isArray(filters[key]) && filters[key].length === 0)) {
        delete filters[key];
      }
    });
  
    console.log('🔧 API Filters prepared:', filters);
    return filters;
  }, [selectedCategory, selectedNeighborhoods, selectedFeatures, rangeFilters, sortBy, fieldValues]); // ✅ Added fieldValues to dependencies

  const applyFilters = useCallback(() => {
    const filters = getApiFilters();
    onFiltersChange(filters, 1);
  }, [getApiFilters, onFiltersChange]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setActiveFilterSection('main');
    setSelectedFeatures([]);
  };

  const handleNeighborhoodToggle = (neighborhood) => {
    console.log('🏘️ Toggling neighborhood:', neighborhood);
    setSelectedNeighborhoods(prev => {
      const exists = prev.some(n => n.id === neighborhood.id);
      const newNeighborhoods = exists
        ? prev.filter(n => n.id !== neighborhood.id)
        : [...prev, neighborhood];
      
      console.log('Updated neighborhoods:', newNeighborhoods);
      return newNeighborhoods;
    });
  };

  const handleFeatureToggle = (feature) => {
    setSelectedFeatures(prev =>
      prev.some(f => f.value === feature.value || f.id === feature.id)
        ? prev.filter(f => f.value !== feature.value && f.id !== feature.id)
        : [...prev, feature]
    );
  };

  const handleRangeFilterChange = (fieldId, type, value) => {
    setRangeFilters(prev => {
      const existing = prev.find(f => f.id === fieldId);
      if (existing) {
        return prev.map(f =>
          f.id === fieldId
            ? {
                ...f,
                [type]: value === '' ? '' : parseFloat(value) || '',
              }
            : f
        );
      } else {
        // Create new range filter
        const newFilter = {
          id: fieldId,
          low: type === 'low' ? (value === '' ? '' : parseFloat(value) || '') : '',
          high: type === 'high' ? (value === '' ? '' : parseFloat(value) || '') : '',
        };
        return [...prev, newFilter];
      }
    });
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleResetAll = () => {
    setSelectedNeighborhoods([]);
    setSelectedFeatures([]);
    setRangeFilters([]);
    setSortBy('newest');
  };

  const hasActiveFilters = () => {
    // Check if there are any active filters
    const hasNeighborhoods = selectedNeighborhoods.length > 0;
    const hasFeatures = selectedFeatures.length > 0;
    const hasRangeFilters = rangeFilters.some(filter => 
      (filter.low && filter.low !== '' && filter.low !== '0') || 
      (filter.high && filter.high !== '' && filter.high !== '0')
    );
    const hasFieldValues = Object.keys(fieldValues).some(key => {
      const val = fieldValues[key];
      if (typeof val === 'object') {
        return (val.min && val.min !== '' && val.min !== '0') || 
               (val.max && val.max !== '' && val.max !== '0');
      }
      return val !== '' && val !== null && val !== undefined && val !== '0';
    });
    const hasSort = sortBy !== 'newest';
    
    return hasNeighborhoods || hasFeatures || hasRangeFilters || hasFieldValues || hasSort;
  };

  const getSortDisplayText = (sortValue = null) => {
    const sortValueToCheck = sortValue || sortBy;
    const sortTexts = {
      newest: 'جدیدترین',
      oldest: 'قدیمی ترین',
      most_viewed: 'پر بازدید ترین',
    };
    return sortTexts[sortValueToCheck] || 'مرتب‌سازی';
  };

  const availableFeatures = getFeaturesToUse();

  return {
    selectedCategory,
    selectedNeighborhoods,
    selectedFeatures,
    rangeFilters,
    sortBy,
    filterModalVisible,
    activeFilterSection,
    setFilterModalVisible,
    setActiveFilterSection,
    getApiFilters,
    applyFilters,
    handleCategorySelect,
    handleNeighborhoodToggle,
    handleFeatureToggle,
    handleRangeFilterChange,
    handleSortChange,
    handleResetAll,
    hasActiveFilters,
    getSortDisplayText,
    availableFeatures,
  };
};