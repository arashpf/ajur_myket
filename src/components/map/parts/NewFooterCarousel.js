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
  Easing,
} from 'react-native';
import WorkerCard from '../../cards/WorkerCard';
import Icon from 'react-native-vector-icons/Ionicons';

const useSafeAnimatedValue = (initialValue) => {
  const [value] = useState(() => new Animated.Value(initialValue));
  useEffect(() => () => value.stopAnimation(), [value]);
  return value;
};

const NewFooterCarousel = ({
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

  // ✅ ALWAYS call hooks unconditionally
  const height = useSafeAnimatedValue(initialHeight);
  const opacity = useSafeAnimatedValue(0);
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

  // Empty state
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

  // Animate footer fade in/out when showFooter changes
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: showFooter ? 1 : 0,
      duration: 400,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [showFooter, opacity]);

  // Animate arrow rotation
  useEffect(() => {
    Animated.timing(arrowRotation, {
      toValue: expanded ? 1 : 0,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [expanded, arrowRotation]);

  // Smooth expand/collapse
  const expandToFullHeight = useCallback(() => {
    onExpandedChange(true);
    onFullListRequest();
    setExpanded(true);
    Animated.timing(height, {
      toValue: windowHeight - 50,
      duration: 500,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false,
    }).start();
  }, [windowHeight, onExpandedChange, onFullListRequest, height]);

  const collapseToInitial = useCallback(() => {
    onExpandedChange(false);
    setExpanded(false);
    Animated.timing(height, {
      toValue: initialHeight,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [initialHeight, onExpandedChange, height]);

  const toggleExpanded = useCallback(() => {
    expanded ? collapseToInitial() : expandToFullHeight();
  }, [expanded, collapseToInitial, expandToFullHeight]);

  const arrowInterpolate = arrowRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const arrowBottom = height.interpolate({
    inputRange: [initialHeight, windowHeight - 50],
    outputRange: [initialHeight + 5, (windowHeight - 50) * 0.1],
    extrapolate: 'clamp',
  });

  // PanResponder for pull up
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderMove: (_, g) => {
        if (!expanded) return;
        if (g.dy < 0) {
          const newHeight = Math.min(windowHeight - 50, initialHeight - g.dy);
          height.setValue(newHeight);
        }
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy < -100 || g.vy < -0.5) {
          expandToFullHeight();
        } else {
          collapseToInitial();
        }
      },
    })
  ).current;

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

  const handleScroll = useCallback(({nativeEvent}) => {
    scrollOffset.current = nativeEvent.contentOffset.y;
    const isCloseToBottom =
      nativeEvent.contentOffset.y + nativeEvent.layoutMeasurement.height >=
      nativeEvent.contentSize.height - 20;

    if (isCloseToBottom && !loadingTriggered.current && expanded) {
      loadingTriggered.current = true;
      onZoomOutRequested();
    }
  }, [expanded, onZoomOutRequested]);

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

  // ✅ FIXED: NO conditional returns that skip rendering hooks
  // Instead, conditionally render content but always return the main container
  
  if (!showFooter) {
    return null; // ✅ This is OK because it's at the top level before any hooks
  }

  return (
    <>
      {/* {showEmptyState && (
        <Text style={styles.emptyStateText}>
          ملکی برای نمایش در این محدوده نیست
        </Text>
      )} */}

      {displayData.length > 0 && (
        <>
          <Animated.View
            style={[
              styles.footerContainer,
              {height, opacity},
            ]}>
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
              onScroll={expanded ? handleScroll : undefined}
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

          <Animated.View
            style={[styles.arrowContainer, {bottom: arrowBottom, opacity}]}>
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
    overflow: 'visible',
  },
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
    top: 25,
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
  arrowIcon: {},
  closeButton: {
    position: 'absolute',
    left: 15,
    top: -50,
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
    paddingTop: 0,
  },
  verticalListContentExpanded: {
    paddingBottom: 10,
    paddingTop: 120,
  },
  workerCard: {
    width: '100%',
  },
  loadingMore: {
    paddingVertical: 20,
  },
});

export default NewFooterCarousel;