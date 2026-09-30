// src/components/NotificationPermission.js
import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';

class NotificationPermission {
  static async checkAndRequest() {
    try {
      console.log('Checking notification permission...');
      
      // Only Android 13+ (API level 33) needs explicit permission request
      if (Platform.OS !== 'android') {
        console.log('Not Android, skipping notification permission request');
        return true;
      }
      
      const androidVersion = Platform.Version;
      console.log(`Android version: ${androidVersion}`);
      
      if (androidVersion < 33) {
        console.log('Android version below 13, no permission needed');
        return true;
      }
      
      // For Android 13+
      const permission = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;
      
      // Check current permission status
      const hasPermission = await PermissionsAndroid.check(permission);
      console.log(`Current permission status: ${hasPermission ? 'GRANTED' : 'DENIED'}`);
      
      if (hasPermission) {
        return true;
      }
      
      // Request permission
      console.log('Requesting notification permission...');
      const result = await PermissionsAndroid.request(permission, {
        title: 'اجازه اعلان‌ها',
        message: 'برای دریافت آخرین آگهی‌های املاک، اطلاع‌رسانی پیام‌ها و به‌روزرسانی‌های مهم، اجازه دسترسی اعلان‌ها لازم است.',
        buttonPositive: 'اجازه بده',
        buttonNegative: 'بعداً',
        buttonNeutral: 'تنظیمات',
      });
      
      console.log(`Permission request result: ${result}`);
      
      // Handle different results
      switch (result) {
        case PermissionsAndroid.RESULTS.GRANTED:
          console.log('Notification permission granted');
          return true;
          
        case PermissionsAndroid.RESULTS.DENIED:
          console.log('Notification permission denied');
          return false;
          
        case PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN:
          console.log('User selected "Never ask again"');
          // Show alert to guide user to settings
          setTimeout(() => {
            Alert.alert(
              'دسترسی اعلان‌ها مسدود شد',
              'شما دسترسی اعلان‌ها را مسدود کرده‌اید. برای فعال کردن:\n\n۱. به تنظیمات بروید\n۲. بخش "Apps" یا "برنامه‌ها" را انتخاب کنید\n۳. برنامه "آجر" را پیدا کنید\n۴. روی "Notifications" یا "اعلان‌ها" کلیک کنید\n۵. اجازه دسترسی را فعال کنید',
              [
                { text: 'انصراف', style: 'cancel' },
                {
                  text: 'برو به تنظیمات',
                  onPress: () => Linking.openSettings()
                }
              ]
            );
          }, 1000);
          return false;
          
        default:
          return false;
      }
    } catch (error) {
      console.error('Error in notification permission request:', error);
      return false;
    }
  }
  
  // Simple method to just check status
  static async getPermissionStatus() {
    if (Platform.OS !== 'android') {
      return 'not_android';
    }
    
    if (Platform.Version < 33) {
      return 'granted_auto'; // Pre-Android 13, granted automatically
    }
    
    try {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      return hasPermission ? 'granted' : 'denied';
    } catch (error) {
      console.error('Error checking permission:', error);
      return 'error';
    }
  }
}

export default NotificationPermission;