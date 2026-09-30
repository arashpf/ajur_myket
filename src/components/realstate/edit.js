import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
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

const Edit = ({ route, navigation }) => {
  const { userId } = route.params;
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [realstateImage, setRealstateImage] = useState('');
  const [profileImage, setProfileImage] = useState(false);
  const [realestateName, setRealestateName] = useState('');
  const [name, setName] = useState('');
  const [family, setFamily] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('id_token').then(token => {
      axios
        .get('https://api.ajur.app/api/get-user', { params: { token } })
        .then(response => {
          const user = response.data.user;
          setData(user);
          setRealestateName(user.realstate);
          setName(user.name);
          setFamily(user.family);
          setProfileImage(user.profile_url);
          setRealstateImage(user.realstate_url);
          setDescription(user.description);
          setLoading(false);

          if (user.realstate_lat === 0.0) {
            toast.show({
              render: () => (
                <Box bg="orange.700" px="4" py="3" rounded="md" mb={5}>
                  <Text style={styles.toastText}>
                    محل دقیق مشاور املاک را مشخص کنید
                  </Text>
                </Box>
              ),
            });
          }
        });
    });
  }, []);

  const editRealstate = () => {
    if(!realestateName){
       return showToast('لطفا نام املاک را وارد کنید');
    }
    if (realestateName.length < 3) {
      return showToast('نام مشاور املاک باید حد اقل سه حرف باشد');
    }

     if(!name){
       return showToast('لطفا نام خود را وارد کنید');
    }

    if (name.length < 2) {
      return showToast('وارد کردن نام اجباری است');
    }

    setLoading(true);
    AsyncStorage.getItem('id_token').then(token => {
      axios
        .post('https://api.ajur.app/api/realstate-register', null, {
          params: {
            token,
            realstate: realestateName,
            name,
            family,
            description,
          },
        })
        .then(() => {
          showToast('پروفایل شما با موفقیت بروز رسانی شد', 'success');
          AsyncStorage.setItem('is_realstate', 'true');
          AsyncStorage.setItem('name', name);
          AsyncStorage.setItem('family', family);
          AsyncStorage.setItem('realstate', realestateName);
          AsyncStorage.setItem('profile_complete', 'true');
          setLoading(false);
          // navigation.navigate('Base');
          

         

          navigation.reset({
            index: 2,
            routes: [{ name: "Base" }, { name: "Dashboard" },{name: 'Setting'}],
          });
          

        })
        .catch(() => {
          showToast('متاسفانه مشکلی پیش آمده ، مجددا امتحان کنید', 'error');
          setLoading(false);
           
        });
    });
  };

  const showToast = (message, type = 'warning') => {
    const bgColor = {
      warning: 'orange.700',
      success: 'green.500',
      error: 'red.500',
    }[type];

    toast.show({
      render: () => (
        <Box bg={bgColor} px="4" py="3" rounded="md" mb={5}>
          <Text style={styles.toastText}>{message}</Text>
        </Box>
      ),
    });
  };

  if (loading) {
    return (
      <View style={styles.spinnerView}>
        <Spinner isVisible={true} size={50} type="Circle" color="#494949" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Box bg="white" rounded="2xl" shadow={2} p="5" mx="4" my="6">
        <FormControl>
          <Stack space={5}>
            <Stack>
              <FormControl.Label>نام املاک</FormControl.Label>
              <Input
                variant="underlined"
                value={realestateName}
                onChangeText={setRealestateName}
                textAlign="right"
                fontSize="16"
              />
            </Stack>

            <Stack>
              <FormControl.Label>نام</FormControl.Label>
              <Input
                variant="underlined"
                value={name}
                onChangeText={setName}
                textAlign="right"
                fontSize="16"
              />
            </Stack>

            <Stack>
              <FormControl.Label>فامیلی</FormControl.Label>
              <Input
                variant="underlined"
                value={family}
                onChangeText={setFamily}
                textAlign="right"
                fontSize="16"
              />
            </Stack>

            <Stack>
              <FormControl.Label>درباره من</FormControl.Label>
              <TextArea
                h={24}
                placeholder="کمی درباره فعالیت خود توضیح دهید"
                value={description}
                onChangeText={setDescription}
                textAlign="right"
                fontSize="16"
              />
            </Stack>
          </Stack>
        </FormControl>

        <Button
          mt="6"
          bg="#FFA726"
          _text={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}
          onPress={editRealstate}
          borderRadius="lg"
        >
          ثبت تغییرات
        </Button>
      </Box>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  spinnerView: {
    flex: 1,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toastText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Edit;
