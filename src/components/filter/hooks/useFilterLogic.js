import { useState, useEffect } from 'react';
import { rangeFilterFields, features, neighborhoods } from '../data/filterData';

export const useFilterLogic = (data, onFilteredDataChange, initialCategory = null) => {
  // State
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [rangeFilters, setRangeFilters] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilterSection, setActiveFilterSection] = useState('main');

  // Sync selectedCategory when initialCategory changes
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Initialize range filters
  useEffect(() => {
    const initialRangeFilters = rangeFilterFields.map((field) => ({
      ...field,
      low: '',
      high: '',
    }));
    setRangeFilters(initialRangeFilters);
  }, []);

  // Apply filters when dependencies change
  useEffect(() => {
    const filtered = applyFilters();
    const sorted = sortData(filtered);
    onFilteredDataChange(sorted);
  }, [data, selectedCategory, selectedNeighborhoods, selectedFeatures, rangeFilters, sortBy]);

  const applyFilters = () => {
    return data.filter((item) => {
      // Category filter
      if (selectedCategory && parseInt(item.category_id) !== selectedCategory.id) {
        return false;
      }

      // Neighborhood filter
      if (selectedNeighborhoods.length > 0) {
        const itemNeighborhoodId = parseInt(item.neighborhood_id);
        if (!selectedNeighborhoods.some((nb) => nb.id === itemNeighborhoodId)) {
          return false;
        }
      }

      // Features filter
      if (selectedFeatures.length > 0) {
        try {
          const itemProperties = JSON.parse(item.json_properties || '[]');
          const hasAllFeatures = selectedFeatures.every((feature) =>
            itemProperties.some(
              (prop) => prop.name === feature.value && prop.kind === 2
            )
          );
          if (!hasAllFeatures) {
            return false;
          }
        } catch (e) {
          return false;
        }
      }

      // Range filters
      if (!passesRangeFilters(item)) {
        return false;
      }

      return true;
    });
  };

  const passesRangeFilters = (item) => {
    try {
      const itemProperties = JSON.parse(item.json_properties || '[]');

      const hasActiveRangeFilters = rangeFilters.some(
        (filter) => filter.low !== '' || filter.high !== ''
      );

      if (!hasActiveRangeFilters) {
        return true;
      }

      return rangeFilters.every((filter) => {
        if (filter.low === '' && filter.high === '') {
          return true;
        }

        const itemProp = itemProperties.find(
          (prop) =>
            prop.name === filter.value || prop.name.includes(filter.value)
        );

        if (!itemProp) {
          return false;
        }

        let itemValue;
        try {
          itemValue = parseFloat(itemProp.value);
          if (isNaN(itemValue)) {
            const numMatch = itemProp.value.match(/\d+/);
            itemValue = numMatch ? parseFloat(numMatch[0]) : NaN;
          }
        } catch (e) {
          return false;
        }

        if (isNaN(itemValue)) {
          return false;
        }

        const lowerBoundOK =
          filter.low === '' || itemValue >= parseFloat(filter.low);

        const upperBoundOK =
          filter.high === '' || itemValue <= parseFloat(filter.high);

        return lowerBoundOK && upperBoundOK;
      });
    } catch (e) {
      return false;
    }
  };

  const sortData = (dataToSort) => {
    if (!dataToSort.length) return dataToSort;

    const dataCopy = [...dataToSort];

    switch (sortBy) {
      case 'newest':
        return dataCopy.sort(
          (a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0)
        );
      case 'oldest':
        return dataCopy.sort(
          (a, b) => new Date(a.updated_at || 0) - new Date(b.updated_at || 0)
        );
      case 'most_viewed':
        return dataCopy.sort(
          (a, b) =>
            (parseInt(b.total_view) || 0) - (parseInt(a.total_view) || 0)
        );
      default:
        return dataCopy;
    }
  };

  // Event handlers
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setActiveFilterSection('main');
  };

  const handleNeighborhoodToggle = (neighborhood) => {
    setSelectedNeighborhoods((prev) =>
      prev.some((n) => n.id === neighborhood.id)
        ? prev.filter((n) => n.id !== neighborhood.id)
        : [...prev, neighborhood]
    );
  };

  const handleFeatureToggle = (feature) => {
    setSelectedFeatures((prev) =>
      prev.some((f) => f.value === feature.value)
        ? prev.filter((f) => f.value !== feature.value)
        : [...prev, feature]
    );
  };

  const handleRangeFilterChange = (fieldId, type, value) => {
    setRangeFilters((prev) =>
      prev.map((f) =>
        f.id === fieldId
          ? {
              ...f,
              [type]: value === '' ? '' : parseFloat(value) || '',
            }
          : f
      )
    );
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleResetAll = () => {
  // Don't reset selectedCategory - keep it fixed
  setSelectedNeighborhoods([]);
  setSelectedFeatures([]);
  setRangeFilters(
    rangeFilterFields.map((field) => ({
      ...field,
      low: '',
      high: '',
    }))
  );
  setSortBy('newest');
};

  const getSortDisplayText = () => {
    const sortTexts = {
      newest: 'جدیدترین',
      oldest: 'قدیمی ترین',
      most_viewed: 'پر بازدید ترین',
    };
    return sortTexts[sortBy] || 'مرتب‌سازی';
  };

  

  const hasActiveFilters = () => {
  return selectedNeighborhoods.length > 0 ||
    selectedFeatures.length > 0 ||
    rangeFilters.some((filter) => filter.low !== '' || filter.high !== '') ||
    sortBy !== 'newest';
  // Removed: selectedCategory from the check
};

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
    handleCategorySelect,
    handleNeighborhoodToggle,
    handleFeatureToggle,
    handleRangeFilterChange,
    handleResetAll,
    handleSortChange,
    applyFilters,
    hasActiveFilters,
    getSortDisplayText,
    features,
    neighborhoods,
    rangeFilterFields
  };
};