/* @flow */
import React , { Component } from 'react';
import { StyleSheet, View,ImageBackground ,TouchableHighlight,TouchableOpacity,ScrollView ,Image,Linking} from 'react-native';
import { Container, Header,Footer,FooterTab, Content, List, ListItem, Text,Button, Icon,Badge, Left, Body, Right, Switch, Form,Input,Item,Picker,Label,Card, CardItem, Thumbnail, Textarea ,Toast,ActionSheet,Title,Subtitle } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Spinner from 'react-native-spinkit';
import { Actions } from 'react-native-router-flux';
import Modal from "react-native-modal";

// import ImagePicker from 'react-native-image-crop-picker';
import * as Progress from 'react-native-progress';



export default class newWorkerfinal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      userLat: null,
      userLong: null,
      workersindex: [],
    };

    
    var self = this;


}







  render() {
    return (
      <Container>

            <Content >


                  <Card >
                      <Form style={{justifyContent:'space-around'}}>


                      <Button bordered success full style={{marginVertical:20}}>
                          <Text>اطلاعات شما با موفقیت ثبت شد </Text>
                      </Button>
                      <Title style={{color:'gray',margin:20}}>خدمت شما پس از تایید آنلاین میشود</Title>

                      <Button warning iconLeft full
                      style={{marginVertical:20}}
                      onPress= { () => Actions.Main() }
                      >
                        <Icon name='home' />
                        <Text>خانه</Text>
                      </Button>

                      <Button danger iconLeft full
                        onPress= { () => Actions.SidebarSection() }
                      >
                        <Icon name='cog' />
                        <Text>پنل</Text>
                      </Button>
                      </Form>
                  </Card>
                  <ImageBackground style={{ height:200,justifyContent: 'center',margin:50 }} source={require('../assets/irachar-logo.png')} >
                  <Button transparent block light>
                     <Text>1.0.0</Text>
                   </Button>

                   </ImageBackground>


                </Content>
          <Footer style={{backgroundColor:'purple'}}>
            <FooterTab>
              <Button full bordered>
                <Text style={{fontSize:20,color:'white'}}>گروه سایت های ایرا</Text>
              </Button>
            </FooterTab>
          </Footer>

      </Container>



    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
