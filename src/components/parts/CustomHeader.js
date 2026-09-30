import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Text,
} from 'react-native';

import {
  Container,
  Header,
  Center,
  StatusBar,
  Box,
  HStack,
  VStack,
  Avatar,
} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Spinner from 'react-native-spinkit';
import { useNavigation } from '@react-navigation/native';

const CustomHeader =  props => {
  const navigation = useNavigation();
  const { title } = props;

  useEffect(() => {


  }, []);
  return (
     <>
        <StatusBar bg="#3700B3" barStyle="light-content" />
        <Box safeAreaTop bg="violet.600" />
        <HStack bg="white.600" px="5" py="3" justifyContent="space-between" alignItems="center" w="100%" maxW="100%">
          <HStack alignItems="center">
            <Text color="gray" fontSize="15" fontWeight="bold">
              <Icon onPress={()=> navigation.pop()}  style={{color:'#444',fontSize:24}} name="arrow-back" />
            </Text>
          </HStack>

          <HStack>

          <Text color="gray" fontSize="19" fontWeight="600">
            {title}
          </Text>
          </HStack>
        </HStack>
      </>
  );
};

export default CustomHeader;
