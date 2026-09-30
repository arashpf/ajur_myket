import React from 'react';
import {View, Text} from 'react-native';
import ClusterMap from 'react-native-map-clustering';
import {Marker} from 'react-native-maps';
import styles from '../assets/MainMap.styles';

const MapViewComponent = ({
  mapRef,
  region,
  mapType,
  filtered_workers,
  selectedWorker,
  onRegionChange,
  onRegionChangeComplete,
  onMarkerPress,
  onClusterPress,
  onMapTouch,
  zoomLevel
}) => {
  
  const renderPrice = (properties) => {
    const formatNumber = num => {
      const number = Number(num);
      if (number >= 1000000000) {
        return `${parseFloat((number / 1000000000).toFixed(1))} میلیارد`;
      } else if (number >= 1000000) {
        return `${parseFloat((number / 1000000).toFixed(1))} میلیون`;
      } else {
        return String(number).replace(/(.)(?=(\d{3})+$)/g, '$1,');
      }
    };

    const pricePerM2 = properties.find(item => item.name === 'قیمت هر متر');
    const priceItem = properties.find(item => item.name === 'قیمت');
    const rentFront = properties.find(item => item.name === 'پول پیش');
    const rentPerMonth = properties.find(item => item.name === 'اجاره ماهیانه');
    
    if (priceItem) {
      const priceNoFormat = priceItem.value;
      return (
        <Text style={[styles.text, styles.rtl]}>
          <Text style={styles.boldText}>{formatNumber(priceNoFormat)}</Text>
        </Text>
      );
    } else if (rentFront) {
      const rentFrontNoFormat = rentFront.value;
      const rentPerMonthNoFormat = rentPerMonth?.value || 0;
      return (
        <View style={styles.price_row}>
          <Text style={[styles.text, styles.rtl]}>
            <Text style={styles.boldText}>
              {formatNumber(rentFrontNoFormat)}{' '}
              {rentPerMonthNoFormat && rentPerMonthNoFormat !== '0'
                ? 'رهن'
                : 'رهن کامل'}
            </Text>
          </Text>
          {rentPerMonthNoFormat && rentPerMonthNoFormat !== '0' ? (
            <Text style={[styles.text, styles.rtl, styles.paddingRight]}>
              <Text style={styles.boldText}>
                {formatNumber(rentPerMonthNoFormat)} اجاره
              </Text>
            </Text>
          ) : null}
        </View>
      );
    }
    return null;
  };

  const renderMarker = () => {
    return filtered_workers.map(worker => {
      const isSelected = selectedWorker?.id === worker.id;
      const json = JSON.parse(worker.json_properties);

      return (
        <Marker
          key={worker.id}
          coordinate={{
            latitude: Number(worker.lat),
            longitude: Number(worker.long),
          }}
          onPress={(e) => onMarkerPress(worker, e)}
          tracksViewChanges={false}
          icon={() => null}
        >
          <View style={styles.markerContainer}>
            {zoomLevel < 14 ? (
              isSelected ? (
                <View style={styles.dotSimpleActive}>
                  <Text style={styles.dotSimpleTextActive}>
                    {renderPrice(json)}
                  </Text>
                </View>
              ) : (
                <View style={styles.dotSimple}>
                  <Text style={styles.dotSimpleText}>1</Text>
                </View>
              )
            ) : isSelected ? (
              <View style={styles.priceLabelActive}>{renderPrice(json)}</View>
            ) : (
              <View style={styles.priceLabel}>
                <Text style={{color: 'white'}}>{renderPrice(json)}</Text>
              </View>
            )}
          </View>
        </Marker>
      );
    });
  };

  return (
    <ClusterMap
      ref={mapRef}
      minPoints={5}
      maxPoints={50}
      radius={45}
      nodeSize={24}
      extent={768}
      liteMode={false}
      clusterColor="#b92a3180"
      zoomTapEnabled={false}
      showsUserLocation={true}
      provider="google"
      style={styles.map}
      mapType={mapType}
      initialRegion={region}
      onRegionChange={onRegionChange}
      onRegionChangeComplete={onRegionChangeComplete}
      animateToRegion={true}
      onTouchStart={onMapTouch}
      onClusterPress={onClusterPress}
      onPress={onMapTouch}
    >
      {renderMarker()}
    </ClusterMap>
  );
};

export default MapViewComponent;