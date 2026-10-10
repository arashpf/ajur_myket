import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FilterSlider from './components/FilterSlider';
import FilterModal from './components/FilterModal';
import { useServerFilterLogic } from './hooks/useServerFilterLogic';
import { filterApi } from './services/filterApi';
import { trackEvent } from '../../lib/analytics/track';

const FilterComponent = forwardRef(({
  onFilteredDataChange,
  onSpecialItemChange,
  availableCategories = [],
  availableNeighborhoods = [],
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
  const [specialItem, setSpecialItem] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 0,
    total_count: 0,
    has_next: false
  });

  const [fieldValues, setFieldValues] = useState({});
  const [activeFieldFilters, setActiveFieldFilters] = useState([]);

  const [fieldModalVisible, setFieldModalVisible] = useState(false);
  const [selectedField, setSelectedField] = useState(null);

  const requestIdRef = useRef(0);
  const fieldValuesTimeoutRef = useRef(null);
  const categoryTimeoutRef = useRef(null);
  const neighborhoodTimeoutRef = useRef(null);

  // ─── Analytics: pending filter_apply flag ───
  const pendingFilterApplyRef = useRef(null);

  // ─── Analytics: debounce timer for firing filter_apply ───
  const filterApplyDebounceRef = useRef(null);
  const FILTER_APPLY_DEBOUNCE_MS = 600;

  const getRandomSpecialItem = (workers) => {
    if (!workers || workers.length === 0) return null;
    const specialWorkers = workers.filter(worker => worker.is_special === true);
    if (specialWorkers.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * specialWorkers.length);
    return specialWorkers[randomIndex];
  };

  const findFieldNameBySlug = (slug, type) => {
    const fields = {
      normal: categoryFields.normal || [],
      tick: categoryFields.tick || [],
      predefine: categoryFields.predefine || []
    }[type] || [];
    const field = fields.find(f => f.slug === slug);
    return field?.name || field?.value || slug;
  };

  const findFieldUnitBySlug = (slug, type) => {
    const fields = {
      normal: categoryFields.normal || [],
      tick: categoryFields.tick || [],
      predefine: categoryFields.predefine || []
    }[type] || [];
    const field = fields.find(f => f.slug === slug);
    return field?.unit || '';
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
    fieldValues: fieldValues,
  });

  const addCityToFilters = (filters) => {
    if (selectedCity?.id) {
      filters.city_id = selectedCity.id;
    }
    return filters;
  };

  const compileAllFilters = () => {
    const baseFilters = getApiFilters ? getApiFilters() : {};
    const allFilters = {
      ...baseFilters,
      category_id: selectedCategory?.id || null,
      city_id: selectedCity?.id || null,
    };
    if (selectedFeatures && selectedFeatures.length > 0) {
      allFilters.features = selectedFeatures.map(f => f.value).join(',');
    }
    if (selectedNeighborhoods && selectedNeighborhoods.length > 0) {
      const neighborhoodIds = selectedNeighborhoods.map(n => n.id).filter(id => id);
      if (neighborhoodIds.length > 0) {
        allFilters.neighborhoods = neighborhoodIds.join(',');
      }
    }
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
    if (sortBy && sortBy !== 'newest') {
      allFilters.sort_by = sortBy;
    }
    Object.keys(allFilters).forEach(key => {
      if (allFilters[key] === null ||
          allFilters[key] === undefined ||
          allFilters[key] === '' ||
          (Array.isArray(allFilters[key]) && allFilters[key].length === 0)) {
        delete allFilters[key];
      }
    });
    if (userLocation?.lat && userLocation?.long) {
      allFilters.lat = userLocation.lat;
      allFilters.long = userLocation.long;
    }
    return allFilters;
  };

  // ─── Analytics: build web-shaped filters snapshot ───
  const buildWebShapedFiltersSnapshot = (snap) => {
    const filters = {};
    const {
      fieldValues: fv = {},
      selectedNeighborhoods: ns = [],
      selectedFeatures: fs = [],
      rangeFilters: rf = [],
      sortBy: sb = 'newest',
    } = snap || {};

    if (ns && ns.length > 0) {
      const ids = ns
        .map(n => (n?.id != null ? String(n.id) : null))
        .filter(Boolean);
      if (ids.length > 0) filters.neighborhoods = ids;
    }

    if (fs && fs.length > 0) {
      const values = fs
        .map(f => f?.value ?? f?.name ?? null)
        .filter(Boolean);
      if (values.length > 0) filters.features = values;
    }

    if (sb && sb !== 'newest') {
      filters.sort_by = sb;
    }

    if (rf && rf.length > 0) {
      rf.forEach(f => {
        if (f.low !== '' && f.low !== '0' && f.low != null) {
          filters[`${f.id}_min`] = String(f.low);
        }
        if (f.high !== '' && f.high !== '0' && f.high != null) {
          filters[`${f.id}_max`] = String(f.high);
        }
      });
    }

    Object.entries(fv).forEach(([fieldName, value]) => {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        if (value.min && value.min !== '' && value.min !== '0') {
          filters[`${fieldName}_min`] = String(value.min);
        }
        if (value.max && value.max !== '' && value.max !== '0') {
          filters[`${fieldName}_max`] = String(value.max);
        }
      } else if (Array.isArray(value)) {
        if (value.length > 0) filters[fieldName] = value;
      } else if (value !== '' && value !== null && value !== undefined && value !== '0') {
        filters[fieldName] = value;
      }
    });

    return filters;
  };

  const fireFilterApplyEvent = ({
    isReset,
    resultCount,
    returnedCount,
    filtersSnapshot,
    citySlug,
    categorySlug,
  }) => {
    try {
      // Ensure object, not array, regardless of what the caller sent.
      const raw = filtersSnapshot;
      const analyticsFilters = (
        raw && typeof raw === 'object' && !Array.isArray(raw)
      ) ? raw : {};
  
      const filtersCount = Object.keys(analyticsFilters).length;
  
      // ─── Skip category-entry-only events ───
      // When a user just lands on a category (via the home modal) and hasn't
      // applied any additional filters, there's nothing to report — the
      // category is already in `category_slug`. Firing here would inflate
      // filter_apply counts and show is_reset:false on what is really a
      // "category open" action.
      //
      // We still fire when:
      //   - at least one filter is set (filtersCount > 0), or
      //   - the user explicitly reset filters (isReset === true)
      if (filtersCount === 0 && !isReset) {
        return;
      }
  
      trackEvent('filter_apply', {
        city_slug: citySlug ?? null,
        category_slug: categorySlug ?? null,
        filters: analyticsFilters,
        filters_count: filtersCount,
        results_count: resultCount ?? 0,
        returned_count: returnedCount ?? 0,
        has_neighborhoods: !!analyticsFilters.neighborhoods,
        has_features: !!analyticsFilters.features,
        has_sort: !!analyticsFilters.sort_by,
        is_reset: !!isReset,
      });
    } catch (err) {
      if (__DEV__) {
        console.warn('[analytics] filter_apply failed:', err?.message);
      }
    }
  };

  const scheduleFilterApply = (payload) => {
    if (filterApplyDebounceRef.current) {
      clearTimeout(filterApplyDebounceRef.current);
    }
    filterApplyDebounceRef.current = setTimeout(() => {
      filterApplyDebounceRef.current = null;
      fireFilterApplyEvent(payload);
    }, FILTER_APPLY_DEBOUNCE_MS);
  };

  useImperativeHandle(ref, () => ({
    refreshData: (page = 1) => {
      const currentFilters = compileAllFilters();
      return handleServerFilterChange(currentFilters, page);
    },
    getCurrentFilters: () => compileAllFilters(),
    getPagination: () => pagination,
    loadMoreData: () => {
      if (pagination.has_next && !isLoading) {
        const currentFilters = compileAllFilters();
        return handleServerFilterChange(currentFilters, pagination.current_page + 1);
      }
      return Promise.resolve();
    },
    hasActiveFilters: hasActiveFilters,
    clearNeighborhoods: () => {
      if (selectedNeighborhoods && selectedNeighborhoods.length > 0) {
        const neighborhoodsToRemove = [...selectedNeighborhoods];
        neighborhoodsToRemove.forEach(neigh => {
          handleNeighborhoodToggle(neigh);
        });
        ToastAndroid.show('محله‌ها پاک شدند', ToastAndroid.SHORT);
      }
    },
    setSelectedNeighborhood: async (neighborhood) => {
      if (!neighborhood) return false;
      await new Promise(resolve => setTimeout(resolve, 100));
      if (!availableNeighborhoods || availableNeighborhoods.length === 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      const matchedNeighborhood = availableNeighborhoods.find(
        n => n.id === neighborhood.id || n.name === neighborhood.name
      );
      if (!matchedNeighborhood) return false;
      const isAlreadySelected = selectedNeighborhoods?.some(
        n => n.id === matchedNeighborhood.id
      );
      if (isAlreadySelected) return true;
      if (selectedNeighborhoods && selectedNeighborhoods.length > 0) {
        const neighborhoodsToClear = [...selectedNeighborhoods];
        for (const neigh of neighborhoodsToClear) {
          handleNeighborhoodToggle(neigh);
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      handleNeighborhoodToggle(matchedNeighborhood);
      ToastAndroid.show(`محله ${matchedNeighborhood.name} انتخاب شد`, ToastAndroid.SHORT);
      return true;
    },
  }));

  const handleFieldPress = (field) => {
    setSelectedField(field);
    setFieldModalVisible(true);
  };

  // ─── Single-field modal: user applies a value ───
  const handleFieldApplyFromModal = (slug, value, type, name) => {
    // ─── Analytics: mark this as user-caused ───
    pendingFilterApplyRef.current = { isReset: false };

    setFieldValues(prev => ({ ...prev, [slug]: value }));
    let hasValue = false;
    if (type === '2') {
      hasValue = Array.isArray(value) && value.length > 0;
    } else if (typeof value === 'object') {
      hasValue = (value.min && value.min !== '' && value.min !== '0') ||
                 (value.max && value.max !== '' && value.max !== '0');
    } else {
      hasValue = value && value !== '' && value !== '0';
    }
    if (hasValue) {
      setActiveFieldFilters(prev => {
        const existingIndex = prev.findIndex(f => f.slug === slug);
        const fieldObj = {
          slug: slug,
          name: name,
          value: value,
          type: type,
          unit: findFieldUnitBySlug(slug, type),
          isRange: typeof value === 'object' && !Array.isArray(value),
          isTick: type === '2',
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
      setActiveFieldFilters(prev => prev.filter(f => f.slug !== slug));
    }
    if (userLocation?.lat && userLocation?.long) {
      setTimeout(() => {
        let filters = getApiFilters();
        filters = addCityToFilters(filters);
        handleServerFilterChange(filters, 1);
      }, 100);
    }
  };

  // ─── Single-field modal: user removes a value ───
  const handleFieldRemoveFromModal = (slug) => {
    // ─── Analytics: mark this as user-caused ───
    pendingFilterApplyRef.current = { isReset: false };

    setFieldValues(prev => {
      const updated = { ...prev };
      delete updated[slug];
      return updated;
    });
    setActiveFieldFilters(prev => prev.filter(f => f.slug !== slug));
    if (userLocation?.lat && userLocation?.long) {
      setTimeout(() => {
        let filters = getApiFilters();
        filters = addCityToFilters(filters);
        handleServerFilterChange(filters, 1);
      }, 100);
    }
  };

  // ─── Main modal: user changes a field value ───
  const handleFieldValueChange = (fieldSlug, value, fieldType, fieldName = '') => {
    // ─── Analytics: mark this as user-caused ───
    pendingFilterApplyRef.current = { isReset: false };

    setFieldValues(prev => ({ ...prev, [fieldSlug]: value }));
    const isRangeValue = fieldType === 'normal_range' || (typeof value === 'object' && (value.min !== undefined || value.max !== undefined));
    if (isRangeValue) {
      const hasValue = (value.min && value.min !== '' && value.min !== '0') ||
                       (value.max && value.max !== '' && value.max !== '0');
      if (hasValue) {
        setActiveFieldFilters(prev => {
          const existingIndex = prev.findIndex(f => f.slug === fieldSlug);
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
        setActiveFieldFilters(prev => prev.filter(f => f.slug !== fieldSlug));
      }
    }
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
      setActiveFieldFilters(prev => prev.filter(f => f.slug !== fieldSlug));
    }
  };

  // ─── Main modal: user removes a field filter chip ───
  const handleFieldFilterRemove = (fieldSlug) => {
    // ─── Analytics: mark this as user-caused ───
    pendingFilterApplyRef.current = { isReset: false };

    const currentFieldValues = { ...fieldValues };
    delete currentFieldValues[fieldSlug];
    setFieldValues(currentFieldValues);
    setActiveFieldFilters(prev => prev.filter(f => f.slug !== fieldSlug));
    if (userLocation?.lat && userLocation?.long) {
      let filters = getApiFilters();
      filters = addCityToFilters(filters);
      Object.entries(currentFieldValues).forEach(([fieldName, value]) => {
        if (typeof value === 'object') {
          if (value.min && value.min !== '' && value.min !== '0') {
            filters[`${fieldName}_min`] = value.min;
          }
          if (value.max && value.max !== '' && value.max !== '0') {
            filters[`${fieldName}_max`] = value.max;
          }
        } else if (value !== '' && value !== null && value !== undefined && value !== '0') {
          filters[fieldName] = value;
        }
      });
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
      if (sortBy && sortBy !== 'newest') {
        filters.sort_by = sortBy;
      }
      handleServerFilterChange(filters, 1);
    }
  };

  const handleCategorySelectWithNotification = (category) => {
    pendingFilterApplyRef.current = { isReset: false };
    setFieldValues({});
    setActiveFieldFilters([]);
    handleCategorySelect(category);
    if (onCategoryChange) onCategoryChange(category);
  };

  const handleServerFilterChange = async (filters, page = 1) => {
    const currentRequestId = ++requestIdRef.current;
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
      if (selectedNeighborhoods && selectedNeighborhoods.length > 0) {
        const neighborhoodIds = selectedNeighborhoods.map(n => n.id).filter(id => id);
        if (neighborhoodIds.length > 0) {
          allFilters.neighborhoods = neighborhoodIds.join(',');
        }
      }
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
      if (rangeFilters && rangeFilters.length > 0) {
        rangeFilters.forEach(filter => {
          if (filter.low && filter.low !== '' && filter.low !== '0') {
            allFilters[`${filter.id}_min`] = filter.low;
          }
          if (filter.high && filter.high !== '' && filter.high !== '0') {
            allFilters[`${filter.id}_max`] = filter.high;
          }
        });
      }

      // ─── Analytics: snapshot of filter state AT FETCH TIME ───
      const fetchTimeSnapshot = {
        fieldValues: { ...fieldValues },
        selectedNeighborhoods: selectedNeighborhoods ? [...selectedNeighborhoods] : [],
        selectedFeatures: selectedFeatures ? [...selectedFeatures] : [],
        rangeFilters: rangeFilters ? [...rangeFilters] : [],
        sortBy: sortBy,
      };
      const filtersSnapshot = buildWebShapedFiltersSnapshot(fetchTimeSnapshot);
      const snapshotCitySlug = selectedCity?.slug ?? null;
      const snapshotCategorySlug =
        selectedCategory?.slug ??
        selectedCategory?.eng_name ??
        null;

      const response = await filterApi.getFilteredWorkers(allFilters);
      if (currentRequestId !== requestIdRef.current) {
        return;
      }
      const workersData = response.workers || [];
      if (page === 1) {
        setServerData(workersData);
        const randomSpecial = getRandomSpecialItem(workersData);
        setSpecialItem(randomSpecial);
        if (onSpecialItemChange) {
          onSpecialItemChange(randomSpecial);
        }
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

      // ─── Analytics: consume flag + schedule debounced fire ───
      if (page === 1 && pendingFilterApplyRef.current) {
        const { isReset } = pendingFilterApplyRef.current;
        pendingFilterApplyRef.current = null;
        scheduleFilterApply({
          isReset,
          resultCount: newPagination.total_count,
          returnedCount: workersData.length,
          filtersSnapshot,
          citySlug: snapshotCitySlug,
          categorySlug: snapshotCategorySlug,
        });
      }

      setIsLoading(false);
      return { workers: workersData, pagination: newPagination };
    } catch (error) {
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

  const openCategorySection = () => {
    setActiveFilterSection('categories');
    setFilterModalVisible(true);
  };

  const calculateActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategory) count += 1;
    if (selectedNeighborhoods?.length) count += selectedNeighborhoods.length;
    if (selectedFeatures?.length) count += selectedFeatures.length;
    Object.entries(fieldValues).forEach(([slug, value]) => {
      if (typeof value === 'object') {
        if ((value.min && value.min !== '' && value.min !== '0') ||
            (value.max && value.max !== '' && value.max !== '0')) {
          count += 1;
        }
      } else if (value !== '' && value !== null && value !== undefined && value !== '0') {
        count += 1;
      }
    });
    if (rangeFilters && rangeFilters.length > 0) {
      rangeFilters.forEach(filter => {
        if ((filter.low && filter.low !== '' && filter.low !== '0') ||
            (filter.high && filter.high !== '' && filter.high !== '0')) {
          count += 1;
        }
      });
    }
    if (sortBy && sortBy !== 'newest') count += 1;
    return count;
  };

  // ─── Initial mount: do NOT set the flag — this is not user-caused ───
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

  // ─── Parent-driven category change (from home): user-caused ───
  useEffect(() => {
    if (initialCategory?.id) {
      handleCategorySelect(initialCategory);
      if (userLocation?.lat && userLocation?.long) {
        pendingFilterApplyRef.current = { isReset: false };
        let filters = getApiFilters();
        filters.category_id = initialCategory.id;
        filters = addCityToFilters(filters);
        handleServerFilterChange(filters, 1);
      }
    }
  }, [initialCategory]);

  useEffect(() => {
    if (forceCategory?.id) {
      handleCategorySelect(forceCategory);
    }
  }, [forceCategory]);

  // ─── Internal category change (from FilterModal category picker) ───
  // The handler `handleCategorySelectWithNotification` sets the flag.
  // This effect only fires the fetch — the flag is already set.
  useEffect(() => {
    if (selectedCategory?.id) {
      setFieldValues({});
      setActiveFieldFilters([]);
      if (categoryTimeoutRef.current) {
        clearTimeout(categoryTimeoutRef.current);
      }
      categoryTimeoutRef.current = setTimeout(() => {
        let filters = getApiFilters();
        filters = addCityToFilters(filters);
        handleServerFilterChange(filters, 1);
      }, 100);
    }
    return () => {
      if (categoryTimeoutRef.current) {
        clearTimeout(categoryTimeoutRef.current);
      }
    };
  }, [selectedCategory]);

  // ─── Field values: the handler sets the flag, this effect runs the fetch ───
  useEffect(() => {
    if (userLocation?.lat && userLocation?.long) {
      if (fieldValuesTimeoutRef.current) {
        clearTimeout(fieldValuesTimeoutRef.current);
      }
      fieldValuesTimeoutRef.current = setTimeout(() => {
        let filters = getApiFilters();
        filters = addCityToFilters(filters);
        Object.entries(fieldValues).forEach(([fieldName, value]) => {
          if (typeof value === 'object') {
            if (value.min && value.min !== '' && value.min !== '0') {
              filters[`${fieldName}_min`] = value.min;
            }
            if (value.max && value.max !== '' && value.max !== '0') {
              filters[`${fieldName}_max`] = value.max;
            }
          } else if (value !== '' && value !== null && value !== undefined && value !== '0') {
            filters[fieldName] = value;
          }
        });
        handleServerFilterChange(filters, 1);
      }, 300);
    }
    return () => {
      if (fieldValuesTimeoutRef.current) {
        clearTimeout(fieldValuesTimeoutRef.current);
      }
    };
  }, [fieldValues]);

  // ─── Neighborhoods: the handler sets the flag, this effect runs the fetch ───
  useEffect(() => {
    if (userLocation?.lat && userLocation?.long && selectedNeighborhoods) {
      if (neighborhoodTimeoutRef.current) {
        clearTimeout(neighborhoodTimeoutRef.current);
      }
      neighborhoodTimeoutRef.current = setTimeout(() => {
        let filters = getApiFilters();
        filters = addCityToFilters(filters);
        handleServerFilterChange(filters, 1);
      }, 200);
    }
    return () => {
      if (neighborhoodTimeoutRef.current) {
        clearTimeout(neighborhoodTimeoutRef.current);
      }
    };
  }, [selectedNeighborhoods]);

  const handleApplyFilters = () => {
    pendingFilterApplyRef.current = { isReset: false };
    setFilterModalVisible(false);
    let filters = { ...getApiFilters() };
    filters = addCityToFilters(filters);
    handleServerFilterChange(filters, 1);
  };

  const handleModalClose = () => {
    handleApplyFilters();
  };

  const handleReset = () => {
    pendingFilterApplyRef.current = { isReset: true };
    setServerData([]);
    setSpecialItem(null);
    setPagination({ current_page: 1, total_count: 0, has_next: false, total_pages: 0 });
    setFieldValues({});
    setActiveFieldFilters([]);
    handleResetAll();
    if (onSpecialItemChange) {
      onSpecialItemChange(null);
    }
  };

  const handleCategoryRemove = () => {
    if (!forceCategory) {
      handleCategorySelect(null);
      onCategoryChange?.(null);
      setFieldValues({});
      setActiveFieldFilters([]);
      setServerData([]);
      setSpecialItem(null);
      setPagination({ current_page: 1, total_count: 0, has_next: false, total_pages: 0 });
      if (onSpecialItemChange) {
        onSpecialItemChange(null);
      }
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
        onCategoryRemove={() => {
          pendingFilterApplyRef.current = { isReset: false };
          handleCategoryRemove();
        }}
        onNeighborhoodRemove={n => {
          pendingFilterApplyRef.current = { isReset: false };
          handleNeighborhoodToggle(n);
        }}
        onFeatureRemove={f => {
          pendingFilterApplyRef.current = { isReset: false };
          handleFeatureToggle(f);
        }}
        onRangeFilterRemove={(id, side, val) => {
          pendingFilterApplyRef.current = { isReset: false };
          handleRangeFilterChange(id, side, val);
        }}
        onSortRemove={() => {
          pendingFilterApplyRef.current = { isReset: false };
          handleSortChange('newest');
        }}
        onResetAll={handleReset}
        getSortDisplayText={getSortDisplayText}
        isCategoryLocked={!!forceCategory}
        activeFiltersCount={calculateActiveFiltersCount()}
        fieldValues={fieldValues}
        activeFieldFilters={activeFieldFilters}
        onFieldFilterRemove={(slug) => {
          pendingFilterApplyRef.current = { isReset: false };
          handleFieldFilterRemove(slug);
        }}
        categoryFields={categoryFields}
        onFieldFilterPress={handleFieldPress}
        onNeighborhoodPress={() => {
          setActiveFilterSection('neighborhoods');
          setFilterModalVisible(true);
        }}
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
        availableNeighborhoods={availableNeighborhoods}
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
        isSingleFieldMode={false}
      />

      <FilterModal
        visible={fieldModalVisible}
        activeSection="fields"
        selectedCategory={selectedCategory}
        selectedNeighborhoods={selectedNeighborhoods}
        selectedFeatures={selectedFeatures}
        rangeFilters={rangeFilters}
        sortBy={sortBy}
        availableCategories={availableCategories}
        availableNeighborhoods={availableNeighborhoods}
        onClose={() => setFieldModalVisible(false)}
        onSectionChange={() => {}}
        onCategorySelect={() => {}}
        onNeighborhoodToggle={() => {}}
        onFeatureToggle={() => {}}
        onRangeFilterChange={() => {}}
        onSortChange={() => {}}
        onResetAll={() => {}}
        getSortDisplayText={getSortDisplayText}
        filteredCount={pagination.total_count}
        isLoading={isLoading}
        isCategoryLocked={true}
        categoryFields={categoryFields}
        loadingFields={loadingFields}
        onFieldValueChange={handleFieldApplyFromModal}
        fieldValues={fieldValues}
        features={availableFeatures || []}
        isSingleFieldMode={true}
        singleField={selectedField}
        onFieldRemove={handleFieldRemoveFromModal}
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