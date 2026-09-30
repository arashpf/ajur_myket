import React, { useEffect } from 'react';
import { Linking } from 'react-native';
import { NativeBaseProvider, Box, HStack, Center, Pressable } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';

const FooterContact = (props) => {
  const realstate = props.realstate;
  const details = props.details;

  useEffect(() => {
    console.log('The realstate in FooterContact is:', realstate);
  }, []);

  // const onPressingCall = () => {

  //   // alert('the detail id is'+details.id);
  //   // return;
  //   try {
  //     await axios.post("https://api.ajur.app/api/track/worker-call", {
  //       worker_id: realstate.id,
  //     });
  //   } catch (error) {
  //     console.error("Worker call tracking failed:", error);
  //   }
  //   const phoneNumber = `tel:${realstate.phone}`;
  //   Linking.openURL(phoneNumber);
  // };


  const onPressingCall = async () => {

    alert("Call button pressed for worker:", realstate.id);
  alert("Phone number:", realstate.phone);
    // Track call in background (don't wait for response)
    axios.post("https://api.ajur.app/api/track/worker-call", {
      worker_id: realstate.id,
    }).catch(error => {
      console.error("Worker call tracking failed:", error);
    });
    
    // Immediately open phone dialer
    const phoneNumber = `tel:${realstate.phone}`;
    const canOpen = await Linking.canOpenURL(phoneNumber);
    
    if (canOpen) {
      await Linking.openURL(phoneNumber);
    } else {
      Alert.alert('خطا', 'امکان برقراری تماس وجود ندارد');
    }
  };

  const onPressingSms = () => {
    const smsNumber = `sms:${realstate.phone}`;
    Linking.openURL(smsNumber);
  };

  const onPressingWhatsApp = () => {

    const phone = `+98${realstate.phone}`;
    const url = `https://wa.me/${phone}`;
    Linking.openURL(url);
  };

  return (
    <NativeBaseProvider>
      <Box flex={1} bg="white" safeAreaTop width="100%" maxW="100%" alignSelf="center">
        <HStack bg="white" alignItems="center" safeAreaBottom shadow={6} justifyContent="space-around" padding={2}>

          {/* WhatsApp Button - Gray */}
          <Pressable cursor="pointer" onPress={onPressingWhatsApp}>
            <Center>
              <Icon size={28} style={{ color: '#A9A9A9' }} name="logo-whatsapp" />
            </Center>
          </Pressable>

          {/* Green Call Button */}
          <Pressable cursor="pointer" onPress={onPressingCall}>
            <Center
              style={{
                backgroundColor: '#34C759',
                borderRadius: 50,
                padding: 12,
                width: 55,
                height: 55,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon size={32} style={{ color: 'white' }} name="call" />
            </Center>
          </Pressable>

          {/* SMS Button - Gray */}
          <Pressable cursor="pointer" onPress={onPressingSms}>
            <Center>
              <Icon size={28} style={{ color: '#A9A9A9' }} name="mail-outline" />
            </Center>
          </Pressable>

        </HStack>
      </Box>
    </NativeBaseProvider>
  );
};

export default FooterContact;
