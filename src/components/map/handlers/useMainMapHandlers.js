// handlers/useMainMapHandlers.js
import { getDistance } from '../utils/mapUtils';

export const useMainMapHandlers = ({
  mapState,
  mapFilters,
  mapData,
  mapSearch,
  mapNavigation,
  markerPressTimeoutRef,
  isFirstLoadRef,
  setIsLoading,
  setLoadedCount,
  triggerClosestMarker
}) => {
  const handleMarkerPress = (worker, e) => {
    if (markerPressTimeoutRef.current) {
      clearTimeout(markerPressTimeoutRef.current);
    }

    markerPressTimeoutRef.current = setTimeout(() => {
      if (isFirstLoadRef.current) {
        isFirstLoadRef.current = false;
        return;
      }

      mapState.setSelectedWorker(worker);
      const markersWithDistances = mapFilters.filtered_workers
        .map(marker => ({
          ...marker,
          distancer: getDistance(
            worker.lat,
            worker.long,
            marker.lat,
            marker.long,
          ),
        }))
        .sort((a, b) => a.distancer - b.distancer)
        .slice(0, 10);

      mapState.setNearestMarkers(markersWithDistances);
      mapState.setShowFooter(true);
    }, 100);
  };

  const handleCategoryPress = (cat, shouldFlyToLocation = false) => {
    mapState.set_zoomLevel(10);
    mapState.setShowFooter(false);
    mapFilters.setSelectedCategory(cat);
    mapData.set_loading(true);
    
    mapData.fetchWorkersByCategory(cat.id).finally(() => {
      mapData.set_loading(false);
      
      if (shouldFlyToLocation && route.params?.mapFilters?.neighborhood) {
        setTimeout(() => {
          mapNavigation.flyToNeighborhood(mapState.mapRef, route.params.mapFilters.neighborhood);
        }, 300);
      }
    });
  };

  const handleClusterPress = (cluster) => {
    mapState.setShowFooter(false);
    mapState.setSelectedWorker([]);
  };

  const handleMapTouch = () => {
    mapSearch.onBackButtonSerachPressed();
  };

  const handlePanDrag = () => {
    mapState.setShowFooter(false);
    mapState.setSelectedWorker([]);
  };

  const handleCloseFooter = () => {
    mapState.setShowFooter(false);
  };

  const handleRegionChange = () => {
    mapData.set_loading(true);
  };

  const handleRegionChangeComplete = (region) => {
    mapState.handleRegionChangeComplete(region);
    mapState.normalRegionChange(region);

    setTimeout(() => {
      if (!mapState.selectedWorker || mapState.selectedWorker.id === undefined) {
        triggerClosestMarker();
      }
      mapData.set_loading(false);
    }, 200);
  };

  const handleSingleLocationClicked = ({place}) => {
    mapState.setShowFooter(false);
    mapSearch.onBackButtonSerachPressed();
    mapSearch.set_search(place.title);

    mapState.mapRef.current?.animateToRegion(
      {
        latitude: Number(place.location.y),
        longitude: Number(place.location.x),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      500,
    );
  };

  const handleZoomOutRequested = () => {
    if (mapState.zoomLevel < 14) {
      console.log('Reached maximum zoom-out level');
      return;
    }

    const newRegion = {
      ...mapState.region,
      latitudeDelta: mapState.region.latitudeDelta * 1.5,
      longitudeDelta: mapState.region.longitudeDelta * 1.5,
    };

    mapState.setRegion(newRegion);

    if (mapState.mapRef.current) {
      mapState.mapRef.current.animateToRegion(newRegion, 500);
    }
  };

  const moveMapSlightly = () => {
    if (mapState.mapRef.current && mapState.userLat) {
      mapState.mapRef.current.animateCamera(
        {
          center: {
            latitude: mapState.userLat + 0.0000001,
            longitude: mapState.userLong + 0.0000001,
          },
        },
        { duration: 1000 },
      );
    }
  };

  const loadMoreItems = () => {
    if (loadedCount < mapState.nearestMarkers.length && !isLoading) {
      setIsLoading(true);
      setTimeout(() => {
        setLoadedCount(prev =>
          Math.min(prev + 5, mapState.nearestMarkers.length),
        );
        setIsLoading(false);
      }, 500);
    }
  };

  return {
    handleMarkerPress,
    handleCategoryPress,
    handleClusterPress,
    handleMapTouch,
    handlePanDrag,
    handleCloseFooter,
    handleRegionChange,
    handleRegionChangeComplete,
    handleSingleLocationClicked,
    handleZoomOutRequested,
    moveMapSlightly,
    loadMoreItems
  };
};