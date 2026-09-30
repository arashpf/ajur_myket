import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  StyleSheet,
  Text,
} from 'react-native';
import GuideOverlay from '../SettingGuideOverlay';

import {
  Box,
  Center,
  Button,
  Avatar,
  Image,
  Actionsheet,
  useToast,
  HStack,
} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Spinner from 'react-native-spinkit';
import ImagePicker from 'react-native-image-crop-picker';
import * as Progress from 'react-native-progress';
import MapView, {
  Marker,
  ProviderPropType,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.001;
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

const Setting = ({navigation}) => {
  const toast = useToast();

  const [loading, set_loading] = useState(true);
  const [data, set_data] = useState([]);
  const [realstateImage, set_realstateImage] = useState('');
  const [percent, set_percent] = useState(10);

  const [profileImage, set_profileImage] = useState(false);
  const [uploadClicked, set_uploadClicked] = useState(false);
  const [imagesPicked, set_imagesPicked] = useState(false);
  const [token, set_token] = useState(null);

  useEffect(() => {
    console.log('log form setting component useEffect');

    AsyncStorage.getItem('id_token').then(token => {
      set_token(token);



      axios({
        method: 'get',
        url: 'https://api.ajur.app/api/get-user',
        params: {
          token: token,
        },
      }).then(function (response) {

        set_data(response.data.user);
        set_profileImage(response.data.user.profile_url);
        set_realstateImage(response.data.user.realstate_url);
        set_loading(false);

        if (response.data.user.realstate_lat == 0.0) {


          toast.show({
            render: () => {
              return (
                <Box bg="orange.700" px="15" py="3" rounded="md" mb={5}>
                  <Text style={{color: 'white', fontSize: 20}}>
                    محل دقیق مشاور املاک را مشخص کنید
                  </Text>
                </Box>
              );
            },
          });
        }
      });
    });
  }, []);

  const pickProfile = () => {

    ImagePicker.openPicker({
      cropping: true,
      width: 840,
      height: 840,
      waitAnimationEnd: false,
      includeExif: true,
      compressImageMaxWidth: 840,
      compressImageMaxHeight: 840,
      compressImageQuality: 1,
    })
      .then(image => {

        var imager = [];
        imager.mime = image.mime;

        imager.uri = image.path;

        imager.height = 840;

        imager.width = 840;

        set_uploadClicked('picked');
        set_imagesPicked(true);
        set_profileImage(image.path);

        //upload the profile photo to server
        AsyncStorage.getItem('id_token').then(token => {


          var photos = profileImage;

          var data1 = new FormData();

          var datess = new Date();
          var n = datess.toString();
          var RandomNumber = Math.floor(Math.random() * 1000000);

          var str = n
            .replace(/\s+/g, '-')
            .toLowerCase()
            .concat(RandomNumber)
            .concat('.jpg');

          const newFile = {
            uri: image.path,
            name: str,
            type: image.mime,
          };



          data1.append('upload[]', newFile);
          console.log('the data1 is:');
          console.log(data1);

          axios({
            method: 'post',
            url: 'https://api.ajur.app/api/post-profile-images',
            data: data1,
            timeout: 1000 * 30, // Wait for 35 seconds
            params: {
              token: token,
            },

          })
            .then(response => {


              if (response.data.status == '200') {
                toast.show({
                  render: () => {
                    return (
                      <Box bg="green.700" px="15" py="3" rounded="md" mb={5}>
                        <Text style={{color: 'white', fontSize: 20}}>
                          عکس شما با موفقیت بارگزاری شد
                        </Text>
                      </Box>
                    );
                  },
                });
              } else if (response.data.status == '202') {
                toast.show({
                  render: () => {
                    return (
                      <Box bg="red.700" px="15" py="3" rounded="md" mb={5}>
                        <Text style={{color: 'white', fontSize: 20}}>
                          متاسفانه مشکلی پیش آمده
                        </Text>
                      </Box>
                    );
                  },
                });
              } else {
                toast.show({
                  render: () => {
                    return (
                      <Box bg="red.700" px="15" py="3" rounded="md" mb={5}>
                        <Text style={{color: 'white', fontSize: 20}}>
                          error 500
                        </Text>
                      </Box>
                    );
                  },
                });
              }
            })
            .catch(e => {

              console.log(e);
              throw handler(e);
              toast.show({
                render: () => {
                  return (
                    <Box bg="orange.700" px="15" py="3" rounded="md" mb={5}>
                      <Text style={{color: 'white', fontSize: 20}}>
                        sorry!!!
                      </Text>
                    </Box>
                  );
                },
              });


            });
        });

        // end of upload profile photo to server

      })
      .catch(e => alert('something wrong in getting token'));
  };

  //end of uploading user profile picture

  //upload  realstate  photo

  const pickRealstateImage = () => {
    ImagePicker.openPicker({
      cropping: true,
      width: 840,
      height: 600,
      waitAnimationEnd: false,
      includeExif: true,
      compressImageMaxWidth: 840,
      compressImageMaxHeight: 600,
      compressImageQuality: 1,
    })
      .then(image => {
        var imager = [];
        imager.mime = image.mime;

        imager.uri = image.path;

        imager.height = 600;

        imager.width = 640;
        set_uploadClicked('picked');
        set_imagesPicked(true);
        set_realstateImage(image.path);

        //upload the profile photo to server
        AsyncStorage.getItem('id_token').then(token => {



          var photos = profileImage;
          var data1 = new FormData();

          var datess = new Date();
          var n = datess.toString();
          var RandomNumber = Math.floor(Math.random() * 1000000);

          var str = n
            .replace(/\s+/g, '-')
            .toLowerCase()
            .concat(RandomNumber)
            .concat('.jpg');

          const newFile = {
            uri: image.path,
            name: str,
            type: image.mime,
          };



          data1.append('upload[]', newFile);



          axios({
            method: 'post',
            url: 'https://api.ajur.app/api/post-realstate-images',
            timeout: 1000 * 30, // Wait for 35 seconds
            params: {
              token: token,
            },
            data: data1,
          })
            .then(response => {


              if (response.data.status == '200') {
                toast.show({
                  render: () => {
                    return (
                      <Box bg="green.700" px="15" py="3" rounded="md" mb={5}>
                        <Text style={{color: 'white', fontSize: 20}}>
                          عکس شما با موفقیت بارگزاری شد
                        </Text>
                      </Box>
                    );
                  },
                });
              } else if (response.data.status == '202') {
                toast.show({
                  render: () => {
                    return (
                      <Box bg="red.700" px="15" py="3" rounded="md" mb={5}>
                        <Text style={{color: 'white', fontSize: 20}}>
                          متاسفانه مشکلی پیش آمده
                        </Text>
                      </Box>
                    );
                  },
                });
              } else {
                toast.show({
                  render: () => {
                    return (
                      <Box bg="red.700" px="15" py="3" rounded="md" mb={5}>
                        <Text style={{color: 'white', fontSize: 20}}>
                          server error 500
                        </Text>
                      </Box>
                    );
                  },
                });
              }
            })
            .catch(e => {


              toast.show({
                render: () => {
                  return (
                    <Box bg="blue.700" px="15" py="3" rounded="md" mb={5}>
                      <Text style={{color: 'white', fontSize: 20}}>sorry</Text>
                    </Box>
                  );
                },
              });


            });
        });

        // end of upload profile photo to server

      })
      .catch(e => alert(e));
  };

  const renderRealstateStars = realstate => {
    if (realstate.stars == 1) {
      return (
        <View style={styles.star_wrapper}>
          <Icon style={{color: 'gold', fontSize: 20}} name="ios-star" />
          <Icon
            style={{color: 'silver', fontSize: 20}}
            name="ios-star-outline"
          />
          <Icon
            style={{color: 'silver', fontSize: 20}}
            name="ios-star-outline"
          />
          <Icon
            style={{color: 'silver', fontSize: 20}}
            name="ios-star-outline"
          />
          <Icon
            style={{color: 'silver', fontSize: 20}}
            name="ios-star-outline"
          />
        </View>
      );
    } else if (realstate.stars == 2) {
      return (
        <View style={styles.star_wrapper}>
          <Icon style={{color: 'gold', fontSize: 20}} name="ios-star" />
          <Icon style={{color: 'gold', fontSize: 20}} name="ios-star" />
          <Icon
            style={{color: 'silver', fontSize: 20}}
            name="ios-star-outline"
          />
          <Icon
            style={{color: 'silver', fontSize: 20}}
            name="ios-star-outline"
          />
          <Icon
            style={{color: 'silver', fontSize: 20}}
            name="ios-star-outline"
          />
        </View>
      );
    } else if (realstate.stars == 3) {
      return (
        <View style={styles.star_wrapper}>
          <Icon style={{color: 'gold', fontSize: 20}} name="ios-star" />
          <Icon style={{color: 'gold', fontSize: 20}} name="ios-star" />
          <Icon style={{color: 'gold', fontSize: 20}} name="ios-star" />
          <Icon
            style={{color: 'silver', fontSize: 20}}
            name="ios-star-outline"
          />
          <Icon
            style={{color: 'silver', fontSize: 20}}
            name="ios-star-outline"
          />
        </View>
      );
    } else if (realstate.stars == 4) {
      return (
        <View style={styles.star_wrapper}>
          <Icon style={{color: 'gold', fontSize: 20}} name="ios-star" />
          <Icon style={{color: 'gold', fontSize: 20}} name="ios-star" />
          <Icon style={{color: 'gold', fontSize: 20}} name="ios-star" />
          <Icon style={{color: 'gold', fontSize: 20}} name="ios-star" />
          <Icon
            style={{color: 'silver', fontSize: 20}}
            name="ios-star-outline"
          />
        </View>
      );
    } else if (realstate.stars == 5) {
      return (
        <View style={styles.star_wrapper}>
          <Icon style={{color: 'gold', fontSize: 20}} name="ios-star" />
          <Icon style={{color: 'gold', fontSize: 20}} name="ios-star" />
          <Icon style={{color: 'gold', fontSize: 20}} name="ios-star" />
          <Icon style={{color: 'gold', fontSize: 20}} name="ios-star" />
          <Icon style={{color: 'gold', fontSize: 20}} name="ios-star" />
        </View>
      );
    } else {
    }
  };

  const EditRealstate = () => {
    navigation.navigate('EditRealstate', {
      userId: data.id,
    });
  };

  function AppBar() {
    return (
      <>
        <Box safeAreaTop bg="violet.600" />
        <HStack
          bg="orange.600"
          px="5"
          py="3"
          justifyContent="space-between"
          alignItems="center"
          w="100%"
          maxW="100%">
          <HStack alignItems="center">
            <Text color="white" fontSize="15" fontWeight="bold">
              <Icon
                onPress={() => navigation.pop()}
                style={{color: '#111', fontSize: 24}}
                name="arrow-back"
              />
            </Text>
          </HStack>
          <Icon
            name="ios-create-outline"
            style={styles.headerIcon}
            onPress={() => EditRealstate()}
          />
        </HStack>
      </>
    );
  }

  const renderStatus = () => {
    if (data.status == 2) {
      return (
        <View
          style={{
            padding: 10,
            margin: 20,
            backgroundColor: 'white',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={{color: 'blue'}}>در حال برسی </Text>
          <Text>وضعیت</Text>
        </View>
      );
    } else if (data.status == 1) {
      return (
        <View
          style={{
            padding: 10,
            margin: 20,
            backgroundColor: 'white',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={{color: 'green'}}>فعال</Text>
          <Text>وضعیت</Text>
        </View>
      );
    } else {
      return (
        <View
          style={{
            padding: 10,
            margin: 20,
            backgroundColor: 'white',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={{color: 'red'}}>رد شده</Text>
          <Text>وضعیت</Text>
        </View>
      );
    }
  };

  const renderSpinnerOrContent = () => {
    if (loading == true) {
      return (
        <View style={styles.spinnerView}>
          <Spinner
            style={styles.spinner}
            isVisible={true}
            size={30} type='Circle' color='#b92a31'
          />
        </View>
      );
    } else {
      return (
        <View>
          <AppBar />

          <Box>
            <View
              style={{
                padding: 10,
                margin: 20,
                backgroundColor: 'white',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity onPress={() => pickProfile()}>
                <Avatar size={100} source={{uri: profileImage}} />
              </TouchableOpacity>

              <View>
                <Text style={{}}>{data.realstate}</Text>
                <Text style={{}} note>
                  {data.name} {data.family}
                </Text>
              </View>
            </View>
            <View>{renderRealstateStars(data)}</View>

            {renderStatus()}
          </Box>
          <Box>
            <TouchableOpacity onPress={() => pickRealstateImage()}>
              <Image source={{uri: realstateImage}} style={styles.bigimage} />
            </TouchableOpacity>

            <View style={{padding: 10, margin: 20, backgroundColor: 'white'}}>
              <Text style={{textAlign: 'center'}}>{data.description}</Text>
            </View>
          </Box>

          {/* <Text note style={{textAlign: 'right', margin: 20}}>
            موقعیت املاک روی نقشه
          </Text> */}

          {/* <Box style={{backgroundColor: '#303030', minHeight: 200}}>
            <MapView
              mapType="standard"
              scrollEnabled={false}
              // ref={mapView => {
              //   _mapView = mapView;
              // }}
              provider={PROVIDER_GOOGLE}
              showsUserLocation={true}
              style={styles.map}
              initialRegion={{
                latitude: Number(data.realstate_lat),
                longitude: Number(data.realstate_long),
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
                coordinate={{
                  latitude: parseFloat(data.realstate_lat),
                  longitude: parseFloat(data.realstate_long),
                }}
                centerOffset={{x: 0, y: 0}}
                anchor={{x: 1, y: 1}}
                pinColor="red">
                <View style={{padding: 10}}>
                  <Image
                    style={{width: 40, height: 40, padding: 10}}
                    source={markerImages['gps']}
                  />
                </View>
              </Marker>
            </MapView>
          </Box> */}
          <Box>
            
          </Box>
          <GuideOverlay />
        </View>
      );
    }
  };

  //end of uploading realstate photo
  return <ScrollView>{renderSpinnerOrContent()}</ScrollView>;
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
  container: {
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#222',
    height: 50,
  },
  headerIcon: {
    color: '#555',
    fontSize: 30,
  },
  headerTtitle: {
    color: '#666',
    textAlign: 'center',
    fontFamily: 'IRAN Sans',
    width: Dimensions.get('window').width / 1.5,
  },

  list: {
    flex: 1,
  },

  spinnerView: {
    flex: 1,
    height: 430,
    justifyContent: 'center',
    alignItems: 'center',
  },

  spinner: {},

  bigimage: {
    width: 840 / 2,
    height: 600 / 2,
  },
  star_wrapper: {
    flexDirection: 'row',
    paddingLeft: 20,
    textAlign: 'center',
    justifyContent: 'center',
  },
});

export default Setting;
