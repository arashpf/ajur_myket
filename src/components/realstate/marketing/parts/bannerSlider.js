import React, { useState, useEffect, useRef } from 'react';
import { Dimensions, FlatList, View, StyleSheet } from 'react-native';
import { Box, Image } from 'native-base';

const { width: screenWidth } = Dimensions.get('window');

const bannerImages = [
  require('../assets/1m.jpg'),
  require('../assets/3winners.jpg'),
  require('../assets/ajurak_banner.jpg'),
];

export default function BannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const autoPlayRef = useRef(null);

  useEffect(() => {
    // Start auto-slide
    startAutoSlide();

    // Cleanup on unmount
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, []);

  const startAutoSlide = () => {
    autoPlayRef.current = setInterval(() => {
      const nextIndex = (currentIndex + 1) % bannerImages.length;
      setCurrentIndex(nextIndex);
      
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 5000); // Change slide every 5 seconds
  };

  const onMomentumScrollEnd = (event) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    
    // Calculate the current index
    const newIndex = Math.floor(contentOffset.x / viewSize.width);
    setCurrentIndex(newIndex);
    
    // Restart auto-slide timer
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    startAutoSlide();
  };

  const renderItem = ({ item }) => (
    <Box 
      width={screenWidth - 20} // Adjust for padding
      height={180}
      borderRadius={16}
      overflow="hidden"
      shadow={4}
      style={{
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      }}
    >
      <Image
        source={item}
        style={{
          width: '100%',
          height: '100%',
          resizeMode: 'cover'
        }}
        alt="Banner"
      />
    </Box>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={bannerImages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(data, index) => ({
          length: screenWidth - 20,
          offset: (screenWidth - 20) * index,
          index,
        })}
        initialScrollIndex={0}
      />
      
      {/* Indicator dots */}
      <View style={styles.indicatorContainer}>
        {bannerImages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentIndex === index ? styles.activeIndicator : styles.inactiveIndicator
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#FFA500', // Orange color
  },
  inactiveIndicator: {
    backgroundColor: '#CCCCCC',
  },
});