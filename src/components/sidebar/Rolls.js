import React from 'react';
import {
  View,
  ScrollView,
  ImageBackground,
  Text,
  StyleSheet,
  Dimensions,
  Image
} from 'react-native';
import { Box, Button } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const Rolls = ({navigation}) => {
  const goToMainPage = () => {
    AsyncStorage.setItem('id_visitbefore', 'true');
    navigation.navigate('Base');
  };

  return (
    <ImageBackground 
      source={require('../assets/ajur_logo.png')} 
      style={styles.background}
      blurRadius={1}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Header Section */}
          <View style={styles.header}>
            <Image 
              source={require('../assets/ajur_logo.png')}  
              style={styles.headerImage}
              resizeMode="contain"
            />
            <Text style={styles.title}>قوانین و توافق نامه کاربری</Text>
            <Text style={styles.subtitle}>برای استفاده بهتر از اپلیکیشن آجر</Text>
          </View>

          {/* Terms Content */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
               ۱. شرایط عمومی استفاده{"\n"}
            ۱.۱. پلتفرم آجر یک سامانه هوشمند مشاوره املاک است که به کاربران امکان خرید، فروش، رهن و اجاره ملک را می‌دهد.{"\n"}
            ۱.۲. با ثبت‌نام در آجر، شما تمامی این شرایط را پذیرفته‌اید.{"\n\n"}
            
            ۲. تعهدات کاربران{"\n"}
            ۲.۱. کاربران موظفند اطلاعات صحیح و کامل از ملک ارائه دهند شامل:{"\n"}
            - مساحت دقیق{"\n"}
            - سال ساخت{"\n"}
            - وضعیت سند{"\n"}
            - قیمت واقعی{"\n"}
            - تصاویر باکیفیت از ملک{"\n"}
            ۲.۲. هرگونه اطلاعات نادرست منجر به حذف آگهی و مسدود شدن حساب کاربری خواهد شد.{"\n\n"}
            
            ۳. قوانین آگهی‌دهی{"\n"}
            ۳.۱. ممنوعیت‌های محتوایی:{"\n"}
            - آگهی‌های تکراری{"\n"}
            - قیمت‌های غیرواقعی{"\n"}
            - مشخصات جعلی{"\n"}
            - شماره‌تماس غیر مرتبط{"\n"}
            - محتوای تبلیغاتی غیرمجاز{"\n"}
            ۳.۲. کاربران می‌توانند حداکثر ۵ آگهی فعال همزمان داشته باشند.{"\n\n"}
            
            ۴. مسئولیت‌ها{"\n"}
            ۴.۱. آجر مسئولیتی در قبال:{"\n"}
            - صحت اطلاعات آگهی‌ها{"\n"}
            - معاملات انجام شده خارج از پلتفرم{"\n"}
            - اختلافات بین کاربران ندارد.{"\n"}
            ۴.۲. کاربران مسئول بررسی صحت اطلاعات و انجام معاملات هستند.{"\n\n"}
            
            ۵. حریم خصوصی{"\n"}
            ۵.۱. آجر از اطلاعات شخصی کاربران محافظت می‌کند.{"\n"}
            ۵.۲. شماره تماس کاربران فقط پس از توافق طرفین نمایش داده می‌شود.{"\n\n"}
            
            ۶. جریمه‌ها و محدودیت‌ها{"\n"}
            ۶.۱. تخلفات منجر به:{"\n"}
            - اخطار اولیه{"\n"}
            - تعلیق موقت حساب{"\n"}
            - مسدودیت دائم خواهند شد.{"\n"}
            ۶.۲. کاربران متخلف حق اعتراض ندارند.{"\n\n"}
            
            ۷. هزینه‌ها و پرداخت‌ها{"\n"}
            ۷.۱. خدمات پایه آجر رایگان است.{"\n"}
            ۷.۲. برخی خدمات ویژه (نمایش ویژه، آگهی پین شده) ممکن است هزینه داشته باشند.{"\n\n"}
            
            ۸. تغییر شرایط{"\n"}
            ۸.۱. آجر حق تغییر این شرایط را با اطلاع قبلی کاربران محفوظ می‌دارد.

            </Text>
          </View>

          {/* Action Button */}
          <Button 
            onPress={goToMainPage}
            style={styles.actionButton}
            startIcon={<Icon name="home" size={20} color="white" />}
          >
            <Text style={styles.buttonText}>بازگشت به خانه</Text>
          </Button>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 40,
    borderRadius: 20,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
  },
  headerImage: {
    height: 120,
    width: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Yekan',
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Yekan',
    color: '#7f8c8d',
    textAlign: 'center',
  },
  termsContainer: {
    backgroundColor: 'rgba(245, 245, 245, 0.7)',
    borderRadius: 15,
    padding: 10,
    marginVertical: 15,
  },
  termsText: {
     fontSize: 17,
    fontFamily: 'iransans',
    
    textAlign: 'right' // Works on iOS
  },
  actionButton: {
    backgroundColor: '#4a8cff',
    marginTop: 25,
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Yekan',
    fontSize: 16,
    color: 'white',
    marginRight: 10,
  },
});

export default Rolls;