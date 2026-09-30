import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  RefreshControl,
  Image
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MagazinePosts from '../magazine/MagazinePosts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';

// Import your custom icons
import Files from './icons/files.png';
import NoteBook from './icons/notebook.png';
import FileBank from './icons/filebank.png';
import Instruction from './icons/instruction.png';
import Ads from './icons/ads.png';
import Management from './icons/management.png';
import Calculator from './icons/calculator.png';
import Marketing from './icons/marketing.png';

import NewWorkerFab from '../fabs/NewWorkerFab';


// Custom Icon Component
const CustomIcon = ({ source, size = 32, color = 'white' }) => (
  <Image 
    source={source} 
    style={{ 
      width: size, 
      height: size,
      tintColor: color
    }} 
    resizeMode="contain"
  />
);

export default function AIAssistantHub({navigation}) {
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      text: 'هوش مصنوعی پاسخ جدیدی برای شما تولید کرد', 
      time: '۵ دقیقه پیش', 
      read: false,
      icon: 'sparkles'
    },
    { 
      id: 2, 
      text: 'فایل جدیدی در پوشه "پروژه‌ها" آپلود شد', 
      time: '۱ ساعت پیش', 
      read: false,
      icon: 'document'
    },
    { 
      id: 3, 
      text: 'یادآوری: جلسه فردا با تیم توسعه', 
      time: '۲ ساعت پیش', 
      read: true,
      icon: 'calendar'
    },
  ]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // You can add any refresh logic here if needed
    setTimeout(() => setRefreshing(false), 1000);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? {...notif, read: true} : notif
    ));
  };

  const onPressCommisionCalculator = () => {
   
    navigation.navigate('ComissionCalculator');
  }

  const onPressInstruction =  () => {

   navigation.navigate('WebViewScreen', {
    url: 'Https://mag.ajur.app/category/real-estate-education',
    title: 'آموزش'
    });
  }

  const onPressManagement = () => {

    navigation.navigate('WebViewScreen', {
    url: 'https://ajur.app/panel/department-entro',
    title: 'مدیریت'
    });
   
  }

  const onPressAds = () => {
    // alert('go to G-ads/landing-page')
    navigation.navigate('WebViewScreen', {
    url: 'https://ajur.app/G-ads/landing-page',
    title: 'تبلیغات آجر'
    });
  }


  onPressAdds = () =>  {
    
       AsyncStorage.getItem('id_token').then(token => {
      if (token == null) {
        navigation.navigate('Rlogin');
      } else {
        navigation.navigate('NewWorker');
      }
    });
  }

  

  const onPressMarketing = () => {

     AsyncStorage.getItem('id_token').then(token => {
      if (token == null) {
        navigation.navigate('Rlogin');
      } else {
          navigation.navigate('RMarketing');
      }
    });
    

   

  }

  

  const onPressFileBank = () => {

    alert('بانک فایل با سرعت درحال توسعه است و به زودی در دسترس قرار میگیرد');
    return;
    navigation.navigate('FileBank');
  };

  const onPressNoteBook = () => {
    AsyncStorage.getItem('id_token').then(token => {
      if (token == null) {
        navigation.navigate('Rlogin');
      } else {
         navigation.navigate('NoteBook');
      }
    });
  };

  const onMyFilesPress = () => {
     AsyncStorage.getItem('id_token').then(token => {
      if (token == null) {
        navigation.navigate('Rlogin');
      } else {
        navigation.navigate('Dashboard');
      }
    });
  }

  const handleFeaturePress = (featureName) => {
    Alert.alert(featureName, `این بخش ${featureName} را باز می‌کند`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
         <Text style={styles.headerTitle}> دستیار هوشمند </Text>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2196F3']}
            tintColor={'#2196F3'}
          />
        }
      >
        {/* Main Features Section - 8 Tiles */}
        <View style={styles.section}>
          <View style={styles.featuresGrid}>
            {/* Files Feature */}
            <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => onMyFilesPress()}
            >
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, {backgroundColor: '#4CAF50'}]}>
                  <CustomIcon source={Files} size={35} color="white" />
                </View>
                <Text style={styles.featureTitle}>فایل‌ها</Text>
              </View>
            </TouchableOpacity>

            {/* Notebook Feature */}
            

             <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => onPressAdds()}
            >
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, {backgroundColor: '#E11D48'}]}>
                  {/* <CustomIcon source={Ads} size={35} color="white" /> */}
                  <Ionicons name="add" size={30} color="white" />
                </View>
                <Text style={styles.featureTitle}>ثبت آگهی</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.featuresGrid, {marginTop: 12}]}>
            {/* Regional File Bank Feature */}

           {/* <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => onPressNoteBook()}
            >
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, {backgroundColor: '#085283ff'}]}>
                  <CustomIcon source={NoteBook} size={35} color="white" />
                </View>
                <Text style={styles.featureTitle}>دفترچه تلفن</Text>
              </View>
            </TouchableOpacity> */}
            {/* <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => onPressFileBank()}
            >
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, {backgroundColor: '#8B5CF6'}]}>
                  <CustomIcon source={FileBank} size={35} color="white" />
                </View>
                <Text style={styles.featureTitle}>بانک فایل</Text>
              </View>
            </TouchableOpacity> */}

            {/* Education Feature */}
            {/* <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => onPressInstruction()}
            >
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, {backgroundColor: '#2563EB'}]}>
                  <CustomIcon source={Instruction} size={35} color="white" />
                </View>
                <Text style={styles.featureTitle}>آموزش</Text>
              </View>
            </TouchableOpacity> */}
          </View>

          <View style={[styles.featuresGrid, {marginTop: 12}]}>

            {/* <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => onPressAds()}
            >
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, {backgroundColor: '#E11D48'}]}>
                  <CustomIcon source={Ads} size={35} color="white" />
                </View>
                <Text style={styles.featureTitle}>ثبت آگهی</Text>
              </View>
            </TouchableOpacity> */}

            
            {/* Increase Views Feature */}
            {/* <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => onPressAds()}
            >
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, {backgroundColor: '#E11D48'}]}>
                  <CustomIcon source={Ads} size={35} color="white" />
                </View>
                <Text style={styles.featureTitle}>افزایش بازدید</Text>
              </View>
            </TouchableOpacity> */}

            {/* Management Feature */}
            {/* <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => onPressManagement()}
            >
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, {backgroundColor: '#DC2626'}]}>
                  <CustomIcon source={Management} size={35} color="white" />
                </View>
                <Text style={styles.featureTitle}>مدیریت</Text>
              </View>
            </TouchableOpacity> */}
          </View>

          <View style={[styles.featuresGrid, {marginTop: 12}]}>
            {/* Support Feature */}
            <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => onPressCommisionCalculator()}
            >
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, {backgroundColor: '#9C27B0'}]}>
                  <CustomIcon source={Calculator} size={35} color="white" />
                </View>
                <Text style={styles.featureTitle}>محاسبه کمیسیون</Text>
              </View>
            </TouchableOpacity>

            {/* Brick Marketing Feature */}
            <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => onPressMarketing()}
            >
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, {backgroundColor: '#F97316'}]}>
                  <CustomIcon source={Marketing} size={35} color="white" />
                </View>
                <Text style={styles.featureTitle}>بازاریابی آجر</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>



        {/* Magazine Posts Component */}

        
        <MagazinePosts navigation={navigation} />
      </ScrollView>
       <NewWorkerFab
      navigation={navigation} // Add this line
      showFooter={false}
      visibleMarkers={0} 
      loading={false}
    />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,  
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'iransans'
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 12,
    paddingHorizontal: 12,
  },
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
    fontFamily: 'iransans'
  },
});