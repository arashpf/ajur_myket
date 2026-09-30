import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import {
  Input,
  Stack,
  FormControl,
  TextArea,
  Box,
  Button,
  useToast,
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Spinner from 'react-native-spinkit';

const Edit = ({route, navigation}) => {
  const {userId} = route.params;
  const toast = useToast();

  const [loading, set_loading] = useState(true);
  const [data, set_data] = useState([]);
  const [realstateImage, set_realstateImage] = useState('');
  const [profileImage, set_profileImage] = useState(false);
  const [uploadClicked, set_uploadClicked] = useState(false);
  const [imagesPicked, set_imagesPicked] = useState(false);
  const [realestate_name, set_realestate_name] = useState('');
  const [name, set_name] = useState('');
  const [family, set_family] = useState('');
  const [description, set_description] = useState('');

  useEffect(() => {
    console.log('log form setting component useEffect');

    AsyncStorage.getItem('id_token').then(token => {
      axios({
        method: 'get',
        url: 'https://api.ajur.app/api/get-user',
        params: {
          token: token,
        },
      }).then(function (response) {
        set_data(response.data.user);
        set_realestate_name(response.data.user.realstate);
        set_name(response.data.user.name);
        set_family(response.data.user.family);
        set_profileImage(response.data.user.profile_url);
        set_realstateImage(response.data.user.realstate_url);
        set_description(response.data.user.description);
        set_loading(false);

        if (response.data.user.realstate_lat == 0.0) {
          console.log('the user is not picked locations yet');
          // Actions.Rlocation();

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

        console.log('the data now is+++++++++++++++++++++ ');
        console.log(response.data.user.realstate);
      });
    });
  }, []);

  const EditRealstate = () => {
    if (realestate_name.length < 3) {
      toast.show({
        render: () => {
          return (
            <Box bg="orange.700" px="15" py="3" rounded="md" mb={5}>
              <Text style={{color: 'white', fontSize: 16}}>
                نام مشاور املاک باید حد اقل سه حرف باشد
              </Text>
            </Box>
          );
        },
      });
    } else if (name.length < 2) {
      toast.show({
        render: () => {
          return (
            <Box bg="orange.700" px="15" py="3" rounded="md" mb={5}>
              <Text style={{color: 'white', fontSize: 16}}>
                وارد کردن نام اجباری است
              </Text>
            </Box>
          );
        },
      });
    } else {
      set_loading(true);
      AsyncStorage.getItem('id_token').then(token => {
        axios({
          method: 'post',
          // url:'https://irabist.ir/api/register-login',
          url: 'https://api.ajur.app/api/realstate-register',

          params: {
            token: token,
            realstate: realestate_name,
            name: name,
            family: family,
            description: description,
          },
        })
          .then(response => {
            toast.show({
              render: () => {
                return (
                  <Box bg="green.500" px="15" py="3" rounded="md" mb={5}>
                    <Text style={{color: 'white', fontSize: 16}}>
                      پروفایل شما با موفقیت بروز رسانی شد
                    </Text>
                  </Box>
                );
              },
            });

            AsyncStorage.setItem('is_realstate', 'true');
            AsyncStorage.setItem('name', name);
            AsyncStorage.setItem('family', family);
            AsyncStorage.setItem('realstate', realestate_name);

            set_loading(false);
            navigation.navigate('Base');

            // Actions.Rdashboard({ realstate: this.state.realstate,name: this.state.name,
            //   family: this.state.family,description: this.state.description});
          })
          .catch(error => {
            toast.show({
              render: () => {
                return (
                  <Box bg="red.500" px="15" py="3" rounded="md" mb={5}>
                    <Text style={{color: 'white', fontSize: 16}}>
                      متاسفانه مشکلی پیش آمده ، مجددا امتحان کنید
                    </Text>
                  </Box>
                );
              },
            });
            set_loading(false);
            console.log(error);
          });
      });
    }
  };

  const renderOrSpinner = () => {
    if (loading == true) {
      return (
        <View style={styles.spinnerView}>
          <Spinner isVisible={true} size={50} type="Circle" color="#494949" />
        </View>
      );
    } else {
      return (
        <>
          <View>
            <FormControl>
              <Stack space={5}>

                <Stack>
                  <FormControl.Label >نام املاک </FormControl.Label>
                    <Input style={styles.textarea}
                        value={realestate_name}

                        onChangeText={(realestate_name) => set_realestate_name(realestate_name)}
                    />
                </Stack>

                <Stack>
                  <FormControl.Label >نام </FormControl.Label>
                    <Input style={styles.textarea}
                        value={name}

                        onChangeText={(name) => set_name(name)}
                    />
                </Stack>

                <Stack>
                  <FormControl.Label >فامیلی</FormControl.Label>
                    <Input style={styles.textarea}
                        value={family}

                        onChangeText={(family) => set_family(family)}
                    />
                </Stack>
                <Stack>
                  <FormControl.Label>درباره من</FormControl.Label>

                    <TextArea style={styles.descriptionarea}
                    rowSpan={5} bordered placeholder="کمی درباره فعالیت خود توضیح دهید"
                    value={description}

                      onChangeText={(description) => set_description(description)}
                    />
                </Stack>
              </Stack>
            </FormControl>


          </View>

          <Button
            style={{margin: 10, heigh: 50}}
            full
            outline
            onPress={() => EditRealstate()}>
            <Text style={{fontSize: 20, color: '#f1f1f1'}}>تصحیح</Text>
          </Button>
        </>
      );
    }
  };

  return <ScrollView>{renderOrSpinner()}</ScrollView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  spinnerView: {
    flex: 1,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    // marginLeft: Dimensions.get('window').width/2-30,
  },

  header: {
    backgroundColor: 'orange',
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

  textarea: {
    marginRight: 20,
    borderBottomColor: '#999',
    borderBottomWidth: 1,
    textAlign: 'right',
  },

  descriptionarea: {
    marginRight: 5,
    borderBottomColor: '#999',
    borderBottomWidth: 1,
    textAlign: 'right',
  },
});

export default Edit;
