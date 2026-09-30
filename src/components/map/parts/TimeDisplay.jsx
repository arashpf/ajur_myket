import React from 'react';
import { View, Text } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';

const timeLabels = {
  week: 'یک هفته',
  month: 'یک ماه',
  threemonths: 'سه ماه',
  all: 'همه',
};

// const options = [
//     { label: 'یک هفته', value: 'week' },
//     { label: 'یک ماه', value: 'month' },
//     { label: 'سه ماه', value: '3months' },
//     { label: 'همه', value: 'all' },
//   ];

const TimeDisplay = ({ timeRange }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Icon name="ios-time" size={20} color="#555" />
      <Text style={{ marginLeft: 6, fontSize: 16, color: '#333' ,fontFamily:'iransans'}}>
        {timeLabels[timeRange]} 
      </Text>
    </View>
  );
};

export default TimeDisplay;
