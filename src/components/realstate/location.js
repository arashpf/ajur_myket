/* @flow */
import React , { Component } from 'react';
import { StyleSheet,Dimensions, View,ImageBackground ,TouchableHighlight,TouchableOpacity,ScrollView ,Image,Linking,Platform} from 'react-native';
import { Container, Header,Footer,FooterTab, Content, List, ListItem, Text,Button, Icon,Badge, Left, Body, Right, Switch, Form,Input,Item,Label,Card, CardItem, Thumbnail, Textarea ,Toast,ActionSheet,Title,Subtitle } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Spinner from 'react-native-spinkit';
import { Actions } from 'react-native-router-flux';
import Modal from "react-native-modal";

// import ImagePicker from 'react-native-image-crop-picker';
import * as Progress from 'react-native-progress';
import MapView, { Marker,Circle, ProviderPropType,PROVIDER_GOOGLE } from 'react-native-maps';
import gps from '../worker/assets/gps.png';
import edit from '../worker/assets/edit.png';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 35.7074612;
const LONGITUDE = 51.3005805;
const LATITUDE_DELTA = 0.03;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

export default class location extends Component {

    constructor(props) {
      super(props);
      this.state = {
        returnedId:false,
        title: null ,
        family: null ,
        marker1: true,
        marker2: false,
        initialPosition: null,
        userLat: 35.7074612,
        userLong: 51.3005805,
        finalLat:35.7074612,
        finalLong:51.3005805,
        isCatSelectd: false,
        workers:[],
        LATLNG: {
          latitude: 35.7074612,
          longitude: 51.3005805
          },
          slidevalue:500,
          pinColor:'red',
          pinIcon:'pin',
          circleTop:'40%',
          circleRadius: 0.05,
          uploadCompleted: false,
          percent: 10,
          returnedPlaces: [],
          loading2: false,
          zoomLevel:10,

          worker_id : 1,
          addressRegion: ' kalako',
          addressNeighbourhood: '',
          addressCity: '',
          addressMunicipality_zone:'',
          addressState : '',
          addressFormatted : '',
          worker : null
      };

      // begin of uploading post
      AsyncStorage.getItem('id_token').then((token) => {

        var self = this;
        self.setState({  beginupload: 'true'});
        var photos = self.props.images;
        var data = new FormData();

      });
      //end of uploading post

    } //end of constructor

    componentDidMount() {
      // Set default location (Tehran)
      this.setState({
        finalLat: 35.7074612,
        finalLong: 51.3005805,
        LATLNG: {
          latitude: 35.7074612,
          longitude: 51.3005805
        }
      });
    }

    componentWillUnmount(){
      this.mounted = false;
    }

    renderBreadCrumb(){
      // Breadcrumb component - can be implemented if needed
    }

    newWorker(){
      if(this.state.hasToken == false){
        Actions.Login();
      }else{
        Actions.newWorker();
      }
    }

    newWorker2(){
      if(this.state.hasToken == false){
        Actions.Login();
      }else{
        Actions.newWorker2();
      }
    }

    //final button
    setLocation(){
      var self = this;

      // begin of uploading post
      AsyncStorage.getItem('id_token').then((token) => {

        var self = this;
        self.setState({  beginupload: 'true'});
        axios({
          method:'post',
          url:'https://api.ajur.app/api/post-realstate-location',
          timeout: 1000 * 35, // Wait for 35 seconds
          params: {
            token: token,
            lat : this.state.finalLat,
            long : this.state.finalLong,
            region:  this.state.addressRegion,
            neighbourhood: this.state.addressNeighbourhood,
            city: this.state.addressCity,
            municipality_zone: this.state.addressMunicipality_zone,
            state : this.state.addressState,
            formatted : this.state.addressFormatted
          },
        })
        .then((response) => {
          if(response.data.status == "200"){
            Toast.show({
              text: 'موقعیت شما ثبت شد',
              position: 'bottom',
              textStyle: { color: "white",'fontSize':12,textAlign:'center' },
              duration: 3000,
            })
            Actions.reset("Rsetting");
          } else {
            Toast.show({
              text: 'متاسفانه مشکلی رخ داده است',
              position: 'bottom',
              textStyle: { color: "white",'fontSize':12,textAlign:'center' },
              duration: 6000,
              buttonText: "باشه",
              buttonTextStyle: { color: "#008000" },
              buttonStyle: { backgroundColor: "orange" }
            })
          }
        })
        .catch(e => {
          console.log(e);
        })
      });
    }
    // end of final button

    touchIn() {
      var self = this;
      self.setState({circleTop:'38%',circleRadius:0.09});
    }

    renderFooterButtons() {
      if(this.state.zoomLevel < 16){
        return(
          <View style={styles.footerbuttonContainer}>
            <Button block danger style={[ styles.footerButton]}>
              <Text style={{color:'white',fontSize:20}}>لطفا بیشتر زوم کنید</Text>
            </Button>
          </View>
        )
      } else {
        return(
          <View style={styles.footerbuttonContainer}>
            <Button block warning
              onPress={() => this.setLocation()}
              style={[ styles.footerButton]}>
              <Text style={{color:'white',fontSize:20}}> ثبت موقعیت</Text>
            </Button>
          </View>
        )
      }
    }

    openModal(){
      this.setState({isModalVisible:true})
    }

    closeModal(){
      this.setState({isModalVisible:false})
    }

    generate(title){
      var self = this;
      self.setState({  returnedPlaces:[] , loading2:true});

      axios({
        method:'get',
        url:'https://api.neshan.org/v1/search',
        headers: {
          'api-key': 'service.UylIa21mMdoxUKtQ9nnS7b3dE5sJfgKWPpRVoyPV'
        },
        params: {
          term: title,
          lat:35,
          lng:52
        },
      })
      .then(function (response) {
        self.setState({  returnedPlaces:response.data.items , loading2:'false'});
      })
    }

    onPressingSinglePlace({place}){
      this.closeModal()

      var lat = place.location.y;
      var long = place.location.x;

      _mapView.animateToRegion({
        latitude: lat,
        longitude: long,
        latitudeDelta: 0.05,
        longitudeDelta: 0.03,
      }, 1000);
    }

    renderplaces(){
      if(this.state.loading2 == true){
        return(
          <View>
            <Spinner style={styles.spinner} isVisible={true} size={100} type='ThreeBounce' color='purple'/>
          </View>
        )
      } else {
        return this.state.returnedPlaces.map(place => (
          <View animation="fadeInUpBig" key={place.id}>
            <ListItem onPress={() => this.onPressingSinglePlace({ place })}>
              <Left>
                <Button disabled transparent>
                  <Icon active name="arrow-back" />
                </Button>
              </Left>
              <View>
                <Text style={{paddingRight:20, fontWeight: '600', textAlign:'right'}}>{ place.title }</Text>
                <Text note style={{paddingRight:20, fontWeight: '400', textAlign:'right',color:'gray'}}>{ place.region }</Text>
              </View>
            </ListItem>
          </View>
        ));
      }
    }

    renderMap(){
      // Using default location instead of user location
      return(
        <MapView
          ref = {(mapView) => { _mapView = mapView; }}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: Number(35.7074612),
            longitude: Number(51.3005805),
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          onStartShouldSetResponder={() => this.touchIn()}
          onRegionChangeComplete={(region) => {
            var self = this;
            var zoom = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2);
            self.setState({
              circleTop:'40%',
              circleRadius:.05,
              finalLat:region.latitude,
              finalLong:region.longitude,
              zoomLevel: zoom
            });

            axios({
              method:'get',
              url:'https://api.neshan.org/v2/reverse',
              headers: {
                'api-key': 'service.UylIa21mMdoxUKtQ9nnS7b3dE5sJfgKWPpRVoyPV'
              },
              params: {
                lat: this.state.finalLat,
                lng: this.state.finalLong
              },
            })
            .then((response) => {
              console.log('the response data come from neshan is:');
              console.log(response.data.formatted_address);

              var self = this;
              self.setState({
                addressRegion: response.data.addresses[0].formatted,
                addressNeighbourhood: response.data.neighbourhood,
                addressCity: response.data.city,
                addressMunicipality_zone: response.data.municipality_zone,
                addressState: response.data.state,
                addressFormatted: response.data.formatted_address
              });
            })
            .catch((error)=>{
              console.log(error);
            });
          }}
          onTouchEnd={(e) => console.log('touch end')}
        />
      )
    }

    render() {
      return (
        <Container>
          <Content>
            {this.renderBreadCrumb()}
            
            <Card style={{height:600,width:'100%'}}>
              {this.renderMap()}
            </Card>

            <View style={styles.ShadowbuttonContainer}>
              <TouchableOpacity
                style={{
                  borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
                  width: Dimensions.get('window').width * this.state.circleRadius,
                  height: Dimensions.get('window').width * this.state.circleRadius,
                  backgroundColor:'rgba(20,20,20,.1)',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Text> </Text>
              </TouchableOpacity>
            </View>

            <View style={{flexDirection: 'column', position: 'absolute', top: this.state.circleTop, right: '39%'}}>
              <TouchableOpacity style={[styles.lightbubble, styles.button]}>
                <Icon style={[styles.pinIcon, styles.shadow]} name={this.state.pinIcon} />
              </TouchableOpacity>
            </View>

            <View style={styles.SearchbuttonContainer}>
              <TouchableOpacity
                onPress={() => this.openModal()}
                style={[styles.bubble, styles.button]}
              >
                <Text style={[styles.searchbuttontext]}>جستجو منطقه</Text>
              </TouchableOpacity>
            </View>

            <Modal
              animationType={"fade"}
              onBackdropPress={() => this.closeModal()}
              style={styles.modal} 
              isVisible={this.state.isModalVisible}
            >
              <Container>
                <Content>
                  <Item>
                    <Input 
                      autoFocus={true}
                      placeholder="جستجو"
                      returnKeyLabel={"search"}
                      onChangeText={(title) => this.setState({ data: this.generate(title)})}
                      style={styles.input}
                    />
                    <Icon name="ios-search" />
                  </Item>
                  <List>
                    {this.renderplaces()}
                  </List>
                </Content>
              </Container>
            </Modal>
          </Content>
          {this.renderFooterButtons()}
        </Container>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    elevation: 1,
  },
  marker: {
    marginLeft: 46,
    marginTop: 10,
    fontWeight: 'bold',
  },
  bubble: {
    backgroundColor: 'rgba(20,20,20,.7)',
    paddingHorizontal: 28,
    paddingVertical: 1,
    borderRadius: 20,
    elevation: 3,
  },
  lightbubble: {
    paddingHorizontal: 30,
    paddingVertical: 1,
    borderRadius: 30,
    elevation: 4,
  },
  shadowbubble: {
    // elevation: 3,
  },
  footerButton: {
    marginTop: 10,
    marginBottom:15,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 5,
    elevation: 3,
  },
  button: {
    marginTop: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 1,
    elevation: 3,
  },
  buttontext: {
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'column',
    marginVertical: 2,
    elevation: 3,
  },
  footerbuttonContainer: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 30,
    width:'100%',
    elevation: 3,
  },
  LeftbuttonContainer: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 30,
    left: 30,
    elevation: 3,
  },
  RighbuttonContainer: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 30,
    right: 30,
    elevation: 3,
  },
  CenterbuttonContainer: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: '45%',
    right: '30%',
    elevation: 3,
  },
  ShadowbuttonContainer: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: '49%',
    right: '47.5%',
    elevation: 3,
  },
  pinIcon: {
    color: 'red',
    fontSize:60,
    elevation: 3,
  },
  shadow: {},
  SearchbuttonContainer: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 40,
    left: '33%',
    elevation: 3,
  },
  searchbuttontext: {
    color:'white',
    padding:5,
    paddingLeft:20,
    paddingRight:20
  },
});