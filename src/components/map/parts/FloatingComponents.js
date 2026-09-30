import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import NewWorkerFab from '../../fabs/NewWorkerFab';
import styles from '../assets/MainMap.styles';

const FloatingComponents = ({
  loading,
  visibleMarkers,
  showFooter,
  selectedWorker,
  navigation,
  onCenterUserLocation,
  onToggleMapType,
  onShowHelp,
  onToggleFilter, // MAKE SURE THIS PROP IS HERE
  getMapIcon,
  mapType,
  mapOrList,
  isFooterExpanded
}) => {
  return (
    <>
      <NewWorkerFab
        navigation={navigation}
        showFooter={showFooter}
        visibleMarkers={visibleMarkers}
        loading={loading}
      />

      {/* FILTER BUTTON - Make sure this is here */}
      {/* <TouchableOpacity 
        style={styles.filterButton}
        onPress={onToggleFilter}
      >
        <Icon name="filter" size={20} color="#b92a31" />
        <Text style={styles.filterButtonText}>فیلترها</Text>
      </TouchableOpacity> */}

      {/* Map Control Buttons */}
      {mapOrList == 'map' && !isFooterExpanded && (
        <>
          <TouchableOpacity style={styles.toggleButton} onPress={onToggleMapType}>
            <Icon
              style={styles.toggleIcon}
              name={getMapIcon()}
              size={30}
              color="black"
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.userLocationButton}
            onPress={onCenterUserLocation}>
            <Icon
              style={styles.toggleIcon}
              name="locate"
              size={30}
              color="black"
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.userHelpButton}
            onPress={onShowHelp}>
            <Icon
              style={styles.helpIcon}
              name="help-circle-outline"
              size={30}
              color="black"
            />
          </TouchableOpacity>
        </>
      )}
    </>
  );
};

export default FloatingComponents;