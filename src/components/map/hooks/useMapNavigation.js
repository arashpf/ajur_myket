import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

const useMapNavigation = () => {
  const navigation = useNavigation();

  const sendToMap = useCallback((item, neighborhoodName = null) => {
    const neighborhoodObj = item.neighborhoods?.find(
      n => n.name === neighborhoodName,
    );
    
    console.log('Neighborhood Object:', JSON.stringify(neighborhoodObj, null, 2));

    navigation.navigate('نقشه', {
      mapFilters: {
        category: item.category_array,
        neighborhood: neighborhoodObj,
      },
    });
  }, [navigation]);

  const flyToLocation = useCallback((mapRef, latitude, longitude, zoomLevel = 15) => {
    if (!mapRef.current || !latitude || !longitude) return;

    mapRef.current.animateToRegion(
      {
        latitude: Number(latitude),
        longitude: Number(longitude),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000, // Animation duration
    );
  }, []);

  const flyToNeighborhood = useCallback((mapRef, neighborhood) => {
    if (!mapRef.current || !neighborhood) return;

    const { center_lat, center_lng } = neighborhood;
    
    mapRef.current.animateToRegion(
      {
        latitude: Number(center_lat),
        longitude: Number(center_lng),
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      1000,
    );
  }, []);

  return {
    sendToMap,
    flyToLocation,
    flyToNeighborhood
  };
};

export default useMapNavigation;