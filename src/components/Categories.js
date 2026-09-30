/* @flow */

import React, { Component } from 'react';
import {
  View,
  Image,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView

} from 'react-native';
import { Container, Header, Content, List, ListItem, Text, Left, Right,Body, Item, Input,Icon, Button,CardItem,Thumbnail  } from 'native-base';
import Spinner from 'react-native-spinkit';
import axios from 'axios';

// import { Actions } from 'react-native-router-flux';


// const iconsImages = {
//     gps: require('./assets/icons/touch-in.png'),
//     home: require('./assets/icons/home.png'),
//     office: require('./assets/icons/office.png'),
//     inductry: require('./assets/icons/inductry.png'),
//     land: require('./assets/icons/land.png'),
//     sport: require('./assets/icons/sport.png'),
//     vacations: require('./assets/icons/vacations.png'),
//     wedding: require('./assets/icons/wedding.png'),
// }

// const iconsImages = {
//   home: require('../assets/icons/sell-villa.png'),
//   land: require('../assets/icons/sell-villa.png'),
//   office: require('../assets/icons/sell-villa.png'),
//   industry: require('../assets/icons/sell-villa.png'),
//   renthome: require('../assets/icons/sell-villa.png'),
//   rentoffice: require('../assets/icons/sell-villa.png'),
//   rentindustry: require('../assets/icons/sell-villa.png'),
// };



export default class Categories extends Component {


  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      Basecategories: [],
      selectedCat : null,
      realstates:[]
    };

    var self = this;






    axios({
          method:'get',
          // url:'https://irabist.ir/api/mainpage-other-basecategories',
          // url:'http://localhost/iracharweb/public/api/base-category',
          // url:'http://localhost/iracharweb/public/api/sub-category',
          url:'https://api.ajur.app/api/base-category',
    })
  .then(function (response) {
     self.setState({  Basecategories:response.data , loading:false});


  });
}

componentWillUnmount(){
      this.mounted = false;
}

renderRealstateStars(realstate){

    if(realstate.stars == 1){
      return(
        <Button transparent >
          <Icon  style={{color:'gold',fontSize:16}} name="ios-star" />
          <Icon  style={{color:'silver',fontSize:16}} name="ios-star-outline" />
          <Icon  style={{color:'silver',fontSize:16}} name="ios-star-outline" />
          <Icon  style={{color:'silver',fontSize:16}} name="ios-star-outline" />
          <Icon  style={{color:'silver',fontSize:16}} name="ios-star-outline" />
      </Button>
      )
    }else if(realstate.stars == 2){
      return(
       <Button transparent textStyle={{color: 'orange'}}>
          <Icon  style={{color:'gold',fontSize:16}} name="ios-star" />
          <Icon  style={{color:'gold',fontSize:16}} name="ios-star" />
          <Icon  style={{color:'silver',fontSize:16}} name="ios-star-outline" />
          <Icon  style={{color:'silver',fontSize:16}} name="ios-star-outline" />
          <Icon  style={{color:'silver',fontSize:16}} name="ios-star-outline" />
      </Button>
      )
    }
    else if(realstate.stars == 3){
      return(
        <Button transparent textStyle={{color: 'orange'}}>
          <Icon  style={{color:'gold',fontSize:16}} name="ios-star" />
          <Icon  style={{color:'gold',fontSize:16}} name="ios-star" />
          <Icon  style={{color:'gold',fontSize:16}} name="ios-star" />
          <Icon  style={{color:'silver',fontSize:16}} name="ios-star-outline" />
          <Icon  style={{color:'silver',fontSize:16}} name="ios-star-outline" />
      </Button>
      )
    }
    else if(realstate.stars == 4){
      return(
       <Button transparent textStyle={{color: 'orange'}}>
          <Icon  style={{color:'gold',fontSize:16}} name="ios-star" />
          <Icon  style={{color:'gold',fontSize:16}} name="ios-star" />
          <Icon  style={{color:'gold',fontSize:16}} name="ios-star" />
          <Icon  style={{color:'gold',fontSize:16}} name="ios-star" />
          <Icon  style={{color:'silver',fontSize:16}} name="ios-star-outline" />
      </Button>
      )
    }
    else if(realstate.stars == 5){
      return(
        <Button transparent textStyle={{color: 'orange'}}>
          <Icon  style={{color:'gold',fontSize:16}} name="ios-star" />
          <Icon  style={{color:'gold',fontSize:16}} name="ios-star" />
          <Icon  style={{color:'gold',fontSize:16}} name="ios-star" />
          <Icon  style={{color:'gold',fontSize:16}} name="ios-star" />
          <Icon  style={{color:'gold',fontSize:16}} name="ios-star" />
      </Button>
      )
    }
    else{

    }
  }


  onPressingSingleBasecategory(cat) {
    const userInitialLat = '35.6892'; // Tehran fallback
    const userInitialLong = '51.3890';
  
    const choosedcat = cat.cat;
  
    this.setState({ userInitialLat, userInitialLong });
  
    if (choosedcat.has_child != 0) {
      const self = this;
      self.setState({ Basecategories: [], loading: true, selectedCat: choosedcat });
  
      axios({
        method: 'get',
        url: 'https://api.ajur.app/api/category-childs',
        params: {
          id: choosedcat.id,
          title: 'title',
          lat: userInitialLat,
          long: userInitialLong,
        },
      })
      .then(function (response) {
        console.log('the realstate fetch here is ');
        console.log(response.data.realstates);
        self.setState({
          Basecategories: response.data.categories,
          realstates: response.data.realstates,
          loading: 'false'
        });
      })
      .catch(function (error) {
        console.log(error);
        self.setState({ loading: 'false' });
      });
    } else {
      // Actions.Main({choosedcat});
    }
  }

  renderCategoryItem({cat}){
    console.log(cat);

    if(cat.has_parent == 0){
      return(
        <ListItem   onPress= { () => this.onPressingSingleBasecategory({ cat })}  >
          <Left>
            <Button disabled transparent>


            </Button>
          </Left>
          <Body>
            <Text style={{paddingRight:30,fontSize:17, fontWeight: '400', textAlign:'right',fontFamily: 'IRAN Sans',}}>{ cat.name }</Text>
          </Body>
          <Right>
            {/* <Image source={iconsImages[cat.avatar]} style={{height:48, width: 48, flex: 1,}}/> */}
          </Right>
        </ListItem>
      )
    }else{
      return(
        <ListItem   onPress= { () => this.onPressingSingleBasecategory({ cat })}  >
          <Left>
            <Button disabled transparent>


            </Button>
          </Left>


            <Text style={{paddingRight:30,fontSize:17, fontWeight: '400', textAlign:'right'}}>{ cat.name }</Text>

        </ListItem>
      )
    }

  }

  renderBasecategories(){

    if(this.state.loading == true){
      // if(1){
      return(
        <View style={styles.spinnerView} >
          <Spinner style={styles.spinner}    isVisible={true} size={40} type='Circle' color='orange'/>
        </View>
      )
    }else{

      return this.state.Basecategories.map(cat =>



        <View  key={cat.id}>
          {this.renderCategoryItem({cat})}
        </View>

);
    }
  }

  onPressingSingleRealstate(realstate){
    console.log(realstate);
    // Actions.Rshow(realstate);
  }


  renderRealstates(){
    if(this.state.selectedCat != null && this.state.loading == 'false'){
      return this.state.realstates.map(realstate =>
        <View key={realstate.id} >
        <TouchableOpacity style={styles.ads} onPress= { () => this.onPressingSingleRealstate({ realstate })} >
        <ImageBackground source={{uri: realstate.realstate_url}}  style={styles.adsImage}>
          <CardItem style={styles.realstateheader}>
            <Left>
              <Thumbnail source={{uri: realstate.profile_url}} style={styles.realstateIcon}/>
            </Left>
            <Body>

            </Body>
            <Right>
              {this.renderRealstateStars(realstate)}
            </Right>
          </CardItem>
        </ImageBackground>
        <View style={styles.scrollViewTitleWrapper}>

        <Text style={styles.realstateDistanceButton}>{realstate.distance} km</Text>
        <View style={{flexDirection:'row',justifyContent:'space-around',}}>
          <Text style={styles.realstateDistanceButton}>{realstate.worker_count} </Text>
          <Icon style={{color:'#999'}} name='md-albums-outline'  />
        </View>

      <Text style={styles.scrollViewAddTitle}>املاک {realstate.realstate} </Text>

        </View>
        </TouchableOpacity>
        </View>
      );
    }
  }

  generate(title){

    var self = this;
    self.setState({  Basecategories:[] , loading:true ,selectedCat:null});

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


            })


}

onPressingBredcrumb(){


















  var self = this;
  self.setState({  loading:true});
  axios({
        method:'get',
        // url:'https://irabist.ir/api/mainpage-other-basecategories',
        // url:'http://localhost/iracharweb/public/api/base-category',
        // url:'http://localhost/iracharweb/public/api/sub-category',
        url:'https://api.ajur.app/api/base-category',
  })
.then(function (response) {
   self.setState({  Basecategories:response.data , loading:false,selectedCat:null});


});
}

  bredcrumb(){
    if(this.state.selectedCat != null){

        var cat = this.state.selectedCat


      return (

        <ListItem
          style={{backgroundColor:'white'}}
             onPress= { () => this.onPressingBredcrumb({ cat })}  >
            <Left>
              <Button disabled transparent>

            <Icon active name="arrow-back"  />
              </Button>
            </Left>

              <Text style={{paddingRight:0, fontWeight: '400',fontFamily: 'IRAN Sans',}}>زیر دسته های {this.state.selectedCat.name}</Text>
        </ListItem>

      )
    }else{

    }
  }

  renderRealstateHint(){
      if(this.state.selectedCat != null && this.state.loading == 'false'){
      return(
        <View style={styles.scrollViewTitleWrapper}>
        <Text style={styles.scrollViewAllTitle}>همه</Text>
      <Text style={styles.scrollViewTitle}>بهترین مشاورین املاک آجر در نزدیکی شما</Text>
        </View>
      )
    }
  }

  render() {
    return (
      <Container>
        <Content>

            {this.bredcrumb()}
          <List>
                {  this.renderBasecategories() }
          </List>

          {this.renderRealstateHint()}
          <ScrollView
              contentOffset={{x:290}}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              pagingEnabled={false}>
              {this.renderRealstates()}
          </ScrollView>
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

  ads: {
    backgroundColor:'#444',
    height:200,
    width:300,
    borderRadius:10,
    margin:10
  },

  adsImage: {
    height:150,
    width:300,
    borderTopLeftRadius: 10,
    borderTopRightRadius:10
  },

  realstateheader: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    height: Dimensions.get('window').height/15,
  },

  realstateIcon: {

    marginTop:20,
    borderWidth:2,
    borderColor:'gray',

  },

  scrollViewTitleWrapper: {
    flexDirection:'row',
    justifyContent:'space-between',
    margin:10,
  },

  scrollViewDescriptionWrapper: {
    flexDirection:'row',
    justifyContent:'flex-end',
    paddingRight:10,
    backgroundColor:'#444',

  },

  realstateDistanceButton: {

    padding:5,
    borderRadius:5,
    color:"#f9f9f9",
    fontSize:14

  },

  scrollViewAddTitle: {
    color:'#f4f4f4',
    fontFamily: 'IRAN Sans',
    padding:5,

  },

  scrollViewAddDescription:{
    color:'#f4f4f4',
    fontFamily: 'IRAN Sans',
      padding:5,


  }




  });
