import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
  TextInput,
  FlatList,
  ActivityIndicator,
  Pressable
} from 'react-native';
import { 
  Box, 
  Button, 
  Input,
  useToast,
} from 'native-base';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';

import axios from 'axios';
import styles from './styles';

const { width, height } = Dimensions.get('window');

// ==================== مودال انتخاب دسته بندی (فول اسکرین) ====================
export const CategoryModal = ({
  isVisible,
  categories,
  loading,
  selectedCategory,
  onSelectCategory,
  onClose,
  isForced,
  formatCategoryName,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={() => {
        if (!isForced && selectedCategory) {
          onClose();
        }
      }}
      style={styles.fullScreenModal}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropOpacity={0}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
    >
      <View style={styles.fullScreenModalContainer}>
        <View style={styles.categoryModalHeader}>
          <Text style={styles.categoryModalTitle}>انتخاب دسته بندی</Text>
          {!isForced && selectedCategory && (
            <Pressable onPress={onClose} style={styles.categoryModalCloseButton}>
              <Icon name="close" size={24} color="#666" />
            </Pressable>
          )}
        </View>

        <View style={styles.categoryModalDivider}>
          <View style={styles.categoryModalDividerLine} />
          <View style={styles.categoryModalDividerDot} />
          <View style={styles.categoryModalDividerLine} />
        </View>

        {loading ? (
          <View style={styles.categoryLoadingContainer}>
            {/* <Spinner size={40} type="Circle" color="#a92b31" /> */}
            <Text style={styles.categoryLoadingText}>در حال بارگذاری...</Text>
          </View>
        ) : (
          <ScrollView 
            style={styles.fullScreenCategoryList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.fullScreenCategoryListContent}
            keyboardShouldPersistTaps="handled"
          >
            {categories.map((cat, index) => (
              <Pressable
                key={cat.id}
                style={({ pressed }) => [
                  styles.categoryModalItem,
                  selectedCategory?.id === cat.id && styles.categoryModalItemSelected,
                  pressed && { opacity: 0.6 }
                ]}
                onPress={() => onSelectCategory(cat)}
                delayLongPress={200}
                android_ripple={{ color: 'rgba(169, 43, 49, 0.1)', borderless: false }}
              >
                <View style={styles.categoryModalItemContent}>
                  {selectedCategory?.id === cat.id ? (
                    <View style={styles.categoryModalCheckmark}>
                      <Icon name="checkmark-circle" size={24} color="#a92b31" />
                    </View>
                  ) : (
                    <View style={styles.categoryModalCheckmarkEmpty} />
                  )}
                  
                  <Text
                    style={[
                      styles.categoryModalItemText,
                      selectedCategory?.id === cat.id && styles.categoryModalItemTextSelected,
                    ]}
                  >
                    {formatCategoryName(cat.name)}
                  </Text>
                </View>
                
                {index < categories.length - 1 && (
                  <View style={styles.categoryModalItemDivider} />
                )}
              </Pressable>
            ))}
          </ScrollView>
        )}

        {isForced && (
          <View style={styles.fullScreenModalFooter}>
            <Icon name="alert-circle" size={20} color="#a92b31" />
            <Text style={styles.fullScreenModalFooterText}>لطفاً یک دسته بندی را انتخاب کنید</Text>
          </View>
        )}
      </View>
    </Modal>
  );
};

// ==================== مودال ورودی فیلدها ====================
export const FieldModal = ({
  isVisible,
  field,
  value,
  onChangeText,
  onConfirm,
  onClose,
  numToPersian,
}) => {
  return (
    <Modal
      animationType="fade"
      onBackdropPress={onClose}
      style={styles.modal}
      isVisible={isVisible}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={onConfirm} style={styles.confirmHeaderButton}>
              <Text style={styles.confirmHeaderButtonText}>تایید</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.modalContent}>
          <Button full light style={styles.valueButton}>
            <Text style={styles.valueText}>
              {field?.value} - {field?.unit}
            </Text>
          </Button>
          <Text style={styles.descriptionText}>{numToPersian()}</Text>
          <Input
            autoFocus
            keyboardType="numeric"
            style={styles.inputField}
            placeholder="مقدار را وارد کنید"
            returnKeyLabel="search"
            maxLength={14}
            onChangeText={onChangeText}
            onSubmitEditing={onConfirm}
            _focus={{
              backgroundColor: 'white',
              borderColor: '#b92a31',
              borderWidth: 2,
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

// ==================== مودال پیش‌نمایش عکس ====================
// In ImagePreviewModal component
export const ImagePreviewModal = ({
  isVisible,
  image,
  onClose,
  onDelete,
  onSetMain,
}) => {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
      <Box flex={1} bg="black" justifyContent="center" alignItems="center">
        <Button
          position="absolute"
          top={2}
          left={5}
          size="sm"
          variant="unstyled"
          onPress={onClose}
          style={{ zIndex: 10000 }}
          _text={{ color: 'white' }}
        >
          <Icon style={{ color: 'white', fontSize: 40, backgroundColor: 'black', borderRadius: 5 }} name="ios-close" />
        </Button>

        <ImageBackground
          source={{ uri: image?.uri }}
          style={styles.fullScreenImage}
          resizeMode="contain"
        />

        <Box flexDirection="row" justifyContent="space-around" mt={5} width="80%">
          <Button colorScheme="red" onPress={onDelete}>
            حذف این عکس
          </Button>
          <Button 
            colorScheme="blue" 
            onPress={() => {
              console.log('🔄 Setting as main image from modal:', image);
              onSetMain();
            }}
          >
            انتخاب برای عکس اصلی
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

// ==================== مودال هشدار برای خروج ====================
export const AlertModal = ({
  isVisible,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onCancel}
      style={{ justifyContent: 'center', margin: 20 }}
      animationIn="fadeIn"
      animationOut="fadeOut"
    >
      <View style={{ 
        backgroundColor: 'white', 
        borderRadius: 16, 
        padding: 24,
        alignItems: 'center'
      }}>
        <Icon name="warning-outline" size={60} color="#ff6b6b" />
        <Text style={{ 
          fontSize: 20, 
          fontWeight: 'bold', 
          fontFamily: 'iransans',
          marginTop: 16,
          color: '#333'
        }}>
          خروج از صفحه
        </Text>
        <Text style={{ 
          fontSize: 16, 
          fontFamily: 'iransans',
          marginTop: 8,
          marginBottom: 24,
          color: '#666',
          textAlign: 'center'
        }}>
          آیا مطمئن هستید که می‌خواهید خارج شوید؟ اطلاعات وارد شده ذخیره نخواهد شد.
        </Text>
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-around', 
          width: '100%' 
        }}>
          <Button 
            onPress={onCancel}
            style={{ 
              flex: 1, 
              marginRight: 8, 
              backgroundColor: '#e0e0e0' 
            }}
          >
            <Text style={{ color: '#333' }}>انصراف</Text>
          </Button>
          <Button 
            onPress={onConfirm}
            style={{ 
              flex: 1, 
              marginLeft: 8, 
              backgroundColor: '#ff6b6b' 
            }}
          >
            <Text style={{ color: 'white' }}>خروج</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

// ==================== مودال هشدار برای بدون عکس ====================
export const NoImageAlertModal = ({
  isVisible,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onCancel}
      style={{ justifyContent: 'center', margin: 20 }}
      animationIn="fadeIn"
      animationOut="fadeOut"
    >
      <View style={{ 
        backgroundColor: 'white', 
        borderRadius: 16, 
        padding: 24,
        alignItems: 'center'
      }}>
        <Icon name="image-outline" size={60} color="#ffa94d" />
        <Text style={{ 
          fontSize: 20, 
          fontWeight: 'bold', 
          fontFamily: 'iransans',
          marginTop: 16,
          color: '#333'
        }}>
          ثبت ملک بدون عکس
        </Text>
        <Text style={{ 
          fontSize: 16, 
          fontFamily: 'iransans',
          marginTop: 8,
          marginBottom: 24,
          color: '#666',
          textAlign: 'center'
        }}>
          ملک با عکس های مناسب به مراتب بیشتر دیده و به آن توجه خواهد شد
        </Text>
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-around', 
          width: '100%' 
        }}>
          <Button 
            onPress={onCancel}
            style={{ 
              flex: 1, 
              marginRight: 8, 
              backgroundColor: '#e0e0e0' 
            }}
          >
            <Text style={{ color: '#333' }}>نه صبر کن</Text>
          </Button>
          <Button 
            onPress={onConfirm}
            style={{ 
              flex: 1, 
              marginLeft: 8, 
              backgroundColor: '#ff6b6b' 
            }}
          >
            <Text style={{ color: 'white' }}>آره، اطمینان دارم</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

// ==================== مودال آدرس ====================
export const AddressModal = ({
  isVisible,
  onClose,
  onConfirm,
  isLoading,
}) => {
  const scrollViewRef = useRef(null);
  const toast = useToast();
  
  const [addressFormatted, setAddressFormatted] = useState('');
  const [addressRegion, setAddressRegion] = useState('');
  const [addressNeighbourhood, setAddressNeighbourhood] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressMunicipalityZone, setAddressMunicipalityZone] = useState('');
  const [addressState, setAddressState] = useState('');
  
  const [availableCities, setAvailableCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [availableNeighborhoods, setAvailableNeighborhoods] = useState([]);
  const [filteredNeighborhoods, setFilteredNeighborhoods] = useState([]);
  
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [neighborhoodModalVisible, setNeighborhoodModalVisible] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [neighborhoodSearchQuery, setNeighborhoodSearchQuery] = useState('');
  
  const [btnStatus, setBtnStatus] = useState(false);
  const [errors, setErrors] = useState({
    city: '',
    neighborhood: '',
    address: ''
  });
  const [loadingLocations, setLoadingLocations] = useState(true);

  useEffect(() => {
    if (isVisible) {
      loadAvailableLocations();
    }
  }, [isVisible]);

  const loadAvailableLocations = async () => {
    setLoadingLocations(true);
    try {
      const response = await axios.get('https://api.ajur.app/api/all-available-locations');
      const cities = response.data.cities || [];
      setAvailableCities(cities);
      setFilteredCities(cities);
      
      const neighborhoods = response.data.neighborhoods || [];
      setAvailableNeighborhoods(neighborhoods);
    } catch (error) {
      console.error('Error loading locations:', error);
      showToast('خطا در دریافت اطلاعات شهرها', 'error');
    } finally {
      setLoadingLocations(false);
    }
  };

  useEffect(() => {
    if (citySearchQuery.trim() === '') {
      setFilteredCities(availableCities);
    } else {
      const filtered = availableCities.filter(city => 
        city.title && city.title.toLowerCase().includes(citySearchQuery.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [citySearchQuery, availableCities]);

  useEffect(() => {
    let filtered = [];
    
    if (addressCity && availableNeighborhoods.length > 0) {
      filtered = availableNeighborhoods.filter(nb => 
        nb.city_name === addressCity
      );
      
      if (filtered.length === 0) {
        filtered = [{ id: 'all-areas', name: 'همه مناطق', city_name: addressCity }];
      }
    }
    
    if (neighborhoodSearchQuery.trim() !== '') {
      filtered = filtered.filter(nb => 
        nb.name && nb.name.toLowerCase().includes(neighborhoodSearchQuery.toLowerCase())
      );
    }
    
    setFilteredNeighborhoods(filtered);
  }, [addressCity, availableNeighborhoods, neighborhoodSearchQuery]);

  useEffect(() => {
    updateFormattedAddress();
  }, [addressCity, addressNeighbourhood]);

  const updateFormattedAddress = () => {
    let combined = '';
    if (addressCity && addressNeighbourhood) {
      combined = `${addressCity} ${addressNeighbourhood}`;
    } else if (addressCity) {
      combined = addressCity;
    } else if (addressNeighbourhood) {
      combined = addressNeighbourhood;
    }
    
    if (combined !== addressFormatted && combined !== '') {
      setAddressFormatted(combined);
    }
  };

  const validateForm = () => {
    const newErrors = {
      city: '',
      neighborhood: '',
      address: ''
    };
    
    if (!addressCity) {
      newErrors.city = 'لطفا شهر را انتخاب کنید';
    }
    if (!addressNeighbourhood) {
      newErrors.neighborhood = 'لطفا محله را انتخاب کنید';
    }
    if (!addressFormatted || addressFormatted.trim() === '') {
      newErrors.address = 'لطفا آدرس کامل را وارد کنید';
    }
    
    setErrors(newErrors);
    
    return !newErrors.city && !newErrors.neighborhood && !newErrors.address;
  };

  const clearFieldError = (field) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const selectCity = (city) => {
    setAddressCity(city.title);
    setAddressNeighbourhood('');
    setCityModalVisible(false);
    setCitySearchQuery('');
    clearFieldError('city');
    clearFieldError('neighborhood');
  };

  const selectNeighborhood = (neighborhood) => {
    setAddressNeighbourhood(neighborhood.name);
    setNeighborhoodModalVisible(false);
    setNeighborhoodSearchQuery('');
    clearFieldError('neighborhood');
  };

  const handleConfirm = () => {
    if (!validateForm()) {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
      showToast('لطفا تمام فیلدهای الزامی را پر کنید', 'warning');
      return;
    }

    setBtnStatus(true);
    
    onConfirm({
      formatted: addressFormatted,
      region: addressRegion,
      neighbourhood: addressNeighbourhood,
      city: addressCity,
      municipality_zone: addressMunicipalityZone,
      state: addressState,
    });
    
    setBtnStatus(false);
  };

  const showToast = (message, type = 'info') => {
    const bgColor = type === 'success' ? 'green.500' : type === 'error' ? 'red.500' : 'orange.500';
    toast.show({
      render: () => {
        return (
          <Box bg={bgColor} px="15" py="3" rounded="md" mb={5}>
            <Text style={{color:'white',fontSize:16}}>{message}</Text>
          </Box>
        );
      }
    });
  };

  const renderCityModal = () => (
    <Modal
      isVisible={cityModalVisible}
      onBackdropPress={() => setCityModalVisible(false)}
      style={{ justifyContent: 'flex-end', margin: 0 }}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={styles.addressModalContainer}>
        <View style={styles.addressModalHeader}>
          <Text style={styles.addressModalTitle}>انتخاب شهر</Text>
          <TouchableOpacity onPress={() => setCityModalVisible(false)}>
            <Icon name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.addressModalSearchWrapper}>
          <View style={styles.addressModalSearchInput}>
            <Icon name="search" size={20} color="#999" />
            <TextInput
              style={styles.addressModalSearchText}
              placeholder="جستجوی شهر..."
              placeholderTextColor="#999"
              value={citySearchQuery}
              onChangeText={setCitySearchQuery}
              textAlign="right"
            />
            {citySearchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setCitySearchQuery('')}>
                <Icon name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <FlatList
          data={filteredCities}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.addressModalItem}
              onPress={() => selectCity(item)}
            >
              <View style={styles.addressModalItemContent}>
                <Icon name="location-outline" size={20} color="#4CAF50" />
                <Text style={styles.addressModalItemText}>{item.title}</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={true}
          ListEmptyComponent={
            <View style={styles.addressModalEmptyContainer}>
              <Icon name="search-outline" size={50} color="#ccc" />
              <Text style={styles.addressModalEmptyText}>شهری یافت نشد</Text>
            </View>
          }
        />
      </View>
    </Modal>
  );

  const renderNeighborhoodModal = () => (
    <Modal
      isVisible={neighborhoodModalVisible}
      onBackdropPress={() => setNeighborhoodModalVisible(false)}
      style={{ justifyContent: 'flex-end', margin: 0 }}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={styles.addressModalContainer}>
        <View style={styles.addressModalHeader}>
          <Text style={styles.addressModalTitle}>انتخاب محله</Text>
          <TouchableOpacity onPress={() => setNeighborhoodModalVisible(false)}>
            <Icon name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.addressModalSearchWrapper}>
          <View style={styles.addressModalSearchInput}>
            <Icon name="search" size={20} color="#999" />
            <TextInput
              style={styles.addressModalSearchText}
              placeholder="جستجوی محله..."
              placeholderTextColor="#999"
              value={neighborhoodSearchQuery}
              onChangeText={setNeighborhoodSearchQuery}
              textAlign="right"
            />
            {neighborhoodSearchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setNeighborhoodSearchQuery('')}>
                <Icon name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {!addressCity ? (
          <View style={styles.addressModalWarningContainer}>
            <Icon name="warning" size={40} color="#FF9800" />
            <Text style={styles.addressModalWarningText}>لطفا ابتدا شهر را انتخاب کنید</Text>
          </View>
        ) : (
          <FlatList
            data={filteredNeighborhoods}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.addressModalItem}
                onPress={() => selectNeighborhood(item)}
              >
                <View style={styles.addressModalItemContent}>
                  <Icon name="navigate-outline" size={20} color="#2196F3" />
                  <Text style={styles.addressModalItemText}>{item.name}</Text>
                </View>
                <Icon name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={true}
            ListEmptyComponent={
              <View style={styles.addressModalEmptyContainer}>
                <Icon name="search-outline" size={50} color="#ccc" />
                <Text style={styles.addressModalEmptyText}>محله‌ای یافت نشد</Text>
              </View>
            }
          />
        )}
      </View>
    </Modal>
  );

  if (loadingLocations) {
    return (
      <Modal
        isVisible={isVisible}
        style={{ justifyContent: 'center', margin: 20 }}
      >
        <View style={styles.addressLoadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.addressLoadingText}>در حال بارگذاری...</Text>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={{ justifyContent: 'center', margin: 0 }}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={styles.addressMainContainer}>
        <View style={styles.addressHeader}>
          <Text style={styles.addressHeaderTitle}>ثبت موقعیت ملک</Text>
          <TouchableOpacity onPress={onClose} style={styles.addressCloseButton}>
            <Icon name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          ref={scrollViewRef}
          style={styles.addressScrollContent}
          contentContainerStyle={styles.addressScrollContentContainer}
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.addressInfoCard}>
            <Icon name="information-circle" size={28} color="#2196F3" />
            <Text style={styles.addressInfoText}>
              لطفا شهر، محله و آدرس کامل ملک خود را وارد کنید
            </Text>
          </View>

          <View style={styles.addressFormField}>
            <Text style={styles.addressLabel}>انتخاب شهر *</Text>
            <TouchableOpacity 
              style={[styles.addressSelectionButton, errors.city && styles.addressSelectionButtonError]}
              onPress={() => setCityModalVisible(true)}
            >
              <View style={styles.addressSelectionButtonContent}>
                <Icon name="location" size={22} color="#4CAF50" />
                <Text style={[
                  styles.addressSelectionButtonText,
                  !addressCity && styles.addressSelectionButtonPlaceholder
                ]}>
                  {addressCity || 'شهر را انتخاب کنید'}
                </Text>
              </View>
              <Icon name="chevron-down" size={22} color="#999" />
            </TouchableOpacity>
            {errors.city ? (
              <Text style={styles.addressErrorText}>{errors.city}</Text>
            ) : null}
          </View>

          <View style={styles.addressFormField}>
            <Text style={styles.addressLabel}>انتخاب محله *</Text>
            <TouchableOpacity 
              style={[styles.addressSelectionButton, errors.neighborhood && styles.addressSelectionButtonError]}
              onPress={() => {
                if (!addressCity) {
                  showToast('لطفا ابتدا شهر را انتخاب کنید', 'warning');
                  return;
                }
                setNeighborhoodModalVisible(true);
              }}
            >
              <View style={styles.addressSelectionButtonContent}>
                <Icon name="navigate" size={22} color="#2196F3" />
                <Text style={[
                  styles.addressSelectionButtonText,
                  !addressNeighbourhood && styles.addressSelectionButtonPlaceholder
                ]}>
                  {addressNeighbourhood || 'محله را انتخاب کنید'}
                </Text>
              </View>
              <Icon name="chevron-down" size={22} color="#999" />
            </TouchableOpacity>
            {errors.neighborhood ? (
              <Text style={styles.addressErrorText}>{errors.neighborhood}</Text>
            ) : null}
          </View>

          <View style={styles.addressFormField}>
            <Text style={styles.addressLabel}>آدرس کامل *</Text>
            <View style={styles.addressHint}>
              <Icon name="bulb-outline" size={16} color="#FF9800" />
              <Text style={styles.addressHintText}>
                آدرس قابل ویرایش است
              </Text>
            </View>
            <TextInput
              style={[styles.addressInput, errors.address && styles.addressInputError]}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={addressFormatted}
              onChangeText={(text) => {
                setAddressFormatted(text);
                clearFieldError('address');
              }}
              placeholder="آدرس کامل محل را وارد کنید..."
              placeholderTextColor="#999"
              textAlign="right"
            />
            {errors.address ? (
              <Text style={styles.addressErrorText}>{errors.address}</Text>
            ) : null}
          </View>
          
          <View style={styles.addressButtonContainer}>
            <TouchableOpacity 
              style={styles.addressSubmitButton}
              onPress={handleConfirm}
              disabled={btnStatus || isLoading}
            >
              {btnStatus || isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <View style={styles.addressSubmitButtonContent}>
                  <Icon name="checkmark" size={20} color="white" />
                  <Text style={styles.addressSubmitButtonText}>تایید آدرس</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          
          <View style={styles.addressBottomPadding} />
        </ScrollView>

        {renderCityModal()}
        {renderNeighborhoodModal()}
      </View>
    </Modal>
  );
};

// ==================== مودال بستن صفحه (NEW) ====================
export const CloseModal = ({
  isVisible,
  onCancel,
  onSave,
  onDelete,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onCancel}
      style={{ justifyContent: 'center', margin: 20 }}
      animationIn="fadeIn"
      animationOut="fadeOut"
    >
      <View style={{ 
        backgroundColor: 'white', 
        borderRadius: 16, 
        padding: 24,
        alignItems: 'center'
      }}>
        <Icon name="warning-outline" size={60} color="#ff6b6b" />
        <Text style={{ 
          fontSize: 20, 
          fontWeight: 'bold', 
          fontFamily: 'iransans',
          marginTop: 16,
          color: '#333'
        }}>
          خروج از صفحه
        </Text>
        <Text style={{ 
          fontSize: 16, 
          fontFamily: 'iransans',
          marginTop: 8,
          marginBottom: 24,
          color: '#666',
          textAlign: 'center'
        }}>
          آیا می‌خواهید پیش‌نویس را ذخیره کنید یا حذف کنید؟
        </Text>
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-around', 
          width: '100%',
          flexWrap: 'wrap',
        }}>
          <Button 
            onPress={onSave}
            style={{ 
              flex: 1, 
              marginRight: 4, 
              backgroundColor: '#4CAF50',
              paddingVertical: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: 'white', fontFamily: 'iransans', fontSize: 14 }}>
              ذخیره پیش‌نویس
            </Text>
          </Button>
          <Button 
            onPress={onDelete}
            style={{ 
              flex: 1, 
              marginLeft: 4, 
              backgroundColor: '#ff6b6b',
              paddingVertical: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: 'white', fontFamily: 'iransans', fontSize: 14 }}>
              حذف کامل
            </Text>
          </Button>
        </View>
        <Button 
          onPress={onCancel}
          style={{ 
            marginTop: 12,
            backgroundColor: '#e0e0e0',
            paddingVertical: 10,
            borderRadius: 8,
            width: '100%',
          }}
        >
          <Text style={{ color: '#333', fontFamily: 'iransans', fontSize: 14 }}>
            انصراف
          </Text>
        </Button>
      </View>
    </Modal>
  );
};