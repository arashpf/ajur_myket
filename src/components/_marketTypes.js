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

import {Box, Button, Text, Tooltip} from 'native-base';

import RangeSlider from './map/RangeSlider';

import {debounce} from 'lodash';

// import IntentLauncher from 'react-native-intent-launcher';

import Swiper from 'react-native-swiper';
import Carousel from 'react-native-reanimated-carousel';

import Slider from '@react-native-community/slider';

const ImageSliderModal = ({visible, onClose}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  let swiperRef = null;

  const images = [
    {
      id: '1',
      uri: 'https://ajur.app/img/tehran.png',
      desc: ' شما میتوانید در سراسر کشور عزیزمان ملک ها را ببینید یا ملکی برای فروش و اجاره را به نقشه پین کنید',
    },
    {
      id: '2',
      uri: 'https://ajur.app/logo/ajour-meta-image.jpg',
      desc: 'فایل شما با گذشت یک ماه ، دو ماه  و یا حتی یک سال در آجر همچنان موجود خواهد بود، و  و تا لحظه فروش به مشتریان نمایش داده خواهد شد',
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.hintModalContainer}>
        <View style={styles.hintModalContent}>
          <Text style={styles.hintTitle}>به نقشه آجر خوش آمدید</Text>

          {/* Swiper Slider */}
          <Swiper
            ref={ref => (swiperRef = ref)}
            style={styles.swiper}
            showsPagination
            dotStyle={styles.hintdot}
            activeDotStyle={styles.hintActiveDot}
            loop={false}
            // loadMinimal
            onIndexChanged={index => setCurrentIndex(index)} // Track index change
          >
            {images.map(item => (
              // <Text>hi item</Text>

              <>
                <Image
                  key={item.id}
                  source={{uri: item.uri}}
                  style={styles.hintImage}
                />
                <Text style={styles.hintDesc}> {item.desc} </Text>
              </>
            ))}
          </Swiper>

          {/* Dynamic Button */}
          {currentIndex < images.length - 1 ? (
            // <TouchableOpacity onPress={() => swiperRef.scrollBy(1)} style={styles.button}>
            //   <Text style={styles.buttonText}>Next Tip</Text>
            // </TouchableOpacity>

            <TouchableOpacity
              onPress={() => swiperRef.scrollBy(1)}
              style={styles.hintNextButton}>
              <Text style={styles.buttonText}>مشاهده بعدی</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={onClose} style={styles.hintButton}>
              <Text style={styles.buttonText}>متوجه شدم</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

import {useFocusEffect, useNavigation} from '@react-navigation/native';

import {useCallback} from 'react';
// import MapView, {
//   Marker,
//   Callout,
//   ProviderPropType,
//   PROVIDER_GOOGLE,
// } from 'react-native-maps';

// import {
//   Marker,
//   Callout,
//   ProviderPropType,
//   PROVIDER_GOOGLE,
// } from 'react-native-maps';
import MapView, {Marker} from 'react-native-maps';

import WorkerCard from './cards/WorkerCard';
// import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

// import BottomSheet from '@gorhom/bottom-sheet';
// Snap points for the bottom drawer
const snapPoints = ['25%', '50%', '100%']; // Adjust to your liking
// import MapView from 'react-native-map-clustering';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import ClusterMap from 'react-native-map-clustering';

import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import Spinner from 'react-native-spinkit';
import Geolocation from '@react-native-community/geolocation';
// import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
// import flagBlueImg from './assets/flag-blue.png';
// import flagPinkImg from './assets/flag-pink.png';
import gps from './assets/gps.png';
// import repair from './assets/repair-tool.png';
// import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VideoSpinner from './parts/VideoSpinner';
const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
let LATITUDE = 35.7074612;
let LONGITUDE = 51.3005805;
const LATITUDE_DELTA = 0.0422;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

const markerImages = {
  gps: require('./assets/gps.png'),
  repair: require('./assets/gps.png'),
  home: require('./assets/gps.png'),
  office: require('./assets/gps.png'),
  inductry: require('./assets/gps.png'),
  land: require('./assets/gps.png'),
  sport: require('./assets/gps.png'),
  vacations: require('./assets/gps.png'),
  wedding: require('./assets/gps.png'),
};

const MarkerTypes = props => {
  const navigation = useNavigation();
  // Create the ref
  const inputRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      // Trigger a refresh by setting state or fetching data
      // console.log('MarkerTypes tab focused');

      return () => {
        // Cleanup if needed
      };
    }, []),
  );

  const mapRef = useRef(null);
  const mapViewRef = useRef(null);
  // var catid = props.choosedcat ? props.choosedcat.id : 11;
  const [choosedcat, set_choosedcat] = useState(17);
  const [selected_cat, set_selected_cat] = useState();

  const [selectedCluster, setSelectedCluster] = useState(null);
  const [sliderVisible, setSliderVisible] = useState(false);
  const carouselRef = useRef(null);

  const [marker1, set_marker1] = useState(true);
  const [marker2, set_marker2] = useState(true);

  const [region, setRegion] = useState(null);

  const [initialPosition, set_initialPosition] = useState();

  const [userLat, set_userLat] = useState();

  const [userLong, set_userLong] = useState();

  const [userInitialLat, set_userInitialLat] = useState(35.6998186);

  const [userInitialLong, set_userInitialLong] = useState(51.31911);

  const [userCurrentLat, set_userCurrentLat] = useState(null);

  const [userCurrentLong, set_userCurrentLong] = useState(null);

  const [isCatSelectd, set_isCatSelectd] = useState(false);

  const [workers, set_workers] = useState([]);
  const [filtered_workers, set_filtered_workers] = useState([]);
  const [markers, set_markers] = useState([]);
  const [cats, set_cats] = useState([]);

  const [specials, set_specials] = useState([]);

  const [uppers, set_uppers] = useState([]);

  const [magnetColor, set_magnetColor] = useState('orange');
  const [magnet_outline, set_magnet_outline] = useState('');

  const [boxStatus, set_boxStatus] = useState(false);

  const [loading, set_loading] = useState(true);
  const [loading2, set_loading2] = useState(false);

  const [Hint, set_Hint] = useState(false);
  const [spinnerOpacity, set_spinnerOpacity] = useState(true);

  const [zoomLevel, set_zoomLevel] = useState(14);
  const [clusterRadius, setClusterRadius] = useState(30);

  const [returnedPlaces, set_returnedPlaces] = useState([]);

  const [mapType, set_mapType] = useState('hybrid');
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
  const [filter_selected_category_name, set_filter_selected_category_name] =
    useState();
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

  const [loadedCount, setLoadedCount] = useState(4); // Start with 5

  const lazyVisibleMarkers = nearestMarkers.slice(0, loadedCount);
  const [isLoading, setIsLoading] = useState(false);
  const increment = 5;

  // Limit the visible items shown in the carousel

  // Limit the visible items shown in the carousel

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

  useEffect(() => {
    setLoadedCount(4); // Reset when markers update
  }, [visibleMarkers]);

  useEffect(() => {
    activeItem && setSelectedWorker(activeItem);
  }, [activeItem]);

  useEffect(() => {


   
    
    // var selected_normal_field = normal_fields.filter(field => {
    //   if (field.low !== 0 || field.high === properties) return field;
    // });

    if (!choosedcat) {
      set_filtered_workers([]);
      return;
    }

    // const old_workers = [...all_workers];
    // const filtering_the_workers = filtered_workers.filter(worker => {
      const filtering_the_workers = workers.filter(worker => {
      
      if (selected_cat === 'all') return worker;

      if (choosedcat) {
        if (worker.category_id != choosedcat) return false;
      }

      return worker;
    });

    const fitering_on_range = filtering_the_workers.filter(worker => {
      const is_in_range = is_worker_in_range(worker);

      if (is_in_range) return worker;
    });

    set_filtered_workers(fitering_on_range);
  }, [selected_cat, properties, tick_properties,normal_fields]);

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
      if (!hasSeenModal) {
        set_isHintModalVisible(true);
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
    axios({
      method: 'get',
      url: 'https://api.ajur.app/api/sub-category',
    }).then(function (response) {
      // console.log('the response data in CategoryForm');
      // console.log(response.data);
      set_cats(response.data);
    });
  }, []);

  useEffect(() => {
    if (selected_cat) {
      axios({
        method: 'get',
        url: 'https://api.ajur.app/api/category-fields',
        params: {
          cat: selected_cat.id,
        },
      })
        .then(function (response) {
          // console.log('the filed come from category-fields is ----');
          // console.log(response.data.normal_fields);

          set_normal_fields(response.data.normal_fields);
          set_tick_fields(response.data.tick_fields);
          set_predefine_fields(response.data.predefine_fields);
        })
        .catch(function (error) {
          console.error('Error fetching category fields:', error);
        });
        moveMapSlightly();
    }
  }, [selected_cat]);

  const checkGPSStatus = () => {
    Geolocation.getCurrentPosition(
      position => {
        set_is_location_exist(true); // Always set to true when location found
        const {latitude, longitude} = position.coords;
        console.log('Latitude:', latitude, 'Longitude:', longitude);
        // grab_worker_based_on_filter();
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

  // Handle cluster press
  const handleClusterPress = (cluster, markers) => {
    // setSelectedCluster(markers);
    // setSelectedMarker(markers[0]);
    // setShowFooter(true);
    // setSliderVisible(true);
    // setShowFooter(true);
    // Optional: Zoom to cluster
    // mapRef.current?.animateToRegion({
    //   latitude: cluster.geometry.coordinates[1],
    //   longitude: cluster.geometry.coordinates[0],
    //   latitudeDelta: 0.1,
    //   longitudeDelta: 0.1,
    // });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkGPSStatus();
    }, 10000); // Runs every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const grab_worker_based_on_filter = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        // alert('grab worker called now here');
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.0922, // zoom level
          longitudeDelta: 0.0421, // zoom level
        };
        setRegion(newRegion);

        // If map reference is available, animate to the user's location
        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 1000); // 1000ms animation
        }

        // fetching worker from api

        if (choosedcat) {
          var baseurl = 'https://api.ajur.app/api/category-workers/';
          var catid = choosedcat;
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
              set_isCatSelectd(true);
              set_loading(false);
              set_boxStatus(true);
              // moveMapSlightly(latitude,longitude);

              // alert(
              //   'the chooed cat workers length is :' +
              //     response.data.workers.length,
              // );
            })
            .catch(function (error) {});
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
  }, [is_location_exist]);

  const handleStartSearch = () => {
    setIsSearchFocused(true);
    setIsSearchModalVisible(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
  };

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
                {place.title} ({place.region})
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
          {/* Fixed Header (90% search + 10% filter) */}
          <View style={styles.header2}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rtlFilterScroll}
              snapToInterval={100} // Item width (90) + margin (10)
              snapToAlignment="start" // RTL snaps to end
              decelerationRate="fast"
              inverted // Reverse scroll direction for RTL
            >
              <TouchableOpacity
                style={styles.categoryBox}
                onPress={toggleFilterhModal}>
                <View style={styles.buttonWrapper}>
                  <Text style={styles.categoryText}>
                    {selected_cat ? selected_cat.name : 'فروش ویلایی'}
                  </Text>

                  {selected_cat ? (
                    <Icon
                      name="chevron-down"
                      size={20}
                      color="gray"
                      style={styles.arrow}
                    />
                  ) : (
                    <Icon
                      name="chevron-down"
                      size={20}
                      color="gray"
                      style={styles.arrow}
                    />
                  )}
                </View>
              </TouchableOpacity>

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
              // return fl.special == 1; 
              return fl.low > 0 || fl.high > 0; 

            })
            .map(function (fl, index) { 
             return (<TouchableOpacity
                style={styles.categoryBox}
                onPress={() => onDeletingSinglePropertyFilter(fl)}
                >
                <View style={styles.buttonWrapper}>
                  <Text style={styles.categoryText}>{fl.value}</Text>

                  <Icon
                    name="close"
                    size={20}
                    color="red"
                    style={styles.arrow}
                  />
                </View>
              </TouchableOpacity>)
              
              
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

  const renderHeader = () => {
    if (1) {
      return (
        <>
          {/* Fixed Header (90% search + 10% filter) */}
          <View style={styles.header}>
            {/* Search Input (90%) */}
            <View
              style={[
                styles.searchContainer,
                isSearchFocused && styles.searchContainerFocused,
              ]}>
              {isSearchFocused ? (
                <Icon
                  name="arrow-back-outline"
                  size={30}
                  color="#999"
                  onPress={onBackButtonSerachPressed}
                  style={styles.searchIcon}
                />
              ) : (
                <Icon
                  name="search-outline"
                  onPress={handleStartSearch}
                  size={20}
                  color="#999"
                  style={styles.searchIcon}
                />
              )}

              {isSearchFocused ? (
                <TextInput
                  ref={inputRef}
                  style={styles.searchInput}
                  placeholder="جستجو شهر و منطقه"
                  placeholderTextColor="#999"
                  value={search}
                  onChangeText={text => handleChangeInput(text)}
                  onFocus={() => {}}
                  onBlur={() => {}}
                />
              ) : (
                <TouchableOpacity
                  style={{width: '85%'}}
                  onPress={handleStartSearch}>
                  {search ? (
                    <Text>{search}</Text>
                  ) : (
                    <Text>جستجو شهر ، منطقه </Text>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* Filter Button (10%) */}
            <TouchableOpacity
              style={styles.filterButton}
              onPress={toggleFilterhModal}>
              <Icon name="options-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </>
      );
    }
  };

  const renderFooter = () => {
    if (!showFooter || !selectedWorker) return null;

    return (
      <View style={styles.footer}>
        {
          <Carousel
            ref={carouselRef}
            loop={false}
            width={width}
            height={250}
            data={lazyVisibleMarkers} // 👈 use sliced lazy data
            isRTL={true}
            mode="parallax"
            parallaxScrollingOffset={50}
            parallaxScrollingScale={0.9}
            style={{width: '100%'}}
            // panGestureHandlerProps={{
            //   activeOffsetX: [-10, 10],
            //   activeOffsetY: [-1000, 1000],
            // }}
            onSnapToItem={index => {
              if (index >= lazyVisibleMarkers.length - 1 && !isLoading) {
                loadMoreItems();
              }

              setSelectedMarker(visibleMarkers[index]);
              setActiveItem(visibleMarkers[index]);
            }}
            renderItem={({item, index}) => (
              <>
                {/* <WorkerCard data={item} /> */}
                {/* <Text>{item.id}</Text> */}

                {/* Show a "Loading more..." message or spinner if still loading */}
                {isLoading ? (
                  index === lazyVisibleMarkers.length - 1 && (
                    <View style={styles.LoadingMoreCard}>
                      <ActivityIndicator size="large" color="#b92a31" />
                    </View>
                  )
                ) : (
                  <WorkerCard data={item} />
                )}
              </>
            )}
          />
        }
      </View>
    );
  };

  const openLocationSettings = () => {
    if (Platform.OS === 'android') {
      Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS'); // IntentLauncher.startActivity({
    } else {
      Linking.openURL('app-settings:'); // iOS: opens general settings
    }
  };

  const toggleFilterhModal = () => {
    setIsFilterModalVisible(!isFilterModalVisible);
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
    // Perform the search logic (e.g., search for locations)
    alert(`Searching for: ${searchText}`);
    setIsSearchModalVisible(false);
  };

  const renderPrice = properties => {
    // const formatNumber = (num) => {
    //   return String(num).replace(/(.)(?=(\d{3})+$)/g, "$1,");
    // };

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
          {zoomLevel > 15 && (
            <>
              {'\n'}
              {' متری '}

              {formatNumber(pricePerM2Value)}
            </>
          )}
        </Text>
      );
    } else if (rentFront) {
      const rentFrontNoFormat = rentFront.value;
      const rentPerMonthNoFormat = rentPerMonth?.value || 0;

      return (
        <View style={styles.price_row}>
          {rentPerMonthNoFormat !== 0 ? (
            <Text style={[styles.text, styles.rtl, styles.paddingRight]}>
              <Text style={styles.boldText}>
                {formatNumber(rentPerMonthNoFormat)} {' اجاره '}
              </Text>
            </Text>
          ) : (
            <Text style={[styles.text, styles.rtl, styles.paddingRight]}>
              <Text style={styles.boldText}>{'کامل'}</Text>
            </Text>
          )}

          <Text style={[styles.text, styles.rtl]}>
            <Text style={styles.boldText}>
              {formatNumber(rentFrontNoFormat)} {' رهن '}
            </Text>
          </Text>
        </View>
      );
    }

    return null;
  };

  function renderMarker() {
    if (isCatSelectd == false) {
    } else {
      // if(zoomLevel < 12){

      return filtered_workers.map(worker => (
        <Marker
       
          // style={{transform: [{scale: 1.5}]}} // Scale the marker if needed
          tracksViewChanges={false}
          key={worker.id}
          // animation="drop"
          onPress={() => {
            onPressingSingleWorker({worker});

            setSelectedWorker(worker);

            // console.log('Worker pressed:', worker.id);
          }}
          coordinate={{
            latitude: Number(worker.lat),
            longitude: Number(worker.long),
          }}
          // Hide default marker
          icon={() => null}
          // centerOffset={{ x: -42, y: -60 }}
          // anchor={{ x: 0.84, y: 1 }}
          // image={markerImages[worker.avatar]}
        >
          {/* <Image
                style={{width: 30, height: 30, padding: 10}}
                source={markerImages[worker.avatar]}
              /> */}
          {/* <Icon name="ios-home" size={40} color='#4CAF50' /> */}
          {/* <Icon name="ios-home" size={30} color="#ff5722" />
              <View style={styles.priceLabel}>
                <Text style={styles.priceText}>{worker.id}</Text>
              </View> */}

          <View style={styles.markerContainer}>
            {selectedWorker.id === worker.id ? (
              <View style={styles.priceLabelActive}>
                {/* <Text style={styles.priceText}>{worker.id}</Text> */}
                <></>
                {renderPrice(JSON.parse(worker.json_properties))}
              </View>
            ) : (
              <View style={styles.priceLabel}>
                {renderPrice(JSON.parse(worker.json_properties, worker.id))}
              </View>
            )}
          </View>
        </Marker>
      ));
    }
  }

  const handleMarkerPress = worker => {};

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

    return (R * c)/1000; // distance in k meters
  };

  // Helper function to convert degrees to radians
  const toRadians = degrees => {
    return degrees * (Math.PI / 180);
  };

  const onPressingSingleWorker = ({worker}) => {
    setSelectedMarker(worker);
    setSelectedWorker(worker);

    // Calculate distances and get 10 nearest
    const markersWithDistances = visibleMarkers
      .map(marker => ({
        ...marker,
        distancer: getDistance(worker.lat, worker.long, marker.lat, marker.long),
      }))
      .sort((a, b) => a.distancer - b.distancer)
      .slice(0, 10); // Only keep 10 nearest

    setNearestMarkers(markersWithDistances);

    setShowFooter(true);

    return;

    // Get the current count of presses for the worker
    const currentPressCount = pressedMarkers[worker.id] || 0;

    // If it's the first press, just change the color to green
    if (currentPressCount === 0) {
      setPressedMarkers(prevState => ({
        ...prevState,
        [worker.id]: 1, // Set the press count to 1 for the first press
      }));
      // set_mapType('hybrid');
    }

    // If it's the second press, perform the camera animation (zoom, pitch, and rotation)
    if (currentPressCount === 1) {
      // if (mapRef.current) {
      //   mapRef.current.animateCamera(
      //     {
      //       center: {
      //         latitude: Number(worker.lat),
      //         longitude: Number(worker.long),
      //       },
      //       pitch: 60, // Tilt for 3D effect
      //       heading: 30, // Rotate the map
      //       // zoom: 18, // Zoom in for a closer view
      //       zoom: zoomLevel < 16 && zoomLevel + 2, // Zoom in for a closer view
      //     },
      //     {duration: 1000},
      //   );
      //   // set_mapType('standard');
      // }

      // Reset the press count after the second press, so it's ready for future presses
      setPressedMarkers(prevState => ({
        ...prevState,
        [worker.id]: 0, // Reset the count back to 0
      }));
    }

    // Set the selected worker's ID (used for highlighting)
    setSelectedWorker(worker);
  };

  const handleMapTouch = () => {
    onBackButtonSerachPressed();
    setShowFooter(false); // Hide footer when the map is touched
    setSelectedWorker([]);

    closeTopbar();
  };

  function onRegionChanged(region) {
    if (!loading) {
      set_loading(true);
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
    // alert(`Selected category: ${cat.name}`);
    set_zoomLevel(10);
    setShowFooter(false);

    set_loading(true);

    // toggleTopbar();

    set_selected_cat(cat);

    set_choosedcat(cat.id);

    if (choosedcat) {
      var baseurl = 'https://api.ajur.app/api/category-workers/';
      var catid = cat.id;
      axios({
        method: 'get',
        url: baseurl,
        params: {
          catid: catid,
        },
      })
        .then(function (response) {
          set_workers(response.data.workers);
          set_filtered_workers(response.data.workers);

          set_markers(response.data.workers);

          // set_uppers(response.data.uppers);
          // set_specials(response.data.specials);
          set_isCatSelectd(true);
          // set_loading(false);
          set_boxStatus(true);

          // moveMapSlightly(userLat,userLong);

          // alert(
          //   'the chooed cat workers length is :' +
          //     response.data.workers.length,
          // );
          set_loading(false);
        })
        .catch(function (error) {
          alert('error happened here' + error);
          set_loading(false);
        });
    }

    // Add your logic here, such as navigating or filtering data
  };

  const debouncedSearch = useCallback(
    debounce(text => {
      if (text.length < 2) {
        set_search_places([]);
        set_loading_search_place(false);
        return;
      }

      set_loading_search_place(true);

      axios({
        method: 'get',
        url: 'https://api.neshan.org/v1/search',
        headers: {
          'api-key': 'service.UylIa21mMdoxUKtQ9nnS7b3dE5sJfgKWPpRVoyPV',
        },
        params: {
          term: text,
          lat: 35,
          lng: 52,
        },
      })
        .then(response => {
          set_search_places(response.data.items);
        })
        .catch(error => {
          console.error('Error fetching search results: ', error);
        })
        .finally(() => {
          set_loading_search_place(false);
        });
    }, 200), // 200ms delay
    [], // dependencies
  );

  // Cleanup debounce on unmount
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
    onBackButtonSerachPressed();

    set_search(place.title);
    // console.log(place);
    // console.log(place.location);

    const new_lat = place.location.x;

    const new_long = place.location.y;

    const PlaceRegion = {
      new_lat,
      new_long,
      latitudeDelta: 0.0922, // zoom level
      longitudeDelta: 0.0421, // zoom level
    };

    mapRef.current.animateCamera(
      {
        center: {
          latitude: Number(place.location.y),
          longitude: Number(place.location.x),
        },
        pitch: 30, // Tilt for 3D effect
        heading: 30, // Rotate the map
        // zoom: 18, // Zoom in for a closer view
        zoom: zoomLevel < 16 && zoomLevel + 2, // Zoom in for a closer view
      },
      {duration: 1000},
    );

    // if (mapRef.current) {

    //   mapRef.current.animateToRegion(PlaceRegion, 1000); // 1000ms animation
    // }
  };

  const onClickSingleCategory = cat => {
    set_loading(true);
    set_filter_level('base');

    handleCategoryPress(cat);
    set_filter_selected_category_name(cat.name);

    // setIsFilterModalVisible(false);

    set_selected_cat(cat);
    set_choosedcat(cat.id);
    set_filter_level('base');
    // alert(cat.name);
  };

  const onClickOpenCategorySelection = () => {
    set_filter_level('category');
  };

  const onPressingSingleTickFieldCheckbox = fl => {
    moveMapSlightly(userLat, userLong);

    // alert('fl is expected to be fill right now ' + fl.value);
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

  
    const onDeletingSinglePropertyFilter = async (fl) => {
    // console.warn(fl);
    // const x = normal_fields.find(item => item === fl).low;
    // alert(x);
    // alert(normal_fields.length);

    const foundItem = normal_fields.find(item => item === fl);
if (foundItem) {
  foundItem.low = 0;
  foundItem.high = 0;
}

await set_properties((foundItem.low = 0));

await set_properties(
  (foundItem.high = 0),
);
    
  
    
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

  // const renderOnOff = (fl) => {
  //   const x = tick_properties.find(function (item) {
  //     return item.name == fl.value;
  //   });

  //   if (x) {
  //     return (
  //       <TouchableOpacity
  //         style={{ width: "100%" }}
  //         onPress={() => onDeletingSingleTickFieldCheckbox(fl)}
  //       >
  //         <View style={{ padding: 5, flexDirection: 'row', alignItems: 'center' }}>
  //           <Text style={{
  //             textAlign: 'right',
  //             marginRight: 10,
  //             color: "#555",
  //             fontSize: 14,
  //             marginLeft: 2,
  //             width: "100%",
  //           }}>
  //             دارای <strong>{fl.value}</strong> باشد
  //             <CheckBoxIcon />
  //           </Text>
  //         </View>
  //         <Divider style={{ borderBottomWidth: 1, backgroundColor: "#555", margin: 1 }} />
  //       </TouchableOpacity>
  //     );
  //   } else {
  //     return (
  //       <TouchableOpacity
  //         style={{ width: "100%" }}
  //         onPress={() => onPressingSingleTickFieldCheckbox(fl)}
  //       >
  //         <View style={{ padding: 5, flexDirection: 'row', alignItems: 'center' }}>
  //           <Text style={{
  //             textAlign: 'right',
  //             marginRight: 10,
  //             color: "#555",
  //             fontSize: 14,
  //             marginLeft: 2,
  //             width: "100%",
  //           }}>
  //             دارای <strong>{fl.value}</strong> باشد

  //             <Icon name="checkbox" size={20} color="#555" />
  //           </Text>
  //         </View>
  //         <View style={{
  //     height: 1,
  //     backgroundColor: "#555",  // You can change the color as needed
  //     marginVertical: 10
  //   }} />
  //       </TouchableOpacity>
  //     );
  //   }
  // }

  const handleRangeChange = range => {
    console.warn('Selected range:', range);
  };

  const calculatemilion = amount => {
    return amount / 1000000;
  };

  const [slider_filters, setSliderFilters] = useState({});
  const handleSliderChange = (name, low, high) => {
    alert('parent of slider called');
    return;

    console.warn(name);

    setSliderFilters(prev => ({...prev, [name]: values}));
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
                React.createElement(RangeSlider, {
                  fl: fl,
                  onChange: async function (fieldId, values) {
                    // Handle the change in parent component
                    var rounded_min_value = values.low;

                    var rounded_high_value = values.high;

                    var filtered = normal_fields.filter(x => {
                      return x.id === fieldId;
                    });

                    console.log('--------------- the properties now is --------------' + fieldId);

                    console.log(properties);
                    

                    // console.log(filtered);

                    await set_properties((filtered[0].low = rounded_min_value));

                    await set_properties(
                      (filtered[0].high = rounded_high_value),
                    );
                    moveMapSlightly(userLat, userLong);
                  },
                }),
              );
            })}

          {/* {normal_fields
  .filter(fl => fl.special == 1)
  .map((fl) => (
    <View 
      key={`${fl.id}_${fl.field_type}`} 
      style={{
        width: '100%',
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <RangeSliderExample 
        fl={fl} 
        onChange={(fieldId, values) => {
          // Handle the change in parent component
          console.log(fieldId, values);
        }} 
      />
    </View>
))} */}

          {/* {normal_fields.map(
          (fl, index) =>
            fl.special == 1 && (
              <View key={index}> 

<View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      
    }}>
      <SpeechBubble>
      {fl.value}
      </SpeechBubble>
    </View>

    
               

                {/* <RangeSlider
                  min={calculatemilion(fl.min_range)}
                  max={calculatemilion(fl.max_range)}
                  step={10}
                  initialRange={[
                    fl.low > 0
                                ? calculatemilion(fl.low)
                                : calculatemilion(fl.min_range),
                              fl.high > 0
                                ? calculatemilion(fl.high)
                                : calculatemilion(fl.max_range),
                  ]}
                  prefix={fl.unit == 'تومان' ? 'ملیون' :''}
                  onValueChange={handleRangeChange}
                  sliderWidth={350}
                /> */}
        </View>

        {/* {normal_fields.map(
          (fl, index) =>
            fl.special == 1 && (
              <View key={index} style={styles.container}>
                <Text>{fl.name} / {index}</Text> */}
        {/* <List.Accordion
                title={
                  <View style={styles.accordionHeader}>
                    {(fl.low > 0 || fl.high > 0) && (
                      <View style={styles.filterInfo}>
                        <Button 
                          mode="outlined" 
                          icon="delete" 
                          onPress={() => deleteFlFilter(fl)}
                          style={styles.deleteButton}
                          labelStyle={styles.buttonLabel}
                        >
                          حذف
                        </Button>
                        <Text style={styles.filterText}>
                          {fl.low > 0 && numFormatter(fl.low)}{' '}
                          {fl.high > 0 && fl.high != fl.max_range && 'تا'}{' '}
                          {fl.low > 0 &&
                            (fl.high == fl.max_range || fl.high == 0) &&
                            'به بالا'}{' '}
                          {fl.high > 0 &&
                            fl.high != fl.max_range &&
                            numFormatter(fl.high)}
                        </Text>
                      </View>
                    )}
                    <Text style={styles.filterTitle}>{fl.value}</Text>
                  </View>
                }
              >
                <List.Item
                  title={
                    <View style={styles.sliderContainer}>
                      <Slider
                        minimumValue={parseInt(fl.min_range)}
                        maximumValue={parseInt(fl.max_range)}
                        value={[
                          fl.low > 0 ? parseInt(fl.low) : parseInt(fl.min_range),
                          fl.high > 0 ? parseInt(fl.high) : parseInt(fl.max_range),
                        ]}
                        onValueChange={(newValue) => 
                          handleChangeSliderValue(null, newValue, null, fl, index)
                        }
                        step={1}
                        minimumTrackTintColor="#6200ee"
                        maximumTrackTintColor="#000000"
                        thumbTintColor="#6200ee"
                        style={styles.slider}
                      />
                    </View>
                  }
                  titleStyle={styles.sliderTitle}
                />
              </List.Accordion>
              <View style={[styles.divider, {height: 1}]} /> */}
        {/* </View>
            ),
        )} */}
      </>
    );
  };

  // const renderFiltersBasedOnCategorySelected = () => {
  //   if (filter_level === "base") {
  //     return (
  //    <>

  //         {/* Tick Fields Filter Loop */}
  //         {tick_fields.map(
  //           (fl, index) =>
  //             fl.special === 1 && (
  //               // <View key={index}>{renderOnOff(fl)}</View>
  //               <Text key={index}>hi tick fileds</Text>
  //             )
  //         )}

  //         {/* Normal Fields Filter Loop */}
  //         {normal_fields.map((fl, index) =>
  //           fl.special === 1 ? (
  //             <View key={index} style={styles.filterWrapper}>
  //               {/* Accordion */}
  //               <TouchableOpacity
  //                 onPress={() => toggleAccordion(index)} // Function to handle toggle
  //                 style={styles.accordionHeader}
  //               >
  //                 {/* Header Content */}
  //                 {(fl.low > 0 || fl.high > 0) && (
  //                   <Text style={styles.filterInfo}>
  //                     <TouchableOpacity
  //                       onPress={() => deleteFlFilter(fl)}
  //                       style={styles.deleteButton}
  //                     >
  //                       <Text style={styles.deleteButtonText}>حذف</Text>
  //                     </TouchableOpacity>{" "}
  //                     {fl.low > 0 && numFormatter(fl.low)}{" "}
  //                     {fl.high > 0 && fl.high !== fl.max_range && "تا"}{" "}
  //                     {fl.low > 0 &&
  //                       (fl.high === fl.max_range || fl.high === 0) &&
  //                       "به بالا"}{" "}
  //                     {fl.high > 0 &&
  //                       fl.high !== fl.max_range &&
  //                       numFormatter(fl.high)}
  //                   </Text>
  //                 )}

  //                 <Text style={styles.filterTitle}>{fl.value}</Text>
  //               </TouchableOpacity>

  //               {/* Collapsible Content */}
  //               <Collapsible collapsed={!isAccordionOpen(index)}>
  //                 <View style={styles.sliderWrapper}>
  //                   <Slider
  //                     minimumValue={parseInt(fl.min_range)}
  //                     maximumValue={parseInt(fl.max_range)}
  //                     value={[
  //                       fl.low > 0 ? parseInt(fl.low) : parseInt(fl.min_range),
  //                       fl.high > 0 ? parseInt(fl.high) : parseInt(fl.max_range),
  //                     ]}
  //                     onValueChange={(value) =>
  //                       handleChangeSliderValue(null, value, null, fl, index)
  //                     }
  //                     step={1} // Adjust step size as needed
  //                   />
  //                 </View>
  //               </Collapsible>

  //               {/* Divider */}
  //               <View style={styles.divider} />
  //             </View>
  //           ) : null
  //         )}
  //       </>
  //     );
  //   }
  // };

  const onClickFinishFitering = () => {
    setIsFilterModalVisible(false);
  };

  const renderFilterActionButtons = () => {
    if (filter_level === 'base') {
      return (
        <View style={styles.actionBar}>
          {loading ? (
            <TouchableOpacity onPress={onClickFinishFitering}>
              <Text style={styles.actionText}>
                {'دریافت'} {<ActivityIndicator size={15} color="white" />}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={onClickFinishFitering}>
              <Text style={styles.actionText}>
                {'تایید و نمایش'} ({' ' + visibleMarkers.length + ' فایل '} )
              </Text>
            </TouchableOpacity>
          )}
        </View>
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

  const renderCategorySelectionBar = () => {
    if (!filter_selected_category_name) {
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

          {/* <View style={styles.filtersWrapper}>
            <View style={styles.singleFilter}>
              <Text>filters here</Text>
            </View>
            <View style={styles.singleFilter}>
              <Text>filters here</Text>
            </View>
          </View> */}
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
              {'دسته بندی'} {filter_selected_category_name}
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
                {filter_selected_category_name === cat.name ? (
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

  // Debounced handler
  // const handleRegionChangeComplete = debounce(region => {
  //   // onRegionChangeCompleded(region);

  //   set_loading(true);

  //   console.log('debounce now with' + debounceDelay);
  //   const {latitude, longitude, latitudeDelta, longitudeDelta} = region;

  //   // Calculate the map's visible bounds
  //   const northEastLat = latitude + latitudeDelta / 2;
  //   const southWestLat = latitude - latitudeDelta / 2;
  //   const northEastLng = longitude + longitudeDelta / 2;
  //   const southWestLng = longitude - longitudeDelta / 2;

  //   // Check which markers are within the bounds
  //   const filteredMarkers = filtered_workers.filter(
  //     marker =>
  //       marker.lat >= southWestLat &&
  //       marker.lat <= northEastLat &&
  //       marker.long >= southWestLng &&
  //       marker.long <= northEastLng,
  //   );

  //   setVisibleMarkers(filteredMarkers);

  //   // Update the count of visible markers
  //   setVisibleMarkerCount(visibleMarkers.length);
  //   // console.log('the visible count now is :');
  //   // console.log(visibleMarkers.length);

  //   var zoom = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2);

  //   set_userLat(latitude);
  //   set_userLong(longitude);

  //   // set_magnetIcon('magnet-outline');
  //   set_spinnerOpacity(false);
  //   set_zoomLevel(zoom);
  //   // You could also add marker filtering logic here
  //   set_loading(false);
  // }, debounceDelay);
  // Outside your component (or inside with useMemo)
   // Use ref to track the latest filtered workers
   const filteredWorkersRef = useRef(filtered_workers);
  
   // Update ref when filtered_workers changes
   useEffect(() => {
     filteredWorkersRef.current = filtered_workers;
   }, [filtered_workers]);
const DEBOUNCE_DELAY = 500; // Adjust as needed (300-1000ms)

  // Debounced version with proper cleanup
  const debouncedRegionChange = useCallback(debounce(async (region) => {
    set_loading(true);
    
    try {
      const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
      
      // Calculate bounds more efficiently
      const halfLatDelta = latitudeDelta / 2;
      const halfLngDelta = longitudeDelta / 2;
      
      const visibleMarkers = filteredWorkersRef.current.filter(marker => (
        marker.lat >= latitude - halfLatDelta &&
        marker.lat <= latitude + halfLatDelta &&
        marker.long >= longitude - halfLngDelta &&
        marker.long <= longitude + halfLngDelta
      ));

      // Single state update instead of multiple promises
      setVisibleMarkers(visibleMarkers);
      setVisibleMarkerCount(visibleMarkers.length);
      
      // Calculate zoom level more efficiently
      set_zoomLevel(Math.round(Math.log2(360 / longitudeDelta)));
      
      // Update user position
      set_userLat(latitude);
      set_userLong(longitude);
    } catch (error) {
      console.error('Region change error:', error);
    } finally {
      set_loading(false);
      set_spinnerOpacity(false);
    }
  }, DEBOUNCE_DELAY), []);

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedRegionChange.cancel();
    };
  }, []);

  const handleRegionChangeComplete = (region) => {
    set_spinnerOpacity(true); // Show spinner immediately
    debouncedRegionChange(region);
  };

  // const handleRegionChangeComplete = async region => {
  //   set_loading(true); 

  //   console.log('debounce now with' + debounceDelay);
  //   const {latitude, longitude, latitudeDelta, longitudeDelta} = region;

  //   try {
  //     // Calculate the map's visible bounds
  //     const northEastLat = latitude + latitudeDelta / 2;
  //     const southWestLat = latitude - latitudeDelta / 2;
  //     const northEastLng = longitude + longitudeDelta / 2;
  //     const southWestLng = longitude - longitudeDelta / 2;

  //     // Check which markers are within the bounds
  //     const filteredMarkers = filtered_workers.filter(
  //       marker =>
  //         marker.lat >= southWestLat &&
  //         marker.lat <= northEastLat &&
  //         marker.long >= southWestLng &&
  //         marker.long <= northEastLng,
  //     );

  //     // Batch all state updates together
  //     await Promise.all([
  //       new Promise(resolve => {
  //         setVisibleMarkers(filteredMarkers);

  //         resolve();
  //       }),
  //       new Promise(resolve => {
  //         setVisibleMarkerCount(filteredMarkers.length); // Use filteredMarkers.length directly
  //         resolve();
  //       }),
  //       new Promise(resolve => {
  //         const zoom = Math.round(
  //           Math.log(360 / region.longitudeDelta) / Math.LN2,
  //         );
  //         set_zoomLevel(zoom);
  //         resolve();
  //       }),
  //     ]);

  //     set_userLat(latitude);
  //     set_userLong(longitude);
  //     set_spinnerOpacity(false);
  //   } catch (error) {
  //     console.error('Error during region change:', error);
  //     alert('map error');
  //   } finally {
  //     set_loading(false); // This will run after all state updates
  //   }
  // };

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
                {place.title} ({place.region})
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
      {/* <MapView 
        clusterColor="#b92a3160"
        // radius={clusterRadius} // Increase the clustering radius
        ref={mapRef}
        // provider={PROVIDER_GOOGLE} 
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
        onRegionChange={region => {
          onRegionChanged({region});
        }}

        onRegionChangeComplete = {handleRegionChangeComplete}

        // onRegionChangeComplete={region => {
         
        // }}
        animateToRegion={true}
        onTouchStart={handleMapTouch} // Detect map touch
      >
        {renderMarker()}
      </MapView> */}

      

      <ClusterMap
        // clusteringEnabled={true}
        minPoints={5}
        // maxZoom={10}
        clusterColor="#b92a3160"
        // radius={clusterRadius} // Increase the clustering radius
        ref={mapRef}
        // provider={PROVIDER_GOOGLE}
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
        onRegionChange={region => {
          onRegionChanged({region});
        }}
        onRegionChangeComplete={handleRegionChangeComplete}
        // onRegionChangeComplete={region => {

        // }}
        animateToRegion={true}
        onTouchStart={handleMapTouch} // Detect map touch
        onClusterPress={handleClusterPress}>
        {renderMarker()}
        
      </ClusterMap>

      {/* <
          style={styles.map}
          initialRegion={{
            latitude: Number(region.latitude),
            longitude: Number(region.longitude),
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          onClusterPress={handleClusterPress}
        >
          {markers.map(marker => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={marker.title}
            />
          ))}
        </> */}

      <ImageSliderModal
        visible={isHintModalVisible}
        onClose={() => set_isHintModalVisible(false)}
      />
      {/* <ImageSliderModal  visible={isHintModalVisible} onClose={() => set_ish(false)} /> */}

      {/* Transparent Button on Top Center */}

      {loading ? (
        <TouchableOpacity style={styles.visisbleMarkerButton}>
          <Text style={styles.visisbleMarkerText}>
            قابل مشاهده : <ActivityIndicator size={20} color="white" />
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.visisbleMarkerButton}>
          <Text style={styles.visisbleMarkerText}>
            قابل مشاهده : {visibleMarkers.length}
          </Text>
        </TouchableOpacity>
      )}

      {/* Category selection box
      // <TouchableOpacity style={styles.categoryBox} onPress={toggleTopbar}>
      //   {selected_cat ? (
      //     <View style={styles.buttonWrapper}>
      //       <Text style={styles.categoryText}>{selected_cat.name}</Text>
      //       <Icon
      //         name="chevron-down"
      //         size={20}
      //         color="gray"
      //         style={styles.arrow}
      //       />
      //     </View>
      //   ) : (
      //     <View style={styles.buttonWrapper}>
      //       <Text style={styles.categoryText}>فروش آپارتمان</Text>
      //       <Icon
      //         name="chevron-down"
      //         size={20}
      //         color="gray"
      //         style={styles.arrow}
      //       />
      //     </View>
      //   )}
      // </TouchableOpacity> */}

      {/* Category selection box */}

      {/* <TouchableOpacity style={styles.categoryBox} onPress={toggleFilterhModal}>
        
          <View style={styles.buttonWrapper}>
            <Text style={styles.categoryText}>
              {selected_cat ?
              selected_cat.name
              :
                  'همه دسته ها'
            }
              
              </Text>

                {selected_cat ?

                 <Icon
              name="close"
              size={20}
              color="gray"
              style={styles.arrow}
            />
              :
                 <Icon
              name="chevron-down"
              size={20}
              color="gray"
              style={styles.arrow}
            />
            }

           
          </View>
        
      </TouchableOpacity> */}

      {/* Topbar */}
      {/* <Animated.View
        style={[styles.topbar, {transform: [{translateY: topbarAnim}]}]}>
        <View style={styles.topbarContent}>
          <FlatList
            data={cats}
            renderItem={renderCategoryButton}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsHorizontalScrollIndicator={true}
            indicatorStyle="black"
            persistentScrollbar={true} // Keeps the scrollbar always visible
          />
        </View>
      </Animated.View> */}

      {renderFooter()}

      {/* Bottom Drawer */}
      {/* <BottomSheet
        ref={bottomSheetRef}
        index={-1} // Initially hidden
        snapPoints={snapPoints}
        enableContentPanningGesture
        enableHandlePanningGesture
      >
        <View style={styles.drawerContent}>
          <View style={styles.grabber} />
          <Text>Drawer Content</Text>
        </View>
      </BottomSheet> */}

      {/* Search Icon */}
      {/* <TouchableOpacity style={styles.searchButton} onPress={toggleSearchModal}>
        <Icon name="ios-search" size={25} color="#fff" />
      </TouchableOpacity> */}

      {renderHeader()}
      {renderMapLoader()}

      
      {renderHeaderFilters()}

      {/* <TouchableOpacity
        style={styles.filterButton}
        onPress={toggleFilterhModal}>
        <Icon name="ios-options" size={25} color="#444" />
      </TouchableOpacity> */}

      {/* Toggle Button */}
      <TouchableOpacity style={styles.toggleButton} onPress={toggleMapType}>
        <Icon
          style={styles.toggleIcon}
          name={getMapIcon()}
          size={30}
          color="black"
        />
      </TouchableOpacity>

      {/* Search Modal */}
      {/* Full-Screen Search Modal */}
      <Modal
        visible={isSearchModalVisible}
        transparent={false} // Fullscreen by setting transparent to false
        animationType="slide"
        onRequestClose={toggleSearchModal}>
        <View style={styles.fullScreenModalContainer}>
          {renderHeader()}
          {renderSearchResults()}
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

            <ScrollView style={styles.filtersBasedOnCategorySelected}>
              {renderFiltersBasedOnCategorySelected()}
            </ScrollView>

            {renderFilterActionButtons()}

            {/* <TouchableOpacity
              style={styles.searchModalButton}
              onPress={handleSearch}>
              <Text style={styles.searchModalButtonText}></Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={toggleFilterhModal}>
              <Icon name="ios-close" size={30} color="#000" />
            </TouchableOpacity> 
          </View>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  modal: {
    justifyContent: 'space-between',
    // alignItems: 'center',
    backgroundColor: '#f6f6f6',
    // height: '20%' ,
    // width: '80%',
    borderRadius: 0,
    borderWidth: 1,
    marginTop: 50,
    marginBottom: Dimensions.get('window').height / 10,
    // marginLeft: 40,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  marker: {
    backgroundColor: 'red',
    // marginLeft: 46,
    // marginTop: 33,
    // fontWeight: 'bold',
  },

  bubble: {
    backgroundColor: 'rgba(250,2500,250,0)',

    paddingHorizontal: 28,
    paddingVertical: 2,
    borderRadius: 30,
  },

  lightbubble: {
    backgroundColor: 'rgba(20,20,20,0)',
    // paddingHorizontal: 28,
    paddingVertical: 2,
    borderRadius: 40,
  },

  footerButton: {
    backgroundColor: '#f9f9f9',
    borderColor: 'orange',
    borderWidth: 1,

    marginTop: 0,
    marginRight: 0,
    marginLeft: 0,
    marginBottom: 15,
    // paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 0,
  },

  footerBox: {
    width: '100%',
    backgroundColor: 'rgba(20,20,20,0)',
    // marginTop: 5,
    marginRight: 5,
    marginLeft: 5,
    // marginBottom:5,
    // paddingHorizontal: 5,
    // paddingVertical: 5,
  },
  button: {
    marginTop: 2,
    paddingHorizontal: 2,
    alignItems: 'center',
    marginHorizontal: 1,
  },
  buttontext: {
    color: 'white',
  },

  searchbuttontext: {
    color: 'gray',
    padding: 5,
    paddingLeft: 20,
    paddingRight: 20,
  },
  buttonContainer: {
    flexDirection: 'column',
    marginVertical: 2,
    backgroundColor: 'transparent',
  },

  LeftbuttonContainer: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
    position: 'absolute',

    top: 10,
    right: 10,
  },

  RighbuttonContainer: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 150,
    right: 10,
  },
  satellitebuttonContainer: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 230,
    left: 10,
  },

  CenterbuttonContainer: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: '30%',
    right: '45%',
  },

  spinnerView: {
    left: '130%',
  },
  cardBox: {
    opacity: 0.7,
    justifyContent: 'space-around',
  },

  input: {
    margin: 15,
    height: 40,
    borderColor: '#7a42f4',
    borderWidth: 1,
    textAlign: 'right',
  },

  toggleButton: {
    position: 'absolute',
    top: 70,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',

    padding: 4,
    // borderRadius: 30,
    elevation: 5,
  },

  headerSearchAndFilter: {
    position: 'absolute',
    width: '100%',
    height: 70,
    backgroundColor: 'gray',
  },

  filterButton: {
    position: 'absolute',
    top: 25,
    left: 70,
    // backgroundColor: 'rgba(0,0,0,0.6)',
    backgroundColor: 'white',
    color: 'gray',
    padding: 10,
    borderRadius: 2,
  },

  fullScreenModalContainer: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.7)', // Optional dimming background
    backgroundColor: 'white', // Optional dimming background
  },

  fullScreenFilterModalContainer: {
    flex: 1,
  },

  filterModalContent: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',

    // justifyContent: 'center',
    // alignItems: 'center',
  },

  modalContent: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchInput: {
    width: '80%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    direction: 'rtl',
    textAlign: 'right',
  },
  searchModalButton: {
    backgroundColor: '#ff5722',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  searchModalButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  closeModalButton: {
    position: 'absolute',
    top: 20,
    left: 15,
    padding: 3,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 25,
  },
  closeModalButtonText: {
    color: '#fff',
    fontSize: 16,
  },

  priceLabelActive: {
    backgroundColor: 'green',
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 5,
    fontFamily: 'iransans',
    marginBottom: 5,
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  priceLabel: {
    backgroundColor: '#b92a31',
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 5,
    fontFamily: 'iransans',
    marginBottom: 5,
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },

  text: {
    fontSize: 9,
    color: 'white',
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 9,
  },
  pin: {
    textAlign: 'center',
  },
  drawerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  grabber: {
    width: 50,
    height: 5,
    backgroundColor: 'gray',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 10,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    width: width,
    backgroundColor: 'transparent',
    padding: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: -2},
    // shadowOpacity: 0.2,
    // shadowRadius: 5,
    // elevation: 5,
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerDescription: {
    fontSize: 14,
    marginTop: 5,
  },

  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },

  categoryBox: {
    // position: 'absolute',
    // top: 70,
    // right: 10,
    // backgroundColor: 'rgba(0,0,0,0.6)',
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#bc323a',
  },
  categoryText: {
    textAlign: 'center',
    fontFamily: 'iransans',
    color: '#555',
    fontSize: 16,
    // fontWeight: 'bold',
    paddingHorizontal: 1,
  },

  catText: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'iransans',
  },
  topbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 400,
    backgroundColor: 'white',
    elevation: 5,
    zIndex: 2,
  },
  topbarContent: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },

  categoryButton: {
    backgroundColor: '#bc323a', // Button background color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  categoryButtonText: {
    color: '#fff', // Text color
    fontSize: 16,
    fontWeight: 'bold',
  },
  noCategoriesText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },

  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row',
  },

  arrow: {
    marginLeft: 10,
    marginRight: 5, // Optional: adjust spacing of the arrow icon
  },

  spinnerContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -25}, {translateY: -25}], // Centers the spinner
  },

  spinnerImageView: {
    flex: 1, // Fullscreen container
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: '#fff', // Optional: Background color (use #FFA500 for Ajur orange)
  },
  spinnerImage: {
    width: 150, // Adjust the width of your GIF
    height: 150, // Adjust the height of your GIF
  },

  searchResultWrapper: {
    minHeight: '60%',
    maxHeight: '60%',
  },

  singleSearchResult: {
    padding: 10,
    marginVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
    textAlign: 'right',
  },

  filterWrapper: {
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  filterInfo: {
    fontSize: 12,
    textAlign: 'right',
    color: '#555',
    marginVertical: 5,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterTitle: {
    fontSize: 14,
    color: '#333',
    marginRight: 10,
    textAlign: 'right',
  },
  sliderWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#555',
    marginVertical: 10,
  },

  filterBarWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginTop: 80,
    marginHorizontal: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,

    height: 60,
  },
  filterBarButton: {
    fontSize: 16,
    color: '#b92a31', // Blue color for buttons
    fontWeight: 'bold',
    textAlign: 'center',
  },
  filterBarText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'right', // Align RTL text properly
  },
  divider: {
    backgroundColor: '#555',
    marginVertical: 10,
    height: 1, // Default height for the divider
  },

  filtersWrapper: {
    display: 'flex',

    textAlign: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 80,
    margin: 20,

    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },

  singleFilter: {
    margin: 10,
    padding: 10,
    textAlign: 'center',
  },

  actionBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#b92a31', // Primary color
    paddingVertical: 20,
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'iransans',
    fontSize: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },

  singleTypeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  singleIcon: {
    marginRight: 10,
  },
  singleInfo: {
    flex: 1,
  },

  regionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: 'white',
  },
  resetButtonText: {
    color: 'black',
    fontSize: 13,
  },
  allAreasButton: {
    backgroundColor: 'transparent',
  },
  allAreasButtonText: {
    color: 'black',
    fontSize: 13,
  },
  confirmButton: {
    backgroundColor: '#f57c00', // Accent color
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  visisbleMarkerButton: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 2,
  },

 
  visisbleMarkerText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  hintModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  hintModalContent: {
    width: width * 0.85,
    height: 400,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  hintTitle: {fontSize: 18, fontWeight: 'bold', marginVertical: 10},
  hintSwiper: {width: width * 0.8, height: 160},
  hintImage: {width: width * 0.8, height: 150, borderRadius: 10},
  hintdot: {
    backgroundColor: '#bbb',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  hintActiveDot: {
    backgroundColor: '#ff6600',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  hintButton: {
    marginTop: 20,
    backgroundColor: '#ff6600',
    padding: 10,
    borderRadius: 5,
  },
  hintNextButton: {
    marginTop: 20,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  hintButtonText: {color: '#fff', fontWeight: 'bold'},

  hintDesc: {
    textAlign: 'center',
    paddingVertical: 10,
    fontFamily: 'iransans',
    fontSize: 16,
  },

  tickField_container: {
    width: '100%',
    paddingHorizontal: 15,
  },
  tickField_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 10,
  },
  tickField_text: {
    textAlign: 'right',
    color: '#555',
    fontSize: 14,
    flexShrink: 1,
  },
  tickField_strong: {
    fontWeight: 'bold',
  },
  tickField_divider: {
    height: 1,
    backgroundColor: '#555',
    marginHorizontal: 10,
    marginVertical: 4,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },

  mapLoader: {
    position: 'absolute',
  left: '50%',
  top: '50%',
  transform: [{ translateX: -20 }, { translateY: -20 }],
  backgroundColor: '#f9f9f950',
  borderRadius: 20,
  width: 40,
  height: 40,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1,
  },

  header2: {
    alignItems: 'flex-end',

    paddingHorizontal: 10,
    paddingVertical: 10,

    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  searchContainer: {
    flex: 0.9,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchContainerFocused: {
    backgroundColor: '#fff',
    // backgroundColor: 'green',

    borderWidth: 1,
    borderColor: '#007AFF', // iOS-like blue focus
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0, // Android fix
    includeFontPadding: false, // Android text alignment
    textAlign: 'right',
  },
  filterButton: {
    flex: 0.1,
    alignItems: 'flex-end', // Align icon to right
    justifyContent: 'center',
    paddingLeft: 10, // Space from search
  },

  carouselContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 20,
  },

  LoadingMoreCard: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8', // Light background (you can match your theme)
    borderRadius: 12,
    marginHorizontal: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  rtlFilterScroll: {
    flexDirection: 'row-reverse', // RTL layout
  },
  filtersBasedOnCategorySelected: {
    marginBottom: 60,
    marginHorizontal: 2,
  },
});

export default MarkerTypes;
