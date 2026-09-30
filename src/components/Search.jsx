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
  ToastAndroid,
  Animated,
  Modal,
  PanResponder,
  RefreshControl,
  Alert,
} from 'react-native';

import {NativeBaseProvider} from 'native-base';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

import Icon from 'react-native-vector-icons/Ionicons';
import WorkerCard from './cards/WorkerCard';
import RealEstateCard from './cards/RealEstateCard';
import MainCatCard from './cards/MainCatCard';
import SubCatCard from './cards/SubCatCard';
import BaseErrorModal from '../components/modals/BaseErrorModal';
import SearchBars from '../components/search/SearchBars';
import NewWorkerFab from '../components/fabs/NewWorkerFab';
import FilterComponent from './filter/FilterComponent';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Spinner from 'react-native-spinkit';
import NetInfo from '@react-native-community/netinfo';
import {filterApi} from './filter/services/filterApi';

// ============ NEW: Loading Skeleton Component ============
const LoadingSkeleton = () => (
  <View style={styles.skeletonContainer}>
    <View style={styles.skeletonHeader}>
      <View style={styles.skeletonSearchBar} />
    </View>
    <View style={styles.skeletonCard} />
    <View style={styles.skeletonCard} />
    <View style={styles.skeletonCard} />
    <View style={styles.skeletonCard} />
    <View style={styles.skeletonCard} />
  </View>
);

const Search = ({navigation, route}) => {
  const [loading, set_loading] = useState(true);
  const [loadingWorkers, setLoadingWorkers] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isApplyingSearchFilter, setIsApplyingSearchFilter] = useState(false);
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
  const [neighborhoods, set_neighborhoods] = useState([]);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [showReleaseNote, setShowReleaseNote] = useState(false);
  const [appVersion, setAppVersion] = useState('');
  const [usingFallbackLocation, setUsingFallbackLocation] = useState(false);
  const [connectionTimeout, setConnectionTimeout] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [normalFields, setNormalFields] = useState([]);
  const [tickFields, setTickFields] = useState([]);
  const [predefineFields, setPredefineFields] = useState([]);
  const [loadingFields, setLoadingFields] = useState(false);

  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [initialWorkers, setInitialWorkers] = useState([]);
  const [specialItem, setSpecialItem] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 0,
    total_count: 0,
    has_next: false,
  });
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [selectedCity, setSelectedCity] = useState(null);

  // Field values for filters
  const [fieldValues, setFieldValues] = useState({});
  const [activeFieldFilters, setActiveFieldFilters] = useState([]);

  const latestCityRef = useRef(selectedCity);
  useEffect(() => {
    latestCityRef.current = selectedCity;
  }, [selectedCity]);

  const filterComponentRef = useRef(null);

  const getRandomSpecialItem = (workers) => {
    if (!workers || workers.length === 0) return null;
    const specialWorkers = workers.filter(worker => worker.is_special === true);
    if (specialWorkers.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * specialWorkers.length);
    return specialWorkers[randomIndex];
  };

  // Handle incoming search params
  useEffect(() => {
    const handleIncomingParams = async () => {
      if (route?.params?.searchParams) {
        const {category, categoryName, neighborhood, city} =
          route.params.searchParams;

        console.log('Received search params:', route.params.searchParams);

        if (city && city.id !== selectedCity?.id) {
          await handleCitySelect(city);
        }

        if (sub_cats.length === 0) {
          console.log('Waiting for sub_cats to load...');
          return;
        }

        let foundCategory = null;

        if (category && Array.isArray(category)) {
          foundCategory = sub_cats.find(cat => {
            return (
              JSON.stringify(cat.category_array) === JSON.stringify(category)
            );
          });
        }

        if (!foundCategory && categoryName) {
          foundCategory = sub_cats.find(
            cat => cat.title === categoryName || cat.name === categoryName,
          );
        }

        if (foundCategory) {
          console.log('Found matching category:', foundCategory);
          setSelectedCategory(foundCategory);
          ToastAndroid.show(
            `فیلتر برای ${foundCategory.title} اعمال شد`,
            ToastAndroid.SHORT,
          );
        } else {
          console.log('No matching category found');
          ToastAndroid.show('دسته‌بندی مطابقت نداشت', ToastAndroid.SHORT);
        }

        navigation.setParams({searchParams: undefined});
      }
    };

    handleIncomingParams();
  }, [route?.params?.searchParams]);

  // Handle category selection when sub_cats are loaded
  useEffect(() => {
    if (route?.params?.searchParams && sub_cats.length > 0) {
      const {category, categoryName} = route.params.searchParams;

      let foundCategory = null;

      if (category && Array.isArray(category)) {
        foundCategory = sub_cats.find(cat => {
          return (
            JSON.stringify(cat.category_array) === JSON.stringify(category)
          );
        });
      }

      if (!foundCategory && categoryName) {
        foundCategory = sub_cats.find(
          cat => cat.title === categoryName || cat.name === categoryName,
        );
      }

      if (foundCategory) {
        console.log(
          'Found matching category after sub_cats loaded:',
          foundCategory,
        );
        setSelectedCategory(foundCategory);
        ToastAndroid.show(
          `فیلتر برای ${foundCategory.title} اعمال شد`,
          ToastAndroid.SHORT,
        );

        navigation.setParams({searchParams: undefined});
      }
    }
  }, [sub_cats, route?.params?.searchParams]);

  const handleSearchResultSelect = searchData => {
    console.log('Search result selected:', searchData);

    const {category, categoryName, neighborhood, city} = searchData;

    setIsApplyingSearchFilter(true);
    setLoadingWorkers(true);

    if (city && city.id !== selectedCity?.id) {
      handleCitySelect(city);
    }

    setTimeout(async () => {
      try {
        let foundCategory = null;

        if (category && Array.isArray(category)) {
          foundCategory = sub_cats.find(cat => {
            return (
              JSON.stringify(cat.category_array) === JSON.stringify(category)
            );
          });
        }

        if (!foundCategory && categoryName) {
          foundCategory = sub_cats.find(
            cat => cat.title === categoryName || cat.name === categoryName,
          );
        }

        if (foundCategory) {
          console.log('Found matching category from SearchBars:', foundCategory);
          
          setSelectedCategory(null);
          setSelectedCategory(foundCategory);
          
          await new Promise(resolve => setTimeout(resolve, 500));
          
          if (neighborhood && filterComponentRef.current) {
            console.log('Setting new neighborhood:', neighborhood.name);
            
            const neighborhoodToSet = {
              id: neighborhood.id,
              name: neighborhood.name,
              ...neighborhood
            };
            
            await filterComponentRef.current.setSelectedNeighborhood(neighborhoodToSet);
            console.log('Neighborhood set successfully');
          }
          
          ToastAndroid.show(
            `فیلتر برای ${foundCategory.title} اعمال شد`,
            ToastAndroid.SHORT,
          );
        } else {
          console.log('No matching category found for:', categoryName);
          
          if (neighborhood && filterComponentRef.current) {
            const neighborhoodToSet = {
              id: neighborhood.id,
              name: neighborhood.name,
              ...neighborhood
            };
            await filterComponentRef.current.setSelectedNeighborhood(neighborhoodToSet);
            ToastAndroid.show(
              `فیلتر برای محله ${neighborhood.name} اعمال شد`,
              ToastAndroid.SHORT,
            );
          } else {
            ToastAndroid.show('دسته‌بندی یافت نشد', ToastAndroid.SHORT);
          }
        }
      } catch (error) {
        console.error('Error applying search filter:', error);
        ToastAndroid.show('خطا در اعمال فیلتر', ToastAndroid.SHORT);
      } finally {
        setIsApplyingSearchFilter(false);
        setLoadingWorkers(false);
      }
    }, 500);
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [modalHeight, setModalHeight] = useState(SCREEN_HEIGHT * 0.6);

  const [refreshing, setRefreshing] = useState(false);

  const panY = useRef(new Animated.Value(0)).current;
  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: Animated.event([null, {dy: panY}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > 50) closeModal();
        else resetPosition();
      },
    }),
  ).current;

  const resetPosition = () => {
    Animated.spring(panY, {toValue: 0, useNativeDriver: true}).start();
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

  const handleRefresh = async () => {
    setRefreshing(true);
    setLoadingWorkers(true);

    try {
      if (selectedCategory && filterComponentRef.current) {
        console.log('🔄 Refreshing through FilterComponent');
        const result = await filterComponentRef.current.refreshData(1);
        
        if (result && result.workers) {
          const transformedWorkers = result.workers.map(worker => ({
            ...worker,
            specialname1: worker.specialname1 || '',
            specialvalue1: worker.specialvalue1 || '',
            specialname2: worker.specialname2 || '',
            specialvalue2: worker.specialvalue2 || '',
            specialname3: worker.specialname3 || '',
            specialvalue3: worker.specialvalue3 || '',
            json_properties: worker.json_properties || []
          }));

          setFilteredWorkers(transformedWorkers);
          setPagination(result.pagination);
          
          const newSpecialItem = getRandomSpecialItem(transformedWorkers);
          setSpecialItem(newSpecialItem);
        }
      } else {
        const cityToUse = latestCityRef.current;
        
        const filters = {
          lat: userInitialLat,
          long: userInitialLong,
          page: 1,
          per_page: 10
        };

        if (cityToUse?.id) filters.city_id = cityToUse.id;
        if (selectedCategory?.id) filters.category_id = selectedCategory.id;

        console.log('🔄 Refreshing with filterApi:', filters);

        const response = await filterApi.getFilteredWorkers(filters);

        const workers = response.workers || [];
        
        const transformedWorkers = workers.map(worker => ({
          ...worker,
          specialname1: worker.specialname1 || '',
          specialvalue1: worker.specialvalue1 || '',
          specialname2: worker.specialname2 || '',
          specialvalue2: worker.specialvalue2 || '',
          specialname3: worker.specialname3 || '',
          specialvalue3: worker.specialvalue3 || '',
          json_properties: worker.json_properties || []
        }));

        setFilteredWorkers(transformedWorkers);

        if (!selectedCategory?.id) {
          setInitialWorkers(transformedWorkers);
          const newSpecialItem = getRandomSpecialItem(transformedWorkers);
          setSpecialItem(newSpecialItem);
        }

        setPagination({
          current_page: response.pagination?.current_page || 1,
          total_pages: response.pagination?.total_pages || 0,
          total_count: response.pagination?.total_count || transformedWorkers.length,
          has_next: response.pagination?.has_next || false,
          per_page: response.pagination?.per_page || 10
        });
      }

      ToastAndroid.show('آگهی‌ها با موفقیت بروزرسانی شدند', ToastAndroid.SHORT);
    } catch (error) {
      console.error('❌ Refresh error:', error);
      ToastAndroid.show('خطا در بروزرسانی', ToastAndroid.SHORT);
    } finally {
      setRefreshing(false);
      setLoadingWorkers(false);
    }
  };

  const handleLoadMore = async () => {
    if (!pagination.has_next || isLoadingMore) return;
    setIsLoadingMore(true);
    
    try {
      if (selectedCategory && filterComponentRef.current) {
        console.log('📦 Loading more through FilterComponent');
        const result = await filterComponentRef.current.loadMoreData();
        
        if (result && result.workers) {
          const newWorkers = result.workers.map(worker => ({
            ...worker,
            specialname1: worker.specialname1 || '',
            specialvalue1: worker.specialvalue1 || '',
            specialname2: worker.specialname2 || '',
            specialvalue2: worker.specialvalue2 || '',
            specialname3: worker.specialname3 || '',
            specialvalue3: worker.specialvalue3 || '',
            json_properties: worker.json_properties || []
          }));

          setFilteredWorkers(prev => [...prev, ...newWorkers]);
          setPagination(result.pagination);
        }
      } else {
        const cityToUse = latestCityRef.current;
        const nextPage = pagination.current_page + 1;
        const params = {
          lat: userInitialLat,
          long: userInitialLong,
          category_id: selectedCategory?.id || null,
          page: nextPage,
        };
        if (cityToUse?.id) params.city_id = cityToUse.id;

        const res = await axios.get(
          'https://api.ajur.app/api/server-filtered-workers',
          {params, timeout: 10000},
        );
        const newWorkers = res.data.workers || [];

        setFilteredWorkers(prev => [...prev, ...newWorkers]);
        setPagination(prev => ({
          ...prev,
          current_page: nextPage,
          has_next: newWorkers.length >= 10,
          total_count: prev.total_count + newWorkers.length,
        }));
      }
    } catch (err) {
      ToastAndroid.show('خطا در بارگذاری بیشتر آگهی‌ها', ToastAndroid.SHORT);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const getCityFromStorage = async () => {
    try {
      const cityString = await AsyncStorage.getItem('selectedCity');
      if (cityString) {
        const city = JSON.parse(cityString);
        setSelectedCity(city);
        return city;
      }
      return null;
    } catch (error) {
      console.error('Error loading city from storage:', error);
      return null;
    }
  };

  useEffect(() => {
    getCityFromStorage();
  }, []);

  useEffect(() => {
    if (
      userInitialLat &&
      userInitialLong &&
      selectedCity &&
      !selectedCategory
    ) {
      setFilteredWorkers([]);
      loadInitialWorkers(userInitialLat, userInitialLong);
    }
  }, [selectedCity, userInitialLat, userInitialLong, selectedCategory]);

  useEffect(() => {
    if (selectedCategory?.id) {
      setLoadingWorkers(true);
      setFilteredWorkers([]);
      fetchCategoryFields(selectedCategory.id);
      
      setTimeout(() => {
        setLoadingWorkers(false);
      }, 500);
    } else {
      setNormalFields([]);
      setTickFields([]);
      setPredefineFields([]);
    }
  }, [selectedCategory]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (modalVisible) {
          closeModal();
          return true;
        }
        return false;
      },
    );
    return () => backHandler.remove();
  }, [modalVisible]);

  const checkLocationPermission = async () => {
    if (Platform.OS === 'ios') return true;
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted;
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') return true;
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'دسترسی به موقعیت مکانی',
        message:
          'برای نمایش خدمات نزدیک به شما، به دسترسی موقعیت مکانی نیاز داریم',
        buttonNeutral: 'بعداً بپرس',
        buttonNegative: 'لغو',
        buttonPositive: 'تأیید',
      },
    );
    await AsyncStorage.setItem('locationPermissionAsked', 'true');
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const getFallbackLocation = async () => {
    try {
      const lat = await AsyncStorage.getItem('cityCenterLat');
      const long = await AsyncStorage.getItem('cityCenterLong');
      if (lat && long) return {lat: parseFloat(lat), long: parseFloat(long)};
    } catch (e) {}
    return {lat: 35.6892, long: 51.389};
  };

  const retryLoadData = () => {
    console.log('🔄 Retry button pressed - resetting and reloading...');
    setConnectionTimeout(false);
    set_loading(true);
    setIsInitialLoading(true);
    setErrorModalVisible(false);
    setRetryCount(prev => prev + 1);
    loadData(selectedCity);
  };

  const loadInitialWorkers = async (lat, long) => {
    setLoadingWorkers(true);
    try {
      const cityToUse = latestCityRef.current;
      
      const filters = {
        lat,
        long,
        page: 1,
        per_page: 10
      };
      
      if (cityToUse?.id) filters.city_id = cityToUse.id;
      if (selectedCategory?.id) filters.category_id = selectedCategory.id;

      console.log('📡 Fetching workers with filters:', filters);

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('timeout')), 10000);
      });

      const response = await Promise.race([
        filterApi.getFilteredWorkers(filters),
        timeoutPromise
      ]);

      const workers = response.workers || [];
      
      const transformedWorkers = workers.map(worker => ({
        ...worker,
        specialname1: worker.specialname1 || '',
        specialvalue1: worker.specialvalue1 || '',
        specialname2: worker.specialname2 || '',
        specialvalue2: worker.specialvalue2 || '',
        specialname3: worker.specialname3 || '',
        specialvalue3: worker.specialvalue3 || '',
        json_properties: worker.json_properties || []
      }));

      setInitialWorkers(transformedWorkers);
      setFilteredWorkers(transformedWorkers);
      
      const randomSpecial = getRandomSpecialItem(transformedWorkers);
      setSpecialItem(randomSpecial);
      
      setPagination({
        current_page: response.pagination?.current_page || 1,
        total_pages: response.pagination?.total_pages || 0,
        total_count: response.pagination?.total_count || transformedWorkers.length,
        has_next: response.pagination?.has_next || false,
        per_page: response.pagination?.per_page || 10
      });
      
    } catch (err) {
      console.error('loadInitialWorkers error:', err);
      setFilteredWorkers([]);
      setInitialWorkers([]);
      setSpecialItem(null);
      
      if (err.message === 'timeout') {
        ToastAndroid.show('ارتباط با سرور برقرار نشد', ToastAndroid.LONG);
        setConnectionTimeout(true);
      } else {
        ToastAndroid.show('خطا در دریافت آگهی‌ها', ToastAndroid.SHORT);
      }
    } finally {
      setLoadingWorkers(false);
    }
  };

  const loadData = async (forceCity = null) => {
    try {
      setConnectionTimeout(false);
      set_loading(true);
      setIsInitialLoading(true);
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('timeout')), 15000);
      });

      let city = forceCity || selectedCity;
      if (!city) {
        const cityString = await AsyncStorage.getItem('selectedCity');
        if (cityString) {
          city = JSON.parse(cityString);
          setSelectedCity(city);
        } else {
          console.log('No city selected, loading without city filter');
        }
      }
  
      const fb = await getFallbackLocation();
      const lat = fb.lat;
      const long = fb.long;
  
      set_userInitialLat(lat);
      set_userInitialLong(long);
  
      const apiParams = {
        lat: lat,
        long: long,
      };
      
      if (city?.id) {
        apiParams.city_id = city.id;
        console.log('📡 Calling base API with city_id:', city.id);
      } else {
        console.log('📡 Calling base API without city_id (using lat/long only)');
      }
  
      console.log('📡 Making API call to /base with timeout 15s...');
      
      const baseRes = await Promise.race([
        axios.get('https://api.ajur.app/api/base', {
          params: apiParams,
          timeout: 10000,
        }),
        timeoutPromise
      ]);
      
      console.log('✅ Base API response received');
      
      set_title1(baseRes.data.title1);
      set_title2(baseRes.data.title2);
      set_title3(baseRes.data.title3);
      set_collection1(baseRes.data.collection1);
      set_collection2(baseRes.data.collection2);
      set_collection3(baseRes.data.collection3);
      set_realstates(baseRes.data.realstates);
      set_main_cats(baseRes.data.main_cats);
      set_sub_cats(baseRes.data.sub_cats);
      
      const newNeighborhoods = baseRes.data.the_neighborhoods || [];
      console.log('📡 Setting neighborhoods for city:', city?.title, 'Count:', newNeighborhoods.length);
      set_neighborhoods(newNeighborhoods);
  
      await loadInitialWorkers(lat, long);
      set_loading(false);
      setConnectionTimeout(false);
      setIsInitialLoading(false);
    } catch (err) {
      console.error('LoadData error:', err);
      set_loading(false);
      setIsInitialLoading(false);
      
      if (err.message === 'timeout') {
        setConnectionTimeout(true);
        ToastAndroid.show('ارتباط با سرور برقرار نشد', ToastAndroid.LONG);
      } else if (err.message?.includes('Network Error')) {
        setConnectionTimeout(true);
      } else {
        setErrorModalVisible(true);
      }
    }
  };

  const fetchCategoryFields = async (categoryId, retryCount = 0) => {
    if (!categoryId) return;
    setLoadingFields(true);
    try {
      const res = await axios.get('https://api.ajur.app/api/category-fields', {
        params: {cat: categoryId},
        timeout: 10000,
      });

      const process = fields =>
  Array.isArray(fields)
    ? fields
        .filter(f => f && f.value)
        .map(f => ({
          id: f.id,
          name: f.value,
          value: f.value,
          label: f.value,
          slug: f.slug,
          unit: f.unit,
          type: f.type,
          min_range: f.min_range,
          max_range: f.max_range,
          low: f.low,
          high: f.high,
          special: f.special,
          sort: f.sort,
          options: Array.isArray(f.vars) ? f.vars : (Array.isArray(f.varchars) ? f.varchars : []),
          key: f.id?.toString() || f.value,
        }))
    : [];


      console.log('📡 RAW API RESPONSE from /category-fields:');
      console.log('  normal_fields:', res.data.normal_fields?.map(f => ({ name: f.value, type: f.type })));
      console.log('  tick_fields:', res.data.tick_fields?.map(f => ({ name: f.value, type: f.type })));
      console.log('  predefine_fields:', res.data.predefine_fields?.map(f => ({ name: f.value, type: f.type })));
      console.log('  Full predefine_fields:', JSON.stringify(res.data.predefine_fields, null, 2));
      

      setNormalFields(process(res.data.normal_fields || []));
      setTickFields(process(res.data.tick_fields || []));
      setPredefineFields(process(res.data.predefine_fields || []));
    } catch (err) {
      setNormalFields([]);
      setTickFields([]);
      setPredefineFields([]);
      ToastAndroid.show('خطا در دریافت فیلترها', ToastAndroid.SHORT);
    } finally {
      setLoadingFields(false);
    }
  };

  // ============ MODIFIED: Main useEffect - loads data after UI renders ============
  useEffect(() => {
    // ✅ Load data after a small delay so UI renders first
    const timer = setTimeout(() => {
      loadData();
    }, 50);

    const interval = setInterval(() => {
      NetInfo.fetch().then(s => {
        set_net_connect_status(s.isConnected);
      });
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const handleMainCategoryPress = (type, title) => {
    const filtered = sub_cats.filter(c => c.type === type);
    setModalContent(filtered);
    setModalTitle(title);
    const rows = Math.ceil(filtered.length / 4);
    const h = Math.min(
      SCREEN_HEIGHT * 0.8,
      Math.max(SCREEN_HEIGHT * 0.4, 120 + rows * 100),
    );
    setModalHeight(h);
    setModalVisible(true);
  };

  const goToCategory = cat => {
    setSelectedCategory(cat);
    closeModal();
  };

  const handleCitySelect = async city => {
    setLoadingWorkers(true);
    set_loading(true);
    setIsInitialLoading(true);
    
    setSelectedCity(city);
    await AsyncStorage.setItem('selectedCity', JSON.stringify(city));
  
    setSelectedCategory(null);
    setNormalFields([]);
    setTickFields([]);
    setPredefineFields([]);
    setFilteredWorkers([]);
    setInitialWorkers([]);
    setSpecialItem(null);
    setPagination({
      current_page: 1,
      total_count: 0,
      has_next: false,
    });
  
    ToastAndroid.show(`شهر ${city.title} انتخاب شد`, ToastAndroid.SHORT);
    
    await loadData(city);
    
    setLoadingWorkers(false);
    setIsInitialLoading(false);
  };

  const renderSpecialItem = () => {
    if (!specialItem) return null;
    
    return (
      <View style={styles.specialContainer}>
        <WorkerCard data={specialItem} />
      </View>
    );
  };

  const renderMainCategoryButtons = () => (
    <View style={styles.mainCategoryContainer}>
      <TouchableOpacity
        style={[styles.mainCategoryButton, styles.rentButton]}
        onPress={() => handleMainCategoryPress('rent', 'رهن و اجاره')}>
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
        onPress={() => handleMainCategoryPress('sell', 'خرید')}>
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

  const renderNewAdButton = () => (
    <TouchableOpacity
      style={styles.newAdButton}
      onPress={() => {
        AsyncStorage.getItem('id_token').then(t =>
          navigation.navigate(t ? 'NewWorker' : 'Rlogin'),
        );
      }}>
      <View style={styles.newAdButtonContent}>
        <Icon name="add-circle-outline" size={40} color="#b92a31" />
        <Text style={styles.newAdButtonText}>ثبت آگهی جدید</Text>
      </View>
    </TouchableOpacity>
  );

  const renderModalContent = () => (
    <Animated.View
      style={[
        styles.modalContainer,
        {transform: [{translateY}], height: modalHeight},
      ]}
      {...panResponder.panHandlers}>
      <View style={styles.grabber} />
      <Text style={styles.modalTitle}>{modalTitle}</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.modalScrollContent}>
        <View style={styles.gridContainer}>
          {modalContent.map((cat, i) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.gridItem}
              onPress={() => goToCategory(cat)}>
              <SubCatCard cat={cat} index={i} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Animated.View>
  );

  const renderOrSpinner = () => {
    // Show timeout error if connection timeout
    if (connectionTimeout) {
      return (
        <View style={styles.timeoutContainer}>
          <Icon name="wifi-outline" size={80} color="#ccc" />
          <Text style={styles.timeoutTitle}>ارتباط با سرور برقرار نشد</Text>
          <Text style={styles.timeoutText}>
            لطفاً اتصال اینترنت خود را بررسی کنید و مجدداً تلاش نمایید
          </Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => {
              console.log('Retry button pressed from timeout view');
              retryLoadData();
            }}>
            <Icon name="refresh-outline" size={24} color="#fff" />
            <Text style={styles.retryButtonText}>تلاش مجدد</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!net_connect_status) {
      return (
        <View style={styles.spinnerView}>
          <TouchableOpacity onPress={() => {
            setConnectionTimeout(false);
            set_loading(true);
            setIsInitialLoading(true);
            loadData(selectedCity);
          }}>
            <Icon
              name="ios-refresh"
              style={{fontSize: 35, color: 'red', marginBottom: 10}}
            />
            <Text style={styles.itemText}>تلاش مجدد</Text>
          </TouchableOpacity>
          <Image
            source={require('./assets/broken-brick.jpg')}
            style={{height: 200, width: 200}}
          />
          <Text style={{padding: 10, color: 'gray'}}>
            اتصال خود به اینترنت را بررسی کنید
          </Text>
        </View>
      );
    }

    // ============ MODIFIED: Show Skeleton instead of Spinner ============
    if (loading) {
      return <LoadingSkeleton />;
    }

    return (
      <NativeBaseProvider>
        <SearchBars
          realstates={realstates}
          onCitySelect={handleCitySelect}
          onSearchResultSelect={handleSearchResultSelect}
        />

        {selectedCategory && (
          <View style={styles.fixedFilterBar}>
            <View style={styles.filterComponentWrapper}>
              <FilterComponent
                ref={filterComponentRef}
                key={selectedCity?.id || 'no-city'}
                onFilteredDataChange={(data, pag) => {
                  setFilteredWorkers(data);
                  setPagination(pag);
                }}
                onSpecialItemChange={(item) => {
                  setSpecialItem(item);
                }}
                availableCategories={sub_cats}
                availableNeighborhoods={neighborhoods}
                initialCategory={selectedCategory}
                userLocation={{lat: userInitialLat, long: userInitialLong}}
                selectedCity={selectedCity}
                categoryFields={{
                  normal: normalFields,
                  tick: tickFields,
                  predefine: predefineFields,
                }}
                loadingFields={loadingFields}
                onCategoryChange={setSelectedCategory}
              />
            </View>
          </View>
        )}

        <View style={styles.resultsSection}>
          {loadingWorkers || isApplyingSearchFilter ? (
            <View style={styles.loadingContainer}>
              <Spinner isVisible size={40} type="Circle" color="#b92a31" />
              <Text style={styles.loadingText}>
                {isApplyingSearchFilter ? 'در حال اعمال فیلتر...' : 'در حال بارگذاری آگهی‌ها...'}
              </Text>
            </View>
          ) : filteredWorkers.length > 0 ? (
            <View style={styles.resultsListContainer}>
              <FlatList
                data={filteredWorkers}
                keyExtractor={item =>
                  item.id?.toString() || Math.random().toString()
                }
                renderItem={({item}) => <WorkerCard data={item} />}
                showsVerticalScrollIndicator={false}
                scrollEnabled={true}
                onEndReachedThreshold={0.3}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    colors={['#b92a31']}
                    tintColor="#b92a31"
                    title="در حال بروزرسانی..."
                    titleColor="#b92a31"
                    progressBackgroundColor="#ffffff"
                  />
                }
                onEndReached={handleLoadMore}
                ListHeaderComponent={
                  <View>
                    {!selectedCategory ? (
                      <>
                        {renderNewAdButton()}
                        {renderMainCategoryButtons()}
                      </>
                    ) : (
                      <View style={styles.categoryHeader} />
                    )}
                    {renderSpecialItem()}
                  </View>
                }
                ListFooterComponent={
                  isLoadingMore ? (
                    <View style={styles.loadingMoreContainer}>
                      <Spinner
                        isVisible
                        size={28}
                        type="Circle"
                        color="#b92a31"
                      />
                      <Text style={styles.loadingMoreText}>
                        در حال بارگذاری آگهی‌های بیشتر...
                      </Text>
                    </View>
                  ) : pagination.has_next ? (
                    <View style={styles.loadingMoreContainer}>
                      <TouchableOpacity
                        style={styles.loadMoreButton}
                        onPress={handleLoadMore}>
                        <Text style={styles.loadMoreText}>
                          نمایش آگهی‌های بیشتر
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : filteredWorkers.length > 10 ? (
                    <View style={styles.endOfListContainer}>
                      <Text style={styles.endOfListText}>
                        همه آگهی‌ها نمایش داده شد
                      </Text>
                    </View>
                  ) : null
                }
              />
            </View>
          ) : !isInitialLoading && filteredWorkers.length === 0 ? (
            <View style={styles.noResults}>
              <Icon name="search-outline" size={50} color="#ccc" />
              <Text style={styles.noResultsText}>
                هیچ آگهی‌ای یافت نشد
              </Text>
              
              <View style={styles.promotionalContainer}>
                <Text style={styles.promotionalText}>
                 {' با فیلترهای انتخاب شده ملکی در '}
                    { selectedCity ? selectedCity.title : ' شهر ' } 

                    {' روی آجر یافت نشد  '}
                    
                </Text>
                
                <TouchableOpacity 
                  style={styles.promoButton}
                  onPress={() => {
                    setFieldValues({});
                    setActiveFieldFilters([]);
                    setNormalFields([]);
                    setTickFields([]);
                    setPredefineFields([]);
                    setSelectedCategory(null);
                    setFilteredWorkers([]);
                    setSpecialItem(null);
                    
                    if (filterComponentRef.current) {
                      filterComponentRef.current.clearNeighborhoods && filterComponentRef.current.clearNeighborhoods();
                      if (filterComponentRef.current.handleResetAll) {
                        filterComponentRef.current.handleResetAll();
                      }
                    }
                    
                    setPagination({
                      current_page: 1,
                      total_count: 0,
                      has_next: false,
                      total_pages: 0,
                      per_page: 10
                    });
                    
                    if (userInitialLat && userInitialLong) {
                      loadInitialWorkers(userInitialLat, userInitialLong);
                    }
                    
                    ToastAndroid.show('همه فیلترها حذف شدند', ToastAndroid.SHORT);
                  }}
                >
                  <Text style={styles.promoButtonText}>حذف فیلترهای فعلی</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>

        <NewWorkerFab navigation={navigation} />

        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
          onRequestClose={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.modalBackdrop}
              activeOpacity={1}
              onPress={closeModal}
            />
            {renderModalContent()}
          </View>
        </Modal>
      </NativeBaseProvider>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#b92a31" barStyle="light-content" />
      {renderOrSpinner()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  timeoutContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
  },
  timeoutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'iransans',
    marginTop: 20,
    marginBottom: 10,
  },
  timeoutText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'iransans',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#b92a31',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 30,
    gap: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'iransans',
    fontWeight: 'bold',
  },
  cityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e8f5e8',
    padding: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#d4edda',
  },
  cityIndicatorText: {
    color: '#155724',
    fontSize: 14,
    fontFamily: 'iransans',
    marginRight: 6,
    flex: 1,
  },
  refreshCityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d4edda',
  },
  refreshCityText: {
    color: '#b92a31',
    fontSize: 12,
    fontFamily: 'iransans',
    marginRight: 4,
  },
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterComponentWrapper: {flex: 1, marginLeft: 10},
  
  specialContainer: {
    marginBottom: 10,
    marginTop: 2,
    paddingHorizontal: 1,
  },
  specialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  specialTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DAA520',
    fontFamily: 'iransans',
  },
  specialBadge: {
    backgroundColor: '#DAA520',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  specialBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'iransans',
  },
  
  mainCategoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingVertical: 10,
    marginBottom: 10,
  },
  mainCategoryButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    minHeight: 70,
  },
  rentButton: {backgroundColor: '#fcfcfc'},
  sellButton: {backgroundColor: '#fcfcfc'},
  buttonContent: {flexDirection: 'column', alignItems: 'center'},
  mainCategoryButtonText: {
    color: '#333',
    fontSize: 18,
    fontFamily: 'iransans',
    marginTop: 8,
  },
  customIcon: {width: 40, height: 40},
  newAdButton: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginHorizontal: 25,
    marginBottom: 5,
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newAdButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newAdButtonText: {
    color: 'gray',
    fontSize: 18,
    fontFamily: 'iransans',
    marginLeft: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 15,
    paddingBottom: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  modalBackdrop: {
    flex: 1,
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
  modalScrollContent: {paddingBottom: 10},
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 8,
  },
  gridItem: {width: '25%', padding: 6},
  resultsSection: {
    flex: 1,
    marginTop: 0,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  resultsCount: {fontSize: 16, color: '#333', fontFamily: 'iransans'},
  loadingMoreContainer: {
    paddingVertical: 100,
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingMoreText: {
    color: '#b92a31',
    fontSize: 15,
    fontFamily: 'iransans',
    marginTop: 12,
    fontWeight: '600',
  },
  loadMoreButton: {
    backgroundColor: '#b92a31',
    paddingVertical: 16,
    paddingHorizontal: 42,
    borderRadius: 30,
    minWidth: 240,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 16,
  },
  loadMoreText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'iransans',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    lineHeight: 22,
  },
  endOfListContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endOfListText: {
    color: '#888',
    fontSize: 15,
    fontFamily: 'iransans',
    fontWeight: '500',
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
  spinnerView: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#b92a31',
    fontFamily: 'iransans',
  },
  promotionalContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  promotionalText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    fontFamily: 'iransans',
    lineHeight: 22,
    marginBottom: 20,
  },
  promoButton: {
    backgroundColor: '#b92a31',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'iransans',
    fontWeight: 'bold',
  },
  resultsListContainer: {
    flex: 1,
  },
  // ============ NEW: Skeleton Styles ============
  skeletonContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  skeletonHeader: {
    marginBottom: 16,
  },
  skeletonSearchBar: {
    height: 44,
    backgroundColor: '#e0e0e0',
    borderRadius: 22,
    marginBottom: 8,
  },
  skeletonCard: {
    height: 120,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    marginBottom: 12,
  },
});

export default Search;