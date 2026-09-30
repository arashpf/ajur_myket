import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  I18nManager
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {

  HStack,
 
} from 'native-base';

const screenWidth = Dimensions.get("window").width;

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import Spinner from 'react-native-spinkit';
import axios from 'axios';

const Charts = ({route, navigation})  => {
  const { itemId } = route.params;
  const [loading, set_loading] = useState(true);
  const [total, set_total] = useState(0);

  const [labels, set_labels] = useState([]);
  const [days_name, set_days_name] = useState([]);
  const [days_data, set_days_data] = useState([]);
  


  //   function addDays( adddays) {
  //   var d = new Date();
  //   d.setDate(d.getDate() + adddays);
  //   console.log(d.toLocaleDateString('fa-IR'));
  //   var day = String(d.toLocaleDateString('fa-IR'));
  // // return d;
  // return  day;
  // }

  useEffect(() => {

    

    var baseurl = 'https://api.ajur.app/api/single-chart';
    axios({
      method: 'get',
      url: baseurl,
      params: {
        worker_id: itemId,
      },
    })
      .then(function (response) {
        console.log('chart data catched from server is   ==================');
        console.log(response.data);
        set_total(response.data.TotalCounts);
        set_days_name(response.data.days_name);
        set_days_data(response.data.days_data);
  
      
          set_loading(false);

      })

    },[])

    const renderlabels = () => {

      var lbs = [];

      days_name.forEach((name,index)=>{
        
        if(index == 0){
          lbs.push(String('امروز'));
        }else if (index == 1) {
          lbs.push(String('دیروز'));
        }else{
          const p2e = s => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
          const dateFormat = p2e(new Date(name).toLocaleDateString('fa-IR', { month: '2-digit', day: '2-digit' ,year:'2-digit'}))
          console.log(dateFormat)
         
          lbs.push(dateFormat);
        }
      

      })
      return lbs;
    }

    const renderData = () => {

      var d = [];
      days_data.forEach((data,index)=>{
        d.push(data);
      })

      console.log('d right now is ------------');
      console.log(d);
      
       
         return d;

     
    }
  

    if(loading){
      return(
        <View style={styles.spinnerView} >
          <Spinner style={styles.spinner}    isVisible={true} size={30} type='Circle' color='#b92a31'/>
        </View>
      )
    }else{

 

  return (
    
      <View>


          <HStack
             bg="orange.600"
             px="5"
             py="3"
             justifyContent="space-between"
             alignItems="center"
             w="100%"
             maxW="100%">
             <HStack alignItems="center">
               <Text color="white" fontSize="15" fontWeight="bold">
                 <Icon
                   onPress={() => navigation.pop()}
                   style={{color: '#111', fontSize: 24}}
                   name="arrow-back"
                 />
               </Text>
             </HStack>

             <HStack>
               <Text color="white" fontSize="17" fontWeight="bold">
                 آمار و ارقام 
               </Text>
             </HStack>
           </HStack> 

  <LineChart
    data={{
      labels: renderlabels(),
      datasets: [ 
        {
          data: renderData(),
        }
      ]
    }}
    width={Dimensions.get("window").width} // from react-native
    height={400}
    yAxisInterval={1} // optional, defaults to 1
    chartConfig={{
    backgroundColor: "#f9f9f9",
    backgroundGradientFrom: "#f9f9f9",
    backgroundGradientTo: "#f9f9f9",
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 100, 0, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: "5",
        strokeWidth: "2",
        stroke: "#ffa726"
      }
    }}
    
    style={{
      marginVertical: 8,
      borderRadius: 16
    }}
  />

<HStack
             bg="green.500"
             px="7"
             py="6"
             justifyContent="space-between"
             alignItems="center"
             w="100%"
             maxW="100%">
             <HStack alignItems="center">
               <Text color="white" fontSize="15" fontWeight="bold">
                 
                 {total}
               </Text>
             </HStack>

             <HStack>
               <Text color="white" fontSize="17" fontWeight="bold">
                   بازدید کل   
               </Text>
             </HStack>
           </HStack> 


         
           
           
</View>
  )

}

      
 
};
  

const styles = StyleSheet.create({

  spinnerView:{
    flex: 1,
    height:430,
    justifyContent: 'center',
    alignItems: 'center'
  },


});


export default Charts;
