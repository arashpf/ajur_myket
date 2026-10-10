import React, { useEffect } from 'react';
import { Linking, Alert } from 'react-native'; // Add Alert import
import { NativeBaseProvider, Box, HStack, Center, Pressable } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios'; // Add axios import
import { trackEvent } from '../../lib/analytics/track';  

const FooterContact = (props) => {
  const realstate = props.realstate;
  const details = props.details;

  useEffect(() => {
    console.log('The realstate in FooterContact is:', realstate);
    console.log('The details in FooterContact is:', details);
    console.log('Phone number:', realstate?.phone);
    console.log('Worker ID:', realstate?.id);
  }, []);


  // const onPressingCall = () => {

     
  //   try {
  //     await axios.post("https://api.ajur.app/api/track/worker-call", {
  //       worker_id: details.id,
  //     });
  //   } catch (error) {
  //     alert("Worker call tracking failed:", error);
  //   }
  //   const phoneNumber = `tel:${realstate.phone}`;
  //   Linking.openURL(phoneNumber);
  // };

  const onPressingCall = () => {
    const phone = realstate?.phone;
  
    // 1) Analytics — fire-and-forget, do NOT await.
    //    Must happen before the dialer opens, so we don't lose it if the
    //    OS backgrounds the app to show the call screen.
    if (details?.id) {
      trackEvent('listing_call', {
        listing_id: details.id,
        phone: phone || null,
        realstate_id: realstate?.id || null,
        source: 'worker-page',
      });
    }
  
    // 2) Legacy server-side log — fire-and-forget too.
    //    Previously this was awaited, which delayed the dialer on slow
    //    networks. We now send it in parallel.
    axios
      .post('https://api.ajur.app/api/track/worker-call', {
        worker_id: details.id,
      })
      .catch((error) => {
        // Legacy log failure is non-fatal — don't block the call.
        if (__DEV__) console.warn('worker-call log failed:', error?.message);
      });
  
    // 3) Open the dialer immediately.
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  // const onPressingCall = async () => {
  //   // Debug alerts
  //   alert("Realstate object: " + JSON.stringify(realstate));
  //   alert("Phone number: " + realstate?.phone);
  //   alert("Worker ID: " + realstate?.id);
    
  //   if (!realstate) {
  //     alert("No realstate data");
  //     return;
  //   }
    
  //   if (!realstate.phone) {
  //     alert("No phone number");
  //     return;
  //   }
    
  //   alert("Attempting to call: " + realstate.phone);
    
  //   try {
  //     const phoneNumber = `tel:${realstate.phone}`;
  //     const canOpen = await Linking.canOpenURL(phoneNumber);
  //     alert("Can open phone? " + canOpen);
      
  //     if (canOpen) {
  //       await Linking.openURL(phoneNumber);
  //     } else {
  //       alert("Cannot open phone dialer");
  //     }
  //   } catch (error) {
  //     alert("Error: " + error.message);
  //   }
  // };

  const onPressingSms = () => {
    if (!realstate) return;
    const smsNumber = `sms:${realstate.phone}`;
    Linking.openURL(smsNumber);
  };

  const onPressingWhatsApp = () => {
    if (!realstate) return;
    // Clean phone number for WhatsApp
    let phone = realstate.phone.toString().replace(/\D/g, '');
    if (phone.startsWith('0')) {
      phone = phone.substring(1);
    }
    const url = `https://wa.me/98${phone}`;
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