import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const GuideOverlay = ({ scrollY = 0, visible = false, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Your existing steps configuration
  const steps = [
    { 
      x: width - 30, 
      y: 30, 
      radius: 40,
      message: 'فیلترهای متنوع از قیمت تا تاریخ ثبت فایل در آجر رو اینجا میتونی انتخاب کنی',
      position: 'left' 
    },
    { 
      x: width - 180, 
      y: 30, 
      radius: 40,
      message: 'سراسر ایران را میتوانید از این قسمت جستجو کنید',
      position: 'left'
    },
    { 
      x: width - 340, 
      y: 95, 
      radius: 40,
      message: 'فیلتر زمان به شما امکان میدهد که مدت زمان حضور فایل ها روی آجر را انتخاب کنید ، مثلا فقط فایل های یک هفته گذشته',
      position: 'left'
    },
    { 
      x: width - 190, 
      y: 95, 
      radius: 40,
      message: 'دسته بندی مورد نظر خود را از این قسمت انتخاب کنید ، مثلا فروش آپارتمان یا اجاره ویلایی',
      position: 'left'
    },
    { 
      x: width / 2, 
      y: height / 2, 
      radius: 60,
      message: 'روی نقشه با لمس نقاط قرمز رنگ به راحتی اطلاعات آنها را مشاهده کنید',
      position: 'top'
    },
    { 
      x: width - 25, 
      y: 95, 
      radius: 30,
      message: 'از اینجا میتوانید مدل نمایش نقشه را به حالت های مختلف تغییر دهید',
      position: 'left'
    },
    { 
      x: width - 25, 
      y: 140, 
      radius: 30,
      message: 'با لمس این دکمه به راحتی به مکان فعلی خود برگردید',
      position: 'left'
    },
    { 
      x: width - 120, 
      y: height - 30, 
      radius: 30,
      message: 'با لمس این دکمه به راحتی ملک جدیدی را در آجر ثبت کنید',
      position: 'top'
    },
    { 
      x: width - 25, 
      y: 190, 
      radius: 30,
      message: 'این دکمه اینجاست تا اگه دوباره نیاز به این راهنمایی ها داشتی ازش استفاده کنی',
      position: 'left'
    },
  ];

  // Handle visibility changes
  useEffect(() => {
    if (visible) {
      setCurrentStep(0);
      startAnimation();
    } else {
      stopAnimation();
    }
  }, [visible]);

  const startAnimation = () => {
    pulseAnim.setValue(1);
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.9,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopAnimation = () => {
    pulseAnim.stopAnimation();
  };

  const handleComplete = () => {
    setCurrentStep(-1);
    stopAnimation();
    onComplete && onComplete();
  };

  // Don't render if not visible or tour is complete
  if (!visible || currentStep === -1) {
    return null;
  }

  const step = steps[currentStep];
  const circleSize = step.radius * 2;
  const isLastStep = currentStep === steps.length - 1;

  // Calculate hint box position
  let hintBoxStyle = {};
  if (step.position === 'top') {
    hintBoxStyle = { bottom: height - (step.y - scrollY) + 40 };
  } else {
    hintBoxStyle = { top: step.y - scrollY + circleSize / 2 + 20 };
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Semi-transparent overlay with cutout */}
      <View style={styles.overlay}>
        <View style={[
          styles.cutout,
          {
            left: step.x - step.radius,
            top: step.y - scrollY - step.radius,
            width: circleSize,
            height: circleSize,
            borderRadius: step.radius,
          }
        ]} />
      </View>

      {/* Pulsing highlight circle */}
      <Animated.View
        style={[
          styles.highlight,
          {
            left: step.x - step.radius,
            top: step.y - scrollY - step.radius,
            width: circleSize,
            height: circleSize,
            borderRadius: step.radius,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />

      {/* Hint Box */}
      <View style={[styles.hintBox, hintBoxStyle]}>
        <Text style={styles.messageText}>{step.message}</Text>
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            onPress={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            style={[styles.button, currentStep === 0 && styles.disabled]}
          >
            <Text style={styles.buttonText}>قبلی</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={isLastStep ? handleComplete : () => setCurrentStep(prev => prev + 1)}
            style={[styles.button, isLastStep && styles.finishButton]}
          >
            <Text style={styles.buttonText}>
              {isLastStep ? 'پایان' : 'بعدی'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Your existing styles
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 50
  },
  cutout: {
    position: 'absolute',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    borderColor: 'rgba(255,255,255,0.9)',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50
  },
  hintBox: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 50
  },
  messageText: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
    fontFamily: 'iransans',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    alignItems: 'center',
  },
  finishButton: {
    backgroundColor: '#2ECC71',
  },
  disabled: {
    backgroundColor: '#95A5A6',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'IRANSans' : 'IRANSans-Medium',
  },
});

export default GuideOverlay;