import React, {useState, useEffect, memo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import 'moment/locale/fa';

const {width} = Dimensions.get('window');

const WorkerCard = memo((props) => {
  const worker = props.data;
  const navigation = useNavigation();
  const [properties, setProperties] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Parse worker properties
  useEffect(() => {
    try {
      setProperties(JSON.parse(worker.json_properties));
    } catch (error) {
      console.error('Error parsing properties:', error);
      setProperties([]);
    }
  }, [worker.json_properties]);

  // Check favorite status
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const favorited = await AsyncStorage.getItem('favorited');
        if (favorited) {
          const favoriteList = JSON.parse(favorited);
          setIsFavorite(favoriteList.includes(worker.id));
        }
      } catch (error) {
        console.error('Favorite check error:', error);
      }
    };

    checkFavoriteStatus();
  }, [worker.id]);

  // Toggle favorite status
  const toggleFavorite = async () => {
    try {
      let favorited = await AsyncStorage.getItem('favorited');
      let favoriteList = favorited ? JSON.parse(favorited) : [];
      
      const newFavoriteList = favoriteList.includes(worker.id)
        ? favoriteList.filter(id => id !== worker.id)
        : [...favoriteList, worker.id];
      
      await AsyncStorage.setItem('favorited', JSON.stringify(newFavoriteList));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Favorite toggle error:', error);
    }
  };

  // Navigate to single worker view
  const onCardPress = () => {
    navigation.push('WorkerSingle', {
      itemId: worker.id,
    });
  };

  const renderPrice = () => {
    const priceItem =
      properties.find(item => item.name === 'قیمت') ||
      properties.find(item => item.name === 'پول پیش');

    const pricePerM2 =
      properties.find(item => item.name === 'قیمت هر متر') ||
      properties.find(item => item.name === 'اجاره ماهیانه');

    if (!priceItem) return null;

    if (priceItem.name === 'پول پیش' && (!pricePerM2 || Number(pricePerM2.value) === 0)) {
      return (
        <Text style={styles.price}>
          <Text style={styles.bold}>
            {String(priceItem.value).replace(/(.)(?=(\d{3})+$)/g, '$1,')} تومان
          </Text>{' '}
          <Text style={styles.rentFull}>رهن کامل</Text>
        </Text>
      );
    }

    if (!pricePerM2) return null;

    return (
      <Text style={styles.price}>
        <Text style={styles.bold}>
          {String(priceItem.value).replace(/(.)(?=(\d{3})+$)/g, '$1,')} تومان |{' '}
        </Text>
        <Text style={styles.priceLabel}>
          {priceItem.name === 'قیمت' ? 'متری ' : 'اجاره '}
        </Text>
        <Text style={styles.bold}>
          {String(pricePerM2.value).replace(/(.)(?=(\d{3})+$)/g, '$1,')} تومان
        </Text>
      </Text>
    );
  };

  const renderQuickHint = (pr) => {
    if (pr.value == 1) {
      return (
        <View style={styles.quickHint}>
          <Text style={styles.quickHintText}>{pr.name}</Text>
          <Icon name="check" size={12} color="white" style={styles.checkIcon} />
        </View>
      );
    }
    return null;
  };

  // Render urgent ribbon (fixed position)
  const renderUrgentRibbon = () => {
    if (!worker.is_urgent) return null;
    
    return (
      <View style={styles.urgentRibbon}>
        <Text style={styles.urgentRibbonText}>فوری</Text>
      </View>
    );
  };

  // Render video/image icons
  const renderMediaIcons = () => {
    return (
      <View style={styles.mediaIconsContainer}>
        {worker.video_count > 0 && (
          <View style={styles.mediaIcon}>
            <Icon name="videocam" size={14} color="#333" />
          </View>
        )}
        {worker.image_count > 0 && (
          <View style={styles.mediaIcon}>
            <Text style={styles.mediaIconText}>{worker.image_count}</Text>
            <Icon name="collections" size={14} color="#333" />
          </View>
        )}
      </View>
    );
  };

  // Render neighborhood ribbon (bottom of image)
  const renderNeighborhoodRibbon = () => {
    if (!worker.neighbourhood) return null;
    
    return (
      <View style={styles.neighborhoodRibbon}>
        <Text style={styles.neighborhoodText}>
          {worker.neighbourhood} {worker.city || ''}
        </Text>
      </View>
    );
  };

  // Get quick hints that should be displayed
  const getQuickHints = () => {
    return properties.filter(pr => pr.special === '1' && pr.kind === 2 && pr.value == 1);
  };

  const quickHints = getQuickHints();
  const hasQuickHints = quickHints.length > 0;

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      style={[
        styles.card,
        worker.is_special && styles.specialCard,
      ]}
      onPress={onCardPress}
    >
      {/* Image Section */}
      <View style={styles.imageContainer}>
        {/* Urgent Ribbon */}
        {renderUrgentRibbon()}
        
        {/* Image Skeleton */}
        {!imageLoaded && (
          <View style={styles.imageSkeleton} />
        )}
        
        <FastImage
          source={{uri: worker.thumb}}
          style={[styles.image, !imageLoaded && styles.imageHidden]}
          resizeMode={FastImage.resizeMode.cover}
          onLoad={() => setImageLoaded(true)}
          fallback={Platform.OS === 'android'}
        />
        
        {/* Media Icons (top right) */}
        <View style={styles.topRightContainer}>
          {renderMediaIcons()}
        </View>
        
        {/* Heart Button (bottom right on image) */}
        <TouchableOpacity 
          onPress={toggleFavorite} 
          style={styles.heartButton}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        >
          <Icon
            name={isFavorite ? 'favorite' : 'favorite-border'}
            size={22}
            color={isFavorite ? '#b92a31' : '#fff'}
          />
        </TouchableOpacity>
        
        {/* Neighborhood Ribbon (bottom left on image) */}
        {renderNeighborhoodRibbon()}
      </View>

      {/* Content Section */}
      <View style={[
        styles.contentContainer,
        worker.is_special && styles.specialContent,
        worker.is_urgent && !worker.is_special && styles.urgentContent,
      ]}>
        {/* Title Row */}
        <View style={styles.titleRow}>
        {worker.is_special && (
            <View style={styles.adBadge}>
              <Text style={styles.adBadgeText}>آگهی</Text>
            </View>
          )}
          <Text style={styles.workerName}>{worker.name}</Text>
         
        </View>

        {/* Price Section */}
        <View style={styles.priceWrapper}>
          {renderPrice()}
        </View>

        {/* Properties Row */}
        <View style={styles.propertiesWrapper}>
          {properties.map((pr, index) => {
            if (pr.name === 'قیمت') return null;
            if (pr.name === 'پول پیش') return null;
            if (pr.name === 'اجاره ماهیانه') return null;
            if (pr.name === 'قیمت هر متر') return null;
            if (pr.kind === 1 && pr.special === '1') {
              return (
                <Text key={index} style={styles.propertyText}>
                   {pr.name} {String(pr.value).replace(/(.)(?=(\d{3})+$)/g, '$1,')} |
                </Text>
              );
            }
            return null;
          })}
        </View>

        {/* Quick Hints */}
        <View style={[styles.quickHintsWrapper, !hasQuickHints && styles.noHints]}>
          {quickHints.map((pr, index) => (
            <View key={index}>
              {renderQuickHint(pr)}
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  
  specialCard: {
    backgroundColor: '#fff',
  },
  
  // Image Section
  imageContainer: {
    position: 'relative',
    width: '100%',
    // height: 160,
    height: 200,
  },
  
  image: {
    width: '100%',
    height: '100%',
  },
  
  imageHidden: {
    display: 'none',
  },
  
  imageSkeleton: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  
  // Urgent Ribbon - Simple and clean
  urgentRibbon: {
    position: 'absolute',
    top: 12,
    left: -30,
    backgroundColor: '#a92b31',
    paddingVertical: 4,
    paddingHorizontal: 40,
    transform: [{ rotate: '-45deg' }],
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  urgentRibbonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  // Top Right Icons
  topRightContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    zIndex: 10,
  },
  mediaIconsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  mediaIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  mediaIconText: {
    fontSize: 11,
    color: '#333',
    marginRight: 2,
  },
  
  // Heart Button
  heartButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 6,
    zIndex: 10,
  },
  
  // Neighborhood Ribbon
  neighborhoodRibbon: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 10,
  },
  neighborhoodText: {
    fontSize: 12,
    color: '#222',
  },
  
  // Content Section
  contentContainer: {
    padding: 12,
    backgroundColor: '#fff',
  },
  
  specialContent: {
      backgroundColor: '#F4A460',
     
  },
  
  urgentContent: {
    backgroundColor: '#dfdfdf',
  },
  
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  
  workerName: {
    fontSize: 14,
    // fontWeight: '500',
    color: '#111',
    textAlign: 'right',
  },
  
  adBadge: {
    backgroundColor: '#a92b31',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  adBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  priceWrapper: {
    marginBottom: 6,
  },
  
  price: {
    fontSize: 14,
    color: '#111',
    textAlign: 'right',
  },
  
  bold: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  
  priceLabel: {
    fontSize: 13,
    color: '#444',
  },
  
  rentFull: {
    fontSize: 13,
    color: '#444',
  },
  
  propertiesWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  
  propertyText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'right',
    marginLeft: 4,
  },
  
  quickHintsWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    minHeight: 28,
  },
  
  noHints: {
    minHeight: 8,
  },
  
  quickHint: {
    backgroundColor: '#b9272e',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 6,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  quickHintText: {
    color: 'white',
    fontSize: 11,
    textAlign: 'center',
  },
  
  checkIcon: {
    marginLeft: 3,
  },
});

export default WorkerCard;