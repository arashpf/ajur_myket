import React, {useState, useEffect, useRef} from 'react';
import {
  Linking,
  Platform,
  TouchableOpacity,
  View,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  ToastAndroid,
  Share,
  ActivityIndicator,
} from 'react-native';
import {
  NativeBaseProvider,
  Container,
  Header,
  Center,
  StatusBar,
  Box,
  HStack,
  VStack,
  Avatar,
  IconButton,
  Fab,
  Text,
  Button,
  Footer,
  FooterTab,
  Title,
} from 'native-base';
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {phonecall, text, web} from 'react-native-communications';
import Swiper from 'react-native-swiper';
import Spinner from 'react-native-spinkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Modal from 'react-native-modal';
import {Actions} from 'react-native-router-flux';
import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from 'react-native-vector-icons/Ionicons';
import WorkerDetails from '../parts/WorkerDetails';
import WorkerMedia from '../parts/WorkerMedia';
import RealEstateCard from '../cards/RealEstateCard';
import FooterContact from '../parts/FooterContact';

import WorkerErrorModal from './parts/WorkerErrorModal';
import WorkerCard from '../cards/WorkerCard';
import Report from './report';
import MapView, {
  Marker,
  Polyline,
  ProviderPropType,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import Video from '../parts/Video';
import {background} from 'native-base/lib/typescript/theme/styled-system';

import moment from 'moment';
import 'moment/locale/fa';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0032;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const markerImages = {
  gps: require('../assets/gps.png'),
  repair: require('../assets/gps.png'),
  home: require('../assets/gps.png'),
  office: require('../assets/gps.png'),
  inductry: require('../assets/gps.png'),
  land: require('../assets/gps.png'),
  sport: require('../assets/gps.png'),
  vacations: require('../assets/gps.png'),
  wedding: require('../assets/gps.png'),
};

const WorkerSingle = ({route, navigation}) => {
  const {itemId} = route.params;
  const scrollRef = useRef(null);

  const [name, set_name] = useState(null);
  const [details, set_details] = useState([]);
  const [description, set_description] = useState(null);
  const [catname, set_catname] = useState(null);
  const [category, set_category] = useState(false);
  const [workers, set_workers] = useState([]);
  const [pictures, set_pictures] = useState([]);
  const [relateds, set_relateds] = useState([]);
  const [realstate, set_realstate] = useState([]);
  const [videos, set_videos] = useState([]);
  const [virtual_tours, set_virtual_tours] = useState([]);
  const [properties, set_properties] = useState([]);
  const [token, set_token] = useState(null);
  const [isModalVisible, set_isModalVisible] = useState(false);
  const [fullscreenurl, set_fullscreenurl] = useState('');
  const [isfavorite, set_isfavorite] = useState('off');
  const [nopicture, set_nopicture] = useState('false');
  const [loading, set_loading] = useState('true');

  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const [is_privated, set_is_privated] = useState(0);
  const [lat, set_lat] = useState(55.22);
  const [long, set_long] = useState(33.11);
  const [worker_count, set_worker_count] = useState(null);
  const [activeFabLeft, set_activeFabLeft] = useState(false);
  const [activeFabRight, set_activeFabRight] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = () => {
    set_name(null);
    set_details([]);
    set_description(null);
    set_catname(null);
    set_category(false);
    set_workers([]);
    set_pictures([]);
    set_virtual_tours([]);
    set_relateds([]);
    set_realstate([]);
    set_videos([]);
    set_properties([]);
    set_isModalVisible(false);
    set_fullscreenurl('');
    set_isfavorite('off');
    set_nopicture('false');
    set_loading('true');
    set_is_privated(0);
    set_lat(55.22);
    set_long(33.11);
    set_worker_count(null);
    set_activeFabLeft(false);
    set_activeFabRight(false);
    setScrollEnabled(false);

    AsyncStorage.getItem('id_token').then(token => {
      set_token(token);

      var baseurl = 'https://api.ajur.app/api/single-worker';

      axios({
        method: 'get',
        url: baseurl,
        params: {
          worker_id: itemId,
        },
      })
        .then(function (response) {
          if (response.data.status == 200) {
            if (response.data.images.length == 0) {
              set_nopicture('true');
            }

            set_relateds(response.data.relateds);
            set_realstate(response.data.realstate);
            set_pictures(response.data.images);
            set_videos(response.data.videos);
            console.log('the virtual tour is ');
            console.log(response.data.virtual_tours);

            set_virtual_tours(response.data.virtual_tours);
            set_properties(response.data.properties);
            set_details(response.data.details);
            set_lat(response.data.details.lat);
            set_long(response.data.details.long);
            set_loading('false');
          } else if (response.data.status == 300) {
            ToastAndroid.showWithGravityAndOffset(
              'فایل پاک شده است',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          } else {
            ToastAndroid.showWithGravityAndOffset(
              'مشکلی پیش آمده ، لطفا مجددا امتحان کنید',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          }
        })
        .catch(function (error) {
          console.log(error + 'in catch axios');
          set_loading(false);

          setErrorModalVisible(true);
        });

      const productToBeSaved = itemId;
      AsyncStorage.getItem('products').then(existingProducts => {
        let newProduct = JSON.parse(existingProducts) || [];
        if (newProduct.length > 20) {
          newProduct = newProduct.slice(newProduct.length - 20);
        }
        const filterProduct = newProduct.filter(
          item => item !== productToBeSaved,
        );
        filterProduct.push(productToBeSaved);

        AsyncStorage.setItem('products', JSON.stringify(filterProduct));
      });

      AsyncStorage.getItem('favorited').then(existingProducts => {
        let newProduct = JSON.parse(existingProducts) || [];
        const isFavorite = newProduct.includes(productToBeSaved);
        if (isFavorite) {
          set_isfavorite('on');
        }
      });
    });
  };

  useEffect(() => {
    loadData();
  }, [itemId]);

  useFocusEffect(
    React.useCallback(() => {
      scrollRef.current?.scrollTo({y: 0, animated: true});
    }, []),
  );

  const fetchWorkerAgain = () => {
    set_loading('true');
    alert('fetch worker again');
  };

  const isValidCoordinate = coord => {
    return !isNaN(coord) && isFinite(coord) && Math.abs(coord) <= 90;
  };

  const handleShare = async () => {
    try {
      const propertyUrl = `https://ajur.app/worker/${itemId}`;

      const shareOptions = {
        title: 'اشتراک گذاری ملک',
        message: details.description || '',
        url: propertyUrl,
      };

      if (Platform.OS === 'android') {
        await Share.share({
          title: shareOptions.title,
          message: `${shareOptions.message}\n\n${shareOptions.url}`,
        });
      } else {
        await Share.share(shareOptions);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      ToastAndroid.show('خطا در اشتراک گذاری', ToastAndroid.SHORT);
    }
  };

  const renderShareButton = () => (
    <IconButton
      icon={<Icon size={22} name="share-social" />}
      colorScheme="blue"
      onPress={handleShare}
      mr={2}
    />
  );

  const onPressingTag = () => {
    if (isfavorite == 'on') {
      ToastAndroid.show(
        'آگهی از لیست  پسند شده ها  پاک شد',
        ToastAndroid.SHORT,
      );

      set_isfavorite('off');

      const productToBeSaved = itemId;
      AsyncStorage.getItem('favorited').then(existingProducts => {
        let newProduct = JSON.parse(existingProducts);
        if (!newProduct) {
          newProduct = [];
        }

        let length = newProduct.length;

        if (length > 20) {
          newProduct = newProduct.slice(length - 20, length);
        }
        filterProduct = newProduct.filter(function (item) {
          return item !== productToBeSaved;
        });

        console.log('favorite list is :');
        console.log(filterProduct);

        AsyncStorage.setItem('favorited', JSON.stringify(filterProduct))
          .then(() => {
            console.log('It was un bookmarded successfully');
          })
          .catch(() => {
            console.log('There was an error saving the product');
          });
      });
    } else {
      set_isfavorite('on');
      ToastAndroid.show('آگهی به لیست  پسند ها اضافه شد', ToastAndroid.SHORT);

      const productToBeSaved = itemId;
      AsyncStorage.getItem('favorited').then(existingProducts => {
        let newProduct = JSON.parse(existingProducts);
        if (!newProduct) {
          newProduct = [];
        }

        let length = newProduct.length;

        if (length > 20) {
          newProduct = newProduct.slice(length - 20, length);
        }
        filterProduct = newProduct.filter(function (item) {
          return item !== productToBeSaved;
        });
        filterProduct.push(productToBeSaved);

        console.log('favorite list is :');
        console.log(filterProduct);

        AsyncStorage.setItem('favorited', JSON.stringify(filterProduct))
          .then(() => {
            console.log('It was saved successfully');
          })
          .catch(() => {
            console.log('There was an error saving the product');
          });
      });
    }
  };

  const renderfavoritetag = () => {
    if (isfavorite == 'on') {
      return (
        <Button variant="Unstyled" onPress={() => onPressingTag()}>
          <Icon size={22} style={{color: 'red'}} name="heart" />
        </Button>
      );
    } else if (isfavorite == 'off') {
      return (
        <Button variant="Unstyled" onPress={() => onPressingTag()}>
          <Icon size={20} style={{color: 'black'}} name="heart-outline" />
        </Button>
      );
    } else {
      return (
        <Button onPress={() => onPressingTag()}>
          <Icon name="md-bookmark" />
        </Button>
      );
    }
  };

  const renderRealstateCard = () => {
    if (realstate) {
      return <RealEstateCard realstate={realstate} circle_size={140} />;
    }
  };

  const kindOfProperties = pro => {
    if (pro.type == 1) {
      return <Text style={{fontFamily: 'iransans'}}>{pro.value} </Text>;
    } else if (pro.type == 2) {
      if (pro.value == 0) {
        return <Icon style={{color: 'gray'}} name="md-close" />;
      } else {
        return <Icon style={{color: 'gray'}} name="md-checkmark" />;
      }
    } else if (pro.type == 3) {
      return <Text style={{fontFamily: 'iransans'}}>{pro.value} </Text>;
    }
  };

  const renderProperties = () => {
    return properties.map(pro => (
      <View
        key={pro.id}
        style={{
          borderBottomColor: 'blue',
          borderBottomWidth: 10,
          marginBottom: 10,
        }}>
        <View>{kindOfProperties(pro)}</View>
        <View>
          <Text style={{fontFamily: 'iransans'}}>{pro.key}</Text>
        </View>
      </View>
    ));
  };

  const renderRelatedItems = () => {
    return relateds.map(worker => <WorkerCard data={worker} />);
  };

  const renderRelatedWorkers = () => {
    return (
      <View>
        <View>
          <Text style={styles.title}>موارد مشابه</Text>
        </View>
        <View>
          {renderRelatedItems()}
        </View>
      </View>
    );
  };

  const clickSingleImage = picture => {
    let fullscreenurl = picture.url;

    set_fullscreenurl(fullscreenurl);
    set_isModalVisible(true);
  };

  const onBackdropPressed = () => {
    set_isModalVisible(false);
  };


  const formatLastUpdate = () => {
    if (!details.updated_at) return null;
    moment.locale('fa');
    return moment(details.updated_at).fromNow();
  };

  const handleMapTouch = () => {
    if (!scrollEnabled) {
      setScrollEnabled(true);
    }

    return;
  };

  const renderPics = () => {
    if (nopicture == 'true') {
      return <></>;
    } else {
      return pictures.map((picture, index) => (
        <View key={`${picture.id}-${index}`} style={styles.slideContainer}>
          <TouchableWithoutFeedback
            onPress={() => clickSingleImage(picture)}
            style={styles.touchableArea}>
            <View style={styles.imageContainer}>
              <FastImage
                source={{
                  uri: picture.url,
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.immutable,
                  headers: {'Cache-Control': 'max-age=31536000'},
                }}
                style={styles.image}
                resizeMode={FastImage.resizeMode.cover}
                fadeDuration={200}
                onLoadStart={() => setIsLoading(true)}
                onLoadEnd={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
              />

              {isLoading && (
                <ActivityIndicator
                  style={styles.loadingIndicator}
                  size="large"
                  color="#FFFFFF"
                  animating={true}
                />
              )}
            </View>
          </TouchableWithoutFeedback>

          <View style={styles.controlsOverlay}>
            <TouchableOpacity
              onPress={() => clickSingleImage(picture)}
              style={styles.zoomButton}
              activeOpacity={0.7}>
              <Icon name="md-scan-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.imageCounter}>
              {index + 1}/{pictures.length}
            </Text>
          </View>
        </View>
      ));
    }
  };

  const goToLocation = () => {
    if (Platform.OS === 'android') {
      var lat = details.lat;
      var long = details.long;

      if(!lat || !long){
        alert('مسیر یابی برای این ملک در دسترس نیست')
        return;
      }

      var url = 'geo:' + lat + ',' + long;
      Linking.openURL(url);
    } else if (Platform.OS === 'ios') {
      var lat = details.lat;
      var long = details.long;
      var url = 'https://maps.apple.com/?ll=' + lat + ',' + long;
      console.log('this is ioooooos');
      console.log(url);
      Linking.openURL(url);
    }
  };

  const goToRealEstate = () => {
    navigation.navigate('RealEstate', {
      id: realstate.id,
    });
  };

  const goToReport = () => {
    navigation.navigate('Report');
  };

  const renderNormalOrPrivate = () => {
    if (is_privated == 1) {
      return (
        <View style={{minWidth: 550, width: Dimensions.get('window').width}}>
          <TouchableOpacity style={styles.privatecard}>
            <Icon
              name="md-lock-closed"
              style={{textAlign: 'center', fontSize: 60, color: '#444'}}
            />
            <Text
              style={{
                fontFamily: 'IRAN Sans',
                textAlign: 'center',
                paddingTop: 20,
              }}>
              این فایل خصوصی است، عکس ها ، موقعیت و اطالاعات بیشتر را از مشاور
              املاک بپرسید
            </Text>
          </TouchableOpacity>
          {renderProperties()}
        </View>
      );
    } else {
      return (
        <View style={{width: Dimensions.get('window').width}}>
          <WorkerMedia
            images={pictures}
            videos={videos}
            virtual_tours={virtual_tours}
            loading={loading === 'true'}
            worker_id={itemId}
          />

          <View>
            <View>
              <Text
                style={{
                  color: '#222',
                  textAlign: 'right',
                  marginRight: 10,
                  padding: 10,

                  fontFamily: 'iransans',
                  fontSize: 16,
                }}>
                در {details.category_name}
              </Text>
            </View>
          </View>

{/*
          <View
            style={{
              flexDirection: 'row-reverse',
              justifyContent: 'flex-start',
              alignItems: 'center',
              borderRadius: 10,
              margin: 10,
            }}>
            <Icon
              name="location-sharp"
              size={20}
              color="#ff3b30"
              style={{marginLeft: 5}}
            />

            <Text style={{fontSize: 14, fontWeight: '300', color: '#333'}}>
              {details.formatted}
            </Text>
          </View>

        
          <View>
            <View style={{backgroundColor: '#303030', minHeight: 300}}>
              {Number(lat) ? (
                <MapView
                  mapType="hybrid"
                  scrollEnabled={scrollEnabled}
                  zoomEnabled={scrollEnabled}
                  rotateEnabled={scrollEnabled}
                  pitchEnabled={scrollEnabled}
                  onTouchStart={handleMapTouch}
                  provider={PROVIDER_GOOGLE}
                  style={styles.map}
                  initialRegion={{
                    latitude: Number(lat),
                    longitude: Number(long),
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                  }}>
                  <Marker
                    onPress={() => goToLocation()}
                    coordinate={{
                      latitude: parseFloat(lat),
                      longitude: parseFloat(long),
                    }}
                    centerOffset={{x: -42, y: -60}}
                    anchor={{x: 0.84, y: 1}}
                    pinColor="red">
                    <View style={{padding: 10}}>
                      <Image
                        style={{width: 40, height: 40, padding: 10}}
                        source={markerImages['gps']}
                      />
                    </View>
                  </Marker>
                </MapView>
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 300,
                    backgroundColor: '#f0f0f0',
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: 'iransans',
                      color: '#555',
                    }}>
                    متاسفانه نقشه برای این فایل با مشکل مواجه است
                  </Text>
                </View>
              )}

              <TouchableOpacity
                onPress={() => goToLocation()}
                style={{
                  backgroundColor: 'rgb(250,250,250)',
                  position: 'absolute',
                  bottom: 10,
                  height: 35,
                  width: 100,
                  borderRadius: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  elevation: 2,
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 1},
                  shadowOpacity: 0.2,
                  shadowRadius: 1,
                }}>
                <Text style={{fontFamily: 'iransans', color: '#333', fontWeight: '500'}}>مسیریابی</Text>
              </TouchableOpacity>
            </View>
          </View>
           */}

                     {/* Add Date and Time section */}
{details.updated_at && (
  <View style={styles.dateTimeContainer}>
    
    <Text style={styles.dateTimeText}>
    {' '}   آخرین بروزرسانی: {formatLastUpdate()} 
    </Text>
    <Icon name="time-outline" size={18} color="#333" />
  </View>
)}

          <WorkerDetails
            details={details}
            properties={properties}
            realstate={realstate}
          />

          <View>
            <Text style={styles.title}>توضیحات تکمیلی</Text>
          </View>

          <View style={styles.description}>
            <Text
              style={{
                color: '#444',
                fontSize: 17,
                textAlign: 'justify',
                writingDirection: 'rtl',
                textAlignVertical: 'top',
                fontFamily: 'iransans',
                textAlign: 'right',
              }}>
              {details.description}
            </Text>
          </View>




          <View
            style={{
              width: Dimensions.get('window').width,
            }}>
            {renderRealstateCard()}
          </View>
          <TouchableOpacity
            onPress={() => goToRealEstate()}
            style={styles.scrollViewTitleWrapper}>
            <Text style={styles.scrollViewAllTitle}>
              مشاهده همه فایل ها ({worker_count})
            </Text>
            <Text style={styles.scrollViewTitle}>
              لیست شده توسط {realstate.name} {realstate.family}
            </Text>
          </TouchableOpacity>

          {renderRelatedWorkers()}

          <TouchableOpacity onPress={() => goToReport()}>
            <Box
              w="100%"
              h="16"
              rounded="md"
              flexDirection="row"
              justifyContent="flex-end">
              <Text style={styles.reportText}>گزارش این ملک</Text>
              <Icon style={styles.reportIcon} name="md-flag-outline" />
            </Box>
          </TouchableOpacity>

          <Modal
            style={{margin: 0}}
            animationIn="fadeInUp"
            animationOut="zoomOutDown"
            isVisible={isModalVisible}
            onBackdropPress={() => onBackdropPressed()}
            onBackButtonPress={() => onBackdropPressed()}>
            <TouchableOpacity
              style={styles.close_modal_fixed}
              onPress={() => onBackdropPressed()}>
              <Text color="white" fontSize="15" fontWeight="bold">
                <Icon
                  onPress={() => onBackdropPressed()}
                  style={{color: '#111', fontSize: 24}}
                  name="ios-close"
                />
              </Text>
            </TouchableOpacity>
            <ImageViewer imageUrls={pictures} />
          </Modal>
        </View>
      );
    }
  };

  const RenderOrSpinenr = () => {
    if (loading == 'true') {
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
        <View style={{backgroundColor: 'white'}}>
          <ScrollView>
            <NativeBaseProvider>
              <Center>
                <AppBar />
              </Center>
              <Container style={{marginBottom: 100}}>
                <View>{renderNormalOrPrivate()}</View>
              </Container>
            </NativeBaseProvider>
          </ScrollView>
          <View style={styles.FooterWrapper}>
            <FooterContact realstate={realstate} details={details} />
            
            <WorkerErrorModal
              visible={errorModalVisible}
              onGoBack={() => navigation.goBack()}
              onRefresh={() => {
                setErrorModalVisible(false);
                loadData();
              }}
            />
          </View>
        </View>
      );
    }
  };

  function AppBar() {
    return (
      <>
        <StatusBar bg="#3700B3" barStyle="light-content" />
        <Box safeAreaTop bg="violet.600" />
        <HStack
          bg="white.600"
          px="5"
          py="3"
          justifyContent="space-between"
          alignItems="center"
          w="100%"
          maxW="100%">
          <HStack alignItems="center">
            <Text color="gray" fontSize="15" fontWeight="bold">
              <Icon
                onPress={() => navigation.pop()}
                style={{color: '#444', fontSize: 24}}
                name="arrow-back"
              />
            </Text>
          </HStack>
          <HStack>
            {renderfavoritetag()}
            {renderShareButton()}
          </HStack>

          <HStack>
            <Text style={styles.workerName}>{details.name}</Text>
          </HStack>
        </HStack>
      </>
    );
  }

  return (
    <ScrollView ref={scrollRef} style={styles.container}>
      {RenderOrSpinenr()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  item: {
    flex: 1,
    height: 135,
    paddingBottom: 3,
    marginLeft: 1,
    marginRight: 1,
    marginTop: 12,

    backgroundColor: '#fff',
    flexDirection: 'row',
    borderBottomColor: '#f2f2f2',
    borderStyle: 'solid',
    borderBottomWidth: 1,
  },
  list: {
    flex: 1,
    marginBottom: 100,
  },
  marker: {
    backgroundColor: 'red',
  },
  slide: {
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },

  header: {
    backgroundColor: 'orange',
    height: 50,
  },
  headerIcon: {
    color: '#f9f9f9',
    fontSize: 28,
  },
  headerTtitle: {
    color: '#f9f9f9',
    textAlign: 'center',
    fontFamily: 'IRAN Sans',
  },
  workerName: {
    fontSize: 16,
    fontFamily: 'iransans',
  },
  title: {
    margin: 20,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  description: {
    margin: 20,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 18,
    color: '#666',
  },
  relatedProductImage: {
    height: 160,
    width: Dimensions.get('window').width / 2.5,
  },
  spinnerView: {
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
  },

  spinner: {},

  wrapper: {
    height: 300,
  },

  VideoWrapper: {
    height: 300,
  },
  slide1: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  sansText: {
    fontFamily: 'IRAN Sans',
  },

  ads: {
    backgroundColor: '#444',
    height: Dimensions.get('window').height / 4,
    width: Dimensions.get('window').width,
  },

  adsImage: {
    height: Dimensions.get('window').height / 5,
    width: Dimensions.get('window').width,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  realstateheader: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    height: Dimensions.get('window').height / 15,
  },

  realstateIcon: {
    marginTop: 20,
    borderWidth: 2,
    borderColor: 'gray',
  },

  scrollViewTitleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },

  scrollViewDescriptionWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 10,
    backgroundColor: '#444',
  },

  realstateDistanceButton: {
    padding: 5,
    borderRadius: 5,
    color: '#f9f9f9',
    fontSize: 14,
  },

  scrollViewAddTitle: {
    color: '#f4f4f4',
    fontFamily: 'IRAN Sans',
    padding: 5,
  },

  scrollViewAddDescription: {
    color: '#f4f4f4',
    fontFamily: 'IRAN Sans',
    padding: 5,
  },

  privatecard: {
    textAlign: 'center',
    justifyContent: 'space-around',
    height: Dimensions.get('window').height / 5,
    padding: 30,
    margin: 10,
  },

  star_wrapper: {
    flexDirection: 'row',
    paddingLeft: 20,
  },

  close_modal_fixed: {
    backgroundColor: 'white',
    padding: 10,
    paddingLeft: 20,
  },

  scrollViewTitleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },

  scrollViewAllTitle: {
    color: 'blue',
    fontFamily: 'iransans',
  },

  scrollViewTitle: {
    color: '#666',
    fontFamily: 'iransans',
    fontSize: 18,
  },

  FooterWrapper: {
    position: 'absolute',

    bottom: 0,
    width: Dimensions.get('window').width,
  },

  reportText: {
    color: '#444',
    fontSize: 14,
    textAlign: 'right',
    paddingTop: 12,
    fontFamily: 'IRAN Sans',
  },

  reportIcon: {
    color: 'black',
    fontSize: 24,
    textAlign: 'right',
    padding: 10,
  },

  zoomIcon: {
    position: 'absolute',
    right: 1,
    bottom: 0,
    zIndex: 2,
    fontSize: 25,
    padding: 20,
    color: 'white',
  },
  zoomText: {
    position: 'absolute',
    left: 1,
    bottom: 0,
    zIndex: 2,
    fontSize: 14,
    padding: 20,
    color: 'white',
  },

  slideContainer: {
    width: Dimensions.get('window').width,
    height: 300,
    position: 'relative',
    backgroundColor: '#000',
  },
  touchableArea: {
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingIndicator: {
    position: 'absolute',
    alignSelf: 'center',
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 16,
  },
  zoomButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  imageCounter: {
    alignSelf: 'flex-end',
    color: '#FFFFFF',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    marginTop: 5,
    marginBottom: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  dateTimeText: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'iransans',
    marginLeft: 6,
  },
});

export default WorkerSingle;