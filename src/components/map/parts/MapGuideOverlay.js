import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const {width, height} = Dimensions.get('window');

const MapGuideOverlay = ({visible, onComplete}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'خوش آمدید به نقشه آجر',
      description: 'در این بخش می‌توانید املاک و مستغلات را بر روی نقشه مشاهده کنید',
      icon: 'map-outline',
      position: {top: height * 0.1, left: width * 0.5},
    },
    {
      title: 'جستجوی موقعیت',
      description: 'از نوار جستجو برای یافتن محله‌ها و مناطق مختلف استفاده کنید',
      icon: 'search-outline',
      position: {top: height * 0.05, left: width * 0.1},
    },
    {
      title: 'فیلترهای پیشرفته',
      description: 'با استفاده از دکمه فیلتر می‌توانید نتایج را بر اساس معیارهای مختلف فیلتر کنید',
      icon: 'filter-outline',
      position: {top: height * 0.05, right: width * 0.1},
    },
    {
      title: 'موقعیت یابی',
      description: 'برای بازگشت به موقعیت فعلی خود از این دکمه استفاده کنید',
      icon: 'locate-outline',
      position: {bottom: height * 0.2, right: width * 0.1},
    },
    {
      title: 'مشاهده جزئیات',
      description: 'روی نشانگرها کلیک کنید تا اطلاعات کامل ملک را مشاهده کنید',
      icon: 'information-circle-outline',
      position: {bottom: height * 0.1, left: width * 0.5},
    },
  ];

  useEffect(() => {
    if (visible) {
      setCurrentStep(0);
    }
  }, [visible]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  if (!visible) return null;

  const currentStepData = steps[currentStep];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}>
      <View style={styles.container}>
        {/* Semi-transparent overlay */}
        <View style={styles.overlay} />
        
        {/* Highlighted area */}
        <View
          style={[
            styles.highlight,
            currentStepData.position,
          ]}
        >
          <View style={styles.highlightCircle}>
            <Icon
              name={currentStepData.icon}
              size={30}
              color="#b92a31"
              style={styles.highlightIcon}
            />
          </View>
        </View>

        {/* Tooltip */}
        <View style={styles.tooltipContainer}>
          <View style={styles.tooltip}>
            <Text style={styles.stepTitle}>{currentStepData.title}</Text>
            <Text style={styles.stepDescription}>
              {currentStepData.description}
            </Text>
            
            <View style={styles.stepIndicator}>
              {steps.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === currentStep ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              ))}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipButtonText}>رد کردن</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>
                  {currentStep === steps.length - 1 ? 'اتمام' : 'بعدی'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  highlight: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderColor: '#b92a31',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  highlightIcon: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  tooltipContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  tooltip: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'iransans',
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    fontFamily: 'iransans',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#b92a31',
  },
  inactiveDot: {
    backgroundColor: '#ddd',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  skipButtonText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'iransans',
  },
  nextButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    backgroundColor: '#b92a31',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'iransans',
  },
});

export default MapGuideOverlay;