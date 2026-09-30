import React, { useState, useEffect} from "react";
import {View,Text,StyleSheet,Dimensions} from 'react-native';
import { Container,Content,Card,CardItem,Thumbnail,Image, Header,Left,Body,Right,Title,Button, Tab, Tabs, TabHeading, Icon } from 'native-base';
import Categories from './Categories';
import Nearests from './Nearests';
import NetInfo from "@react-native-community/netinfo";

const Landing = ({navigation}) => {

  const [choosedcat, set_choosedcat] = useState(null);
  useEffect(() => {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        var message = 'اتصال اینترنت را بررسی کنید';
        // ToastAndroid.show("اتصال اینترنت را برسی کنید",ToastAndroid.LONG);
        ToastAndroid.showWithGravityAndOffset(
          message,
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
          25,
          50,
        );
      }
    });
  }, []);
  return (
    <View style={styles.container}>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: 'IRAN Sans'

  },
  header: {
    backgroundColor: '#e89d4e',
    height:50

  },
  headerIcon: {
    color:'#555',
    fontSize:30
  },
  headerTtitle: {
    color:'#666',
    textAlign:'center',
    fontFamily: 'IRAN Sans',
    width:Dimensions.get('window').width/1.55,
    fontSize:24
  },
});

export default Landing;
