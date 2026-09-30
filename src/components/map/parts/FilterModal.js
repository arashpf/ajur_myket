import React from 'react';
import {Modal, View, ScrollView, TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const FilterModal = ({visible, onClose}) => {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={{flex: 1, padding: 20}}>
        <ScrollView>
          {/* TODO: Add your filter UI here (categories, tick fields, range filters, time filter) */}
        </ScrollView>

        <TouchableOpacity
          style={{position: 'absolute', top: 20, right: 20}}
          onPress={onClose}>
          <Icon name="ios-close" size={30} color="#000" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default FilterModal;
