/* @flow */

import React, { Component } from 'react';
import {

  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,

} from 'react-native';
import { Container, Header, Content, List, ListItem, Text, Left, Right,Body, Icon, Button,CardItem,Thumbnail  } from 'native-base';
import Spinner from 'react-native-spinkit';
import axios from 'axios';
import { createAnimatableComponent, View } from 'react-native-animatable';
import { Actions } from 'react-native-router-flux';


export default class BaseCategories extends Component {




  state = {  loading: 'false',Basecategories: [] };
  UNSAFE_componentWillMount() {
    var self = this;






    axios({
          method:'get',
          url:'https://irabist.ir/api/mainpage-other-basecategories',
    })
  .then(function (response) {
     self.setState({  Basecategories:response.data , loading:false});
  })
  }

  onPressingSingleBasecategory( cat ) {
    cat = cat.cat;
    Actions.Categories({cat});

  }

  renderBasecategories(){
    if(this.state.loading == 'false'){
      return(
        <View style={styles.spinnerView} >
            <Spinner style={styles.spinner}    isVisible={true} size={30} type='Circle' color='#b92a31'/>
        </View>
      )
    }else{
      return this.state.Basecategories.map(cat =>



        <View animation="fadeInUpBig"  delay={ cat.sort * 3   } key={cat.id}>
        <ListItem   onPress= { () => this.onPressingSingleBasecategory({ cat })}  >





            <Left>
              <Button disabled transparent>
                <Icon active name="arrow-back"  />

              </Button>
            </Left>


              <Text style={{paddingRight:10, fontWeight: '600'}}>{ cat.name }</Text>
            <Icon style={{color:'#696969', paddingLeft:5}} name={cat.thumb} />



        </ListItem>
        </View>

);
    }
  }

  render() {
    return (
      <Container>

        <Content>
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
  }




  });
