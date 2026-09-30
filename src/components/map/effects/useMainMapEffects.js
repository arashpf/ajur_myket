// effects/useMainMapEffects.js
import React, { useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const useMainMapEffects = ({
  route,
  mapState,
  mapData,
  mapFilters,
  mapLocation,
  mapNavigation,
  set_isHintModalVisible,
  setShowGuide,
  set_filter_level,
  set_filter_selectedCategoryegory_name,
  handleCategoryPress
}) => {
  // Update filtered workers ref
  useEffect(() => {
    mapState.filteredWorkersRef.current = mapFilters.filtered_workers;
  }, [mapFilters.filtered_workers]);

  // Initial load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        mapData.set_loading(true);
        
        const categoriesResponse = await axios.get('https://api.ajur.app/api/sub-category');
        mapData.set_cats(categoriesResponse.data);

        const initialCategory = route?.params?.mapFilters?.category || categoriesResponse.data[0];
        mapFilters.setSelectedCategory(initialCategory);

        mapLocation.grabUserLocation((latitude, longitude) => {
          mapData.fetchWorkersByCategory(initialCategory.id);
        });

        if (!mapLocation.hasLocationPermission) {
          mapData.fetchWorkersByCategory(initialCategory.id);
        }
      } catch (error) {
        console.error('Initial load error:', error);
        mapData.setErrorModalVisible(true);
      } finally {
        mapData.set_loading(false);
      }
    };

    loadInitialData();
  }, []);

  // Load category fields when category changes
  useEffect(() => {
    if (mapFilters.selectedCategory) {
      mapData.fetchCategoryFields(mapFilters.selectedCategory.id)
        .then(fields => {
          mapFilters.set_normal_fields(fields.normal_fields);
          mapFilters.set_tick_fields(fields.tick_fields);
          mapFilters.set_predefine_fields(fields.predefine_fields);
        });
      moveMapSlightly();
    }
  }, [mapFilters.selectedCategory]);

  // Guide overlay on first load
  useEffect(() => {
    const checkFirstTime = async () => {
      const hasSeenModal = await AsyncStorage.getItem('hasSeenMapModal');
      if (!hasSeenModal || hasSeenModal == 'false') {
        set_isHintModalVisible(true);
        setShowGuide(true);
        await AsyncStorage.setItem('hasSeenMapModal', 'true');
      }
    };
    checkFirstTime();
  }, []);

    const moveMapSlightly = () => {
    if (mapState.mapRef.current && mapState.userLat) {
      mapState.mapRef.current.animateCamera(
        {
          center: {
            latitude: mapState.userLat + 0.0000001,
            longitude: mapState.userLong + 0.0000001,
          },
        },
        { duration: 1000 },
      );
    }
  };

  // Handle route parameters
  useEffect(() => {
    if (route.params?.mapFilters) {
      const { category, neighborhood } = route.params.mapFilters;
      
      if (category) {
        set_filter_level('base');
        set_filter_selectedCategoryegory_name(category.name);
        handleCategoryPress(category);
      }

      if (neighborhood) {
        const timer = setTimeout(() => {
          mapNavigation.flyToNeighborhood(mapState.mapRef, neighborhood);
        }, 500);
        
        return () => clearTimeout(timer);
      }
    }
  }, [route.params?.mapFilters]);
};