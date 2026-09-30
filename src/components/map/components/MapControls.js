// components/MapControls.js
import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from 'native-base';
import styles from '../assets/MainMap.styles'; // Import styles

export const MapControls = ({ 
  mapState, 
  mapLocation, 
  showGuide, 
  setShowGuide 
}) => {
  const getMapIcon = () => {
    if (mapState.mapType === 'standard') return 'ios-layers-outline';
    if (mapState.mapType === 'hybrid') return 'ios-globe-outline';
    return 'ios-layers-outline';
  };

  return (
    <>
      <TouchableOpacity style={styles.toggleMapButton} onPress={mapState.toggleMapType}>
        <Icon
          style={styles.toggleIcon}
          name={getMapIcon()}
          size={30}
          color="black"
        />
      </TouchableOpacity>
      
      <View style={styles.locationButtonContainer}>
        {!mapLocation.is_location_exist && (
          <View style={styles.locationHint}>
            <Text style={styles.locationHintText}>
              فایل های اطراف موقعیت کنونی خود را ببینید
            </Text>
            <View style={styles.pointer} />
          </View>
        )}
        <TouchableOpacity
          style={[
            styles.toggleLocationButton,
            !mapLocation.is_location_exist && styles.userLocationButtonInactive
          ]}
          onPress={() => mapLocation.centerToUserLocation(mapState.mapRef)}
          disabled={mapLocation.isRequestingLocation}
        >
          {mapLocation.isRequestingLocation ? (
            <ActivityIndicator size="small" color="#b92a31" />
          ) : (
            <Icon
              style={[
                styles.toggleIcon,
                !mapLocation.is_location_exist && styles.locationIconInactive
              ]}
              name="locate"
              size={30}
              color={mapLocation.is_location_exist ? "black" : "#999"}
            />
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.userHelpButton}
        onPress={() => setShowGuide(true)}
      >
        <Icon
          style={styles.helpIcon}
          name="help-circle-outline"
          size={30}
          color="black"
        />
      </TouchableOpacity>
    </>
  );
};