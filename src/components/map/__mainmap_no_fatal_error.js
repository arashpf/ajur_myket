import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  PermissionsAndroid,
  StatusBar,
  TextInput,
  Modal,
  Animated,
  PanResponder,
  FlatList,
  ActivityIndicator,
  Alert,
  Linking,
  Divider,
} from 'react-native';
import styles from './assets/MainMap.styles';
import CardSkeletonPlaceholder from '../skeleton/CardSkeletonPlaceholder';
import {Box, Button, Text, Tooltip} from 'native-base';
import RangeSlider from './parts/RangeSlider';
import RangeDropdown from './parts/RangeDropdown';
import NewFooterCarousel from './parts/NewFooterCarousel';
import MapErrorModal from './parts/MapErrorModal'; // Adjust path as needed
import {debounce} from 'lodash';
import ImageSliderModal from './parts/ImageSliderModal';
import TimeFilter from './parts/TimeFilter'; // adjust path as needed
import TimeDisplay from './parts/TimeDisplay'; // adjust path as needed

import SearchBars from '../../components/search/SearchBars';
import MapHeader from './parts/MapHeader';

import NewWorkerFab from '../fabs/NewWorkerFab';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import MapView, {Marker} from 'react-native-maps';
import WorkerCard from '../cards/WorkerCard';
const snapPoints = ['25%', '50%', '100%']; // Adjust to your liking
// import MapView from 'react-native-map-clustering';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import ClusterMap from 'react-native-map-clustering';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import Spinner from 'react-native-spinkit';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import GuideOverlay from '../MapGuideOverlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
let LATITUDE = 35.7074612;
let LONGITUDE = 51.3005805;
const LATITUDE_DELTA = 0.01; // or 0.005 for even closer
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;
let lastRegionChangeCall = 0;
const MainMap = props => {
  const navigation = useNavigation();
  const {route} = props;

  const regionChangeTimeoutRef = useRef(null);
  const latestRegionRef = useRef(null);

  const param_category = route?.params?.mapFilters?.category || null;
  // const param_category_array = route?.params?.mapFilters?.category_array || null;
  const param_neighborhood = route?.params?.mapFilters?.neighborhood || null;
  const markerPressTimeoutRef = useRef(null);
  const isFirstLoadRef = useRef(true);
  const lastWorkerPressTimeRef = useRef(0);
  const lastWorkerPressLockedRef = useRef(false);
  // Create the ref
  const inputRef = useRef(null);

  const mapRef = useRef(null);
  const mapViewRef = useRef(null);

  const handleExpanded = val => {
    console.log('triger expanded');
    setMapOrList('list');
  };

  const handleShrinked = val => {
    console.log('triger expanded');
    setMapOrList('map');
  };

  const handleZoomOutRequested = () => {
    return;
    // Calculate new zoomed out region
    const newRegion = {
      ...region,
      latitudeDelta: region.latitudeDelta * 1.5, // Zoom out by 50%
      longitudeDelta: region.longitudeDelta * 1.5,
    };

    // Update region state
    setRegion(newRegion);

    // Optional: Animate the map zoom
    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 500);
    }
    setIsFooterExpanded(true);
  };

  const [showGuide, setShowGuide] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(
    route?.params?.mapFilters?.category || null,
  );

  const carouselRef = useRef(null);

  // const [region, setRegion] = useState(null);

  // Initialize region with a default value first
  const [region, setRegion] = useState({
    latitude: 35.6997326,
    longitude: 51.3354612,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const [userLat, set_userLat] = useState();

  const [userLong, set_userLong] = useState();

  const [workers, set_workers] = useState([]);
  const [filtered_workers, set_filtered_workers] = useState([]);
  const [markers, set_markers] = useState([]);
  const [cats, set_cats] = useState([]);

  const [specials, set_specials] = useState([]);

  const [uppers, set_uppers] = useState([]);

  const [boxStatus, set_boxStatus] = useState(false);

  const [loading, set_loading] = useState(false);
  const [loading2, set_loading2] = useState(false);

  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [Hint, set_Hint] = useState(false);
  const [spinnerOpacity, set_spinnerOpacity] = useState(true);

  const [zoomLevel, set_zoomLevel] = useState(14);
  const [clusterRadius, setClusterRadius] = useState(30);

  const [mapType, set_mapType] = useState('standard');
  const [mapIcon, set_mapIcon] = useState('ios-map-outline');

  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedWorker, setSelectedWorker] = useState([]);
  const [pressedMarkers, setPressedMarkers] = useState({}); // Track pressed state for each marker
  const [showFooter, setShowFooter] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [user_location_status, set_user_location_status] = useState(false);

  const [isTopbarOpen, setTopbarOpen] = useState(false);
  const topbarAnim = useRef(new Animated.Value(-400)).current; // Animation value for topbar

  const [search, set_search] = useState(''); // Store search input value
  const [search_places, set_search_places] = useState([]); // Store search results
  const [locationLi, setLocationLi] = useState(false);

  const [filter_level, set_filter_level] = useState('category');
  const [
    filter_selectedCategoryegory_name,
    set_filter_selectedCategoryegory_name,
  ] = useState();
  const [selected_neighborhoods, set_selected_neighborhoods] = useState([]);
  const [selected_neighborhoods_array, set_selected_neighborhoods_array] =
    useState([]);

  const [normal_fields, set_normal_fields] = useState([]);
  const [predefine_fields, set_predefine_fields] = useState([]);
  const [tick_fields, set_tick_fields] = useState([]);

  const [properties, set_properties] = useState([]);

  const [tick_properties, set_tick_properties] = useState([]);

  const [visibleMarkerCount, setVisibleMarkerCount] = useState(0);
  const [visibleMarkers, setVisibleMarkers] = useState([]); // State for visible markers

  const [nearestMarkers, setNearestMarkers] = useState([]);

  const [loadedCount, setLoadedCount] = useState(5); // Start with 5

  const [timeRange, setTimeRange] = useState('threemonths');

  const [isLoading, setIsLoading] = useState(false);
  const increment = 5;

  const loadMoreItems = () => {
    if (loadedCount < nearestMarkers.length && !isLoading) {
      setIsLoading(true);
      setTimeout(() => {
        setLoadedCount(prev =>
          Math.min(prev + increment, nearestMarkers.length),
        );
        setIsLoading(false);
      }, 500); // simulate small delay
    }
  };
  const [isHintModalVisible, set_isHintModalVisible] = useState(false);
  const [is_location_exist, set_is_location_exist] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [loading_search_place, set_loading_search_place] = useState(false);
  const [activeItem, setActiveItem] = useState();

  const [mapFilters, setMapFilters] = useState(null);

  const [mapOrList, setMapOrList] = useState('map');
  const [isFooterExpanded, setIsFooterExpanded] = useState(false);

  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const toggleMoreFilters = () => {
    setShowMoreFilters(!showMoreFilters);
  };

  useEffect(() => {
    setLoadedCount(10); // Reset when markers update
    set_loading(false);
  }, [visibleMarkers]);

  useEffect(() => {
    activeItem && setSelectedWorker(activeItem);
  }, [activeItem]);

  useEffect(() => {
    if (!selectedCategory?.id || workers.length === 0) {
      set_filtered_workers([]);
      return;
    }

    const filterWorkers = () => {
      // First filter by category
      let filtered = workers.filter(worker => {
        if (selectedCategory === 'all') return true;
        return worker.category_id == selectedCategory?.id;
      });
      // Then apply time range filter
      filtered = filtered.filter(worker => is_within_time_range(worker));

      // Finally apply property range filters
      filtered = filtered.filter(worker => is_worker_in_range(worker));
      return filtered;
    };
    set_filtered_workers(filterWorkers());
  }, [
    selectedCategory,
    workers,
    timeRange,
    properties,
    tick_properties,
    normal_fields,
  ]);
  const now = new Date();
  const is_within_time_range = (worker, range = timeRange) => {
    const createdAt = new Date(worker.updated_at);
    const diffInMs = now - createdAt;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    switch (range) {
      case 'week':
        return diffInDays <= 7;
      case 'month':
        return diffInDays <= 30;
      case 'threemonths':
        return diffInDays <= 90;
      case 'all':
      default:
        return true;
    }
  };

  const is_worker_in_range = worker => {
    let is_googd_to_go = true;
    var decoded_pr = JSON.parse(worker.json_properties);

    var selected_decoded_pr = decoded_pr.filter(pr => {
      if (pr.special == 1) return pr;
    });
    normal_fields.map(nf => {
      if (nf.special == 1) {
        if (nf.low > 0 || nf.high > 0) {
          const matched_pr_nf = selected_decoded_pr.find(function (pr) {
            return pr.name == nf.value;
          });
          const lower = nf.low > 0 ? parseInt(nf.low) : parseInt(nf.min_range);
          const higher =
            nf.high > 0 ? parseInt(nf.high) : parseInt(nf.max_range);
          if (matched_pr_nf) {
            if (matched_pr_nf.value > lower && matched_pr_nf.value < higher) {
            } else {
              is_googd_to_go = false;
            }
          }
        }
      }
    });
    tick_properties.map(ps => {
      var selected_decoded_pr = decoded_pr.filter(pr => {
        if (pr.kind == 2) return pr;
      });
      const matched_pr_tk = selected_decoded_pr.find(function (pr) {
        return pr.name == ps.name;
      });
      if (!matched_pr_tk) {
        is_googd_to_go = false;
      }
    });

    return is_googd_to_go;
  };
  useEffect(() => {
    const checkFirstTime = async () => {
      const hasSeenModal = await AsyncStorage.getItem('hasSeenMapModal');
      if (!hasSeenModal || hasSeenModal == 'false') {
        set_isHintModalVisible(true);
        setShowGuide(true);
        await AsyncStorage.setItem('hasSeenMapModal', 'true');
      } else {
      }
    };
    checkFirstTime();
  }, []);
  // PanResponder to handle drag gesture
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dy > 5 || gestureState.dy < -5;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy < 0) {
          // Only slide down if dragging up
          topbarAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        // If the topbar is dragged up beyond a threshold, close it
        if (gestureState.dy < -150) {
          closeTopbar();
        } else {
          openTopbar();
        }
      },
    }),
  ).current;
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        set_loading(true);

        // 1. Load categories
        const categoriesResponse = await axios.get(
          'https://api.ajur.app/api/sub-category',
        );
        set_cats(categoriesResponse.data);

        // 2. Set initial states
        const initialCategory =
          route?.params?.mapFilters?.category || categoriesResponse.data[2];
        setSelectedCategory(initialCategory);

        set_filter_selectedCategoryegory_name(initialCategory.name);
        set_filter_level('base');

        // 3. Load workers with time filter applied immediately
        if (initialCategory) {
          const response = await axios.get(
            'https://api.ajur.app/api/category-workers/',
            {
              params: {
                catid: initialCategory.id,
                lat: userLat,
                long: userLong,
              },
            },
          );

          set_workers(response.data.workers);

          // Apply time filter immediately to initial data
          const timeFilteredWorkers = response.data.workers.filter(
            worker => is_within_time_range(worker, 'threemonths'), // Pass the timeRange explicitly
          );

          set_filtered_workers(timeFilteredWorkers);
        }
      } catch (error) {
        console.error('Initial load error:', error);
        setErrorModalVisible(true);
      } finally {
        set_loading(false);
        moveMapSlightly();
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      axios({
        method: 'get',
        url: 'https://api.ajur.app/api/category-fields',
        params: {
          cat: selectedCategory.id,
        },
      })
        .then(function (response) {
          set_normal_fields(response.data.normal_fields);
          set_tick_fields(response.data.tick_fields);
          set_predefine_fields(response.data.predefine_fields);
        })
        .catch(function (error) {
          console.error('Error fetching category fields:', error);

          setErrorModalVisible(true);
        });
      moveMapSlightly();
    }
  }, [selectedCategory]);

  const checkGPSStatus = () => {
    Geolocation.getCurrentPosition(
      position => {
        set_is_location_exist(true); // Always set to true when location found
        const {latitude, longitude} = position.coords;
      },
      error => {
        console.warn('Location error:', error.message);
        set_is_location_exist(false); // Set to false on error

        if (error.code === 2) {
          Alert.alert(
            'Location Disabled',
            'لوکیشن گوشی شما خاموش است ، آجر برای ادامه نیاز به روشن کردن لوکیشن دارد ',
            [
              {text: 'Cancel', style: 'cancel'},
              {text: 'روشن کردن', onPress: openLocationSettings},
            ],
          );
        }
      },
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 10000},
    );
  };
  const calculateZoomLevel = longitudeDelta => {
    return Math.round(Math.log(360 / longitudeDelta) / Math.LN2);
  };

  const handlePanDrag = () => {
    setShowFooter(false); // Hide footer when the map is touched
    setSelectedWorker([]);
    // set_loading(true);
  };

  // Handle cluster press
  const handleClusterPress = cluster => {
    setShowFooter(false); // Hide footer when the map is touched
    setSelectedWorker([]);

    console.log(cluster);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkGPSStatus();
      console.warn(
        'im trigered arash 100 100 sec , really user need that? thats not gonna make my phone die?',
      );
    }, 100000); // Runs every 100 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const grab_worker_based_on_filter = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;

        set_userLat(latitude);
        set_userLong(longitude);

        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.0922, // zoom level
          longitudeDelta: 0.0421, // zoom level
        };
        setRegion(newRegion);
        // If map reference is available, animate to the user's location
        // fetching worker from api

        if (selectedCategory?.id) {
          var baseurl = 'https://api.ajur.app/api/category-workers/';
          var catid = selectedCategory?.id;
          axios({
            method: 'get',
            url: baseurl,
            params: {
              catid: catid,
              lat: latitude,
              long: longitude,
            },
          })
            .then(function (response) {
              set_workers(response.data.workers);
              set_filtered_workers(response.data.workers);
              set_uppers(response.data.uppers);
              set_markers(response.data.workers);
              set_specials(response.data.specials);
              set_boxStatus(true);

              set_loading(false);
              // moveMapSlightly(latitude,longitude);
            })
            .catch(function (error) {
              // alert('catch error for category');
              setErrorModalVisible(true);
            });
        } else {
        }
        // end of fetching worker from api
      },
      error => console.log(JSON.stringify('there is a error in location grab')),
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 10000},
    );

    // end of getting the user location
  };

  useEffect(() => {
    grab_worker_based_on_filter();
    set_loading(false);
  }, [is_location_exist]);

  const handleStartSearch = () => {
    setIsSearchFocused(true);
    setIsSearchModalVisible(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 600);
  };
  useEffect(() => {
    if (!route.params?.mapFilters?.neighborhood) return;

    const {neighborhood} = route.params.mapFilters;
    let intervalId;

    const moveToLocation = () => {
      if (!mapRef.current) return false;

      // Add small delay to ensure map is fully ready
      setTimeout(() => {
        moveToNewLocation(neighborhood.center_lat, neighborhood.center_lng);
      }, 300);

      return true;
    };

    // First try immediately
    if (!moveToLocation()) {
      // Fallback with interval but with longer delay
      intervalId = setInterval(() => {
        if (moveToLocation()) {
          clearInterval(intervalId);
        }
      }, 500); // Increased interval time
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [route.params?.mapFilters?.neighborhood]);

  useEffect(() => {
    if (route.params?.mapFilters?.category) {
      const {category} = route.params.mapFilters;
      set_filter_level('base');
      set_filter_selectedCategoryegory_name(category.name);
      onClickSingleCategory(category);
    }
  }, [route.params?.mapFilters?.category]);

  const onBackButtonSerachPressed = () => {
    setIsSearchFocused(false);
    closeSearchModal();
  };
  const renderSearchResults = () => {
    if (loading_search_place) {
      return (
        <View style={styles.spinnerImageView}>
          {/* <VideoSpinner /> */}
          <Spinner
            style={styles.spinner}
            isVisible={true}
            size={30}
            type="Circle"
            color="#b92a31"
          />
        </View>
      );
    }
    return search_places.map(
      (place, index) =>
        index < 9 && (
          <TouchableOpacity
            key={place.id} // Make sure each item has a unique key
            style={styles.singleSearchResult}
            onPress={() => handleSingleLocationClicked({place})} // Handle press
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

  const renderHeaderFilters = () => {
    if (1) {
      return (
        <>
          <View style={styles.header2}>
            {/* Persistent Filter Button on Left */}
            <TouchableOpacity
              style={styles.persistentFilterButton}
              onPress={toggleFilterhModal}>
              <View style={styles.buttonWrapper}>
                <Icon
                  name="filter"
                  size={16}
                  color="red"
                  style={styles.filterIcon}
                />
                <Text style={styles.categoryText}>فیلتر ها</Text>
              </View>
            </TouchableOpacity>

            {/* Scrollable filters on the right */}
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
                    {selectedCategory
                      ? selectedCategory.name
                      : 'فروش خانه ویلایی'}
                  </Text>
                  <Icon
                    name="chevron-down"
                    size={20}
                    color="red"
                    style={styles.arrow}
                  />
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
                  <Icon
                    name="chevron-down"
                    size={20}
                    color="red"
                    style={styles.arrow}
                  />
                </View>
              </TouchableOpacity>

              {/* Rest of your existing filters... */}
              {tick_properties.map((fl, index) => (
                <TouchableOpacity
                  style={styles.categoryBox}
                  onPress={() => onDeletingSingleTickFieldCheckbox(fl)}>
                  <View style={styles.buttonWrapper}>
                    <Text style={styles.categoryText}>{fl.name}</Text>
                    <Icon
                      name="close"
                      size={20}
                      color="red"
                      style={styles.arrow}
                    />
                  </View>
                </TouchableOpacity>
              ))}

              {normal_fields
                .filter(function (fl) {
                  return fl.low > 0 || fl.high > 0;
                })
                .map(function (fl, index) {
                  return (
                    <TouchableOpacity
                      style={styles.categoryBox}
                      onPress={() => onDeletingSinglePropertyFilter(fl)}>
                      <View style={styles.buttonWrapper}>
                        <Text style={styles.categoryText}>{fl.value}</Text>
                        <Icon
                          name="close"
                          size={20}
                          color="red"
                          style={styles.arrow}
                        />
                      </View>
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>
          </View>
        </>
      );
    }
  };
  const renderMapLoader = () => {
    if (loading) {
      return (
        <>
          {/* Fixed Header (90% search + 10% filter) */}
          <View style={styles.mapLoader}>
            {/* Search Input (90%) */}
            <ActivityIndicator
              size="large"
              color="#bc323a"
              style={styles.spinner}
            />
          </View>
        </>
      );
    }
  };
  const onCloseSearchPress = () => {
    set_search();
    onBackButtonSerachPressed();
  };
  const renderHeader = () => {
    return (
      <MapHeader
        isSearchFocused={isSearchFocused}
        search={search}
        onBackButtonPress={onBackButtonSerachPressed}
        onStartSearch={handleStartSearch}
        onInputChange={handleChangeInput}
        onCloseSearchPress={onCloseSearchPress}
        onToggleFilter={toggleFilterhModal}
        inputRef={inputRef}
      />
    );
  };

  const handleCloseFooter = () => {
    setShowFooter(false);
  };
const renderFooter = () => {
  // Don't conditionally render the component - let it handle its own visibility
  return (
    <NewFooterCarousel
      showFooter={showFooter && !loading && visibleMarkers && visibleMarkers.length > 0}
      selectedWorker={selectedWorker}
      visibleMarkers={visibleMarkers || []}
      isLoading={isLoading}
      onClose={handleCloseFooter}
      onZoomOutRequested={handleZoomOutRequested}
      onFullListRequest={() => {
        console.log('Full list requested');
      }}
      onShrinkListRequest={() => {
        console.log('Shrink list requested');
      }}
      onExpandedChange={setIsFooterExpanded}
    />
  );
};
  const openLocationSettings = () => {
    if (Platform.OS === 'android') {
      Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS'); // IntentLauncher.startActivity({
    } else {
      Linking.openURL('app-settings:'); // iOS: opens general settings
    }
  };
  const ResetFilterModal = () => {};
  const toggleFilterhModal = () => {
    setIsFilterModalVisible(!isFilterModalVisible);
    setShowFooter(false);
  };
  const toggleSearchModal = () => {
    setIsSearchModalVisible(!isSearchModalVisible);
  };
  const openSearchModal = () => {
    setIsSearchModalVisible(true);
  };
  const closeSearchModal = () => {
    setIsSearchModalVisible(false);
  };
  const handleSearch = () => {
    setIsSearchModalVisible(false);
  };

  const renderPrice = properties => {
    const formatNumber = num => {
      const number = Number(num); // Ensure it's a number

      if (number >= 1000000000) {
        // For billions
        return `${parseFloat((number / 1000000000).toFixed(1))} میلیارد`;
      } else if (number >= 1000000) {
        // For millions
        return `${parseFloat((number / 1000000).toFixed(1))} میلیون`;
      } else {
        // For smaller numbers, show as is with commas
        return String(number).replace(/(.)(?=(\d{3})+$)/g, '$1,');
      }
    };

    const pricePerM2 = properties.find(item => item.name === 'قیمت هر متر');
    const priceItem = properties.find(item => item.name === 'قیمت');
    const rentFront = properties.find(item => item.name === 'پول پیش');
    const rentPerMonth = properties.find(item => item.name === 'اجاره ماهیانه');
    if (priceItem) {
      const priceNoFormat = priceItem.value;
      const pricePerM2Value = pricePerM2?.value || 0;

      return (
        <Text style={[styles.text, styles.rtl]}>
          <Text style={styles.boldText}>{formatNumber(priceNoFormat)}</Text>
        </Text>
      );
    } else if (rentFront) {
      const rentFrontNoFormat = rentFront.value;
      const rentPerMonthNoFormat = rentPerMonth?.value || 0;

      return (
        <View style={styles.price_row}>
          {/* Show رهن or رهن کامل */}
          <Text style={[styles.text, styles.rtl]}>
            <Text style={styles.boldText}>
              {formatNumber(rentFrontNoFormat)}{' '}
              {rentPerMonthNoFormat && rentPerMonthNoFormat !== '0'
                ? 'رهن'
                : 'رهن کامل'}
            </Text>
          </Text>
          {/* Only show اجاره if valid */}
          {rentPerMonthNoFormat && rentPerMonthNoFormat !== '0' ? (
            <Text style={[styles.text, styles.rtl, styles.paddingRight]}>
              <Text style={styles.boldText}>
                {formatNumber(rentPerMonthNoFormat)} اجاره
              </Text>
            </Text>
          ) : null}
        </View>
      );
    }
    return null;
  };

  const handleMarkerPress = (worker, e) => {
    // Clear any pending timeouts to prevent double calls
    if (markerPressTimeoutRef.current) {
      clearTimeout(markerPressTimeoutRef.current);
    }

    // Use a timeout to debounce the press
    markerPressTimeoutRef.current = setTimeout(() => {
      // Skip if this is the first automatic load
      if (isFirstLoadRef.current) {
        isFirstLoadRef.current = false;
        return;
      }

      setSelectedWorker(worker);
      const markersWithDistances = filtered_workers
        .map(marker => ({
          ...marker,
          distancer: getDistance(
            worker.lat,
            worker.long,
            marker.lat,
            marker.long,
          ),
        }))
        .sort((a, b) => a.distancer - b.distancer)
        .slice(0, 10);

      setNearestMarkers(markersWithDistances);
      setShowFooter(true);
    }, 100); // 100ms debounce delay
  };

  function renderMarker() {
    return filtered_workers.map(worker => {
      const isSelected = selectedWorker.id === worker.id;
      const json = JSON.parse(worker.json_properties);

      return (
        <Marker
          key={worker.id}
          coordinate={{
            latitude: Number(worker.lat),
            longitude: Number(worker.long),
          }}
          // onPress={() => handleMarkerPress(worker)}

          onPress={e => {
            // Universal solution
            // e.stopPropagation(); // Works on both platforms

            // setShowFooter(true); // show footer when the map is touched

            // // For Android specifically (alternative approach)
            // if (Platform.OS === 'android') {
            //   mapRef.current?.setNativeProps({handlesMarkerPress: false});
            //   setTimeout(() => {
            //     mapRef.current?.setNativeProps({handlesMarkerPress: true});
            //   }, 100);
            // }

            handleMarkerPress(worker);
          }}
          tracksViewChanges={false}
          // Android-specific prop

          icon={() => null}>
          <View style={styles.markerContainer}>
            {zoomLevel < 14 ? (
              isSelected ? (
                <View style={styles.dotSimpleActive}>
                  <Text style={styles.dotSimpleTextActive}>
                    {renderPrice(json)}
                  </Text>
                </View>
              ) : (
                <View style={styles.dotSimple}>
                  <Text style={styles.dotSimpleText}>1</Text>
                </View>
              )
            ) : isSelected ? (
              <View style={styles.priceLabelActive}>{renderPrice(json)}</View>
            ) : (
              <View style={styles.priceLabel}>
                <Text style={{color: 'white'}}>{renderPrice(json)}</Text>
              </View>
            )}
          </View>
        </Marker>
      );
    });
  }

  const showUserHelp = () => {
    setShowGuide(true);
  };

  const centerToUserLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;

        mapRef.current?.animateToRegion(
          {
            latitude: Number(latitude),
            longitude: Number(longitude),
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          },
          500,
        );
      },
      error => {
        console.log('Error getting location:', error);
      },
      {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 10000,
      },
    );
  };

  const toggleMapType = () => {
    if (mapType === 'standard') set_mapType('hybrid');
    else if (mapType === 'hybrid') set_mapType('standard');
    else set_mapType('standard');
  };
  const getMapIcon = () => {
    if (mapType === 'standard') return 'ios-layers-outline'; // Standard map icon
    if (mapType === 'hybrid') return 'ios-globe-outline'; // Satellite icon
    return 'ios-layers-outline'; // Hybrid icon
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth radius in meters
    const toRad = deg => deg * (Math.PI / 180);

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c) / 1000; // distance in k meters
  };
  // Helper function to convert degrees to radians
  const toRadians = degrees => {
    return degrees * (Math.PI / 180);
  };

  const onPressingSingleWorker = ({worker}) => {
    setShowFooter(true);

    if (zoomLevel < 10) {
      // Fly to marker position
      mapRef.current?.animateToRegion(
        {
          latitude: Number(worker.lat),
          longitude: Number(worker.long),
          latitudeDelta: 0.01, // Close zoom level
          longitudeDelta: 0.01,
        },
        500,
      ); // Animation duration in ms
      return;
    } else {
      setSelectedMarker(worker);
      // setSelectedWorker(worker);

      // Calculate distances and get 10 nearest
      const markersWithDistances = visibleMarkers
        .map(marker => ({
          ...marker,
          distancer: getDistance(
            worker.lat,
            worker.long,
            marker.lat,
            marker.long,
          ),
        }))
        .sort((a, b) => a.distancer - b.distancer)
        .slice(0, 10); // Only keep 10 nearest
      setNearestMarkers(markersWithDistances);
      setSelectedWorker(worker);
      return;
    }
    // Set the selected worker's ID (used for highlighting)
    setSelectedWorker(worker);
  };

  const handleMapTouch = event => {
    onBackButtonSerachPressed();

    closeTopbar();
  };

  function onRegionChanged(region) {
    if (!loading) {
    }
  }
  // Toggle topbar open or close
  const toggleTopbar = () => {
    if (isTopbarOpen) {
      closeTopbar();
    } else {
      openTopbar();
    }
  };

  // Open topbar with animation
  const openTopbar = () => {
    Animated.timing(topbarAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
    setTopbarOpen(true);
  };

  // Close topbar with animation
  const closeTopbar = () => {
    Animated.timing(topbarAnim, {
      toValue: -400,
      duration: 400,
      useNativeDriver: true,
    }).start();
    setTopbarOpen(false);
  };

  const renderCategoryButton = ({item}) => (
    <TouchableOpacity
      key={item.id}
      style={styles.categoryButton}
      onPress={() => handleCategoryPress(item)}>
      <Text style={styles.categoryButtonText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const handleCategoryPress = cat => {
    set_zoomLevel(10);
    setShowFooter(false);
    setSelectedCategory(cat);

    // Immediately fetch workers for the new category
    fetchWorkersByCategory(cat.id);
  };

  const debouncedSearch = useCallback(
    debounce(text => {
      set_search_places([]);
      const query = text.trim();

      if (query.length < 2) {
        set_search_places([]);
        set_loading_search_place(false);
        return;
      }
      set_loading_search_place(true);
      axios
        .get('https://nominatim.openstreetmap.org/search', {
          params: {
            q: query + ' ایران', // Always append Iran to the query
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
          console.log(res.data);

          console.log('---------------' + res.data.length);

          const processed = res.data.map(item => {
            const address = item.address || {};

            const province = address.province || address.state || '';

            const city = address.city || address.town || '';

            const neighbourhood =
              address.neighbourhood ||
              address.district ||
              address.residential ||
              '';
            console.log(province + '----------------------');
            console.log('---------------------------');

            // console.log(item.name + '---------and the '+item.address.state);
            // Build the subtitle - show province
            let subtitle = address.state || 'ایران';
            return {
              id: item.place_id,
              title: item.display_name.split(',')[0],
              neighbourhood: neighbourhood,
              city: city,
              province: province, // Clean province name
              location: {
                y: parseFloat(item.lat),
                x: parseFloat(item.lon),
              },
            };
          });

          set_search_places(processed);
        })
        .catch(err => {
          console.error('Search error:', err);
        })
        .finally(() => set_loading_search_place(false));
    }, 1000),
    [],
  );
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleChangeInput = text => {
    set_search(text);

    // Immediately clear results if query is too short
    if (text.length < 2) {
      set_search_places([]);
      return;
    }

    // Trigger debounced search
    debouncedSearch(text);
  };

  const handleSingleLocationClicked = ({place}) => {
    setShowFooter(false);
    onBackButtonSerachPressed();

    set_search(place.title);
    // console.log(place);
    // console.log(place.location);

    const new_lat = place.location.x;

    const new_long = place.location.y;

    const PlaceRegion = {
      new_lat,
      new_long,
      latitudeDelta: 0.01, // zoom level
      longitudeDelta: 0.01, // zoom level
    };

    mapRef.current?.animateToRegion(
      {
        latitude: Number(place.location.y),
        longitude: Number(place.location.x),
        latitudeDelta: 0.01, // Close zoom level
        longitudeDelta: 0.01,
      },
      500,
    );
  };

  // Memoized functions
  const onClickSingleCategory = useCallback(
    async cat => {
      if (!cat) return;

      console.log('Changing category to:', cat.id);

      set_filter_level('base');
      set_filter_selectedCategoryegory_name(cat.name);
      // Reset states
      setSelectedCategory(cat);
      set_filtered_workers([]);
      set_loading(true);
      try {
        // Fetch workers for new category
        const response = await axios.get(
          'https://api.ajur.app/api/category-workers/',
          {
            params: {
              catid: cat.id,
              lat: userLat,
              long: userLong,
            },
          },
        );

        set_workers(response.data.workers);
        set_filtered_workers(
          response.data.workers.filter(worker => is_within_time_range(worker)),
        );
        // Move map slightly to trigger re-render
        moveMapSlightly(userLat, userLong);
      } catch (error) {
        console.error('Error fetching workers:', error);
        setErrorModalVisible(true);
      } finally {
        set_loading(false);
      }
    },
    [userLat, userLong],
  );

  const fetchWorkersByCategory = useCallback(
    async catId => {
      try {
        set_loading(true);
        const response = await axios.get(
          'https://api.ajur.app/api/category-workers/',
          {
            params: {
              catid: catId,
              lat: userLat,
              long: userLong,
            },
          },
        );

        set_workers(response.data.workers);
        set_filtered_workers(
          response.data.workers.filter(worker => is_within_time_range(worker)),
        );

        set_boxStatus(true);

        moveMapSlightly(userLat, userLong);
      } catch (error) {
        console.error('Error fetching workers:', error);
        setErrorModalVisible(true);
      } finally {
        set_loading(false);
      }
    },
    [userLat, userLong],
  );
  const onClickOpenCategorySelection = () => {
    set_filter_level('category');
  };

  const onPressingSingleTickFieldCheckbox = fl => {
    moveMapSlightly(userLat, userLong);

    let prop = {
      name: fl.value,
      value: 1,
      kind: 2,
      special: fl.special,
      order: fl.sort,
    };

    set_tick_properties([...tick_properties, prop]);
  };

  const onDeletingSingleTickFieldCheckboxFromEmpty = fl => {
    moveMapSlightly(userLat, userLong);
    set_tick_properties(tick_properties.filter(item => item.name !== fl.value));
  };
  const onDeletingSingleTickFieldCheckbox = fl => {
    moveMapSlightly(userLat, userLong);
    set_tick_properties(tick_properties.filter(item => item.name !== fl.name));
  };

  const onDeletingSinglePropertyFilter = async fl => {
    const foundItem = normal_fields.find(item => item === fl);
    if (foundItem) {
      foundItem.low = 0;
      foundItem.high = 0;
    }
    await set_properties((foundItem.low = 0));

    await set_properties((foundItem.high = 0));

    moveMapSlightly(userLat, userLong);
  };

  const renderOnOff = (fl, index) => {
    const x = tick_properties.find(item => item.name === fl.value);

    if (x) {
      return (
        <TouchableOpacity
          style={styles.tickField_container}
          onPress={() => onDeletingSingleTickFieldCheckboxFromEmpty(fl)}>
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

  const handleTimeFilterChange = value => {
    setTimeRange(value);
    // Do something with selected time range, e.g., filter data
    console.log('Selected time range:', value);
    moveMapSlightly(userLat, userLong);
  };

  const handleRangeChange = range => {
    console.warn('Selected range:', range);
  };

  const calculatemilion = amount => {
    return amount / 1000000;
  };
  const [slider_filters, setSliderFilters] = useState({});
  const handleSliderChange = (name, low, high) => {
    return;
    console.warn(name);
    setSliderFilters(prev => ({...prev, [name]: values}));
  };
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
  const renderFiltersBasedOnCategorySelected = () => {
    return (
      <>
        {tick_fields.map((fl, index) => fl.special == 1 && renderOnOff(fl))}

        <View
          style={{
            paddingHorizontal: 2,
          }}>
          {normal_fields
            .filter(function (fl) {
              return fl.special == 1;
            })
            .map(function (fl, index) {
              return React.createElement(
                View,
                {
                  key: fl.id ? fl.id.toString() : index.toString(),
                  style: {
                    width: '100%',
                    alignSelf: 'stretch',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                },
                React.createElement(RangeDropdown, {
                  fl: fl,
                  onChange: async function (fieldId, values) {
                    // Handle the change in parent component
                    var rounded_min_value = values.low;
                    var rounded_high_value = values.high;

                    var filtered = normal_fields.filter(x => {
                      return x.id === fieldId;
                    });

                    console.log(
                      '--------------- the properties now is --------------' +
                        fieldId,
                    );

                    console.log(properties);

                    await set_properties((filtered[0].low = rounded_min_value));
                    await set_properties(
                      (filtered[0].high = rounded_high_value),
                    );
                    moveMapSlightly(userLat, userLong);
                  },
                }),
              );
            })}
        </View>
      </>
    );
  };

  const onClickFinishFitering = () => {
    setIsFilterModalVisible(false);
  };

  const renderFilterActionButtons = () => {
    if (filter_level === 'base') {
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
                {'تایید و نمایش'} ({' ' + visibleMarkers.length + ' فایل '} )
              </Text>
            </View>
          )}
        </TouchableOpacity>
      );
    } else if (filter_level === 'region') {
      return (
        <View style={styles.actionBar}>
          <View style={styles.buttonRow}>
            {selected_neighborhoods.length > 0 ? (
              <TouchableOpacity
                style={[styles.button, styles.resetButton]}
                onPress={onClickResetNeighborhoodsForm}>
                <Text style={styles.resetButtonText}>پاک کردن انتخاب ها</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.allAreasButton]}
                onPress={onClickCheckAllNeighborhoodsForm}>
                <Text style={styles.allAreasButtonText}>همه مناطق</Text>
              </TouchableOpacity>
            )}

            {selected_neighborhoods.length > 0 && (
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={onClickConfirmFilteringNeighborhoods}>
                <Text style={styles.confirmButtonText}>
                  {'تایید '} ({department_workers.length + '  فایل  '} )
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    }
  };
  const moveMapSlightly = (latitude, longitude) => {
    // if (mapRef.current && userLat) {
    if (latitude) {
      mapRef.current.animateCamera(
        {
          center: {
            latitude: latitude + 0.0000001,
            longitude: longitude + 0.0000001,
          },
          // zoom: zoomLevel, // optional
          // heading: 0, // optional
          // pitch: 0, // optional
          // altitude: 1000, // optional
        },
        {duration: 1000},
      );
    }
  };

  const moveToNewLocation = useCallback(
    (latitude, longitude) => {
      if (!mapRef.current || !latitude || !longitude) return;

      // Add threshold to prevent micro-movements
      const shouldMove =
        !userLat ||
        Math.abs(latitude - userLat) > 0.0001 ||
        Math.abs(longitude - userLong) > 0.0001;

      if (shouldMove) {
        mapRef.current.animateCamera(
          {
            center: {
              latitude: Number(latitude),
              longitude: Number(longitude),
            },
            zoom: 15,
          },
          {duration: 500},
        );
      }
    },
    [userLat, userLong],
  );

  const renderCategorySelectionBar = () => {
    if (!filter_selectedCategoryegory_name) {
      return (
        <>
          {/* Wrapper */}
          <View style={styles.filterBarWrapper}>
            {/* Button */}
            <TouchableOpacity onPress={onClickOpenCategorySelection}>
              <Text style={styles.filterBarButton}>انتخاب</Text>
            </TouchableOpacity>
            {/* Text */}
            <Text style={styles.filterBarText}>انتخاب دسته بندی</Text>
          </View>

          {/* Divider */}
          <View style={[styles.divider, {height: 1}]} />
        </>
      );
    } else {
      return (
        <>
          {/* Wrapper */}
          <View style={styles.filterBarWrapper}>
            {/* Button */}
            <TouchableOpacity onPress={onClickOpenCategorySelection}>
              <Text style={styles.filterBarButton}>تغییر</Text>
            </TouchableOpacity>
            {/* Text */}
            <Text style={styles.filterBarText}>
              {'دسته بندی'} {filter_selectedCategoryegory_name}
            </Text>
          </View>

          {/* Divider */}
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
          {/* {renderRegionSelectionBar()} */}
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
    } else if (filter_level === 'region') {
      return (
        <View style={styles.regionContainer}>
          {neighborhoods.map((neighbor, index) =>
            renderOnOffNeighborhoods(neighbor, index),
          )}
        </View>
      );
    }
  };

  // Recommended approach:
  const debounceDelay = __DEV__ ? 200 : 300;

  const filteredWorkersRef = useRef(filtered_workers);

  // Update ref when filtered_workers changes
  useEffect(() => {
    filteredWorkersRef.current = filtered_workers;
  }, [filtered_workers]);
  const DEBOUNCE_DELAY = 100; // Adjust as needed (300-1000ms)

  const noDebouncedRegionChange = () => {
    try {
      const {latitude, longitude, latitudeDelta, longitudeDelta} = region;

      // Calculate bounds more efficiently
      const halfLatDelta = latitudeDelta / 2;
      const halfLngDelta = longitudeDelta / 2;

      const visibleMarkers = filteredWorkersRef.current.filter(
        marker =>
          marker.lat >= latitude - halfLatDelta &&
          marker.lat <= latitude + halfLatDelta &&
          marker.long >= longitude - halfLngDelta &&
          marker.long <= longitude + halfLngDelta,
      );
      // Single state update instead of multiple promises
      setVisibleMarkers(visibleMarkers);

      // Calculate zoom level more efficiently

      // Update user position
      set_userLat(latitude);
      set_userLong(longitude);
    } catch (error) {
      console.error('Region change error:', error);
    } finally {
    }
  };

  const normalRegionChange = region => {
    try {
      const {latitude, longitude, latitudeDelta, longitudeDelta} = region;

      const halfLatDelta = latitudeDelta / 2;
      const halfLngDelta = longitudeDelta / 2;

      const visibleMarkers = filteredWorkersRef.current.filter(
        marker =>
          marker.lat >= latitude - halfLatDelta &&
          marker.lat <= latitude + halfLatDelta &&
          marker.long >= longitude - halfLngDelta &&
          marker.long <= longitude + halfLngDelta,
      );

      setVisibleMarkers(visibleMarkers);
      setVisibleMarkerCount(visibleMarkers.length);
      set_userLat(latitude);
      set_userLong(longitude);
    } catch (error) {
      console.error('Region change error:', error);
    } finally {
      // set_spinnerOpacity(false);
    }
  };

  // Add this useEffect hook to your component
  useEffect(() => {
    if (mapRef.current && filtered_workers.length > 0 && region) {
      isFirstLoadRef.current = true; // Set flag for initial load
      triggerClosestMarker();
    }
  }, [mapRef.current, filtered_workers, region]); // Runs when these dependencies change

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (markerPressTimeoutRef.current) {
        clearTimeout(markerPressTimeoutRef.current);
      }
    };
  }, []);
  // Modified triggerClosestMarker function
  const triggerClosestMarker = () => {
    if (!mapRef.current || filtered_workers.length === 0 || !region) return;

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
      // Directly set the selected worker without going through handleMarkerPress
      setSelectedWorker(closestMarker);
      const markersWithDistances = filtered_workers
        .map(marker => ({
          ...marker,
          distancer: getDistance(
            closestMarker.lat,
            closestMarker.long,
            marker.lat,
            marker.long,
          ),
        }))
        .sort((a, b) => a.distancer - b.distancer)
        .slice(0, 10);

      // setNearestMarkers(markersWithDistances);
      setShowFooter(true);

      // Reset the first load flag after a delay
      setTimeout(() => {
        isFirstLoadRef.current = false;
      }, 500);
    }
  };

  // Also call it when filtered_workers changes
  // useEffect(() => {
  //   if (filtered_workers.length > 0) {
  //     triggerClosestMarker();
  //   }
  // }, [filtered_workers]);

  // Update ref when filtered_workers changes
  useEffect(() => {
    filteredWorkersRef.current = filtered_workers;

    // Trigger closest marker immediately when filtered workers change
    if (filtered_workers.length > 0 && region) {
      setTimeout(() => {
        triggerClosestMarker();
      }, 50);
    }
  }, [filtered_workers]);

  const handleRegionChange = () => {
    set_loading(true);
  };

  // const handleRegionChangeComplete = region => {

  //   alert(Math.random(1,2000));
  //   // set_zoomLevel(Math.round(Math.log(360 / LATITUDE_DELTA) / Math.LN2));
  //   set_zoomLevel(Math.round(Math.log2(360 / region.longitudeDelta)));

  //   console.log(zoomLevel);

  //   normalRegionChange(region);
  //   setRegion(region);
  //   // Add this line to trigger closest marker after region change
  //   // setTimeout(triggerClosestMarker, 300); // Small delay to ensure state updates
  //   triggerClosestMarker();
  // };

  const handleRegionChangeComplete = region => {
    // Store the latest region
    latestRegionRef.current = region;

    // Clear previous timeout
    if (regionChangeTimeoutRef.current) {
      clearTimeout(regionChangeTimeoutRef.current);
    }

    // Set new timeout
    regionChangeTimeoutRef.current = setTimeout(() => {
      // Use the latest region that was captured
      const finalRegion = latestRegionRef.current;

      // alert(Math.random(1,2000));
      set_zoomLevel(Math.round(Math.log2(360 / finalRegion.longitudeDelta)));
      console.log(zoomLevel);
      normalRegionChange(finalRegion);
      setRegion(finalRegion);
      triggerClosestMarker();
    }, 300);
  };

  const renderSerachQuery = () => {
    return search_places.map(
      (place, index) =>
        index < 9 && (
          <TouchableOpacity
            key={place.id} // Make sure each item has a unique key
            style={styles.singleSearchResult}
            onPress={() => handleSingleLocationClicked({place})} // Handle press
          >
            <View>
              <Text style={styles.placeTitle}>
                {place.title} {place.neighbourhood} {place.city}(
                {place.province})
              </Text>
            </View>
          </TouchableOpacity>
        ),
    );
  };

  if (!region) {
    return (
      <View style={styles.spinnerImageView}>
        {/* <VideoSpinner /> */}
        <Spinner
          style={styles.spinner}
          isVisible={true}
          size={30}
          type="Circle"
          color="#b92a31"
        />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar backgroundColor="#b92a31" barStyle="light-content" />

      <ClusterMap
        ref={mapRef}
        minPoints={5} // Minimum markers to form a cluster
        maxPoints={50} // Maximum before splitting
        radius={45} // Balanced cluster radius
        nodeSize={24} // Medium detail level
        extent={768} // Balanced processing area
        liteMode={false}
        // maxZoom={10}
        clusterColor="#b92a3180"
        zoomTapEnabled={false} // Add this
        showsUserLocation={true}
        provider="google"
        style={styles.map}
        mapType={mapType}
        initialRegion={{
          latitude: Number(region.latitude),
          longitude: Number(region.longitude),
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        //  onPanDrag={handlePanDrag}

        onRegionChange={handleRegionChange}
        onRegionChangeComplete={handleRegionChangeComplete}
        animateToRegion={true}
        onTouchStart={handleMapTouch} // Detect map touch
        onClusterPress={cluster => {
          // event.stopPropagation();
          handleClusterPress(cluster);
        }}
        onPress={e => {
          setShowFooter(false); // Hide footer when the map is touched
          setSelectedWorker([]);
        }}>
        {renderMarker()}
      </ClusterMap>

      <ImageSliderModal
        visible={isHintModalVisible}
        onClose={() => set_isHintModalVisible(false)}
      />
      {loading ? (
        <TouchableOpacity style={styles.visisbleMarkerButton}>
          <Text style={styles.visisbleMarkerText}>
            در حال بارگذاری : <ActivityIndicator size={20} color="white" />
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.visisbleMarkerButton}>
          <Text style={styles.visisbleMarkerText}>
            قابل مشاهده : {visibleMarkers.length}
          </Text>
        </TouchableOpacity>
      )}

      <NewWorkerFab
        navigation={navigation} // Add this line
        showFooter={showFooter}
        visibleMarkers={visibleMarkers}
        loading={loading}
      />

      {renderFooter()}
      {/* {renderHeader()} */}
      {/* { <SearchBars realstates={realstates} /> } */}
      {<SearchBars />}
      {renderMapLoader()}
      {renderHeaderFilters()}

      {/* Toggle Button */}
      {mapOrList == 'map' && !isFooterExpanded && (
        <>
          <TouchableOpacity style={styles.toggleButton} onPress={toggleMapType}>
            <Icon
              style={styles.toggleIcon}
              name={getMapIcon()}
              size={30}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.userLocationButton}
            onPress={centerToUserLocation}>
            <Icon
              style={styles.toggleIcon}
              name="locate"
              size={30}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.userHelpButton}
            onPress={showUserHelp}>
            <Icon
              style={styles.helpIcon}
              name="help-circle-outline"
              size={30}
              color="black"
            />
          </TouchableOpacity>
        </>
      )}
      {/* Search Modal */}
      {/* Full-Screen Search Modal */}
      <Modal
        visible={isSearchModalVisible}
        transparent={false} // Fullscreen by setting transparent to false
        animationType="slide"
        onRequestClose={toggleSearchModal}>
        <View style={styles.fullScreenModalContainer}>
          {renderHeader()}
          <View style={{marginTop: 100}}>{renderSearchResults()}</View>
        </View>
      </Modal>
      <Modal
        visible={isFilterModalVisible}
        transparent={false} // Fullscreen by setting transparent to false
        animationType="slide"
        onRequestClose={toggleFilterhModal}>
        <View style={styles.fullScreenFilterModalContainer}>
          <View style={styles.filterModalContent}>
            {/* <Text>filters</Text> */}
            {renderFilterSectionPages()}

            {renderTimeFrameFilter()}

            <TouchableOpacity
              style={[
                styles.moreFilter,
                showMoreFilters && styles.moreFilterActive,
              ]}
              onPress={toggleMoreFilters}>
              <View style={styles.moteFilterButtonWrapper}>
                <Text
                  style={[
                    styles.moreFilterText,
                    showMoreFilters && styles.moreFilterTextActive,
                  ]}>
                  {showMoreFilters ? 'نمایش فیلترهای کمتر' : 'فیلتر های بیشتر'}
                </Text>
                <Icon
                  name={showMoreFilters ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={showMoreFilters ? '#d96e6eff' : '#b92a31'}
                  style={styles.arrow}
                />
              </View>
            </TouchableOpacity>
            <ScrollView style={styles.filtersBasedOnCategorySelected}>
              {/* {renderFiltersBasedOnCategorySelected()} */}

              <View>
                {showMoreFilters ? (
                  <Animated.View>
                    {renderFiltersBasedOnCategorySelected()}
                  </Animated.View>
                ) : null}
              </View>
            </ScrollView>
            {renderFilterActionButtons()}
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={toggleFilterhModal}>
              <Icon name="ios-close" size={20} color="#f9f9f9" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <GuideOverlay
        visible={showGuide}
        onComplete={() => setShowGuide(false)}
      />
      <MapErrorModal
        visible={errorModalVisible}
        onRefresh={() => {
          setErrorModalVisible(false);
          grab_worker_based_on_filter();
        }}
      />
    </GestureHandlerRootView>
  );
};
export default MainMap;
