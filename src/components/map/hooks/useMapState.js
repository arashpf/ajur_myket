import { useState, useRef, useCallback } from 'react';

const useMapState = (initialRegion) => {
  const [region, setRegion] = useState(initialRegion);
  const [zoomLevel, set_zoomLevel] = useState(14);
  const [userLat, set_userLat] = useState();
  const [userLong, set_userLong] = useState();
  const [visibleMarkers, setVisibleMarkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState([]);
  const [showFooter, setShowFooter] = useState(false);
  const [mapType, set_mapType] = useState('standard');
  const [isTopbarOpen, setTopbarOpen] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [nearestMarkers, setNearestMarkers] = useState([]);
  const [pressedMarkers, setPressedMarkers] = useState({});

  const mapRef = useRef(null);
  const topbarAnim = useRef(null);
  const filteredWorkersRef = useRef([]);

  const handleRegionChangeComplete = useCallback((region) => {
    set_zoomLevel(Math.round(Math.log2(360 / region.longitudeDelta)));
    setRegion(region);
  }, []);

  const normalRegionChange = useCallback((region) => {
    try {
      const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
      const halfLatDelta = latitudeDelta / 2;
      const halfLngDelta = longitudeDelta / 2;

      const visibleMarkers = filteredWorkersRef.current.filter(
        marker =>
          marker.lat >= latitude - halfLatDelta &&
          marker.lat <= latitude + halfLatDelta &&
          marker.long >= longitude - halfLngDelta &&
          marker.long <= longitude + halfLngDelta,
      );

      setVisibleMarkers(visibleMarkers);
      set_userLat(latitude);
      set_userLong(longitude);
    } catch (error) {
      console.error('Region change error:', error);
    }
  }, []);

  const toggleMapType = useCallback(() => {
    if (mapType === 'standard') set_mapType('hybrid');
    else if (mapType === 'hybrid') set_mapType('standard');
    else set_mapType('standard');
  }, [mapType]);

  return {
    // State
    region,
    zoomLevel,
    userLat,
    userLong,
    visibleMarkers,
    selectedWorker,
    showFooter,
    mapType,
    isTopbarOpen,
    selectedMarker,
    nearestMarkers,
    pressedMarkers,

    // Setters
    setRegion,
    set_zoomLevel,
    set_userLat,
    set_userLong,
    setVisibleMarkers,
    setSelectedWorker,
    setShowFooter,
    set_mapType,
    setTopbarOpen,
    setSelectedMarker,
    setNearestMarkers,
    setPressedMarkers,

    // Refs
    mapRef,
    topbarAnim,
    filteredWorkersRef,

    // Functions
    handleRegionChangeComplete,
    normalRegionChange,
    toggleMapType
  };
};

export default useMapState;