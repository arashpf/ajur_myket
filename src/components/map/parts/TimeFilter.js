import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const TimeFilter = ({ onSelect,  timeRange }) => {
  const [selected, setSelected] = useState(timeRange);

  useEffect(() => {
    // Update internal state if defaultValue changes from parent
    setSelected(timeRange);
  }, [timeRange]);

  const options = [
    { label: 'یک هفته', value: 'week' },
    { label: 'یک ماه', value: 'month' },
    { label: 'سه ماه', value: 'threemonths' },
    { label: 'همه', value: 'all' },
  ];

  const handleSelect = (value) => {
    setSelected(value);
    onSelect?.(value); // call parent callback
  };

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => handleSelect(option.value)}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            backgroundColor: selected === option.value ? '#ff6600' : '#eee',
            borderRadius: 20,
            marginHorizontal: 4,
          }}
        >
          <Text style={{ color: selected === option.value ? '#fff' : '#333' }}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TimeFilter;
