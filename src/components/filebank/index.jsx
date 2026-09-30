import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const FileBank = ({ navigation }) => {
  const [showIntroSlider, setShowIntroSlider] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      text: 'املاک جدید در منطقه شما اضافه شد', 
      time: '۵ دقیقه پیش', 
      read: false,
      icon: 'home'
    },
    { 
      id: 2, 
      text: 'جستجوی شما با ۱۲ نتیجه جدید به روز شد', 
      time: '۱ ساعت پیش', 
      read: false,
      icon: 'search'
    },
    { 
      id: 3, 
      text: 'یادآوری: ملک مورد علاقه شما قیمت کاهش یافت', 
      time: '۲ ساعت پیش', 
      read: true,
      icon: 'heart'
    },
  ]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const animationRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];
  
  const introSlides = [
    {
      id: 1,
      title: 'به بانک فایل ایران خوش آمدید',
      description: 'اولین سامانه چندلیستینگ املاک در ایران',
      lottieSource: require('./assets/lottie/one.json'),
      color: '#4CAF50',
    },
    {
      id: 2,
      title: 'آژور چیست؟',
      description: 'آژور یک پلتفرم هوشمند برای نمایش و مدیریت املاک است که با استفاده از تکنولوژی MLS به شما کمک می‌کند بهترین معاملات را انجام دهید',
      lottieSource: require('./assets/lottie/two.json'),
      color: '#2196F3',
    },
    {
      id: 3,
      title: '۲۱ روز试用高级计划',
      description: 'از امکانات پریمیوم به مدت ۲۱ روز رایگان استفاده کنید و تجربه متفاوتی از مدیریت املاک داشته باشید',
      lottieSource: require('./assets/lottie/three.json'),
      color: '#FF9800',
    },
    {
      id: 4,
      title: 'شروع کار با بانک فایل',
      description: 'همین حالا شروع کنید و از امکانات کامل پلتفرم MLS ایران بهره‌مند شوید',
      lottieSource: require('./assets/lottie/four.json'),
      color: '#9C27B0',
    }
  ];

  // Check if user has seen intro slider before
  useEffect(() => {
    const checkFirstTimeVisit = async () => {
      try {
        const hasSeenIntro = await AsyncStorage.getItem('hasSeenFileBankIntro');
        if (hasSeenIntro === null) {
          // First time visiting - show intro slider
          setShowIntroSlider(true);
          
          // Animate intro slider entrance
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 300,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            })
          ]).start();
          
          // Play first animation
          setTimeout(() => {
            animationRefs[0]?.current?.play();
          }, 300);
        }
      } catch (error) {
        console.error('Error checking intro status:', error);
      }
    };

    checkFirstTimeVisit();
  }, []);

  const handleContinueIntro = () => {
    // Stop current animation
    animationRefs[currentSlideIndex]?.current?.pause();
    
    if (currentSlideIndex < introSlides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
      // Play the next animation
      setTimeout(() => {
        animationRefs[currentSlideIndex + 1]?.current?.play();
      }, 100);
    } else {
      closeIntroSlider();
    }
  };

  const handlePreviousIntro = () => {
    if (currentSlideIndex > 0) {
      // Stop current animation
      animationRefs[currentSlideIndex]?.current?.pause();
      
      setCurrentSlideIndex(currentSlideIndex - 1);
      
      // Play the previous animation
      setTimeout(() => {
        animationRefs[currentSlideIndex - 1]?.current?.play();
      }, 100);
    }
  };

  const closeIntroSlider = async () => {
    // Animate exit
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(async () => {
      // Mark as seen
      try {
        await AsyncStorage.setItem('hasSeenFileBankIntro', 'true');
      } catch (error) {
        console.error('Error saving intro status:', error);
      }
      setShowIntroSlider(false);
    });
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? {...notif, read: true} : notif
    ));
  };

  const handleFeaturePress = (featureName) => {
    alert(`این بخش ${featureName} را باز می‌کند`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Intro Slider Modal */}
      <Modal
        visible={showIntroSlider}
        transparent={true}
        animationType="none"
        onRequestClose={closeIntroSlider}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={closeIntroSlider}>
              <Text style={styles.closeIcon}>×</Text>
            </TouchableOpacity>
            
            {/* Lottie Animation */}
            <View style={styles.animationContainer}>
              <LottieView
                ref={animationRefs[currentSlideIndex]}
                source={introSlides[currentSlideIndex].lottieSource}
                autoPlay
                loop
                style={styles.lottieAnimation}
              />
            </View>
            
            {/* Text Content */}
            <View style={styles.textContainer}>
              <Text style={styles.slideTitle}>{introSlides[currentSlideIndex].title}</Text>
              <Text style={styles.slideDescription}>{introSlides[currentSlideIndex].description}</Text>
            </View>
            
            {/* Pagination Dots */}
            <View style={styles.pagination}>
              {introSlides.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    { 
                      backgroundColor: i === currentSlideIndex ? introSlides[currentSlideIndex].color : '#e0e0e0',
                      width: i === currentSlideIndex ? 20 : 8,
                    }
                  ]}
                />
              ))}
            </View>
            
            {/* Navigation Buttons */}
            <View style={styles.buttonsContainer}>
              {currentSlideIndex > 0 && (
                <TouchableOpacity 
                  style={[styles.button, styles.prevButton]} 
                  onPress={handlePreviousIntro}
                >
                  <Text style={[styles.buttonText, {color: introSlides[currentSlideIndex].color}]}>قبلی</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={[styles.button, styles.nextButton, { backgroundColor: introSlides[currentSlideIndex].color }]} 
                onPress={handleContinueIntro}
              >
                <Text style={[styles.buttonText, styles.nextButtonText]}>
                  {currentSlideIndex === introSlides.length - 1 ? 'شروع کنید' : 'بعدی'}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Main Content */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>بانک فایل ایران</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>اعلان‌ها</Text>
          <View style={styles.notificationsContainer}>
            {notifications.map((notif) => (
              <TouchableOpacity 
                key={notif.id} 
                style={[styles.notification, notif.read && styles.readNotification]}
                onPress={() => markAsRead(notif.id)}
              >
                <View style={styles.notificationIcon}>
                  <Ionicons name={notif.icon} size={20} color="#4a6fa5" />
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationText}>{notif.text}</Text>
                  <Text style={styles.notificationTime}>{notif.time}</Text>
                </View>
                {!notif.read && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Main Features Section - 4 Tiles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>امکانات اصلی</Text>
          <View style={styles.featuresGrid}>
            {/* Files Feature */}
            <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => handleFeaturePress('فایل‌ها')}
            >
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>فایل‌ها</Text>
                <View style={[styles.featureIcon, {backgroundColor: '#4CAF50'}]}>
                  <Ionicons name="folder-outline" size={32} color="white" />
                </View>
              </View>
            </TouchableOpacity>

            {/* Notebook Feature */}
            <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => handleFeaturePress('دفترچه')}
            >
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>دفترچه</Text>
                <View style={[styles.featureIcon, {backgroundColor: '#FF9800'}]}>
                  <Ionicons name="book-outline" size={32} color="white" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.featuresGrid, {marginTop: 12}]}>
            {/* Regional File Bank Feature */}
            <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => handleFeaturePress('بانک فایل منطقه')}
            >
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>بانک فایل منطقه</Text>
                <View style={[styles.featureIcon, {backgroundColor: '#2196F3'}]}>
                  <Ionicons name="server-outline" size={32} color="white" />
                </View>
              </View>
            </TouchableOpacity>

            {/* Education Feature */}
            <TouchableOpacity 
              style={styles.featureCard}
              onPress={() => handleFeaturePress('آموزش')}
            >
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>آموزش</Text>
                <View style={[styles.featureIcon, {backgroundColor: '#9C27B0'}]}>
                  <Ionicons name="school-outline" size={32} color="white" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Additional Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>امکانات دیگر</Text>
          <View style={styles.additionalFeatures}>
            {/* Invite Friends */}
            <TouchableOpacity 
              style={styles.additionalFeature}
              onPress={() => handleFeaturePress('معرفی به دوستان')}
            >
              <View style={styles.additionalFeatureContent}>
                <Text style={styles.additionalFeatureText}>معرفی به دوستان</Text>
                <View style={styles.additionalFeatureIcon}>
                  <Ionicons name="person-add-outline" size={24} color="#2196F3" />
                </View>
              </View>
            </TouchableOpacity>

            {/* Increase Views */}
            <TouchableOpacity 
              style={styles.additionalFeature}
              onPress={() => handleFeaturePress('افزایش بازدید')}
            >
              <View style={styles.additionalFeatureContent}>
                <Text style={styles.additionalFeatureText}>افزایش بازدید</Text>
                <View style={styles.additionalFeatureIcon}>
                  <Ionicons name="trending-up-outline" size={24} color="#E91E63" />
                </View>
              </View>
            </TouchableOpacity>

            {/* Support */}
            <TouchableOpacity 
              style={styles.additionalFeature}
              onPress={() => handleFeaturePress('پشتیبانی')}
            >
              <View style={styles.additionalFeatureContent}>
                <Text style={styles.additionalFeatureText}>پشتیبانی</Text>
                <View style={styles.additionalFeatureIcon}>
                  <Ionicons name="help-buoy-outline" size={24} color="#9C27B0" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#444',
  },
  notificationsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  readNotification: {
    opacity: 0.7,
  },
  notificationIcon: {
    marginLeft: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f5ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
    textAlign: 'right',
  },
  notificationTime: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2196F3',
    marginLeft: 8,
  },
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
  },
  additionalFeatures: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  additionalFeature: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  additionalFeatureContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  additionalFeatureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  additionalFeatureText: {
    fontSize: 15,
    color: '#333',
    textAlign: 'right',
  },
  // Intro Slider Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 1,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 20,
    color: '#888',
    fontWeight: 'bold',
  },
  animationContainer: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 20,
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  slideTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  slideDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    transition: 'width 0.3s ease',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  prevButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  nextButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonText: {
    color: 'white',
  },
});

export default FileBank;