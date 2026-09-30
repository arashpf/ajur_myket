import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import styles from './styles';

const ContactFormModal = ({ 
  visible, 
  onClose, 
  contactForm, 
  onFormChange, 
  onSubmit, 
  isEditing,
  onCancelEdit 
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.addModalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.formTitle}>
              {isEditing ? "ویرایش مخاطب" : "افزودن مخاطب جدید"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeIcon}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <ScrollView>
            <TextInput
              style={styles.textInput}
              value={contactForm.name}
              onChangeText={(text) => onFormChange({...contactForm, name: text})}
              placeholder="نام"
              placeholderTextColor="#8d6e63"
            />
            <TextInput
              style={styles.textInput}
              value={contactForm.mobile}
              onChangeText={(text) => onFormChange({...contactForm, mobile: text})}
              placeholder="شماره موبایل"
              placeholderTextColor="#8d6e63"
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.textInput}
              value={contactForm.phone}
              onChangeText={(text) => onFormChange({...contactForm, phone: text})}
              placeholder="تلفن ثابت"
              placeholderTextColor="#8d6e63"
              keyboardType='phone-pad'
            />
            <TextInput
              style={[styles.textInput, { height: 80 }]}
              value={contactForm.description}
              onChangeText={(text) => onFormChange({...contactForm, description: text})}
              placeholder="توضیحات تکمیلی"
              placeholderTextColor="#8d6e63"
              multiline
            />
          </ScrollView>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            {isEditing ? (
              <>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.cancelButton]} 
                  onPress={onCancelEdit}
                >
                  <Text style={styles.actionButtonText}>انصراف</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.updateButton]} 
                  onPress={onSubmit}
                >
                  <Text style={styles.actionButtonText}>بروزرسانی</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity 
                style={[styles.actionButton, styles.addButton]} 
                onPress={onSubmit}
              >
                <Text style={styles.actionButtonText}>افزودن</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ContactFormModal;