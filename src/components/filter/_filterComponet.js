import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FilterSlider from './components/FilterSlider';
import FilterModal from './components/FilterModal';
import { useServerFilterLogic } from './hooks/useServerFilterLogic';
import { filterApi } from './services/filterApi';

const FilterComponent = forwardRef(({ 
  onFilteredDataChange,
  availableCategories = [],
  availableNeighborhoods = [], // ADD THIS - neighborhoods data from parent
  initialCategory = null,
  userLocation = null,
  forceCategory = null,
  onBackToCategories = null,
  categoryFields = {},
  loadingFields = false,
  onCategoryChange = null,
  selectedCity = null,
}, ref) => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverData, setServerData] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 0,
    total_count: 0,
    has_next: false
  });

  // State for field values (tick, normal, predefine)
  const [fieldValues, setFieldValues] = useState({});
  const [activeFieldFilters, setActiveFieldFilters] = useState([]);

  // Function to compile ALL current filters
  // const compileAllFilters = () => {
  //   const baseFilters = getApiFilters ? getApiFilters() : {};
    
  //   console.log('🔍 Compiling filters - Selected neighborhoods:', selectedNeighborhoods?.length || 0);
    
  //   // Build complete filters object
  //   const allFilters = {
  //     ...baseFilters,
  //     category_id: selectedCategory?.id || null,
  //     city_id: selectedCity?.id || null,
  //   };
    
  //   // Add features if any
  //   if (selectedFeatures && selectedFeatures.length > 0) {
  //     allFilters.features = selectedFeatures.map(f => f.value).join(',');
  //   }
    
  //   // Add neighborhoods specifically (ensure it's included)
  //   if (selectedNeighborhoods && selectedNeighborhoods.length > 0) {
  //     const neighborhoodIds = selectedNeighborhoods.map(n => n.id).filter(id => id);
  //     if (neighborhoodIds.length > 0) {
  //       allFilters.neighborhood_ids = neighborhoodIds;
  //       console.log('📍 Adding neighborhoods to filters:', neighborhoodIds);
  //     }
  //   }
    
  //   // Add normal/range fields
  //   Object.entries(fieldValues).forEach(([fieldName, value]) => {
  //     if (typeof value === 'object') {
  //       // Range field with min/max
  //       if (value.min && value.min !== '' && value.min !== '0') {
  //         allFilters[`${fieldName}_min`] = value.min;
  //       }
  //       if (value.max && value.max !== '' && value.max !== '0') {
  //         allFilters[`${fieldName}_max`] = value.max;
  //       }
  //     } else if (value !== '' && value !== null && value !== undefined && value !== '0') {
  //       // Single value field
  //       allFilters[fieldName] = value;
  //     }
  //   });
    
  //   // Add range filters from useServerFilterLogic
  //   if (rangeFilters) {
  //     Object.entries(rangeFilters).forEach(([filterName, filterValue]) => {
  //       if (filterValue && (filterValue.low !== '' || filterValue.high !== '')) {
  //         if (filterValue.low !== '') {
  //           allFilters[`${filterName}_min`] = filterValue.low;
  //         }
  //         if (filterValue.high !== '') {
  //           allFilters[`${filterName}_max`] = filterValue.high;
  //         }
  //       }
  //     });
  //   }
    
  //   // Add sort
  //   if (sortBy && sortBy !== 'newest') {
  //     allFilters.sort_by = sortBy;
  //   }
    
  //   // Clean empty values
  //   Object.keys(allFilters).forEach(key => {
  //     if (allFilters[key] === null || 
  //         allFilters[key] === undefined || 
  //         allFilters[key] === '' ||
  //         (Array.isArray(allFilters[key]) && allFilters[key].length === 0)) {
  //       delete allFilters[key];
  //     }
  //   });
    
  //   // Add location if available
  //   if (userLocation?.lat && userLocation?.long) {
  //     allFilters.lat = userLocation.lat;
  //     allFilters.long = userLocation.long;
  //   }
    
  //   return allFilters;
  // };


  const compileAllFilters = () => {
    const baseFilters = getApiFilters ? getApiFilters() : {};
    
    const allFilters = {
      ...baseFilters,
      category_id: selectedCategory?.id || null,
      city_id: selectedCity?.id || null,
    };
    
    // Add features if any
    if (selectedFeatures && selectedFeatures.length > 0) {
      allFilters.features = selectedFeatures.map(f => f.value).join(',');
    }
    
    // CRITICAL FIX: Send neighborhoods as comma-separated string with parameter name 'neighborhoods'
    if (selectedNeighborhoods && selectedNeighborhoods.length > 0) {
      const neighborhoodIds = selectedNeighborhoods.map(n => n.id).filter(id => id);
      if (neighborhoodIds.length > 0) {
        // Use 'neighborhoods' (singular, no underscore) as comma-separated string
        allFilters.neighborhoods = neighborhoodIds.join(',');
        console.log('📍 Adding neighborhoods to API:', allFilters.neighborhoods);
      }
    }
    
    // Add normal/range fields
    Object.entries(fieldValues).forEach(([fieldName, value]) => {
      if (typeof value === 'object') {
        if (value.min && value.min !== '' && value.min !== '0') {
          allFilters[`${fieldName}_min`] = value.min;
        }
        if (value.max && value.max !== '' && value.max !== '0') {
          allFilters[`${fieldName}_max`] = value.max;
        }
      } else if (value !== '' && value !== null && value !== undefined && value !== '0') {
        allFilters[fieldName] = value;
      }
    });
    
    // Add range filters from useServerFilterLogic
    if (rangeFilters) {
      Object.entries(rangeFilters).forEach(([filterName, filterValue]) => {
        if (filterValue && (filterValue.low !== '' || filterValue.high !== '')) {
          if (filterValue.low !== '') {
            allFilters[`${filterName}_min`] = filterValue.low;
          }
          if (filterValue.high !== '') {
            allFilters[`${filterName}_max`] = filterValue.high;
          }
        }
      });
    }
    
    // Add sort
    if (sortBy && sortBy !== 'newest') {
      allFilters.sort_by = sortBy;
    }
    
    // Clean empty values
    Object.keys(allFilters).forEach(key => {
      if (allFilters[key] === null || 
          allFilters[key] === undefined || 
          allFilters[key] === '' ||
          (Array.isArray(allFilters[key]) && allFilters[key].length === 0)) {
        delete allFilters[key];
      }
    });
    
    // Add location if available
    if (userLocation?.lat && userLocation?.long) {
      allFilters.lat = userLocation.lat;
      allFilters.long = userLocation.long;
    }
    
    console.log('📦 Final compiled filters:', allFilters);
    return allFilters;
  };

  // Expose functions to parent via ref
  useImperativeHandle(ref, () => ({
    // Refresh data with current filters
    refreshData: (page = 1) => {
      console.log('🔄 FilterComponent refreshing data with current filters');
      const currentFilters = compileAllFilters();
      return handleServerFilterChange(currentFilters, page);
    },
    
    // Get current filters for loadMore
    getCurrentFilters: () => {
      return compileAllFilters();
    },
    
    // Get current pagination state
    getPagination: () => {
      return pagination;
    },
    
    // Load more data
    loadMoreData: () => {
      if (pagination.has_next && !isLoading) {
        const currentFilters = compileAllFilters();
        return handleServerFilterChange(currentFilters, pagination.current_page + 1);
      }
      return Promise.resolve();
    },
    
    // Check if has active filters
    hasActiveFilters: hasActiveFilters
  }));

  // Function to handle field value changes
  const handleFieldValueChange = (fieldSlug, value, fieldType, fieldName = '') => {
    console.log('📝 دریافت فیلتر از مودال:', {
      name: fieldName || fieldSlug,
      value: value,
      type: fieldType
    });
    
    // Update field values
    setFieldValues(prev => ({ 
      ...prev, 
      [fieldSlug]: value 
    }));

    // Update active filters display
    const isRangeValue = fieldType === 'normal_range' || (typeof value === 'object' && (value.min !== undefined || value.max !== undefined));
    
    if (isRangeValue) {
      const hasValue = (value.min && value.min !== '' && value.min !== '0') || 
                       (value.max && value.max !== '' && value.max !== '0');
      
      if (hasValue) {
        setActiveFieldFilters(prev => {
          const existingIndex = prev.findIndex(f => f.slug === fieldSlug);
          
          // Format the display text for range
          let displayText = '';
          if (value.min && value.min !== '' && value.min !== '0') {
            displayText += `از ${value.min}`;
          }
          if (value.max && value.max !== '' && value.max !== '0') {
            if (displayText) displayText += ' ';
            displayText += `تا ${value.max}`;
          }
          
          const fieldObj = {
            slug: fieldSlug,
            name: fieldName || findFieldNameBySlug(fieldSlug, fieldType),
            value: value,
            displayValue: displayText,
            type: fieldType,
            unit: findFieldUnitBySlug(fieldSlug, fieldType),
            isRange: true
          };
          
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = fieldObj;
            return updated;
          } else {
            return [...prev, fieldObj];
          }
        });
      } else {
        // Remove from active filters if no values
        setActiveFieldFilters(prev => 
          prev.filter(f => f.slug !== fieldSlug)
        );
      }
    } 
    // For regular single values (tick, predefine)
    else if (value !== '' && value !== null && value !== undefined && value !== '0') {
      setActiveFieldFilters(prev => {
        const existingIndex = prev.findIndex(f => f.slug === fieldSlug);
        
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = { 
            slug: fieldSlug, 
            name: fieldName || findFieldNameBySlug(fieldSlug, fieldType),
            value, 
            type: fieldType,
            unit: findFieldUnitBySlug(fieldSlug, fieldType),
            isRange: false
          };
          return updated;
        } else {
          return [...prev, { 
            slug: fieldSlug, 
            name: fieldName || findFieldNameBySlug(fieldSlug, fieldType),
            value, 
            type: fieldType,
            unit: findFieldUnitBySlug(fieldSlug, fieldType),
            isRange: false
          }];
        }
      });
    } else {
      // Remove from active filters if value is empty
      setActiveFieldFilters(prev => 
        prev.filter(f => f.slug !== fieldSlug)
      );
    }
  };

  // Helper to find field name by slug
  const findFieldNameBySlug = (slug, type) => {
    const fields = {
      normal: categoryFields.normal || [],
      tick: categoryFields.tick || [],
      predefine: categoryFields.predefine || []
    }[type] || [];
    
    const field = fields.find(f => f.slug === slug);
    return field?.name || field?.value || slug;
  };

  // Helper to find field unit by slug
  const findFieldUnitBySlug = (slug, type) => {
    const fields = {
      normal: categoryFields.normal || [],
      tick: categoryFields.tick || [],
      predefine: categoryFields.predefine || []
    }[type] || [];
    
    const field = fields.find(f => f.slug === slug);
    return field?.unit || '';
  };

  // Function to remove a field filter
  const handleFieldFilterRemove = (fieldSlug) => {
    console.log('🗑️ حذف فیلتر:', fieldSlug);
    
    setFieldValues(prev => {
      const updated = { ...prev };
      delete updated[fieldSlug];
      return updated;
    });
    
    setActiveFieldFilters(prev => 
      prev.filter(f => f.slug !== fieldSlug)
    );
  };

  // Wrapper for category selection with notification
  const handleCategorySelectWithNotification = (category) => {
    handleCategorySelect(category);
    if (onCategoryChange) onCategoryChange(category);
  };

  // Main API call function
  const handleServerFilterChange = async (filters, page = 1) => {
    try {
      setIsLoading(true);
  
      const allFilters = {
        lat: userLocation?.lat,
        long: userLocation?.long,
        page: page,
        per_page: 10,
        ...filters,
      };
  
      if (selectedCategory?.id) {
        allFilters.category_id = selectedCategory.id;
      }
  
      if (selectedCity?.id) {
        allFilters.city_id = selectedCity.id;
      }
  
      // CRITICAL FIX: Send neighborhoods as comma-separated string
      if (selectedNeighborhoods && selectedNeighborhoods.length > 0) {
        const neighborhoodIds = selectedNeighborhoods.map(n => n.id).filter(id => id);
        if (neighborhoodIds.length > 0) {
          allFilters.neighborhoods = neighborhoodIds.join(',');
          console.log('📍 In handleServerFilterChange - Adding neighborhoods:', allFilters.neighborhoods);
        }
      }
  
      // Add field values for server-side filtering
      Object.entries(fieldValues).forEach(([fieldName, value]) => {
        if (typeof value === 'object') {
          if (value.min && value.min !== '' && value.min !== '0') {
            allFilters[`${fieldName}_min`] = value.min;
          }
          if (value.max && value.max !== '' && value.max !== '0') {
            allFilters[`${fieldName}_max`] = value.max;
          }
        } else if (value !== '' && value !== null && value !== undefined && value !== '0') {
          allFilters[fieldName] = value;
        }
      });
  
      console.log('📤 ارسال فیلترها به سرور:', allFilters);

      // Make API call
      const response = await filterApi.getFilteredWorkers(allFilters);
      const workersData = response.workers || [];

      console.log('📥 پاسخ سرور:', {
        count: workersData.length,
        status: response.status,
        message: response.message
      });

      if (page === 1) {
        setServerData(workersData);
      } else {
        setServerData(prev => [...prev, ...workersData]);
      }

      const newPagination = {
        current_page: page,
        total_count: response.pagination?.total_count || workersData.length,
        has_next: response.pagination?.has_next || false,
        total_pages: response.pagination?.total_pages || 0,
        per_page: response.pagination?.per_page || 10
      };
      
      setPagination(newPagination);

      const allData = page === 1 ? workersData : [...serverData, ...workersData];
      onFilteredDataChange?.(allData, newPagination);

      setIsLoading(false);
      return { workers: workersData, pagination: newPagination };
    } catch (error) {
      console.error('Filter API error:', error);
      setIsLoading(false);
      onFilteredDataChange?.([], {
        current_page: 1,
        total_count: 0,
        has_next: false,
        total_pages: 0,
        per_page: 10
      });
      throw error;
    }
  };

  const {
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
    getApiFilters,
    applyFilters,
    hasActiveFilters,
    getSortDisplayText,
    availableFeatures,
  } = useServerFilterLogic(handleServerFilterChange, {
    dynamicTickFields: categoryFields.tick || [],
    initialCategory: initialCategory,
  });

  const openCategorySection = () => {
    setActiveFilterSection('categories');
    setFilterModalVisible(true);
  };

  // Add city to filters
  const addCityToFilters = (filters) => {
    if (selectedCity?.id) {
      filters.city_id = selectedCity.id;
    }
    return filters;
  };

  // Calculate active filters count including field values
  const calculateActiveFiltersCount = () => {
    let count = 0;
    
    if (selectedCategory) count += 1;
    if (selectedNeighborhoods?.length) count += selectedNeighborhoods.length;
    if (selectedFeatures?.length) count += selectedFeatures.length;
    
    // Count active field filters (excluding empty or '0' values)
    Object.entries(fieldValues).forEach(([slug, value]) => { 
      if (typeof value === 'object') {
        // For range fields, count if either min or max has value
        if ((value.min && value.min !== '' && value.min !== '0') || 
            (value.max && value.max !== '' && value.max !== '0')) {
          count += 1;
        }
      } else if (value !== '' && value !== null && value !== undefined && value !== '0') {
        count += 1;
      }
    });
    
    if (rangeFilters) {
      Object.values(rangeFilters).forEach(f => {
        if (f && (f.min !== f.initialMin || f.max !== f.initialMax)) count += 1;
      });
    }
    
    if (sortBy && sortBy !== 'newest') count += 1;
    
    return count;
  };

  // Load initial data
  useEffect(() => {
    if (userLocation?.lat && userLocation?.long) {
      let initialFilters = getApiFilters();

      if (initialCategory?.id) {
        initialFilters.category_id = initialCategory.id;
      }

      initialFilters = addCityToFilters(initialFilters);
      handleServerFilterChange(initialFilters, 1);
    }
  }, [userLocation?.lat, userLocation?.long]);

  // When initialCategory changes
  useEffect(() => {
    if (initialCategory?.id) {
      handleCategorySelect(initialCategory);

      if (userLocation?.lat && userLocation?.long) {
        let filters = getApiFilters();
        filters.category_id = initialCategory.id;
        filters = addCityToFilters(filters);
        handleServerFilterChange(filters, 1);
      }
    }
  }, [initialCategory]);

  // When forceCategory changes
  useEffect(() => {
    if (forceCategory?.id) {
      handleCategorySelect(forceCategory);
    }
  }, [forceCategory]);

  // When internal category changes
  useEffect(() => {
    if (selectedCategory?.id) {
      let filters = getApiFilters();
      filters = addCityToFilters(filters);
      handleServerFilterChange(filters, 1);
    }
  }, [selectedCategory]);

  // When field values change, apply filters
  useEffect(() => {
    if (userLocation?.lat && userLocation?.long) {
      console.log('🔄 فیلترهای فیلد تغییر کردند:', fieldValues);
      
      let filters = getApiFilters();
      filters = addCityToFilters(filters);
      handleServerFilterChange(filters, 1);
    }
  }, [fieldValues]);

  // When neighborhoods change, apply filters (add this new useEffect)
  useEffect(() => {
    if (userLocation?.lat && userLocation?.long && selectedNeighborhoods) {
      console.log('🏘️ Neighborhoods changed:', selectedNeighborhoods.length);
      
      let filters = getApiFilters();
      filters = addCityToFilters(filters);
      handleServerFilterChange(filters, 1);
    }
  }, [selectedNeighborhoods]);

  // Apply filters after closing modal
  const handleApplyFilters = () => {
    console.log('🟢 اعمال فیلترها و بستن مودال');
    
    setFilterModalVisible(false);
    let filters = { ...getApiFilters() };
    filters = addCityToFilters(filters);
    handleServerFilterChange(filters, 1);
  };

  const handleModalClose = () => {
    console.log('🟡 بستن مودال');
    handleApplyFilters();
  };

  // Reset all filters
  const handleReset = () => {
    console.log('♻️ بازنشانی همه فیلترها');
    
    setServerData([]);
    setPagination({ current_page: 1, total_count: 0, has_next: false, total_pages: 0 });
    setFieldValues({});
    setActiveFieldFilters([]);
    handleResetAll();
  };

  // Remove category
  const handleCategoryRemove = () => {
    if (!forceCategory) {
      console.log('🗑️ حذف دسته‌بندی');
      handleCategorySelect(null);
      onCategoryChange?.(null);
      setFieldValues({});
      setActiveFieldFilters([]);
      setServerData([]);
      setPagination({ current_page: 1, total_count: 0, has_next: false, total_pages: 0 });
    }
  };

  return (
    <View style={styles.container}>
      {onBackToCategories && (
        <TouchableOpacity style={styles.backToCategoriesButton} onPress={onBackToCategories}>
          <Icon name="arrow-back" size={20} color="#b92a31" />
          <Text style={styles.backToCategoriesText}>بازگشت به دسته‌بندی‌ها</Text>
        </TouchableOpacity>
      )}

      <FilterSlider
        selectedCategory={selectedCategory}
        selectedNeighborhoods={selectedNeighborhoods}
        selectedFeatures={selectedFeatures}
        rangeFilters={rangeFilters}
        sortBy={sortBy}
        hasActiveFilters={hasActiveFilters}
        onFilterModalOpen={() => setFilterModalVisible(true)}
        onFilterModalOpenForCategory={openCategorySection}
        onCategoryRemove={handleCategoryRemove}
        onNeighborhoodRemove={handleNeighborhoodToggle}
        onFeatureRemove={handleFeatureToggle}
        onRangeFilterRemove={handleRangeFilterChange}
        onSortRemove={() => handleSortChange('newest')}
        onResetAll={handleReset}
        getSortDisplayText={getSortDisplayText}
        isCategoryLocked={!!forceCategory}
        activeFiltersCount={calculateActiveFiltersCount()}
        
        // Field-related props
        fieldValues={fieldValues}
        activeFieldFilters={activeFieldFilters}
        onFieldFilterRemove={handleFieldFilterRemove}
        categoryFields={categoryFields}
      />

      <FilterModal
        visible={filterModalVisible}
        activeSection={activeFilterSection}
        selectedCategory={selectedCategory}
        selectedNeighborhoods={selectedNeighborhoods}
        selectedFeatures={selectedFeatures}
        rangeFilters={rangeFilters}
        sortBy={sortBy}
        availableCategories={availableCategories}
        availableNeighborhoods={availableNeighborhoods} // ADD THIS - pass neighborhoods to modal
        onClose={handleModalClose}
        onSectionChange={setActiveFilterSection}
        onCategorySelect={handleCategorySelectWithNotification}
        onNeighborhoodToggle={handleNeighborhoodToggle}
        onFeatureToggle={handleFeatureToggle}
        onRangeFilterChange={handleRangeFilterChange}
        onSortChange={handleSortChange}
        onResetAll={handleReset}
        getSortDisplayText={getSortDisplayText}
        filteredCount={pagination.total_count}
        isLoading={isLoading}
        isCategoryLocked={!!forceCategory}
        categoryFields={categoryFields}
        loadingFields={loadingFields}
        onFieldValueChange={handleFieldValueChange}
        fieldValues={fieldValues}
        features={availableFeatures || []}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { position: 'relative' },
  backToCategoriesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 8,
  },
  backToCategoriesText: {
    color: '#b92a31',
    fontSize: 16,
    fontFamily: 'iransans',
    marginRight: 8,
  },
});

export default FilterComponent;