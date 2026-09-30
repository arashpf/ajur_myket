import React, {useState, useEffect} from 'react';
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
import {phonecall, text, web} from 'react-native-communications';
import Swiper from 'react-native-swiper';
import Spinner from 'react-native-spinkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import Modal from 'react-native-modal';
import {Actions} from 'react-native-router-flux';
import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from 'react-native-vector-icons/Ionicons';
import WorkerDetails from '../parts/WorkerDetails';
import RealEstateCard from '../cards/RealEstateCard';
import FooterContact from '../parts/FooterContact';
import Report from './report';
import MapView, {
  Marker,
  ProviderPropType,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import Video from '../parts/Video';

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
  const { itemId } = route.params;

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
  const [properties, set_properties] = useState([]);
  const [token, set_token] = useState(null);
  const [isModalVisible, set_isModalVisible] = useState(false);
  const [fullscreenurl, set_fullscreenurl] = useState('');
  const [isfavorite, set_isfavorite] = useState('off');
  const [nopicture, set_nopicture] = useState('false');
  const [loading, set_loading] = useState('true');

  const [is_privated, set_is_privated] = useState(0);
  const [distance, set_distance] = useState(0);
  const [formatted, set_formatted] = useState('');
  const [lat, set_lat] = useState(55.22);
  const [long, set_long] = useState(33.11);
  const [userInitialLat, set_userInitialLat] = useState(null);
  const [userInitialLong, set_userInitialLong] = useState(null);
  const [worker_count, set_worker_count] = useState(null);
  const [activeFabLeft, set_activeFabLeft] = useState(false);
  const [activeFabRight, set_activeFabRight] = useState(false);



  useEffect(() => {
    //getting json data from api

    AsyncStorage.getItem('id_token').then(token => {

      console.log('the token inside the AsyncStorage in workerSingle is-==-=');
      console.log(token);

      set_token(token);

      var baseurl = 'https://api.ajur.app/api/single-worker';

      Geolocation.getCurrentPosition(
        position => {
          var userInitialLat = JSON.stringify(position.coords.latitude);
          var userInitialLong = JSON.stringify(position.coords.longitude);

          set_userInitialLat(userInitialLat);
          set_userInitialLong(userInitialLong);

          // fetching worker from api

          axios({
            method: 'get',
            url: baseurl,
            params: {
              worker_id: itemId,
              lat: userInitialLat,
              long: userInitialLong,
            },
          })
            .then(function (response) {
              console.log('realstate fetching from server is : ==================');
              console.log(response.data.realstate.worker_count);

              set_worker_count(response.data.realstate.worker_count)

              if (response.data.status == 200) {
                if (response.data.images.length == 0) {

                  set_nopicture('true');
                }

                set_relateds(response.data.relateds);
                set_realstate(response.data.realstate);
                set_pictures(response.data.images);
                set_videos(response.data.videos);
                set_properties(response.data.properties);
                set_details(response.data.details);
                set_lat(response.data.details.lat);
                set_long(response.data.details.long);
                set_loading('false');

              } else if (response.data.status == 300) {
                var message = 'فایل پاک شده است';
                // ToastAndroid.show("اتصال اینترنت را برسی کنید",ToastAndroid.LONG);
                ToastAndroid.showWithGravityAndOffset(
                  message,
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER,
                  25,
                  50,
                );

                // Actions.pop();
              } else {
                var message = 'مشکلی پیش آمده ، لطفا مجددا امتحان کنید';
                // ToastAndroid.show("اتصال اینترنت را برسی کنید",ToastAndroid.LONG);
                ToastAndroid.showWithGravityAndOffset(
                  message,
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER,
                  25,
                  50,
                );

                // Actions.pop();
              }
            })
            .catch(function (error) {
              console.log(error);
            });

          // end of fetching worker from api
        },
        error => alert(JSON.stringify(error)),
        {enableHighAccuracy: false, timeout: 200000, maximumAge: 100000},
      );

      // enf of getting data from api

      //this part related to latest worker user watch

      const productToBeSaved = itemId;
      AsyncStorage.getItem('products').then(existingProducts => {
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

        AsyncStorage.setItem('products', JSON.stringify(filterProduct))
          .then(() => {
            console.log('It was saved successfully');
          })
          .catch(() => {
            console.log('There was an error saving the product');
          });
      });

      // is worker is include in favorite list turn on the bookmark icon

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
          return item == productToBeSaved;
        });

        if (filterProduct.length > 0) {

          set_isfavorite('on');
        }
      });

      // end of related to latest worker user watch
    });

    // end of fetching json data from api
  }, []);


  const onPressingTag = () => {

  if(isfavorite == 'on'){
    ToastAndroid.show("آگهی از لیست  پسند شده ها  پاک شد",ToastAndroid.SHORT);


    set_isfavorite('off')

    const productToBeSaved =  itemId ;
AsyncStorage.getItem('favorited').then((existingProducts) => {

  let newProduct = JSON.parse(existingProducts);
  if( !newProduct ){
   newProduct = []
   }



   let length = newProduct.length;

   if(length > 20 ){
     newProduct =  newProduct.slice(length-20 , length);
   }
   filterProduct = newProduct.filter(function(item) {
       return item !== productToBeSaved
   })

   console.log('favorite list is :');
   console.log(filterProduct);

   AsyncStorage.setItem('favorited', JSON.stringify(filterProduct) )
   .then( ()=>{
   console.log('It was un bookmarded successfully')
   } )
   .catch( ()=>{
   console.log('There was an error saving the product')
   } )

});







  }else{


      set_isfavorite('on');
      ToastAndroid.show("آگهی به لیست  پسند ها اضافه شد",ToastAndroid.SHORT);

        const productToBeSaved =  itemId ;
    AsyncStorage.getItem('favorited').then((existingProducts) => {

      let newProduct = JSON.parse(existingProducts);
      if( !newProduct ){
       newProduct = []
       }



       let length = newProduct.length;

       if(length > 20 ){
         newProduct =  newProduct.slice(length-20 , length);
       }
       filterProduct = newProduct.filter(function(item) {
           return item !== productToBeSaved
       })
       filterProduct.push( productToBeSaved );

       console.log('favorite list is :');
       console.log(filterProduct);

       AsyncStorage.setItem('favorited', JSON.stringify(filterProduct) )
       .then( ()=>{
       console.log('It was saved successfully')
       } )
       .catch( ()=>{
       console.log('There was an error saving the product')
       } )

    });

  }


}

  const renderfavoritetag = () => {
    if (isfavorite == 'on') {
      return (
        <Button variant="Unstyled" onPress={() => onPressingTag()}>
          <Icon size={20} style={{color: 'black'}} name="heart" />
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
      // return null;
    }
  };




  const renderRealstateCard = () => {

    if(realstate){

      return (
        <RealEstateCard realstate={realstate} />
      )
    }


    }

const kindOfProperties = (pro) => {
    if(pro.type == 1){
      return(
          <Text style={{fontFamily: 'IRAN Sans'}}>{pro.value} </Text>
   )
    }else if(pro.type == 2){

      if(pro.value == 0) {
        return(
          <Icon style={{color: 'gray'}} name="md-close" />
        )

      }else{
        return(
          <Icon style={{color: 'gray'}} name="md-checkmark" />
        )
      }

    }else if (pro.type == 3) {
      return(
          <Text style={{fontFamily: 'IRAN Sans'}}>{pro.value} </Text>
      )
    }
  }

  const renderProperties = () => {
    return properties.map(pro => (
      <View
        key={pro.id}
        style={{
          borderBottomColor: 'gray',
          borderBottomWidth: 2,
          marginBottom: 10,
        }}>
        <View>{kindOfProperties(pro)}</View>
        <View>
          <Text style={{fontFamily: 'IRAN Sans'}}>{pro.key}</Text>
        </View>
      </View>
    ));
  };

  const renderRelatedItems = () => {
    return relateds.map(worker => (
      <TouchableOpacity
        key={worker.id}
        onPress={() => onPressingSingleWorker({worker})}>
        <Card style={styles.cardBox}>
          <View>
            <View>
              <Thumbnail source={{uri: worker.thumb}} />
            </View>

            <View>
              <Text style={{fontFamily: 'IRAN Sans'}} note>
                {worker.name}
              </Text>
              <Text style={{fontFamily: 'IRAN Sans', fontSize: 12}}>
                {worker.specialname1} {worker.specialvalue1}
              </Text>
              <Text style={{fontFamily: 'IRAN Sans'}}>
                {worker.specialname2} {worker.specialvalue2}
              </Text>
              <View></View>
            </View>
          </View>

          <View style={{height: Dimensions.get('window').height / 20}}>
            <View>
              <Button transparent>
                <Text>{worker.distance} km</Text>
              </Button>
            </View>
            <View></View>
            <View>
              <Text style={{fontFamily: 'IRAN Sans'}}>
                {' '}
                {worker.region} {worker.neighbourhood}{' '}
              </Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    ));
  };

  const rederRelatedWorkers = () => {
    return (
      <View>
        <View
          style={{
            backgroundColor: '#303030',
            textAlign: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{color: 'orange', fontFamily: 'IRAN Sans'}}>
            {' '}
            موارد مشابه{' '}
          </Text>
        </View>
        <View>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={true}
            pagingEnabled={false}>
            {renderRelatedItems()}
          </ScrollView>
        </View>
      </View>
    );
  };

  const clickSingleImage = (picture) => {


  let fullscreenurl = picture.url;


    set_fullscreenurl(fullscreenurl);
    set_isModalVisible(true);
}

const onBackdropPressed =() => {
    set_isModalVisible(false);
  }

  const renderPictures = () => {
    if (loading == 'false') {
      return renderPics();
    } else {
      return (
        // <Spinner style={styles.spinner}   size="large" />
        <View style={styles.spinnerView}>
          <Spinner
            style={styles.spinner}
            isVisible={true}
            size={40}
            type="FadingCircle"
            color="#393939"
          />
        </View>
      );
    }
  };

  const renderPics = () => {
    if (nopicture == 'true') {
      return (
        <Image
          source={require('./assets/img/noimage.jpg')}
          style={{width: Dimensions.get('window').width, height: 300}}
        />
      );
    } else {
      return pictures.map((picture, index) => (
        <>
          <Icon onPress={() => clickSingleImage(picture)}  style={styles.zoomIcon} name="md-scan-outline" />
        <Text style={styles.zoomText} >{index+1}/{pictures.length}</Text>
        <TouchableWithoutFeedback
          key={picture.id}
          onPress={() => clickSingleImage(picture)}>

          <Image
            source={{uri: picture.url}}
            style={{width: Dimensions.get('window').width, height: 300}}
          />
        </TouchableWithoutFeedback>
      </>
      ));
    }
  };

  const renderVideos = () => {
    if (1) {
      return renderVds();
    }
  };

  const renderVds = () => {
    console.log('the video count right now is ');
    console.log(videos);
    if (videos.length == 0) {
      return false;
    } else {
      return videos.map(video => (
        <TouchableWithoutFeedback key={video.id}>
          <Video video={video} />
        </TouchableWithoutFeedback>
      ));
    }
  };

  const VideoOrNot = () => {
    if(videos.length > 0){
      return(
        <>
        <Text style={styles.title} >ویدیوهای این ملک</Text>
      <Swiper style={styles.VideoWrapper} index={0} key={pictures.length}>
        {renderVideos()}
      </Swiper>
      </>

      )
    }
  }

  const goToLocation = () => {

    if(Platform.OS === 'android'){
      var lat = details.lat;
      var long = details.long;
      url ="geo:"+lat+","+long ;
       Linking.openURL(url)
     }else if (Platform.OS === 'ios'){
       var lat = details.lat;
       var long = details.long;
      url ="https://maps.apple.com/?ll="+lat+","+long;
          console.log('this is ioooooos');
          console.log(url);
           Linking.openURL(url)
    }


  }

  const goToRealEstate = () => {

    navigation.navigate('RealEstate', {
         id: realstate.id,
       })

  }

  const goToReport = () => {
    navigation.navigate('Report');
  }

  const renderNormalOrPrivate = () => {
    if (is_privated == 1) {
      return (
        <View style={{minWidth:550 ,width:Dimensions.get('window').width }}>
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
        <View style={{width:Dimensions.get('window').width }}>
          <ScrollView minimumZoomScale={1} maximumZoomScale={3} >

            <Swiper style={styles.wrapper} index={0} key={pictures.length}>
              {renderPictures()}
            </Swiper>
          </ScrollView>

          {VideoOrNot()}


          <View>


            <View>
              <Text
                style={{
                  color: '#333',
                  textAlign: 'right',
                  marginRight: 10,
                  padding:10,
                  fontWeight:'bold',

                  fontFamily: 'IRAN Sans',
                }}>
                در {details.category_name}
              </Text>
            </View>
          </View>



          <WorkerDetails details={details} properties = {properties}
              realstate = {realstate}
              />

          <View style={styles.description}>
            <Text
              style={{
                fontSize: 13,
                color: '#666',
                textAlign: 'right',

                fontFamily: 'IRAN Sans',
              }}>
            {details.formatted}
            </Text>
          </View>

          <View>
            <Text style={styles.title} >فاصله این ملک از موقعیت کنونی شما</Text>
            <Button transparent textStyle={{color: '#87838B'}}>
              <Text>{details.distance} km</Text>
            </Button>
          </View>

          <View>
            <View style={{backgroundColor: '#303030', minHeight: 200}}>
              <MapView
                mapType="satellite"
                scrollEnabled={false}
                ref={mapView => {
                  _mapView = mapView;
                }}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                style={styles.map}
                initialRegion={{
                  latitude: Number(lat),
                  longitude: Number(long),
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                }}

                // region={{
                //   latitude: Number(this.state.userLat),
                //   longitude: Number(this.state.userLong),
                //   latitudeDelta: LATITUDE_DELTA,
                //   longitudeDelta: LONGITUDE_DELTA,
                // }}
              >
                <Marker
                    onPress={() => goToLocation()}
                  coordinate={{
                    latitude: parseFloat(lat),
                    longitude: parseFloat(long),
                  }}
                  centerOffset={{x: -42, y: -60}}
                  anchor={{x: 0.84, y: 1}}
                  // image={markerImages[this.props.worker.avatar]}
                  pinColor="red">
                  <View style={{padding: 10}}>
                    <Image
                      style={{width: 40, height: 40, padding: 10}}
                      source={markerImages['gps']}
                    />
                  </View>
                </Marker>
              </MapView>
              <TouchableOpacity
                onPress={() => goToLocation()}
                style={{
                  backgroundColor: 'rgba(250,2500,250,.7)',
                  height: 25,
                  width: 100,
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}>
                <Text style={{fontFamily: 'IRAN Sans'}}>مسیریابی</Text>
              </TouchableOpacity>
            </View>
          </View>


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



          <TouchableOpacity
            onPress={() => goToRealEstate()}
            style={styles.scrollViewTitleWrapper}
            >

            <Text style={styles.scrollViewAllTitle}>
              مشاهده همه فایل ها
              (
                {worker_count}
              )


            </Text>
            <Text style={styles.scrollViewTitle}>
              مشاور املاک این آگهی
            </Text>
          </TouchableOpacity>








          <Modal
                style={{ margin: 0 }}
                animationIn='fadeInUp'
                animationOut='zoomOutDown'
                 isVisible={isModalVisible}
                 onBackdropPress= { () => onBackdropPressed()}
                 onBackButtonPress= { () => onBackdropPressed()}

                  >
                  <TouchableOpacity
                      style={styles.close_modal_fixed}
                      onPress= { () => onBackdropPressed()}
                      >
                      <Text color="white" fontSize="15" fontWeight="bold">
                        <Icon   onPress= { () => onBackdropPressed()}  style={{color:'#111',fontSize:24}} name="ios-close" />
                      </Text>
                </TouchableOpacity>
                <ImageViewer imageUrls={pictures}/>
              </Modal>
        </View>
      );
    }
  };

  const RenderOrSpinenr = () => {
    if(loading == 'true'){
      return(
        <View style={styles.spinnerView}>
          <Spinner
            style={styles.spinner}
            isVisible={true}
            size={50}
            type="Wave"
            color="#393939"
          />
        </View>
      )


    }else{
      return(
        <View>
          <ScrollView>
          <NativeBaseProvider>

            <Center>
              <AppBar />
            </Center>
              <Container>



            <View>
              {renderNormalOrPrivate()}

            </View>


            <View style={{backgroundColor:'gray',width: Dimensions.get('window').width}}>
              {renderRealstateCard()}
            </View>
              </Container>
          </NativeBaseProvider>
        </ScrollView>
        <View style={styles.FooterWrapper}>

          <FooterContact  realstate={realstate} />

        </View>
        </View>

      )

    }
  }

  function AppBar() {
  return <>
      <StatusBar bg="#3700B3" barStyle="light-content" />
      <Box safeAreaTop bg="violet.600" />
      <HStack bg="white.600" px="5" py="3" justifyContent="space-between" alignItems="center" w="100%" maxW="100%">
        <HStack alignItems="center">
          <Text color="gray" fontSize="15" fontWeight="bold">
            <Icon onPress={()=> navigation.pop()}  style={{color:'#444',fontSize:24}} name="arrow-back" />
          </Text>
        </HStack>
        {renderfavoritetag()}
        <HStack>

        <Text color="gray" fontSize="19" fontWeight="600">
          {details.name}
        </Text>
        </HStack>
      </HStack>
    </>;
}

  return (
  <View>


      {RenderOrSpinenr()}






  </View>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  marker: {
    backgroundColor: 'red',
    // marginLeft: 46,
    // marginTop: 33,
    // fontWeight: 'bold',
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
  title :{
    margin:20,
    paddingTop:10,
    paddingBottom:10,
    fontSize:16,
    color:'#666',
    fontWeight:'bold',
  },
  description: {
    margin:20,
    paddingTop:10,
    paddingBottom:10,
    fontSize:18,
    color:'#666',
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

  VideoWrapper : {
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
    paddingLeft:20
  },

  close_modal_fixed: {
    backgroundColor:'white',
    padding:10,
    paddingLeft:20
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
    position:'absolute',

    bottom: 0,
    width:Dimensions.get('window').width
  },

  reportText : {
    color:'#444',
    fontSize:14,
    textAlign:'right',
    paddingTop:12,
    fontFamily: "IRAN Sans"
  },

  reportIcon : {
    color:'black',
    // color:'silver',
    fontSize:24,
    textAlign:'right'
    ,padding:10
  },

  zoomIcon : {
     position: 'absolute',
    right:1,
    bottom:0,
    zIndex:2,
    fontSize:25,
    padding:20,
    color:'white'

  },
  zoomText : {
    position: 'absolute',
   left:1,
   bottom:0,
   zIndex:2,
   fontSize:14,
   padding:20,
   color:'white'
  }


});

export default WorkerSingle;
