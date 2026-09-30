

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text,Title, Button, Icon, Left, Body, Right, } from 'native-base';
import axios from 'axios';
import Spinner from 'react-native-spinkit';
import {phonecall, text, web } from 'react-native-communications';

import Grid from 'react-native-grid-component'; // 1.0.6
import { Actions } from 'react-native-router-flux';

export default class MyMessages extends Component {

  state = { data: [], chunkCounter: 1, isLoaded: true};
  UNSAFE_componentWillMount() {

  AsyncStorage.getItem('id_token').then((token) => {
      console.log('token in MyAdds section trigered');
      console.log(token);
      var self = this;
      axios({
              method:'get',
              url:'https://irabist.ir/api/get-user-messages',
              params: {
                token: token,
              },
            })
      .then(function (response) {
        self.setState({  data:response.data, isLoaded: false});
        console.log('the data now is ');
        console.log(response.data);

        axios({
                method:'get',
                url:'https://irabist.ir/api/get-user-ms-readed',
                params: {
                  token: token,
                },
              })
        .then(function (response) {
          console.log('the data now is ');
          console.log(response.data);
               })






             })
        });

  }


      onPressingSinglePost ( data ) {

        Actions.SinglePost({ data });
      }

      onPressingCall( data ){
        console.log('when call button trigered we have this data');
        console.log(data);
        phonecall(data.post_phone, false);
      }

      onPressingSms( data ){
        console.log('when sms button trigered we have this data');
        console.log(data);
        text(data.post_phone);
      }

      onPressingUnbookmark( data ) {
        console.log('when unbookmarked button trigered we have this data');
        console.log(data);
      }

  _renderItem = (data, i) =>

          <CardItem bordered warning  style={{textAlign:'right'}}>

              <Text style={{textAlign:'right'}}>
              {data.body}
              </Text>

          </CardItem>


    renderGridorSpinner() {
  if(this.state.isLoaded == false){
    return(
      <View>
      <Header>
          <Left>
            <Button transparent >

            </Button>
          </Left>
          <Body>
            <Title>irabist</Title>
          </Body>
          <Right>
            <Button transparent >

            </Button>
          </Right>
        </Header>


            <Grid

              renderItem={this._renderItem}
              data={this.state.data}
              itemsPerRow={1}
              itemHasChanged={(d1, d2) => d1 !== d2}

            />

        </View>

    )
  }else{
    return (
      <View style={styles.spinnerView} >
        <Spinner style={styles.spinner}    isVisible={true} size={100} type='Circle' color='#494949'/>
      </View>
    )
  }
    }





    onPressingDeleteAdd(data){
    console.log('this gallery id will delete are you sure?if you not its late!!!');
    let id = data.id;
    console.log(id);

      AsyncStorage.getItem('id_token').then((token) => {
      var self = this;
      axios({
              method:'post',
              url:'https://irabist.ir/api/destroy-post',
              params: {
                token: token,
                id:id,
              },
            })
      .then(function (response) {
        console.log('some information about deleted add');
        console.log(response.data);

        if(response.data.status == 200){

          console.log('gallery deleted successfully!!!');

          console.log('new gallery set is : ');

          axios({
                  method:'get',
                  url:'https://www.pinookio.ir/api/get-user-galleries',
                  params: {
                    token: token,
                  },
                })
          .then(function (user) {
            console.log(user.data);
              self.setState({ galleries: user.data, loading: 'false' })
           })






                 Toast.show({
                          text: "گالری با موفقیت حذف شد",

                             position: "top",
                          textStyle: { color: "white",'fontSize':16,textAlign:'center' },

                          duration: 30000,
                          buttonText: "باشه",
                          buttonTextStyle: { color: "#008000" },
                          buttonStyle: { backgroundColor: "#5cb85c" }




                        })


        }else{


          Toast.show({
                   text: 'مشکلی پیش آمده،مجددا تلاش کنید',

                   position: 'bottom',
                   textStyle: { color: "white",'fontSize':16,textAlign:'center' },

                   duration: 10000,
                   buttonText: "Okay",
                   buttonTextStyle: { color: "#008000" },
                   buttonStyle: { backgroundColor: "#5cb85c" }




                 })

        }



    }).catch(function (error) {
    // handle error
    console.log(error);


    Toast.show({
             text: 'نه ، گالری پاک نشد، ،مشکلی پیش آمده',

             position: 'bottom',
             textStyle: { color: "white",'fontSize':14,textAlign:'center' },

             duration: 10000,
             buttonText: "باشه",
             buttonTextStyle: { color: "#008000" },
             buttonStyle: { backgroundColor: "#5cb85c" }




           })
  });





})

  }



  render() {
    return (


      <Container>
          <Content>

      {this.renderGridorSpinner()}
          </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({


  spinnerView:{
    flex: 1,
    height:430,
    justifyContent: 'center',
    alignItems: 'center'
  },

  spinner:{


  }
});
