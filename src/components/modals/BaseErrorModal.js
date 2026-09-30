import React from 'react';
import { Modal, View, Image, StyleSheet } from 'react-native';
import { Box, Text, Button, VStack } from 'native-base';

const BaseErrorModal = ({ visible, onRefresh, onGoBack }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalContainer}>
        <Box style={styles.modalContent} bg="white" borderRadius="lg" p={6}>
          <Image
            source={require('./assets/error.png')} // Update path as needed
            style={styles.errorImage}
          />
          <Text fontSize="lg" fontFamily="iransans" textAlign="center" mt={4}>
            مشکلی در دریافت اطلاعات  پیش  آمده است
          </Text>
          <Text fontSize="md" fontFamily="iransans" textAlign="center" mt={2} color="gray.500">
            لطفاً دوباره امتحان کنید
          </Text>
          
          <VStack space={3} mt={6} width="100%">
            <Button
              onPress={onRefresh}
              bg="#b92a31"
              _text={{ fontFamily: 'iransans', fontSize: 'md' }}
              style={styles.refreshButton}
            >
              تلاش مجدد
            </Button>
            <Button
              onPress={onGoBack}
              bg="gray.300"
              _text={{ fontFamily: 'iransans', fontSize: 'md', color: '#000' }}
              style={styles.refreshButton}
            >
              بازگشت به صفحه قبل
            </Button>
          </VStack>
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
    backgroundColor: 'rgb(255, 255, 255)',
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

export default BaseErrorModal;
