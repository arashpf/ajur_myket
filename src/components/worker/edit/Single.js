import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Text,
  StyleSheet,
  Dimensions,
  Alert
} from 'react-native';
import {
  NativeBaseProvider,
  Center,
  Box,
  HStack,
  VStack,
    Button,
    Divider,
      useToast,
} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Spinner from 'react-native-spinkit';
import AwesomeAlert from 'react-native-awesome-alerts';

const Single = ({route, navigation}) => {
  const { itemId } = route.params;
  const toast = useToast();
  const [showAlert, set_showAlert] = useState(false);

  const [total_view, set_total_view] = useState(0);
  const [status, set_status] = useState(0);

  const [name, set_name] = useState(null);
  const [details, set_details] = useState([]);
  const [chart, set_chart] = useState([]);
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
  const [loading, set_loading] = useState(true);

  const [is_privated, set_is_privated] = useState(0);
  const [distance, set_distance] = useState(0);
  const [formatted, set_formatted] = useState('');
  const [lat, set_lat] = useState(55.22);
  const [long, set_long] = useState(33.11);
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

      // fetching worker from api without geolocation
      axios({
        method: 'get',
        url: baseurl,
        params: {
          worker_id: itemId,
          // No lat/long parameters
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

            console.log('the details here is -------------------------');
            console.log(response.data.details);
            set_lat(response.data.details.lat);
            set_long(response.data.details.long);
            set_loading(false);

          } else if (response.data.status == 300) {
            var message = 'فایل پاک شده است';
            toast.show({
              render: () => {
                return <Box bg="orange.500" px="15" py="3" rounded="md" mb={5}>
                  <Text style={{color:'white',fontSize:16}}>{message}</Text>
                </Box>;
              }
            });
          } else {
            var message = 'مشکلی پیش آمده ، لطفا مجددا امتحان کنید';
            toast.show({
              render: () => {
                return <Box bg="red.500" px="15" py="3" rounded="md" mb={5}>
                  <Text style={{color:'white',fontSize:16}}>{message}</Text>
                </Box>;
              }
            });
          }
        })
        .catch(function (error) {
          console.log(error);
          toast.show({
            render: () => {
              return <Box bg="red.500" px="15" py="3" rounded="md" mb={5}>
                <Text style={{color:'white',fontSize:16}}>خطا در ارتباط با سرور</Text>
              </Box>;
            }
          });
          set_loading(false);
        });

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
        let filterProduct = newProduct.filter(function (item) {
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
        let filterProduct = newProduct.filter(function (item) {
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

  const renderStatus = () => {
    if(details.status == 1){
      return(
        <HStack>
          <View style={styles.cpanelListItem}>
            <Box
              w="100%"
              h="10"
              rounded="md"
              flexDirection="row"
              justifyContent="center"
              verticalAlign="center"
              bg="green.500">
              <Text style={{color:'white',fontSize:18}}>آگهی تایید شده است</Text>
            </Box>
          </View>
        </HStack>
      )
    } else if (details.status == 2){
      return(
        <HStack>
          <View style={styles.cpanelListItem}>
            <Box
              w="100%"
              h="10"
              rounded="md"
              flexDirection="row"
              justifyContent="center"
              verticalAlign="center"
              bg="orange.500">
              <Text style={{color:'white',fontSize:18}}>آگهی در دست بررسی</Text>
            </Box>
          </View>
        </HStack>
      )
    } else if (details.status == 3){
      return(
        <HStack>
          <View style={styles.cpanelListItem}>
            <Box
              w="100%"
              h="10"
              rounded="md"
              flexDirection="row"
              justifyContent="center"
              verticalAlign="center"
              bg="orange.500">
              <Text style={{color:'white',fontSize:18}}>آگهی در دست بررسی</Text>
            </Box>
          </View>
        </HStack>
      )
    } else if (details.status == 4){
      return(
        <HStack>
          <View style={styles.cpanelListItem}>
            <Box
              w="100%"
              h="10"
              rounded="md"
              flexDirection="row"
              justifyContent="center"
              verticalAlign="center"
              bg="red.500">
              <Text style={{color:'white',fontSize:18}}>آگهی تایید نشده است</Text>
            </Box>
          </View>
        </HStack>
      )
    } else {
      return(
        <HStack>
          <View style={styles.cpanelListItem}>
            <Box
              w="100%"
              h="10"
              rounded="md"
              flexDirection="row"
              justifyContent="center"
              verticalAlign="center"
              bg="gray.500">
              <Text style={{color:'white',fontSize:18}}>وضعیت نا مشخص آگهی!</Text>
            </Box>
          </View>
        </HStack>
      )
    }
  }

  const AppBar = () => {
    return (
      <View>
        <Box safeAreaTop bg="violet.600" />
        <HStack bg="white" px="5" py="4" justifyContent="space-between" alignItems="center" w="100%" maxW="100%">
          <HStack alignItems="center">
            <TouchableOpacity onPress={() => navigation.pop()}>
              <Icon style={{color:'#444',fontSize:24}} name="arrow-back" />
            </TouchableOpacity>
          </HStack>

          <HStack>
            <Text color="gray" fontSize="19" fontWeight="600">
              {details.name || 'فایل'}
            </Text>
          </HStack>

          <View style={{width: 24}} />
        </HStack>
      </View>
    );
  }

  const showingAlert = () => {
    console.log('showing alert is clicked');
    set_showAlert(true);
  };

  const hideAlert = () => {
    set_showAlert(false);
  };

  const renderSingleChart = () => {
    navigation.navigate('SingleChart', {
      itemId: itemId,
    });
  }

  const renderSingleWorker = () => {
    navigation.navigate('WorkerSingle', {
      itemId: itemId,
    });
  }

  const renderEditWorker = () => {

    

    navigation.navigate('NewWorker', { 
      mode: 'edit', 
      propertyId: itemId  // ← this is the worker_id
    });

    // console.log('render edit section please!');
    // navigation.navigate('EditWorker', {
    //   catId: details.category_id, 
    //   catName: details.category_name,
    //   details,
    //   old_images: pictures,
    //   old_videos: videos,
    //   itemId: itemId,
    // });
  }

  const onPressDestroy = () => {
    set_loading(true);

    AsyncStorage.getItem('id_token').then((token) => {
      axios({
        method: 'get',
        url: 'https://api.ajur.app/api/destroy-worker',
        params: {
          token: token,
          workerid: itemId,
        },
      }).then((response) => {
        set_loading(false);
        toast.show({
          render: () => {
            return <Box bg="green.700" px="15" py="3" rounded="md" mb={5}>
              <Text style={{color:'white',fontSize:16}}>آگهی شما حذف شد</Text>
            </Box>;
          }
        });
        navigation.popToTop();
      })
      .catch((error) => {
        console.log(error);
        toast.show({
          render: () => {
            return <Box bg="red.700" px="15" py="3" rounded="md" mb={5}>
              <Text style={{color:'white',fontSize:16}}>مشکلی پیش آمده!!</Text>
            </Box>;
          }
        });
        set_loading(false);
      });
    });
  }

  const renderOrSpinner = () => {
    if(loading){
      return(
        <View style={styles.spinnerView}>
          <Spinner style={styles.spinner} isVisible={true} size={30} type='Circle' color='#b92a31'/>
        </View>
      )
    } else {
      return(
        <View>
          {renderStatus()}

          <Divider />

          <TouchableOpacity onPress={() => renderSingleWorker()}>
            <HStack bg="white" px="5" py="5" justifyContent="space-between" alignItems="center" w="100%" maxW="100%">
              <HStack alignItems="center">
                <Icon style={{color:'#444',fontSize:24}} name="eye-outline" />
              </HStack>
              <HStack>
                <Text color="gray" fontSize="19" fontWeight="600">
                  پیش نمایش
                </Text>
              </HStack>
              <Icon style={{color:'#999',fontSize:24}} name="chevron-forward" />
            </HStack>
          </TouchableOpacity>

          <Divider />

          <TouchableOpacity onPress={() => renderEditWorker()}>
            <HStack bg="white" px="5" py="5" justifyContent="space-between" alignItems="center" w="100%" maxW="100%">
              <HStack alignItems="center">
                <Icon style={{color:'#444',fontSize:24}} name="create-outline" />
              </HStack>
              <HStack>
                <Text color="gray" fontSize="19" fontWeight="600">
                  ویرایش
                </Text>
              </HStack>
              <Icon style={{color:'#999',fontSize:24}} name="chevron-forward" />
            </HStack>
          </TouchableOpacity>

          <Divider />

          <TouchableOpacity onPress={() => renderSingleChart()}>
            <HStack bg="white" px="5" py="5" justifyContent="space-between" alignItems="center" w="100%" maxW="100%">
              <HStack alignItems="center">
                <Icon style={{color:'#444',fontSize:24}} name="bar-chart-outline" />
              </HStack>
              <HStack>
                <Text color="gray" fontSize="19" fontWeight="600">
                  آمار بازدید
                </Text>
              </HStack>
              <Icon style={{color:'#999',fontSize:24}} name="chevron-forward" />
            </HStack>
          </TouchableOpacity>

          <Divider />

          <TouchableOpacity onPress={() => showingAlert()}>
            <HStack bg="white" px="5" py="5" justifyContent="space-between" alignItems="center" w="100%" maxW="100%">
              <HStack alignItems="center">
                <Icon style={{color:'#D32F2F',fontSize:24}} name="trash-outline" />
              </HStack>
              <HStack>
                <Text color="gray" fontSize="19" fontWeight="600">
                  حذف آگهی
                </Text>
              </HStack>
              <Icon style={{color:'#999',fontSize:24}} name="chevron-forward" />
            </HStack>
          </TouchableOpacity>
        </View>
      )
    }
  }

  return (
    <ScrollView style={styles.container}>
      <NativeBaseProvider>
        <Center>
          <AppBar />
        </Center>

        {renderOrSpinner()}

        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="آیا اطمینان دارید؟"
          message="فایل شما پس از پاک شدن دیگر قابل برگشت نخواهد بود"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="انصراف"
          confirmText="بله ، پاکش کن"
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => {
            hideAlert();
          }}
          onConfirmPressed={() => {
            onPressDestroy();
            hideAlert();
          }}
        />
      </NativeBaseProvider>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9'
  },
  header: {
    backgroundColor: 'orange',
    height: 100,
  },
  cpanelListItem: {
    flex: 1,
    marginTop: 20,
    paddingTop: 10,
    marginHorizontal: 15,
    borderRadius: 8,
  },
  cpanelListExit: {
    alignSelf: 'flex-end',
    textAlign: 'right',
    alignItems: 'flex-end',
    backgroundColor: '#9898e6'
  },
  cpanelListLink: {
    alignSelf: 'flex-end',
    textAlign: 'right',
    alignItems: 'flex-end',
  },
  cpanelText: {
    color: '#444',
    fontSize: 14,
    textAlign: 'right',
    paddingTop: 20,
    fontFamily: "IRAN Sans"
  },
  cpanelIcons: {
    color: '#eee',
    fontSize: 30
  },
  spinnerView: {
    flex: 1,
    height: 430,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    color: '#999',
    fontSize: 30,
    paddingRight: 20,
    paddingLeft: 20
  },
});

export default Single;