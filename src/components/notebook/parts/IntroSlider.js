import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

const { width, height } = Dimensions.get('window');

const IntroSlider = ({ visible, onClose, slides }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const animationRefs = slides.map(() => useRef(null));

  useEffect(() => {
    if (visible) {
      setCurrentSlideIndex(0);
      // Start first animation after modal is visible
      setTimeout(() => {
        animationRefs[0]?.current?.play();
      }, 100);
    }
  }, [visible]);

  // Handle slide changes
  useEffect(() => {
    if (visible) {
      // Play animation when slide changes
      animationRefs[currentSlideIndex]?.current?.play();
    }
  }, [currentSlideIndex, visible]);

  const handleContinueIntro = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      closeIntroSlider();
    }
  };

  const handlePreviousIntro = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleSkipIntro = () => {
    closeIntroSlider();
  };

  const closeIntroSlider = async () => {
    try {
      await AsyncStorage.setItem('hasSeenFileBankIntro', 'true');
    } catch (error) {
      console.error('Error saving intro status:', error);
    }
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal 
      transparent 
      visible={visible}
      animationType="none"
      onRequestClose={closeIntroSlider}
      hardwareAccelerated={true}
      statusBarTranslucent={true}
    >
      <View style={[styles.introContainer, { width, height }]}>
        <View style={styles.slideContainer}>
          <View style={styles.lottieContainer}>
            <LottieView
              ref={animationRefs[currentSlideIndex]}
              source={slides[currentSlideIndex].lottieSource}
              autoPlay={false}
              loop={true}
              style={styles.lottieAnimation}
              resizeMode="contain"
              speed={1}
              hardwareAccelerationAndroid={true}
              onAnimationFinish={() => {
                // Restart animation when it finishes
                animationRefs[currentSlideIndex]?.current?.play();
              }}
            />
          </View>
          
          <View style={[styles.textContainer, { backgroundColor: slides[currentSlideIndex].color }]}>
            <Text style={styles.slideTitle}>{slides[currentSlideIndex].title}</Text>
            <Text style={styles.slideDescription}>{slides[currentSlideIndex].description}</Text>
            
            <View style={styles.pagination}>
              {slides.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === currentSlideIndex && styles.paginationDotActive
                  ]}
                />
              ))}
            </View>
            
            <View style={styles.navigationButtons}>
              {currentSlideIndex === 0 && (
                <TouchableOpacity onPress={handleSkipIntro} style={styles.skipButton}>
                  <Text style={styles.skipButtonText}>رد کردن</Text>
                </TouchableOpacity>
              )}
              
              {currentSlideIndex > 0 && (
                <TouchableOpacity onPress={handlePreviousIntro} style={styles.navButton}>
                  <Text style={styles.navButtonText}>قبلی</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                onPress={handleContinueIntro} 
                style={[styles.navButton, styles.primaryButton]}
              >
                <Text style={styles.navButtonText}>
                  {currentSlideIndex === slides.length - 1 ? 'شروع' : 'بعدی'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default IntroSlider;