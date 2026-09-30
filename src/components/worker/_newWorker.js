import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Animated
} from 'react-native';
import { Box, useToast } from 'native-base';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { List, Divider } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Spinner from 'react-native-spinkit';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

const { width, height } = Dimensions.get('window');

const NewWorker = ({ route, navigation }) => {
  const toast = useToast();
  const [loading, set_loading] = useState(true);
  const [basecategories, set_basecategories] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scrollY] = useState(new Animated.Value(0));
  const scrollViewRef = useRef();

  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: ['rgba(255,255,255,0.9)', 'rgba(255,255,255,1)'],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    set_loading(true);
    
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    axios({
      method: 'get',
      url: 'https://api.ajur.app/api/sub-category',
    })
      .then(function (response) {
        set_basecategories(response.data);
        set_loading(false);
      });

    AsyncStorage.getItem('id_token').then(token => {
      if (token == null) {
        navigation.navigate('Rlogin');
      }
    });
  }, []);

  // Function to replace "خرید" with "فروش" in category names
  const formatCategoryName = (name) => {
    if (!name) return '';
    return name.replace(/خرید/g, 'فروش');
  };

  const onPressingSingleBasecategory = async (cat) => {
    try {
      // First check if profile name exists and is valid
      const profileName = await AsyncStorage.getItem('name');

      if (!profileName || profileName.length < 3 || profileName === 'null' || profileName === 'undefined') {
        toast.show({
          render: () => (
            <Box bg="orange.700" px="15" py="3" rounded="md" mb={5}>
              <Text style={{ color: 'white', fontSize: 16 }}>
                لطفا ابتدا پروفایل خود را تکمیل کنید
              </Text>
            </Box>
          ),
        });
        navigation.navigate('RDashborad');
        return;
      }

      // All validations passed - proceed with the action
      const choosedCat = JSON.stringify(cat.id);
      await AsyncStorage.setItem('worker_cat_id', choosedCat);

      console.log('Selected category ID:', choosedCat);

      navigation.navigate('NewWorker2', {
        catId: cat.id,
        catName: cat.name,
      });

    } catch (error) {
      console.error('Error in onPressingSingleBasecategory:', error);
      toast.show({
        render: () => (
          <Box bg="red.700" px="15" py="3" rounded="md" mb={5}>
            <Text style={{ color: 'white', fontSize: 16 }}>
              خطایی در پردازش درخواست رخ داده است
            </Text>
          </Box>
        ),
      });
    }
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const renderBasecategories = () => {
    if (loading) {
      return (
        <Animatable.View
          animation="pulse"
          iterationCount="infinite"
          style={styles.spinnerContainer}
        >
          <View style={styles.spinnerView}>
            <Spinner
              style={styles.spinner}
              isVisible={true}
              size={40}
              type='Circle'
              color='#a92b31'
            />
            <Text style={styles.loadingText}>در حال بارگذاری...</Text>
          </View>
        </Animatable.View>
      );
    } else {
      return basecategories.map((cat, index) => (
        <Animatable.View
          animation="fadeInRight"
          duration={500}
          delay={index * 80}
          easing="ease-out"
          useNativeDriver={true}
          key={cat.id}
        >
          <TouchableOpacity
            onPress={() => onPressingSingleBasecategory(cat)}
            style={styles.categoryItem}
            key={cat.id}
            activeOpacity={0.7}
          >
            <View style={styles.categoryContent}>
              <View style={styles.arrowContainer}>
                <Icon name="chevron-back-outline" size={20} color='#a92b31' />
              </View>
              <View style={styles.categoryTextContainer}>
                <Text style={styles.categoryName}>
                  {formatCategoryName(cat.name)}
                </Text>
              </View>
            </View>
            <View style={styles.categoryDivider} />
          </TouchableOpacity>
        </Animatable.View>
      ));
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Fixed Header - Always Readable */}
      <Animated.View
        style={[
          styles.fixedHeader,
          {
            backgroundColor: headerBackgroundColor,
            borderBottomColor: scrollY.interpolate({
              inputRange: [0, 50],
              outputRange: ['rgba(169, 43, 49, 0.1)', 'rgba(169, 43, 49, 0.2)'],
            }),
          }
        ]}
      >
        <View style={styles.headerContent}>
          {/* Back Button - Left Side */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back-outline" size={24} color='#a92b31' />
          </TouchableOpacity>

          {/* Header Text - Right Side */}
          <View style={styles.headerTextContainer}>
            <Text style={styles.mainTitle}>ثبت ملک جدید</Text>
            <Text style={styles.subTitle}>
              دسته بندی مورد نظر را انتخاب کنید
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Top Spacer for Header */}
        <View style={styles.headerSpacer} />

        <View style={styles.listContainer}>
          {renderBasecategories()}
        </View>

        {/* Footer Info */}
        <Animatable.View
          animation="fadeInUp"
          duration={500}
          delay={200}
          style={styles.footerInfo}
        >
          <Text style={styles.footerText}>
            تمامی دسته بندی های املاک در این بخش موجود می‌باشد
          </Text>
        </Animatable.View>
      </Animated.ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    marginLeft: 5,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'iransans',
    color: '#a92b31',
    marginBottom: 2,
  },
  subTitle: {
    fontSize: 12,
    fontFamily: 'iransans',
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  headerSpacer: {
    height: 100, // Space for the fixed header
  },
  listContainer: {
    paddingHorizontal: 15,
  },
  categoryItem: {
    marginHorizontal: 5,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(169, 43, 49, 0.1)',
    overflow: 'hidden',
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingVertical: 16,
  },
  categoryTextContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  categoryName: {
    fontWeight: '600',
    fontFamily: 'iransans',
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
  },
  arrowContainer: {
    padding: 4,
    marginRight: 10,
  },
  categoryDivider: {
    height: 1,
    backgroundColor: 'rgba(169, 43, 49, 0.08)',
    marginHorizontal: 16,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: height * 0.4,
  },
  spinnerView: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  spinner: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'iransans',
    color: '#666',
    textAlign: 'center',
  },
  footerInfo: {
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: 10,
  },
  footerText: {
    fontSize: 13,
    fontFamily: 'iransans',
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default NewWorker;