import * as React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import AppIntroSlider from 'react-native-app-intro-slider';
import {
  View,
  Text,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {Button} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

const slides = [
  {
    key: 'one',
    title: 'مشاور املاک هوشمند آجر',
    text: 'آجر به آجر در جستجوی بهترین ها',
    image: require('../assets/intro/ajour-logo.png'),
    backgroundColor: '#f9f9f9',
  },
  {
    key: 'two',
    title: 'تجربه ای شیرین از بازدید ملک',
    text: 'بدون محدودیت در زمان و مکان بازدید کنید',

    image: require('../assets/intro/virtual-tour.jpeg'),
    backgroundColor: '#febe29',
  },
  {
    key: 'three',
    title: 'نقشه تعاملی',
    text: 'وسعت یک کشور در دستان شما',
    image: require('../assets/intro/phone-red.png'),
    backgroundColor: '#22bcb5',
  },
];

const Entro = ({navigation}) => {
  const StartApp = () => {
    requestLocationPermission();
  };

  renderItem = ({item, index}) => {
    return (
      <View style={styles.slide}>
        <View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
        </View>

        <Image source={item.image} />

        {index > 1 && (
          <Button
            onPress={() => StartApp()}
            variant="outline"
            style={styles.headerButton}>
            <Text style={styles.startButton}>شروع</Text>
          </Button>
        )}
      </View>
    );
  };

  onDone = () => {
    // navigation.navigate('Base')
    // TODO: need to get user PERMISSIONS for android or ios here
    requestLocationPermission();
  };

  async function requestLocationPermission() {
    if (Platform.OS === 'ios') {
      AsyncStorage.setItem('id_visitbefore', 'true');
      navigation.popToTop();
      navigation.navigate('Base');
    }

    if (Platform.OS === 'android') {
      const chckLocationPermission = PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (chckLocationPermission === PermissionsAndroid.RESULTS.GRANTED) {
        alert("You've access for the location");
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'اجازه دسترسی به نقشه',
              message:
                'آجر به دسترسی موقعیت نیاز دارد لطفا دسترسی را تایید کنید',
              buttonPositive: 'باشه',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            AsyncStorage.setItem('id_visitbefore', 'true');
            navigation.reset({
              index: 0,
              routes: [{name: 'Base'}],
            });
          } else {
            alert('آجر به دسترسی موقعیت نیاز دارد');
          }
        } catch (err) {
          // alert(err)
          alert('something went wrong with ACCESS_FINE_LOCATION');
        }
      }
    }
  }

  return (
    <AppIntroSlider
      nextLabel="بعدی"
      doneLabel="شروع"
      renderItem={renderItem}
      data={slides}
      onDone={onDone}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 320,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#b92a31',
    // backgroundColor: '#e89d4e',
  },
  text: {
    color: '#222',
    backgroundColor: 'white',
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 18,
    fontFamily: 'iransans',
    borderRadius: 5,
  },
  title: {
    fontSize: 24,
    color: 'white',
    textDecorationStyle: 'double',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 16,
  },

  startButton: {
    backgroundColor: 'white',
    padding: 5,
    paddingHorizontal: 80,
    fontSize: 20,
    fontFamily: 'iransans',
  },

  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  //[...]
});
export default Entro;
