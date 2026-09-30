import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions
} from 'react-native';
import Swiper from 'react-native-swiper';

const { width, height } = Dimensions.get('window');

const ImageSliderModal = ({ visible, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef(null);

  const images = [
    {
      id: '1',
      uri: 'https://ajur.app/img/tehran.png',
      desc: 'شما میتوانید در سراسر کشور عزیزمان ملک ها را ببینید یا ملکی برای فروش و اجاره را به نقشه پین کنید',
    },
    {
      id: '2',
      uri: 'https://ajur.app/logo/ajour-meta-image.jpg',
      desc: 'فایل شما با گذشت یک ماه ، دو ماه و یا حتی یک سال در آجر همچنان موجود خواهد بود، و تا لحظه فروش به مشتریان نمایش داده خواهد شد',
    },
  ];

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      swiperRef.current?.scrollBy(1);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.hintModalContainer}>
        <View style={styles.hintModalContent}>
          <Text style={styles.hintTitle}>به نقشه آجر خوش آمدید</Text>

          <Swiper
            ref={swiperRef}
            style={styles.swiper}
            showsPagination
            dotStyle={styles.hintdot}
            activeDotStyle={styles.hintActiveDot}
            loop={false}
            onIndexChanged={setCurrentIndex}
          >
            {images.map((item) => (
              <View key={item.id} style={styles.slide}>
                <Image
                  source={{ uri: item.uri }}
                  style={styles.hintImage}
                  resizeMode="contain"
                />
                <Text style={styles.hintDesc}>{item.desc}</Text>
              </View>
            ))}
          </Swiper>

          {currentIndex < images.length - 1 ? (
            <TouchableOpacity
              onPress={handleNext}
              style={styles.hintNextButton}
            >
              <Text style={styles.buttonText}>مشاهده بعدی</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={onClose} style={styles.hintButton}>
              <Text style={styles.buttonText}>متوجه شدم</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  hintModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  hintModalContent: {
    width: width * 0.85,
    height: height * 0.5,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  hintTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
    color: '#333',
    fontFamily:'iransans' 
  },
  swiper: {
    height: height * 0.4,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintImage: {
    width: width * 0.7,
    height: height * 0.14,
    borderRadius: 8,
  },
  hintDesc: {
    textAlign: 'center',
    paddingVertical: 15,
    fontSize: 14,
    color: '#555',
    lineHeight: 24,
    fontFamily:'iransans'
  },
  hintdot: {
    backgroundColor: '#bbb',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  hintActiveDot: {
    backgroundColor: '#ff6600',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  hintButton: {
    backgroundColor: '#ff6600',
    padding: 12,
    borderRadius: 5,
    width: width * 0.6,
    alignItems: 'center',
  },
  hintNextButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 5,
    width: width * 0.6,
    alignItems: 'center',
    fontFamily:'iransans'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily:'yekan'
  },
});

export default ImageSliderModal;