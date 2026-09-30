import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import AppIntroSlider from 'react-native-app-intro-slider';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Easing,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const C_PRIMARY = '#a92b31';
const C_GRAY_LIGHT = '#f5f5f7';
const C_GRAY_TEXT = '#6b7280';
const C_WHITE = '#ffffff';
const C_DARK = '#1f2937';

const slides = [
  {
    key: 'one',
    title: 'آجر، فراتر از یک آگهی املاک',
    text: '',
    image: require('../assets/intro/ajour-logo.png'),
    isLogo: true,
  },
  {
    key: 'two',
    title: 'آپارتمان‌های کارشناسی‌شده',
    text: 'در شهر و محله شما',
    image: require('../assets/intro/share.jpg'),
    
  },
  {
    key: 'three',
    title: 'فیلترهای حرفه‌ای',
    text: 'برای یافتن نتیجه دلخواه',
    image: require('../assets/intro/virtual-tour.jpeg'),
    
  },
  {
    key: 'four',
    title: 'امکان سپردن به آجر',
    text: 'تنها با یک فرم ساده\nیک بار بسپار، بقیش با آجر',
    image: require('../assets/intro/phone-red.png'),
  },
];

const ANDROID_POST_NOTIFICATIONS = 'android.permission.POST_NOTIFICATIONS';

const Entro = ({ navigation }) => {
  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLast = activeIndex >= slides.length - 1;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(60)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  // انیمیشن فقط یک‌بار هنگام mount اجرا می‌شود
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim]);

  const requestNotificationPermissionAndroid = async () => {
    if (!(Platform.OS === 'android' && Platform.Version >= 33)) return;

    try {
      const alreadyGranted = await PermissionsAndroid.check(
        ANDROID_POST_NOTIFICATIONS,
      );
      if (alreadyGranted) return;

      await PermissionsAndroid.request(ANDROID_POST_NOTIFICATIONS, {
        title: 'اعلان‌های آجر',
        message:
          'آجر برای ارسال نوتیفیکیشن به دسترسی نیاز دارد. فقط اطلاعات مهم و ضروری برای شما ارسال خواهد شد.',
        buttonPositive: 'اجازه می‌دهم',
        buttonNegative: 'فعلاً نه',
      });
    } catch (e) {
      console.log('Notification permission error:', e);
    }
  };

  const StartApp = async () => {
    await requestNotificationPermissionAndroid();
    await AsyncStorage.setItem('id_visitbefore', 'true');
    navigation.reset({
      index: 0,
      routes: [{name: 'CitySelection'}],
    });
  };


  

  // const StartApp = async () => {
  //   await AsyncStorage.setItem('id_visitbefore', 'true');
  //   navigation.reset({
  //     index: 0,
  //     routes: [{name: 'Base'}],
  //   });
  // };

  const goNext = () => {
    if (isLast) {
      StartApp();
      return;
    }

    const nextIndex = activeIndex + 1;
    setActiveIndex(nextIndex);
    sliderRef.current?.goToSlide(nextIndex);
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}>
          <View style={styles.imageWrapper}>
            {item.isLogo ? (
              <View style={styles.logoHero}>
                <Image
                  source={item.image}
                  style={styles.logoHeroImg}
                  resizeMode="contain"
                />
              </View>
            ) : (
              <Image
                source={item.image}
                style={styles.image}
                resizeMode="contain"
              />
            )}
          </View>

          <View style={styles.textBlock}>
            <Text style={styles.title}>{item.title}</Text>
            {item.text ? <Text style={styles.text}>{item.text}</Text> : null}
          </View>
        </Animated.View>
      </View>
    );
  };

  const renderBottomButton = (label) => (
    <TouchableOpacity
      style={styles.ctaButton}
      onPress={goNext}
      activeOpacity={0.85}>
      <Text style={styles.ctaText}>{label}</Text>
      {/* <Icon
        name="arrow-forward"
        size={20}
        color={C_WHITE}
        style={styles.ctaIcon}
      /> */}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AppIntroSlider
        ref={sliderRef}
        data={slides}
        renderItem={renderItem}
        onSlideChange={(index) => setActiveIndex(index)}
        showNextButton={false}
        showDoneButton={false}
        showPrevButton={false}
        bottomButton
      />

      <View style={styles.footer}>
        <View style={styles.dotsRow}>
          {slides.map((s, i) => (
            <View
              key={s.key}
              style={[styles.dot, i === activeIndex && styles.dotActive]}
            />
          ))}
        </View>

        {renderBottomButton(isLast ? 'شروع کنید' : 'ادامه')}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C_WHITE,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: C_WHITE,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flex: 1,
    paddingTop: 40,
  },
  imageWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  image: {
    width: 280,
    height: 250,
    borderRadius: 20,
    resizeMode: 'contain',
  },
  logoHero: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: C_GRAY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C_PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  logoHeroImg: {
    width: 150,
    height: 110,
    resizeMode: 'contain',
  },
  textBlock: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    color: C_DARK,
    fontFamily: 'Vazirmatn-Bold',
    textAlign: 'center',
    lineHeight: 34,
  },
  text: {
    color: C_GRAY_TEXT,
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'yekan',
    lineHeight: 26,
    marginTop: 14,
    paddingHorizontal: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: C_WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 10,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
    marginHorizontal: 5,
  },
  dotActive: {
    backgroundColor: C_PRIMARY,
    width: 24,
    height: 8,
    borderRadius: 4,
  },
  ctaButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C_PRIMARY,
    paddingVertical: 16,
    borderRadius: 14,
    width: '100%',
  },
  ctaText: {
    color: C_WHITE,
    fontSize: 18,
    fontFamily: 'yekan',
  },
  ctaIcon: {
    marginLeft: 8,
  },
});

export default Entro;
