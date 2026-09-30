import React, {useState, useMemo, useCallback, useRef} from 'react';
import {View, StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import styles from './assets/MainMap.styles';

// Import parts
import MapViewComponent from './parts/MapViewComponent';
import HeaderComponents from './parts/HeaderComponents';
import ModalComponents from './parts/ModalComponents';
import FloatingComponents from './parts/FloatingComponents';
import NewFooterCarousel from './parts/NewFooterCarousel';
import useMapLogic from './parts/MapLogic';

// 🚀 CRITICAL: Disable ALL console logs that are killing performance
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

// Only allow essential logs
console.log = (...args) => {
  const message = args[0] || '';
  // Only allow performance-related logs
  if (typeof message === 'string' && (
    message.includes('🎯 Rendering') || 
    message.includes('⚡ Markers rendered') ||
    message.includes('📍 Visible Markers') ||
    message.includes('🔄 MainMap rendered')
  )) {
    originalConsoleLog.apply(console, args);
  }
  // Block all other logs
};

console.warn = () => {}; // Disable all warnings
console.error = () => {}; // Disable all errors

const MainMap = React.memo((props) => {
  // Add local state as fallback
  const [localIsFooterExpanded, setLocalIsFooterExpanded] = useState(false);
  
  const allProps = useMapLogic(props);
  
  // 🚀 PERFORMANCE: Track renders (limited)
  const renderCount = useRef(0);
  renderCount.current++;
  
  // Only log every 10 renders to avoid spam
  if (renderCount.current % 10 === 1) {
    console.log(`🔄 MainMap rendered: ${renderCount.current} times`);
  }

  // Safe way to get setIsFooterExpanded
  const setIsFooterExpanded = allProps.setIsFooterExpanded || setLocalIsFooterExpanded;

  // 🎯 OPTIMIZE: Memoize all props with proper dependencies
  const mapViewProps = useMemo(() => ({
    mapRef: allProps.mapRef,
    region: allProps.region,
    mapType: allProps.mapType,
    filtered_workers: allProps.filtered_workers,
    selectedWorker: allProps.selectedWorker,
    onRegionChange: allProps.handleRegionChange,
    onRegionChangeComplete: allProps.handleRegionChangeComplete,
    onMarkerPress: allProps.handleMarkerPress,
    onClusterPress: allProps.handleClusterPress,
    onMapTouch: allProps.handleMapTouch,
    zoomLevel: allProps.zoomLevel,
  }), [
    allProps.mapRef, allProps.region, allProps.mapType, allProps.filtered_workers,
    allProps.selectedWorker, allProps.handleRegionChange, allProps.handleRegionChangeComplete,
    allProps.handleMarkerPress, allProps.handleClusterPress, allProps.handleMapTouch,
    allProps.zoomLevel
  ]);

  const headerProps = useMemo(() => ({
    loading: allProps.loading,
    visibleMarkers: allProps.visibleMarkers,
    isSearchFocused: allProps.isSearchFocused,
    search: allProps.search,
    onBackButtonPress: allProps.onBackButtonSerachPressed,
    onStartSearch: allProps.handleStartSearch,
    onInputChange: allProps.handleChangeInput,
    onCloseSearchPress: allProps.onCloseSearchPress,
    onToggleFilter: allProps.toggleFilterhModal,
    inputRef: allProps.inputRef,
    renderHeaderFilters: allProps.renderHeaderFilters,
    renderMapLoader: allProps.renderMapLoader,
  }), [
    allProps.loading, allProps.visibleMarkers, allProps.isSearchFocused, allProps.search,
    allProps.onBackButtonSerachPressed, allProps.handleStartSearch, allProps.handleChangeInput,
    allProps.onCloseSearchPress, allProps.toggleFilterhModal, allProps.inputRef,
    allProps.renderHeaderFilters, allProps.renderMapLoader
  ]);

  const floatingProps = useMemo(() => ({
    loading: allProps.loading,
    visibleMarkers: allProps.visibleMarkers,
    showFooter: allProps.showFooter,
    selectedWorker: allProps.selectedWorker,
    navigation: allProps.navigation,
    onCenterUserLocation: allProps.centerToUserLocation,
    onToggleMapType: allProps.toggleMapType,
    onShowHelp: allProps.showUserHelp,
    getMapIcon: allProps.getMapIcon,
    mapType: allProps.mapType,
    mapOrList: allProps.mapOrList,
    isFooterExpanded: allProps.isFooterExpanded,
  }), [
    allProps.loading, allProps.visibleMarkers, allProps.showFooter, allProps.selectedWorker,
    allProps.navigation, allProps.centerToUserLocation, allProps.toggleMapType,
    allProps.showUserHelp, allProps.getMapIcon, allProps.mapType, allProps.mapOrList,
    allProps.isFooterExpanded
  ]);

  const footerProps = useMemo(() => ({
    showFooter: allProps.showFooter,
    selectedWorker: allProps.selectedWorker,
    visibleMarkers: allProps.visibleMarkers || [],
    onClose: allProps.handleCloseFooter,
    onZoomOutRequested: allProps.handleZoomOutRequested,
    onExpandedChange: setIsFooterExpanded,
  }), [
    allProps.showFooter, allProps.selectedWorker, allProps.visibleMarkers,
    allProps.handleCloseFooter, allProps.handleZoomOutRequested, setIsFooterExpanded
  ]);

  const modalProps = useMemo(() => ({
    isSearchModalVisible: allProps.isSearchModalVisible,
    isFilterModalVisible: allProps.isFilterModalVisible,
    isHintModalVisible: allProps.isHintModalVisible,
    showGuide: allProps.showGuide,
    errorModalVisible: allProps.errorModalVisible,
    onCloseSearchModal: allProps.toggleSearchModal,
    onCloseFilterModal: allProps.toggleFilterhModal,
    onCloseHintModal: () => allProps.set_isHintModalVisible(false),
    onCloseGuide: () => allProps.setShowGuide(false),
    onCloseErrorModal: () => allProps.setErrorModalVisible(false),
    onRefreshData: allProps.grab_worker_based_on_filter,
    renderFilterSectionPages: allProps.renderFilterSectionPages,
    renderTimeFrameFilter: allProps.renderTimeFrameFilter,
    renderFiltersBasedOnCategorySelected: allProps.renderFiltersBasedOnCategorySelected,
    renderFilterActionButtons: allProps.renderFilterActionButtons,
  }), [
    allProps.isSearchModalVisible, allProps.isFilterModalVisible, allProps.isHintModalVisible,
    allProps.showGuide, allProps.errorModalVisible, allProps.toggleSearchModal,
    allProps.toggleFilterhModal, allProps.set_isHintModalVisible, allProps.setShowGuide,
    allProps.setErrorModalVisible, allProps.grab_worker_based_on_filter,
    allProps.renderFilterSectionPages, allProps.renderTimeFrameFilter,
    allProps.renderFiltersBasedOnCategorySelected, allProps.renderFilterActionButtons
  ]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar backgroundColor="#b92a31" barStyle="light-content" />

      {/* 🚀 OPTIMIZED: Components with memoized props */}
      <MapViewComponent {...mapViewProps} />
      <HeaderComponents {...headerProps} />
      <FloatingComponents {...floatingProps} />
      <NewFooterCarousel {...footerProps} />
      <ModalComponents {...modalProps} />
    </GestureHandlerRootView>
  );
});

MainMap.displayName = 'MainMap';

export default MainMap;