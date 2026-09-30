import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  UIManager,
  LayoutAnimation,
  BackHandler,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens
import Search from '../Search';
import NewWorker from '../worker/NewWorker';
import AiHub from '../ai/AiHub';
import Base from '../Base';
import ControlPanel from '../ControlPanel';
import Rlogin from '../realstate/auth/login';
import Liked from '../sidebar/Liked';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get('window');

// ============ FIX: Use memo to prevent unnecessary re-renders ============
const createScreenWithPadding = (Component) => {
  const WrappedComponent = memo((props) => (
    <View style={styles.screenContainer}>
      <Component {...props} />
    </View>
  ));
  WrappedComponent.displayName = `Wrapped(${Component.displayName || Component.name || 'Component'})`;
  return WrappedComponent;
};

const GlassTabBar = ({ state, descriptors, navigation }) => {
  const [tabWidth, setTabWidth] = useState(width / state.routes.length);
  const tabLayouts = useRef({}).current;
  const indicatorPosition = useRef(new Animated.Value(0)).current;

  // Get screen titles
  const getTabTitle = (routeName) => {
    const titles = {
      'املاک من': 'املاک من',
      'جستجو': 'جستجو',
      'دستیار هوشمند': 'ابزار',
      'جدید': 'جدید',
      'پسندها': 'پسندها'
    };
    return titles[routeName] || routeName;
  };

  // Animate the indicator when the active tab changes
  useEffect(() => {
    const currentRoute = state.routes[state.index];
    if (tabLayouts[currentRoute.key]) {
      const { x, width } = tabLayouts[currentRoute.key];
      const toValue = x + (width / 2) - 25;
      
      Animated.spring(indicatorPosition, {
        toValue,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    }
  }, [state.index]);

  const handleTabPress = (index, route) => {
    const isFocused = state.index === index;
    if (!isFocused) {
      navigation.navigate(route.name);
    }
  };

  const handleTabLayout = (event, routeKey) => {
    const { x, width } = event.nativeEvent.layout;
    tabLayouts[routeKey] = { x, width };
    
    if (state.routes[state.index].key === routeKey) {
      const toValue = x + (width / 2) - 25;
      indicatorPosition.setValue(toValue);
    }
  };

  return (
    <View style={styles.footerContainer}>
      <View style={styles.outerMetalShell}>
        <View style={styles.glassLayer} />
        
        <Animated.View 
          style={[
            styles.activeIndicator,
            { transform: [{ translateX: indicatorPosition }] }
          ]}
        >
          <View style={styles.indicatorGlow} />
        </Animated.View>

        <View style={styles.tabsContainer}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;

            let iconName;
            if (route.name === 'املاک من') {
              iconName = isFocused ? 'ios-person' : 'ios-person-outline';
            } else if (route.name === 'جستجو') {
              iconName = isFocused ? 'ios-list' : 'ios-list-outline';
            } else if (route.name === 'دستیار هوشمند') {
              iconName = isFocused ? 'nuclear' : 'nuclear-outline';
            } else if (route.name === 'جدید') {
              iconName = isFocused ? 'add' : 'add-outline';
            } else if (route.name === 'پسندها') {
              iconName = isFocused ? 'ios-heart' : 'ios-heart-outline';
            }

            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => handleTabPress(index, route)}
                onLayout={(event) => handleTabLayout(event, route.key)}
                style={[styles.tabButton, { width: tabWidth }]}
                activeOpacity={0.8}
              >
                <View style={styles.tabContent}>
                  <View style={[
                    styles.iconContainer,
                    isFocused && styles.activeIconContainer
                  ]}>
                    <Ionicons
                      name={iconName}
                      size={26}
                      color={isFocused ? '#fff' : '#424244ff'}
                    />
                  </View>
                  <Text style={[
                    styles.tabTitle,
                    isFocused && styles.activeTabTitle
                  ]}>
                    {getTabTitle(route.name)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

// ============ FIX: Memoize the wrapped components ============
const WrappedSearch = React.memo(createScreenWithPadding(Search));
const WrappedLiked = React.memo(createScreenWithPadding(Liked));
const WrappedAiHub = React.memo(createScreenWithPadding(AiHub));
const WrappedControlPanel = React.memo(createScreenWithPadding(ControlPanel));

const MainDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute] = useState('جستجو');

  useEffect(() => {
    const checkAuthToken = async () => {
      try {
        const token = await AsyncStorage.getItem('id_token');
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error('Error checking token:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthToken();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingScreen}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <Tab.Navigator
        tabBar={(props) => <GlassTabBar {...props} />}
        screenOptions={{ 
          headerShown: false,
          // ============ FIX: Prevent unmounting ============
          unmountOnBlur: false,
        }}
        initialRouteName={initialRoute}
        backBehavior="order"
      >
        <Tab.Screen 
          name="جستجو" 
          component={WrappedSearch}
        />
        <Tab.Screen 
          name="پسندها" 
          component={WrappedLiked}
        />
        <Tab.Screen
          name="دستیار هوشمند"
          component={WrappedAiHub}
        />
        <Tab.Screen 
          name="املاک من" 
          component={WrappedControlPanel}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  screenContainer: {
    flex: 1,
    paddingBottom: 80,
  },
  loadingScreen: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 2,
    left: 10,
    right: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerMetalShell: {
    width: '100%',
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    backgroundColor: 'rgba(254, 254, 254, 0.7)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
  },
  glassLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 35,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeIndicator: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: 'rgba(185, 42, 49, 0.15)',
    top: -2,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorGlow: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: 'rgba(185, 42, 49, 0.7)',
    shadowColor: 'rgba(185, 42, 49, 0.8)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
    zIndex: 5,
  },
  tabButton: { 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100%',
    zIndex: 3,
  },
  tabContent: { 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    marginBottom: 4,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(185, 42, 49, 0.7)',
    borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: 'rgba(185, 42, 49, 0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
  tabTitle: {
    fontSize: 10,
    color: '#424244ff',
    marginTop: 2,
    textAlign: 'center',
    includeFontPadding: false,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  activeTabTitle: {
    color: '#b92a31',
    fontWeight: 'bold',
  },
});

export default MainDashboard;