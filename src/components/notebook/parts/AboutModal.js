import React from 'react';
import { View, Text, TouchableOpacity, Modal, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';

const AboutModal = ({ visible, onClose }) => {
  const handleReportBug = () => {
    // باز کردن ایمیل برای گزارش باگ
    Linking.openURL('mailto:bug-report@ajur.app?subject=گزارش باگ اپلیکیشن دفترچه تلفن&body=لطفاً باگ پیدا شده را به طور کامل شرح دهید:');
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.aboutOverlay}>
        <View style={styles.aboutContent}>
          {/* Header */}
          <View style={styles.aboutHeader}>
            <Text style={styles.aboutTitle}>درباره دفترچه تلفن</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#5d4037" />
            </TouchableOpacity>
          </View>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Ionicons name="book-outline" size={48} color="#4CAF50" />
            <Text style={styles.appName}>Ajur Phone Book</Text>
            <Text style={styles.versionText}>version : 0.8.beta</Text>
            <Text style={styles.copyrightText}>کلیه حقوق , طراحی ها و ایده ها برای مشاور املاک  هوشمند آجر محفوظ است    </Text>
            <Text style={styles.copyrightText}>© 2025 Ajur Real Estate Corporation</Text>
          </View>

          {/* Report Bug Section */}
          <View style={styles.reportSection}>
            <Text style={styles.reportTitle}>گزارش باگ</Text>
            <View style={styles.reportBox}>
              <Text style={styles.reportText}>
                باگ پیدا کنید ، گزارش دهید و جایزه بهترین گزارش باگ را دریافت کنید!
              </Text>
              <Text style={styles.reportSubText}>
                هر گونه مشکل، خطا یا پیشنهاد را   با ما در میان بگذارید.
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.reportButton}
              onPress={handleReportBug}
            >
              <Ionicons name="bug-outline" size={20} color="white" />
              <Text style={styles.reportButtonText}>گزارش باگ</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.aboutFooter}>
            <Text style={styles.footerText}>با ❤️ ساخته شده برای مشاوران املاک</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AboutModal;