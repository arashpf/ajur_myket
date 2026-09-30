// TODO: report is just a fake section right now , and we dont send real report to cms

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
import Icon from 'react-native-vector-icons/Ionicons';

import {


  Center,

  Box,
  HStack,
  VStack,

  Button,
  useToast,
  Divider

} from 'native-base';

const Report = ({navigation}) => {
  const toast = useToast();
  const [sample, set_sample] = useState(false);

  useEffect(() => {

  }, []);

  const sendReport = () => {

    toast.show({
      render: () => {

        navigation.navigate('Base')
        return <Box bg="green.700" px="15" py="3" rounded="md" mb={5}>
              <Text style={{color:'white',fontSize:16}}>با تشکر ، گزارش شما با موفقیت ثبت شد</Text>
              </Box>;
      }
    });

  }
  return (
    <ScrollView>
      <TouchableOpacity onPress={() => sendReport()}>
        <Box
          w="100%"
          h="16"
          rounded="md"
          flexDirection="row"
          justifyContent="flex-end">
          <Text style={Styles.reportText}>کلاه برداری  یا دروغی است</Text>
        <Icon style={Styles.reportIcon} name="md-flag-outline" />
        </Box>
      </TouchableOpacity>
        <Divider />
      <TouchableOpacity onPress={() => sendReport()}>
        <Box
          w="100%"
          h="16"
          rounded="md"
          flexDirection="row"
          justifyContent="flex-end">
          <Text style={Styles.reportText}>اطلاعات واقعی نیست</Text>
        <Icon style={Styles.reportIcon} name="md-flag-outline" />
        </Box>
      </TouchableOpacity>
        <Divider />
      <TouchableOpacity onPress={() => sendReport()}>
        <Box
          w="100%"
          h="16"
          rounded="md"
          flexDirection="row"
          justifyContent="flex-end">
          <Text style={Styles.reportText}>مشکل قانونی دارد</Text>
        <Icon style={Styles.reportIcon} name="md-flag-outline" />
        </Box>
      </TouchableOpacity>
        <Divider />
      <TouchableOpacity onPress={() => sendReport()}>
        <Box
          w="100%"
          h="16"
          rounded="md"
          flexDirection="row"
          justifyContent="flex-end">
          <Text style={Styles.reportText}>مشکل اخلاقی دارد</Text>
        <Icon style={Styles.reportIcon} name="md-flag-outline" />
        </Box>
      </TouchableOpacity>
        <Divider />
      <TouchableOpacity onPress={() => sendReport()}>
        <Box
          w="100%"
          h="16"
          rounded="md"
          flexDirection="row"
          justifyContent="flex-end">
          <Text style={Styles.reportText}>مشاور این آگهی کلاه بردار است</Text>
        <Icon style={Styles.reportIcon} name="md-flag-outline" />
        </Box>
      </TouchableOpacity>
      <Divider />

      <TouchableOpacity onPress={() => sendReport()}>
        <Box
          w="100%"
          h="16"
          rounded="md"
          flexDirection="row"
          justifyContent="flex-end">
          <Text style={Styles.reportText}>دلایل دیگری برای گزارش این ملک دارم</Text>
        <Icon style={Styles.reportIcon} name="md-flag-outline" />
        </Box>
      </TouchableOpacity>

    </ScrollView>
  );
};

const Styles = StyleSheet.create({


  reportText : {
    color:'#444',
    fontSize:14,
    textAlign:'right',
    paddingTop:12,
    fontFamily: "IRAN Sans"
  },

  reportIcon : {
    color:'black',
    // color:'silver',
    fontSize:24,
    textAlign:'right'
    ,padding:10
  }



});

export default Report;
