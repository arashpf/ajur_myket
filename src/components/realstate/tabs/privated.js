/* @flow */
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  RefreshControl,
  Platform,
   PermissionsAndroid
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';

import { Container, Header, Content, Card, CardItem, Thumbnail,Title, Text, Button, Icon, Left, Body, Right, } from 'native-base';
import axios from 'axios';
import Spinner from 'react-native-spinkit';

import Grid from 'react-native-grid-component'; // 1.0.6
import { Actions } from 'react-native-router-flux';


// import SplashScreen from 'react-native-splash-screen';
 var offset = 0;
export default class privated extends Component {

  state = { };

  constructor(props) {
     super(props);
     this.state = {
       refreshing: false,
       data: [],
       subcategories:[],
       selectedcat:0,
       chunkCounter: 1,
       isLoaded: true,
       nopost: false,
     };


     //get access to PermissionsAndroid

     async function requestPermissions() {
   if (Platform.OS === 'ios') {
     Geolocation.requestAuthorization();
     Geolocation.setRNConfiguration({
       skipPermissionRequests: false,
      authorizationLevel: 'whenInUse',
    });
   }

   if (Platform.OS === 'android') {
     await PermissionsAndroid.request(
       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
     );


   }
 }

     // end of getting access to PermissionsAndroid



     Geolocation.getCurrentPosition(
         (position) => {

           var userInitialLat = JSON.stringify(position.coords.latitude);
           var userInitialLong = JSON.stringify(position.coords.longitude);

           var selectedcat = this.state.selectedcat;

             this.setState({userInitialLat});



             this.setState({userInitialLong});

             AsyncStorage.getItem('id_token').then((token) => {
             axios({
                   method:'get',
                   url:'https://api.ajur.app/api/realstate-workers',
                   params: {
                     title: 'title',
                     lat : userInitialLat,
                     long : userInitialLong,
                     selectedcat : selectedcat,
                     token:token,
                     collect: 'privated'
                   },
             })
           .then(function (response) {
              self.setState({  data:response.data.workers,subcategories:response.data.subcategories, isLoaded: false});
              if(response.data.workers.length > 0){
                  self.setState({   nopost: false});
              }else{
                self.setState({   nopost: true});
              }


           })
         })


         },
          (error) => alert(JSON.stringify(error)),
         {enableHighAccuracy: false, timeout: 20000, maximumAge: 10000}
       );



















     var self = this;



   }


      componentDidMount() {
            // SplashScreen.hide();

        }




        onPressingSingleWorker({worker}){
          console.log('single worker pressed!');
          console.log(worker);
          Actions.Single({worker});
        }



      renderpriceornot(data){



        if(data.price == '0 تومان'){

          return(
            <Text style={{fontSize:14}}>توافقی</Text>
          )

        }else{
          return(
            <Text style={{fontSize:14}}>{data.price}</Text>
          )
        }

      }


  _renderItem = (data, i) =>
  <TouchableOpacity style={[styles.item]} key={i} onPress= { () => this.onPressingSingleWorker({ worker:data })} >

    <Image
      defaultSource = {require('../../assets/img/wait.gif')}
      source= {{uri: data.thumb }}
      style={{height: '100%',minWidth:100,backgroundColor:'#fff'}}/>

  <View style={{flexDirection:'column',backgroundColor:'#fff',flex:3 }}>




        <CardItem style={{flex:1}}>
            <Left style={{flex:1, backgroundColor:"orange"}}>

              <Text style={{fontSize:12,}}>{data.distance} km</Text>

            </Left>

            <Right style={{flex:3}}>


              <Text style={{fontSize:14,fontFamily:'IRAN Sans'}}  >{data.name} </Text>

            </Right>
        </CardItem>

        <View style={{flexDirection:'row',justifyContent:'space-between',flex:1,paddingRight:13,paddingLeft:10}}>
            <Text note style={{fontSize:14,fontFamily:'IRAN Sans'}}>{data.specialvalue1}   </Text>
          <Text note style={{fontSize:14,fontFamily:'IRAN Sans'}}> {data.specialname1} </Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',flex:1,paddingRight:13,paddingLeft:10}}>
            <Text note style={{fontSize:13,fontFamily:'IRAN Sans'}}>{data.specialvalue2}   </Text>
          <Text note style={{fontSize:13,fontFamily:'IRAN Sans'}}> {data.specialname2} </Text>
        </View>


        <CardItem style={{justifyContent:'flex-end',flex:1}}>

            <Text  style={{fontSize:14,fontFamily:'IRAN Sans'}}>{data.cat_name} {data.region} {data.neighbourhood}  </Text>

        </CardItem>







      </View>

    </TouchableOpacity>


    renderGridorSpinner() {
  if(this.state.isLoaded == false){
    return(
      <Container>

        <Grid
          style={styles.list}
          renderItem={this._renderItem}
          data={this.state.data}
          itemsPerRow={1}
          itemHasChanged={(d1, d2) => d1 !== d2}




        />

    </Container>



    )
  }else{
    return (
      <View style={styles.spinnerView} >
        <Spinner style={styles.spinner}    isVisible={true} size={30} type='Circle' color='orange'/>
      </View>
    )
  }
    }






  onPressingSingleCat({cat}){

    this.setState({selectedcat:cat.id,data:[],isLoaded:true});


    var self = this;

    Geolocation.getCurrentPosition(
        (position) => {

          var userInitialLat = JSON.stringify(position.coords.latitude);
          var userInitialLong = JSON.stringify(position.coords.longitude);

          var selectedcat = this.state.selectedcat;

            this.setState({userInitialLat});



            this.setState({userInitialLong});

             AsyncStorage.getItem('id_token').then((token) => {
            axios({
                  method:'get',
                  url:'https://api.ajur.app/api/realstate-workers',
                  params: {
                    title: 'title',
                    lat : userInitialLat,
                    long : userInitialLong,
                    selectedcat : selectedcat,
                    token: token,
                    collect: 'all'
                  },
            })
          .then(function (response) {
             self.setState({  data:response.data.workers,subcategories:response.data.subcategories, isLoaded: false});


          })

          });


        },
         (error) => alert(JSON.stringify(error)),
        {enableHighAccuracy: false, timeout: 20000, maximumAge: 10000}
      );
  }




  renderCategories(){
    return this.state.subcategories.map(cat =>

        <TouchableOpacity key={cat.id}  onPress= { () => this.onPressingSingleCat({ cat })}>
        <Text style={{margin:5,padding:8,borderColor:'#888',borderWidth:1,borderColor:'orange',borderRadius:5,backgroundColor: this.state.selectedcat== cat.id? 'orange' : 'white'}}>{cat.name} ({cat.counts})</Text>
        </TouchableOpacity>

    );
  }

  onPressnewWorker(){

    AsyncStorage.getItem('id_token').then((token) => {
      var self = this;
      if(token == null){
        Actions.Login();
      }else{
        Actions.newWorker();
      }
    });
  }

  renderCategorySliders(){

    if(this.state.nopost ==  false){

      return(
        <CardItem style={{height:70}}>
          <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              pagingEnabled={false}>
              {this.renderCategories()}
          </ScrollView>
        </CardItem>

      )


    }else{

      return(
          <TouchableOpacity onPress= { () => this.onPressnewWorker()}  style={{textAlign:'center',marginTop:20,alignItems:'center',padding:20,justifyContent:'flex-end'}}>


          <ImageBackground source={require('../../assets/img/add-image.png')}  style={{height:100,width:100, margin:20}} onPress= { () => this.onPressnewWorker()}>




          </ImageBackground>
          <Text style={{fontFamily:'IRAN Sans',textAlign:'center'}}>فایل خصوصی فعالی برای مشاور املاک شما وجود ندارد،فایل خصوصی این امکان را به شما میدهد
          که بدون نمایش دادن عکس ها و آدرس دقیق آگهی آنها را در اختیار کاربران قرار دهید </Text>



        </TouchableOpacity>
      )

    }



   }

  render() {
    return (


      <Container style={styles.container}>

               {this.renderCategorySliders()}
             {this.renderGridorSpinner()}


      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    backgroundColor: '#fff',
    overflow: 'hidden'
  },
  item: {
    flex: 1,
    height: 135,
    paddingBottom: 3,
    marginLeft: 1,
    marginRight:1,
    marginTop:12,

    backgroundColor: '#fff',
    flexDirection:'row',
    borderBottomColor: '#f2f2f2',
    borderStyle : 'solid',
    borderBottomWidth : 1

  },
  list: {
    flex: 1,
  },

  spinnerView:{
    flex: 1,
    height:430,
    justifyContent: 'center',
    alignItems: 'center'
  },

  spinner:{


  }
});
