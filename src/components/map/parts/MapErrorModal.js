import React from 'react';
import { Modal, View, Image, StyleSheet } from 'react-native';
import { Box, Text, Button } from 'native-base';

const MapErrorModal = ({ visible, onRefresh }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalContainer}>
        <Box style={styles.modalContent} bg="white" borderRadius="lg" p={6}>
          <Image
            source={require('../assets/error.png')} // Update path as needed
            style={styles.errorImage}
          />
          <Text fontSize="lg" fontFamily="iransans" textAlign="center" mt={4}>
            مشکلی در دریافت اطلاعات پیش آمده است
          </Text>
          <Text fontSize="md" fontFamily="iransans" textAlign="center" mt={2} color="gray.500">
            لطفاً دوباره امتحان کنید
          </Text>
          <Button
            onPress={onRefresh}
            style={styles.refreshButton}
            bg="#b92a31"
            _text={{ fontFamily: 'iransans', fontSize: 'md' }}
            mt={6}
          >
            تلاش مجدد
          </Button>
        </Box>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    padding: 20,
  },
  errorImage: {
    width: 240,
    height: 130,
    resizeMode: 'contain',
  },
  refreshButton: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
  },
});

export default MapErrorModal;