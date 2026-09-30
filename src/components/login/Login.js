/* @flow */
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TextInput,
} from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label, Button, Text, Toast } from 'native-base';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import Spinner from 'react-native-spinkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Login extends Component {
  state = {  text: 2, loading: 'false'};
      UNSAFE_componentWillMount() {

      }

      componentWillUnmount() {

   }

  redirectToValidation(){


   console.log(this.state.phone);
   phone = this.state.phone;



  if(phone.length != 11 ){
              Toast.show({
                text: "Wrong phone number!",
                buttonText: "شماره نا معتبر است",
                 position: "top"
              })
   }else{
     AsyncStorage.setItem('cellphone', this.state.phone);
     this.setState({ loading: true});
     var self = this;
     axios({
           method:'post',
           // url:'https://irabist.ir/api/register-login',
           url:'https://api.ajur.app/auth/register',

           params: {
            phone: phone,

             },
     })
     .then(function (response) {
       Toast.show({
                text: "کد تایید را از اس ام اس ارسالی وارد کنید",
                position: "top",
                textStyle: { color: "white",'fontSize':16,textAlign:'center' },
                type: "warning",
                duration: 50000
              })
      })
      self.setState({ loading: false});
       Actions.validation({phone: this.state.phone});

   }

  }



  realstateRegister(){


    AsyncStorage.getItem('id_token').then((token) => {
      var self = this;
      if(token == null){
        Actions.Rlogin();
      }else{

          AsyncStorage.getItem('is_realstate').then((is_realstate) => {
            var self = this;
            if(is_realstate == null){
              Actions.Rpolicy();
            }else{
              // Actions.Rdashboardwithfooter();
              Actions.realstate();
            }
          });
      }

    });

  }

  phoneSection(){
    if(this.state.loading == 'false'){
    return(
      <View>
      <Button
         full

         style={styles.formSubmit}

        onPress= { () => this.redirectToValidation()}
         >
        <Text style={{fontFamily:'IRAN Sans'}}>دریافت کد</Text>
      </Button>
      <Button
         full
         bordered
         dark

        onPress= { () => this.realstateRegister()}
         >
        <Text style={{fontFamily:'IRAN Sans',color:'#222',fontSize:16,borderThic:2}}>مشاور املاک هستید؟از اینجا وارد شوید</Text>
      </Button>
    </View>

    )
  }else{
    return(
            <View style={styles.spinnerView}>
              <Spinner  isVisible={true} size={30} type='Circle' color='#b92a31'/>
            </View>
          )
  }
  }


  render() {
    return (
      <View style={styles.container}>
        <ImageBackground style={ styles.loginBackground } source={require('./images/locked.jpg')}  >
          <View >
            <Button
              full

              style={styles.formButton}
              >
              <Input autoFocus= {true}
                placeholder="09XXXXXXXXX"
                returnKeyLabel = {"next"}
                keyboardType={'phone-pad'}
                onChangeText={(phone) => this.setState({phone})}
              />
            </Button>
            {this.phoneSection()}

          </View>
        </ImageBackground>
      </View>
    );
  }
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
  color: 'gray',
  backgroundColor:'white'
  },
  formSubmit:{
    margin:20,
    borderRadius:5,
    backgroundColor: 'orange'
  }
});
