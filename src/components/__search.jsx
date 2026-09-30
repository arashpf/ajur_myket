import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Dimensions,
  StatusBar,
  BackHandler,
  Alert,
  ToastAndroid,
  AppState,
  Animated,
  Modal,
  PanResponder
} from 'react-native';

import {
  NativeBaseProvider,
  HStack,
  Center,
  Avatar,
  VStack,
  Left,
  Body,
  Right,
  Heading,
  Box,
  Divider,
  Button,
} from 'native-base';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

import Icon from 'react-native-vector-icons/Ionicons';
import WorkerCard from './cards/WorkerCard';
import RealEstateCard from './cards/RealEstateCard';
import MainCatCard from "./cards/MainCatCard";
import SubCatCard from "./cards/SubCatCard";
import BaseErrorModal from '../components/modals/BaseErrorModal';

import SearchBars from '../components/search/SearchBars';
import NewWorkerFab from '../components/fabs/NewWorkerFab';

import FilterComponent from './filter/FilterComponent';

import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Spinner from 'react-native-spinkit';
import NetInfo from '@react-native-community/netinfo';

const Search = ({navigation}) => {
  const [loading, set_loading] = useState(true);
  const [userInitialLat, set_userInitialLat] = useState(null);
  const [userInitialLong, set_userInitialLong] = useState(null);
  const [title1, set_title1] = useState('');
  const [title2, set_title2] = useState('');
  const [title3, set_title3] = useState('');
  const [collection1, set_collection1] = useState([]);
  const [collection2, set_collection2] = useState([]);
  const [collection3, set_collection3] = useState([]);
  const [realstates, set_realstates] = useState([]);
  const [net_connect_status, set_net_connect_status] = useState(true);
  const [main_cats, set_main_cats] = useState([]);
  const [sub_cats, set_sub_cats] = useState([]);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [showReleaseNote, setShowReleaseNote] = useState(false);
  const [appVersion, setAppVersion] = useState('');
  const [usingFallbackLocation, setUsingFallbackLocation] = useState(false);

  //states for filter
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [normalFields, setNormalFields] = useState([]);
  const [tickFields, setTickFields] = useState([]);
  const [predefineFields, setPredefineFields] = useState([]);
  const [loadingFields, setLoadingFields] = useState(false); // Optional loading state

  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [initialWorkers, setInitialWorkers] = useState([]); // NEW: For initial workers
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 0,
    total_count: 0,
    has_next: false
  });
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // NEW: Add state for selected city
  const [selectedCity, setSelectedCity] = useState(null);
  
  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [modalHeight, setModalHeight] = useState(SCREEN_HEIGHT * 0.6);
  
  const panY = useRef(new Animated.Value(0)).current;
  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: Animated.event([null, { dy: panY }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > 50) {
          closeModal();
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const resetPosition = () => {
    Animated.spring(panY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(panY, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      panY.setValue(0);
    });
  };

  // Function to get city from AsyncStorage
  const getCityFromStorage = async () => {
    try {
      const cityString = await AsyncStorage.getItem('selectedCity');
      if (cityString) {
        const city = JSON.parse(cityString);
        console.log('🏙️ City loaded from storage:', city);
        setSelectedCity(city);
        return city;
      }
      console.log('🏙️ No city found in storage');
      return null;
    } catch (error) {
      console.error('Error getting city from storage:', error);
      return null;
    }
  };

  // Load city when component mounts
  useEffect(() => {
    getCityFromStorage();
  }, []);

  useEffect(() => {
    console.log('🔍 Debug - Category fields state:', {
      selectedCategory: selectedCategory?.name,
      normalFields: normalFields.map(f => f.value),
      tickFields: tickFields.map(f => f.value),
      predefineFields: predefineFields.map(f => f.value)
    });
  }, [normalFields, tickFields, predefineFields, selectedCategory]);

  // Add this useEffect to fetch category fields when selectedCategory changes
  useEffect(() => {
    console.log('🎯 Selected category changed:', {
      categoryId: selectedCategory?.id,
      categoryName: selectedCategory?.name,
      hasCategory: !!selectedCategory
    });

    if (selectedCategory && selectedCategory.id) {
      console.log('🚀 Fetching category fields for:', selectedCategory.id);
      fetchCategoryFields(selectedCategory.id);
      
      // Clear previous filtered workers when category changes
      setFilteredWorkers([]);
    } else {
      console.log('🗑️ Category cleared, resetting fields');
      resetCategoryFields();
    }
  }, [selectedCategory]);

  // Add this effect to refresh city when it changes - UPDATED
  useEffect(() => {
    console.log('🏙️ Selected city updated:', {
      city: selectedCity,
      hasCity: !!selectedCity,
      cityId: selectedCity?.id,
      cityName: selectedCity?.title,
      hasLocation: !!(userInitialLat && userInitialLong),
      hasCategory: !!selectedCategory,
      shouldRefresh: !!(userInitialLat && userInitialLong && selectedCity && !selectedCategory)
    });
    
    // If we have location and city, refresh the workers
    if (userInitialLat && userInitialLong && selectedCity && !selectedCategory) {
      console.log('🔄 Refreshing workers with new city');
      loadInitialWorkers(userInitialLat, userInitialLong);
    } else {
      console.log('❌ Not refreshing because:', {
        noLocation: !(userInitialLat && userInitialLong),
        noCity: !selectedCity,
        hasCategory: !!selectedCategory,
        message: selectedCategory ? 'Category is selected, ignoring city change' : 'Missing location or city'
      });
    }
  }, [selectedCity]);
  
  // Add this to your Search component, after your other useEffects
  useEffect(() => {
    console.log('🔍 Search Component - filteredWorkers updated:', {
      count: filteredWorkers.length,
      hasData: filteredWorkers.length > 0,
      firstItem: filteredWorkers[0]
    });
  }, [filteredWorkers]);

  useEffect(() => {
    console.log('📍 Search Component - Location updated:', {
      lat: userInitialLat,
      long: userInitialLong,
      hasLocation: userInitialLat !== null && userInitialLong !== null
    });
  }, [userInitialLat, userInitialLong]);

  // Handle back button for modal
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (modalVisible) {
        closeModal();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [modalVisible]);

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const currentVersion = '1.0.0';
        setAppVersion(currentVersion);
        
        const lastSeenVersion = await AsyncStorage.getItem('lastSeenVersion');
        
        if (lastSeenVersion !== currentVersion) {
          setShowReleaseNote(true);
          await AsyncStorage.setItem('lastSeenVersion', currentVersion);
        }
      } catch (error) {
        console.error('Error checking version:', error);
      }
    };

    checkForUpdates();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkForUpdates();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Add this to debug field changes
  useEffect(() => {
    console.log('🔄 Category fields updated:', {
      selectedCategory: selectedCategory?.name || 'None',
      normalFieldsCount: normalFields.length,
      tickFieldsCount: tickFields.length,
      predefineFieldsCount: predefineFields.length,
      loadingFields: loadingFields
    });
  }, [normalFields, tickFields, predefineFields, selectedCategory, loadingFields]);
  
  // Check if we already have location permission
  const checkLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        const status = await Geolocation.getAuthorizationStatus();
        return status === 'granted' || status === 'restricted';
      }
      
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted;
      }
      
      return false;
    } catch (error) {
      console.log('Error checking location permission:', error);
      return false;
    }
  };

  // Request location permission (only if not already asked/denied)
  const requestLocationPermission = async () => {
    try {
      // Check if we've already asked for permission in this session
      const alreadyAsked = await AsyncStorage.getItem('locationPermissionAsked');
      
      if (alreadyAsked === 'true') {
        return await checkLocationPermission();
      }
      
      if (Platform.OS === 'ios') {
        const status = await Geolocation.requestAuthorization('whenInUse');
        await AsyncStorage.setItem('locationPermissionAsked', 'true');
        return status === 'granted';
      }
      
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'دسترسی به موقعیت مکانی',
            message: 'برای نمایش خدمات نزدیک به شما، به دسترسی موقعیت مکانی نیاز داریم',
            buttonNeutral: 'بعداً بپرس',
            buttonNegative: 'لغو',
            buttonPositive: 'تأیید',
          },
        );
        await AsyncStorage.setItem('locationPermissionAsked', 'true');
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      
      return false;
    } catch (err) {
      console.warn('Error requesting location permission:', err);
      return false;
    }
  };

  // Get fallback location from AsyncStorage
  const getFallbackLocation = async () => {
    try {
      const savedLat = await AsyncStorage.getItem('cityCenterLat');
      const savedLong = await AsyncStorage.getItem('cityCenterLong');
      
      if (savedLat && savedLong) {
        return {
          lat: parseFloat(savedLat),
          long: parseFloat(savedLong)
        };
      }
      
      // Default fallback coordinates (Tehran coordinates)
      return {
        lat: 35.6892,
        long: 51.3890
      };
    } catch (error) {
      console.log('Error getting fallback location:', error);
      return {
        lat: 35.6892,
        long: 51.3890
      };
    }
  };

  // UPDATED: Function to load initial workers with city parameter - FIXED VERSION
  const loadInitialWorkers = async (lat, long) => {
    try {
      console.log('🚀 Loading initial workers...', {
        lat: lat,
        long: long,
        selectedCity: selectedCity,
        hasSelectedCity: !!selectedCity
      });
      
      // Get city from storage if not already loaded
      let cityToUse = selectedCity;
      if (!cityToUse) {
        cityToUse = await getCityFromStorage();
        console.log('🔄 Got city from storage:', cityToUse);
      }
      
      const params = {
        lat: lat,
        long: long,
        page: 1,
      };
      
      // Add city_id to parameters if we have it
      if (cityToUse && cityToUse.id) {
        params.city_id = cityToUse.id;
        console.log('📍 Adding city to API request:', {
          cityId: cityToUse.id,
          cityName: cityToUse.title,
          allParams: params
        });
      } else {
        console.log('⚠️ No city available for API request');
      }
      
      console.log('🌐 Making API call with params:', params);
      
      const response = await axios({
        method: 'get',
        url: 'https://api.ajur.app/api/server-filtered-workers',
        timeout: 10000,
        params: params,
      });

      console.log('✅ API Response received:', {
        count: response.data.workers?.length || 0,
        status: response.data.status,
        hasCity: !!cityToUse,
        message: response.data.message,
        debug: response.data.debug
      });

      // Set both initialWorkers and filteredWorkers
      const workers = response.data.workers || [];
      console.log('📊 Setting workers:', workers.length, 'items');
      
      setInitialWorkers(workers);
      setFilteredWorkers(workers);

      // Set pagination
      const newPagination = {
        current_page: 1,
        total_pages: Math.ceil(workers.length / 10),
        total_count: workers.length,
        has_next: workers.length >= 10
      };
      
      setPagination(newPagination);
      
      console.log('📈 Pagination set:', newPagination);

    } catch (error) {
      console.log('❌ Error loading initial workers:', {
        error: error.message,
        response: error.response?.data,
        config: error.config?.params
      });
      setInitialWorkers([]);
      setFilteredWorkers([]);
    }
  };

  // UPDATED: Function to handle load more with city parameter
  const handleLoadMore = async () => {
    if (pagination.has_next && !isLoadingMore && !loading) {
      console.log('⬇️ Loading more data, page:', pagination.current_page + 1);
      setIsLoadingMore(true);
      
      try {
        // Get city from storage if not already loaded
        let cityToUse = selectedCity;
        if (!cityToUse) {
          cityToUse = await getCityFromStorage();
        }
        
        const nextPage = pagination.current_page + 1;
        const params = {
          lat: userInitialLat,
          long: userInitialLong,
          category_id: selectedCategory?.id || null,
          page: nextPage,
        };
        
        // Add city_id to parameters if we have it
        if (cityToUse && cityToUse.id) {
          params.city_id = cityToUse.id;
          console.log('📍 Loading more with city:', cityToUse.title);
        }
        
        const response = await axios({
          method: 'get',
          url: 'https://api.ajur.app/api/server-filtered-workers',
          timeout: 10000,
          params: params,
        });

        const newWorkers = response.data.workers || [];
        
        // Append new workers to existing ones
        setFilteredWorkers(prev => [...prev, ...newWorkers]);
        
        // Update pagination
        setPagination(prev => ({
          ...prev,
          current_page: nextPage,
          has_next: newWorkers.length >= 10,
          total_count: prev.total_count + newWorkers.length
        }));

        console.log('✅ More workers loaded:', {
          newCount: newWorkers.length,
          totalCount: filteredWorkers.length + newWorkers.length,
          hasMore: newWorkers.length >= 10,
          withCity: !!cityToUse
        });

      } catch (error) {
        console.log('❌ Error loading more workers:', error);
        ToastAndroid.showWithGravityAndOffset(
          'خطا در بارگذاری بیشتر آگهی‌ها',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
          25,
          50,
        );
      } finally {
        setIsLoadingMore(false);
      }
    }
  };

  const loadData = async () => {
    try {
      console.log('📱 loadData() called');
      
      // First load city from storage
      await getCityFromStorage();
      
      let lat, long;
      let usingFallback = false;
      
      // First check if we already have permission
      const hasExistingPermission = await checkLocationPermission();
      
      if (hasExistingPermission) {
        try {
          // Try to get current position with timeout
          const position = await new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
              resolve,
              reject,
              { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 } // 5 minute cache
            );
          });
          
          lat = position.coords.latitude;
          long = position.coords.longitude;
        } catch (locationError) {
          console.log('Location error, using fallback:', locationError);
          // Use fallback location if current position fails
          const fallbackLocation = await getFallbackLocation();
          lat = fallbackLocation.lat;
          long = fallbackLocation.long;
          usingFallback = true;
        }
      } else {
        // Only request permission if we don't have it and haven't asked recently
        const hasPermission = await requestLocationPermission();
        
        if (hasPermission) {
          try {
            const position = await new Promise((resolve, reject) => {
              Geolocation.getCurrentPosition(
                resolve,
                reject,
                { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
              );
            });
            
            lat = position.coords.latitude;
            long = position.coords.longitude;
          } catch (locationError) {
            console.log('Location error after permission, using fallback:', locationError);
            const fallbackLocation = await getFallbackLocation();
            lat = fallbackLocation.lat;
            long = fallbackLocation.long;
            usingFallback = true;
          }
        } else {
          // Use fallback location if permission not granted
          const fallbackLocation = await getFallbackLocation();
          lat = fallbackLocation.lat;
          long = fallbackLocation.long;
          usingFallback = true;
        }
      }
      
      console.log('📍 Location set:', { lat, long, usingFallback });
      
      set_userInitialLat(lat);
      set_userInitialLong(long);
      setUsingFallbackLocation(usingFallback);

      const baseurl = 'https://api.ajur.app/api/base';

      console.log('📡 Loading base data...');
      
      axios({
        method: 'get',
        url: baseurl,
        timeout: 7000,
        params: {
          lat: lat,
          long: long,
        },
      })
        .then(function (response) {
          console.log('✅ Base data loaded');
          
          set_title1(response.data.title1);
          set_title2(response.data.title2);
          set_title3(response.data.title3);
          set_collection1(response.data.collection1);
          set_collection2(response.data.collection2);
          set_collection3(response.data.collection3);
          set_realstates(response.data.realstates);
          set_main_cats(response.data.main_cats);
          set_sub_cats(response.data.sub_cats);

          set_loading(false);
        })
        .catch(function (error) {
          console.log('❌ Error loading base data:', error);
          set_loading(false);
          setErrorModalVisible(true);
        });

      // ALSO LOAD INITIAL WORKERS
      console.log('🔄 Calling loadInitialWorkers...');
      await loadInitialWorkers(lat, long);

    } catch (error) {
      console.log('❌ Error in loadData:', error);
      set_loading(false);
      setErrorModalVisible(true);
    }
  };

  const fetchCategoryFields = async (categoryId, retryCount = 0) => {
    const MAX_RETRIES = 2;
    
    if (!categoryId) {
      console.warn('⚠️ No category ID provided');
      resetCategoryFields();
      return;
    }

    try {
      setLoadingFields(true);
      console.log(`📋 Fetching fields for category ID: ${categoryId} (attempt ${retryCount + 1})`);
      
      const response = await axios({
        method: 'get',
        url: 'https://api.ajur.app/api/category-fields',
        timeout: 10000,
        params: { cat: categoryId },
      });

      // Log the raw response
      console.log('📊 Category fields API response received');

      // Validate response structure
      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Invalid response format');
      }

      // Process fields
      const processFields = (fields) => {
        if (!Array.isArray(fields)) {
          console.warn('⚠️ Fields is not an array:', typeof fields);
          return [];
        }
        
        return fields.filter(field => {
          const isValid = field && field.value;
          if (!isValid) {
            console.warn('⚠️ Invalid field found (missing value):', field);
          }
          return isValid;
        }).map(field => ({
          id: field.id,
          name: field.value,
          value: field.value,
          label: field.value,
          slug: field.slug,
          unit: field.unit,
          type: field.type,
          min_range: field.min_range,
          max_range: field.max_range,
          low: field.low,
          high: field.high,
          special: field.special,
          sort: field.sort,
          options: field.vars || field.varchars || [],
          key: field.id?.toString() || field.value
        }));
      };

      const normalFieldsData = processFields(response.data.normal_fields || []);
      const tickFieldsData = processFields(response.data.tick_fields || []);
      const predefineFieldsData = processFields(response.data.predefine_fields || []);

      console.log('✅ Category fields processed:', {
        categoryId,
        normal: normalFieldsData.length,
        tick: tickFieldsData.length,
        predefine: predefineFieldsData.length
      });

      // Update state
      setNormalFields(normalFieldsData);
      setTickFields(tickFieldsData);
      setPredefineFields(predefineFieldsData);

    } catch (error) {
      console.error('❌ Fetch error:', {
        categoryId,
        message: error.message,
        code: error.code,
        retryCount
      });

      // Retry logic for network/timeout errors
      if (retryCount < MAX_RETRIES && 
          (error.code === 'ECONNABORTED' || !error.response)) {
        console.log(`🔄 Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return fetchCategoryFields(categoryId, retryCount + 1);
      }

      // Final error handling
      handleCategoryFieldsError(error);
      
    } finally {
      setLoadingFields(false);
    }
  };

  // Helper function to reset all fields
  const resetCategoryFields = () => {
    setNormalFields([]);
    setTickFields([]);
    setPredefineFields([]);
  };

  // Helper function for error handling
  const handleCategoryFieldsError = (error) => {
    resetCategoryFields();
    
    // Show appropriate error message
    let errorMessage = 'خطا در دریافت فیلترها';
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'اتصال به سرور طول کشید';
    } else if (!error.response) {
      errorMessage = 'خطای شبکه';
    }
    
    if (Platform.OS === 'android') {
      ToastAndroid.showWithGravityAndOffset(
        errorMessage,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
        25,
        50,
      );
    }
  };

  useEffect(() => {
    let intervalId = setInterval(() => {
      NetInfo.fetch().then(state => {
        set_net_connect_status(state.isConnected);
        if (!state.isConnected) {
          var message = 'اتصال اینترنت را بررسی کنید';
          ToastAndroid.showWithGravityAndOffset(
            message,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
            25,
            50,
          );
        }
      });
    }, 5000);

    loadData();
    
    return () => clearInterval(intervalId);
  }, []);

  // Filter subcategories by type
  const filterSubCatsByType = (type) => {
    return sub_cats.filter(cat => cat.type === type);
  };

  // Handle main category button press - opens modal now
  const handleMainCategoryPress = (type, title) => {
    const filtered = filterSubCatsByType(type);
    setModalContent(filtered);
    setModalTitle(title);
    
    // Calculate dynamic modal height based on content
    const itemCount = filtered.length;
    const rows = Math.ceil(itemCount / 4); // 4 items per row
    const calculatedHeight = Math.min(
      SCREEN_HEIGHT * 0.8, // Max 80% of screen height
      Math.max(
        SCREEN_HEIGHT * 0.4, // Min 40% of screen height
        120 + (rows * 100) // Base height + row height
      )
    );
    setModalHeight(calculatedHeight);
    
    setModalVisible(true);
  };

  const Refresh = async () => {
    set_net_connect_status(true);
    set_loading(true);
    await loadData();
  };

  // Add a manual location refresh function that users can trigger
  const refreshLocation = async () => {
    try {
      // Clear the permission asked flag to allow asking again
      await AsyncStorage.removeItem('locationPermissionAsked');
      set_loading(true);
      await loadData();
    } catch (error) {
      console.log('Error refreshing location:', error);
    }
  };

  // UPDATED: Refresh initial workers with city
  const refreshInitialWorkers = async () => {
    if (userInitialLat && userInitialLong && !selectedCategory) {
      await loadInitialWorkers(userInitialLat, userInitialLong);
    }
  };

  const goToCategory = (cat) => {
    console.log('🎯 Category selected:', cat.name);
    
    // Set the selected category
    setSelectedCategory(cat);
    
    // Fetch category-specific fields
    fetchCategoryFields(cat.id);
    
    // Clear current workers and close modal
    setFilteredWorkers([]);
    closeModal();
    
    console.log('🔄 Fetching fields and waiting for filtered results...');
  };

  const onPressingSingleWorker = ({worker}) => {
    navigation.navigate('WorkerSingle', {
      itemId: worker.id,
    });
  };

  // Handle new ad registration
  const handleNewAdRegistration = () => {
       AsyncStorage.getItem('id_token').then(token => {
      if (token == null) {
        navigation.navigate('Rlogin');
      } else {
        navigation.navigate('NewWorker');
      }
    });
  };

  // Handler for when city is selected from CitySelector - FIXED VERSION
  const handleCitySelect = async (city) => {
    console.log('🏙️ City selected in Search component:', {
      city: city,
      hasCity: !!city,
      cityId: city?.id,
      cityName: city?.title,
      currentUserLocation: { lat: userInitialLat, long: userInitialLong },
      hasSelectedCategory: !!selectedCategory,
      shouldRefresh: !!(userInitialLat && userInitialLong && city && !selectedCategory)
    });
    
    // Update local state
    setSelectedCity(city);
    
    // Also update AsyncStorage (though CityContext already does this)
    try {
      await AsyncStorage.setItem('selectedCity', JSON.stringify(city));
      console.log('💾 City saved to AsyncStorage');
    } catch (error) {
      console.error('Error saving city to storage:', error);
    }
    
    // Refresh workers with new city if we have location and no category is selected
    if (userInitialLat && userInitialLong && city && !selectedCategory) {
      console.log('🔄 Refreshing workers with new city:', city.title);
      await loadInitialWorkers(userInitialLat, userInitialLong);
    } else {
      console.log('❌ Conditions not met for refresh:', {
        noLocation: !(userInitialLat && userInitialLong),
        noCity: !city,
        hasCategory: !!selectedCategory,
        message: selectedCategory ? 'Category is selected, ignoring city change' : 'Missing location or city'
      });
    }
  };

  // Render main category buttons (خرید and رهن و اجاره) - outlined with nice borders
  const renderMainCategoryButtons = () => {
    return (
      <View style={styles.mainCategoryContainer}>
        <TouchableOpacity
          style={[styles.mainCategoryButton, styles.rentButton]}
          onPress={() => handleMainCategoryPress('rent', 'رهن و اجاره')}
        >
          <View style={styles.buttonContent}>
            <Image 
              source={require('./assets/icons/rent_apartment.png')}
              style={styles.customIcon}
            />
            <Text style={styles.mainCategoryButtonText}>رهن و اجاره</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mainCategoryButton, styles.sellButton]}
          onPress={() => handleMainCategoryPress('sell', 'خرید')} 
        >
          <View style={styles.buttonContent}>
            <Image 
              source={require('./assets/icons/sell_office_land.png')}
              style={styles.customIcon}
            />
            <Text style={styles.mainCategoryButtonText}>خرید</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // Render new ad registration button
  const renderNewAdButton = () => {
    return (
      <TouchableOpacity
        style={styles.newAdButton}
        onPress={handleNewAdRegistration}
      >
        <View style={styles.newAdButtonContent}>
          <Icon name="add-circle-outline" size={32} color="gray" style={styles.newAdButtonIcon} />
          <Text style={styles.newAdButtonText}>ثبت آگهی جدید</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Render modal content
  const renderModalContent = () => {
    return (
      <Animated.View 
        style={[
          styles.modalContainer,
          {
            transform: [{ translateY }],
            height: modalHeight,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.grabber} />
        <Text style={styles.modalTitle}>{modalTitle}</Text>
        <ScrollView 
          style={styles.modalScrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.modalScrollContent}
        >
          <View style={styles.gridContainer}>
            {modalContent.map((cat, index) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.gridItem}
                onPress={() => goToCategory(cat)}
              >
                <SubCatCard cat={cat} index={index} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </Animated.View>
    );
  };

  const renderOrSpinner = () => {
  if (!net_connect_status) {
    return (
      <View style={styles.spinnerView}>
        <TouchableOpacity onPress={() => Refresh()}>
          <Icon
            name="ios-refresh"
            style={{
              fontSize: 35,
              color: 'red',
              textAlign: 'center',
              borderRadius: 20,
            }}
          />
          <Text style={styles.itemText}>تلاش مجدد</Text>
        </TouchableOpacity>

        <Image
          source={require('./assets/broken-brick.jpg')}
          alt="توافق نامه کاربری آجر"
          style={{height: 200, width: 200, alignSelf: 'center'}}
        />
        <Text style={{padding: 10, color: 'gray'}}>
          اتصال خود به اینترنت را برسی کنید
        </Text>
      </View>
    );
  } else if (loading) {
    return (
      <View style={styles.spinnerView}>
        <Spinner
          style={styles.spinner}
          isVisible={true}
          size={30}
          type="Circle"
          color="#b92a31"
        />
      </View>
    );
  } else {
    return (
      <NativeBaseProvider>
        {/* Pass the city select handler to SearchBars */}
        <SearchBars 
          realstates={realstates} 
          onCitySelect={handleCitySelect}
        /> 
        
        {/* Display current city if available */}
        {selectedCity && (
          <View style={styles.cityIndicator}>
            <Icon name="location-outline" size={16} color="#b92a31" />
            <Text style={styles.cityIndicatorText}>
              شهر انتخابی: {selectedCity.title}
            </Text>
            <TouchableOpacity 
              style={styles.refreshCityButton}
              onPress={() => {
                console.log('🔄 Manual city refresh triggered');
                if (userInitialLat && userInitialLong && !selectedCategory) {
                  loadInitialWorkers(userInitialLat, userInitialLong);
                }
              }}
            >
              <Icon name="refresh" size={14} color="#b92a31" />
              <Text style={styles.refreshCityText}>بروزرسانی</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Debug panel - temporary for troubleshooting */}
        {/* <View style={styles.debugPanel}>
          <Text style={styles.debugText}>
            Debug: City={selectedCity?.title}, Cat={selectedCategory?.name || 'None'}, 
            Workers={filteredWorkers.length}, Page={pagination.current_page}
          </Text>
        </View> */}

        {/* Fixed Filter Bar */}
        {selectedCategory && (
          <View style={styles.fixedFilterBar}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => {
                console.log('🔙 Going back to all categories');
                setSelectedCategory(null);
                setFilteredWorkers(initialWorkers);
                // Clear fields when going back
                setNormalFields([]);
                setTickFields([]);
                setPredefineFields([]);
              }}
            >
              <Icon name="arrow-back" size={24} color="#b92a31" />
            </TouchableOpacity>
            
            <View style={styles.filterComponentWrapper}>
              <FilterComponent
                onFilteredDataChange={(filteredData, pagination) => {
                  console.log('📊 FilterComponent returned data:', {
                    count: filteredData.length,
                    pagination: pagination
                  });
                  setFilteredWorkers(filteredData);
                  setPagination(pagination);
                }}
                availableCategories={sub_cats}
                initialCategory={selectedCategory}
                userLocation={{
                  lat: userInitialLat,
                  long: userInitialLong
                }}
                // Pass city to FilterComponent so it can include it in API calls
                selectedCity={selectedCity}
                // Pass category fields from Search.js state
                categoryFields={{
                  normal: normalFields,
                  tick: tickFields,
                  predefine: predefineFields
                }}
                loadingFields={loadingFields}
                // Handle category changes from within FilterComponent
                onCategoryChange={(newCategory) => {
                  console.log('🔄 Category changed from FilterComponent:', newCategory?.name);
                  if (newCategory) {
                    setSelectedCategory(newCategory);
                    // This will trigger the useEffect above
                  }
                }}
              />
            </View>
          </View>
        )}

        <ScrollView style={styles.wraper}>
          <View style={styles.buttonsWrapper}>
            {/* Show main buttons only when no category is selected */}
            {!selectedCategory && (
              <>
                {/* Render new ad button first */}
                {renderNewAdButton()}
                
                {/* Then render main category buttons */}
                {renderMainCategoryButtons()}
              </>
            )}
          </View>

          {/* ALWAYS SHOW RESULTS LIST - No condition */}
          <View style={styles.resultsSection}>
            {/* Results Count */}
            {filteredWorkers.length > 0 && (
              <View style={styles.resultsHeader}>
                <TouchableOpacity onPress={refreshInitialWorkers} style={styles.refreshButton}>
                  <Text style={styles.refreshButtonText}>ترتیب : پیشنهاد آجر</Text>
                  <Icon name="filter" size={16} color="#6c6868ff" />
                </TouchableOpacity>
                <Text style={styles.resultsCount}>
                  {pagination.total_count} آگهی در حال نمایش است
                  {selectedCity && ` (شهر: ${selectedCity.title})`}
                </Text>
              </View>
            )}

            {/* Results List - ALWAYS VISIBLE */}
            {filteredWorkers.length > 0 ? (
              <FlatList
                data={filteredWorkers}
                keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                renderItem={({ item }) => <WorkerCard data={item} />}
                contentContainerStyle={styles.resultsList}
                showsVerticalScrollIndicator={false}
                onEndReachedThreshold={0.8}
                scrollEnabled={false}
                ListFooterComponent={
                  isLoadingMore ? (
                    <View style={styles.loadingMoreContainer}>
                      <Spinner
                        style={styles.loadingMoreSpinner}
                        isVisible={true}
                        size={20}
                        type="Circle"
                        color="#b92a31"
                      />
                      <Text style={styles.loadingMoreText}>در حال بارگذاری...</Text>
                    </View>
                  ) : pagination.has_next ? (
                    <View style={styles.loadMoreContainer}>
                      <TouchableOpacity 
                        style={styles.loadMoreButton}
                        onPress={handleLoadMore}
                      >
                        <Text style={styles.loadMoreText}>
                          بارگذاری موارد بیشتر 
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : filteredWorkers.length > 0 ? (
                    <View style={styles.endOfListContainer}>
                      <Text style={styles.endOfListText}>همه آگهی‌ها نمایش داده شد</Text>
                    </View>
                  ) : null
                }
                ListEmptyComponent={
                  <View style={styles.noResults}>
                    <Icon name="search-outline" size={50} color="#ccc" />
                    <Text style={styles.noResultsText}>
                      {selectedCategory ? 'در حال بارگذاری آگهی‌ها...' : 'هیچ آگهی‌ای یافت نشد'}
                    </Text>
                  </View>
                }
              />
            ) : (
              <View style={styles.noResults}>
                <Icon name="search-outline" size={50} color="#ccc" />
                <Text style={styles.noResultsText}>
                  {selectedCategory ? 'در حال بارگذاری آگهی‌ها...' : 'هیچ آگهی‌ای یافت نشد'}
                </Text>
              </View>
            )}
          </View>

          <BaseErrorModal
            visible={errorModalVisible}
            onGoBack={() => navigation.goBack()}
            onRefresh={() => {
              setErrorModalVisible(false);
              loadData();
            }}
          />
        </ScrollView>

        <NewWorkerFab
          navigation={navigation}
          showFooter={false}
          visibleMarkers={0} 
          loading={false}
        />

        {/* Category Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={closeModal}
          >
            {renderModalContent()}
          </TouchableOpacity>
        </Modal>
      </NativeBaseProvider>
    );
  }
};

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#b92a31" barStyle="light-content" />
      {renderOrSpinner()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fallbackNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef'
  },
  fallbackText: {
    color: '#6c757d',
    fontSize: 14,
    marginLeft: 5,
    flex: 1
  },
  cityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e8f5e8',
    padding: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#d4edda'
  },
  cityIndicatorText: {
    color: '#155724',
    fontSize: 14,
    fontFamily: 'iransans',
    marginRight: 6,
    flex: 1
  },
  refreshCityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d4edda'
  },
  refreshCityText: {
    color: '#b92a31',
    fontSize: 12,
    fontFamily: 'iransans',
    marginRight: 4
  },
  refreshLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5
  },
  refreshLocationText: {
    color: '#b92a31',
    fontSize: 12,
    marginLeft: 3
  },
  debugPanel: {
    backgroundColor: '#333',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#444'
  },
  debugText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'iransans',
    textAlign: 'center'
  },
  header: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    height: Dimensions.get('window').height / 5,
  },
  headerBackground: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 5,
  },
  headerIcon: {
    color: '#555',
    backgroundColor: '#f9f9f9',
    fontSize: 30,
    borderRadius: 15,
    margin: 15,
    padding: 10,
  },
  headerTtitle: {
    color: '#666',
    textAlign: 'center',
    fontFamily: 'iransans',
  },
  wraper: {
    flex: 1,
  },
  buttonsWrapper: {
    paddingTop: 30,
  },
  itemText: {
    textAlign: 'center',
    color: '#e9e9e9',
    margin: 1,
    fontSize: 18,
    fontFamily: 'yekan',
  },
  spinnerView: {
    flex: 1,
    height: 500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {},
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 8,
  },
  gridItem: {
    width: '25%',
    padding: 6,
  },
  releaseNoteContainer: {
    position: 'absolute',
    top: 60,
    left: '10%',
    width: '80%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    padding: 15,
  },
  releaseNoteContent: {
    flex: 1,
  },
  releaseNoteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  releaseNoteText: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'iransans'
  },
  releaseNoteCloseButton: {
    position: 'absolute',
    top: 5,
    left: 5,
    padding: 5,
  },
  releaseNoteHeader: {
    fontWeight: 'bold',
  },
  featureCategory: {
    fontWeight: 'bold',
  },
  featureItem: {
    marginLeft: 10,
  },
  // New styles for category buttons - outlined design
  mainCategoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingVertical: 15,
    marginBottom: 10,
  },
  mainCategoryButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    minHeight: 70,
  },
  sellButton: {
    backgroundColor: '#fcfcfc',
  },
  rentButton: {
    backgroundColor: '#fcfcfc',
  },
  buttonContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainCategoryButtonText: {
    color: '#333',
    fontSize: 18,
    fontFamily: 'iransans',
    textAlign: 'center',
    marginTop: 8,
  },
  buttonIcon: {
    marginBottom: 4,
  },
  // New Ad Button styles
  newAdButton: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginHorizontal: 25,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    minHeight: 60,
  },
  newAdButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newAdButtonText: {
    color: 'gray',
    fontSize: 18,
    fontFamily: 'iransans',
    textAlign: 'center',
    marginLeft: 20
  },
  newAdButtonIcon: {},
  // Modal styles with dynamic height
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 15,
    paddingBottom: 20,
    minHeight: 200,
    maxHeight: SCREEN_HEIGHT * 0.8,
  },
  grabber: {
    width: 50,
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    alignSelf: 'center',
    marginVertical: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
    fontFamily: 'iransans',
  },
  modalScrollView: {
    flex: 1,
  },
  modalScrollContent: {
    paddingBottom: 10,
  },
  customIcon: {
    width: 40,
    height: 40,
    marginBottom: 4,
  },
  // Results section styles
  resultsSection: {
    marginTop: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'iransans',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  refreshButtonText: {
    fontSize: 14,
    color: '#6c6868ff',
    fontFamily: 'iransans',
    marginRight: 6,
  },
  resultsList: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  loadMoreContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadMoreButton: {
    backgroundColor: '#b92a31',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  loadMoreText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'iransans',
  },
  loadingMoreContainer: {
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loadingMoreSpinner: {
    marginRight: 8,
  },
  loadingMoreText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'iransans',
  },
  endOfListContainer: {
    padding: 16,
    alignItems: 'center',
  },
  endOfListText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'iransans',
  },
  noResults: {
    alignItems: 'center',
    padding: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    fontFamily: 'iransans',
  },
  filterSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 20,
  },
  
  // Fixed Filter Bar Styles
  fixedFilterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    height: 60,
  },
  filterComponentWrapper: {
    flex: 1,
    marginLeft: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default Search;