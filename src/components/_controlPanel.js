import React, {useState, useEffect,useRef} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Text,
  Animated,Image
} from 'react-native';
import {Button,  Badge, VStack, Center, Box, Divider,  useToast} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles from './styles';
import Icon from 'react-native-vector-icons/Ionicons';
import { StackActions } from '@react-navigation/native';

const ControlPanel = ({navigation}) => {
  const toast = useToast();
  const [token, set_token] = useState(null);
  const [unreadmessage, set_unreadmessage] = useState(0);
  const [user, set_user] = useState('');
  const [name, set_name] = useState('');
  const [family, set_family] = useState('');
  const [email, set_email] = useState('');
  const [realstate, set_realstate] = useState('');
  const [url, set_url] = useState('');
  const [phone, set_phone] = useState('');
  const [profilePicked, set_profilePicked] = useState('false');
  const [have_token, set_have_token] = useState('no');
  const [cellphone, set_cellphone] = useState('');
  const [is_realstate, set_is_realstate] = useState(null);
  const [stars, set_stars] = useState('');


  const slideAnim = useRef(new Animated.Value(300)).current; // Start off-screen to the left

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0, // Slide to original position
      duration: 300, // Half a second
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  useEffect(() => {
    AsyncStorage.getItem('cellphone').then(cellphone => {
      set_cellphone(cellphone);
    });
    AsyncStorage.getItem('is_realstate').then(is_realstate => {
      set_is_realstate(is_realstate);
    });
    AsyncStorage.getItem('name').then(name => {
      set_name(name);
    });
    AsyncStorage.getItem('family').then(family => {
      set_family(family);
    });
    AsyncStorage.getItem('realstate').then(realstate => {
      set_realstate(realstate);
    });
    AsyncStorage.getItem('stars').then(stars => {
      set_stars(stars);
    });
    AsyncStorage.getItem('id_token').then(token => {
      if (token == null) {
        set_have_token('false');
      } else {
        set_have_token('true');
      }
    });
  }, []);

  const gotoProfile = () => {
    AsyncStorage.getItem('id_token').then((token) => {
      var self = this;
      if(token == null){
      navigation.navigate('Rlogin');
      }else{
          navigation.navigate('RDashborad');
          // TODO: have to go to real estate dashborad but for testing right now
          // i use Base for the purpose of testing
      }
    });
  }

  const renderProfileData = () => {
  const [profileImage, setProfileImage] = useState(null);

  // Load saved image when component mounts
  useEffect(() => {
    const loadSavedImage = async () => {
      try {
        const savedImage = await AsyncStorage.getItem('userProfileImage');
        if (savedImage) {
          setProfileImage(JSON.parse(savedImage));
        }
      } catch (error) {
        console.error('Error loading saved image:', error);
      }
    };
    loadSavedImage();
  }, []);

  if (have_token != 'true') {
    if (profilePicked == 'false') {
      return (
        <TouchableOpacity onPress={() => gotoProfile()}>
          <View style={{
            flexDirection: 'row',
            height: 50,
            margin: 30,
            marginTop: 30,
            width: null,
            backgroundColor: 'rgba(20,20,20,0)',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}>
            <View style={{height: 50, alignItems: 'center', textAlign: 'center'}}>
              <Icon
                large
                style={{fontSize: 60, color: 'white'}}
                name="md-person"
              />
            </View>
            <Text style={{
              fontSize: 18,
              color: 'white',
              marginTop: 15,
              fontFamily: 'IRAN Sans',
            }}>
              لطفا وارد شوید
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else if (profilePicked == 'true') {
      return (
        <TouchableOpacity onPress={() => gotoProfile()}>
          <View style={{
            flexDirection: 'row',
            height: 50,
            width: null,
            backgroundColor: '#595959',
            alignItems: 'center',
            textAlign: 'center',
            paddingTop: 13,
          }}>
            {/* Show saved image if available, otherwise show Thumbnail */}
            {profileImage ? (
              <Image
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  borderColor: 'white',
                  borderWidth: 3,
                  marginRight: 10
                }}
                source={{uri: profileImage.uri}}
              />
            ) : (
              <Thumbnail
                style={{borderColor: 'white', borderWidth: 3}}
                source={{uri: url}}
              />
            )}
            <Text style={{fontSize: 18, color: 'white'}}>
              {name} {family}
            </Text>
            <Text style={{fontSize: 16, color: 'white'}}>{phone}</Text>
          </View>
        </TouchableOpacity>
      );
    }
  } else {
    return (
      <TouchableOpacity onPress={() => gotoProfile()}>
        <View style={{
          flexDirection: 'row',
          height: 50,
          margin: 30,
          marginTop: 30,
          width: null,
          backgroundColor: 'rgba(20,20,20,0)',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}>
          <View style={{height: 50, alignItems: 'center', textAlign: 'center'}}>
            {/* Show saved image if available, otherwise show icon */}
            {profileImage ? (
              <Image
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  borderColor: 'white',
                  borderWidth: 2
                }}
                source={{uri: profileImage.uri}}
              />
            ) : (
              <Icon
                large
                style={{fontSize: 60, color: 'white'}}
                name="md-person"
              />
            )}
          </View>
          <View>
            <Text style={{
              fontSize: 18,
              color: 'white',
              marginTop: 15,
              fontFamily: 'IRAN Sans',
            }}>
              {name} {family} - {cellphone}
            </Text>
            {renderRealstateName()}
          </View>
        </View>
        {renderRealstateStars()}
      </TouchableOpacity>
    );
  }
};
  // const renderProfileData = () => {
  //   if (have_token != 'true') {
  //     if (profilePicked == 'false') {
  //       return (
  //         <TouchableOpacity onPress={() => gotoProfile()}>
  //           <View
  //             style={{
  //               flexDirection: 'row',
  //               height: 50,
  //               margin: 30,
  //               marginTop: 30,
  //               width: null,
  //               backgroundColor: 'rgba(20,20,20,0)',
  //               alignItems: 'center',
  //               justifyContent: 'center',
  //               textAlign: 'center',
  //             }}>
  //             <View
  //               style={{height: 50, alignItems: 'center', textAlign: 'center'}}>
  //               <Icon
  //                 large
  //                 style={{fontSize: 60, color: 'white'}}
  //                 name="md-person"
  //               />
  //             </View>
  //             <Text
  //               style={{
  //                 fontSize: 18,
  //                 color: 'white',
  //                 marginTop: 15,
  //                 fontFamily: 'IRAN Sans',
  //               }}>
  //               لطفا وارد شوید
  //             </Text>
  //             <Text style={{fontSize: 16, color: 'white'}}> </Text>
  //           </View>
  //         </TouchableOpacity>
  //       );
  //     } else if (profilePicked == 'true') {
  //       return (
  //         <TouchableOpacity onPress={() => gotoProfile()}>
  //           <View
  //             style={{
  //               flexDirection: 'row',
  //               height: 50,
  //               width: null,
  //               backgroundColor: '#595959',
  //               alignItems: 'center',
  //               textAlign: 'center',
  //               paddingTop: 13,
  //             }}>
  //             <Thumbnail
  //               style={{borderColor: 'white', borderWidth: 3}}
  //               source={{uri: url}}
  //             />
  //             <Text style={{fontSize: 18, color: 'white'}}>
  //               {name} {family}
  //             </Text>
  //             <Text style={{fontSize: 16, color: 'white'}}>{phone}</Text>
  //           </View>
  //         </TouchableOpacity>
  //       );
  //     }
  //   } else {
  //     return (
  //       <TouchableOpacity onPress={() => gotoProfile()}>
  //         <View
  //           style={{
  //             flexDirection: 'row',
  //             height: 50,
  //             margin: 30,
  //             marginTop: 30,
  //             width: null,
  //             backgroundColor: 'rgba(20,20,20,0)',
  //             alignItems: 'center',
  //             justifyContent: 'center',
  //             textAlign: 'center',
  //           }}>
  //           <View
  //             style={{height: 50, alignItems: 'center', textAlign: 'center'}}>
  //             <Icon
  //               large
  //               style={{fontSize: 60, color: 'white'}}
  //               name="md-person"
  //             />
  //           </View>
  //           <View>
  //             <Text
  //               style={{
  //                 fontSize: 18,
  //                 color: 'white',
  //                 marginTop: 15,
  //                 fontFamily: 'IRAN Sans',
  //               }}>
  //               {name} {family} - {cellphone}
  //             </Text>
  //             {renderRealstateName()}
  //           </View>
  //         </View>
  //         {renderRealstateStars()}
  //       </TouchableOpacity>
  //     );
  //   }
  // };

  const renderRealstateName = () => {
    if (is_realstate) {
      return (
        <Text style={{fontSize: 16, color: 'white', textAlign: 'center'}}>
          مشاور املاک {realstate}{' '}
        </Text>
      );
    } else {
    }
  };

  const renderRealstateStars = () => {
    if (stars == 1) {
      return (
        <Text
          style={{
            color: 'white',
            fontFamily: 'IRAN Sans',
            textAlign: 'center',
          }}>
          <Icon
            style={{color: 'gold', margin: 10, fontSize: 16}}
            name="ios-star"
          />
          <Icon
            style={{color: 'silver', fontSize: 16}}
            name="ios-star-outline"
          />
          <Icon
            style={{color: 'silver', fontSize: 16}}
            name="ios-star-outline"
          />
          <Icon
            style={{color: 'silver', fontSize: 16}}
            name="ios-star-outline"
          />
          <Icon
            style={{color: 'silver', fontSize: 16}}
            name="ios-star-outline"
          />
        </Text>
      );
    } else if (stars == 2) {
      return (
        <Text
          style={{
            fontSize: 14,
            color: 'white',
            fontFamily: 'IRAN Sans',
            textAlign: 'center',
          }}>
          <Icon
            style={{color: 'gold', margin: 10, fontSize: 16}}
            name="ios-star"
          />
          <Icon
            style={{color: 'gold', margin: 10, fontSize: 16}}
            name="ios-star"
          />
          <Icon
            style={{color: 'silver', fontSize: 16}}
            name="ios-star-outline"
          />
          <Icon
            style={{color: 'silver', fontSize: 16}}
            name="ios-star-outline"
          />
          <Icon
            style={{color: 'silver', fontSize: 16}}
            name="ios-star-outline"
          />
        </Text>
      );
    } else if (stars == 3) {
      return (
        <Text
          style={{
            fontSize: 14,
            color: 'white',
            fontFamily: 'IRAN Sans',
            textAlign: 'center',
          }}>
          <Icon
            style={{color: 'gold', margin: 10, fontSize: 16}}
            name="ios-star"
          />
          <Icon
            style={{color: 'gold', margin: 10, fontSize: 16}}
            name="ios-star"
          />
          <Icon
            style={{color: 'gold', margin: 10, fontSize: 16}}
            name="ios-star"
          />
          <Icon
            style={{color: 'silver', fontSize: 16}}
            name="ios-star-outline"
          />
          <Icon
            style={{color: 'silver', fontSize: 16}}
            name="ios-star-outline"
          />
        </Text>
      );
    } else if (stars == 4) {
      return (
        <Text
          style={{
            fontSize: 14,
            color: 'white',
            fontFamily: 'IRAN Sans',
            textAlign: 'center',
          }}>
          <Icon
            style={{color: 'gold', margin: 10, fontSize: 16}}
            name="ios-star"
          />
          <Icon
            style={{color: 'gold', margin: 10, fontSize: 16}}
            name="ios-star"
          />
          <Icon
            style={{color: 'gold', margin: 10, fontSize: 16}}
            name="ios-star"
          />
          <Icon
            style={{color: 'gold', margin: 10, fontSize: 16}}
            name="ios-star"
          />
          <Icon
            style={{color: 'silver', fontSize: 16}}
            name="ios-star-outline"
          />
        </Text>
      );
    } else if (stars == 5) {
      return (
        <Text
          style={{
            fontSize: 14,
            color: 'white',
            fontFamily: 'IRAN Sans',
            textAlign: 'center',
          }}>
          <Icon
            style={{color: 'gold', margin: 10, fontSize: 16}}
            name="ios-star"
          />
          <Icon
            style={{color: 'gold', margin: 10, fontSize: 16}}
            name="ios-star"
          />
          <Icon
            style={{color: 'gold', margin: 10, fontSize: 16}}
            name="ios-star"
          />
          <Icon
            style={{color: 'gold', margin: 10, fontSize: 16}}
            name="ios-star"
          />
          <Icon
            style={{color: 'gold', margin: 10, fontSize: 16}}
            name="ios-star"
          />
        </Text>
      );
    } else {
    }
  };

  const onPressHistory = () => {
    navigation.navigate('History');
  };
  const onPressLiked = () => {
    navigation.navigate('Liked');
  };



  const logout = () => {


  try {
     AsyncStorage.setItem('id_token', '');
     AsyncStorage.setItem('is_realstate', '');
     AsyncStorage.setItem('id_visitbefore', 'false');
     AsyncStorage.setItem('user_city_id', '');
     AsyncStorage.setItem('user_city_name', '');
     AsyncStorage.setItem('name', '');
     AsyncStorage.setItem('family', '');
     AsyncStorage.setItem('realstate', '');
     AsyncStorage.setItem('hasSeenMapModal','false');

     set_have_token('false');


     toast.show({
       render: () => {
         return <Box bg="orange.700" px="15" py="3" rounded="md" mb={5}>
               <Text style={{color:'white',fontSize:16}}>با موفقیت خارج شدید</Text>
               </Box>;
       }
     });
     navigation.popToTop();
     navigation.navigate('Base');

  } catch (error) {


  }
}

const marketingRegister = () => {

  AsyncStorage.getItem('id_token').then((token) => {

    if (token == null) {
      navigation.navigate('Rlogin');
    } else {
      navigation.navigate('RMarketing');
    }
  });

}

const realstateRegister = () => {


  AsyncStorage.getItem('id_token').then((token) => {

    if (token == null) {
      navigation.navigate('Rlogin');
    } else {
      navigation.navigate('RDashborad');
    }
  });

}

const renderMarketingLinks = () => {

  if(token){

    return(

      <TouchableOpacity  onPress= { () => marketingRegister()}>
        <Box
          w="100%"
          h="16"
          rounded="md"
          flexDirection="row"
          justifyContent="flex-end">
          <Text style={styles.cpanelText}>بخش بازاریابی</Text>
        <Icon style={styles.cpanelIconsExit} name="ios-home" />
        </Box>
      </TouchableOpacity>


    )

  }else{
    return(

      <>
      <TouchableOpacity  onPress= { () => marketingRegister()}>
        <Box
          w="100%"
          h="16"
          rounded="md"
          flexDirection="row"
          justifyContent="flex-end">
          <Text style={styles.cpanelText}>ورود به بازاریابی</Text>
        <Icon style={styles.cpanelIconsExit} name="ios-enter" />
        </Box>
      </TouchableOpacity>


      </>

    )

  }

}

const renderRealstateLinks = () => {


  if(token){

    return(

      <TouchableOpacity  onPress= { () => realstateRegister()}>
        <Box
          w="100%"
          h="16"
          rounded="md"
          flexDirection="row"
          justifyContent="flex-end">
          <Text style={styles.cpanelText}>مشاور املاک من</Text>
        <Icon style={styles.cpanelIconsExit} name="ios-home" />
        </Box>
      </TouchableOpacity>


    )

  }else{
    return(

      <>
      <TouchableOpacity  onPress= { () => realstateRegister()}>
        <Box
          w="100%"
          h="16"
          rounded="md"
          flexDirection="row"
          justifyContent="flex-end">
          <Text style={styles.cpanelText}>ورود به پنل املاک</Text>
        <Icon style={styles.cpanelIconsExit} name="ios-enter" />
        </Box>
      </TouchableOpacity>


      </>

    )

  }
}

  const renderLogoutOrCopyright = () => {
    if (have_token == 'true') {
      return (
        <TouchableOpacity onPress={() => logout()}>
          <Box
            w="100%"
            h="16"
            rounded="md"
            flexDirection="row"
            justifyContent="flex-end">
            <Text style={styles.cpanelText}>خروج از حساب</Text>
            <Icon style={styles.cpanelIconsExit} name="md-exit-outline" />
          </Box>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity>
          <Box
            w="100%"
            h="20"
            rounded="md"
            flexDirection="row"
            justifyContent="flex-end">
            <Text style={styles.cpanelText}>گروه نرم افزارهای آرمن</Text>
            <Icon style={styles.cpanelIconsExit} name="md-finger-print" />
          </Box>
        </TouchableOpacity>
      );
    }
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

  const onPressAbout = () => {
    navigation.navigate('About');
  }

  const onPressRolls = () => {
    navigation.navigate('Rolls');
  }
  const onPressPrivacy = () => {
    navigation.navigate('Privacy');
  }
  const onPressContact = () => {
    navigation.navigate('Contact');
  }

  return (
    <Animated.View
      style={{
        transform: [{ translateX: slideAnim }],
      }}
    >
    <ScrollView style={{backgroundColor: 'white'}}>
      <ImageBackground
        style={styles.headerBackground}
        source={require('./assets/red-wall.jpg')}>
        {renderProfileData()}
      </ImageBackground>

      <VStack space={0} alignItems="center">
        <TouchableOpacity onPress={() => onPressHistory()}>
          <Box
            w="100%"
            h="16"
            rounded="md"
            flexDirection="row"
            justifyContent="flex-end">
            <Text style={styles.cpanelText}>بازدیدهای اخیر</Text>
            <Icon style={styles.cpanelIcons} name="md-time" />
          </Box>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onPressLiked()}>
          <Box
            w="100%"
            h="16"
            rounded="md"
            flexDirection="row"
            justifyContent="flex-end">
            <Text style={styles.cpanelText}>پسند شده ها</Text>
            <Icon style={styles.cpanelIcons} name="heart" />
          </Box>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity onPress={() => newWorker()}>
          <Box
            w="100%"
            h="16"
            rounded="md"
            flexDirection="row"
            justifyContent="flex-end">
            <Text style={styles.cpanelText}>ثبت فایل جدید</Text>
            <Icon style={styles.cpanelIcons} name="md-add-circle" />
          </Box>
        </TouchableOpacity>
          {renderRealstateLinks()}
          {renderMarketingLinks()}
        <Divider />
        <TouchableOpacity onPress={() => onPressAbout()}>
          <Box
            w="100%"
            h="16"
            rounded="md"
            flexDirection="row"
            justifyContent="flex-end">
            <Text style={styles.cpanelText}>درباره آجر</Text>
            <Icon style={styles.cpanelIcons} name="eye-sharp" />
          </Box>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onPressRolls()}>
          <Box
            w="100%"
            h="16"
            rounded="md"
            flexDirection="row"
            justifyContent="flex-end">
            <Text style={styles.cpanelText}>قوانین و توافق نامه کاربری</Text>
            <Icon style={styles.cpanelIcons} name="lock-closed" />
          </Box>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onPressPrivacy()}>
          <Box
            w="100%"
            h="16"
            rounded="md"
            flexDirection="row"
            justifyContent="flex-end">
            <Text style={styles.cpanelText}>حریم خصوصی</Text>
            <Icon style={styles.cpanelIcons} name="eye-off" />
          </Box>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onPressContact()}>
          <Box
            w="100%"
            h="16"
            rounded="md"
            flexDirection="row"
            justifyContent="flex-end">
            <Text style={styles.cpanelText}>پشتیبانی آجر</Text>
            <Icon style={styles.cpanelIcons} name="ios-call" />
          </Box>
        </TouchableOpacity>
        <Divider />

        {renderLogoutOrCopyright()}

        <TouchableOpacity onPress={() => onPressHistory()}>
          <Box
            w="100%"
            h="16"
            rounded="md"
            flexDirection="row"
            justifyContent="flex-end">
            <Text style={styles.cpanelText}>version 10.2.0</Text> 
            <Icon style={styles.cpanelIcons} name="ios-cafe-outline" />
          </Box>
        </TouchableOpacity>
      </VStack>
    </ScrollView>
    </Animated.View>
  );
};

export default ControlPanel;
