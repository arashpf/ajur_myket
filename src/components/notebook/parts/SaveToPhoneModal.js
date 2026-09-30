import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';

const SaveToPhoneModal = ({ visible, contact, onSave, onCancel, onSkip }) => {
  if (!contact) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onCancel}
    >
      <View style={styles.savePhoneOverlay}>
        <View style={styles.savePhoneContent}>
          <View style={styles.savePhoneHeader}>
            <Ionicons name="phone-portrait-outline" size={32} color="#2196F3" />
            <Text style={styles.savePhoneTitle}>ذخیره در گوشی</Text>
          </View>

          <View style={styles.savePhoneBody}>
            <Text style={styles.savePhoneText}>
              آیا می‌خواهید "{contact.name || 'این مخاطب'}" در دفترچه تلفن گوشی نیز ذخیره شود؟
            </Text>
            
            <Text style={styles.savePhoneNote}>
              این کار باعث می‌شود مخاطب هم در اپلیکیشن و هم در دفترچه تلفن گوشی شما قابل دسترسی باشد.
            </Text>
          </View>

          <View style={styles.savePhoneActions}>
            <TouchableOpacity 
              style={[styles.savePhoneButton, styles.saveButton]}
              onPress={() => onSave(contact)}
            >
              <Ionicons name="checkmark" size={20} color="white" />
              <Text style={styles.savePhoneButtonText}>بله، ذخیره شود</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.savePhoneButton, styles.saveButton]}
              onPress={onSkip}
            >
              <Ionicons name="close" size={20} color="gray" />
              <Text style={styles.savePhoneButtonText}>خیر، فقط در اپ</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.savePhoneButton, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.savePhoneButtonText}>انصراف</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SaveToPhoneModal;