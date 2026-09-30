import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import {Container,VStack,Divider, Box,Button,Avatar,Icon} from 'native-base';
import Grid from 'react-native-grid-component';
import axios from 'axios';
import Spinner from 'react-native-spinkit';


import WorkerCard from './cards/WorkerCard';
import RealEstateCard from './cards/RealEstateCard';
import CustomHeader from './parts/CustomHeader';
const Nearests = ({route, navigation}) => {

    const { cat } = route.params;
  const [data, set_data] = useState([]);
  const [subcategories, set_subcategories] = useState([]);
  const [realstates, set_realstates] = useState([]);
  const [selectedcat, set_selectedcat] = useState(cat.id);
  const [selectedcatname, set_selectedcatname] = useState(cat.name);
  const [isLoaded, set_isLoaded] = useState(true);
  const [nopost, set_nopost] = useState(false);
  const [userInitialLat, set_userInitialLat] = useState(null);
  const [userInitialLong, set_userInitialLong] = useState(null);
  

  


  useEffect(() => {
    onPressingSingleCat({cat});
  }, [cat]);

  const onPressingSingleCat = ({cat}) => {
    const userInitialLat = '35.6892';
    const userInitialLong = '51.3890';

    console.log(cat.name);
    set_selectedcat(cat.id);
    set_selectedcatname(cat.name);
    set_data([]);
    set_isLoaded(true);
    set_userInitialLat(userInitialLat);
    set_userInitialLong(userInitialLong);

    axios({
      method: 'get',
      url: 'https://api.ajur.app/api/worker-nearest',
      params: {
        title: 'title',
        lat: userInitialLat,
        long: userInitialLong,
        selectedcat: cat.id,
      },
    })
    .then(function (response) {
      console.log('the realstates catched is : ==================');
      console.log(response.data.realstates);

      set_data(response.data.workers);
      set_subcategories(response.data.subcategories);
      set_realstates(response.data.realstates);
      set_isLoaded(false);
    })
    .catch(function (error) {
      console.log(error);
      set_isLoaded(false);
    });
  };



  const renderCategories = () => {
    return subcategories.map(cat => (
      <TouchableOpacity key={cat.id} onPress={() => onPressingSingleCat({cat})}>
        <Text
          style={{
            margin: 5,
            padding: 8,
            borderColor: '#888',
            borderWidth: 1,
            borderColor: 'orange',
            borderRadius: 5,
            backgroundColor: selectedcat == cat.id ? 'orange' : 'white',
          }}>
          {cat.name}
        </Text>
      </TouchableOpacity>
    ));
  };

  const renderCategorySliders = () => {
    return (
      <View style={{height: 60}}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={false}>
          {renderCategories()}
        </ScrollView>
      </View>
    );
  };

  const rendernoposterror = () => {
    if (data.length < 1 && isLoaded == false) {
      return (
        <View
          style={{
            textAlign: 'center',
            marginTop: 20,
            alignItems: 'center',
            padding: 20,
            justifyContent: 'flex-end',
          }}>
          <Button variant="outline">
            <Text style={{fontFamily: 'IRAN Sans'}}>
              متاسفانه فایلی در این قسمت وجود ندارد
            </Text>
          </Button>
        </View>
      );
    }
  };

  const renderRealstateHint = () => {
    if (selectedcat != 0 && isLoaded == false) {
      return (
        <View style={styles.scrollViewTitleWrapper}>
          <Text style={styles.scrollViewAllTitle}>همه</Text>
          <Text style={styles.scrollViewTitle}>
            مشاورینی که {selectedcatname} در منطقه شما دارند
          </Text>
        </View>
      );
    }
  };

  const renderRealstates = () => {



   return realstates.map(realstate =>
       <RealEstateCard realstate={realstate} />
   );

 }

  const renderItem = (data, i) => <WorkerCard data={data} />;

  const renderGridorSpinner = () => {
    if (isLoaded == false) {
      return (
        <ScrollView>
          {renderRealstateHint()}

          <ScrollView
            contentOffset={{x: 290}}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={false}>
            {renderRealstates()}
          </ScrollView>

          <Grid
            style={styles.list}
            renderItem={renderItem}
            data={data}
            itemsPerRow={1}
            itemHasChanged={(d1, d2) => d1 !== d2}
          />
        </ScrollView>
      );
    } else {
      return (
        <View style={styles.spinnerView}>
          <Spinner
            style={styles.spinner}
            isVisible={true}
            size={30} type='Circle' color='#b92a31'
          />
        </View>
      );
    }
  };

  return (
    <Container style={styles.container}>
      <CustomHeader title={selectedcatname} />
      {renderCategorySliders()}
      {rendernoposterror()}
      {renderGridorSpinner()}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: Dimensions.get('window').width,
  },
  item: {
    flex: 1,
    height: 135,
    paddingBottom: 3,
    marginLeft: 1,
    marginRight: 1,
    marginTop: 12,

    backgroundColor: '#fff',
    flexDirection: 'row',
    borderBottomColor: '#f2f2f2',
    borderStyle: 'solid',
    borderBottomWidth: 1,
  },
  list: {
    flex: 1,
  },

  spinnerView: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,

    justifyContent: 'center',
    alignItems: 'center',
  },

  ads: {
    backgroundColor: '#444',
    height: 200,
    width: 300,
    borderRadius: 10,
    margin: 10,
  },

  adsImage: {
    height: 150,
    width: 300,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  realstateheader: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    height: Dimensions.get('window').height / 15,
  },

  realstateIcon: {
    marginTop: 20,
    borderWidth: 2,
    borderColor: 'gray',
  },

  scrollViewTitleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },

  scrollViewDescriptionWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 10,
    backgroundColor: '#444',
  },

  realstateDistanceButton: {
    padding: 5,
    borderRadius: 5,
    color: '#f9f9f9',
    fontSize: 14,
  },

  scrollViewAddTitle: {
    color: '#f4f4f4',
    fontFamily: 'IRAN Sans',
    padding: 5,
  },

  scrollViewAddDescription: {
    color: '#f4f4f4',
    fontFamily: 'IRAN Sans',
    padding: 5,
  },
});

export default Nearests;
