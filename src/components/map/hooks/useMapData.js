import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useMapData = (selectedCategory, userLat, userLong) => {
  const [workers, set_workers] = useState([]);
  const [loading, set_loading] = useState(false);
  const [loading2, set_loading2] = useState(false);
  const [cats, set_cats] = useState([]);
  const [specials, set_specials] = useState([]);
  const [uppers, set_uppers] = useState([]);
  const [boxStatus, set_boxStatus] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const fetchWorkersByCategory = useCallback(async (catId) => {
    try {
      set_loading(true);
      const response = await axios.get('https://api.ajur.app/api/category-workers/', {
        params: {
          catid: catId,
          lat: userLat,
          long: userLong,
        },
      });

      set_workers(response.data.workers);
      set_uppers(response.data.uppers);
      set_specials(response.data.specials);
      set_boxStatus(true);
    } catch (error) {
      console.error('Error fetching workers:', error);
      setErrorModalVisible(true);
    } finally {
      set_loading(false);
    }
  }, [userLat, userLong]);

  const fetchCategoryFields = useCallback(async (categoryId) => {
    try {
      const response = await axios.get('https://api.ajur.app/api/category-fields', {
        params: { cat: categoryId },
      });
      
      return {
        normal_fields: response.data.normal_fields,
        tick_fields: response.data.tick_fields,
        predefine_fields: response.data.predefine_fields
      };
    } catch (error) {
      console.error('Error fetching category fields:', error);
      setErrorModalVisible(true);
      return { normal_fields: [], tick_fields: [], predefine_fields: [] };
    }
  }, []);

  const loadInitialData = useCallback(async () => {
    try {
      set_loading(true);
      
      // Load categories
      const categoriesResponse = await axios.get('https://api.ajur.app/api/sub-category');
      set_cats(categoriesResponse.data);

      // Load category fields if category exists
      if (selectedCategory) {
        const fields = await fetchCategoryFields(selectedCategory.id);
        // These would be set by the parent component
      }
    } catch (error) {
      console.error('Initial load error:', error);
      setErrorModalVisible(true);
    } finally {
      set_loading(false);
    }
  }, [selectedCategory, fetchCategoryFields]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return {
    // State
    workers,
    loading,
    loading2,
    cats,
    specials,
    uppers,
    boxStatus,
    errorModalVisible,

    // Setters
    set_workers,
    set_loading,
    set_loading2,
    set_cats,
    set_specials,
    set_uppers,
    set_boxStatus,
    setErrorModalVisible,

    // Functions
    fetchWorkersByCategory,
    fetchCategoryFields,
    loadInitialData
  };
};

export default useMapData;