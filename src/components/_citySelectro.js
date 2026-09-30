import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CitySelector = () => {
  const [showModal, setShowModal] = useState(false);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  // Load saved city on initial render
  useEffect(() => {
    const loadSavedCity = async () => {
      try {
        const savedCity = await AsyncStorage.getItem('selectedCity');

        if (savedCity) {
          setSelectedCity(JSON.parse(savedCity));
        } else if (initialLoad) {
          // Automatically open modal if no city is selected on first load
          setShowModal(true);
        }

        setInitialLoad(false);
      } catch (error) {
        console.error('Failed to load city from storage', error);
        if (initialLoad) {
          setShowModal(true);
        }
        setInitialLoad(false);
      }
    };

    loadSavedCity();
  }, []);

  // Fetch cities when modal opens
  useEffect(() => {
    if (showModal) {
      fetchCities();
    }
  }, [showModal, searchQuery]);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const response = await axios({
        method: 'get',
        url: 'https://api.ajur.app/api/search-cities',
        params: {
          title: searchQuery || '',
        },
      });

      setCities(response.data.items || []);
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([
        {id: 1, title: 'تهران'},
        {id: 2, title: 'رباط کریم'},
        {id: 3, title: 'کرج'},
        {id: 4, title: 'اصفهان'},
        {id: 5, title: 'مشهد'},
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = async city => {
    try {
      // Save both city object and ID to AsyncStorage
      await AsyncStorage.multiSet([
        ['selectedCity', JSON.stringify(city)],
        ['selectedCityId', city.id.toString()]
      ]);

      setSelectedCity(city);
      setShowModal(false);
    } catch (error) {
      console.error('Failed to save city selection', error);
    }

    // for make the AsyncStorage null for testing

    // try {
    //   await AsyncStorage.multiSet([
    //     ['selectedCity', JSON.stringify(null)],
    //     ['selectedCityId', ''],
    //   ]);
    //   console.log('City storage reset to null!');
    // } catch (error) {
    //   console.error('Error resetting city storage:', error);
    // }
  };

  // Prevent closing modal when no city is selected
  const handleCloseModal = () => {
    if (selectedCity) {
      setShowModal(false);
    } else {
      Alert.alert('انتخاب شهر الزامی است', 'لطفاً یک شهر را انتخاب کنید', [
        {text: 'باشه', style: 'cancel'},
      ]);
    }
  };

  return (
    <>
      {/* City Button - Shows current selection */}
      <Pressable style={styles.cityButton} onPress={() => setShowModal(true)}>
        <View style={styles.cityButtonContent}>
          <Icon
            name="location-outline"
            size={16}
            color="#444"
            style={styles.cityIcon}
          />
          <Text style={styles.cityText} numberOfLines={1}>
            {selectedCity?.title || 'انتخاب شهر'}
          </Text>
        </View>
      </Pressable>

      {/* City Selection Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={handleCloseModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>انتخاب شهر</Text>
              {selectedCity && ( // Only show close button if city is selected
                <Pressable
                  style={styles.closeButton}
                  onPress={handleCloseModal}>
                  <Icon name="close" size={24} color="#334155" />
                </Pressable>
              )}
            </View>

            {/* Search Input */}
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

            {/* City List */}
            <View style={styles.cityList}>
              {loading ? (
                <ActivityIndicator
                  size="large"
                  color="#3b82f6"
                  style={styles.loader}
                />
              ) : (
                <FlatList
                  data={cities}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({item}) => (
                    <Pressable
                      style={styles.cityItem}
                      onPress={() => handleCitySelect(item)}>
                      <Text style={styles.cityItemText}>{item.title}</Text>
                      {selectedCity?.id === item.id && (
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
  cityIcon: {
    marginLeft: 4,
  },
  cityText: {
    fontSize: 14,
    color: '#334155',
    textAlign: 'right',
    fontFamily: 'iransans',
    includeFontPadding: false,
    textAlignVertical: 'center',
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
    fontSize: 18,
    fontWeight: 'bold',
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
