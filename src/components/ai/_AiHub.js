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
  RefreshControl
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MagazinePosts from '../magazine/MagazinePosts'; // Adjust the path as needed

import AsyncStorage from '@react-native-async-storage/async-storage';
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

  const onPressFileBank = () => {
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
        navigation.navigate('RDashborad');
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
                  <Ionicons name="document-outline" size={32} color="white" />
                </View>
                <Text style={styles.featureTitle}>فایل‌ها</Text>
              </View>
            </TouchableOpacity>

            {/* Notebook Feature */}
            <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => onPressNoteBook()}
            >
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, {backgroundColor: '#e0c31fff'}]}>
                  <Ionicons name="book-outline" size={32} color="white" />
                </View>
                <Text style={styles.featureTitle}>دفترچه تلفن</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.featuresGrid, {marginTop: 12}]}>
            {/* Regional File Bank Feature */}
            <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => onPressFileBank()}
            >
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, {backgroundColor: '#2196F3'}]}>
                  <Ionicons name="archive-outline" size={32} color="white" />
                </View>
                <Text style={styles.featureTitle}>بانک فایل</Text>
              </View>
            </TouchableOpacity>

            {/* Education Feature */}
            <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => onPressFileBank()}
            >
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, {backgroundColor: '#9C27B0'}]}>
                  <Ionicons name="school-outline" size={32} color="white" />
                </View>
                <Text style={styles.featureTitle}>آموزش</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={[styles.featuresGrid, {marginTop: 12}]}>
            {/* Increase Views Feature */}
            <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => onPressFileBank()}
            >
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, {backgroundColor: '#2196F3'}]}>
                  <Ionicons name="eye-outline" size={32} color="white" />
                </View>
                <Text style={styles.featureTitle}>افزایش بازدید</Text>
              </View>
            </TouchableOpacity>

            {/* Management Feature */}
            <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => onPressFileBank()}
            >
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, {backgroundColor: '#9C27B0'}]}>
                  <Ionicons name="settings-outline" size={32} color="white" />
                </View>
                <Text style={styles.featureTitle}>مدیریت</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={[styles.featuresGrid, {marginTop: 12}]}>
            {/* Support Feature */}
            <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => onPressFileBank()}
            >
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, {backgroundColor: '#9C27B0'}]}>
                  <Ionicons name="help-buoy-outline" size={32} color="white" />
                </View>
                <Text style={styles.featureTitle}>محاسبه کمیسیون</Text>
              </View>
            </TouchableOpacity>

            {/* Brick Marketing Feature */}
            <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => onPressFileBank()}
            >
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, {backgroundColor: '#2196F3'}]}>
                  <Ionicons name="megaphone-outline" size={32} color="white" />
                </View>
                <Text style={styles.featureTitle}>بازاریابی آجر</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Magazine Posts Component */}
        <MagazinePosts navigation={navigation} />
      </ScrollView>
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

