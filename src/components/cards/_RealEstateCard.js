import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image, StyleSheet, Modal, Linking } from 'react-native';
import { VStack, Avatar, Box } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const RealEstateCard = (props) => {
  const { realstate,circle_size } = props;
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const renderRealstateStars = (stars) => {
    let starIcons = [];
    for (let i = 1; i <= 5; i++) {
      starIcons.push(
        <Icon
          key={i}
          style={{
            color: i <= stars ? 'gold' : 'silver',
            fontSize: 16,
          }}
          name={i <= stars ? 'ios-star' : 'ios-star-outline'}
        />
      );
    }
    return <View style={styles.star_wrapper}>{starIcons}</View>;
  };

  const applyForBlueTick = () => {
    Linking.openURL('https://api.ajur.app/api/blue-tick-requirements'); // Change to your actual verification page
  };

  return (
    <View key={realstate.id}>
      <TouchableOpacity style={styles.ads} onPress={() => navigation.navigate('RealEstate', { id: realstate.id })}>
        <ImageBackground style={styles.adsImage} imageStyle={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
          <Box border="1" borderRadius="md" alignItems="center">
            <VStack space="3" alignItems="center">
              <View style={styles.avatarWrapper}>
                <Avatar source={{ uri: realstate.profile_url }} size={circle_size ? circle_size :  150} style={styles.realstateIcon} />
                {realstate.verified == 1 && (
                  <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Image source={require('../assets/blue-tick.png')} style={styles.verifiedBadge} />
                  </TouchableOpacity>
                )}
              </View>
              
              <View>
              <Text style={styles.name}>  {realstate.name} {realstate.family}</Text>
              </View>
              
             
            </VStack>
          </Box>
        </ImageBackground>
        <View style={styles.scrollViewTitleWrapper}>
          {/* <Text style={styles.realstateDistanceButton}>{realstate.distance} km</Text> */}
          <Text style={styles.realstateDistanceButton}>
          {renderRealstateStars(realstate.stars)}
          </Text>
          <Text style={styles.scrollViewAddTitle}> {realstate.realstate}</Text>
        </View>
      </TouchableOpacity>

      {/* Modal for Verified Badge */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>مشاور تایید شده</Text>
            <Text style={styles.modalText}>{realstate.verified_note}</Text>
            <Text style={styles.modalText2}>
              اگر شما مشاور املاک آجر هستید، می‌توانید از طریق لینک زیر برای دریافت تیک آبی خود اقدام کنید.
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.applyButton} onPress={applyForBlueTick}>
                <Text style={styles.applyButtonText}>درخواست تیک آبی</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>بستن</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  ads: {
    backgroundColor: '#f5f5f5',
    minHeight: 250,
    minWidth: 300,
    borderRadius: 10,
    margin: 10,
  },
  adsImage: {
    minHeight: 170,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  avatarWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  realstateIcon: {
    marginTop: 15,
    borderWidth: 3,
    borderColor: '#444',
    alignSelf: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -5,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  scrollViewTitleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  scrollViewAddTitle: {
    color: '#444',
    fontFamily: 'iransans',
    padding: 5,
  },
  realstateDistanceButton: {
    padding: 5,
    borderRadius: 5,
    color: '#555',
    fontSize: 14,
  },
  star_wrapper: {
    flexDirection: 'row',
    paddingTop: 5,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    fontFamily:'iransans'
  },

  modalText2: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    fontFamily:'iransans',
    backgroundColor:'gray',
    color:'white',
    padding:10,
    borderRadius:5
  },
  modalButtonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  applyButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  applyButtonText: {
    color: 'white',

    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#333',
    
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },

  

  name : {
    fontFamily:'iransans',
    fontSize:18
  }

});

export default RealEstateCard;
