import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Spinner from 'react-native-spinkit';

const Test = props => {
  const [sample, set_sample] = useState(false);

  useEffect(() => {
    

  }, []);
  return (
    <ScrollView>
      <Text>worker single detail come here </Text>

    </ScrollView>
  );
};

export default Test;
