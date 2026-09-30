import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import PropTypes from 'prop-types';

const iconsImages = {
  sell_office: require('../assets/icons/sell_office.png'),
  sell_office_land: require('../assets/icons/sell_office_land.png'),
  rent_office: require('../assets/icons/rent_office.png'),
  rent_industrial: require('../assets/icons/rent_industrial.png'),
  sell_industrial: require('../assets/icons/sell_industrial.png'),
  industry: require('../assets/icons/sell_industrial.png'),
  sell_industrial_land: require('../assets/icons/sell_industrial_land.png'),
  sell_store: require('../assets/icons/sell_store.png'),
  sell_apartment: require('../assets/icons/sell_apartment.png'),
  rent_villa: require('../assets/icons/rent_villa.png'),
  sell_villa: require('../assets/icons/sell_villa.png'),
  sell_residental_land: require('../assets/icons/sell_residental_land.png'),
  rent_apartment: require('../assets/icons/rent_apartment.png'),
  sell_residental_land: require('../assets/icons/sell_residental_land.png'),
  hectare_land: require('../assets/icons/hectare_land.png'),
  sell_farm_land: require('../assets/icons/sell_farm_land.png'),
  office: require('../assets/icons/sell_office.png'),
};

const SubCatCard = ({ cat, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // useEffect(() => {
  //   Animated.timing(fadeAnim, {
  //     toValue: 1,
  //     duration: 300,
  //     delay: index * 100,
  //     useNativeDriver: true,
  //   }).start();
  // }, []);


  useEffect(() => {
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 100,      // Faster fade-in (150ms instead of 300ms)
    delay: index * 30,  // Shorter delay between items (30ms instead of 100ms)
    useNativeDriver: true,
  }).start();
}, []);

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
        }
      ]}
    >
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Image
            style={styles.image}
            source={iconsImages[cat.avatar]}
            resizeMode="contain"
            accessibilityLabel={cat.avatar}
          />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>{cat.name}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 40, // Fixed minimum height for icon area
  },
  image: {
    width: 32,
    height: 32,
  },
  titleContainer: {
    height: 35, // Fixed height for title area
    justifyContent: 'center',
    alignItems: 'center',
    width: '150%',
  },
  title: {
    fontSize: 13,
    textAlign: 'center',
    color: '#444',
    fontWeight: '500',
    fontFamily: 'iransans',
    lineHeight: 14,
  },
});

SubCatCard.propTypes = {
  cat: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.string,
    has_parent: PropTypes.string,
    has_child: PropTypes.string,
    parent_id: PropTypes.string,
    sort_order: PropTypes.string,
    avatar: PropTypes.string,
  }).isRequired,
};

export default SubCatCard;