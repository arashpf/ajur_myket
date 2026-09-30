import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  ScrollView,
  TextInput,
  ActivityIndicator,
  FlatList,
  Alert
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Spinner from 'react-native-spinkit';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/Ionicons';
import { useToast, Box, Button, Input, Select, CheckIcon } from 'native-base';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const NewWorker3 = ({route, navigation}) => {
    const toast = useToast();
    const _mapView = useRef(null);
    const scrollViewRef = useRef(null);
    
    // Location states
    const [userInitialLat, set_userInitialLat] = useState(35.6892);
    const [userInitialLong, set_userInitialLong] = useState(51.3890);
    const [finalLat, set_finalLat] = useState(null);
    const [finalLong, set_finalLong] = useState(null);
    const [zoomLevel, set_zoomLevel] = useState(15);
    
    // UI states
    const [circleTop, set_circleTop] = useState('40%');
    const [circleRadius, set_circleRadius] = useState(0.05);
    const [loading2, set_loading2] = useState(false);
    const [isModalVisible, set_isModalVisible] = useState(false);
    
    // Address form states
    const [addressFormatted, set_addressFormatted] = useState('');
    const [addressRegion, set_addressRegion] = useState('');
    const [addressNeighbourhood, set_addressNeighbourhood] = useState('');
    const [addressCity, set_addressCity] = useState('');
    const [addressMunicipality_zone, set_addressMunicipality_zone] = useState('');
    const [addressState, set_addressState] = useState('');
    
    // Search and selection states
    const [returnedPlaces, set_returnedPlaces] = useState([]);
    const [availableCities, set_availableCities] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    const [availableNeighborhoods, set_availableNeighborhoods] = useState([]);
    const [filteredNeighborhoods, set_filteredNeighborhoods] = useState([]);
    const [placeSearchQuery, set_placeSearchQuery] = useState('');
    const [citySearchQuery, setCitySearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    
    // Step management
    const [currentStep, setCurrentStep] = useState(1); // 1: Map, 2: Form
    const [isSelected, setIsSelected] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedPlaceName, setSelectedPlaceName] = useState('');
    
    // Form validation
    const [btn_status, set_btn_status] = useState(false);
    const [validationError, setValidationError] = useState('');

    // New states for geocoding feedback
    const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
    const [geocodeError, setGeocodeError] = useState(false);
    const [cityAutoSelected, setCityAutoSelected] = useState(false);

    const { workerId, exLat, exLng } = route.params; 

    useEffect(() => {
        async function requestPermissions() {
            if (Platform.OS === 'ios') {
                await Geolocation.requestAuthorization();
                Geolocation.setRNConfiguration({
                    skipPermissionRequests: false,
                    authorizationLevel: 'whenInUse',
                });
            }

            if (Platform.OS === 'android') {
                await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                );
            }
        }

        requestPermissions().then(() => {
            Geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    set_userInitialLat(latitude);
                    set_userInitialLong(longitude);
                    set_finalLat(latitude);
                    set_finalLong(longitude);
                },
                (error) => console.error('Geolocation error:', error),
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        });

        loadAvailableLocations();
    }, []);

    const loadAvailableLocations = async () => {
        try {
            const response = await axios.get('https://api.ajur.app/api/all-available-locations');
            const cities = response.data.cities || [];
            set_availableCities(cities);
            setFilteredCities(cities);
            
            const neighborhoods = response.data.neighborhoods || [];
            set_availableNeighborhoods(neighborhoods);
        } catch (error) {
            console.error('Error loading locations:', error);
        }
    };

    useEffect(() => {
        if (_mapView.current && userInitialLat && userInitialLong) {
            const zoomTimeout = setTimeout(() => {
                _mapView.current.animateToRegion({
                    latitude: exLat ? Number(exLat) : Number(userInitialLat),
                    longitude: exLng ? Number(exLng) : Number(userInitialLong),
                    latitudeDelta: LATITUDE_DELTA / 2,
                    longitudeDelta: LONGITUDE_DELTA / 2,
                }, 1000);
            }, 1000);
            
            return () => clearTimeout(zoomTimeout);
        }
    }, [userInitialLat, userInitialLong]);

    useEffect(() => {
        if (citySearchQuery.trim() === '') {
            setFilteredCities(availableCities);
        } else {
            const filtered = availableCities.filter(city => 
                city.title && city.title.toLowerCase().includes(citySearchQuery.toLowerCase())
            );
            setFilteredCities(filtered);
        }
    }, [citySearchQuery, availableCities]);

    useEffect(() => {
        if (addressCity && availableNeighborhoods.length > 0) {
            const filtered = availableNeighborhoods.filter(nb => 
                nb.city_name === addressCity
            );
            
            if (filtered.length === 0) {
                set_filteredNeighborhoods([{ id: 'all-areas', name: 'همه مناطق', city_name: addressCity }]);
            } else {
                set_filteredNeighborhoods(filtered);
            }
            
            set_addressNeighbourhood('');
        } else {
            set_filteredNeighborhoods([]);
            set_addressNeighbourhood('');
        }
    }, [addressCity, availableNeighborhoods]);

    const handleMapPress = async (event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;

        set_finalLat(latitude);
        set_finalLong(longitude);
        setIsSelected(true);
        setGeocodeError(false);
        setIsReverseGeocoding(true);
        setCityAutoSelected(false);
        setShowConfirmation(true);

        await reverseGeocode(latitude, longitude);
        setIsReverseGeocoding(false);
    };

    const reverseGeocode = async (lat, lng) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&accept-language=fa`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'AjurApp/1.0 (realestate@ajur.app)',
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            
            if (data && data.display_name) {
                const displayName = data.display_name;
                setSelectedPlaceName(displayName);
                set_addressFormatted(displayName);

                if (data.address) {
                    const addr = data.address;
                    const city = addr.city || addr.town || addr.village || addr.municipality || "";
                    const neighborhood = addr.neighbourhood || addr.suburb || addr.hamlet || "";
                    const state = addr.state || addr.province || "";

                    if (city) {
                        const foundCity = availableCities.find(availableCity => 
                            availableCity.title && availableCity.title.includes(city)
                        );

                        if (foundCity) {
                            set_addressCity(foundCity.title);
                            setCityAutoSelected(true);
                            setCitySearchQuery('');
                        } else {
                            set_addressCity("");
                        }
                    } else {
                        set_addressCity("");
                    }

                    set_addressNeighbourhood(neighborhood);
                    set_addressState(state);
                    set_addressMunicipality_zone(addr.county || "");
                    set_addressRegion(displayName);
                }

                setGeocodeError(false);
            }
        } catch (error) {
            console.error('Reverse geocoding error:', error.message);
            setGeocodeError(true);
            const fallbackName = `موقعیت: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            setSelectedPlaceName(fallbackName);
            set_addressFormatted(fallbackName);
            showToast('خطا در دریافت اطلاعات موقعیت. دوباره امتحان کنید', 'error');
        }
    };

    const searchPlaces = async (query) => {
        if (!query || query.length < 3) {
            set_returnedPlaces([]);
            return;
        }

        setIsSearching(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&accept-language=fa&countrycodes=ir`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'AjurApp/1.0 (realestate@ajur.app)',
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            
            const results = data.map(item => ({
                display_name: item.display_name,
                lat: parseFloat(item.lat),
                lon: parseFloat(item.lon),
                type: item.type,
                class: item.class,
                importance: item.importance
            }));
            
            results.sort((a, b) => b.importance - a.importance);
            set_returnedPlaces(results);
        } catch (error) {
            console.error('OSM search error:', error.message);
            showToast('خطا در جستجوی مکان', 'error');
            set_returnedPlaces([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleConfirmation = () => {
        setShowConfirmation(false);
        setCurrentStep(2);
    };

    const validateForm = () => {
        if (!isSelected) return 'لطفا ابتدا روی نقشه موقعیت را مشخص کنید';
        if (!addressCity) return 'شهر را انتخاب کنید';
        if (!addressNeighbourhood) return 'محله را انتخاب کنید';
        if (!addressFormatted) return 'لطفا آدرس را پر کنید';
        return null;
    };

    const newWorkerFinal = async () => {
        const error = validateForm();
        if (error) {
            setValidationError(error);
            showToast(error, 'warning');
            return;
        }

        set_btn_status(true);
        setValidationError('');
        
        try {
            const token = await AsyncStorage.getItem('id_token');
            const response = await axios({
                method: 'post',
                url: 'https://api.ajur.app/api/post-model-location',
                timeout: 1000 * 35,
                params: {
                    token: token,
                    lat: finalLat,
                    long: finalLong,
                    worker_id: workerId,
                    region: addressRegion,
                    neighbourhood: addressNeighbourhood,
                    city: addressCity,
                    municipality_zone: addressMunicipality_zone,
                    state: addressState,
                    formatted: addressFormatted
                },
            });

            if(response.data.status == "200"){
                showToast('آگهی شما با موفقیت ثبت شد', 'success');
                navigation.popToTop();
                navigation.navigate('RDashborad');
            } else {
                showToast('متاسفانه مشکلی رخ داده است', 'error');
            }
        } catch (e) {
            console.error('API Error:', e);
            showToast('خطا در ارتباط با سرور', 'error');
        } finally {
            set_btn_status(false);
        }
    };

    const showToast = (message, type = 'info') => {
        const bgColor = type === 'success' ? 'green.500' : type === 'error' ? 'red.500' : 'orange.500';
        toast.show({
            render: () => {
                return <Box bg={bgColor} px="15" py="3" rounded="md" mb={5}>
                    <Text style={{color:'white',fontSize:16}}>{message}</Text>
                </Box>;
            }
        });
    };

    const touchIn = () => {
        set_circleTop('38%');
        set_circleRadius(0.09);
    };

    const onPressingSinglePlace = (place) => {
        closeModal();
        _mapView.current.animateToRegion({
            latitude: Number(place.lat),
            longitude: Number(place.lon),
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
        }, 1000);
        
        set_finalLat(place.lat);
        set_finalLong(place.lon);
        setIsSelected(true);
        setSelectedPlaceName(place.display_name);
        set_addressFormatted(place.display_name);
        setShowConfirmation(true);
        setIsReverseGeocoding(true);
        setGeocodeError(false);
        reverseGeocode(place.lat, place.lon).then(() => setIsReverseGeocoding(false));
    };

    const closeModal = () => {
        set_isModalVisible(false);
        set_returnedPlaces([]);
        set_placeSearchQuery('');
    };

    const renderPlaces = () => {
        if (isSearching) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={styles.loadingText}>در حال جستجو...</Text>
                </View>
            );
        }

        if (returnedPlaces.length === 0 && placeSearchQuery.length >= 3) {
            return (
                <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>مکانی یافت نشد</Text>
                </View>
            );
        }

        return returnedPlaces.map(place => (
            <TouchableOpacity 
                key={place.lat + place.lon} 
                onPress={() => onPressingSinglePlace(place)}
                style={styles.placeItem}
            >
                <Text style={styles.placeTitle} numberOfLines={2}>
                    {place.display_name}
                </Text>
            </TouchableOpacity>
        ));
    };

    const renderCitySelection = () => (
        <View style={styles.formField}>
            <Text style={styles.label}>شهر *</Text>
            
            <View style={styles.enhancedSearchContainer}>
                <View style={styles.searchInputWrapper}>
                    <Icon name="search" size={22} color="#4CAF50" style={styles.enhancedSearchIcon} />
                    <TextInput
                        style={styles.enhancedSearchInput}
                        placeholder="جستجوی شهر..."
                        placeholderTextColor="#999"
                        value={citySearchQuery}
                        onChangeText={setCitySearchQuery}
                        textAlign="right"
                    />
                    {citySearchQuery.length > 0 && (
                        <TouchableOpacity 
                            onPress={() => setCitySearchQuery('')}
                            style={styles.clearSearchButton}
                        >
                            <Icon name="close-circle" size={20} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            
            {addressCity && (
                <View style={styles.selectedCityContainer}>
                    <View style={styles.selectedCityInfo}>
                        <Icon name="location" size={20} color="#4CAF50" style={styles.cityIcon} />
                        <Text style={styles.selectedCityName}>{addressCity}</Text>
                        <Text style={styles.selectedCityText}>شهر انتخاب شده : </Text>
                    </View>
                    <View style={styles.selectedCityBadge}>
                        <Icon name="checkmark-circle" size={24} color="#4CAF50" />
                    </View>
                </View>
            )}

            {!cityAutoSelected ? (
                <View style={styles.enhancedListContainer}>
                    <FlatList
                        data={filteredCities}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.enhancedListItem,
                                    addressCity === item.title && styles.selectedEnhancedItem
                                ]}
                                onPress={() => {
                                    set_addressCity(item.title);
                                    setCitySearchQuery('');
                                    setCityAutoSelected(false);
                                }}
                            >
                                <View style={styles.cityItemContent}>
                                    <Icon 
                                        name="location-outline" 
                                        size={18} 
                                        color={addressCity === item.title ? "#4CAF50" : "#666"} 
                                        style={styles.cityItemIcon} 
                                    />
                                    <Text style={[
                                        styles.enhancedListItemText,
                                        addressCity === item.title && styles.selectedItemText
                                    ]}>
                                        {item.title}
                                    </Text>
                                </View>
                                {addressCity === item.title && (
                                    <View style={styles.selectionIndicator}>
                                        <Icon name="checkmark-circle" size={22} color="#4CAF50" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        )}
                        showsVerticalScrollIndicator={true}
                        nestedScrollEnabled={true}
                        ListEmptyComponent={
                            <View style={styles.emptyListContainer}>
                                <Icon name="search-outline" size={40} color="#ccc" />
                                <Text style={styles.emptyListText}>شهری یافت نشد</Text>
                            </View>
                        }
                    />
                </View>
            ) : (
                <View style={styles.autoSelectedCityCollapsed}>
                    <Icon name="checkmark-done-circle" size={24} color="#4CAF50" />
                    <Text style={styles.autoSelectedCityText}>
                        شهر "{addressCity}" به صورت خودکار انتخاب شد
                    </Text>
                    <TouchableOpacity onPress={() => {
                        setCityAutoSelected(false);
                        set_addressCity('');
                    }}>
                        <Text style={styles.changeCityText}>تغییر شهر</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    const renderNeighborhoodSelection = () => (
        <View style={styles.formField}>
            <Text style={styles.label}>محله *</Text>
            
            {addressNeighbourhood && (
                <View style={styles.selectedNeighborhoodContainer}>
                    <View style={styles.selectedNeighborhoodInfo}>
                        <Icon name="navigate" size={18} color="#2196F3" style={styles.neighborhoodIcon} />
                        <Text style={styles.selectedNeighborhoodName}>{addressNeighbourhood}</Text>
                        <Text style={styles.selectedNeighborhoodText}>محله انتخاب شده : </Text>
                    </View>
                    <View style={styles.selectedNeighborhoodBadge}>
                        <Icon name="checkmark-circle" size={22} color="#2196F3" />
                    </View>
                </View>
            )}
            
            {addressCity ? (
                <View style={styles.enhancedListContainer}>
                    <FlatList
                        data={filteredNeighborhoods}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.enhancedListItem,
                                    addressNeighbourhood === item.name && styles.selectedEnhancedItem
                                ]}
                                onPress={() => set_addressNeighbourhood(item.name)}
                            >
                                <View style={styles.cityItemContent}>
                                    <Icon 
                                        name="navigate-outline" 
                                        size={16} 
                                        color={addressNeighbourhood === item.name ? "#2196F3" : "#666"} 
                                        style={styles.cityItemIcon} 
                                    />
                                    <Text style={[
                                        styles.enhancedListItemText,
                                        addressNeighbourhood === item.name && styles.selectedItemText
                                    ]}>
                                        {item.name}
                                    </Text>
                                </View>
                                {addressNeighbourhood === item.name && (
                                    <View style={styles.selectionIndicator}>
                                        <Icon name="checkmark-circle" size={20} color="#2196F3" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        )}
                        showsVerticalScrollIndicator={true}
                        nestedScrollEnabled={true}
                    />
                </View>
            ) : (
                <View style={styles.placeholderContainer}>
                    <Icon name="information-circle-outline" size={24} color="#FF9800" />
                    <Text style={styles.placeholderText}>ابتدا شهر را انتخاب کنید</Text>
                </View>
            )}
        </View>
    );

    const renderAddressForm = () => (
        <View style={styles.formField}>
            <Text style={styles.label}>آدرس کامل *</Text>
            <TextInput
                style={styles.addressInput}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                value={addressFormatted}
                onChangeText={set_addressFormatted}
                placeholder="آدرس کامل محل را وارد کنید..."
                textAlign="right"
            />
        </View>
    );

    const renderConfirmationAlert = () => {
        if (!showConfirmation) return null;

        return (
            <View style={styles.confirmationContainer}>
                <View style={styles.confirmationBox}>
                    <Text style={styles.confirmationTitle}>موقعیت انتخاب شده</Text>

                    {isReverseGeocoding ? (
                        <View style={styles.geocodeLoading}>
                            <ActivityIndicator size="large" color="#4CAF50" />
                            <Text style={styles.geocodeLoadingText}>در حال دریافت اطلاعات موقعیت...</Text>
                        </View>
                    ) : geocodeError ? (
                        <View style={styles.geocodeError}>
                            <Icon name="alert-circle" size={30} color="#D32F2F" />
                            <Text style={styles.geocodeErrorText}>
                                دریافت اطلاعات موقعیت با خطا مواجه شد. دوباره روی نقشه ضربه بزنید.
                            </Text>
                        </View>
                    ) : (
                        <>
                            <Text style={styles.confirmationAddress} numberOfLines={3}>
                                {selectedPlaceName}
                            </Text>
                            {cityAutoSelected && (
                                <View style={styles.autoSelectInfo}>
                                    <Icon name="checkmark-circle" size={20} color="#4CAF50" />
                                    <Text style={styles.autoSelectText}>
                                        شهر "{addressCity}" به صورت خودکار انتخاب شد
                                    </Text>
                                </View>
                            )}
                        </>
                    )}

                    {!isReverseGeocoding && (
                        <View style={styles.confirmationButtons}>
                            <TouchableOpacity 
                                style={[styles.confirmationButton, styles.cancelButton]}
                                onPress={() => {
                                    setShowConfirmation(false);
                                    setGeocodeError(false);
                                    setCityAutoSelected(false);
                                }}
                            >
                                <Text style={styles.cancelButtonText}>تغییر موقعیت</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.confirmationButton, styles.confirmButton]}
                                onPress={handleConfirmation}
                                disabled={geocodeError}
                            >
                                <Text style={styles.confirmButtonText}>تأیید موقعیت</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    const renderFormStep = () => (
        <Modal
            isVisible={currentStep === 2}
            style={styles.formModal}
            backdropOpacity={0.5}
            onBackdropPress={() => setCurrentStep(1)}
        >
            <View style={styles.formContainer}>
                <View style={styles.formHeader}>
                    <Text style={styles.formTitle}>تکمیل اطلاعات موقعیت</Text>
                    <TouchableOpacity onPress={() => setCurrentStep(1)}>
                        <Icon name="close" size={24} color="#666" />
                    </TouchableOpacity>
                </View>
                
                <ScrollView 
                    ref={scrollViewRef}
                    style={styles.formScrollContent}
                    contentContainerStyle={styles.formScrollContentContainer}
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                >
                    {renderCitySelection()}
                    {renderNeighborhoodSelection()}
                    {renderAddressForm()}
                    
                    <View style={styles.bottomPadding} />
                </ScrollView>
                
                {validationError ? (
                    <View style={styles.validationErrorContainer}>
                        <Icon name="warning" size={20} color="#D32F2F" />
                        <Text style={styles.validationErrorText}>{validationError}</Text>
                    </View>
                ) : null}
                
                <View style={styles.fixedSubmitContainer}>
                    <TouchableOpacity 
                        style={[
                            styles.enhancedSubmitButton,
                            (!addressCity || !addressNeighbourhood || !addressFormatted) && styles.submitButtonDisabled
                        ]}
                        onPress={newWorkerFinal}
                        disabled={!addressCity || !addressNeighbourhood || !addressFormatted || btn_status}
                    >
                        {btn_status ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <View style={styles.submitButtonContent}>
                                <Icon name="send" size={20} color="white" style={styles.sendIcon} />
                                <Text style={styles.enhancedSubmitButtonText}>
                                    {(!addressCity || !addressNeighbourhood || !addressFormatted) 
                                        ? "لطفا شهر و محله را انتخاب کنید" 
                                        : "ارسال نهایی"}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    const renderMap = () => {
        if(!userInitialLat || !userInitialLong) {
            return (
                <View style={styles.loadingContainer}>
                    <Spinner isVisible={true} size={100} type='ThreeBounce' color='purple'/>
                </View>
            );
        }

        return (
            <MapView
                ref={_mapView}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: exLat ? Number(exLat) : Number(userInitialLat),
                    longitude: exLng ? Number(exLng) : Number(userInitialLong),
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                }}
                onPress={handleMapPress}
                onRegionChangeComplete={(region) => {
                    const zoom = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2);
                    set_circleTop('40%');
                    set_circleRadius(0.05);
                    set_zoomLevel(zoom);
                }}
                onTouchStart={touchIn}
            >
                {isSelected && finalLat && finalLong && (
                    <Marker
                        coordinate={{
                            latitude: finalLat,
                            longitude: finalLong
                        }}
                        title="موقعیت انتخاب شده"
                    />
                )}
            </MapView>
        );
    };

    return (
        <View style={{flex: 1}}>
            <View style={{height: '100%', width: '100%'}}>
                {renderMap()}

                <TouchableOpacity 
                    style={styles.searchButton}
                    onPress={() => set_isModalVisible(true)}
                >
                    <Icon name="search" size={20} color="white" />
                    <Text style={styles.searchButtonText}>جستجوی مکان</Text>
                </TouchableOpacity>

                <Modal
                    isVisible={isModalVisible}
                    style={styles.modal}
                    onBackdropPress={closeModal}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.searchInputContainer}>
                            <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="جستجوی مکان (رباط کریم، تهران و...)"
                                value={placeSearchQuery}
                                onChangeText={(text) => {
                                    set_placeSearchQuery(text);
                                    if (text.length >= 3) {
                                        searchPlaces(text);
                                    } else {
                                        set_returnedPlaces([]);
                                    }
                                }}
                                autoFocus={true}
                                textAlign="right"
                            />
                        </View>
                        <ScrollView style={styles.placesContainer}>
                            {renderPlaces()}
                        </ScrollView>
                    </View>
                </Modal>

                {renderConfirmationAlert()}

                {currentStep === 1 && !showConfirmation && (
                    <View style={styles.instructionsContainer}>
                        <Text style={styles.instructionsText}>
                            لطفا روی نقشه کلیک کنید یا مکان مورد نظر را جستجو کنید
                        </Text>
                    </View>
                )}
            </View>

            {renderFormStep()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { ...StyleSheet.absoluteFillObject },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
    noResultsContainer: { padding: 20, alignItems: 'center' },
    noResultsText: { fontSize: 16, color: '#666', textAlign: 'center' },
    searchButton: {
        position: 'absolute', top: 40, left: 20, right: 20,
        flexDirection: 'row', backgroundColor: 'rgba(20,20,20,0.8)',
        padding: 12, borderRadius: 25, alignItems: 'center', justifyContent: 'center', elevation: 5
    },
    searchButtonText: { color: 'white', marginLeft: 8, fontSize: 16 },
    modal: { margin: 0, justifyContent: 'flex-start', marginTop: 50 },
    modalContent: { backgroundColor: 'white', marginHorizontal: 20, borderRadius: 10, maxHeight: height * 0.9 },
    searchInputContainer: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
    searchIcon: { marginLeft: 10 },
    searchInput: { flex: 1, fontSize: 16, textAlign: 'right' },
    placesContainer: { maxHeight: height * 0.6 },
    placeItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
    placeTitle: { fontSize: 14, textAlign: 'right', lineHeight: 20 },
    confirmationContainer: { position: 'absolute', top: 100, left: 20, right: 20, zIndex: 1000 },
    confirmationBox: { backgroundColor: 'white', padding: 20, borderRadius: 10, elevation: 5, borderWidth: 2, borderColor: '#4CAF50' },
    confirmationTitle: { fontSize: 18, fontWeight: 'bold', color: '#2E7D32', textAlign: 'center', marginBottom: 10 },
    confirmationAddress: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 15, lineHeight: 20 },
    confirmationButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
    confirmationButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, minWidth: 120, alignItems: 'center' },
    cancelButton: { backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#ddd' },
    confirmButton: { backgroundColor: '#4CAF50' },
    cancelButtonText: { color: '#333', fontWeight: 'bold' },
    confirmButtonText: { color: 'white', fontWeight: 'bold' },
    geocodeLoading: { paddingVertical: 20, alignItems: 'center' },
    geocodeLoadingText: { marginTop: 10, fontSize: 14, color: '#666' },
    geocodeError: { paddingVertical: 15, alignItems: 'center' },
    geocodeErrorText: { marginTop: 8, fontSize: 14, color: '#D32F2F', textAlign: 'center', lineHeight: 20 },
    autoSelectInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 10, paddingHorizontal: 10 },
    autoSelectText: { marginLeft: 8, fontSize: 13, color: '#2E7D32', fontWeight: '600' },
    instructionsContainer: { position: 'absolute', bottom: 30, left: 20, right: 20, backgroundColor: 'rgba(255,255,255,0.9)', padding: 15, borderRadius: 10, alignItems: 'center' },
    instructionsText: { fontSize: 14, color: '#666', textAlign: 'center' },
    formModal: { margin: 0, justifyContent: 'flex-end' },
    formContainer: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: height * 0.9, flex: 1 },
    formHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
    formTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', flex: 1 },
    formScrollContent: { flex: 1 },
    formScrollContentContainer: { padding: 20, paddingBottom: 120 },
    formField: { marginBottom: 20, paddingBottom: 15 },
    label: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, textAlign: 'right', color: '#333' },
    enhancedSearchContainer: { marginBottom: 15 },
    searchInputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 12, borderWidth: 2, borderColor: '#e9ecef', elevation: 2 },
    enhancedSearchIcon: { marginLeft: 10 },
    enhancedSearchInput: { flex: 1, fontSize: 16, textAlign: 'right', color: '#333' },
    clearSearchButton: { padding: 4 },
    selectedCityContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#e8f5e8', padding: 12, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#4CAF50' },
    selectedCityInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    cityIcon: { marginLeft: 8 },
    selectedCityText: { fontSize: 14, color: '#2E7D32', fontWeight: '600', marginLeft: 6 },
    selectedCityName: { fontSize: 14, color: '#2E7D32', fontWeight: 'bold' },
    enhancedListContainer: { maxHeight: 200, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, backgroundColor: 'white', elevation: 2 },
    enhancedListItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
    selectedEnhancedItem: { backgroundColor: '#e8f5e8', borderLeftWidth: 4, borderLeftColor: '#4CAF50' },
    cityItemContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    cityItemIcon: { marginLeft: 10 },
    enhancedListItemText: { fontSize: 15, textAlign: 'right', flex: 1, color: '#333' },
    selectedItemText: { color: '#2E7D32', fontWeight: '600' },
    selectionIndicator: {},
    emptyListContainer: { padding: 30, alignItems: 'center', justifyContent: 'center' },
    emptyListText: { marginTop: 10, fontSize: 14, color: '#999', textAlign: 'center' },
    selectedNeighborhoodContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#e3f2fd', padding: 12, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#2196F3' },
    selectedNeighborhoodInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    neighborhoodIcon: { marginLeft: 8 },
    selectedNeighborhoodText: { fontSize: 14, color: '#1565C0', fontWeight: '600', marginLeft: 6 },
    selectedNeighborhoodName: { fontSize: 14, color: '#1565C0', fontWeight: 'bold' },
    placeholderContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#fff3e0', borderRadius: 10, borderWidth: 1, borderColor: '#FF9800' },
    placeholderText: { marginRight: 8, color: '#E65100', fontSize: 14, fontWeight: '500' },
    addressInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 15, textAlign: 'right', fontSize: 14, backgroundColor: '#f9f9f9', minHeight: 100, textAlignVertical: 'top', color:'#333' },
    validationErrorContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFEBEE', padding: 12, marginHorizontal: 20, borderRadius: 8, borderWidth: 1, borderColor: '#FFCDD2' },
    validationErrorText: { color: '#D32F2F', fontSize: 14, fontWeight: '500', marginRight: 8, textAlign: 'center' },
    fixedSubmitContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', padding: 20, borderTopWidth: 1, borderTopColor: '#eee', elevation: 8 },
    enhancedSubmitButton: { backgroundColor: '#4CAF50', padding: 18, borderRadius: 12, alignItems: 'center', elevation: 4 },
    submitButtonDisabled: { backgroundColor: '#ccc', elevation: 0 },
    submitButtonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    sendIcon: { marginRight: 8 },
    enhancedSubmitButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    bottomPadding: { height: 20 },
    autoSelectedCityCollapsed: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e8f5e8', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#4CAF50', marginTop: 10 },
    autoSelectedCityText: { marginLeft: 8, fontSize: 14, color: '#2E7D32', fontWeight: '600' },
    changeCityText: { marginLeft: 15, color: '#1976D2', fontWeight: '600', textDecorationLine: 'underline' },
});

export default NewWorker3;
