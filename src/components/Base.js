import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  FlatList,
  Animated,
} from 'react-native';
import { NativeBaseProvider } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import WorkerCard from './cards/WorkerCard';
import RealEstateCard from './cards/RealEstateCard';
import BaseErrorModal from '../components/modals/BaseErrorModal';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Spinner from 'react-native-spinkit';
import NetInfo from '@react-native-community/netinfo';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = SCREEN_WIDTH * 0.80;
const ITEM_HEIGHT = ITEM_WIDTH * (3/4.5);
const ITEM_SPACING = 10;
const VISIBLE_ITEMS = 2;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const Base = ({navigation}) => {
  const [loading, set_loading] = useState(true);

  const [title1, set_title1] = useState('');
  const [title2, set_title2] = useState('');
  const [title3, set_title3] = useState('');
  const [collection1, set_collection1] = useState([]);
  const [collection2, set_collection2] = useState([]);
  const [collection3, set_collection3] = useState([]);
  const [realstates, set_realstates] = useState([]);
  const [bluetickrealstates, set_bluetickrealstates] = useState([]);
  
  const [net_connect_status, set_net_connect_status] = useState(true);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const HorizontalCarousel = ({ data, renderItem, title }) => (
    <View>
      {title && (
        <View style={styles.scrollViewTitleWrapper}>
          <Text style={styles.scrollViewTitle}>{title}</Text>
        </View>
      )}
      <AnimatedFlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH + ITEM_SPACING}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: (SCREEN_WIDTH - (ITEM_WIDTH * VISIBLE_ITEMS + ITEM_SPACING)) / 2,
        }}
        renderItem={({ item }) => (
          <View style={{ width: ITEM_WIDTH, marginRight: ITEM_SPACING }}>
            {renderItem({ item })}
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );

  const loadData = async () => {
    try {
      const response = await axios({
        method: 'get',
        url: 'https://api.ajur.app/api/base',
        params: { lat: '35.6892', long: '51.3890' }, // Tehran fallback coordinates
      });
  
      set_title1(response.data.title1);
      set_title2(response.data.title2);
      set_title3(response.data.title3);
      set_collection1(response.data.collection1);
      set_collection2(response.data.collection2);
      set_collection3(response.data.collection3);
      set_realstates(response.data.realstates);
      set_bluetickrealstates(response.data.bluetickrealstates);
      set_loading(false);
    } catch (error) {
      console.log(error);
      set_loading(false);
      setErrorModalVisible(true);
    }
  };
  


  useEffect(() => {
    const interval = setInterval(() => {
      NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          ToastAndroid.showWithGravityAndOffset(
            'اتصال اینترنت را بررسی کنید',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
            25,
            50
          );
        }
        set_net_connect_status(state.isConnected);
      });
    }, 5000);

    loadData();
    return () => clearInterval(interval);
  }, []);

  const Refresh = () => {
    set_loading(true);
    loadData();
  };

  const renderContent = () => {
    if (!net_connect_status) {
      return (
        <View style={styles.spinnerView}>
          <TouchableOpacity onPress={Refresh}>
            <Icon name="ios-refresh" style={styles.refreshIcon} />
            <Text style={styles.itemText}>تلاش مجدد</Text>
          </TouchableOpacity>
          <Image
            source={require('./assets/broken-brick.jpg')}
            style={styles.errorImage}
          />
          <Text style={styles.errorText}>اتصال خود به اینترنت را برسی کنید</Text>
        </View>
      );
    }

    if (loading) {
      return (
        <View style={styles.spinnerView}>
          <Spinner
            isVisible={true}
            size={30}
            type="Circle"
            color="#b92a31"
          />
        </View>
      );
    }

    return (
      <View style={styles.wraper}>
        <HorizontalCarousel
          data={realstates}
          renderItem={({ item }) => (
            <RealEstateCard realstate={item} circle_size={140} />
          )}
          title="بهترین مشاورین  منطقه"
        />

        <HorizontalCarousel
          data={bluetickrealstates}
          renderItem={({ item }) => (
            <RealEstateCard realstate={item} circle_size={140} />
          )}
          title=" مشاورین املاک دارای تیک آبی منطقه"
        />

        {/* <HorizontalCarousel
          data={bluetickrealstates}
          renderItem={({ item }) => (
            <RealEstateCard realstate={item} circle_size={140} />
          )}
          title="بهترین دپارتمان های منطقه"
        /> */}

          {/* <HorizontalCarousel
          data={bluetickrealstates}
          renderItem={({ item }) => (
            <RealEstateCard realstate={item} circle_size={140} />
          )}
          title="بهترین سازندگان منطقه"
        /> */}

        {/* <HorizontalCarousel
          data={collection1}
          renderItem={({ item }) => <WorkerCard data={item} />}
          title={`${title1} محدوده`}
        /> */}

        {/* <HorizontalCarousel
          data={collection2}
          renderItem={({ item }) => <WorkerCard data={item} />}
          title={`${title2} محدوده`}
        /> */}

        {/* <HorizontalCarousel
          data={collection3}
          renderItem={({ item }) => <WorkerCard data={item} />}
          title={title3}
        /> */}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#b92a31" barStyle="light-content" />
      <ImageBackground
        style={styles.headerBackground}
        source={require('./assets/ajur_search_banner.jpg')}
      />
      <NativeBaseProvider>
        {renderContent()}
        <BaseErrorModal
          visible={errorModalVisible}
          onGoBack={() => navigation.goBack()}
          onRefresh={() => {
            setErrorModalVisible(false);
            loadData();
          }}
        />
      </NativeBaseProvider>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  headerBackground: {
    width: '100%',
    height: Dimensions.get('window').height / 5,
  },
  wraper: {
    paddingBottom: 20,
  },
  scrollViewTitleWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  scrollViewTitle: {
    color: '#444',
    fontFamily: 'yekan',
    fontSize: 18,
  },
  spinnerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height * 0.6,
  },
  refreshIcon: {
    fontSize: 35,
    color: 'red',
    textAlign: 'center',
    borderRadius: 20,
  },
  itemText: {
    textAlign: 'center',
    color: '#e9e9e9',
    fontSize: 18,
    fontFamily: 'yekan',
    marginTop: 10,
  },
  errorImage: {
    height: 200,
    width: 200,
    alignSelf: 'center',
    marginVertical: 20,
  },
  errorText: {
    padding: 10,
    color: 'gray',
    textAlign: 'center',
  },
});

export default Base;