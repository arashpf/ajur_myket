// App.js
import React from 'react';
import { StatusBar } from 'react-native';
import { NativeBaseProvider, Icon } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ReferralScreen from './screens/ReferralScreen';
import ProfileScreen from './screens/ProfileScreen';
import TutorialsScreen from './screens/TutorialsScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NativeBaseProvider>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarLabel:
              route.name === 'Referral'
                ? 'رفرال'
                : route.name === 'Profile'
                ? 'پروفایل'
                : 'آموزش‌ها',
            tabBarIcon: ({ color, size }) => {
              let name = 'home';
              if (route.name === 'Referral') name = 'home';
              if (route.name === 'Profile') name = 'person';
              if (route.name === 'Tutorials') name = 'school';
              return <Icon as={MaterialIcons} name={name} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Referral" component={ReferralScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
          <Tab.Screen name="Tutorials" component={TutorialsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
