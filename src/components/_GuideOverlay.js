import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const GuideOverlay = ({ scrollY = 0 }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Hardcoded steps
  const steps = [
    { x: 130, y: 160, message: 'Edit your profile from here' },
    { x: 130, y: 250, message: 'Toggle notifications here' },
    { x: 130, y: 340, message: 'View your plan here' },
  ];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.4,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // If currentStep is -1, return nothing
  if (currentStep === -1) {
    return null;
  }

  const step = steps[currentStep];

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.overlay} />

      {/* Highlight Circle */}
      <View
        style={[
          styles.highlight,
          {
            left: step.x - 60,
            top: step.y - scrollY - 60, // Adjust for scroll position
            width: 120,
            height: 120,
            borderRadius: 60,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.pulse,
            {
              transform: [{ scale: pulseAnim }],
              width: 120,
              height: 120,
              borderRadius: 60,
            },
          ]}
        />
      </View>

      {/* Hint Box */}
      <View
        style={[
          styles.bottomBox,
          {
            top: step.y - scrollY + 80, // Position hint below circle
            left: 20,
            right: 20,
          },
        ]}
      >
        <Text style={styles.messageText}>{step.message}</Text>
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            onPress={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            style={[styles.button, currentStep === 0 && styles.disabled]}
          >
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>

          {currentStep < steps.length - 1 ? (
            <TouchableOpacity
              onPress={() => setCurrentStep((prev) => prev + 1)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setCurrentStep(-1)} style={styles.button}>
              <Text style={styles.buttonText}>Finish</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  highlight: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    position: 'absolute',
    borderColor: 'white',
    borderWidth: 2,
    opacity: 0.9,
  },
  bottomBox: {
    position: 'absolute',
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 12,
  },
  messageText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#444',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
  },
  disabled: {
    backgroundColor: '#555',
    opacity: 0.5,
  },
});

export default GuideOverlay;
