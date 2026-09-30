// hooks/useMainMapHooks.js
import useMapFilters from './useMapFilters';
import useMapState from './useMapState';
import useMapData from './useMapData';
import useMapLocation from './useMapLocation';
import useMapSearch from './useMapSearch';
import useMapNavigation from './useMapNavigation';

// Constants
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;

export const useMainMapHooks = (route) => {
  const mapState = useMapState({
    latitude: 35.7074612,
    longitude: 51.3005805,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const mapData = useMapData(
    route?.params?.mapFilters?.category,
    mapState.userLat,
    mapState.userLong
  );

  const mapFilters = useMapFilters(
    route?.params?.mapFilters?.category,
    mapData.workers,
    'threemonths'
  );

  const mapLocation = useMapLocation();
  const mapSearch = useMapSearch();
  const mapNavigation = useMapNavigation();

  return {
    mapState,
    mapData,
    mapFilters,
    mapLocation,
    mapSearch,
    mapNavigation
  };
};