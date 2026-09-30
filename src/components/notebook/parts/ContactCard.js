import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';

const ContactCard = ({ 
  note, 
  categories, 
  onEdit, 
  onSaveToContacts, 
  onDelete, 
  onCall,
  onViewDetails // اضافه کردن prop جدید برای مشاهده جزئیات
}) => {
  const categoryColor = categories.find(c => c.id === note.category)?.color || '#795548';
  
  return (
    <View style={styles.noteCard}>
      {/* <View style={styles.noteHeader}>
        <View style={[styles.noteLabel, { backgroundColor: categoryColor }]}>
          <Text style={styles.noteLabelText}>{note.category}</Text>
        </View>
        <View style={styles.noteActions}>
          <TouchableOpacity onPress={() => onViewDetails(note)}>
            <Ionicons name="eye-outline" size={18} color="#2196F3" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onEdit(note)}>
            <Ionicons name="create-outline" size={18} color="#5d4037" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSaveToContacts(note)}>
            <Ionicons name="download-outline" size={18} color="#2196F3" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(note.id)}>
            <Ionicons name="trash-outline" size={18} color="#d32f2f" />
          </TouchableOpacity>
        </View>
      </View>
       */}
      <View style={styles.contactCardContent}>

         <TouchableOpacity 
          style={styles.callButton}
          onPress={() => {
            if (note.mobile) {
              onCall(note.mobile);
            } else if (note.phone) {
              onCall(note.phone);
            }
          }}
          disabled={!note.mobile && !note.phone}
        >
          <Ionicons name="call-outline" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.contactNameSection}
          onPress={() => onViewDetails(note)}
        >
          {note.name ? (
            <Text style={styles.contactName} numberOfLines={1}>
              {note.name}
            </Text>
          ) : (
            <Text style={styles.contactNamePlaceholder}>بدون نام</Text>
          )}
        </TouchableOpacity>
        
       
      </View>
      
      {/* <View style={styles.contactFooter}>
        {(note.mobile || note.phone) && (
          <View style={styles.phoneInfo}>
            {note.mobile && (
              <Text style={styles.phoneText} numberOfLines={1}>
                📱 {note.mobile}
              </Text>
            )}
            {note.phone && (
              <Text style={styles.phoneText} numberOfLines={1}>
                📞 {note.phone}
              </Text>
            )}
          </View>
        )}
        
        <View style={styles.noteFooter}>
          <Text style={styles.noteDate}>{note.date}</Text>
        </View>
      </View> */}
    </View>
  );
};

export default ContactCard;