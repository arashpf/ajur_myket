import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Modal,
  Animated,
  Alert,
  Platform,
  Share,
  TouchableWithoutFeedback,
} from 'react-native';
import { useToast, Box } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import 'moment/locale/fa';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

moment.locale('fa');

const { width: screenWidth } = Dimensions.get('window');

const WorkerRealEstateCard = ({ 
  data, 
  isSelected, 
  selectMode, 
  onPress, 
  onLongPress,
  onDeleteSuccess 
}) => {
  const toast = useToast();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleCardPress = () => {
    if (selectMode || isSelected) {
      onPress();
    } else {
      openModal();
    }
  };

  const handleDeleteWithAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onPressDestroy();
    });
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const onPressDestroy = () => {
    setLoading(true);
    AsyncStorage.getItem('id_token').then(token => {
      axios({
        method: 'get',
        url: 'https://api.ajur.app/api/destroy-worker',
        params: { token, workerid: data.id },
      })
      .then(() => {
        setLoading(false);
        toast.show({
          render: () => (
            <Box bg="green.700" px="15" py="3" rounded="md" mb={5}>
              <Text style={{color: 'white', fontSize: 16}}>آگهی شما حذف شد</Text>
            </Box>
          ),
        });
        if (onDeleteSuccess) {
          onDeleteSuccess(data.id);
        }
      })
      .catch(error => {
        console.log(error);
        toast.show({
          render: () => (
            <Box bg="red.700" px="15" py="3" rounded="md" mb={5}>
              <Text style={{color: 'white', fontSize: 16}}>مشکلی پیش آمده!!</Text>
            </Box>
          ),
        });
        setLoading(false);
      });
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'هشدار',
      'آیا مطمئن هستید که می‌خواهید این فایل را حذف کنید؟',
      [
        { text: 'انصراف', style: 'cancel' },
        { 
          text: 'حذف', 
          style: 'destructive',
          onPress: () => {
            handleDeleteWithAnimation();
            closeModal();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleShare = async () => {
    try {
      const propertyUrl = `https://ajur.app/worker/${data.id}`;
      const shareOptions = {
        title: 'اشتراک گذاری ملک',
        message: data.description || '',
        url: propertyUrl,
      };

      if (Platform.OS === 'android') {
        await Share.share({
          title: shareOptions.title,
          message: `${shareOptions.message}\n\n${shareOptions.url}`,
        });
      } else {
        await Share.share(shareOptions);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleOptionPress = (option) => {
    closeModal();
    switch (option) {
      case 'share': handleShare(); break;
      // case 'edit': navigation.navigate('SingleEdit', {itemId: data.id}); break;
      case 'edit': navigation.navigate('NewWorker', { 
        mode: 'edit', 
        propertyId: data.id 
      });; break;
      case 'preview': navigation.navigate('WorkerSingle', {itemId: data.id}); break;
      case 'stats': navigation.navigate('SingleChart', {itemId: data.id}); break;
      case 'boost': navigation.navigate('SingleUpgrade', {worker_id: data.id}); break;
      case 'delete': handleDelete(); break;
      default: break;
    }
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case '1': return {text: 'تایید شده', color: '#4CAF50'};
      case '2': return {text: 'در انتظار تایید', color: '#FF9800'};
      case '3': return {text: 'نیاز به تغییرات', color: '#F44336'};
      case '4': return {text: 'رد شده', color: 'red'};
      default: return {text: 'نامشخص', color: '#9E9E9E'};
    }
  };

  const formatDate = () => moment(data.updated_at).fromNow();
  const needsUpdate = data.updated_at && 
    Math.floor((new Date() - new Date(data.updated_at)) / (1000 * 60 * 60 * 24)) > 21;

  const {text: statusText, color: statusColor} = getStatusBadge(data.status);
  const lastUpdate = data.updated_at ? formatDate() : null;

  const onTogleCheck = () => {
    onLongPress();
    closeModal();
  };

  // Check for special and urgent
  const isSpecial = data.is_special === true;
  const isUrgent = data.is_urgent === true;

  // Render urgent ribbon on image
  const renderUrgentRibbon = () => {
    if (!isUrgent) return null;
    
    return (
      <View style={styles.imageUrgentRibbon}>
        <Text style={styles.imageUrgentRibbonText}>فوری</Text>
      </View>
    );
  };

  // Render special badge on card
  const renderSpecialBadge = () => {
    if (!isSpecial) return null;
    
    return (
      <View style={styles.specialBadge}>
        <Text style={styles.specialBadgeText}>ویژه</Text>
      </View>
    );
  };

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity
        style={[
          styles.card,
          (selectMode || isSelected) && styles.selectModeCard,
          isSelected && styles.selectedCard,
          isSpecial && styles.specialCard,
          isUrgent && !isSpecial && styles.urgentCard,
        ]}
        onPress={handleCardPress}
        onLongPress={onLongPress}
        delayLongPress={200}
        activeOpacity={0.7}
      >
        {(selectMode || isSelected) && (
          <View style={[
            styles.selectionCheckbox,
            isSelected && styles.selectedCheckbox
          ]}>
            {isSelected && (
              <Icon name="checkmark" size={16} color="white" style={styles.checkIcon} />
            )}
          </View>
        )}

        {/* Image Section - Fixed width and height */}
        <View style={styles.imageWrapper}>
          <Image
            defaultSource={require('../assets/img/wait.gif')}
            source={{uri: data.thumb}}
            style={styles.image}
          />
          {renderUrgentRibbon()}
          {needsUpdate && (
            <View style={styles.updateRibbon}>
              <Text style={styles.updateRibbonText}>نیاز به بروز رسانی</Text>
            </View>
          )}
        </View>

        {/* Info Section - Takes remaining space */}
        <View style={[
          styles.infoContainer,
          isSpecial && styles.specialInfoContainer,
          isUrgent && !isSpecial && styles.urgentInfoContainer,
        ]}>
          {/* Top Row - NOT COMMENTED ANYMORE */}
          <View style={styles.topRow}>
            
              <Text style={styles.workerName} numberOfLines={1}>{data.name}</Text>
              {renderSpecialBadge()}
            
            {/* <Text style={styles.distanceBadge}>{data.distance} km</Text> */}
          </View>

          {/* Special Values */}
          {data.specialvalue1 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailValue} numberOfLines={1}>{data.specialvalue1}</Text>
              <Text style={styles.detailLabel}>{data.specialname1}</Text>
            </View>
          )}

          {data.specialvalue2 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailValue} numberOfLines={1}>{data.specialvalue2}</Text>
              <Text style={styles.detailLabel}>{data.specialname2}</Text>
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.locationText} numberOfLines={1}>
              {data.cat_name} {data.region} {data.neighbourhood}
            </Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusBadge, {backgroundColor: statusColor}]}>
                <Text style={styles.statusBadgeText}>
                  {statusText}
                  {lastUpdate ? ` | ${lastUpdate}` : ''}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        transparent
        visible={modalVisible}
        onRequestClose={closeModal}
        animationType="none"
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <Animated.View style={[styles.modalContainer, {transform: [{translateY}]}]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{data.name}</Text>
            
            <TouchableOpacity onPress={onTogleCheck} style={styles.modalCheckButton}>
              {isSelected ? (
                <Icon name="checkbox" size={24} color="#007AFF" />
              ) : (
                <View style={styles.modalCheckContainer}>
                  <Icon name="square-outline" size={24} color="gray" />
                  <Text style={styles.modalCheckText}>انتخاب</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.optionsGrid}>
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.gridOption}
                onPress={() => handleOptionPress('boost')}
              >
                <Icon name="rocket" size={28} color="#f57c00" />
                <Text style={styles.gridOptionText}>افزایش بازدید</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.gridOption}
                onPress={() => handleOptionPress('edit')}
              >
                <Icon name="create" size={28} color="#4CAF50" />
                <Text style={styles.gridOptionText}>ویرایش</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.gridOption}
                onPress={() => handleOptionPress('preview')}
              >
                <Icon name="eye" size={28} color="#2196F3" />
                <Text style={styles.gridOptionText}>پیش نمایش</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.gridOption}
                onPress={() => handleOptionPress('stats')}
              >
                <Icon name="stats-chart" size={28} color="#9C27B0" />
                <Text style={styles.gridOptionText}>آمار بازدید</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.gridOption}
                onPress={() => handleOptionPress('share')}
              >
                <Icon name="share-social" size={28} color="#FF9800" />
                <Text style={styles.gridOptionText}>اشتراک گذاری</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.gridOption, styles.deleteOption]}
                onPress={() => handleOptionPress('delete')}
              >
                <Icon name="trash" size={28} color="#ff3b30" />
                <Text style={[styles.gridOptionText, styles.deleteText]}>حذف</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
    height: 130,
  },
  selectModeCard: {
    backgroundColor: 'rgba(10, 122, 242, 0.05)',
  },
  selectedCard: {
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  specialCard: {
    borderWidth: 1,
    borderColor: '#dadada',
  },
  urgentCard: {
    borderWidth: 1,
    borderColor: '#dadada',
  },
  
  // Image Section
  imageWrapper: {
    width: 110,
    height: 130,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  // Urgent Ribbon on Image
  imageUrgentRibbon: {
    position: 'absolute',
    top: 8,
    left: -30,
    backgroundColor: '#a92b31',
    paddingVertical: 4,
    paddingHorizontal: 40,
    transform: [{ rotate: '-45deg' }],
    zIndex: 10,
  },
  imageUrgentRibbonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  // Update Ribbon
  updateRibbon: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#E53935',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderTopRightRadius: 8,
  },
  updateRibbonText: {
    fontSize: 10,
    color: '#fff',
    fontFamily: 'iransans',
  },
  
  // Info Container
  infoContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  specialInfoContainer: {
    backgroundColor: '#eee',
  },
  urgentInfoContainer: {
    // backgroundColor: '#FFF3E0',
  },
  
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    // Add this if you want to ensure RTL layout
    flexDirection: 'row-reverse', // This will reverse the order for RTL
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'flex-end', // This pushes items to the right
  },
  workerName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#222',
    fontFamily: 'iransans',
    textAlign: 'right',
    flexShrink: 1,
    maxWidth: '100%',
  },
  specialBadge: {
    backgroundColor: '#DAA520',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  specialBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
    fontFamily: 'iransans',
  },
  distanceBadge: {
    color: '#666',
    fontSize: 10,
    fontFamily: 'iransans',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  detailLabel: {
    fontSize: 10,
    color: '#888',
    fontFamily: 'iransans',
  },
  detailValue: {
    fontSize: 11,
    fontWeight: '500',
    color: '#333',
    fontFamily: 'iransans',
    maxWidth: '60%',
  },
  
  footer: {
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 0.5,
    borderTopColor: '#e0e0e0',
  },
  locationText: {
    fontSize: 10,
    color: '#666',
    fontFamily: 'iransans',
    textAlign: 'right',
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    fontSize: 9,
    color: '#fff',
    fontFamily: 'iransans',
  },
  
  // Selection Checkbox
  selectionCheckbox: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    backgroundColor: 'white',
  },
  selectedCheckbox: {
    backgroundColor: '#007AFF',
  },
  checkIcon: {
    color: 'white',
    fontSize: 12,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    fontFamily: 'iransans',
    flex: 1,
  },
  modalCheckButton: {
    paddingHorizontal: 8,
  },
  modalCheckContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  modalCheckText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'iransans',
    marginLeft: 4,
  },
  optionsGrid: {
    width: '100%',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  gridOption: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    minWidth: 70,
  },
  gridOptionText: {
    fontSize: 11,
    fontFamily: 'iransans',
    textAlign: 'center',
    marginTop: 6,
    color: '#333',
  },
  deleteOption: {
    backgroundColor: '#fff5f5',
  },
  deleteText: {
    color: '#ff3b30',
  },
});

export default WorkerRealEstateCard;