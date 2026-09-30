import React, { Component } from 'react';
import {  View } from 'react-native';
import { Container, Header, Content, List, ListItem, Text,Button, Icon, Left, Body, Right, Switch, Form,Input,Item,Label,Card, CardItem, Thumbnail } from 'native-base';
import axios from 'axios';
import Spinner from 'react-native-spinkit';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default class Settings extends Component {

  state = { user: null , name:null, email: null, nickname: null ,id:null ,url: null,premium: null ,loading: 'true'};
      UNSAFE_componentWillMount() {
        AsyncStorage.getItem('id_token').then((token) => {
          console.log('i now the token is: ');
          console.log(token);
          var self = this;


          axios({
                  method:'post',
                  url:'https://irabist.ir/api/post-user-login',
                  params: {
                    token: token,
                  },
                })
          .then(function (user) {
              console.log('now the actula user is: ');
              self.setState({ user: user.data.user,
                              name: user.data.user.name,
                              family:user.data.user.family,
                              email: user.data.user.email,
                              premium:user.data.user.is_premium,
                              url:user.data.user.url,
                              loading: 'false' })
              console.log(user.data.user);
           })
        });
      }

renderUseAccountType(){


  if(this.state.premium == "1"){
    return(
    <Text>دارای اکانت طلایی</Text>
    )
  }else{
    return(
      <Text>اکانت عادی</Text>
    )

  }



}

  parseUser() {

      if(this.state.loading == 'false'){

        return (

          <Content>


            <Card>
              <CardItem>
                <Left>
                  <Thumbnail source={{uri: this.state.url}} />
                <Right>
                    <Text>{this.state.name} {this.state.family}</Text>

                  <Text note>{this.renderUseAccountType}</Text>
              </Right>
                </Left>
              </CardItem>


            </Card>

            <Card>

                <Form>

                  <Item inlineLabel>
                    <Input
                      value={this.state.name}
                      onChangeText={(name) => this.setState({name})}

                      />
                  <Label>نام</Label>
                  </Item>

                  <Item inlineLabel>
                    <Input
                      value={this.state.family}
                      onChangeText={(family) => this.setState({family})}
                      />
                    <Label>نام فامیل</Label>
                  </Item>



                  <Item inlineLabel last>
                    <Input
                      value={this.state.email}
                      onChangeText={(email) => this.setState({email})}
                       />
                  <Label>ایمیل</Label>
                  </Item>



                </Form>

            </Card>


            <Card>
              <Button
                block
                info
                onPress= { () => this.updateUser()}
                >
              <Text>تایید</Text>
            </Button>
            </Card>
          </Content>

        )


      }else{

        return(
          <View style={styles.spinnerView}>
            <Spinner  isVisible={true} size={30} type='Circle' color='#b92a31'/>
          </View>
        )

      }

  }


  updateUser(){

    AsyncStorage.getItem('id_token').then((token) => {
      console.log('i get the token again and now the token is: ');

      var self = this;
      axios({
              method:'post',
              url:'https://irabist.ir/api/user-update',
              params: {
                token: token,
                name: self.state.name,
                family: self.state.family,
                email: self.state.email,


              },
            })
      .then(function (user) {

       })
     })






    Actions.CitySelection();
  }

  render() {
    return (
      <Container>

        {this.parseUser()}

      </Container>
    );
  }
}

const styles = {
  spinnerView:{
    flex: 1,
    height:430,
    justifyContent: 'center',
    alignItems: 'center'
  },
  spinner:{

  }
}
