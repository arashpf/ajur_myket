import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  FlatList,
  Alert,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { CityContext } from '../CityContext';

const CitySelector = ({handleCitySelect}) => {
  const { currentCity, updateCity, isLoading: contextLoading } = useContext(CityContext);
  const [showModal, setShowModal] = useState(false);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHint, setShowHint] = useState(true);
  
  // Animation value for bounce effect
  const bounceAnim = useRef(new Animated.Value(0)).current;

  // Start bounce animation when hint is visible
  useEffect(() => {
    if (!currentCity && showHint) {
      const bounceAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -8,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
      bounceAnimation.start();
      
      return () => bounceAnimation.stop();
    }
  }, [currentCity, showHint]);
  
  // Fetch cities when modal opens or search query changes
  useEffect(() => {
    if (!showModal) return;
    
    const timer = setTimeout(() => {
      fetchCities();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [showModal, searchQuery]);

  // const fetchCities = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get('https://api.ajur.app/api/search-cities', {
  //       params: { title: searchQuery || '' },
  //       timeout: 5000
  //     });
      
  //     setCities(response.data?.items || getDefaultCities());
  //   } catch (error) {
  //     console.error('Error fetching cities:', error);
  //     setCities(getDefaultCities());
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchCities = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.ajur.app/api/search-cities', {
        params: { title: searchQuery || '' },
        timeout: 5000
      });
      
      setCities(response.data?.items || []);
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]); // Set empty array instead of default cities
    } finally {
      setLoading(false);
    }
  };
  
  // You can remove the getDefaultCities function entirely since it's no longer used

  const getDefaultCities = () => [
    {id: 1, title: 'تهران'},
    {id: 2, title: 'رباط کریم'},
    {id: 3, title: 'کرج'},
    {id: 4, title: 'اصفهان'},
    {id: 5, title: 'مشهد'},
  ];

  const handleCitySelection = async (city) => {
    try {
      
      const success = await updateCity(city);
      if (success) {
        setShowModal(false);
        setSearchQuery('');
      }

      // Call the parent's handler after successful city update
        if (handleCitySelect) {
          handleCitySelect(city);  // This will trigger the parent's logic
        }
    } catch (error) {
      Alert.alert('خطا', 'ذخیره شهر با مشکل مواجه شد');
    }
  };

  const handleCloseModal = () => {
    if (!currentCity) {
      Alert.alert('انتخاب شهر الزامی است', 'لطفاً یک شهر را انتخاب کنید', [
        {text: 'باشه', style: 'cancel'},
      ]);
      return;
    }
    setShowModal(false);
  };

  const handleDismissHint = () => {
   
    setShowHint(false);
  };

  return (
    <>
      <View style={styles.selectorWrapper}>
        <Pressable 
          style={styles.cityButton} 
          onPress={() => setShowModal(true)}
          testID="citySelectorButton"
        >
          <View style={styles.cityButtonContent}>
            <Icon name="location-outline" size={16} color="#444" />
            <Text style={styles.cityText} numberOfLines={1}>
              {currentCity?.title || 'انتخاب شهر'}
            </Text>
          </View>
        </Pressable>

        {/* Hint Box */}
        {!currentCity && showHint && (
          <Animated.View 
            style={[
              styles.hintBox,
              { transform: [{ translateY: bounceAnim }] }
            ]}
          >
            {/* <Pressable 
              style={styles.hintCloseButton}
              onPress={handleDismissHint}
            >
              <Icon name="close" size={16} color="#64748b" />
            </Pressable> */}
            
            <Text style={styles.hintText}>
              شهر خود را انتخاب کنید تا آگهی های آن را ببینید
            </Text>
            
            {/* Arrow pointing to button */}
            <View style={styles.arrowContainer}>
              <Icon name="arrow-up" size={24} color="#a92b31" />
            </View>
          </Animated.View>
        )}
      </View>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>انتخاب شهر</Text>
              {currentCity && (
                <Pressable style={styles.closeButton} onPress={handleCloseModal}>
                  <Icon name="close" size={24} color="#334155" />
                </Pressable>
              )}
            </View>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="جستجوی شهر..."
                placeholderTextColor="#94a3b8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
              />
              <Icon name="search" size={20} color="#64748b" />
            </View>

            <View style={styles.cityList}>
              {loading ? (
                <ActivityIndicator size="large" color="#3b82f6" style={styles.loader} />
              ) : (
                <FlatList
                  data={cities}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({item}) => (
                    <Pressable
                      style={styles.cityItem}
                      onPress={() => handleCitySelection(item)}
                    >
                      <Text style={styles.cityItemText}>{item.title}</Text>
                      {currentCity?.id === item.id && (
                        <Icon name="checkmark" size={20} color="#3b82f6" />
                      )}
                    </Pressable>
                  )}
                  ListEmptyComponent={
                    <Text style={styles.noResults}>شهری یافت نشد</Text>
                  }
                />
              )}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  selectorWrapper: {
    position: 'relative',
  },
  cityButton: {
    marginLeft: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    maxWidth: 120,
    height: 48,
    justifyContent: 'center',
  },
  cityButtonContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  cityText: {
    fontSize: 14,
    color: '#334155',
    textAlign: 'right',
    fontFamily: 'iransans',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  hintBox: {
    position: 'absolute',
    top: 60,
    left: 0,
    backgroundColor: 'white',
    // borderWidth: 1,
    // borderColor: '#3b82f6',
    borderRadius: 12,
    padding: 3,
    paddingTop: 8,
    width: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  hintCloseButton: {
    position: 'absolute',
    top: 4,
    right: 15,
    padding: 4,
    zIndex: 1,
  },
  hintText: {
    fontSize: 13,
    color: 'gray',
    textAlign: 'center',
    fontFamily: 'iransans',
    lineHeight: 20,
    marginBottom: 4,
  },
  arrowContainer: {
    position: 'absolute',
    top: -15,
    left: 40,
    padding: 4,
    backgroundColor:'white',
    borderRadius:10,
    zIndex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    height: '100%',
    maxHeight: '100%',
  },
  modalHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    marginRight: 8,
    color: '#334155',
    fontFamily: 'iransans',
  },
  closeButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#334155',
    fontFamily: 'iransans',
    textAlign: 'right',
    padding: 0,
    marginLeft: 8,
  },
  cityList: {
    flex: 1,
    paddingBottom: 20,
  },
  cityItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  cityItemText: {
    fontSize: 16,
    color: '#334155',
    fontFamily: 'iransans',
    paddingRight: 20,
  },
  loader: {
    marginVertical: 20,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    color: '#64748b',
    fontFamily: 'iransans',
  },
});

export default CitySelector;
