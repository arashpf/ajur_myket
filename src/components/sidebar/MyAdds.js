/* @flow */



import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  BackHandler,
  StatusBar,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right,Title } from 'native-base';
import axios from 'axios';
import Spinner from 'react-native-spinkit';

import Grid from 'react-native-grid-component'; // 1.0.6
import { Actions } from 'react-native-router-flux';


// import SplashScreen from 'react-native-splash-screen';
 var offset = 0;
export default class MyAdds extends Component {

  state = { };

  constructor(props) {
     super(props);
       this.backButton = this.backButton.bind(this);
     this.state = {
       refreshing: false,
       data: [],
       chunkCounter: 1,
       isLoaded: true,
       nopost: false,
     };


     console.log('the refresh amount passed from parent is:');
     console.log(this.props.refresh);
     // if(this.props.refresh == true){
     //   Actions.reset("mainRoute");
     // }
     var self = this;

     AsyncStorage.getItem('id_token').then((token) => {
        console.log('the token in MyAdds section is');
        console.log(token);


        axios({
              method:'get',
              url:'https://api.ajur.app/api/user-workers',
              params: {
                token: token,
              },
        })
      .then(function (response) {
         self.setState({  data:response.data.workers, isLoaded: false});

         if(response.data.workers.length == 0){
            self.setState({   nopost: true});
         }

         console.log('the data now is+++++++++++++++++++++ ');
         console.log(response.data);
      })

     });

   }


   componentDidMount() {
      BackHandler.addEventListener('hardwareBackPress', this.backButton);
    }

    componentWillUnmount(){
      BackHandler.removeEventListener('hardwareBackPress', this.backButton);
        this.mounted = false;
    }

    backButton(){
      if(this.props.fromnewworker == 'yes'){
        Actions.Main();
        return true;
      }else if(this.props.fromnewworker == 'no'){
         Actions.pop();
        // return false;
      }
    }


        onPressingSingleWorker({worker}){
          console.log('single worker pressed!');
          console.log(worker);
          Actions.Single({worker});
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



      renderpriceornot(data){

        console.log('-----------------the data price is --------------------');
        console.log(data.price);

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
      defaultSource = {require('../assets/img/wait.gif')}
      source= {{uri: data.thumb }}
      style={{height: '100%',minWidth:100,backgroundColor:'#fff'}}/>

  <View style={{flexDirection:'column',backgroundColor:'#fff',flex:3 }}>




        <CardItem style={{flex:2}}>
            <Left style={{flex:1, backgroundColor:"orange"}}>



            </Left>

            <Right style={{flex:3}}>

                 <Text style={{fontSize:14}}>{data.name}</Text> 

            </Right>
        </CardItem>

        <View style={{flexDirection:'row',justifyContent:'space-between',flex:1,paddingRight:10,paddingLeft:10}}>
            <Text note style={{fontSize:12}}>{data.specialvalue1}   </Text>
            <Text note style={{fontSize:12}}> {data.specialname1} </Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',flex:1,paddingRight:10,paddingLeft:10}}>
            <Text note style={{fontSize:12}}>{data.specialvalue2}   </Text>
            <Text note style={{fontSize:12}}> {data.specialname2} </Text>
        </View>


        <CardItem style={{justifyContent:'flex-end',flex:1}}>

            <Text note style={{fontSize:14}}>{data.category_name}  {data.region}  </Text>

        </CardItem>







      </View>

    </TouchableOpacity>


    renderGridorSpinner() {
  if(this.state.isLoaded == false){
    return(
      <Grid
        style={styles.list}
        renderItem={this._renderItem}
        data={this.state.data}
        itemsPerRow={1}
        itemHasChanged={(d1, d2) => d1 !== d2}




      />

    )
  }else{
    return (
      <View style={styles.spinnerView} >
        <Spinner style={styles.spinner}    isVisible={true} size={30} type='Circle' color='#b92a31'/>
      </View>
    )
  }
    }







  rendernoposterror(){
    if(this.state.nopost == true){
      return(
        <View style={{textAlign:'center',marginTop:20,alignItems:'center',padding:20,justifyContent:'flex-end'}}>


         <Button block  bordered info  >
          <Text style={{fontFamily: 'IRAN Sans',}}>هنوز هیچ فایلی ثبت نکرده اید</Text>
          </Button>

          <Button block success style={{margin:10}} onPress= { () => this.newWorker()}>
           <Text style={{fontFamily: 'IRAN Sans',fontSize:20}}>ثبت فایل جدید</Text>
           </Button>

       </View>
      )
    }
  }

  onBackPressed(){
    if(this.props.fromnewworker == 'yes'){
      Actions.Main()
    }else{
      Actions.pop();
    }
  }

  render() {
    return (


      <Container style={styles.container}>
          <StatusBar backgroundColor="#e89d4e" barStyle = "light-content"/>
        <Header style={styles.header}>
          <Left>
            <Button transparent>
              <Icon name='ios-arrow-back' style={styles.headerIcon} onPress= { () => this.onBackPressed()}  />
            </Button>
          </Left>
          <Body>
            <Title style={styles.headerTtitle}>آجر</Title>
          </Body>
          <Right>
          <Button transparent>

          </Button>
          </Right>
        </Header>
               {this.rendernoposterror()}
             {this.renderGridorSpinner()}


      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    backgroundColor: '#f9f9f9',
    overflow: 'hidden'
  },
  header: {
    backgroundColor: 'orange',
    height:50,

  },
  headerIcon: {
    color:'#555',
    fontSize:30
  },
  headerTtitle: {
    color:'#666',
    textAlign:'center',
    fontFamily: 'IRAN Sans',
    width:Dimensions.get('window').width/1.5,
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
    borderRightColor: 'orange',
    borderRightWidth : 5

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
