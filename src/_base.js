import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Dimensions,
  StatusBar,
  BackHandler,
  Alert,
  ToastAndroid,
} from 'react-native';

import {
  NativeBaseProvider,
  HStack,
  Center,
  Avatar,
  VStack,
  Left,
  Body,
  Right,
  Heading,
  Box,
  Divider,
  Button,
} from 'native-base';

import Carousel from 'react-native-reanimated-carousel';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = SCREEN_WIDTH * 1; // Adjust based on your card size


import Icon from 'react-native-vector-icons/Ionicons';
import WorkerCard from './cards/WorkerCard';
import RealEstateCard from './cards/RealEstateCard';
import MainCatCard from "./cards/MainCatCard";
import BaseErrorModal from '../components/modals/BaseErrorModal';

import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Spinner from 'react-native-spinkit';
import NetInfo from '@react-native-community/netinfo';

const Base = ({navigation}) => {
  const [loading, set_loading] = useState(true);
  const [userInitialLat, set_userInitialLat] = useState(null);
  const [userInitialLong, set_userInitialLong] = useState(null);
  const [title1, set_title1] = useState('');
  const [title2, set_title2] = useState('');
  const [title3, set_title3] = useState('');
  const [collection1, set_collection1] = useState([]);
  const [collection2, set_collection2] = useState([]);
  const [collection3, set_collection3] = useState([]);
  const [realstates, set_realstates] = useState([]);
  const [net_connect_status, set_net_connect_status] = useState(true);
  const [main_cats, set_main_cats] = useState([]);
    const [errorModalVisible, setErrorModalVisible] = useState(false);
  

  const renderCollection1Item = ({ item }) => (
    <TouchableOpacity key={item.id} style={{ margin: 15 }}>
      <WorkerCard data={item} />
    </TouchableOpacity>
  );

  const loadData = () => {
    
    Geolocation.getCurrentPosition(
      position => {
        var userInitialLat = JSON.stringify(position.coords.latitude);
        var userInitialLong = JSON.stringify(position.coords.longitude);

        set_userInitialLat({userInitialLat});
        set_userInitialLong({userInitialLong});

        var self = this;
        var baseurl = 'https://api.ajur.app/api/base';

        axios({
          method: 'get',
          url: baseurl,
          timeout: 7000, // 10 seconds
          params: {
            lat: userInitialLat,
            long: userInitialLong,
            // worker_id: 12,
          },
        })
          .then(function (response) {
            set_title1(response.data.title1);
            set_title2(response.data.title2);
            set_title3(response.data.title3);
            set_collection1(response.data.collection1);
            set_collection2(response.data.collection2);
            set_collection3(response.data.collection3);
            set_realstates(response.data.realstates);
            set_main_cats(response.data.main_cats);
            set_loading(false);
          })
          .catch(function (error) {
            console.log(error);
           
            set_loading(false);
            setErrorModalVisible(true);
          });
      },
      error => alert(JSON.stringify(error)),
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 10000},
    );
  }

  useEffect(() => {
    // TODO: check if the unsubcribed setInterval can lead to poor performance in app or not
    // check net status each x secound

    let intervalId = setInterval(() => {
      NetInfo.fetch().then(state => {
        set_net_connect_status(state.isConnected);
        if (!state.isConnected) {
          var message = 'اتصال اینترنت را بررسی کنید';
          // ToastAndroid.show("اتصال اینترنت را برسی کنید",ToastAndroid.LONG);
          ToastAndroid.showWithGravityAndOffset(
            message,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
            25,
            50,
          );
        }
      });
    }, 5000);

    //end of check net status

    loadData();
  }, []);

  const goToCategory = (cat) => {

    

     navigation.navigate('Nearests', {
      cat:cat
    });
    return;
    // const choosedcat = {
    //   id: id,
    //   name: name,
    // };

    // navigation.navigate('Nearests', {
    //   id: id,
    //   name: name,
    // });
  };

  const onPressingSingleWorker = ({worker}) => {
    navigation.navigate('WorkerSingle', {
      itemId: worker.id,
    });

    // Actions.workerRoot({worker});
  };

  const renderRealstates = () => {
    return realstates.map(realstate => (
      <RealEstateCard key={realstate.id} realstate={realstate} circle_size={130} />
    ));
  };

  const renderCollection1 = () => {
    return collection1.map(related => (
      <TouchableOpacity key={related.id} style={{margin: 15}}>
        <WorkerCard data={related} />
      </TouchableOpacity>
    ));
  };

  const renderCollection2 = () => {
    return collection2.map(related => (
      <TouchableOpacity key={related.id} style={{margin: 15}}>
        <WorkerCard data={related} />
      </TouchableOpacity>
    ));
  };

  const renderCollection3 = () => {
    return collection3.map(related => (
      <TouchableOpacity key={related.id} style={{margin: 15}}>
        <WorkerCard data={related} />
      </TouchableOpacity>
    ));
  };

  const Refresh = () => {
    set_net_connect_status(true);

    Geolocation.getCurrentPosition(
      position => {
        var userInitialLat = JSON.stringify(position.coords.latitude);
        var userInitialLong = JSON.stringify(position.coords.longitude);

        set_userInitialLat({userInitialLat});
        set_userInitialLong({userInitialLong});

        var self = this;
        var baseurl = 'https://api.ajur.app/api/base';

        axios({
          method: 'get',
          url: baseurl,
          params: {
            lat: userInitialLat,
            long: userInitialLong,
            // worker_id: 12,
          },
        })
          .then(function (response) {
            set_title1(response.data.title1);
            set_title2(response.data.title2);
            set_title3(response.data.title3);
            set_collection1(response.data.collection1);
            set_collection2(response.data.collection2);
            set_collection3(response.data.collection3);
            set_realstates(response.data.realstates);
            set_loading(false);
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      error => alert(JSON.stringify(error)),
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 10000},
    );
  };

  

  const renderOrSpinner = () => {
    if (!net_connect_status) {
      return (
        <View style={styles.spinnerView}>
          <TouchableOpacity onPress={() => Refresh()}>
            <Icon
              name="ios-refresh"
              style={{
                fontSize: 35,
                color: 'red',
                textAlign: 'center',
                borderRadius: 20,
              }}
            />
            <Text style={styles.itemText}>تلاش مجدد</Text>
          </TouchableOpacity>

          <Image
            source={require('./assets/broken-brick.jpg')}
            alt="توافق نامه کاربری آجر"
            style={{height: 200, width: 200, alignSelf: 'center'}}
          />
          <Text style={{padding: 10, color: 'gray'}}>
            اتصال خود به اینترنت را برسی کنید
          </Text>
        </View>
      );
    } else if (loading) {
      return (
        <View style={styles.spinnerView}>
          <Spinner
            style={styles.spinner}
            isVisible={true}
            size={30}
            type="Circle"
            color="#b92a31"
          />
        </View>
      );
    } else {
      return (
        <NativeBaseProvider>
          <View style={styles.wraper}>
          
            <View >

            
          
            </View>

            <View style={styles.scrollViewTitleWrapper}>
            <Text style={styles.scrollViewAllTitle}>همه</Text>
            <Text style={styles.scrollViewTitle}>
              بهترین مشاورین املاک منطقه
            </Text>
          </View>

          <Carousel
              width={ITEM_WIDTH}
              height={ITEM_WIDTH * (3/4.5)} // Adjust aspect ratio as needed
              data={realstates}
              renderItem={({ item }) => <RealEstateCard realstate={item} circle_size={140} />}
              isRTL={true} // Right-to-left layout
              mode="parallax"
              parallaxScrollingOffset={50} // Default is 100; tweak for speed
              parallaxScrollingScale={0.9} // Scale of inactive items (0.8-1.0)
              style={{ width: "100%" }}
              // Ensure full container width
              panGestureHandlerProps={{
                activeOffsetX: [-10, 10], // Horizontal swipe sensitivity
                activeOffsetY: [-1000, 1000], // Allow vertical scroll (large values prioritize parent scroll)
              }}
            />

            {/* <ScrollView
              contentOffset={{x: 290}}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              pagingEnabled={false}>
              {renderSliderCategories()} 
            </ScrollView> */}

            <View style={styles.scrollViewTitleWrapper}>
              <Text style={styles.scrollViewAllTitle}></Text>
              <Text style={styles.scrollViewTitle}>{title1}محدوده</Text>
            </View>
            {/* <ScrollView
              contentOffset={{x: 290}}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              pagingEnabled={false}>
              {renderCollection1()}
            </ScrollView> */}

            <Carousel
              width={ITEM_WIDTH}
              height={ITEM_WIDTH * (3/4.5)} // Adjust aspect ratio as needed
              data={collection1}
              renderItem={({ item }) => <WorkerCard data={item} />}
              isRTL={true} // Right-to-left layout
              mode="parallax"
              parallaxScrollingOffset={50} // Default is 100; tweak for speed
              parallaxScrollingScale={0.9} // Scale of inactive items (0.8-1.0)
              style={{ width: "100%" }}
              // Ensure full container width
              panGestureHandlerProps={{
                activeOffsetX: [-10, 10], // Horizontal swipe sensitivity
                activeOffsetY: [-1000, 1000], // Allow vertical scroll (large values prioritize parent scroll)
              }}
            />

            <View style={styles.scrollViewTitleWrapper}>
              <Text style={styles.scrollViewAllTitle}></Text>
              <Text style={styles.scrollViewTitle}>{title2} محدوده</Text>
            </View>

            <Carousel
              width={ITEM_WIDTH}
              height={ITEM_WIDTH * (3/4.5)} // Adjust aspect ratio as needed
              data={collection2}
              renderItem={({ item }) => <WorkerCard data={item} />}
              isRTL={true} // Right-to-left layout
              mode="parallax"
              parallaxScrollingOffset={50} // Default is 100; tweak for speed
              parallaxScrollingScale={0.9} // Scale of inactive items (0.8-1.0)
              style={{ width: "100%" }}
              // Ensure full container width
              panGestureHandlerProps={{
                activeOffsetX: [-10, 10], // Horizontal swipe sensitivity
                activeOffsetY: [-1000, 1000], // Allow vertical scroll (large values prioritize parent scroll)
              }}
            />

            {/* <ScrollView
              contentOffset={{x: 100}}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              pagingEnabled={false}>
              {renderCollection2()}
            </ScrollView> */}

            <View style={styles.scrollViewTitleWrapper}>
              <Text style={styles.scrollViewAllTitle}></Text>
              <Text style={styles.scrollViewTitle}>{title3}</Text>
            </View>

            <Carousel
              width={ITEM_WIDTH}
              height={ITEM_WIDTH * (3/4.5)} // Adjust aspect ratio as needed
              data={collection3}
              renderItem={({ item }) => <WorkerCard data={item} />}
              isRTL={true} // Right-to-left layout
              mode="parallax"
              parallaxScrollingOffset={50} // Default is 100; tweak for speed
              parallaxScrollingScale={0.9} // Scale of inactive items (0.8-1.0)
              style={{ width: "100%" }}
              // Ensure full container width
              panGestureHandlerProps={{
                activeOffsetX: [-10, 10], // Horizontal swipe sensitivity
                activeOffsetY: [-1000, 1000], // Allow vertical scroll (large values prioritize parent scroll)
              }}
            />

            
          </View>

          

            <BaseErrorModal
              visible={errorModalVisible}
              onGoBack={() => navigation.goBack()}
              onRefresh={() => {
                setErrorModalVisible(false);
                loadData();
              }}
            />
          {/* <ScrollView
            // contentOffset={{x: 290}}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={false}>
            {renderRealstates()}
          </ScrollView> */}
        </NativeBaseProvider>
      );
    }
  };

  const Sidebar = () => {
    navigation.navigate('ControlPanel');
  };

  const realstateRegister = () => {
    AsyncStorage.getItem('id_token').then(token => {
      if (token == null) {
        navigation.navigate('Rlogin');
      } else {
        navigation.navigate('RDashborad');
      }
    });
  };

  const newWorker = () => {
    console.log('new worker is pressed');
    AsyncStorage.getItem('id_token').then(token => {
      if (token == null) {
        navigation.navigate('Rlogin');
      } else {
        navigation.navigate('NewWorker');
      }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#b92a31" barStyle="light-content" />
      {/* <StatusBar backgroundColor="#efa433" barStyle="light-content" /> */}
      {/* <StatusBar translucent backgroundColor="transparent"  barStyle="light-content" /> */}

      <ImageBackground
        style={styles.headerBackground}
        source={require('./assets/ajur_search_banner.jpg')}>
        {/* <View style={styles.headerButtonsWrapper}>
          <Button variant="unstyled" style={styles.headerButton}>
            <Icon
              variant="subtle"
              name="ios-home-outline"
              style={styles.headerIcon}
              onPress={() => realstateRegister()}
            />
          </Button>

          <Button variant="unstyled" style={styles.headerButton}>
            <Icon
              name="ios-person-outline"
              style={styles.headerIcon}
              onPress={() => Sidebar()}
            />
          </Button>
        </View> */}
      </ImageBackground>

      {renderOrSpinner()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },

  header: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    height: Dimensions.get('window').height / 5,
  },

  headerBackground: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 5,
  },
  headerIcon: {
    color: '#555',
    backgroundColor: '#f9f9f9',
    fontSize: 30,
    borderRadius: 15,
    margin: 15,
    padding: 10,
  },
  headerTtitle: {
    color: '#666',
    textAlign: 'center',
    fontFamily: 'iransans',
  },
  wraper: {
    // marginTop: -100,
  },
  ads: {
    backgroundColor: '#444',
    height: 200,
    width: 300,
    borderRadius: 10,
    margin: 10,
  },
  adsImage: {
    height: 150,
    width: 300,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  item: {
    // backgroundColor: '#aa6047',
    backgroundColor: '#b92a31',

    height: 100,
    width: 140,
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {width: 10, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },

  itemAllCategory: {
    backgroundColor: '#75ce52',
    height: 100,
    width: 140,
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {width: 10, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  itemText: {
    textAlign: 'center',
    color: '#e9e9e9',
    margin: 1,
    fontSize: 18,
    fontFamily: 'yekan',
  },

  collecionText: {
    textAlign: 'center',
    color: '#888',
    margin: 1,
    fontSize: 14,
    fontFamily: 'yekan',
  },
  ItemIcon: {
    height: 40,
    width: 40,
    borderWidth: 3,
    borderColor: 'white',
    margin: 10,
  },

  ItemRightContainer: {
    flex: 3,
    justifyContent: 'space-around',
    fontFamily: 'iransans',
  },

  ItemRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontFamily: 'iransans',
    width: 160,
  },

  ItemLeft: {
    flex: 2,
    height: '100%',

    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  categoryItem: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    height: 110,
    width: 270,
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {width: 10, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    fontFamily: 'iransans',
  },
  ViewRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  scrollViewTitleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
    
  },
  scrollViewAllTitle: {
    color: '#444',
    // fontFamily: 'iransans',
    fontFamily:'yekan'
  },
  scrollViewTitle: {
    color: '#444',
    // fontFamily: 'iransans',
    fontFamily:'yekan',
    fontSize: 18,
  },
  scrollViewAddTitle: {
    color: '#f4f4f4',
    fontFamily: 'iransans',
    padding: 5,
  },
  scrollViewButton: {
    borderColor: 'gray',
    borderWidth: 2,
    padding: 5,
    borderRadius: 5,
    color: '#f9f9f9',
    fontFamily: 'iransans',
  },
  spinnerView: {
    flex: 1,
    height: 500,
    justifyContent: 'center',
    alignItems: 'center',
  },

  spinner: {},

  headerButtonsWrapper: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
  },

  rtlContainer: {
    direction: 'rtl', // This is the key property
  },
  rtlContent: {
    flexDirection: 'row-reverse',
  },
});

export default Base;
