import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const CardSkeletonPlaceholder = () => {
  const pulse = new Animated.Value(0.3);

  Animated.loop(
    Animated.sequence([
      Animated.timing(pulse, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(pulse, {
        toValue: 0.3,
        duration: 800,
        useNativeDriver: true,
      }),
    ])
  ).start();

  return (
    <Animated.View style={[styles.container, { opacity: pulse }]}>
      <View style={styles.image} />
      <View style={styles.textBlock} />
      <View style={styles.textBlockSmall} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    height: 100,
    backgroundColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
  },
  textBlock: {
    height: 20,
    backgroundColor: '#ccc',
    borderRadius: 6,
    marginBottom: 8,
  },
  textBlockSmall: {
    width: '60%',
    height: 20,
    backgroundColor: '#ccc',
    borderRadius: 6,
  },
});

export default CardSkeletonPlaceholder;
