/* @flow */

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity
} from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Text,Thumbnail,ListItem,Toast } from 'native-base';
import { Actions } from 'react-native-router-flux';



import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Spinner from 'react-native-spinkit';
import AwesomeAlert from 'react-native-awesome-alerts';

export default class report extends Component {
  constructor(props) {
     super(props);
     this.state = {
       showAlert: false,
       loading: false,

     };
   }

   showAlert = () => {
   this.setState({
     showAlert: true
   });
 };

 hideAlert = () => {
   this.setState({
     showAlert: false
   });
 };






   onPressingSingleWorker({worker}){

     Actions.workerRoot({worker});
   }


   onPressReport(){
     Toast.show({
              text:  'با تشکر ، گزارش شما ثبت شد',
              position: 'top',
              textStyle: { color: "white",'fontSize':12,textAlign:'center' },
              duration: 6000,


            })
     Actions.pop();
   }

   onPressDestroy() {

     this.setState({ loading: true});

     AsyncStorage.getItem('id_token').then((token) => {


        var self = this;
        axios({
              method:'get',
              url:'https://api.ajur.app/api/destroy-worker',
              params: {
                token: token,
                workerid:this.props.worker.id,
              },
        }).then((response) => {

            var self = this;
            self.setState({
              loading:false
            });

            Toast.show({
                     text:  'آگهی شما حذف شد',
                     position: 'bottom',
                     textStyle: { color: "white",'fontSize':12,textAlign:'center' },
                     duration: 6000,


                   })
            Actions.MyAdds();
            })
           .catch((error)=>{
              console.log(error);
              Toast.show({
                       text:  'مشکلی پیش آمده!!',
                       position: 'top',
                       textStyle: { color: "white",'fontSize':12,textAlign:'center' },
                       duration: 6000,
                     })
                     Actions.MyAdds();
           });










     });

   }








  renderOrSpinner(){
    if(this.state.loading){
      return(
        <View style={styles.spinnerView} >
          <Spinner style={styles.spinner}    isVisible={true} size={30} type='Circle' color='#b92a31'/>
        </View>
      )
    }else{
      return(
        <View style={styles.wraper}>

        <ListItem>
          <View style={styles.cpanelListItem}>
            <Button onPress={() => this.onPressReport()} style={styles.cpanelListLink} transparent >
              <Text style={styles.cpanelText}>مشاور املاک غیر واقعی است</Text>
            </Button>
          </View>
        </ListItem>

        <ListItem>
          <View style={styles.cpanelListItem}>
            <Button onPress={() => this.onPressReport()} style={styles.cpanelListLink} transparent >
              <Text style={styles.cpanelText}>مشاور املاک مشکل اخلاقی دارد</Text>
            </Button>
          </View>
        </ListItem>

        <ListItem>
          <View style={styles.cpanelListItem}>
            <Button onPress={() => this.onPressReport()} style={styles.cpanelListLink} transparent >
              <Text style={styles.cpanelText}>کلاه برداری و مشکل قانونی</Text>
            </Button>
          </View>
        </ListItem>

        <ListItem>
          <View style={styles.cpanelListItem}>
            <Button onPress={() => this.onPressReport()} style={styles.cpanelListLink} transparent >
              <Text style={styles.cpanelText}>آدرس و موقعیت اشتباه</Text>
            </Button>
          </View>
        </ListItem>

        <ListItem>
          <View style={styles.cpanelListItem}>
            <Button onPress={() => this.onPressReport()} style={styles.cpanelListLink} transparent >
              <Text style={styles.cpanelText}>اطلاعات تماس اشتباه</Text>
            </Button>
          </View>
        </ListItem>
        <ListItem>
          <View style={styles.cpanelListItem}>
            <Button onPress={() => this.onPressReport()} style={styles.cpanelListLink} transparent >
              <Text style={styles.cpanelText}>بدون دلیل خوشم نمیاد ازش </Text>
            </Button>
          </View>
        </ListItem>




        </View>
      )
    }
  }

  newWorker(){

    AsyncStorage.getItem('id_token').then((token) => {
      var self = this;
      if(token == null){
        Actions.Login();
      }else{
        Actions.WorkerSection();
      }

    });
  }
  Sidebar(){

    Actions.refresh;
    Actions.SidebarSection();

  }

  cancelEdit(){
    Actions.pop();
  }
  render() {
    const {showAlert} = this.state;
    return (

      <ScrollView style={styles.container}>
      <Header style={styles.header}>
        <Left>
          <Button transparent>
            <Icon name='ios-arrow-back' style={styles.headerIcon}   onPress= { () => this.cancelEdit()} />
          </Button>
        </Left>

        <Right>
            <Title style={styles.headerTtitle}>{this.props.realstate.realstate} - {this.props.realstate.name}</Title>
        </Right>
      </Header>

        {this.renderOrSpinner()}




        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="آیا اطمینان دارید؟"
          message="فایل شما پس از پاک شدن دیگر قابل برگشت نخواهد بود"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="انصراف"
          confirmText="بله ، پاکش کن"
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            this.onPressDestroy();
            this.hideAlert();
          }}
        />
    </ScrollView>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#f9f9f9'
  },

  header: {
    backgroundColor: 'orange',
    height:100,

  },
  headerIcon: {
    color:'#f9f9f9',
    fontSize:30
  },
  headerTtitle: {
    marginRight:20,
    color:'#f9f9f9',
    textAlign:'center'
  },
  cpanelListItem: {
    flex:1,

    padding:15,

    flexDirection:'column',


  },

  cpanelListExit:{
    alignSelf:'flex-end',
    textAlign:'right',
    alignItems:'flex-end',
    backgroundColor:'#9898e6'
  },

  cpanelListLink:{


    alignSelf:'flex-end',
    textAlign:'right',
    alignItems:'flex-end',


  },

   cpanelText:{
     flexDirection:'row',
    color:'#666',
    fontWeight:'600',
    textAlign:'right',
    fontSize:20,
      fontFamily: "IRAN Sans",

  },

  cpanelIcons: {
    color:'#eee',
    fontSize:30

  },
  spinnerView:{
    flex: 1,
    height:430,
    justifyContent: 'center',
    alignItems: 'center'
  },

});
