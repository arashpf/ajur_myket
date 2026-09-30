import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  FlatList,
  Animated,
  Easing,
  ScrollView,
  RefreshControl,
  Pressable,
  View,
} from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Center,
  Modal,
  Progress,
  Input,
  FormControl,
  WarningOutlineIcon,
  CheckIcon,
  CloseIcon,
} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import momentJalaali from 'moment-jalaali';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RefBox from '../parts/refBox';
import BannerSlider from '../parts/bannerSlider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

momentJalaali.loadPersian({usePersianDigits: false});

export default function ReferralScreen() {
  const navigation = useNavigation();
  const [activeMembers, setActiveMembers] = useState(7);
  const [timeLeft, setTimeLeft] = useState(getSecondsToMonthEnd());

  const [showCelebration, setShowCelebration] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showCashOutModal, setShowCashOutModal] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [username, setUsername] = useState('');
  const [tempUsername, setTempUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [usernameValidation, setUsernameValidation] = useState({
    isValid: false,
    message: ''
  });
  const [showShareAction, setShowShareAction] = useState(false); // ADD THIS STATE

  const [coins, setCoins] = useState(0);
  const [successfulRefs, setSuccessfulRefs] = useState(0);
  const [totalSuccessfulRefs, setTotalSuccessfulRefs] = useState(0);

  const [topUsers, setTopUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userInTopThree, setUserInTopThree] = useState(false);

  const [addedCoins, setAddedCoins] = useState(0);

  const coinScaleAnim = useRef(new Animated.Value(1)).current;
  const coinShakeAnim = useRef(new Animated.Value(0)).current;
  const celebrationOpacityAnim = useRef(new Animated.Value(0)).current;
  const celebrationScaleAnim = useRef(new Animated.Value(0.8)).current;
  const emojiScaleAnim = useRef(new Animated.Value(0)).current;

  // Debounce function for username checking
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  // Validate username format
  const validateUsernameFormat = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    
    if (username.length < 3) {
      return {
        isValid: false,
        message: 'نام کاربری باید حداقل ۳ کاراکتر باشد'
      };
    }
    
    if (!usernameRegex.test(username)) {
      return {
        isValid: false,
        message: 'فقط حروف انگلیسی، اعداد و زیرخط مجاز است'
      };
    }
    
    return {
      isValid: true,
      message: 'نام کاربری معتبر است'
    };
  };

  // Check if username exists in database
  const checkUsernameExists = async (usernameToCheck) => {
    try {
      const token = await AsyncStorage.getItem('id_token');
      if (!token) return false;

      const response = await axios.post('https://api.ajur.app/api/check-username', {
        token,
        username: usernameToCheck
      });
      
      return response.data.exists;
    } catch (error) {
      console.log('Error checking username:', error);
      return false;
    }
  };

  // Save username to database
  const saveUsernameToDatabase = async (newUsername) => {
    try {
      const token = await AsyncStorage.getItem('id_token');
      if (!token) return false;

      const response = await axios.post('https://api.ajur.app/api/save-username', {
        token,
        username: newUsername
      });
      
      return response.data.success;
    } catch (error) {
      console.log('Error saving username:', error);
      return false;
    }
  };

  // Debounced username check
  const debouncedCheckUsername = useCallback(
    debounce(async (usernameToCheck) => {
      if (usernameToCheck.length < 3) {
        setUsernameAvailable(null);
        return;
      }

      setIsCheckingUsername(true);
      try {
        const exists = await checkUsernameExists(usernameToCheck);
        setUsernameAvailable(!exists);
        
        if (exists) {
          setUsernameError('این نام کاربری قبلاً انتخاب شده است');
        } else {
          setUsernameError('');
        }
      } catch (error) {
        setUsernameAvailable(null);
        setUsernameError('خطا در بررسی نام کاربری');
      } finally {
        setIsCheckingUsername(false);
      }
    }, 1500),
    []
  );

  // Handle username input change
  const handleUsernameChange = (text) => {
    const cleanedText = text.replace(/[^a-zA-Z0-9_]/g, '');
    setTempUsername(cleanedText);
    
    // Validate format
    const validation = validateUsernameFormat(cleanedText);
    setUsernameValidation(validation);
    
    // Check availability if length >= 3
    if (cleanedText.length >= 3) {
      debouncedCheckUsername(cleanedText);
    } else {
      setUsernameAvailable(null);
      setUsernameError('');
    }
  };

  

  // Handle username submission
  const handleUsernameSubmit = async () => {
    if (!usernameValidation.isValid) {
      setUsernameError('لطفاً یک نام کاربری معتبر وارد کنید');
      return;
    }

    if (usernameAvailable === false) {
      setUsernameError('این نام کاربری قبلاً انتخاب شده است');
      return;
    }

    if (usernameAvailable === null && tempUsername.length >= 3) {
      setUsernameError('در حال بررسی نام کاربری...');
      return;
    }

    setIsCheckingUsername(true);
    try {
      const saved = await saveUsernameToDatabase(tempUsername);
      
      if (saved) {
        setUsername(tempUsername);
        setShowUsernameModal(false);
        setTempUsername('');
        setUsernameAvailable(null);
        setUsernameError('');
        
        // After setting username, show the share options
        if (showShareAction) {
          // Here you can trigger the share functionality
          // For now, we'll just reset the flag
          setShowShareAction(false);
        }
      } else {
        setUsernameError('خطا در ذخیره نام کاربری');
      }
    } catch (error) {
      setUsernameError('خطا در ارتباط با سرور');
    } finally {
      setIsCheckingUsername(false);
    }
  };

  // Load saved coins from AsyncStorage
  const loadSavedCoins = async () => {
    try {
      const savedCoins = await AsyncStorage.getItem('user_coins');
      if (savedCoins !== null) {
        return parseInt(savedCoins, 10);
      }
    } catch (error) {
      console.log('Error loading saved coins:', error);
    }
    return 0;
  };

  // Save coins to AsyncStorage
  const saveCoins = async coinAmount => {
    try {
      await AsyncStorage.setItem('user_coins', coinAmount.toString());
    } catch (error) {
      console.log('Error saving coins:', error);
    }
  };

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    const savedCoins = await loadSavedCoins();

    AsyncStorage.getItem('id_token').then(token => {
      if (!token) return;

      axios
        .get('https://api.ajur.app/api/ref-section', {params: {token}})
        .then(response => {
          const data = response.data;
          const user = data.user;
          const top = data.top_marketers || [];
          const rank = parseInt(data.user_rank || '0', 10);
          const inTopThree = data.user_in_top_three || false;
          const currentCoins = data.user_coin || 0;

          // 🧠 Build leaderboard items
          const leaderboard = top.map((u, index) => ({
            id: `top-${index + 1}-${u.phone}`,
            rank: String(index + 1),
            phone: maskPhone(u.phone),
            prize: getPrizeByRank(index + 1),
            medal: getMedalByRank(index + 1),
            activeMembers: u.count,
            isCurrentUser: u.phone === user?.phone,
          }));

          // 🧠 Create current user display info ONLY if not in top 3 and has a rank
          let currentUserData = null;
          if (!inTopThree && rank > 0) {
            currentUserData = {
              id: `current-${user?.id || 'me'}`,
              rank: rank.toString(),
              phone: 'شما',
              prize: getPrizeByRank(rank),
              medal: getMedalByRank(rank),
              activeMembers: data.successful_refs || 0,
              isCurrentUser: true,
            };
          }

          setUsername(user?.username || '');
          setCoins(currentCoins);
          setSuccessfulRefs(data.successful_refs || 0);
          setTotalSuccessfulRefs(data.total_successful_refs || 0);
          setTotalUsers(data.total_users || 0);
          setUserInTopThree(inTopThree);

          setTopUsers(leaderboard);
          setCurrentUser(currentUserData);

          // 🎉 Check if coins increased and show celebration
          if (currentCoins > savedCoins) {
            const coinsAdded = currentCoins - savedCoins;
            setAddedCoins(coinsAdded);
            triggerCelebration(coinsAdded);
          }

          // Save current coins for next comparison
          saveCoins(currentCoins);
        })
        .catch(error => console.log('Referral API error:', error));
    });
  };

  useEffect(() => {
    const iv = setInterval(() => setTimeLeft(getSecondsToMonthEnd()), 1000);
    return () => clearInterval(iv);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadReferralData();
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  // MODIFIED: Handle share button click
  const handleShareClick = () => {
    if (!username) {
      setShowShareAction(true);
      setShowUsernameModal(true);
    } else {
      // Proceed with normal share functionality
      // You can call your existing share function here
      console.log('Proceeding with share functionality');
    }
  };

  // MODIFIED: Handle copy button click
  const handleCopyClick = () => {
    if (!username) {
      setShowShareAction(true);
      setShowUsernameModal(true);
    } else {
      // Proceed with normal copy functionality
      // You can call your existing copy function here
      console.log('Proceeding with copy functionality');
    }
  };

  const handleCashOut = () => {
    setShowCashOutModal(true);
  };

  const triggerCelebration = (coinsAdded = 1) => {
    // Reset animations
    coinScaleAnim.setValue(1);
    coinShakeAnim.setValue(0);
    celebrationOpacityAnim.setValue(0);
    celebrationScaleAnim.setValue(0.8);
    emojiScaleAnim.setValue(0);

    setAddedCoins(coinsAdded);
    setShowCelebration(true);

    // Celebration entrance animation
    Animated.parallel([
      // Fade in
      Animated.timing(celebrationOpacityAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      // Scale up
      Animated.timing(celebrationScaleAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      // Emoji bounce
      Animated.sequence([
        Animated.timing(emojiScaleAnim, {
          toValue: 1.2,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(emojiScaleAnim, {
          toValue: 1,
          duration: 150,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(emojiScaleAnim, {
          toValue: 1.1,
          duration: 100,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(emojiScaleAnim, {
          toValue: 1,
          duration: 100,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Coin animation
    Animated.sequence([
      Animated.timing(coinScaleAnim, {
        toValue: 1.5,
        duration: 300,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(coinShakeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(coinScaleAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // Hide after 3 seconds
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(celebrationOpacityAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(celebrationScaleAnim, {
          toValue: 0.8,
          duration: 500,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowCelebration(false);
      });
    }, 3000);
  };

  const shakeInterpolate = coinShakeAnim.interpolate({
    inputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    outputRange: [0, -15, 15, -15, 15, -15, 15, -15, 15, -15, 0],
  });

  const {days, hours, minutes, seconds} = secondsToDHMS(timeLeft);
  const currentJalaliMonth = momentJalaali().locale('fa').format('jMMMM');
  const progressPercent = Math.min((totalUsers / 1000000) * 100, 100);

  // Prepare display data: top 3 + current user (if not in top 3)
  const displayUsers = currentUser ? [...topUsers, currentUser] : topUsers;

  return (
    <View style={{flex: 1}}>
      <ScrollView
        style={{padding: 10}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#a92b31']}
            tintColor="#a92b31"
          />
        }>
        {/* Top bar */}
        <HStack justifyContent="space-between" alignItems="center" mb={4}>
          <HStack alignItems="center" space={2}>
            <Animated.Image
              source={require('../assets/ajurak.png')}
              style={{
                width: 50,
                height: 50,
                transform: [
                  {scale: coinScaleAnim},
                  {translateX: shakeInterpolate},
                ],
              }}
            />
            <Text fontSize="lg" fontWeight="bold" style={{color: '#a92b31'}}>
              {Math.floor(coins)}
            </Text>
          </HStack>

          <Button
            size="sm"
            bg="#a92b31"
            _text={{color: 'white'}}
            onPress={handleCashOut}
          >
            نقد کردن آجرک ها
          </Button>
        </HStack>

        {/* Celebration animation */}
        {showCelebration && (
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: celebrationOpacityAnim,
              transform: [{scale: celebrationScaleAnim}],
              zIndex: 9999,
              backgroundColor: 'rgba(0,0,0,0.85)',
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                borderRadius: 25,
                paddingVertical: 40,
                paddingHorizontal: 35,
                margin: 25,
                minHeight: 320,
                width: '85%',
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 15},
                shadowOpacity: 0.3,
                shadowRadius: 25,
                elevation: 15,
              }}>
              <Animated.Text
                style={{
                  fontSize: 70,
                  marginBottom: 30,
                  transform: [{scale: emojiScaleAnim}],
                }}>
                🎉
              </Animated.Text>

              <Text
                style={{
                  color: '#a92b31',
                  fontSize: 28,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: 15,
                  padding: 10,
                }}>
                تبریک!
              </Text>

              <Text
                style={{
                  color: '#333',
                  fontSize: 20,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: 10,
                  padding: 20,
                  lineHeight: 30,
                }}>
                سکه دریافت کردید
              </Text>

              <Text
                style={{
                  color: 'gold',
                  fontSize: 36,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginTop: 15,
                  marginBottom: 10,
                  textShadowColor: 'rgba(0,0,0,0.3)',
                  textShadowOffset: {width: 1, height: 1},
                  textShadowRadius: 3,
                  padding: 20,
                }}>
                +{addedCoins} سکه
              </Text>

              <Text
                style={{
                  color: '#666',
                  fontSize: 16,
                  textAlign: 'center',
                  marginTop: 25,
                  lineHeight: 24,
                }}>
                {addedCoins > 1
                  ? `${addedCoins} سکه جدید به موجودی شما اضافه شد`
                  : 'سکه جدید به موجودی شما اضافه شد'}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* USERNAME MODAL */}
        <Modal 
          isOpen={showUsernameModal} 
          onClose={() => {
            setShowUsernameModal(false);
            setTempUsername('');
            setUsernameAvailable(null);
            setUsernameError('');
            setUsernameValidation({isValid: false, message: ''});
          }}
          closeOnOverlayClick={true}
        >
          <Modal.Content maxWidth="90%" borderRadius="2xl">
            <Modal.Header
              borderBottomWidth={1}
              borderColor="gray.200"
              bg="transparent"
              _text={{fontWeight: 'bold', fontSize: 'md'}}
              alignItems="center"
              justifyContent="center">
              <HStack justifyContent="space-between" alignItems="center" w="100%">
                <Modal.CloseButton
                  position="relative"
                  left={0}
                  top={0}
                  _icon={{color: 'black'}}
                />
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  textAlign="center"
                  flex={1}
                  color="black">
                  انتخاب نام کاربری
                </Text>
              </HStack>
            </Modal.Header>

            <Modal.Body bg="white">
              <VStack space={4} alignItems="center">
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  textAlign="center"
                  color="#a92b31">
                  {showShareAction ? 'قبل از اشتراک‌گذاری' : 'انتخاب نام کاربری'}
                </Text>
                
                <Text
                  fontSize="sm"
                  textAlign="center"
                  lineHeight="lg"
                  color="gray.700">
                  {showShareAction 
                    ? 'برای اشتراک‌گذاری لینک دعوت،  نام کاربری انتخاب کنید'
                    : 'یک نام کاربری برای خود انتخاب کنید'}
                </Text>

                <FormControl isInvalid={!!usernameError} w="100%">
                  <FormControl.Label>
                    <Text fontSize="sm" fontWeight="medium">نام کاربری</Text>
                  </FormControl.Label>
                  <Input
                    value={tempUsername}
                    onChangeText={handleUsernameChange}
                    placeholder="username"
                    textAlign="left"
                    autoCapitalize="none"
                    autoCorrect={false}
                    isDisabled={isCheckingUsername}
                    InputRightElement={
                      <HStack mr={2} alignItems="center">
                        {isCheckingUsername && tempUsername.length >= 3 && (
                          <Text fontSize="xs" color="gray.500">در حال بررسی...</Text>
                        )}
                        {!isCheckingUsername && usernameAvailable === true && (
                          <CheckIcon size="4" color="green.500" />
                        )}
                        {!isCheckingUsername && usernameAvailable === false && (
                          <CloseIcon size="4" color="red.500" />
                        )}
                      </HStack>
                    }
                  />
                  
                  {/* Validation Messages */}
                  {tempUsername.length > 0 && (
                    <VStack mt={2} space={1}>
                      {usernameValidation.message && (
                        <Text 
                          fontSize="xs" 
                          color={usernameValidation.isValid ? "green.500" : "orange.500"}
                        >
                          {usernameValidation.message}
                        </Text>
                      )}
                      
                      {tempUsername.length >= 3 && usernameAvailable !== null && !isCheckingUsername && (
                        <Text 
                          fontSize="xs" 
                          color={usernameAvailable ? "green.500" : "red.500"}
                        >
                          {usernameAvailable ? 'نام کاربری قابل استفاده است' : 'این نام کاربری قبلاً انتخاب شده است'}
                        </Text>
                      )}
                    </VStack>
                  )}
                  
                  <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                    {usernameError}
                  </FormControl.ErrorMessage>
                  
                  <FormControl.HelperText>
                    نام کاربری باید بین ۳ تا ۲۰ کاراکتر و فقط شامل حروف انگلیسی، اعداد و زیرخط باشد
                  </FormControl.HelperText>
                </FormControl>
              </VStack>
            </Modal.Body>

            <Modal.Footer bg="gray.50" borderTopWidth={1} borderColor="gray.200">
              <Center w="100%">
                <Button
                  bg="#a92b31"
                  _text={{color: 'white', fontWeight: 'bold'}}
                  px={12}
                  py={3}
                  borderRadius="full"
                  onPress={handleUsernameSubmit}
                  isLoading={isCheckingUsername}
                  isDisabled={
                    !tempUsername.trim() || 
                    !usernameValidation.isValid || 
                    usernameAvailable === false ||
                    (tempUsername.length >= 3 && usernameAvailable === null)
                  }
                >
                  {showShareAction ? 'انتخاب و ادامه' : 'تایید نام کاربری'}
                </Button>
              </Center>
            </Modal.Footer>
          </Modal.Content>
        </Modal>

        {/* CASH OUT MODAL */}
        <Modal isOpen={showCashOutModal} onClose={() => setShowCashOutModal(false)}>
          <Modal.Content maxWidth="90%" borderRadius="2xl">
            <Modal.Header
              borderBottomWidth={1}
              borderColor="gray.200"
              bg="transparent"
              _text={{fontWeight: 'bold', fontSize: 'md'}}
              alignItems="center"
              justifyContent="center">
              <HStack justifyContent="space-between" alignItems="center" w="100%">
                <Modal.CloseButton
                  position="relative"
                  left={0}
                  top={0}
                  _icon={{color: 'black'}}
                />
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  textAlign="right"
                  flex={1}
                  color="black">
                  نقد کردن آجرک ها
                </Text>
              </HStack>
            </Modal.Header>

            <Modal.Body bg="white">
              <VStack space={4} alignItems="center">
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  textAlign="center"
                  color="#a92b31">
                  توجه!
                </Text>
                
                <Text
                  fontSize="sm"
                  textAlign="right"
                  lineHeight="lg"
                  color="gray.700">
                  امکان نقد کردن آجرک ها در حال حاضر غیرفعال است.
                  {'\n\n'}
                  هنگامی که به ۱ میلیون کاربر فعال برسیم، می‌توانید آجرک‌های خود را نقد کنید.
                  {'\n\n'}
                  هر آجرک قیمت مشخصی خواهد داشت و می‌توانید توکن آجرک خود را به توکن ارز دیجیتال آجرک تبدیل کنید.
                </Text>

                <Box
                  bg="orange.50"
                  p={3}
                  borderRadius={8}
                  borderWidth={1}
                  borderColor="orange.200"
                  width="100%">
                  <Text
                    fontSize="xs"
                    textAlign="center"
                    color="orange.700"
                    fontWeight="medium">
                    کاربران فعال فعلی: {totalUsers.toLocaleString('fa-IR')}
                  </Text>
                </Box>
              </VStack>
            </Modal.Body>

            <Modal.Footer bg="gray.50" borderTopWidth={1} borderColor="gray.200">
              <Center w="100%">
                <Button
                  bg="#a92b31"
                  _text={{color: 'white', fontWeight: 'bold'}}
                  px={12}
                  py={3}
                  borderRadius="full"
                  onPress={() => setShowCashOutModal(false)}>
                  متوجه شدم و بستن
                </Button>
              </Center>
            </Modal.Footer>
          </Modal.Content>
        </Modal>

        <BannerSlider />
        <VStack space={3} alignItems="center">
          {/* MODIFIED: Pass the handle functions to RefBox */}
          <RefBox 
            username={username} 
            onShareClick={handleShareClick}
            onCopyClick={handleCopyClick}
          />

          {/* Rest of your components remain the same */}
          <Box
            mt={4}
            alignSelf="flex-end"
            bg="linear-gradient(135deg, #FFFBEB, #FEF3C7)"
            p={4}
            borderRadius={12}
            borderWidth={2}
            borderColor="#F59E0B"
            borderStyle="dashed"
            position="relative"
            overflow="hidden">
            <Text position="absolute" top={2} right={2} fontSize="lg">
              ✨
            </Text>
            <Text position="absolute" top={3} left={3} fontSize="xl">
              🎈
            </Text>

            <VStack space={2}>
              <HStack alignItems="center" space={2} alignSelf="flex-end">
                <Text fontSize="lg">🎊</Text>
                <Text fontSize="sm" fontWeight="bold" color="#a92b31">
                  جایزه نقدی ماهانه!
                </Text>
                <Text fontSize="lg">🎊</Text>
              </HStack>

              <Text fontSize="sm" textAlign="right" color="gray.700">
                آخر هر ماه سه نفری که تعداد بیشتری عضو فعال بازاریابی کرده
                باشند، جایزه نقدی به حسابشان واریز میشود
              </Text>
            </VStack>
          </Box>

          {/* Countdown */}
          <Center mt={4}>
            <HStack space={3} alignItems="center">
              <TimeCard value={days} label="روز" />
              <TimeCard value={hours} label="ساعت" />
              <TimeCard value={minutes} label="دقیقه" />
              <TimeCard value={seconds} label="ثانیه" />
            </HStack>
          </Center>

          {/* Progress Bar */}
          <Box mt={4} w="100%" bg="white" borderRadius={12} p={4} shadow={2}>
            <HStack justifyContent="space-between" alignItems="center">
              <Text fontWeight="bold" fontSize="sm" color="#a92b31">
                {totalUsers.toLocaleString('en-US')} / 1,000,000
              </Text>
              <Text fontWeight="bold" fontSize="sm" color="gray.600">
                کاربران فعال
              </Text>
            </HStack>
            <Progress 
              mt={3} 
              value={progressPercent} 
              bg="gray.100"
              _filledTrack={{
                bg: 'linear-gradient(90deg, #a92b31, #d1454b)'
              }}
              borderRadius="full"
              height="8px"
            />
          </Box>

          {/* Top users */}
          <Box width="100%">
            <HStack justifyContent="flex-end" alignItems="center" px={2}>
              <Pressable
                onPress={() => setShowInfo(true)}
                style={{
                  backgroundColor: '#333',
                  borderRadius: 50,
                  width: 26,
                  height: 26,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                }}>
                <Text
                  style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>
                  !
                </Text>
              </Pressable>
              <Text
                fontSize="md"
                fontWeight="bold"
                mt={5}
                mb={3}
                alignSelf="flex-end">
                سه نفر اول ماه {currentJalaliMonth} تا این لحظه
              </Text>
            </HStack>

            <FlatList
              data={displayUsers}
              keyExtractor={item => item.id}
              style={{width: '100%'}}
              scrollEnabled={false}
              renderItem={({item}) => (
                <HStack
                  justifyContent="space-between"
                  alignItems="center"
                  py={3}
                  px={2}
                  borderBottomWidth={1}
                  borderBottomColor="#f0f0f0"
                  bg={item.isCurrentUser ? '#FFF7ED' : 'transparent'}
                  borderRadius={item.isCurrentUser ? 8 : 0}>
                  <HStack alignItems="center" space={4}>
                    {/* 🧠 Medal or Rank */}
                    {parseInt(item.rank, 10) <= 3 ? (
                      <Text fontSize="2xl">{item.medal}</Text>
                    ) : (
                      <Text
                        fontSize="lg"
                        fontWeight="bold"
                        style={{width: 24, textAlign: 'center'}}>
                        {item.rank}
                      </Text>
                    )}
                    <VStack space={1}>
                      <Text
                        fontSize="md"
                        fontWeight={item.isCurrentUser ? 'bold' : 'normal'}>
                        {item.phone}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        جایزه: {item.prize} تومان
                      </Text>
                    </VStack>
                  </HStack>
                  <HStack alignItems="center" space={1}>
                    <Text fontSize="sm" color="gray.600">
                      {item.activeMembers}
                    </Text>
                    <MaterialIcons name="person" size={16} color="gray" />
                  </HStack>
                </HStack>
              )}
            />

            {/* Info Modal */}
            <Modal isOpen={showInfo} onClose={() => setShowInfo(false)}>
              <Modal.Content maxWidth="90%" borderRadius="2xl">
                <Modal.Header
                  borderBottomWidth={1}
                  borderColor="gray.200"
                  bg="transparent"
                  _text={{fontWeight: 'bold', fontSize: 'md'}}
                  alignItems="center"
                  justifyContent="center">
                  <HStack justifyContent="space-between" alignItems="center" w="100%">
                    <Modal.CloseButton
                      position="relative"
                      left={0}
                      top={0}
                      _icon={{color: 'black'}}
                    />
                    <Text
                      fontSize="md"
                      fontWeight="bold"
                      textAlign="right"
                      flex={1}
                      color="black">
                      توضیحات جایزه ماهانه
                    </Text>
                  </HStack>
                </Modal.Header>

                <Modal.Body bg="white">
                  <Text
                    fontSize="sm"
                    textAlign="right"
                    lineHeight="lg"
                    color="gray.700">
                    آخر هر ماه، سیستم به‌صورت خودکار و بدون هیچ‌گونه دخالت از طرف آجر
                    یا افراد دیگر، سه نفری را که در طول آن ماه بیشترین تعداد بازاریابی
                    موفق را داشته‌اند شناسایی کرده و جوایزشان را به انتخاب خودشان
                    به‌صورت پول نقد یا آجرک پرداخت می‌کند.
                    {'\n\n'}
                    توجه داشته باشید که در ابتدای هر ماه، این چرخه دوباره راه‌اندازی
                    می‌شود تا همه شانس برنده شدن در ماه جدید را داشته باشند.
                    {'\n\n'}
                    هر ماه جوایز بهتر و ارزشمندتری ارائه می‌شود.
                    {'\n\n'}
                    امیدوارم برنده‌ی این ماه شما باشید! فقط کافی است روی دکمه‌ی اشتراک
                    بزنید و دوستان و آشنایان خود را دعوت کنید تا هم آن‌ها از تمام
                    قابلیت‌های رایگان آجر استفاده کنند و هم شما شانس خود را برای برنده
                    شدن جوایز بیشتر افزایش دهید.
                  </Text>
                </Modal.Body>
              </Modal.Content>
            </Modal>
          </Box>
        </VStack>
      </ScrollView>
    </View>
  );
}

/* ---------------- HELPERS ---------------- */
function TimeCard({value, label}) {
  return (
    <VStack alignItems="center">
      <Center bg="#222" w={70} h={60} borderRadius={8}>
        <Text color="white" fontSize="xl" fontWeight="bold">
          {String(value).padStart(2, '0')}
        </Text>
      </Center>
      <Text mt={1} fontSize="xs" color="gray.600">
        {label}
      </Text>
    </VStack>
  );
}

function getSecondsToMonthEnd() {
  const now = moment();
  const currentJalali = momentJalaali();
  const endOfJalaliMonth = momentJalaali(currentJalali)
    .endOf('jMonth')
    .endOf('day');
  const endGregorian = moment(endOfJalaliMonth.format('YYYY-MM-DD HH:mm:ss'));
  const diff = endGregorian.diff(now, 'seconds');
  return diff > 0 ? diff : 0;
}

function secondsToDHMS(sec) {
  const days = Math.floor(sec / (24 * 3600));
  const hours = Math.floor((sec % (24 * 3600)) / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;
  return {days, hours, minutes, seconds};
}

function maskPhone(phone) {
  if (!phone) return '---';
  return phone.replace(/^(\d{4})\d{3}(\d{4})$/, '$1***$2');
}

function getPrizeByRank(rank) {
  if (rank === 1) return '5,000,000';
  if (rank === 2) return '3,000,000';
  if (rank === 3) return '2,000,000';
  return '0';
}

function getMedalByRank(rank) {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return '🏅';
}