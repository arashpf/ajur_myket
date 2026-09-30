/* @flow */
import React , { Component } from 'react';
import { StyleSheet, View,ImageBackground ,TouchableHighlight,TouchableOpacity,ScrollView ,Image,Linking,StatusBar,Dimensions} from 'react-native';
import { Container, Header,Footer,FooterTab, Content, List, ListItem, Text,Button, Icon,Badge, Left, Body, Right, Switch, Form,Input,Item,Picker,Label,Card, CardItem, Thumbnail, Textarea ,Toast,ActionSheet,Title,Subtitle } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Spinner from 'react-native-spinkit';
import { Actions } from 'react-native-router-flux';
import Modal from "react-native-modal";

// import ImagePicker from 'react-native-image-crop-picker';
import * as Progress from 'react-native-progress';



export default class Register extends Component {
  state = {
    loading: false,
    realstate: '',
    name: '' ,
    family: '' ,
    description: ''
    };


  loginWithParams(){
    if(this.state.realstate.length < 3){
      Toast.show({
        text: "نام مشاور املاک باید حد اقل سه حرف باشد",
         position: "top"
      })

    }else if(this.state.name.length < 2){
      Toast.show({
        text: "وارد کردن نام اجباری است",
         position: "top"
      })
    }else if(this.state.family.length < 2){
      Toast.show({
        text: "وارد کردن فامیلی اجباری است",
         position: "top"
      })
    }
    else{


      this.setState({ loading: true});


      AsyncStorage.getItem('id_token').then((token) => {
        var self = this;
        axios({
              method:'post',
              // url:'https://irabist.ir/api/register-login',
              url:'https://api.ajur.app/api/realstate-register',

              params: {
               token: token,
               realstate: this.state.realstate,
               name: this.state.name,
               family: this.state.family,
               description: this.state.description,

            },
      }).then(response => {
        Toast.show({
                 text: "به پنل مشاور املاک خوش آمدید",
                 position: "top",
                 textStyle: { color: "white",'fontSize':16,textAlign:'center' },
                 type: "warning",
                 duration: 50000
               })

                 AsyncStorage.setItem('is_realstate', 'true');
                 AsyncStorage.setItem('name', this.state.name);
                 AsyncStorage.setItem('family', this.state.family);
                 AsyncStorage.setItem('realstate', this.state.realstate);

               this.setState({ loading: false});


               Actions.replace('dashboardwithfooer');

               // Actions.Rdashboard({realstate: this.state.realstate,name: this.state.name,
               //   family: this.state.family,description: this.state.description});
      }).catch(error => {

        Toast.show({
                 text: "متاسفانه مشکلی پیش آمده ، مجددا امتحان کنید",
                 position: "top",
                 textStyle: { color: "white",'fontSize':16,textAlign:'center' },
                 type: "warning",

               })

               this.setState({ loading: false});
        console.log(error);


      })

    })

    }
  }

  renderOrSpinner(){
    if(this.state.loading == true){
      return(
              <View style={styles.spinnerView}>
                <Spinner  isVisible={true} size={50} type='Circle' color='#494949'/>
              </View>
            )
    }else{
      return(
        <Content>
              <StatusBar backgroundColor="#e89d4e" barStyle = "light-content"/>
              <Header style={styles.header}>
                <Left>
                  <Button transparent>
                    <Icon name='ios-arrow-back' style={styles.headerIcon} onPress= { () => Actions.pop()}  />
                  </Button>
                </Left>
                <Body>
                  <Title style={styles.headerTtitle}>ثبت نام مشاورین املاک</Title>
                </Body>
                <Right>
                <Button transparent>

                </Button>
                </Right>
              </Header>
              <Card>
                  <Form>

                  <CardItem inlineLabel>
                    <Input style={styles.textarea}
                        value={this.state.realstate}
                      onChangeText={(realstate) => this.setState({realstate})}
                    />
                    <Label>نام املاک</Label>
                  </CardItem>
                    <CardItem inlineLabel>
                      <Input style={styles.textarea}
                          value={this.state.name}
                        onChangeText={(name) => this.setState({name})}
                      />
                      <Label>نام شما</Label>
                  </CardItem>
                    <CardItem inlineLabel>
                      <Input style={styles.textarea}
                          value={this.state.family}
                        onChangeText={(family) => this.setState({family})}
                      />
                    <Label> فامیلی</Label>
                    </CardItem>


                     <Textarea style={styles.descriptionarea}
                     rowSpan={5} bordered placeholder="کمی درباره فعالیت خود توضیح دهید"
                     value={this.state.description}
                     onChangeText={(description) => this.setState({description})}
                     />

                  </Form>
              </Card>

              <Button style={{margin:10,heigh:50}} full outline onPress= { () => this.loginWithParams()}>
                <Text style={{fontSize:20,color:'#f1f1f1'}}>شروع</Text>
              </Button>


            </Content>
      )
    }
  }
  render() {
    return (
      <Container>

      {this.renderOrSpinner()}


      </Container>



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

  textarea: {
    marginRight:20, borderBottomColor:'#999',borderBottomWidth:1,textAlign:'right'
  },

  descriptionarea: {
    marginRight:5, borderBottomColor:'#999',borderBottomWidth:1,textAlign:'right'
  }
});
