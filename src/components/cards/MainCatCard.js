import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

// Define your icons (assuming these are local image files)
const iconsImages = {
  home: require('../assets/cat/home.jpg'),
  land: require('../assets/cat/land.jpg'),
  office: require('../assets/cat/office.jpg'),
  industry: require('../assets/cat/industry.jpg'),
  renthome: require('../assets/cat/renthome.jpg'),
  rentoffice: require('../assets/cat/rentoffice.jpg'),
  rentindustry: require('../assets/cat/rentindustry.jpg'),
};

const MainCatCard = ({ cat }) => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={iconsImages[cat.avatar]}
        resizeMode="cover"
        accessibilityLabel={cat.avatar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden', // This ensures the borderRadius is applied to the image
  },
  image: {
    width: 150, // You might want to adjust these dimensions
    height: 250, // or make them responsive
    margin:10,
    borderRadius:5
  },
});

MainCatCard.propTypes = {
  cat: PropTypes.shape({
    avatar: PropTypes.oneOf([
      'home',
      'land',
      'office',
      'industry',
      'renthome',
      'rentoffice',
      'rentindustry'
    ]).isRequired,
  }).isRequired,
};

export default MainCatCard;