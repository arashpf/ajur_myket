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
import {Box ,Divider,Button,HStack,Stack,Center} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';

const WorkerDetails = props => {
  const [sample, set_sample] = useState(false);
    const { details,realstate,properties } = props;

  useEffect(() => {


  }, []);


  function renderPropertiesKinds3(pro){
    if(pro.type == '3'){
      return(
        <View style={Styles['worker_properties_list']}>
            <View style={Styles['worker_properties_list_left']} >
            <Text style={Styles['worker_properties_key_text']} >{pro.key}</Text>
            </View>
            <View style={Styles['worker_properties_list_right']} >
            <Text  style={Styles['worker_properties_value_text']}>{pro.value}</Text>
            </View>
        </View>


      )
    }

  }

  function renderPropertiesKinds1(pro){
    if(pro.type == '1'){
      return(
        <View style={Styles['worker_properties_list']}>
            <View style={Styles['worker_properties_list_left']} >
            <Text  style={Styles['worker_properties_key_text']}>{pro.key}</Text>
            </View>
            <View style={Styles['worker_properties_list_right']} >
            <Text  style={Styles['worker_properties_value_text']}>{pro.value}</Text>
            </View>
        </View>


      )
    }

  }

  function renderPropertiesKinds2(pro){
    if(pro.type == '2'){
      return(
        <Text style={Styles.properties_king_2_button}>
        {pro.key}  <Icon name="checkmark" size={15} color="green" />
        </Text>
      )
    }

  }

  const renderProperties1 = () => {
  return properties.map(pro =>
    <View key={pro.id}   xs={12} md={12}>
        {renderPropertiesKinds1(pro)}
       
    </View>
  );
}

const renderProperties2 = () => {
  return properties.map(pro =>
    <Center style={{}}>
        {renderPropertiesKinds2(pro)}
        
    </Center>
  );
}

const renderProperties3 = () => {
  return properties.map(pro =>
    
    <View key={pro.id}   xs={12} md={12}>
        {renderPropertiesKinds3(pro)}
        
    </View>
    

  );
}
  return (
    <View style={{backgroundColor:'white'}}>

 
<View style={{height:70}}>
      <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={false}>
            {renderProperties2()}
      </ScrollView>
    </View>



    <Box>
          {renderProperties1()}
    </Box>


    {/* <Text style={Styles.title} >امکانات این ملک</Text> */}

    

    <Box>
          {renderProperties3()}
    </Box>

    </View>
  );
};

const Styles = StyleSheet.create({

  title :{
    margin:10,
    paddingTop:10,
    paddingBottom:10,
    fontSize:16,
    color:'#444'
  },
  worker_properties_list : {
    display:'flex',
    flexDirection:'row-reverse',
    justifyContent:'space-between',
    margin: 10,
    padding:5,
  
  
  

},



  worker_properties_list_left : {

  textAlign: 'left',
  marginRight: 5,
  fontFamily:'iransans',
  
},

  worker_properties_list_right : {
    textAlign: 'right',
    fontFamily:'iransans',
    fontSize:30

},

properties_button_wrapper : {

},

properties_king_2_button : {
  paddingLeft:17,
  paddingRight:17,
  paddingTop:10,
  paddingBottom:10,
  margin:15,
  borderWidth:.5,
  borderRadius:5,
  borderColor:'green',
},

worker_properties_key_text: {
 fontFamily:'iransans',
 fontSize:18,
 color:'#444'
},

worker_properties_value_text: {
  fontFamily:'iransans',
  fontSize:18,
  color:'#444'
}


});



export default WorkerDetails;
