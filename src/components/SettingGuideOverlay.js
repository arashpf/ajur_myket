// import React, { useRef, useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Animated,
//   Dimensions,
// } from 'react-native';

// const { width, height } = Dimensions.get('window');

// const GuideOverlay = ({ scrollY = 0 }) => {
//   const [currentStep, setCurrentStep] = useState(0);
//   const pulseAnim = useRef(new Animated.Value(1)).current;

//   // Hardcoded steps
//   const steps = [
//     { x: width-10, y: 10, message: 'از این قسمت اطلاعات خود را کامل کنید' },
//     { x: width-340, y: 110, message: 'عکس پروفایل را از این قسمت بارگذاری کنید' },
//     { x: 150, y: 400, message: 'عکس یا لوگوی املاک خود را از این قسمت میتوانید انتخاب کنید' },
//   ];

//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1.4,
//           duration: 800,
//           useNativeDriver: true,
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 800,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   }, []);

//   // If currentStep is -1, return nothing
//   if (currentStep === -1) {
//     return null;
//   }

//   const step = steps[currentStep];

//   return (
//     <View style={StyleSheet.absoluteFill}>
//       <View style={styles.overlay} />

//       {/* Highlight Circle */}
//       <View
//         style={[
//           styles.highlight,
//           {
//             left: step.x - 60,
//             top: step.y - scrollY - 60, // Adjust for scroll position
//             width: 120,
//             height: 120,
//             borderRadius: 60,
//           },
//         ]}
//       >
//         <Animated.View
//           style={[
//             styles.pulse,
//             {
//               transform: [{ scale: pulseAnim }],
//               width: 120,
//               height: 120,
//               borderRadius: 60,
//             },
//           ]}
//         />
//       </View>

//       {/* Hint Box */}
//       <View
//         style={[
//           styles.bottomBox,
//           {
//             top: step.y - scrollY + 80, // Position hint below circle
//             left: 20,
//             right: 20,
//           },
//         ]}
//       >
//         <Text style={styles.messageText}>{step.message}</Text>
//         <View style={styles.buttonsRow}>
//           <TouchableOpacity
//             onPress={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
//             disabled={currentStep === 0}
//             style={[styles.button, currentStep === 0 && styles.disabled]}
//           >
//             <Text style={styles.buttonText}>قبلی</Text>
//           </TouchableOpacity>

//           {currentStep < steps.length - 1 ? (
//             <TouchableOpacity
//               onPress={() => setCurrentStep((prev) => prev + 1)}
//               style={styles.button}
//             >
//               <Text style={styles.buttonText}>بعدی</Text>
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity onPress={() => setCurrentStep(-1)} style={styles.button}>
//               <Text style={styles.buttonText}>پایان</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.75)',
//   },
//   highlight: {
//     position: 'absolute',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   pulse: {
//     position: 'absolute',
//     borderColor: 'white',
//     borderWidth: 2,
//     opacity: 0.9,
//   },
//   bottomBox: {
//     position: 'absolute',
//     backgroundColor: '#222',
//     padding: 16,
//     borderRadius: 12,
//   },
//   messageText: {
//     color: 'white',
//     fontSize: 16,
//     textAlign: 'center',
//     marginBottom: 12,
//   },
//   buttonsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//   },
//   button: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     backgroundColor: '#444',
//     borderRadius: 8,
//   },
//   buttonText: {
//     color: 'white',
//   },
//   disabled: {
//     backgroundColor: '#555',
//     opacity: 0.5,
//   },
// });

// export default GuideOverlay;

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

//   const steps = [
// //     { x: width-10, y: 10, message: 'از این قسمت اطلاعات خود را کامل کنید' },
// //     { x: width-340, y: 110, message: 'عکس پروفایل را از این قسمت بارگذاری کنید' },
// //     { x: 150, y: 400, message: 'عکس یا لوگوی املاک خود را از این قسمت میتوانید انتخاب کنید' },
// //   ];
  const steps = [
    { 
      x: width - 30, 
      y: 20, 
      radius: 30,
      message: 'از این قسمت اطلاعات خود را کامل کنید' ,
      position: 'left' 
    },
    { 
      x: width-310, 
      y: 130, 
      radius: 40,
     message: 'عکس پروفایل را از این قسمت بارگذاری کنید',
      position: 'left'
    },

     { 
      x: width/2.4, 
      y: height/3, 
      radius: 40,
      message: 'با لمس این دکمه به راحتی میتونی هرجا که دلت میخواد صفحه اختصاصی املاکتو ، به همراه تمامی فایل های فعالت ، عکست و شماره تماست رو با دیگران به اشتراک بزاری' ,
      position: 'left'
    },

    { 
      x: width/2, 
      y: height/1.8, 
      radius: 40,
      message: 'عکس یا لوگوی املاک خود را از این قسمت میتوانید انتخاب کنید',
      position: 'left'
    },
    { 
      x: width/2, 
      y: height/1.1,  
      radius: 30,
      message: 'این دکمه اینجاست تا اگه دوباره نیاز به این راهنمایی ها داشتی ازش استفاده کنی',
      position: 'top'
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
    backgroundColor: 'rgba(0,0,0,0.5)',
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