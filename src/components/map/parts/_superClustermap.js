// MapView.js
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Text,View,StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Supercluster from 'supercluster';

const screen = Dimensions.get('screen');

// Random data generation for markers
const generateRandomMarkers = (count = 1000) =>
  Array.from({ length: count }).map((_, i) => ({
    id: `${i}`,
    latitude: 37.78825 + (Math.random() - 0.5) * 0.1,
    longitude: -122.4324 + (Math.random() - 0.5) * 0.1,
  }));

export default function MapWithClusters() {
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.3,
    longitudeDelta: 0.3,
  });

  const [clusters, setClusters] = useState([]);
  const [clusterAnimations, setClusterAnimations] = useState({});

  const superclusterRef = useRef(
    new Supercluster({
      radius: 50,
      maxZoom: 20,
    })
  );

  const points = generateRandomMarkers();

  const createGeoJSON = () =>
    points.map((point) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [point.longitude, point.latitude],
      },
      properties: {
        pointId: point.id,
      },
    }));

  const getClusters = () => {
    const bounds = regionToBoundingBox(region);
    const zoom = getZoomLevel(region.longitudeDelta);
    const rawClusters = superclusterRef.current.getClusters(bounds, zoom);

    const animValues = {};
    rawClusters.forEach((cluster) => {
      animValues[cluster.id] = new Animated.Value(0); // start invisible
      Animated.timing(animValues[cluster.id], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    setClusterAnimations(animValues);
    setClusters(rawClusters);
  };

  useEffect(() => {
    const geojson = createGeoJSON();
    superclusterRef.current.load(geojson);
    getClusters();
  }, []);

  const onRegionChangeComplete = (newRegion) => {
    setRegion(newRegion);
    getClusters();
  };

  return (
    <View style={styles.container}>
    <MapView
    style={styles.mapview}
      initialRegion={region}
      onRegionChangeComplete={onRegionChangeComplete}
    >
      {clusters.map((cluster) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const isCluster = cluster.properties.cluster;
        const id = cluster.id;

        const anim = clusterAnimations[id] || new Animated.Value(1);

        if (isCluster) {
          return (
            <Marker key={`cluster-${id}`} coordinate={{ latitude, longitude }}>
              <Animated.View
                style={{
                  opacity: anim,
                  transform: [{ scale: anim }],
                  backgroundColor: '#007aff',
                  borderRadius: 20,
                  padding: 10,
                }}
              >
                <Text style={{ color: 'white' }}>
                  {cluster.properties.point_count}
                </Text>
              </Animated.View>
            </Marker>
          );
        }

        // Render individual item markers
        return (
          <Marker key={`item-${cluster.properties.pointId}`} coordinate={{ latitude, longitude }}>
            <Animated.View
              style={{
                opacity: anim,
                backgroundColor: '#ff3b30',
                borderRadius: 10,
                padding: 5,
              }}
            >
              <Text style={{ color: 'white', fontSize: 12 }}>•</Text>
            </Animated.View>
          </Marker>
        );
      })}
    </MapView>
    </View>
  );
}

// Helper Functions
function regionToBoundingBox(region) {
  const lngD = region.longitudeDelta < 0 ? region.longitudeDelta + 360 : region.longitudeDelta;

  return [
    region.longitude - lngD, // westLng
    region.latitude - region.latitudeDelta, // southLat
    region.longitude + lngD, // eastLng
    region.latitude + region.latitudeDelta, // northLat
  ];
}

function getZoomLevel(longitudeDelta) {
  return Math.round(Math.log(360 / longitudeDelta) / Math.LN2);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  mapview: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  }
});