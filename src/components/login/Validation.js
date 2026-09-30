/* @flow */

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TextInput
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Container, Header, Content, Form, Item, Input, Label, Button, Text, Toast, Left, Body, Right,Icon,Title } from 'native-base';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import Spinner from 'react-native-spinkit';

export default class Login extends Component {
  state = {  text: 2, number:0 , loading: 'false',code: null};
      UNSAFE_componentWillMount() {





      }

   redirectToValidation(){
   digits = this.state.code;

   var self = this;
   if(digits.length != 5 ){
              Toast.show({
                text: "Wrong code!",
                buttonText: "کد تایید باید ۵ رقم باشد",
                 position: "top"
              });

   }else{
     self.setState({ loading: 'true'});

     axios({
           method:'post',
            url:'https://api.ajur.app/auth/verify',
            params: {
            phone: this.props.phone,
            code: digits,
            password: 'ddr007'
             },
     })
     .then(function (response) {
       self.setState({ loading: 'false'});



       if(response.data.status == 'success'){

         Toast.show({
           text: "با موفقیت وارد شدید",
           textStyle: { color: "white",'fontSize':16,textAlign:'center' },
            position: "top",
            type: "success"
         })
         try {
            AsyncStorage.setItem('id_token', response.data.result.token);
            AsyncStorage.setItem('is_realstate', response.data.result.is_realstate);
            AsyncStorage.setItem('stars', response.data.result.stars);

         } catch (error) {
           this._appendMessage('AsyncStorage error: ' + error.message);
         }

         
           Actions.replace('Base');


       }else if (response.data.status == 'useless') {

         Toast.show({
           text: "کد وارد شده منقضی شده است",
           buttonText: "ok",
            position: "top",
            type: "warning"
         })

       }


       else{

         Toast.show({
           text: "کد وارد شده اشتباه است",
           buttonText: "ok",
            position: "top",
            type: "danger"
         })

       }



      })



   }




  }

renderEnterButton(){
// return

if(this.state.loading  == 'false'){
return(
  <Button
       full
       dark
       style={styles.formSubmit}

      onPress= { () => this.redirectToValidation()}
       >
      <Text style={{fontFamily:'IRAN Sans'}}>ورود</Text>
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

  failToReciveOption(){
    Actions.Login();
  }

  cancelValidation(){

    Actions.replace('Base');
  }
  render() {
    return (
      <View style={styles.container}>
        <Header style={styles.header}>
          <Left>
            <Button transparent>
              <Icon name='ios-close-outline' style={styles.headerIcon}   onPress= { () => this.cancelValidation()} />
            </Button>
          </Left>
          <Body>
            <Title style={styles.headerTtitle}>تایید اس ام اس</Title>
          </Body>
          <Right>

          </Right>
        </Header>
          <ImageBackground style={ styles.loginBackground } source={require('./images/white.jpg')}  >
          <View>
            <Button
              block
              warning
              style={styles.formButton}
              >
              <Input
                placeholder=" -  -  -  -  -"

                keyboardType={'phone-pad'}
                onChangeText={(code) => this.setState({code})}
              />
            </Button>
            {this.renderEnterButton() }
            <Button
                 full
                 transparent
                 style={styles.tryAgainButton}

                onPress= { () => this.failToReciveOption()}
                 >
                <Text style={{color:'#393939',fontFamily:'IRAN Sans'}}>تلاش مجدد\شماره اشتباه</Text>
            </Button>

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
  formSubmit:{
    margin:20,
    marginBottom:100,
    borderRadius:5,
    opacity: .7,

  },

  tryAgainButton:{
    marginTop:30,
  }

});
