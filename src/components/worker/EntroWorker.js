/* @flow */

import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import EntroWorker from 'react-native-app-intro-slider';
import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const slides = [
  {
    key: 'one',
    title: 'به قسمت راه اندازی کسب و کار آنلاین خوش آمدید',
    text: 'ثبت نام رایگان تنها در سه مرحله ساده',
    image: require('./assets/intro/red-pin.jpg'),
    backgroundColor: 'blue',
  },
  {
    key: 'two',
    title:'مشخصاتتو پر کن',
    text: 'اطالاعاتی مثل نام و فامیل',
    image: require('./assets/intro/2.jpg'),
    backgroundColor: 'yellow',
  },
  {
    key: 'three',
    title:'دسته بندی شغلتو انتخاب کن',
    text:  'هزاران شغل فعال در ایراچار' ,
    image: require('./assets/intro/3.jpg'),
    backgroundColor: 'green',
  },
  {
    key: 'four',
    title: 'محدوده فعالیتتو رو نقشه انتخاب کن',
    text:  'به همین سادگی' ,
    image: require('./assets/intro/red-pin.jpg'),
    backgroundColor: '#22bcb5',
  }
];

const styles = StyleSheet.create({

  image: {
  width: 320,
  height: 320,
},
slide: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'space-around',
  // backgroundColor: '#9898e6',
  backgroundColor: '#9898e6',

},
text: {
  color: '#454545',
  fontSize: 18,
  backgroundColor: 'transparent',
  textDecorationStyle: 'double',
  textAlign: 'center',
  paddingHorizontal: 20,
  paddingBottom:30,
},
title: {
  fontSize: 26,
  color: '#333',
  textDecorationStyle: 'double',
  backgroundColor: 'transparent',
  textAlign: 'center',
  marginBottom: 10,

},

  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  //[...]
});

export default class Entro extends Component {

  constructor() {
    super();
    this.state = { showRealApp: false };
  }


 _renderItem = ({ item }) => {
   return (
     <View style={styles.slide}>
       <Text style={styles.title}>{item.title}</Text>
       <Image source={item.image} />
       <Text style={styles.text}>{item.text}</Text>
     </View>
   );
 }

 _onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    this.setState({ showRealApp: true });
     AsyncStorage.setItem('worker_visitbefore', 'true');
    Actions.newWorker();
  }

  _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="md-checkmark"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </View>
    );
  };
  render() {
    return <EntroWorker nextLabel="بعدی" doneLabel="شروع" renderItem={this._renderItem} data={slides} onDone={this._onDone}/>;
    }
}
