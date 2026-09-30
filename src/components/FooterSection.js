import React, { Component } from 'react';
import {AsyncStorage} from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text, Badge,Toast} from 'native-base';
import { Actions } from 'react-native-router-flux';
export default class FooterSection extends Component {



    onPressingFooterHome() {
      Actions.main();
    }

    onPressingFooterSearch() {
      Actions.searchArea();
    }
    onPressingFooterPublish() {
      AsyncStorage.getItem('id_token').then((token) => {
      if(token == null){
        Actions.login();
      }else{
        AsyncStorage.getItem('user_city_id').then((token) => {
        if(token == null){
          Toast.show({
            text: "ابتدا شهرتان را انتخاب کنید",
            buttonText: "باشه",
             position: "top",
             type: "warning"
          });
          Actions.CitySelection();
        }else{
          Actions.NewAdd2();
        }

      });

      }

    });


    }
    onPressingFooterMe() {
      Actions.sellerArea();
    }



  render() {
    return (

          // i drop active from button and change active color directly instead
          <Footer >
            <FooterTab style={{backgroundColor: '#f8f8f8'}} >
              <Button  vertical onPress= { () => this.onPressingFooterHome()}>
              <Icon name="home" style={{color: 'blue'}} />
              <Text style={{color: '#0d0d0d'}}>خانه</Text>
              </Button>

              <Button   vertical onPress= { () => this.onPressingFooterSearch()}>
              <Icon  active name="ios-search" style={{color: '#494949'}} />
              <Text style={{color: '#0d0d0d'}}>جستجو</Text>
              </Button>
              <Button vertical onPress= { () => this.onPressingFooterPublish()} >
                <Icon name="ios-add-circle" style={{color: '#494949'}} />
              <Text style={{color: '#0d0d0d'}} >آگهی</Text>
              </Button>
              <Button vertical onPress={this.props.onPressMenu} >
                <Icon name="person" style={{color: '#494949'}} />
              <Text style={{color: '#0d0d0d'}}>من</Text>
              </Button>
            </FooterTab>
          </Footer>

    );
  }
}
