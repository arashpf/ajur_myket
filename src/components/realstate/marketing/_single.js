import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Animated, 
  StyleSheet, 
  Dimensions, 
  Alert,
  Platform 
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import ReferralScreen from './screens/ReferralScreen';
import TutorialsScreen from './screens/TutorialsScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get('window');

// Create wrapped components with bottom padding
const createScreenWithPadding = (Component) => {
  return (props) => (
    <View style={styles.screenContainer}>
      <Component {...props} />
    </View>
  );
};

// Screen components (commented out as you're using imported ones)
// function ReferralScreen() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e3f2fd' }}>
//       <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Referral Screen</Text>
//     </View>
//   );
// }

// function ProfileScreen() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
//       <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Profile Screen</Text>
//     </View>
//   );
// }

// function TutorialsScreen() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff3e0' }}>
//       <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Tutorials Screen</Text>
//     </View>
//   );
// }

// Home Button Component
const HomeButton = () => {
  const navigation = useNavigation();
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    // Animation for press effect
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();

    // Navigate to main section (simulated with an alert for demonstration)
    Alert.alert(
      "بازگشت به خانه",
      "آیا قصد بازگشت به پنل اصلی آجر را دارید ؟ ",
      [
        {
          text: "نه صبر کن",
          style: "cancel"
        },
        { 
          text: "بله", 
          onPress: () => {
            // In a real app, you would navigate to your home screen here
            // navigation.navigate('Home');
            console.log("Navigating to home screen");
            navigation.navigate('Base')
          }
        }
      ]
    );
  };

  return (
    <View style={styles.homeButtonContainer}>
      {/* Home bubble */}
      <Animated.View 
        style={[
          styles.homeBubble,
          {
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {/* Water wave effect at the top */}
        <View style={styles.homeWaterWave} />
        
        {/* Bubbles inside the home bubble */}
        <View style={styles.homeFloatingBubbles}>
          <View style={[styles.homeFloatingBubble, { top: 8, left: 15, width: 4, height: 4 }]} />
          <View style={[styles.homeFloatingBubble, { top: 12, left: 25, width: 3, height: 3 }]} />
          <View style={[styles.homeFloatingBubble, { top: 6, left: 35, width: 5, height: 5 }]} />
        </View>
        
        <TouchableOpacity
          onPress={handlePress}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          style={styles.homeButton}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="home"
            size={28}
            color={isPressed ? '#ffffff' : '#4a6572'}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

// Custom Water Bubble Tab Bar
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const [tabWidth, setTabWidth] = useState(0);
  const [highlightPosition, setHighlightPosition] = useState({ top: 12, left: 12 });
  const bubblePosition = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const highlightOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Calculate the width of each tab
    if (tabWidth === 0) {
      const mainTabBarWidth = width - 80; // Subtract home button width and margins
      setTabWidth(mainTabBarWidth / state.routes.length);
    }

    // Generate random position for the highlight
    const randomTop = Math.random() * 30 + 5;  // Between 5 and 35
    const randomLeft = Math.random() * 30 + 5; // Between 5 and 35
    setHighlightPosition({ top: randomTop, left: randomLeft });

    // Animate highlight appearance
    Animated.sequence([
      Animated.timing(highlightOpacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(bubblePosition, {
          toValue: state.index * tabWidth,
          useNativeDriver: true,
          friction: 10,
          tension: 50,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
          friction: 10,
          tension: 50,
        }),
        Animated.timing(highlightOpacity, {
          toValue: 0.4,
          duration: 300,
          useNativeDriver: true,
        })
      ])
    ]).start();
  }, [state.index, tabWidth]);

  return (
    <View style={styles.footerContainer}>
      {/* Home button bubble on the left */}
      <HomeButton />
      
      {/* Main tab bar */}
      <View style={styles.outerContainer}>
        {/* Large outer bubble containing the entire tab bar */}
        <View style={styles.outerBubble}>
          <View style={styles.outerBubbleInner} />
          
          {/* Water wave effect at the top of the tab bar */}
          <View style={styles.waterWave} />
          
          {/* Inner moving bubble that highlights selected tab */}
          <Animated.View 
            style={[
              styles.innerBubble,
              {
                width: tabWidth - 20,
                transform: [
                  { translateX: bubblePosition },
                  { scale: scaleValue }
                ]
              }
            ]}
          >
            <Animated.View 
              style={[
                styles.innerBubbleHighlight,
                {
                  top: highlightPosition.top,
                  left: highlightPosition.left,
                  opacity: highlightOpacity
                }
              ]} 
            />
          </Animated.View>
          
          {/* Tab buttons - properly centered */}
          <View style={styles.tabsContainer}>
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                  ? options.title
                  : route.name;

              const isFocused = state.index === index;

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              const onLongPress = () => {
                navigation.emit({
                  type: 'tabLongPress',
                  target: route.key,
                });
              };

              return (
                <TouchableOpacity
                  key={route.key}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={[styles.tabButton, { width: tabWidth }]}
                >
                  <View style={styles.tabContent}>
                    <MaterialIcons
                      name={
                        route.name === 'Referral' ? 'home' : 
                        route.name === 'Profile' ? 'person' : 'school'
                      }
                      size={24}
                      color={isFocused ? '#ffffff' : '#4a6572'}
                    />
                    <Text style={[styles.tabLabel, { color: isFocused ? '#ffffff' : '#4a6572' }]}>
                      {label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          
          {/* Water drops - positioned relative to the tab bar */}
          <View style={styles.waterDropsContainer}>
            {[1, 2, 3, 4, 5].map((item) => (
              <View 
                key={item} 
                style={[
                  styles.waterDrop,
                  {
                    left: `${item * 15}%`,
                  }
                ]} 
              />
            ))}
          </View>
          
          {/* Bubbles inside the outer bubble - positioned correctly */}
          <View style={styles.floatingBubbles}>
            <View style={[styles.floatingBubble, { top: 15, left: '10%', width: 6, height: 6 }]} />
          </View>
        </View>
      </View>
    </View>
  );
};

// Main Component
export default function MarketingSingleScreen() {
  return (
    <View style={styles.mainContainer}>
      <Tab.Navigator
        tabBar={props => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen 
          name="Referral" 
          component={createScreenWithPadding(ReferralScreen)}
          options={{
            tabBarLabel: 'رفرال',
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={createScreenWithPadding(ProfileScreen)}
          options={{
            tabBarLabel: 'پروفایل',
          }}
        />
        <Tab.Screen 
          name="Tutorials" 
          component={createScreenWithPadding(TutorialsScreen)}
          options={{
            tabBarLabel: 'آموزش‌ها',
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  screenContainer: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 85 : 80, // Enough space for tab bar
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  homeButtonContainer: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeBubble: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  homeWaterWave: {
    // position: 'absolute',
    // top: -10,
    // left: 0,
    // right: 0,
    // height: 20,
    // backgroundColor: 'rgba(135, 206, 250, 0.3)',
    // borderBottomLeftRadius: 30,
    // borderBottomRightRadius: 30,
  },
  homeButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeFloatingBubbles: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  homeFloatingBubble: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  outerContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 35,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.5)',
  },
  outerBubble: {
    width: '100%',
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',

    // border & shadow for glass effect
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  zoomedBackground: {
    ...StyleSheet.absoluteFillObject,  // fill bubble
    transform: [{ scale: 1.2 }],       // 👈 zooms the background
    opacity: 0.8,                      // slightly faded for glassy look
  },
  outerBubbleInner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(200, 220, 240, 0.3)',
    borderRadius: 35,
  },
  tabsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 3,
  },
  innerBubble: {
    position: 'absolute',
    height: 60,
    backgroundColor: 'rgba(185, 42, 49, 0.8)',
    // backgroundColor: 'rgba(0, 150, 136, 0.7)',
    borderRadius: 30,
    bottom: 5,
    left: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    overflow: 'hidden',
    zIndex: 2,
  },
  innerBubbleHighlight: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  waterWave: {
    // position: 'absolute',
    // top: -15,
    // left: 0,
    // right: 0,
    // height: 30,
    // backgroundColor: 'rgba(135, 206, 250, 0.3)',
    // borderBottomLeftRadius: 35,
    // borderBottomRightRadius: 35,
  },
  tabButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    zIndex: 4,
  },
  tabContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  waterDropsContainer: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    height: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  waterDrop: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(135, 206, 250, 0.6)',
  },
  floatingBubbles: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingBubble: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});