import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator, ScrollView} from 'react-native';
import {debounce} from 'lodash';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import TimeFilter from './TimeFilter';
import TimeDisplay from './TimeDisplay';
import styles from '../assets/MainMap.styles';

const useMapLogic = (props) => {
  const navigation = useNavigation();
  const {route} = props;
  
  // Refs
  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const regionChangeTimeoutRef = useRef(null);
  const latestRegionRef = useRef(null);
  const markerPressTimeoutRef = useRef(null);
  const isFirstLoadRef = useRef(true);
  const filteredWorkersRef = useRef([]);
  const lastFetchCenterRef = useRef(null);

  // State
  const [region, setRegion] = useState({
    latitude: 35.6997326,
    longitude: 51.3354612,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  
  const [loading, setLoading] = useState(true);
  const [workers, setWorkers] = useState([]);
  const [filtered_workers, setFilteredWorkers] = useState([]);
  const [visibleMarkers, setVisibleMarkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showFooter, setShowFooter] = useState(false);
  const [mapType, setMapType] = useState('standard');
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isHintModalVisible, set_isHintModalVisible] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [search_places, setSearchPlaces] = useState([]);
  const [loading_search_place, setLoadingSearchPlace] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mapOrList, setMapOrList] = useState('map');
  const [isFooterExpanded, setIsFooterExpanded] = useState(false);
  const [userLat, setUserLat] = useState(null);
  const [userLong, setUserLong] = useState(null);
  const [cats, setCats] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [timeRange, setTimeRange] = useState('threemonths');
  const [normal_fields, setNormalFields] = useState([]);
  const [tick_fields, setTickFields] = useState([]);
  const [tick_properties, setTickProperties] = useState([]);
  const [properties, setProperties] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(14);
  const [filter_level, set_filter_level] = useState('base');
  const [filter_selectedCategoryegory_name, set_filter_selectedCategoryegory_name] = useState('');
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  // Helper functions
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const toRad = deg => deg * (Math.PI / 180);
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c) / 1000;
  };

  // Worker data fetching - FIXED to use map center instead of user location
  const grab_worker_based_on_filter = useCallback((centerLat = null, centerLong = null) => {
    // Use provided center or current map region center
    const mapCenter = centerLat && centerLong 
      ? { latitude: centerLat, longitude: centerLong }
      : latestRegionRef.current || region;
    
    console.log('🔄 Fetching markers for map center:', {
      lat: mapCenter.latitude.toFixed(4),
      lng: mapCenter.longitude.toFixed(4)
    });

    // Store the last fetch center to avoid duplicate calls
    lastFetchCenterRef.current = {
      lat: mapCenter.latitude,
      lng: mapCenter.longitude
    };

    if (selectedCategory?.id) {
      setLoading(true);
      
      axios({
        method: 'get',
        url: 'https://api.ajur.app/api/category-workers/',
        params: {
          catid: selectedCategory?.id,
          lat: mapCenter.latitude,  // Use map center latitude
          long: mapCenter.longitude, // Use map center longitude
        },
      })
        .then(function (response) {
          setWorkers(response.data.workers);
          setFilteredWorkers(response.data.workers);
          console.log('✅ Markers loaded for current map view:', response.data.workers.length);
          setLoading(false);
        })
        .catch(function (error) {
          console.error('❌ Error fetching markers:', error);
          setErrorModalVisible(true);
          setLoading(false);
        });
    }
  }, [selectedCategory, region]);

  // Get user location and initialize app
  useEffect(() => {
    const initializeUserLocation = async () => {
      try {
        setLoading(true);
        console.log('Starting user location initialization...');
        
        // Get user's current location first
        Geolocation.getCurrentPosition(
          position => {
            const {latitude, longitude} = position.coords;
            console.log('User location found:', latitude, longitude);
            
            setUserLat(latitude);
            setUserLong(longitude);
            
            // Update region to user location
            const userRegion = {
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            };
            setRegion(userRegion);
            latestRegionRef.current = userRegion;
            console.log('Region set to user location:', userRegion);
            
            // Now load the initial data with user location
            loadInitialData(latitude, longitude);
          },
          error => {
            console.log('Error getting user location, using default:', error);
            // Fallback to default location
            const defaultRegion = {
              latitude: 35.6997326,
              longitude: 51.3354612,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            };
            setRegion(defaultRegion);
            latestRegionRef.current = defaultRegion;
            setUserLat(35.6997326);
            setUserLong(51.3354612);
            console.log('Using default location:', defaultRegion);
            loadInitialData(35.6997326, 51.3354612);
          },
          {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 10000,
          }
        );
      } catch (error) {
        console.error('Error initializing user location:', error);
        setLoading(false);
      }
    };

    initializeUserLocation();

    // Check for first-time guide
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

  // Load initial data with user location
  const loadInitialData = async (latitude, longitude) => {
    try {
      console.log('Loading initial data with location:', latitude, longitude);

      // 1. Load categories
      const categoriesResponse = await axios.get(
        'https://api.ajur.app/api/sub-category',
      );
      setCats(categoriesResponse.data);

      // 2. Set initial states
      const initialCategory =
        route?.params?.mapFilters?.category || categoriesResponse.data[5];
      setSelectedCategory(initialCategory);
      set_filter_selectedCategoryegory_name(initialCategory?.name || '');

      // 3. Load category fields
      if (initialCategory) {
        try {
          const fieldsResponse = await axios.get(
            'https://api.ajur.app/api/category-fields',
            {
              params: {
                cat: initialCategory.id,
              },
            },
          );
          setNormalFields(fieldsResponse.data.normal_fields || []);
          setTickFields(fieldsResponse.data.tick_fields || []);
        } catch (error) {
          console.error('Error fetching category fields:', error);
        }

        // 4. Load workers with user location
        grab_worker_based_on_filter(latitude, longitude);
        
        // Move map to user location after data is loaded
        if (mapRef.current && latitude && longitude) {
          setTimeout(() => {
            console.log('Animating map to user location...');
            mapRef.current.animateToRegion({
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }, 1000);
            
            // Trigger closest marker after animation
            setTimeout(() => {
              triggerClosestMarker();
            }, 1200);
          }, 500);
        }
      }
    } catch (error) {
      console.error('Initial load error:', error);
      setErrorModalVisible(true);
    } finally {
      console.log('Initial loading completed');
    }
  };

  // Update ref when filtered_workers changes
  useEffect(() => {
    filteredWorkersRef.current = filtered_workers;
  }, [filtered_workers]);

  // GPS status check (only after initial load)
  useEffect(() => {
    const checkGPSStatus = () => {
      // Only check GPS status after initial load
      if (userLat && userLong) {
        Geolocation.getCurrentPosition(
          position => {
            // Just update coordinates, don't reload everything
            setUserLat(position.coords.latitude);
            setUserLong(position.coords.longitude);
          },
          error => {
            console.warn('Location error:', error.message);
          },
          {enableHighAccuracy: false, timeout: 20000, maximumAge: 10000},
        );
      }
    };

    const interval = setInterval(() => {
      checkGPSStatus();
    }, 100000);

    return () => clearInterval(interval);
  }, [userLat, userLong]);

  // Calculate visible markers
  const calculateVisibleMarkers = useCallback((currentRegion) => {
    if (!currentRegion || !filtered_workers || filtered_workers.length === 0) {
      setVisibleMarkers([]);
      return;
    }

    const { latitude, longitude, latitudeDelta, longitudeDelta } = currentRegion;
    const halfLatDelta = latitudeDelta / 2;
    const halfLngDelta = longitudeDelta / 2;

    const visible = filtered_workers.filter(worker => {
      const lat = Number(worker.lat);
      const long = Number(worker.long);
      
      return (
        lat >= latitude - halfLatDelta &&
        lat <= latitude + halfLatDelta &&
        long >= longitude - halfLngDelta &&
        long <= longitude + halfLngDelta
      );
    });

    console.log('📍 Visible Markers:', visible.length, '/', filtered_workers.length);
    setVisibleMarkers(visible);
  }, [filtered_workers]);

  // Region change handler with automatic marker refresh
  const handleRegionChangeComplete = useCallback((newRegion) => {
    latestRegionRef.current = newRegion;

    if (regionChangeTimeoutRef.current) {
      clearTimeout(regionChangeTimeoutRef.current);
    }

    regionChangeTimeoutRef.current = setTimeout(() => {
      const finalRegion = latestRegionRef.current;
      const newZoomLevel = Math.round(Math.log2(360 / finalRegion.longitudeDelta));
      
      console.log('🎯 Zoom:', newZoomLevel, 'Region:', {
        lat: finalRegion.latitude.toFixed(4),
        lng: finalRegion.longitude.toFixed(4),
        latDelta: finalRegion.latitudeDelta.toFixed(4),
        lngDelta: finalRegion.longitudeDelta.toFixed(4)
      });
      
      setZoomLevel(newZoomLevel);
      setRegion(finalRegion);
      calculateVisibleMarkers(finalRegion);
      setLoading(false);

      // Check if we need to refresh markers for new area
      if (lastFetchCenterRef.current) {
        const distance = getDistance(
          lastFetchCenterRef.current.lat, 
          lastFetchCenterRef.current.lng,
          finalRegion.latitude, 
          finalRegion.longitude
        );
        
        // Refresh markers if moved more than 15km or zoomed out significantly
        if (distance > 15 || newZoomLevel < 12) {
          console.log(`🔄 Map moved ${distance.toFixed(1)}km, refreshing markers...`);
          grab_worker_based_on_filter();
        }
      } else {
        // First time or no previous fetch, store current center
        lastFetchCenterRef.current = {
          lat: finalRegion.latitude,
          lng: finalRegion.longitude
        };
      }
    }, 800); // Increased delay for better debouncing
  }, [calculateVisibleMarkers, grab_worker_based_on_filter]);

  const handleRegionChange = () => {
    setLoading(true);
  };

  // Marker press handler
  const handleMarkerPress = useCallback((worker) => {
    if (markerPressTimeoutRef.current) {
      clearTimeout(markerPressTimeoutRef.current);
    }

    markerPressTimeoutRef.current = setTimeout(() => {
      setSelectedWorker(worker);
      setShowFooter(true);
    }, 100);
  }, []);

  // Cluster press handler
  const handleClusterPress = useCallback((cluster) => {
    console.log('Cluster pressed:', cluster);
    setShowFooter(false);
    setSelectedWorker(null);
  }, []);

  const handleMapTouch = () => {
    onBackButtonSerachPressed();
  };

  // Search functionality
  const debouncedSearch = useCallback(
    debounce((text) => {
      setSearchPlaces([]);
      const query = text.trim();

      if (query.length < 2) {
        setSearchPlaces([]);
        setLoadingSearchPlace(false);
        return;
      }
      setLoadingSearchPlace(true);
      axios
        .get('https://nominatim.openstreetmap.org/search', {
          params: {
            q: query + ' ایران',
            countrycodes: 'ir',
            format: 'json',
            addressdetails: 1,
            limit: 5,
            'accept-language': 'fa',
          },
          headers: {
            'User-Agent': 'AjurApp/1.0 (+https://ajur.app)',
          },
        })
        .then(res => {
          const processed = res.data.map(item => {
            const address = item.address || {};
            const province = address.province || address.state || '';
            const city = address.city || address.town || '';
            const neighbourhood = address.neighbourhood || address.district || address.residential || '';

            return {
              id: item.place_id,
              title: item.display_name.split(',')[0],
              neighbourhood: neighbourhood,
              city: city,
              province: province,
              location: {
                y: parseFloat(item.lat),
                x: parseFloat(item.lon),
              },
            };
          });

          setSearchPlaces(processed);
        })
        .catch(err => {
          console.error('Search error:', err);
        })
        .finally(() => setLoadingSearchPlace(false));
    }, 1000),
    [],
  );

  const handleChangeInput = (text) => {
    setSearch(text);
    if (text.length < 2) {
      setSearchPlaces([]);
      return;
    }
    debouncedSearch(text);
  };

  const handleStartSearch = () => {
    setIsSearchFocused(true);
    setIsSearchModalVisible(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 600);
  };

  // Modal handlers
  const toggleSearchModal = () => {
    setIsSearchModalVisible(!isSearchModalVisible);
  };

  const toggleFilterhModal = () => {
    setIsFilterModalVisible(!isFilterModalVisible);
    setShowFooter(false);
  };

  const onBackButtonSerachPressed = () => {
    setIsSearchFocused(false);
    toggleSearchModal();
  };

  const onCloseSearchPress = () => {
    setSearch('');
    onBackButtonSerachPressed();
  };

  // Map controls
  const centerToUserLocation = () => {
    console.log('Centering to user location...');
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setUserLat(latitude);
        setUserLong(longitude);
        
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude: Number(latitude),
              longitude: Number(longitude),
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            1000,
          );
          console.log('Map centered to current location:', latitude, longitude);
          
          // Also refresh markers for user location
          setTimeout(() => {
            grab_worker_based_on_filter(latitude, longitude);
          }, 1200);
        }
      },
      error => {
        console.log('Error getting location:', error);
        // If current location fails, center to the last known user location
        if (userLat && userLong && mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude: Number(userLat),
              longitude: Number(userLong),
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            1000,
          );
          console.log('Map centered to last known location:', userLat, userLong);
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 30000,
      },
    );
  };

  const toggleMapType = () => {
    if (mapType === 'standard') setMapType('hybrid');
    else if (mapType === 'hybrid') setMapType('standard');
    else setMapType('standard');
  };

  const getMapIcon = () => {
    if (mapType === 'standard') return 'ios-layers-outline';
    if (mapType === 'hybrid') return 'ios-globe-outline';
    return 'ios-layers-outline';
  };

  const showUserHelp = () => {
    setShowGuide(true);
  };

  const triggerClosestMarker = () => {
    if (!mapRef.current || filtered_workers.length === 0 || !region) return;

    // Don't auto-select if user has manually selected a marker recently
    if (!isFirstLoadRef.current) {
      console.log('🚫 Skipping auto-selection - user may have manually selected');
      return;
    }

    const center = {
      latitude: region.latitude,
      longitude: region.longitude,
    };

    let closestMarker = null;
    let minDistance = Infinity;

    filtered_workers.forEach(worker => {
      const distance = getDistance(
        center.latitude,
        center.longitude,
        worker.lat,
        worker.long,
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestMarker = worker;
      }
    });

    if (closestMarker) {
      console.log('📍 Auto-selecting closest marker:', closestMarker.id);
      setSelectedWorker(closestMarker);
      setShowFooter(true);
      setTimeout(() => {
        isFirstLoadRef.current = false;
      }, 500);
    }
  };

  // Footer handlers
  const handleCloseFooter = () => {
    console.log('🔄 Closing footer and deselecting marker');
    setShowFooter(false);
    setSelectedWorker(null);
  };

  const handleZoomOutRequested = () => {
    // Your zoom out logic
  };

  // FILTER FUNCTIONS
  const handleTimeFilterChange = (value) => {
    setTimeRange(value);
    console.log('Selected time range:', value);
  };

  const onClickSingleCategory = useCallback(async (cat) => {
    if (!cat) return;

    console.log('Changing category to:', cat.id);
    set_filter_level('base');
    set_filter_selectedCategoryegory_name(cat.name);
    setSelectedCategory(cat);
    setFilteredWorkers([]);
    setLoading(true);

    try {
      // Load category fields
      const fieldsResponse = await axios.get(
        'https://api.ajur.app/api/category-fields',
        {
          params: {
            cat: cat.id,
          },
        },
      );
      setNormalFields(fieldsResponse.data.normal_fields || []);
      setTickFields(fieldsResponse.data.tick_fields || []);

      // Fetch workers for new category using current map center
      grab_worker_based_on_filter();
    } catch (error) {
      console.error('Error fetching workers:', error);
      setErrorModalVisible(true);
    }
  }, [grab_worker_based_on_filter]);

  const onClickOpenCategorySelection = () => {
    set_filter_level('category');
  };

  const onPressingSingleTickFieldCheckbox = (fl) => {
    let prop = {
      name: fl.value,
      value: 1,
      kind: 2,
      special: fl.special,
      order: fl.sort,
    };
    setTickProperties([...tick_properties, prop]);
  };

  const onDeletingSingleTickFieldCheckbox = (fl) => {
    setTickProperties(tick_properties.filter(item => item.name !== fl.name));
  };

  const onDeletingSinglePropertyFilter = async (fl) => {
    const foundItem = normal_fields.find(item => item === fl);
    if (foundItem) {
      foundItem.low = 0;
      foundItem.high = 0;
    }
  };

  const toggleMoreFilters = () => {
    setShowMoreFilters(!showMoreFilters);
  };

  const onClickFinishFitering = () => {
    setIsFilterModalVisible(false);
    // Refresh markers when filters are applied
    grab_worker_based_on_filter();
  };

  // RENDER FUNCTIONS
  const renderTimeFrameFilter = () => {
    return (
      <>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'iransans',
            color: '#333',
            margin: 20,
            marginBottom: 8,
          }}>
          تاریخ آگهی بر اساس مدت زمان حضور در آجر
        </Text>
        <TimeFilter timeRange={timeRange} onSelect={handleTimeFilterChange} />
      </>
    );
  };

  const renderCategorySelectionBar = () => {
    if (!filter_selectedCategoryegory_name) {
      return (
        <>
          <View style={styles.filterBarWrapper}>
            <TouchableOpacity onPress={onClickOpenCategorySelection}>
              <Text style={styles.filterBarButton}>انتخاب</Text>
            </TouchableOpacity>
            <Text style={styles.filterBarText}>انتخاب دسته بندی</Text>
          </View>
          <View style={[styles.divider, {height: 1}]} />
        </>
      );
    } else {
      return (
        <>
          <View style={styles.filterBarWrapper}>
            <TouchableOpacity onPress={onClickOpenCategorySelection}>
              <Text style={styles.filterBarButton}>تغییر</Text>
            </TouchableOpacity>
            <Text style={styles.filterBarText}>
              {'دسته بندی'} {filter_selectedCategoryegory_name}
            </Text>
          </View>
          <View style={[styles.divider, {height: 2}]} />
        </>
      );
    }
  };

  const renderFilterSectionPages = () => {
    if (filter_level === 'base') {
      return (
        <>
          {renderCategorySelectionBar()}
        </>
      );
    } else if (filter_level === 'category') {
      return (
        <ScrollView
          style={{margin: 20}}
          showsVerticalScrollIndicator={true}
          scrollIndicatorInsets={{right: 1}}>
          {cats.map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={styles.singleTypeWrapper}
              onPress={() => onClickSingleCategory(cat)}>
              <View style={styles.singleIcon}>
                {filter_selectedCategoryegory_name === cat.name ? (
                  <Icon name="radio-button-on" size={24} color="blue" />
                ) : (
                  <Icon name="radio-button-off" size={24} color="gray" />
                )}
              </View>
              <View style={styles.singleInfo}>
                <Text style={styles.catText}>{cat.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      );
    }
    return null;
  };

  const renderOnOff = (fl, index) => {
    const x = tick_properties.find(item => item.name === fl.value);

    if (x) {
      return (
        <TouchableOpacity
          style={styles.tickField_container}
          onPress={() => onDeletingSingleTickFieldCheckbox(fl)}>
          <View style={styles.tickField_row}>
            <Text style={styles.tickField_text}>
              دارای <Text style={styles.tickField_strong}>{fl.value}</Text> باشد
            </Text>
            <Icon name="checkbox" size={20} color="#555" />
          </View>
          <View style={styles.tickField_divider} />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.tickField_container}
          onPress={() => onPressingSingleTickFieldCheckbox(fl)}>
          <View style={styles.tickField_row}>
            <Text style={styles.tickField_text}>
              دارای <Text style={styles.tickField_strong}>{fl.value}</Text> باشد
            </Text>
            <Icon name="square-outline" size={20} color="#555" />
          </View>
          <View style={styles.tickField_divider} />
        </TouchableOpacity>
      );
    }
  };

  const renderFiltersBasedOnCategorySelected = () => {
    return (
      <>
        {tick_fields.map((fl, index) => fl.special == 1 && renderOnOff(fl))}
        
        <View style={{paddingHorizontal: 2}}>
          {normal_fields
            .filter(function (fl) {
              return fl.special == 1;
            })
            .map(function (fl, index) {
              return (
                <View
                  key={fl.id ? fl.id.toString() : index.toString()}
                  style={{
                    width: '100%',
                    alignSelf: 'stretch',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{padding: 10, textAlign: 'center'}}>
                    Range Filter for: {fl.value}
                  </Text>
                </View>
              );
            })}
        </View>
      </>
    );
  };

  const renderFilterActionButtons = () => {
    return (
      <TouchableOpacity
        onPress={onClickFinishFitering}
        style={styles.actionBar}>
        {loading ? (
          <View>
            <Text style={styles.actionText}>
              {'دریافت'} {<ActivityIndicator size={15} color="white" />}
            </Text>
          </View>
        ) : (
          <View>
            <Text style={styles.actionText}>
              {'تایید و نمایش'} ({' ' + filtered_workers.length + ' فایل '} )
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Header filters render function
  const renderHeaderFilters = () => {
    return (
      <View style={styles.header2}>
        <TouchableOpacity
          style={styles.persistentFilterButton}
          onPress={toggleFilterhModal}>
          <View style={styles.buttonWrapper}>
            <Text style={styles.categoryText}>فیلتر ها</Text>
          </View>
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.rtlFilterScroll}
          decelerationRate="fast">
          {/* Selected Category */}
          <TouchableOpacity
            style={styles.categoryBox}
            onPress={toggleFilterhModal}>
            <View style={styles.buttonWrapper}>
              <Text style={styles.categoryText}>
                {selectedCategory ? selectedCategory.name : 'فروش خانه ویلایی'}
              </Text>
              <Icon name="chevron-down" size={20} color="red" style={styles.arrow} />
            </View>
          </TouchableOpacity>

          {/* Time Filter */}
          <TouchableOpacity
            style={styles.categoryBox}
            onPress={toggleFilterhModal}>
            <View style={styles.buttonWrapper}>
              <Text style={styles.categoryText}>
                <TimeDisplay timeRange={timeRange} />
              </Text>
              <Icon name="chevron-down" size={20} color="red" style={styles.arrow} />
            </View>
          </TouchableOpacity>

          {/* Active filters */}
          {tick_properties.map((fl, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryBox}
              onPress={() => onDeletingSingleTickFieldCheckbox(fl)}>
              <View style={styles.buttonWrapper}>
                <Text style={styles.categoryText}>{fl.name}</Text>
                <Icon name="close" size={20} color="red" style={styles.arrow} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Other render functions
  const renderSearchResults = () => {
    if (loading_search_place) {
      return (
        <View style={styles.spinnerImageView}>
          <ActivityIndicator size="large" color="#bc323a" />
          <Text>در حال جستجو...</Text>
        </View>
      );
    }
    return search_places.map(
      (place, index) =>
        index < 9 && (
          <TouchableOpacity
            key={place.id}
            style={styles.singleSearchResult}
            onPress={() => handleSingleLocationClicked({place})}
          >
            <View>
              <Text style={styles.placeTitle}>
                {place.title} ({place.province})
              </Text>
            </View>
          </TouchableOpacity>
        ),
    );
  };

  const handleSingleLocationClicked = ({place}) => {
    setShowFooter(false);
    onBackButtonSerachPressed();
    setSearch(place.title);

    mapRef.current?.animateToRegion(
      {
        latitude: Number(place.location.y),
        longitude: Number(place.location.x),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      500,
    );

    // Also refresh markers for the new location
    setTimeout(() => {
      grab_worker_based_on_filter(place.location.y, place.location.x);
    }, 600);
  };

  const renderMapLoader = () => {
    if (loading) {
      return (
        <View style={styles.mapLoader}>
          <ActivityIndicator size="large" color="#bc323a" style={styles.spinner} />
        </View>
      );
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (markerPressTimeoutRef.current) {
        clearTimeout(markerPressTimeoutRef.current);
      }
      if (regionChangeTimeoutRef.current) {
        clearTimeout(regionChangeTimeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    region,
    loading,
    zoomLevel,
    visibleMarkers,
    filtered_workers,
    selectedWorker,
    showFooter,
    isSearchModalVisible,
    isFilterModalVisible,
    isHintModalVisible,
    showGuide,
    errorModalVisible,
    mapType,
    search,
    search_places,
    loading_search_place,
    isSearchFocused,
    mapOrList,
    isFooterExpanded,
    setIsFooterExpanded,
    timeRange,
    showMoreFilters,
    navigation,
    
    // Refs
    mapRef,
    inputRef,
    
    // Functions
    handleRegionChange,
    handleRegionChangeComplete,
    handleMarkerPress,
    handleClusterPress,
    handleMapTouch,
    toggleSearchModal,
    toggleFilterhModal,
    handleStartSearch,
    handleChangeInput,
    onBackButtonSerachPressed,
    onCloseSearchPress,
    centerToUserLocation,
    toggleMapType,
    showUserHelp,
    renderSearchResults,
    renderHeaderFilters,
    renderMapLoader,
    renderFilterSectionPages,
    renderTimeFrameFilter,
    renderFiltersBasedOnCategorySelected,
    renderFilterActionButtons,
    getMapIcon,
    handleCloseFooter,
    handleZoomOutRequested,
    grab_worker_based_on_filter,
    set_isHintModalVisible,
    setShowGuide,
    setErrorModalVisible,
    handleTimeFilterChange,
    toggleMoreFilters
  };
};

export default useMapLogic;