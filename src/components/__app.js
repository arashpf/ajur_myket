console.log('🔍 BEFORE ANY IMPORTS - APP.JS LOADED');
console.log('🔴🔴🔴 APP.JS LOADED 🔴🔴🔴');
console.warn('🟡 WARNING FROM APP.JS');
console.error('🔴 ERROR FROM APP.JS');

import 'react-native-url-polyfill/auto';
import React, {useState, useEffect} from 'react';
import {View, Text, Alert,I18nManager,LogBox,StatusBar,Linking,StyleSheet,TouchableOpacity} from 'react-native';
import {NavigationContainer,useNavigation,useNavigationContainerRef} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {NativeBaseProvider} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import messaging from '@react-native-firebase/messaging';
import { GestureHandlerRootView } from 'react-native-gesture-handler';




I18nManager.allowRTL(false);
I18nManager.forceRTL(false);




import axios from 'axios';

import { CityProvider } from './src/CityContext';

import Entro from './src/components/Entro';
import Base from './src/components/Base';
import Search from './src/components/Search';
import ControlPanel from './src/components/ControlPanel';
import Landing from './src/components/Landing';
// import MarkerTypes from './src/components/MarkerTypes';
import MainMap from './src/components/map/MainMap';
import Nearests from './src/components/Nearests';
import WorkerSingle from './src/components/worker/WorkerSingle';
import Rlogin from './src/components/realstate/auth/login';
import Rvalidation from './src/components/realstate/auth/validation';
import RealEstate from './src/components/realstate/front/single';


import SingleMagazinePost from './src/components/magazine/SingleMagazinePost';

import Report from './src/components/worker/report';


import SingleEdit from './src/components/worker/edit/Single';
import SingleChart from './src/components/worker/charts/index';

import SingleUpgrade from './src/components/worker/upgrade/index';

// realestate tabs components

import MainDashboard from './src/components/navigations/MainDashboard';

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

import FileBank from './src/components/filebank/index';
import NoteBook from './src/components/notebook/index';
import RMarketing from './src/components/realstate/marketing/single';
import Mainmap from './src/components/Mainmap';

import ComissionCalculator from './src/components/comissioncalculator/index';


import WebViewScreen from './src/components/WebViewScreen';

import UpdateModal from "./src/UpdateModal";

import CitySelection from './src/components/CitySelection';







const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBarContainer}>
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

        const getIconName = () => {
          switch (route.name) {
            case 'جستجو':
              return 'search';
            case 'نقشه':
              return 'map';
            case 'ملک جدید':
              return 'add-circle';
            case 'بهترین ها':
              return 'trophy';
            case 'املاک من':
              return 'person';
            default:
              return 'circle';
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabButton}
          >
          

            <Ionicons name={getIconName()} size={24} color={isFocused ? '#ffffff' : '#4a6572'} />
            <Text style={[styles.label, { color: isFocused ? '#ffffff' : '#4a6572' }]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function MainDashborad () {

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
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="جستجو" component={Search} />
      <Tab.Screen name="نقشه" component={MainMap} />
      {/* <Tab.Screen name="ملک جدید" component={isAuthenticated ? NewWorker : Rlogin} /> */}
      <Tab.Screen 
  name="ملک جدید" 
  component={isAuthenticated ? NewWorker : Rlogin} 
  options={{
    tabBarStyle: { display: 'none' },
    tabBarButton: () => null,
  }}
/>
      <Tab.Screen name="بهترین ها" component={Base} />
      <Tab.Screen name="املاک من" component={ControlPanel} />
    </Tab.Navigator>
  );
}

// function RDashborad() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//           headerShown: false,
//          tabBarIcon: ({ focused, color, size }) => {
//            let iconName;

//            if (route.name === 'املاک من') {
//              iconName = focused
//                ? 'file-tray-full'
//                : 'file-tray-full-outline';
//            } else if (route.name === 'پروفایل') {
//              iconName = focused ? 'ios-settings' : 'ios-settings-outline';
//            }  else if (route.name === 'ملک جدید') {
//              iconName = focused ? 'add-circle' : 'add-circle-outline';
//            }

//            // You can return any component that you like here!
//            return <Ionicons name={iconName} size={size} color={color} />;
//          },
//          tabBarActiveTintColor: 'black',
//          tabBarInactiveTintColor: 'gray',

//        })}
//       >
//       <Tab.Screen name="املاک من" component={Dashboard} />
//       <Tab.Screen name="ملک جدید" component={NewWorker} />
//       <Tab.Screen name="پروفایل" component={Setting} />
//     </Tab.Navigator>
//   );
// }

function RDashborad() {  
 

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'املاک من') {
            iconName = focused ? 'file-tray-full' : 'file-tray-full-outline';
          } else if (route.name === 'پروفایل') {
            iconName = focused ? 'ios-person' : 'ios-person-outline';
          } else if (route.name === 'ملک جدید') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#a92b31',
        tabBarInactiveTintColor: 'gray',
      })}
    >
       <Tab.Screen name="املاک من" component={Dashboard} />
       {/* <Tab.Screen name="ملک جدید" component={NewWorker} /> */}
       
       

        <Tab.Screen 
          name="ملک جدید" 
          component={NewWorker}
          options={{
            // tabBarStyle: { display: 'none' },
            // tabBarButton: () => null,
          }}
        />
      <Tab.Screen name="پروفایل" component={Setting} /> 
      
      
    </Tab.Navigator>
  );
}


const App = () => {


  const navigationRef = useNavigationContainerRef();
  const [visited_before, set_visited_before] = useState(null);
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  //  useEffect(() => {
  //   // 1. Handle initial URL when app is launched
  //   const getInitialUrl = async () => {
  //     try {
  //       const initialUrl = await Linking.getInitialURL();
  //       console.log('🌐 Initial URL 🌐🌐:', initialUrl || 'No deep link found');
  //       if (initialUrl) {
  //         handleDeepLink({ url: initialUrl });
  //       }r
  //     } catch (err) {
  //       console.warn('⚠️ URL Error:', err);
  //     }
  //   };

  //   // 2. Handle URL when app is already running
  //   const linkingListener = Linking.addEventListener('url', ({ url }) => {
  //     console.log('🔗 URL event:', url);
  //     handleDeepLink({ url });
  //   });

  //   getInitialUrl(); // Call immediately

  //   return () => {
  //     linkingListener.remove(); // Clean up on unmount
  //   };
  // }, []);

  // todo: active this latter for deep linking
//   useEffect(() => {
//   const handleUrl = ({ url }) => {
//     if (!isNavigationReady) return;
//     console.log('🔗 URL event:', url);
//     handleDeepLink({ url });
//   };

//   const getInitialUrl = async () => {
//     try {
//       const initialUrl = await Linking.getInitialURL();
//       console.log('🌐 Initial URL 🌐🌐:', initialUrl || 'No deep link found');
//       if (initialUrl) {
//         handleDeepLink({ url: initialUrl });
//       }
//     } catch (err) {
//       console.warn('⚠️ URL Error:', err);
//     }
//   };

//   // Add listener using event subscription
//   const subscription = Linking.addEventListener('url', handleUrl);

//   getInitialUrl();

//   return () => {
//     subscription.remove(); // Clean up
//   };
// }, [isNavigationReady, navigationRef]);
 



 // todo: active this latter for deep linking

// useEffect(() => {
//   const handleDeepLinkEvent = (event) => {
//     const { url } = event;
//     handleDeepLink({ url });
//   };

//   const subscription = Linking.addEventListener('url', handleDeepLinkEvent);

//   Linking.getInitialURL().then((url) => {
//     if (url) {
//       handleDeepLink({ url });
//     }
//   });

//   return () => {
//     subscription.remove();
//   };
// }, []);



  


//  const handleDeepLink = ({ url }) => {
//   console.log('🔗 Raw URL:', url);

//   if (!url) {
//     navigationRef.current?.navigate('Base');
//     return;
//   }

//   // Normalize both scheme formats
//   let processedUrl = url;
//  processedUrl = url.replace(/^ajour:\/\//, 'https://ajur.app/');

//   console.log('🔄 Normalized URL:', processedUrl);

//   try {
//     const parsed = new URL(processedUrl);
//     const path = parsed.pathname;
//     // const params = Object.fromEntries(parsed.searchParams);

//     const params = {};
// for (const [key, value] of parsed.searchParams.entries()) {
//   params[key] = value;
// }

//     console.log('📂 Path:', path);
//     console.log('🔍 Params:', params);

//     if (path.startsWith('/worker/')) {
//       const id = path.split('/worker/')[1];
//       navigationRef.current?.navigate('WorkerSingle', { 
//         itemId: id,
//         ...params
//       });
//     } else {
//       navigationRef.current?.navigate('Base');
//     }
//   } catch (e) {
//     console.error('URL Parsing Error:', e);
//     navigationRef.current?.navigate('Base');
//   }
// };

// const handleDeepLink = ({ url }) => {
//   console.log('🔗 Raw URL i need:', url);

//   if (!url) {
//     // No URL, do nothing
//     return;
//   }

//   let processedUrl = url;

//   if (url.includes('ajur.app')) {
//     try {
//       const parsed = new URL(processedUrl);
//       const path = parsed.pathname.toLowerCase(); // lowercase for easier matching

//       console.log('📂 Path:', path);

//       switch (true) {
//         case path.startsWith('/worker/'): {
//           const id = path.split('/worker/')[1].split('/')[0];
//           navigationRef.current?.navigate('WorkerSingle', { itemId: id });
//           break;
//         }
//         case path.startsWith('/realestates/'): {
//           const id = path.split('/realestates/')[1].split('/')[0];
//           navigationRef.current?.navigate('RealEstate', { id });
//           break;
//         }
//         case path.startsWith('/marketing'):
//           navigationRef.current?.navigate('RMarketing');
//           break;
//         case path.startsWith('/panel'):
//           navigationRef.current?.navigate('RDashborad');
//           break;
//         default:
//           // No match, do nothing
//           console.log('No matching route for path:', path);
//           break;
//       }
//     } catch (e) {
//       console.error('URL Parsing Error:', e);
//       // Do nothing on error
//     }
//   } else {
//     // Normalize custom scheme ajour:// to https://ajur.app/
//     if (url.startsWith('ajour://')) {
//       try {
//         const temp = new URL(url);
//         if (!temp.host) {
//           processedUrl = url.replace(/^ajour:\/\//, 'https://ajur.app/');
//         }
//       } catch {
//         processedUrl = url.replace(/^ajour:\/\//, 'https://ajur.app/');
//       }
//     }

//     console.log('🔄 Normalized URL:', processedUrl);

//     try {
//       const parsed = new URL(processedUrl);
//       const host = parsed.hostname; // usually "worker"
//       const path = parsed.pathname;
//       const params = {};
//       for (const [key, value] of parsed.searchParams.entries()) {
//         params[key] = value;
//       }

//       console.log('🔍 Host:', host);
//       console.log('📂 Path:', path);
//       console.log('🔍 Params:', params);

//       if (host === 'worker' && path) {
//         const id = path.replace(/^\/+/, '');
//         navigationRef.current?.navigate('WorkerSingle', { itemId: id, ...params });
//       } else {
//         // No match, do nothing
//         console.log('No matching host/path for custom scheme:', host, path);
//       }
//     } catch (e) {
//       console.error('URL Parsing Error:', e);
//       // Do nothing on error
//     }
//   }
// };


//working with share workers update

 // todo: active this latter for deep linking

// const handleDeepLink = ({ url }) => {
//   console.log('🔗 Raw URL:', url);
  
//   if (!url) return;

//   // Handle custom scheme directly (ajour://)
//   if (url.startsWith('ajour://worker/')) {
//     const id = url.replace('ajour://worker/', '').split('/')[0];
//     navigationRef.current?.navigate('WorkerSingle', { itemId: id });
//     return;
//   }

//   // Handle HTTPS links (ajur.app)
//   if (url.includes('ajur.app')) {
//     try {
//       const parsed = new URL(url);
//       const path = parsed.pathname.toLowerCase();

//       // 1. Handle worker single view
//       if (path.startsWith('/worker/')) {
//         const id = path.split('/worker/')[1].split('/')[0];
//         navigationRef.current?.navigate('WorkerSingle', { itemId: id });
//       }
//       // 2. Handle shared selections
//       else if (path.startsWith('/share/')) {
//         const shortCode = path.split('/share/')[1].split('/')[0];
//         navigationRef.current?.navigate('SharedItems', { shortCode });
//       }
//       // 3. Add other path handlers as needed
//       else {
//         console.log('Unhandled path:', path);
//       }
//     } catch (e) {
//       console.error('URL parsing error:', e);
//     }
//   }
// };


// const handleDeepLink = ({ url }) => {
//   console.log('🔗 Raw URL:', url);
  
//   if (!url) return;

//   // Handle custom scheme directly
//   if (url.startsWith('ajour://worker/')) {
//     const id = url.replace('ajour://worker/', '').split('/')[0];
//     navigationRef.current?.navigate('WorkerSingle', { itemId: id });
//     return;
//   }

//   // Handle HTTPS links
//   if (url.includes('ajur.app')) {
//     try {
//       const parsed = new URL(url);
//       const path = parsed.pathname.toLowerCase();

//       if (path.startsWith('/worker/')) {
//         const id = path.split('/worker/')[1].split('/')[0];
//         navigationRef.current?.navigate('WorkerSingle', { itemId: id });
//       }
//       // Add other path handlers as needed
//     } catch (e) {
//       console.error('URL parsing error:', e);
//     }
//   }
// };


// const handleDeepLink = ({ url }) => {
//   console.log('🔗 Raw URL i need:', url);

//   if (!url) {
//     // navigationRef.current?.navigate('Base');
//     return;
//   }

//   let processedUrl = url;

//   if (url.includes('ajur.app')) {
    

//     try {
//       const parsed = new URL(processedUrl);
//       const path = parsed.pathname.toLowerCase(); // lowercase for easy matching

//       console.log('📂 Path:', path);

//       switch (true) {
//         case path.startsWith('/worker/'):
//           {
//             const id = path.split('/worker/')[1].split('/')[0];
//             navigationRef.current?.navigate('WorkerSingle', { itemId: id });
//           }
//           break;

//         case path.startsWith('/realestates/'):
//           const id = path.split('/realestates/')[1].split('/')[0];

          
          
//           navigationRef.current?.navigate('RealEstate', { id: id });
//           break;

//         case path.startsWith('/marketing'):
          
//           navigationRef.current?.navigate('RMarketing');
//           break;

//         case path.startsWith('/panel'):
          
//           navigationRef.current?.navigate('RDashborad'); 
//           break;

//         default:
//           navigationRef.current?.navigate('Base');
//           break;
//       }
//     } catch (e) {
//       console.error('URL Parsing Error:', e);
//       // navigationRef.current?.navigate('Base');
//     }
//   } else {
//     // Normalize ajour:// custom scheme to https
//     if (url.startsWith('ajour://')) {
//       try {
//         const temp = new URL(url);
//         if (!temp.host) {
//           processedUrl = url.replace(/^ajour:\/\//, 'https://ajur.app/');
//         }
//       } catch (e) {
//         console.warn('Fallback normalization used.');
//         processedUrl = url.replace(/^ajour:\/\//, 'https://ajur.app/');
//       }
//     }

//     console.log('🔄 Normalized URL:', processedUrl);

//     try {
//       const parsed = new URL(processedUrl);
//       const host = parsed.hostname; // usually "worker" in ajour:// scheme
//       const path = parsed.pathname;
//       const params = {};
//       for (const [key, value] of parsed.searchParams.entries()) {
//         params[key] = value;
//       }

//       console.log('🔍 Host:', host);
//       console.log('📂 Path:', path);
//       console.log('🔍 Params:', params);

//       if (host === 'worker' && path) {
//         const id = path.replace(/^\/+/, '');
//         navigationRef.current?.navigate('WorkerSingle', { itemId: id, ...params });
//       } else {
//         // navigationRef.current?.navigate('Base');
//       }
//     } catch (e) {
//       console.error('URL Parsing Error:', e);
//       // navigationRef.current?.navigate('Base');
//     }
//   }
// };


// const handleDeepLink = ({ url }) => {
//   console.log('🔗 Raw URL i need:', url);
  
  

//   if (!url) {
//     navigationRef.current?.navigate('Base');
//     return;
//   }

//   let processedUrl = url;

//    if (url?.includes('ajur.app')) {
//     alert('https');

//     // i wanna use switch here
//   }else{

//     if (url.startsWith('ajour://')) {
//     try {
//       const temp = new URL(url);
//       if (!temp.host) {
//         processedUrl = url.replace(/^ajour:\/\//, 'https://ajur.app/');
//       }
//     } catch (e) {
//       console.warn('Fallback normalization used.');
//       processedUrl = url.replace(/^ajour:\/\//, 'https://ajur.app/');
//     }
//   }

//   console.log('🔄 Normalized URL:', processedUrl);

//   try {
//     const parsed = new URL(processedUrl);
//     const host = parsed.hostname;  // Will be "worker" if scheme is "ajur"
//     const path = parsed.pathname;  // e.g. "/123"
//     const params = {};
//     for (const [key, value] of parsed.searchParams.entries()) {
//       params[key] = value;
//     }

//     console.log('🔍 Host:', host);
//     console.log('📂 Path:', path);
//     console.log('🔍 Params:', params);

//     if (host === 'worker' && path) {
//       const id = path.replace(/^\/+/, ''); // Remove leading slashes
//       navigationRef.current?.navigate('WorkerSingle', { itemId: id, ...params });
//     } else {
//       navigationRef.current?.navigate('Base');
//     }
//   } catch (e) {
//     console.error('URL Parsing Error:', e);
//     navigationRef.current?.navigate('Base');
//   }

//   }

  

//   // Only normalize if it's ajour:/// (with triple slash) or malformed
  
// };



 


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

//  const linking = {
//   prefixes: ['https://ajur.app', 'ajur://'],
//   config: {
//     screens: {
//       Base: {
//         path: '',
//         screens: {
//           // WorkerSingle handles property views
//           WorkerSingle: {
//             path: 'worker/:id',
//             parse: {
//               id: (id) => `${id}`,
//             },
//           },
//           // Marketing screens
//           RMarketing: {
//             path: 'marketing/:id',
//             parse: {
//               id: (id) => `${id}`,
//             },
//           },
//           // Real Estate screens
//           RealEstate: {
//             path: 'realestate/:id',
//             parse: {
//               id: (id) => `${id}`,
//             },
//           },
//           // Dashboard
//           RDashborad: 'dashboard',
//         }
//       },
//       // Add other top-level screens that might be directly accessible
//       Rlogin: 'login',
//       Rvalidation: 'validation',
//     },
//   },
// };


const linking = {
  prefixes: [
    'https://ajur.app',
    'ajour://' // Add your custom scheme explicitly
  ],
  config: {
    screens: {
      WorkerSingle: 'worker/:id',
      RealEstate: 'realestates/:id',
      RMarketing: 'marketing',
      RDashborad: 'panel',
      // Add other screens as needed
    }
  }
};



    return visited_before !== null && (
      
      
      <GestureHandlerRootView style={{ flex: 1 }}>
        <CityProvider>
      <NativeBaseProvider>
        <NavigationContainer 
         ref={navigationRef}
      onReady={() => {
        setIsNavigationReady(true);
      }}
        linking={linking} 
         >
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
              component={MainDashboard} 
              options={{title: 'base section'}}
            />

            <Stack.Screen
              name="Search"
              component={Search} 
              options={{title: 'search section'}}
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
              name="SingleUpgrade"
              component={SingleUpgrade}
              options={{title: 'SingleUpgrade'}}
            />




            <Stack.Screen
            name="RMarketing"
            component={RMarketing}
            options={{ headerShown: false }}
            />


            <Stack.Screen
            name="FileBank"
            component={FileBank}
            options={{ headerShown: false }}
            />

            <Stack.Screen
            name="ComissionCalculator"
            component={ComissionCalculator}
            options={{ headerShown: false }}
            />

            

            <Stack.Screen
            name="NoteBook"
            component={NoteBook}
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
                name="CitySelection"
                component={CitySelection}
                options={{title: 'انتخاب شهر'}}
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
              name="MainMap"
              component={MainMap}
              options={{title: 'MainMap'}}
            />

              {/* <Stack.Screen
              name="SingleMagazinePost"
              component={SingleMagazinePost}
              initialParams={{itemId: 1072}}
              options={{title: 'SingleMagazinePost'}}
            /> */}

            <Stack.Screen 
              name="SingleMagazinePost" 
              component={SingleMagazinePost} 
              options={({ route }) => ({ 
                title: 'بازگشت',
                headerBackTitle: 'بازگشت',
                headerShown: true 
              })}
            />

            

            <Stack.Screen
              name="WorkerSingle"
              component={WorkerSingle}
              initialParams={{itemId: 800}}
              options={{title: 'workerSingle'}}
            />

             <Stack.Screen
              name="RealEstate"
              component={RealEstate}
                initialParams={{id: 0, name: 'test name'}}
              options={{title: ' realstate ', headerShown: false}}
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
              name="SingleEdit"
              component={SingleEdit}
              initialParams={{itemId: 800}}
              options={{title: 'edit & review section ', headerShown: false}}
            />

            <Stack.Screen 
              name="WebViewScreen" 
              component={WebViewScreen}
              options={{ headerShown: false }}
            />


          </Stack.Navigator>

        </NavigationContainer>
        <UpdateModal /> 
      </NativeBaseProvider>
      </CityProvider>
      </GestureHandlerRootView>
     
      
    )
  ;

}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70,
    borderTopWidth: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 30,
    margin: 10,
    marginBottom: 15,
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default App;
