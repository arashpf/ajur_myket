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
  const fabSize = useRef(new Animated.Value(46)).current;
  const iconSize = useRef(new Animated.Value(28)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const shouldMoveUp = showFooter && visibleMarkers.length > 0 && !loading;

    const baseConfig = {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    };

    Animated.parallel([
      Animated.timing(fabBottom, {
        toValue: shouldMoveUp ? 230 : 20,
        ...baseConfig,
      }),
      Animated.timing(fabSize, {
        toValue: shouldMoveUp ? 40 : 46,
        ...baseConfig,
      }),
      Animated.timing(iconSize, {
        toValue: shouldMoveUp ? 22 : 28,
        ...baseConfig,
      }),
      Animated.timing(opacity, {
        toValue: shouldMoveUp ? 0.8 : 1,
        duration: 500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
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

  return (
    <Animated.View
      style={[
        styles.fab,
        {
          bottom: fabBottom,
          right: 10,
          width: fabSize,
          height: fabSize,
          borderRadius: Animated.divide(fabSize, 2),
          backgroundColor: '#2f2929ff',
          opacity: opacity,
        },
      ]}
    >
      <TouchableOpacity 
        style={styles.fabButton}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Animated.View style={{ transform: [{ scale: Animated.divide(iconSize, 28) }] }}>
          <Icon name="add" size={28} color="red" />
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
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  fabButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
});

export default NewWorkerFab;
