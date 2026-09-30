import React from 'react';
import {Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';

const MapMarkers = ({markers, selectedWorker, onPressWorker}) => {
  return (
    <>
      {markers.map(worker => (
        <Marker
          key={worker.id}
          coordinate={{latitude: worker.lat, longitude: worker.long}}
          onPress={() => onPressWorker(worker)}>
          <Icon
            name={selectedWorker?.id === worker.id ? 'location' : 'location-outline'}
            size={30}
            color={selectedWorker?.id === worker.id ? 'red' : 'blue'}
          />
        </Marker>
      ))}
    </>
  );
};

export default MapMarkers;
