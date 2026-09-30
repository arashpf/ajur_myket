import React, { useState, useEffect} from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TextInput,
} from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label, Button, Text,Box,useToast } from 'native-base';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import Spinner from 'react-native-spinkit';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login = ({ route, navigation }) => {
    const toast = useToast();
    const [text, set_text] = useState(2);
    const [phone, set_phone] = useState(0);
    const [loading, set_loading] = useState('false');

    const phoneSection = () => {
    if(loading == 'false'){
    return(
      <Button
         full

         style={styles.formSubmit}

        onPress= { () => redirectToValidation()}
         >
        <Text style={{fontFamily:'IRAN Sans'}}> دریافت کد </Text>
      </Button>
    )
  }else{
    return(
            <View style={styles.spinnerView}>
              <Spinner  isVisible={true} size={50} type='Circle' color='#494949'/>
            </View>
          )
  }
  }

  const change_phone = (phone) => {
      console.log(phone);
      set_phone(phone);
  }


  const redirectToValidation = () => {


     console.log(phone);
    if(phone.length != 11 ){
            console.log('the length of phone');
            console.log(phone.length);
            toast.show({
              render: () => {
                return <Box bg="orange.700" px="15" py="3" rounded="md" mb={5}>
                      <Text style={{color:'white',fontSize:16}}>  فرمت شماره معتبر نیست</Text>
                      </Box>;
              }
            });



     }else{
       AsyncStorage.setItem('cellphone', phone);

       set_loading(true);

       axios({
             method:'post',
             url:'https://api.ajur.app/auth/register',

             params: {
              phone: phone,
               },
       })
       .then(function (response) {

        })
        set_loading('false');

        toast.show({
          render: () => {
            return <Box bg="green.700" px="15" py="3" rounded="md" mb={5}>
                  <Text style={{color:'white',fontSize:16}}>لطفا کد تایید را از اس ام اس دریافتی وارد کنید</Text>
                  </Box>;
          },
          placement: "top"
        });
         navigation.navigate('Rvalidation', {
              phone: phone,
            })

     }

    }

  return (
    <View style={styles.container}>
        <ImageBackground style={ styles.loginBackground } source={require('../assets/images/realstate-login.jpg')}  >
          <View >
            <Box
              style={styles.formButton}
              >
              <Input autoFocus= {true}
                placeholder="09XXXXXXXXX"
                returnKeyLabel = {"next"}
                keyboardType={'phone-pad'}
                onChangeText={(phone) => change_phone(phone)}
                style={styles.formInput}
              />
          </Box>
            {phoneSection()}

          </View>
        </ImageBackground>
      </View>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },



  formButton: {
  width:300,
  height: 50,
  opacity: 1,
  marginTop:100,

  },

  formInput: {
    backgroundColor:'white',
    fontSize:20
  },
  formSubmit:{
    margin:20,
    borderRadius:5,
    backgroundColor: 'orange'
  }
});

export default Login
