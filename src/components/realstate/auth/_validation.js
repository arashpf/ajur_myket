import React, { useState, useEffect} from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { Container,  Content, Form, Item, Input, Label, Button,HStack, Text,Box,useToast } from 'native-base';
import axios from 'axios';
import Spinner from 'react-native-spinkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import messaging from '@react-native-firebase/messaging';
import { CommonActions } from '@react-navigation/native'; 

import Pushy from 'pushy-react-native';

const Validation = ({ route, navigation }) => {
  const toast = useToast();
  const {phone} = route.params;
  const [text, set_text] = useState(2);
  const [number, set_number] = useState(0);
  const [loading, set_loading] = useState('false');
  const [code, set_code] = useState(0);
  const [device_Token, set_device_token] = useState(null);







 ////// useEffect

 useEffect(() => {




  const checkToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      
       console.log(fcmToken);
       set_device_token(fcmToken);

      
      
       console.log('------------------tokken fetched properly on validation');
    } else{
      console.log('no tokken retrieved');
    }
   }
   
   checkToken();

 


}, []);













  const renderEnterButton = () => {
// return

if(loading  == 'false'){
return(
  <Button

       style={styles.formSubmit}

      onPress= { () => redirectToValidation()}
       >
      <Text style={{fontFamily:'IRAN Sans',fontSize:22}}>ورود</Text>
  </Button>
)
}else{
return(
        <View style={styles.spinnerView}>
          <Spinner  isVisible={true} size={30} type='Circle' color='#b92a31'/>
        </View>
      )

}

}

const failToReciveOption = () => {
   navigation.pop();
  }


const redirectToValidation = () => {



  
  digits = code;


  if(digits.length != 5 ){


             toast.show({
               render: () => {
                 return <Box bg="orange.700" px="15" py="3" rounded="md" mb={5}>
                       <Text style={{color:'white',fontSize:16}}>کد تایید باید ۵ رقمی باشد</Text>
                       </Box>;
               }
             });

  }else{

    set_loading('true');

    axios({ 
          method:'post',
           url:'https://api.ajur.app/auth/verify',
           params: {
           phone: phone,
           code: digits,
           device_Token,
           password: 'ddr007'
            },
    })
    .then(function (response) {

      set_loading('false');



      if(response.data.status == 'success'){




        toast.show({
          render: () => {
            return <Box bg="green.700" px="15" py="3" rounded="md" mb={5}>
                  <Text style={{color:'white',fontSize:16}}>با موفقیت وارد شدید</Text>
                  </Box>;
          },
          placement: "top"
        });

        console.log('response.data.stars is::::');
        console.log(response.data.stars);
        try {
           AsyncStorage.setItem('id_token', response.data.result.token);
            AsyncStorage.setItem('stars', JSON.stringify(response.data.stars));


        } catch (error) {
          this._appendMessage('AsyncStorage error: ' + error.message);
        }

        

        navigation.dispatch(
          CommonActions.reset({
            index: 0, // The index of the screen in the new stack
            routes: [{ name: 'Base' }], // Specify the destination screen(s)
          })
        );
        

        // if(response.data.is_realstate == 1){
        //    console.log('this is validation for agents page');

        //   AsyncStorage.setItem('is_realstate', 'true');
        //    // Actions.replace(realstate);
        //    // TODO: send agent to dashboard after login
        //    navigation.navigate('Base');
        // }else{

        //   // TODO: send agent to read our policy and contracts
        //   navigation.navigate('Base');
        // }



      }else if (response.data.status == 'useless') {


        toast.show({
          render: () => {
            return <Box bg="orange.500" px="15" py="3" rounded="md" mb={5}>
                  <Text style={{color:'white',fontSize:16}}>کد وارد شده منقضی شده است</Text>
                  </Box>;
          }
        });

      }


      else{



        toast.show({
          render: () => {
            return <Box bg="orange.500" px="15" py="3" rounded="md" mb={5}>
                  <Text style={{color:'white',fontSize:16}}>کد وارد شده اشتباه میباشد</Text>
                  </Box>;
          }
        });

      }



     })



  }




 }

    return (
      <View style={styles.container}>
        <HStack  px="5" py="3" justifyContent="space-between" alignItems="center" w="100%" maxW="100%">
          <HStack alignItems="center">
            <Text color="white" fontSize="15" fontWeight="bold">
              <Icon onPress={()=> navigation.pop()}  style={{color:'#111',fontSize:24}} name="arrow-back" />
            </Text>
          </HStack>

          <HStack>

          <Text color="#555" fontSize="20" fontWeight="bold">
          تایید اس ام اس
          </Text>
          </HStack>
        </HStack>
          <ImageBackground style={ styles.loginBackground } source={require('../assets/images/realstate-login-2.jpg')}  >
          <View>
            <Box
              style={styles.formButton}
              >
              <Input
                placeholder=" -  -  -  -  -"

                keyboardType={'phone-pad'}
                onChangeText={(code) => set_code(code)}
                style={styles.formInput}
              />
          </Box>
            {renderEnterButton() }
            <TouchableOpacity onPress= { () => failToReciveOption()}>
              <Box
                   variant ='outline'

                   style={styles.tryAgainButton}


                   >
                  <Text style={{color:'#393939',fontFamily:'IRAN Sans'}}>تلاش مجدد\شماره اشتباه</Text>
                <Text style={{color:'#393939',fontFamily:'IRAN Sans'}}>{phone}</Text>

              </Box>

            </TouchableOpacity>


          </View>
        </ImageBackground>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    backgroundColor: 'orange',
    // height:100,

  },
  headerIcon: {
    color:'#f9f9f9',
    // fontSize:40
  },
  headerTtitle: {
    color:'#f9f9f9',
    textAlign:'center',
    fontFamily:'IRAN Sans'
  },
  spinnerView:{
    flex: 1,
    height:200,
    justifyContent: 'center',
    alignItems: 'center',
    // marginLeft: Dimensions.get('window').width/2-30,
  },
  loginBackground: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  formButton: {
  width:300,
  height: 50,

  },
  formInput: {
    backgroundColor:'white',
    fontSize:20
  },
  formSubmit:{
    margin:20,
    marginBottom:100,
    borderRadius:5,
    backgroundColor:'orange',
    opacity: .9,

  },

  tryAgainButton:{
    flexDirection:'row',
    justifyContent:'space-between',
    backgroundColor:'white',
    fontSize:18,
    marginTop:30,

    padding:20,
  }

});


export default Validation
