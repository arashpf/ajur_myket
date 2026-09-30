/* @flow */

import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,

} from 'react-native';
import { Container, Header, Content, List, ListItem, Text, Left, Right,Body, Item, Input,Icon, Button,CardItem,Thumbnail  } from 'native-base';
import Spinner from 'react-native-spinkit';
import axios from 'axios';

import { Actions } from 'react-native-router-flux';

const iconsImages = {
    gps: require('../assets/gps.png'),
    repair: require('../assets/repair-tool.png'),
}



export default class categoryIndex extends Component {


  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      Basecategories: [],
    };

    var self = this;






    axios({
          method:'get',
          // url:'https://irabist.ir/api/mainpage-other-basecategories',
          // url:'http://localhost/iracharweb/public/api/base-category',
          // url:'http://localhost/iracharweb/public/api/sub-category',
          url:'https://api.ajur.app/api/sub-category',
    })
  .then(function (response) {
     self.setState({  Basecategories:response.data , loading:false});


  });
}


  onPressingSingleBasecategory( cat ) {
    choosedcat = cat.cat;

     Actions.Main({choosedcat});


  }

  renderBasecategories(){
    if(this.state.loading == true){
      // if(1){
      return(
        <View style={styles.spinnerView} >
          <Spinner style={styles.spinner}    isVisible={true} size={30} type='Circle' color='#b92a31'/>
        </View>
      )
    }else{
      return this.state.Basecategories.map(cat =>



        <View   key={cat.id}>
        <ListItem   onPress= { () => this.onPressingSingleBasecategory({ cat })}  >





            <Left>
              <Button disabled transparent>
                <Icon active name="arrow-back" />


              </Button>
            </Left>




              <Text style={{paddingRight:20, fontSize:20, textAlign:'right',fontFamily:'IRAN Sans'}}>{ cat.name }</Text>


          {/* <Icon style={{color:'#696969', paddingLeft:5}} name='ios-home' /> */}




        </ListItem>
        </View>

);
    }
  }

  generate(title){

    var self = this;
    self.setState({  Basecategories:[] , loading:true});

    axios({
              method:'get',
              // url:'http://localhost/iracharweb/public/api/search-category',
              url:'https://api.ajur.app/api/search-category',

              params: {
                title: title,
              },
            })

          .then(function (response) {
              self.setState({  Basecategories:response.data , loading:'false'});
              console.log('generate new querry');

            })


}

  render() {
    return (
      <Container>
        <Content>
            <Item>
              <Input
                placeholder="جستوی دسته بندی"
                returnKeyLabel = {"search"}
                onChangeText={(title) => this.setState({ data: this.generate(title)})}
                style = { styles.input }
              />
            <Icon name="ios-search" />
            </Item>
          <List>
                {  this.renderBasecategories() }
          </List>
        </Content>
      </Container>

    );
  }
}


const styles = StyleSheet.create({
    slide: {
      justifyContent: 'center',
      marginTop:10,
      marginBottom:10
    },
    title: {
    },
    relatedProductImage: {
        height: 160,
        width: Dimensions.get('window').width/2,
        justifyContent: 'space-around',
    },
    spinnerView:{
      flex: 1,
      height:430,
      justifyContent: 'center',
      alignItems: 'center'
    },

    spinner:{


    },

    wrapper: {
      height: 430,
  },
  slide1: {

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  categoryText: {
    fontFamily: "IRAN Sans",
  },

  headerText: {
    fontFamily: "IRAN Sans",
  },
  input: {
    margin: 15,
    height: 40,
    // borderColor: 'orange',
    borderWidth: 1,
    textAlign: 'right'
 },




  });
