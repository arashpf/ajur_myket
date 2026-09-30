// import React from 'react';
// import { View, Text, Button } from 'react-native';


// import { VESDK } from 'react-native-videoeditorsdk';

// try {
//   VESDK.setLogLevel('DEBUG');
//   VESDK.unlockWithLicense(require('./android/app/src/main/assets/vesdk_license'));
//   console.log('VESDK initialized successfully');
// } catch (error) {
//   console.error('Failed to unlock VESDK:', error);
// }

// const App = () => {
//   const openVideoEditor = () => {
//     // Test the VSDK editor
//     VESDK.openEditor( require('./assets/.mp4') )
//       .then((result) => {
//         console.log('Edited video:', result);
//       })
//       .catch((error) => {
//         console.error('Video editor error:', error);
//       });
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>VSDK Test</Text>
//       <Button title="Open Video Editor" onPress={openVideoEditor} />
//     </View>
//   );
// };

// export default App;



import React, {useState, useEffect} from 'react';
import {View, Text, Alert,I18nManager,LogBox,StatusBar,Linking} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {NativeBaseProvider} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import messaging from '@react-native-firebase/messaging';



// if (__DEV__) {
//   LogBox.ignoreAllLogs(); // Ignores all logs and warnings in debug builds
// }

import axios from 'axios';

import Entro from './src/components/Entro';
import Base from './src/components/Base';
import ControlPanel from './src/components/ControlPanel';
import Landing from './src/components/Landing';
import MarkerTypes from './src/components/MarkerTypes';
import Nearests from './src/components/Nearests';
import WorkerSingle from './src/components/worker/WorkerSingle';
import Rlogin from './src/components/realstate/auth/login';
import Rvalidation from './src/components/realstate/auth/validation';
import RealEstate from './src/components/realstate/front/single';


import Report from './src/components/worker/report';


import SingleEdit from './src/components/worker/edit/Single';
import SingleChart from './src/components/worker/charts/index';

// realestate tabs components

import Dashboard from './src/components/realstate/dashboard';
import Setting from './src/components/realstate/setting';
import EditRealstate from './src/components/realstate/edit';
// end of realstate tabs components


import EditWorker from './src/components/worker/edit/EditWorker';

import NewWorker from './src/components/worker/NewWorker';
import NewWorker2 from './src/components/worker/NewWorker2';
import NewWorker3 from './src/components/worker/NewWorker3';

import Test from './src/components/sidebar/Test';
import History from './src/components/sidebar/History';
import Liked from './src/components/sidebar/Liked';
import Rolls from './src/components/sidebar/Rolls';
import About from './src/components/sidebar/About';
import Contact from './src/components/sidebar/Contact';
import Privacy from './src/components/sidebar/Privacy';

// Marketing section

import RMarketing from './src/components/realstate/marketing/single';
import Mainmap from './src/components/Mainmap';



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainDashborad() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthToken = async () => {
      try {
        const token = await AsyncStorage.getItem('id_token');
        setIsAuthenticated(token); // Set to true if token exists
      } catch (error) {
        console.error('Error checking token:', error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    checkAuthToken();
  }, []);

  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
          headerShown: false,
         tabBarIcon: ({ focused, color, size }) => {
           let iconName;

           if (route.name === 'املاک من') {
             iconName = focused
               ? 'ios-person'
               : 'ios-person-outline';
           } else if (route.name === 'جستجو') {
             iconName = focused ? 'ios-search' : 'ios-search-outline';
           }  else if (route.name === 'ملک جدید') {
             iconName = focused ? 'add-circle' : 'add-circle-outline';
           }else if (route.name === 'خانه') {
            iconName = focused ? 'location' : 'location-outline';
          }
           else if (route.name === 'پسند ها') {
            iconName = focused ? 'ios-heart' : 'ios-heart-outline';
          }

         

           // You can return any component that you like here!
           return <Ionicons name={iconName} size={size} color={color} />;
         },
         tabBarActiveTintColor: 'black',
         tabBarInactiveTintColor: 'gray',

       })}
      >

      <Tab.Screen name="خانه" component={MarkerTypes} />
      
      <Tab.Screen name="پسند ها" component={Liked} />
      <Tab.Screen name="جستجو" component={Base} />
      
      
      {/* <Tab.Screen name="ملک جدید" component={NewWorker} /> */}

      <Tab.Screen name="ملک جدید" component={ isAuthenticated ? NewWorker : Rlogin}/>
      
      <Tab.Screen name="املاک من" component={ControlPanel} />

    </Tab.Navigator>
  );
}

function RDashborad() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
          headerShown: false,
         tabBarIcon: ({ focused, color, size }) => {
           let iconName;

           if (route.name === 'املاک من') {
             iconName = focused
               ? 'file-tray-full'
               : 'file-tray-full-outline';
           } else if (route.name === 'تنظیمات') {
             iconName = focused ? 'ios-settings' : 'ios-settings-outline';
           }  else if (route.name === 'ملک جدید') {
             iconName = focused ? 'add-circle' : 'add-circle-outline';
           }

           // You can return any component that you like here!
           return <Ionicons name={iconName} size={size} color={color} />;
         },
         tabBarActiveTintColor: 'black',
         tabBarInactiveTintColor: 'gray',

       })}
      >
      <Tab.Screen name="املاک من" component={Dashboard} />
      <Tab.Screen name="ملک جدید" component={NewWorker} />
      <Tab.Screen name="تنظیمات" component={Setting} />
    </Tab.Navigator>
  );
}

const handleDeepLink = (event) => {
  const url = event.url;
  console.log("Deep Link Received: ", url);

  if (!url) {
    navigation.navigate("Base"); // Always go to the home page if no URL is provided
    return;
  }

  // Future deep link logic goes here
};

const App = () => {

  const [visited_before, set_visited_before] = useState(null);

  useEffect(() => {
    // Function to handle deep links
    const handleDeepLinkEvent = (event) => handleDeepLink(event);
  
    // Add event listener for incoming deep links
    const subscription = Linking.addEventListener('url', handleDeepLinkEvent);
  
    // Check if the app was opened with a deep link
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });
  
    return () => {
      // Cleanup listener on unmount
      subscription.remove();
    };
  }, []);

  ////// useEffect


  // useEffect(() => {
  //   // Provide the license file path without the extension
  //   // const licensePath = './assets/vesdk_license';  // Make sure this path is correct
  //   const licensePath = './android/app/src/main/assets/vesdk_license';  

  //   // Attempt to unlock the SDK with the license file
  //   const unlockSDK = async () => {
  //     try {
  //       await VESDK.unlockWithLicense(licensePath);
  //       alert('VESDK unlocked successfully');
  //     } catch (error) {
  //       alert(`Failed to unlock VE.SDK with error: ${error}`);
  //     }
  //   };

  //   unlockSDK();
  // }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  
  

  useEffect(() => {

  

    

    const checkToken = async () => {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        
         console.log(fcmToken);

         //   //register or update devicetoken for notifications;
          axios({
            method:'post',
            url:'https://api.ajur.app/api/registernotif',
            params: {
              device_token: fcmToken,
              device_type : 'android', 
            },
        })
        .then(function (response) {

       



        })
         console.log('tokken fetched properly');
      } else{
        console.log('no tokken retrieved');
      }
     }
     
     checkToken();
  

   // Register the user for push notifications
// Pushy.register().then(async (deviceToken) => {







  // Display an alert with device token

  
 




// }).catch((err) => {
//   // Notify user of failure
//   alert('Registration failed: ' + err.message);
// });



// Please place this code in App.js,
// After the import statements, and before the Component class

// Enable in-app notification banners (iOS 10+)






    try {
     I18nManager.allowRTL(false);
  }
  catch (e) {
     console.log(e);
  }


      AsyncStorage.getItem('id_visitbefore').then(visitStatus => {

        console.log('the visitStatus in app page is now ');
        console.log(visitStatus);

        if (visitStatus == 'true') {
          console.log('we trigered true -----------');
          set_visited_before(true);
        } else {
          console.log('we trigered  false for sure -----------');
          set_visited_before(false);
        }
      });


    
  
   


  }, []);





  /////



    return visited_before !== null && (
      
      <NativeBaseProvider>
        <NavigationContainer>
        <StatusBar
        barStyle="light-content" // or "dark-content"
        backgroundColor="#b92a31" // Customize the background color
      />
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}

             initialRouteName =  { visited_before ? 'Base' : 'Entro' }

            >
            <Stack.Screen
              name="Base"
              component={MainDashborad} 
              options={{title: 'base section'}}
            />
            {/* <Stack.Screen
              name="Base"
              component={Base}
              options={{title: 'base section'}}
            /> */}

            <Stack.Screen
              name="EditRealstate"
              component={EditRealstate}
              options={{title: 'EditRealstate'}}
            />
            <Stack.Screen
              name="SingleChart"
              component={SingleChart}
              options={{title: 'SingleChart'}}
            />



            <Stack.Screen
            name="RMarketing"
            component={RMarketing}
            options={{ headerShown: false }}
            />



            <Stack.Screen
            name="RDashborad"
            component={RDashborad}
            options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Rlogin"
              component={Rlogin}
              options={{title: 'Rlogin'}}
            />
            <Stack.Screen
              name="Rvalidation"
              component={Rvalidation}
              initialParams={{phone: 0}}
              options={{title: 'Rvalidation'}}
            />

            <Stack.Screen
              name="Entro"
              component={Entro}
              options={{title: 'Entro section'}}
            />

            <Stack.Screen
              name="ControlPanel"
              component={ControlPanel}
              options={{title: 'ControlPanel'}}
            />

            <Stack.Screen
              name="Nearests"
              component={Nearests}
              options={{title: 'Nearests'}}
            />

            <Stack.Screen
              name="Landing"
              component={Landing}
              options={{title: 'Landing'}}
            />

            <Stack.Screen
              name="MarkerTypes"
              component={MarkerTypes}
              options={{title: 'MarkerTypes'}}
            />

            <Stack.Screen
              name="WorkerSingle"
              component={WorkerSingle}
              initialParams={{itemId: 800}}
              options={{title: 'workerSingle'}}
            />

            <Stack.Screen
              name="EditWorker"
              component={EditWorker}
              options={{title: 'EditWorker'}}
            />

            <Stack.Screen
              name="NewWorker"
              component={NewWorker}
              options={{title: 'NewWorker'}}
            />

            <Stack.Screen
              name="NewWorker2"
              component={NewWorker2}
              initialParams={{catId: 18, catName: 'testing'}}
              options={{title: 'NewWorker2'}}
            />

            <Stack.Screen
              name="NewWorker3"
              component={NewWorker3}
              initialParams={{workerId: 836, catName: 'testing'}}
              options={{title: 'NewWorker3'}}
            />

            <Stack.Screen
              name="Report"
              component={Report}
              options={{title: 'گزارش ملک', headerShown: true}}
            />


            <Stack.Screen
              name="History"
              component={History}
              options={{title: 'بازدیدهای اخیر', headerShown: true}}
            />

            <Stack.Screen
              name="Liked"
              component={Liked}
              options={{title: 'پسند شده ها', headerShown: true}}
            />

            <Stack.Screen
              name="About"
              component={About}
              options={{title: 'درباره آجر', headerShown: true}}
            />

            <Stack.Screen
              name="Contact"
              component={Contact}
              options={{title: 'پشتیبانی آجر', headerShown: true}}
            />

            <Stack.Screen
              name="Privacy"
              component={Privacy}
              options={{title: 'حریم خصوصی', headerShown: true}}
            />

            <Stack.Screen
              name="Rolls"
              component={Rolls}
              options={{title: 'حریم خصوصی', headerShown: true}}
            />

            <Stack.Screen
              name="RealEstate"
              component={RealEstate}
                initialParams={{id: 0, name: 'test name'}}
              options={{title: 'single realstate ', headerShown: false}}
            />

            <Stack.Screen
              name="SingleEdit"
              component={SingleEdit}
              initialParams={{itemId: 800}}
              options={{title: 'edit & review section ', headerShown: false}}
            />


          </Stack.Navigator>

        </NavigationContainer>
      </NativeBaseProvider>
      
    )
  ;

}

export default App;
