import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import FooterCarousel from './FooterCarousel';

const MapFooter = ({visible, selectedWorker, nearestMarkers}) => {
  if (!visible) return null;

  return (
    <View style={{position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff', padding: 10}}>
      {selectedWorker && (
        <View style={{marginBottom: 10}}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>{selectedWorker.name}</Text>
          <Text>{selectedWorker.city}, {selectedWorker.province}</Text>
        </View>
      )}

      {nearestMarkers.length > 0 && (
        <ScrollView horizontal>
          <FooterCarousel markers={nearestMarkers} />
        </ScrollView>
      )}
    </View>
  );
};

export default MapFooter;
