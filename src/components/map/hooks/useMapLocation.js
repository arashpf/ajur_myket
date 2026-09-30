import { useState, useEffect, useCallback } from 'react';
import { Platform, Linking, Alert, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const useMapLocation = () => {
  const [user_location_status, set_user_location_status] = useState(false);
  const [is_location_exist, set_is_location_exist] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);

  // Check if we have location permission
  const checkLocationPermission = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        setHasLocationPermission(granted);
        return granted;
      } else {
        // iOS - we'll assume permission if we can get location
        return true;
      }
    } catch (error) {
      console.error('Error checking location permission:', error);
      return false;
    }
  }, []);

  // Request location permission
  const requestLocationPermission = useCallback(async () => {
    try {
      setIsRequestingLocation(true);
      
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'آجر نیاز به دسترسی به موقعیت مکانی شما دارد تا بتواند موقعیت شما را روی نقشه نشان دهد',
            buttonNeutral: 'بعداً بپرس',
            buttonNegative: 'لغو',
            buttonPositive: 'موافقم',
          }
        );
        const hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
        setHasLocationPermission(hasPermission);
        return hasPermission;
      } else {
        // iOS - Geolocation will handle the permission prompt
        return true;
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    } finally {
      setIsRequestingLocation(false);
    }
  }, []);

  const checkGPSStatus = useCallback(() => {
    Geolocation.getCurrentPosition(
      position => {
        set_is_location_exist(true);
        set_user_location_status(true);
      },
      error => {
        console.warn('Location error:', error.message);
        set_is_location_exist(false);
        set_user_location_status(false);

        if (error.code === 1) { // PERMISSION_DENIED
          setHasLocationPermission(false);
        } else if (error.code === 2) { // POSITION_UNAVAILABLE
          Alert.alert(
            'Location Disabled',
            'لوکیشن گوشی شما خاموش است ، آجر برای ادامه نیاز به روشن کردن لوکیشن دارد',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'روشن کردن', onPress: openLocationSettings },
            ],
          );
        }
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 },
    );
  }, []);

  const openLocationSettings = useCallback(() => {
    if (Platform.OS === 'android') {
      Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
    } else {
      Linking.openURL('app-settings:');
    }
  }, []);

  const centerToUserLocation = useCallback(async (mapRef) => {
    try {
      setIsRequestingLocation(true);
      
      // First check if we have permission
      const hasPermission = await checkLocationPermission();
      
      if (!hasPermission) {
        // Request permission
        const permissionGranted = await requestLocationPermission();
        if (!permissionGranted) {
          Alert.alert(
            'دسترسی موقعیت مکانی',
            'برای نمایش موقعیت شما روی نقشه، نیاز به دسترسی موقعیت مکانی داریم. لطفاً در تنظیمات اجازه دسترسی را فعال کنید.',
            [
              { text: 'بعداً', style: 'cancel' },
              { text: 'تنظیمات', onPress: openLocationSettings },
            ]
          );
          return;
        }
      }

      // Now get the location
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          set_is_location_exist(true);
          set_user_location_status(true);
          
          mapRef?.current?.animateToRegion(
            {
              latitude: Number(latitude),
              longitude: Number(longitude),
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            },
            1000,
          );
        },
        error => {
          console.log('Error getting location:', error);
          set_is_location_exist(false);
          
          if (error.code === 1) { // PERMISSION_DENIED
            Alert.alert(
              'دسترسی موقعیت مکانی',
              'برای نمایش موقعیت شما روی نقشه، نیاز به دسترسی موقعیت مکانی داریم. لطفاً در تنظیمات اجازه دسترسی را فعال کنید.',
              [
                { text: 'بعداً', style: 'cancel' },
                { text: 'تنظیمات', onPress: openLocationSettings },
              ]
            );
          } else {
            Alert.alert(
              'خطا در دریافت موقعیت',
              'نمی‌توان موقعیت شما را دریافت کرد. لطفاً مطمئن شوید GPS فعال است.',
              [{ text: 'متوجه شدم', style: 'cancel' }]
            );
          }
        },
        {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    } catch (error) {
      console.error('Error in centerToUserLocation:', error);
    } finally {
      setIsRequestingLocation(false);
    }
  }, [checkLocationPermission, requestLocationPermission, openLocationSettings]);

  const grabUserLocation = useCallback(async (onSuccess) => {
    try {
      const hasPermission = await checkLocationPermission();
      
      if (hasPermission) {
        Geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            set_user_location_status(true);
            set_is_location_exist(true);
            
            if (onSuccess) {
              onSuccess(latitude, longitude);
            }
          },
          error => {
            console.log('Error getting location:', error);
            set_is_location_exist(false);
          },
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 },
        );
      }
      // If no permission, we'll just continue without location
    } catch (error) {
      console.error('Error in grabUserLocation:', error);
    }
  }, [checkLocationPermission]);

  // Check permission on mount
  useEffect(() => {
    checkLocationPermission();
  }, [checkLocationPermission]);

  return {
    user_location_status,
    is_location_exist,
    hasLocationPermission,
    isRequestingLocation,
    checkGPSStatus,
    openLocationSettings,
    centerToUserLocation,
    grabUserLocation,
    requestLocationPermission,
    checkLocationPermission
  };
};

export default useMapLocation;