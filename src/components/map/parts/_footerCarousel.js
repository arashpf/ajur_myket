import React, {useRef, useEffect, useState, useCallback, useMemo} from 'react';
import {
  View,
  ActivityIndicator,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Text,
  PanResponder,
  Animated,
  StyleSheet,
  BackHandler,
} from 'react-native';
import WorkerCard from '../../cards/WorkerCard';
import Icon from 'react-native-vector-icons/Ionicons';

const FooterCarousel = ({
  showFooter = false,
  selectedWorker = null,
  visibleMarkers = [],
  isLoading = false,
  onClose = () => {},
  onZoomOutRequested = () => {},
  onFullListRequest = () => {},
  onShrinkListRequest = () => {},
  onExpandedChange = () => {},
}) => {
  const windowHeight = Dimensions.get('window').height;
  const initialHeight = 220;

  const listRef = useRef(null);
  const loadingTriggered = useRef(false);
  const scrollOffset = useRef(0);
  const prevVisibleMarkersCount = useRef(visibleMarkers.length);

  const useSafeAnimatedValue = (initialValue) => {
    const [value] = useState(() => new Animated.Value(initialValue));
    useEffect(() => () => value.stopAnimation(), [value]);
    return value;
  };

  const height = useSafeAnimatedValue(initialHeight);
  const arrowRotation = useSafeAnimatedValue(0);
  const [expanded, setExpanded] = useState(false);

  const displayData = useMemo(() => {
    try {
      const validMarkers = Array.isArray(visibleMarkers)
        ? visibleMarkers.filter((item) => item?.id != null)
        : [];

      const validSelected =
        selectedWorker?.id != null && (expanded || validMarkers.length > 0)
          ? [selectedWorker]
          : [];

      return expanded ? validMarkers : validSelected;
    } catch (error) {
      console.error('Error processing display data:', error);
      return [];
    }
  }, [expanded, selectedWorker, visibleMarkers]);

  // Check if we should show empty state
  const showEmptyState = useMemo(() => {
    return showFooter && displayData.length === 0 && !isLoading;
  }, [showFooter, displayData, isLoading]);

  // Handle back press
  useEffect(() => {
    const handler = () => {
      if (expanded) {
        collapseToInitial();
        onShrinkListRequest();
        return true;
      }
      return false;
    };
    BackHandler.addEventListener('hardwareBackPress', handler);
    return () => BackHandler.removeEventListener('hardwareBackPress', handler);
  }, [expanded, onShrinkListRequest]);

  // Animate arrow rotation
  useEffect(() => {
    const animation = Animated.timing(arrowRotation, {
      toValue: expanded ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [expanded, arrowRotation]);

  // PanResponder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
      onPanResponderMove: (_, gestureState) => {
        if (!expanded) return;
        if (gestureState.dy < 0) {
          const newHeight = Math.min(windowHeight - 50, initialHeight - gestureState.dy);
          height.setValue(newHeight);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -100 || gestureState.vy < -0.5) {
          expandToFullHeight();
        } else {
          collapseToInitial();
        }
      },
    })
  ).current;

  const expandToFullHeight = () => {
    onExpandedChange(true); // Add this line
    onFullListRequest();
    setExpanded(true);
    Animated.spring(height, {
      toValue: windowHeight - 50,
      useNativeDriver: false,
      overshootClamping: true,
    }).start();
  };

  const collapseToInitial = () => {
    onExpandedChange(false); // Add this line
    setExpanded(false);
    Animated.spring(height, {
      toValue: initialHeight,
      useNativeDriver: false,
    }).start();
  };

  const toggleExpanded = () => {
    expanded ? collapseToInitial() : expandToFullHeight();
  };

  const arrowInterpolate = arrowRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const arrowBottom = height.interpolate({
    inputRange: [initialHeight, windowHeight - 50],
    outputRange: [initialHeight + 5, (windowHeight - 50) * 0.1],
    extrapolate: 'clamp',
  });

  // Render worker card
  const renderItem = useCallback(
    ({item}) => {
      if (!item || typeof item !== 'object') return null;
      return (
        <View style={styles.verticalCard}>
          <WorkerCard
            data={item}
            style={styles.workerCard}
            isSelected={!expanded || item.id === selectedWorker?.id}
          />
        </View>
      );
    },
    [expanded, selectedWorker]
  );

  const keyExtractor = useCallback((item, index) => `${item?.id || index}`, []);

  // Scroll handling for loading more
  const handleScroll = useMemo(() => {
    const handler = ({nativeEvent}) => {
      scrollOffset.current = nativeEvent.contentOffset.y;
      const isCloseToBottom =
        nativeEvent.contentOffset.y + nativeEvent.layoutMeasurement.height >=
        nativeEvent.contentSize.height - 20;

      if (isCloseToBottom && !loadingTriggered.current) {
        loadingTriggered.current = true;

       
        onZoomOutRequested();
      }
    };
    return expanded ? handler : undefined;
  }, [expanded, onZoomOutRequested]);

  // Maintain scroll position when new data is added
  useEffect(() => {
    if (!listRef.current || !displayData || displayData.length === 0) return;

    const wasDataAdded = displayData.length > prevVisibleMarkersCount.current;
    prevVisibleMarkersCount.current = displayData.length;

    if (wasDataAdded && expanded) {
      listRef.current.scrollToOffset({
        offset: scrollOffset.current,
        animated: false,
      });
    }
    loadingTriggered.current = false;
  }, [displayData, expanded]);

  return (
    <>
      {/* Simple empty state text */}
      {showEmptyState && (
        <Text style={styles.emptyStateText}>
          ملکی برای نمایش در این محدوده نیست
        </Text>
      )}

      {/* Footer with cards - only show when there's data */}
      {showFooter && displayData.length > 0 && (
        <>
          <Animated.View style={[styles.footerContainer, {height}]}>
            {/* Close button positioned outside but relative to footer */}
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={onClose}
              hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}>
              <Icon name="close" size={20} color="#666" />
            </TouchableOpacity>

            <FlatList
              ref={listRef}
              data={displayData}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              contentContainerStyle={
                expanded
                  ? styles.verticalListContentExpanded
                  : styles.verticalListContent
              }
              onScroll={handleScroll}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={expanded}
              ListFooterComponent={
                isLoading ? (
                  <View style={styles.loadingMore}>
                    <ActivityIndicator size="large" color="#b92a31" />
                  </View>
                ) : null
              }
              initialNumToRender={3}
              maxToRenderPerBatch={5}
              windowSize={7}
              removeClippedSubviews={true}
              scrollEnabled={expanded}
              {...(!expanded ? panResponder.panHandlers : {})}
            />
          </Animated.View>

          <Animated.View style={[styles.arrowContainer, {bottom: arrowBottom}]}>
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={toggleExpanded}
              activeOpacity={0.7}>
              <View style={styles.arrowContent}>
                <Text style={styles.arrowText}>
                  {expanded 
                    ? `نمایش ${visibleMarkers.length} فایل روی نقشه` 
                    : `مشاهده ${visibleMarkers.length} فایل`}
                </Text>
                <Animated.View
                  style={[
                    styles.arrowIcon,
                    {transform: [{rotate: arrowInterpolate}]},
                  ]}>
                  <Icon name="chevron-up" size={20} color="#b92a31" />
                </Animated.View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    overflow: 'visible', // Changed to visible to allow close button to show outside
  },
  // Simple empty state text
  emptyStateText: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  arrowContainer: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 20,
  },
  arrowButton: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    top: 25
  },
  arrowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    color: 'gray',
    fontSize: 14,
    fontFamily: 'iransans',
    marginRight: 8,
    fontWeight: '500',
  },
  arrowIcon: {
    // Icon styling
  },
  // Close button positioned outside footer surface
  closeButton: {
    position: 'absolute',
    left: 15,
    top: -50, // Positioned above the footer
    zIndex: 100,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  verticalCard: {
    marginVertical: 5,
    paddingHorizontal: 5,
  },
  verticalListContent: {
    paddingBottom: 2,
    paddingTop: 0, // Add some top padding to account for close button space
  },
  verticalListContentExpanded: {
    paddingBottom: 10,
    paddingTop: 20, // Add some top padding to account for close button space
  },
  workerCard: {
    width: '100%',
  },
  loadingMore: {
    paddingVertical: 20,
  },
});

export default FooterCarousel;