import React, { useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CitySelector = ({ 
  selectedCity, 
  onCityChange, 
  cities = ['تهران', 'رباط کریم', 'کرج', 'اصفهان', 'مشهد'],
  buttonStyle,
  textStyle,
  modalStyle
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* City Button */}
      <Pressable 
        style={[styles.cityButton, buttonStyle]}
        onPress={() => setShowModal(true)}>
        <View style={styles.cityButtonContent}>
          <Icon name="location-outline" size={16} color="#444" style={styles.cityIcon} />
          <Text style={[styles.cityText, textStyle]} numberOfLines={1}>
            {selectedCity}
          </Text>
        </View>
      </Pressable>

      {/* City Selection Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={[styles.modalOverlay, modalStyle?.overlay]}>
          <View style={[styles.modalContainer, modalStyle?.container]}>
            <View style={styles.modalHeader}>
              <Pressable 
                style={styles.closeButton}
                onPress={() => setShowModal(false)}>
                <Icon name="close" size={24} color="#334155" />
              </Pressable>
              <Text style={styles.modalTitle}>انتخاب شهر</Text>
            </View>
            
            <View style={styles.cityList}>
              {cities.map(city => (
                <Pressable
                  key={city}
                  style={styles.cityItem}
                  onPress={() => {
                    onCityChange(city);
                    setShowModal(false);
                  }}>
                  <Text style={styles.cityItemText}>{city}</Text>
                  {selectedCity === city && (
                    <Icon name="checkmark" size={20} color="#3b82f6" />
                  )}
                </Pressable>
              ))}
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
    maxHeight: '60%',
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
  cityList: {
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
  },
});

export default CitySelector;