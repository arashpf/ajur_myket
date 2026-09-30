import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';

const SingleContactModal = ({ 
  visible, 
  contact, 
  onClose, 
  onCall, 
  onEdit, 
  onDelete  // Add this prop
}) => {
  if (!contact) return null;

  const categoryColor = contact.category === 'خریداران' ? '#4CAF50' : 
                        contact.category === 'فروشندگان' ? '#2196F3' : 
                        contact.category === 'موجرین' ? '#FF9800' : 
                        contact.category === 'مستاجرین' ? '#9C27B0' : 
                        contact.category === 'نگهبانان' ? '#009688' : '#795548';

  // Add delete confirmation function
  const handleDelete = (contact) => {

    
    Alert.alert(
      'حذف مخاطب',
      `آیا از حذف مخاطب "${contact.name || 'بدون نام'}" اطمینان دارید؟`,
      [
        { text: 'انصراف', style: 'cancel' },
        { 
          text: 'حذف', 
          style: 'destructive',
          onPress: () => {
            onDelete(contact.id);
            onClose();
          }
        }
      ]
    );
  };

  const renderDetailRow = (icon, label, value) => {
    if (!value) return null;
    
    return (
      <View style={styles.detailRow}>
        <Ionicons name={icon} size={20} color="#5d4037" />
        <View style={styles.detailContent}>
          <Text style={styles.detailLabel}>{label}</Text>
          <Text style={styles.detailValue}>{value}</Text>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.singleContactOverlay}>
        <View style={styles.singleContactContent}>
          {/* Header */}
          <View style={styles.singleContactHeader}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#5d4037" />
            </TouchableOpacity>
            <Text style={styles.singleContactTitle}>جزئیات مخاطب</Text>
            {/* Delete button in header */}
            <TouchableOpacity onPress={()=>handleDelete(contact)}>
              <Ionicons name="trash-outline" size={24} color="#f44336" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.singleContactScroll}>
            {/* نام و دسته‌بندی */}
            <View style={[styles.contactCategory, { backgroundColor: categoryColor }]}>
              <Text style={styles.contactCategoryText}>{contact.category}</Text>
            </View>
            
            <View style={styles.contactNameSection}>
              <Text style={styles.contactNameLarge}>
                {contact.name || 'بدون نام'}
              </Text>
            </View>

            {/* اطلاعات تماس */}
            <View style={styles.contactDetails}>
              {renderDetailRow('call-outline', 'موبایل', contact.mobile)}
              {renderDetailRow('call-outline', 'تلفن', contact.phone)}
              
              {/* اطلاعات خاص هر دسته */}
              {contact.propertyType && renderDetailRow('business-outline', 'نوع ملک', contact.propertyType)}
              {contact.area && renderDetailRow('expand-outline', 'متراژ', `${contact.area} متر`)}
              {contact.location && renderDetailRow('location-outline', 'موقعیت', contact.location)}
              {contact.budget && renderDetailRow('cash-outline', 'بودجه', `${contact.budget} تومان`)}
              {contact.paymentMethod && renderDetailRow('card-outline', 'نوع پرداخت', contact.paymentMethod)}
              {contact.cashDiscount && renderDetailRow('pricetag-outline', 'تخفیف نقدی', `${contact.cashDiscount}%`)}
              {contact.rentPrice && renderDetailRow('home-outline', 'اجاره', `${contact.rentPrice} تومان`)}
              {contact.deposit && renderDetailRow('wallet-outline', 'ودیعه', `${contact.deposit} تومان`)}
              {contact.salary && renderDetailRow('cash-outline', 'حقوق', `${contact.salary} تومان`)}
              {contact.expertise && renderDetailRow('hammer-outline', 'تخصص', contact.expertise)}
            </View>

            {/* توضیحات */}
            {contact.description && (
              <View style={styles.descriptionSection}>
                <Text style={styles.sectionLabel}>توضیحات</Text>
                <Text style={styles.descriptionText}>{contact.description}</Text>
              </View>
            )}

            {/* اطلاعات زمانی */}
            <View style={styles.timeInfo}>
              <Text style={styles.timeText}>ایجاد شده در: {contact.date} - {contact.time}</Text>
            </View>
          </ScrollView>

          {/* دکمه‌های action */}
          <View style={styles.actionButtons}>
            {(contact.mobile || contact.phone) && (
              <TouchableOpacity 
                style={styles.callButtonLarge}
                onPress={() => {
                  if (contact.mobile) {
                    onCall(contact.mobile);
                  } else if (contact.phone) {
                    onCall(contact.phone);
                  }
                }}
              >
                <Ionicons name="call-outline" size={24} color="white" />
                <Text style={styles.callButtonText}>تماس</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => {
                onClose();
                onEdit(contact);
              }}
            >
              <Ionicons name="create-outline" size={20} color="#5d4037" />
              <Text style={styles.editButtonText}>ویرایش</Text>
            </TouchableOpacity>

            
           
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SingleContactModal;