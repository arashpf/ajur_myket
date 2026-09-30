import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NewWorkerFab = ({ 
  showFooter = false,
  navigation,
  visibleMarkers = [],
  loading = false
}) => {
  const fabBottom = useRef(new Animated.Value(20)).current;
  const fabSize = useRef(new Animated.Value(56)).current; // Increased size
  const iconSize = useRef(new Animated.Value(32)).current; // Increased icon size
  const opacity = useRef(new Animated.Value(1)).current;
  const shadowAnim = useRef(new Animated.Value(8)).current; // Shadow animation

  useEffect(() => {
    const shouldMoveUp = showFooter && visibleMarkers.length > 0 && !loading;

    const baseConfig = {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    };

    Animated.parallel([
      Animated.timing(fabBottom, {
        toValue: shouldMoveUp ? 230 : 25,
        ...baseConfig,
      }),
      Animated.timing(fabSize, {
        toValue: shouldMoveUp ? 48 : 56,
        ...baseConfig,
      }),
      Animated.timing(iconSize, {
        toValue: shouldMoveUp ? 26 : 32,
        ...baseConfig,
      }),
      Animated.timing(opacity, {
        toValue: shouldMoveUp ? 0.9 : 1,
        ...baseConfig,
      }),
      Animated.timing(shadowAnim, {
        toValue: shouldMoveUp ? 6 : 12, // Reduced shadow when moved up
        ...baseConfig,
      }),
    ]).start();
  }, [showFooter, visibleMarkers.length, loading]);

  const handlePress = () => {
    AsyncStorage.getItem('id_token').then(token => {
      if (token == null) {
        navigation.navigate('Rlogin');
      } else {
        navigation.navigate('NewWorker');
      }
    });
  };

  // Pulse animation for extra attention
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.1,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
    ]);

    Animated.loop(pulse).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.fab,
        {
          bottom: fabBottom,
          right: 20, // Increased right margin
          width: fabSize,
          height: fabSize,
          borderRadius: Animated.divide(fabSize, 2),
          backgroundColor: '#ffffff', // White background
          opacity: opacity,
          transform: [{ scale: pulseAnim }],
          // Enhanced shadow
          shadowOpacity: 0.4,
          shadowRadius: shadowAnim,
          shadowOffset: { width: 0, height: shadowAnim },
          elevation: shadowAnim,
        },
      ]}
    >
      <TouchableOpacity 
        style={styles.fabButton}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Animated.View style={{ 
          transform: [{ scale: Animated.divide(iconSize, 32) }],
          backgroundColor: '#a92b31', // Red circle behind icon
          borderRadius: 20,
          width: 40,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#a92b31',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3,
          elevation: 3,
        }}>
          <Icon name="add" size={24} color="white" style={styles.icon} />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    // Enhanced shadow properties
    shadowColor: '#000',
    borderWidth: 2,
    borderColor: 'rgba(169, 43, 49, 0.1)',
  },
  fabButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default NewWorkerFab;