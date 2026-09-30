/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground
} from 'react-native';

import { Button,Card,CardItem,Accordion,Icon} from 'native-base';
import { color } from 'react-native-reanimated';

const dataArray = [
  { title: "آنچه آجر انجام می دهد", content: "در آجر میتوانید به راحتی املاک  آگهی شده در اطرافتان را مشاهده کنید یا در هر کجای ایران روی نقشه به راحتی جستجو کنید" },
  { title: "چطور آگهی خود را در آجر درج کنید", content: "ابتدا توسط شماره موبایل در سایت آجر ثبت نام کنید و وارد پروفایل خود شویدشما می‌توانید برای املاک‌تان عکسی نیز انتخاب کنید.آگهی شما در لیست تایید قرار میگیرد و پس از تایید در سایت و اپلیکیشن منتشر می شود" },
  { title: "معاملات بی‌واسطه", content: "در آجر کاربران مستقیماً با هم تماس می‌گیرند و هیچ واسطه‌ای در این میان وجود ندارد، پس دقت فرمایید که در معاملاتِ شما آجر هیچ دخالتی ندارد و کاربران باید خودشان جنبه‌های مختلف امنیتی را در نظر بگیرند" }
];



export default class Contact extends Component {
  render() {
    return (
      <View style={styles.container}>

        

        <View style={{alignItems:'center'}}>
          
          <Text style={styles.headerAbout}>
          پشتیبانی ،پیشنهادات و انتقادات
          </Text>
            <Text style={styles.about}>
آجر تمام سعی خود را میکند تا به بهترین شکل ممکن پاسخگوی مشکلات ،سوالات و پیشنهادات شما باشد
بدون شک آماده شنیدن انتقادات سازنده کاربران عزیز هستیم و شنیدن صدای شما و یا خواندن ایمیلی
از سمت کاربران عزیز ما را در انجام وظیفه خود استوار تر خواهد کرد
</Text>
</View>

  <View>
    <Button  variant="ransparent" >
      <Icon name='ios-call' />
      <Text >09382740488  - 02140557301</Text>
    </Button>

    <Button transparent >
      <Icon name='ios-mail' />
      <Text style={{paddingLeft: 20}}>info@ajur.app</Text>
    </Button>
  </View>







          <View style={{alignItems:'center'}}>
          {/* <ImageBackground style={{ height:192,width:192,justifyContent: 'center' }} source={require('../assets/img/us.jpg')}  >

         <Button variant="ransparent" block light>
            <Text style={{color:'orange',paddingTop:100}}>version 1.0.0</Text>
          </Button>

          </ImageBackground> */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:'white',
    flex: 1,

    justifyContent:'space-between'
  },

  headerAbout: {
    padding:10,
    margin:10 ,
    textAlign:'center',
    fontFamily:'Av',
    fontSize:22,
    color:'#333'
  },

  about: {
    padding:20,
    margin:10,
    fontFamily:'Av',
    fontSize:20,
    color:'#444'
  }
});
