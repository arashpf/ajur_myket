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
import { Container, useToast, Box } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import 'moment/locale/fa';
import Icon from 'react-native-vector-icons/Ionicons';
import { color } from 'react-native-reanimated';
import { background } from 'native-base/lib/typescript/theme/styled-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

moment.locale('fa');

const { width: screenWidth } = Dimensions.get('window');

const WorkerRealEstateCard = ({ 
  data, 
  isSelected, 
  selectMode, 
  onPress, 
  onLongPress 
}) => {
  const toast = useToast();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleCardPress = () => {
    if (selectMode || isSelected) {
      onPress();
    } else {
      openModal();
    }
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
        navigation.popToTop();
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
            onPressDestroy();
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
      case 'edit': navigation.navigate('SingleEdit', {itemId: data.id}); break;
      case 'preview': navigation.navigate('WorkerSingle', {itemId: data.id}); break;
      case 'stats': navigation.navigate('SingleChart', {itemId: data.id}); break;
      case 'boost': break; // Implement boost functionality
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
      case '1': return {text: 'آگهی تایید شده', color: '#4CAF50'};
      case '2': return {text: 'در انتظار تایید', color: '#FF9800'};
      case '3': return {text: 'نیاز به تغییرات', color: '#F44336'};
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
  }

  return (
    <Container style={styles.container}>
      <TouchableOpacity
        style={[
          styles.item, 
          (selectMode || isSelected) && styles.selectModeItem,
          isSelected && styles.selectedItem
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

        <View style={styles.imageWrapper}>
          <Image
            defaultSource={require('../assets/img/wait.gif')}
            source={{uri: data.thumb}}
            style={styles.image}
          />
          {needsUpdate && (
            <View style={styles.ribbon}>
              <Text style={styles.ribbonText}>نیاز به بروز رسانی</Text>
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.topRow}>
            <Text style={styles.distanceBadge}>{data.distance} km</Text>
            <Text style={styles.workerName}>{data.name}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailText}>{data.specialvalue1}</Text>
            <Text style={styles.detailText}>{data.specialname1}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailText}>{data.specialvalue2}</Text>
            <Text style={styles.detailText}>{data.specialname2}</Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
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
            
    <TouchableOpacity onPress={onTogleCheck} style={{ alignItems: 'center' }}>
  {isSelected ? (
    <Icon name="checkbox" size={25} color="gray" style={styles.checkTitleIcon} />
  ) : (
    <View style={{flexDirection:'row',justifyContent:'space-around'}}>
    <Icon name="square-outline" size={25} color="gray" style={styles.checkTitleIcon} />
    <Text style={{ fontSize: 14, color: '#444',  marginLeft:3,marginTop:4,fontFamily:'iransans' }}>انتخاب</Text>
    </View>
  )}
  
</TouchableOpacity>

            
          </View>

          <View style={styles.optionsGrid}>
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.gridOption}
                onPress={() => handleOptionPress('share')}
              >
                <Icon name="share-social" size={24} color="#333" />
                <Text style={styles.gridOptionText}>اشتراک گذاری</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.gridOption}
                onPress={() => handleOptionPress('edit')}
              >
                <Icon name="create" size={24} color="#333" />
                <Text style={styles.gridOptionText}>ویرایش</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.gridOption}
                onPress={() => handleOptionPress('preview')}
              >
                <Icon name="eye" size={24} color="#333" />
                <Text style={styles.gridOptionText}>پیش نمایش</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.gridOption}
                onPress={() => handleOptionPress('stats')}
              >
                <Icon name="stats-chart" size={24} color="#333" />
                <Text style={styles.gridOptionText}>آمار بازدید</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.gridOption}
                onPress={() => handleOptionPress('boost')}
              >
                <Icon name="rocket" size={24} color="#333" />
                <Text style={styles.gridOptionText}>افزایش بازدید</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.gridOption, styles.deleteOption]}
                onPress={() => handleOptionPress('delete')}
              >
                <Icon name="trash" size={24} color="#ff3b30" />
                <Text style={[styles.gridOptionText, styles.deleteText]}>حذف</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Modal>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: screenWidth,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 12,
    padding: 15,
    height: 150,
    
    position: 'relative',
  },
  selectModeItem: {
    backgroundColor: 'rgba(10, 122, 242, 0.05)',
  },
  selectedItem: {
    backgroundColor:'#ccc',
    
    padding:18
  },
  imageWrapper: {
    position: 'relative',
    minWidth: 110,
    height: '100%',
    marginRight: 10,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  ribbon: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#E53935',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderBottomRightRadius: 8,
  },
  ribbonText: {
    fontSize: 11,
    color: '#fff',
    fontFamily: 'iransans',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  distanceBadge: {
    color: 'gray',
    fontSize: 14,
    fontFamily: 'sarif',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderColor: 'gray',
  },
  workerName: {
    fontSize: 14,
    fontFamily: 'iransans',
    textAlign: 'right',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  detailText: {
    fontSize: 13,
    fontFamily: 'sarif',
    color: '#555',
  },
  footer: {
    paddingHorizontal: 10,
    paddingTop: 4,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'iransans',
    color: '#333',
  },
  statusRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'iransans',
  },
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
    paddingBottom: 30,
  },
  modalHeader: {
    
    flexDirection: 'row-reverse',
    // alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: 'iransans',
    fontWeight: 'bold',
    
    textAlign: 'right',
    
  },
  optionsGrid: {
    width: '100%',
  },
  optionsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridOption: {
    alignItems: 'center',
    width: '30%',
    padding: 10,
  },
  gridOptionText: {
    fontSize: 12,
    fontFamily: 'IRAN Sans',
    textAlign: 'center',
    marginTop: 8,
  },
  deleteOption: {},
  deleteText: {
    color: '#ff3b30',
  },
  selectionCheckbox: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'white',
  },
  selectedCheckbox: {
    backgroundColor: '#007AFF',
  },
  checkIcon: {
    color: 'white',
    fontSize: 16,
  },

  checkTitleIcon : {
    color:'gray',
    // padding:5,
    // backgroundColor:'gray'
  }
});

export default WorkerRealEstateCard;