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

import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Spinner from 'react-native-spinkit';
import NetInfo from '@react-native-community/netinfo';
import  {filterApi}  from './filter/services/filterApi';

const Search = ({navigation, route}) => {
  const [loading, set_loading] = useState(true);
  const [loadingWorkers, setLoadingWorkers] = useState(false);
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

  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [normalFields, setNormalFields] = useState([]);
  const [tickFields, setTickFields] = useState([]);
  const [predefineFields, setPredefineFields] = useState([]);
  const [loadingFields, setLoadingFields] = useState(false);

  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [initialWorkers, setInitialWorkers] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 0,
    total_count: 0,
    has_next: false,
  });
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [selectedCity, setSelectedCity] = useState(null);

  // This ref always holds the latest city – fixes race condition
  const latestCityRef = useRef(selectedCity);
  useEffect(() => {
    latestCityRef.current = selectedCity;
  }, [selectedCity]);

  // Handle incoming search params
  useEffect(() => {
    const handleIncomingParams = async () => {
      if (route?.params?.searchParams) {
        const {category, categoryName, neighborhood, city} =
          route.params.searchParams;

        console.log('Received search params:', route.params.searchParams);

        // If city is provided, update it first
        if (city && city.id !== selectedCity?.id) {
          await handleCitySelect(city);
        }

        // Wait a bit for sub_cats to load if needed
        if (sub_cats.length === 0) {
          console.log('Waiting for sub_cats to load...');
          return;
        }

        // Find the matching category from sub_cats
        let foundCategory = null;

        // Try to find by category array first
        if (category && Array.isArray(category)) {
          foundCategory = sub_cats.find(cat => {
            return (
              JSON.stringify(cat.category_array) === JSON.stringify(category)
            );
          });
        }

        // If not found, try by category name
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

        // Clear the params to prevent re-triggering
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

    // If city is provided and different, update it
    if (city && city.id !== selectedCity?.id) {
      handleCitySelect(city);
    }

    // Wait a moment for city to update, then find category
    setTimeout(() => {
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
        setSelectedCategory(foundCategory);
        ToastAndroid.show(
          `فیلتر برای ${foundCategory.title} اعمال شد`,
          ToastAndroid.SHORT,
        );
      } else {
        console.log('No matching category found for:', categoryName);
        ToastAndroid.show('دسته‌بندی یافت نشد', ToastAndroid.SHORT);
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

    // Use filterApi service
    const response = await filterApi.getFilteredWorkers(filters);

    const workers = response.workers || [];
    
    // Transform workers
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
    }

    setPagination({
      current_page: response.pagination?.current_page || 1,
      total_pages: response.pagination?.total_pages || 0,
      total_count: response.pagination?.total_count || transformedWorkers.length,
      has_next: response.pagination?.has_next || false,
      per_page: response.pagination?.per_page || 10
    });

    ToastAndroid.show('آگهی‌ها با موفقیت بروزرسانی شدند', ToastAndroid.SHORT);
  } catch (error) {
    console.error('❌ Refresh error:', error);
    ToastAndroid.show('خطا در بروزرسانی', ToastAndroid.SHORT);
  } finally {
    setRefreshing(false);
    setLoadingWorkers(false);
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

  // City change → reload workers (only when no category selected)
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

  // Category change → reset fields AND show loading
  useEffect(() => {
    if (selectedCategory?.id) {
      // Show loading when category is selected
      setLoadingWorkers(true);
      setFilteredWorkers([]);
      fetchCategoryFields(selectedCategory.id);
      
      // Simulate loading or call API
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

  // Update your loadInitialWorkers function with more detailed logging
const loadInitialWorkers = async (lat, long) => {
  setLoadingWorkers(true);
  try {
    const cityToUse = latestCityRef.current;
    
    // Build filters object for filterApi
    const filters = {
      lat,
      long,
      page: 1,
      per_page: 10
    };
    
    if (cityToUse?.id) filters.city_id = cityToUse.id;
    if (selectedCategory?.id) filters.category_id = selectedCategory.id;

    // Show alert with filters being sent
    // Alert.alert('🔍 Filters Being Sent', 
    //   JSON.stringify(filters, null, 2)
    // );

    // Use the filterApi service instead of direct axios call
    const response = await filterApi.getFilteredWorkers(filters);

    // Show response alert
    // Alert.alert('✅ API Response', 
    //   `Status: ${response.status}\n` +
    //   `Workers: ${response.workers?.length || 0}\n` +
    //   `Message: ${response.message || 'No message'}\n` +
    //   `Error: ${response.error || 'None'}`
    // );

    // Check if response has error
    // if (response.error) {
    //   Alert.alert('❌ API Error in Response', response.message);
    //   throw new Error(`API Error: ${response.message}`);
    // }

    const workers = response.workers || [];
    
    // Transform workers if needed for your WorkerCard component
    const transformedWorkers = workers.map(worker => ({
      ...worker,
      // Ensure these fields exist for backward compatibility
      specialname1: worker.specialname1 || '',
      specialvalue1: worker.specialvalue1 || '',
      specialname2: worker.specialname2 || '',
      specialvalue2: worker.specialvalue2 || '',
      specialname3: worker.specialname3 || '',
      specialvalue3: worker.specialvalue3 || '',
      // Add json_properties if not present
      json_properties: worker.json_properties || []
    }));

    // Alert.alert('📊 Workers Data Ready', 
    //   `Count: ${transformedWorkers.length}\n` +
    //   `First Worker: ${transformedWorkers[0]?.name?.substring(0, 20) || 'None'}`
    // );

    setInitialWorkers(transformedWorkers);
    setFilteredWorkers(transformedWorkers);
    
    // Set pagination from API response
    setPagination({
      current_page: response.pagination?.current_page || 1,
      total_pages: response.pagination?.total_pages || 0,
      total_count: response.pagination?.total_count || transformedWorkers.length,
      has_next: response.pagination?.has_next || false,
      per_page: response.pagination?.per_page || 10
    });
    
    // Alert.alert('✅ Success', 'Workers loaded successfully!');
    
  } catch (err) {
    // Show detailed error alert
    // Alert.alert('❌ Error in loadInitialWorkers', 
    //   `Message: ${err.message}\n` +
    //   `Name: ${err.name}\n` +
    //   `Stack: ${err.stack?.split('\n')[0] || 'No stack'}`
    // );
    
    setFilteredWorkers([]);
    setInitialWorkers([]);
    ToastAndroid.show('خطا در دریافت آگهی‌ها', ToastAndroid.SHORT);
  } finally {
    setLoadingWorkers(false);
  }
};

  const handleLoadMore = async () => {
    if (!pagination.has_next || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
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
    } catch (err) {
      ToastAndroid.show('خطا در بارگذاری بیشتر آگهی‌ها', ToastAndroid.SHORT);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const loadData = async () => {
    try {
      await getCityFromStorage();

      let lat, long;
      const hasPerm = await checkLocationPermission();

      if (hasPerm) {
        try {
          const pos = await new Promise((res, rej) => {
            Geolocation.getCurrentPosition(res, rej, {
              enableHighAccuracy: false,
              timeout: 8000,
            });
          });
          lat = pos.coords.latitude;
          long = pos.coords.longitude;
        } catch (e) {
          const fb = await getFallbackLocation();
          lat = fb.lat;
          long = fb.long;
        }
      } else {
        const granted = await requestLocationPermission();
        if (granted) {
          const pos = await new Promise((res, rej) =>
            Geolocation.getCurrentPosition(res, rej, {timeout: 8000}),
          );
          lat = pos.coords.latitude;
          long = pos.coords.longitude;
        } else {
          const fb = await getFallbackLocation();
          lat = fb.lat;
          long = fb.long;
        }
      }

      set_userInitialLat(lat);
      set_userInitialLong(long);

      const baseRes = await axios.get('https://api.ajur.app/api/base', {
        params: {lat, long},
        timeout: 7000,
      });
      set_title1(baseRes.data.title1);
      set_title2(baseRes.data.title2);
      set_title3(baseRes.data.title3);
      set_collection1(baseRes.data.collection1);
      set_collection2(baseRes.data.collection2);
      set_collection3(baseRes.data.collection3);
      set_realstates(baseRes.data.realstates);
      set_main_cats(baseRes.data.main_cats);
      set_sub_cats(baseRes.data.sub_cats);

      await loadInitialWorkers(lat, long);
      set_loading(false);
    } catch (err) {
      set_loading(false);
      setErrorModalVisible(true);
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
                options: f.vars || f.varchars || [],
                key: f.id?.toString() || f.value,
              }))
          : [];

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

  useEffect(() => {
    const interval = setInterval(() => {
      NetInfo.fetch().then(s => {
        set_net_connect_status(s.isConnected);
        if (!s.isConnected) {
          ToastAndroid.showWithGravityAndOffset(
            'اتصال اینترنت را بررسی کنید',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
            25,
            50,
          );
        }
      });
    }, 5000);

    loadData();

    return () => clearInterval(interval);
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
    
    // Show loading when city changes
    setLoadingWorkers(true);
    
    // Save new city
    setSelectedCity(city);
    await AsyncStorage.setItem('selectedCity', JSON.stringify(city));

    // FULL RESET when city changes
    setSelectedCategory(null);
    setNormalFields([]);
    setTickFields([]);
    setPredefineFields([]);
    setFilteredWorkers([]);
    setInitialWorkers([]);
    setPagination({
      current_page: 1,
      total_count: 0,
      has_next: false,
    });

    // Show toast
    ToastAndroid.show(`شهر ${city.title} انتخاب شد`, ToastAndroid.SHORT);
    
    // Load workers for new city
    if (userInitialLat && userInitialLong) {
      await loadInitialWorkers(userInitialLat, userInitialLong);
    }
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
        <Icon name="add-circle-outline" size={32} color="gray" />
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
    if (!net_connect_status) {
      return (
        <View style={styles.spinnerView}>
          <TouchableOpacity onPress={loadData}>
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

    if (loading) {
      return (
        <View style={styles.spinnerView}>
          <Spinner isVisible size={30} type="Circle" color="#b92a31" />
        </View>
      );
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
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setSelectedCategory(null);
                setFilteredWorkers(initialWorkers);
                setNormalFields([]);
                setTickFields([]);
                setPredefineFields([]);
                ToastAndroid.show('فیلتر حذف شد', ToastAndroid.SHORT);
              }}>
              <Icon name="arrow-back" size={24} color="#b92a31" />
            </TouchableOpacity>
            <View style={styles.filterComponentWrapper}>
              <FilterComponent
                key={selectedCity?.id || 'no-city'}
                onFilteredDataChange={(data, pag) => {
                  setFilteredWorkers(data);
                  setPagination(pag);
                }}
                availableCategories={sub_cats}
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
          {loadingWorkers ? (
            <View style={styles.loadingContainer}>
              <Spinner isVisible size={40} type="Circle" color="#b92a31" />
              <Text style={styles.loadingText}>در حال بارگذاری آگهی‌ها...</Text>
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
                    {!selectedCategory && (
                      <>
                        {renderNewAdButton()}
                        {renderMainCategoryButtons()}

                        {filteredWorkers.length > 0 && (
                          <View style={styles.resultsHeader}>
                            <Text style={styles.resultsCount}>
                              {pagination.total_count} ملک  
                              {selectedCity && ` (شهر: ${selectedCity.title})`}
                              {selectedCategory &&
                                ` (دسته‌بندی: ${selectedCategory.title})`}
                            </Text>
                          </View>
                        )}
                      </>
                    )}
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
          ) : (
            <View style={styles.noResults}>
              <Icon name="search-outline" size={50} color="#ccc" />
              <Text style={styles.noResultsText}>
                هیچ آگهی‌ای یافت نشد
              </Text>
              
              {/* Promotional section - only shows when no results */}
              <View style={styles.promotionalContainer}>
                <Text style={styles.promotionalText}>
                  اگر ملکی برای معامله دارید اولین آگهی را در {selectedCity ? selectedCity.title : 'شهر'} ثبت کنید تا خدمات ویژه‌ای از آجر دریافت کنید
                </Text>
                
                <TouchableOpacity 
                  style={styles.promoButton}
                  onPress={() => {
                    AsyncStorage.getItem('id_token').then(t =>
                      navigation.navigate(t ? 'NewWorker' : 'Rlogin'),
                    );
                  }}
                >
                  <Text style={styles.promoButtonText}>ثبت آگهی جدید</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginHorizontal: 25,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    minHeight: 60,
  },
  newAdButtonContent: {flexDirection: 'row', alignItems: 'center'},
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
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#a92b31',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoButtonText: {
    color: '#a92b31',
    fontSize: 16,
    fontFamily: 'iransans',
    fontWeight: 'bold',
  },
  resultsListContainer: {
    flex: 1,
  },
});

export default Search;