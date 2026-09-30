import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  StyleSheet,
  Modal,
  Linking,
  Share,
  ActivityIndicator,
} from 'react-native';
import { VStack, Avatar, HStack } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const RealEstateCardForHimself = ({ realstate, circle_size }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading (you can adapt this for real network/image loading later)
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleShare = async () => { 
    try {
      const shareOptions = {
        message: `مشاور املاک: ${realstate.name} ${realstate.family}\n\n${realstate.realstate || ''}\n\nمشاهده صفحه اختصاصی ${realstate.name} ${realstate.family} در پلتفرم املاک هوشمند آجر:\nhttps://ajur.app/realestates/${realstate.id}\n`,
      };
      
      
      await Share.share(shareOptions);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const renderRealstateStars = (stars) => {
    return (
      <HStack space={1}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Icon
            key={i}
            name={i <= stars ? 'star' : 'star-outline'}
            size={16}
            color={i <= stars ? '#FFD700' : '#C0C0C0'}
          />
        ))}
      </HStack>
    );
  };

  const applyForBlueTick = () => {
    Linking.openURL('https://api.ajur.app/api/blue-tick-requirements');
  };

  return (
    <View style={styles.cardContainer}>
      {loading ? (
        <View style={styles.skeletonCard}>
          <View style={styles.skeletonAvatar} />
          <View style={styles.skeletonLine} />
          <View style={[styles.skeletonLine, { width: '60%' }]} />
        </View>
      ) : (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('RealEstate', { id: realstate.id })}
          activeOpacity={0.9}
        >
          <ImageBackground
            style={styles.cardImage}
            imageStyle={styles.cardImageStyle}
            source={{ uri: realstate.cover_url || 'https://via.placeholder.com/300' }}
          >
            <View style={styles.contentContainer}>
              <View style={styles.avatarContainer}>
                <Avatar
                  source={{ uri: realstate.profile_url }}
                  size={circle_size || 120}
                  style={styles.avatar}
                />
                {realstate.verified == 1 && (
                  <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={styles.verifiedBadgeContainer}
                  >
                    <Image
                      source={require('../assets/blue-tick.png')}
                      style={styles.verifiedBadge}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.infoContainer}>
                <Text style={styles.name}>
                  {realstate.name} {realstate.family}
                  <Text style={styles.agency}> - {realstate.realstate}</Text>
                </Text>
                {renderRealstateStars(realstate.stars)}
              </View>

              <TouchableOpacity
                onPress={handleShare}
                style={styles.shareButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="share-social" size={20} color="#4F8EF7" />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      )}

      {/* Verified Badge Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>مشاور تایید شده</Text>
            <Text style={styles.modalText}>{realstate.verified_note}</Text>
            <Text style={styles.modalNote}>
              اگر شما مشاور املاک آجر هستید، می‌توانید برای دریافت تیک آبی اقدام کنید.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.applyButton]}
                onPress={applyForBlueTick}
              >
                <Text style={styles.buttonText}>درخواست تیک آبی</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.closeButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>بستن</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: '#fff',
    padding:5
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardImage: {
    height: 200,
    justifyContent: 'center',
  },
  cardImageStyle: {
    opacity: 0.9,
  },
  contentContainer: {
    padding: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  verifiedBadgeContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    // backgroundColor: '#fafafa',
    borderRadius: 25,
    padding: 4,
  },
  verifiedBadge: {
    width: 40,
    height: 40,
    borderRadius:20
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontFamily: 'iransans',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  agency: {
    fontFamily: 'iransans',
    fontSize: 14,
    color: '#555',
    fontWeight: 'normal',
  },
  shareButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    padding: 8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: 'iransans',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  modalText: {
    fontFamily: 'iransans',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 16,
    color: '#555',
    lineHeight: 24,
  },
  modalNote: {
    fontFamily: 'iransans',
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
    color: '#666',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  applyButton: {
    backgroundColor: '#4F8EF7',
  },
  closeButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    fontFamily: 'iransans',
    color: '#fff',
    fontSize: 14,
  },
  // Skeleton styles
  skeletonCard: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  skeletonAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ddd',
    marginBottom: 16,
  },
  skeletonLine: {
    width: '80%',
    height: 14,
    backgroundColor: '#ddd',
    borderRadius: 4,
    marginBottom: 8,
  },
});

export default RealEstateCardForHimself;
