import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Spinner from 'react-native-spinkit';
import Grid from 'react-native-grid-component';
import WorkerCard from '../cards/WorkerCard';

const History = (props) => {
  const [refreshing, set_refreshing] = useState(false);
  const [data, set_data] = useState([]);
  const [isLoaded, set_isLoaded] = useState(true);
  const [nopost, set_nopost] = useState(false);
  useEffect(() => {
      AsyncStorage.getItem('products').then(existingProducts => {
        let newProduct = JSON.parse(existingProducts);

        if (!newProduct) {
          newProduct = [];
        }
        axios({
          method: 'get',
          url: 'https://api.ajur.app/api/history-workers',
          params: {
            workers_holder: newProduct,
          },
        }).then(function (response) {

          set_data(response.data);
          set_isLoaded(false);
          if (response.data.length == 0) {

              set_nopost(true)
          }
          console.log('the data now is+++++++++++++++++++++ ');
          console.log(response.data);
        });

        console.log(newProduct);
      });
    },[])

  const  rendernoposterror = () => {
  if(nopost == true){
    return(
      <View style={{textAlign:'center',marginTop:20,alignItems:'center',padding:20,justifyContent:'flex-end'}}>



        <Text>هنوز ملکی ای را ندیده اید</Text>


     </View>
    )
  }
}

const renderGridorSpinner = () => {
if(isLoaded == false){
  return(
    <Grid
      style={styles.list}
      renderItem={_renderItem}
      data={data}
      itemsPerRow={1}
      itemHasChanged={(d1, d2) => d1 !== d2}
    />

  )
}else{
  return (
    <View style={styles.spinnerView} >
      <Spinner style={styles.spinner}    isVisible={true} size={30} type='Circle' color='#b92a31'/>
    </View>
  )
}
  }


  _renderItem = (data, i) =>
  <WorkerCard data={data} />
  return (
    <ScrollView>
             {rendernoposterror()}
             {renderGridorSpinner()}
    </ScrollView>
  )
}

const styles = StyleSheet.create({

  spinnerView:{
    flex: 1,
    height:430,
    justifyContent: 'center',
    alignItems: 'center'
  },


});

export default  History
