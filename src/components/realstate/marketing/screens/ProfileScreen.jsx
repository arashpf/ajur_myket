// screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { Alert, RefreshControl } from 'react-native';
import { 
  Box, VStack, Input, Button, Text, Avatar, HStack, Center, Spinner, 
  Modal, ScrollView
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [family, setFamily] = useState('');
  const [phone, setPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [coins, setCoins] = useState(0);
  const [successfulRefs, setSuccessfulRefs] = useState(0);
  const [showCardModal, setShowCardModal] = useState(false);
  const [savingCard, setSavingCard] = useState(false);

  // Fetch user data from the same API used in ReferralScreen
  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('id_token');
      
      if (!token) {
        Alert.alert('خطا', 'لطفاً دوباره وارد شوید');
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const response = await axios.get('https://api.ajur.app/api/ref-section', {
        params: { token }
      });

      const data = response.data;
      const user = data.user;

      // Set user data
      setUserData(user);
      setCoins(Math.floor(data.user_coin || 0)); // Ensure integer
      setSuccessfulRefs(data.successful_refs || 0);
      
      // Update form fields with actual user data
      if (user) {
        setName(user.name || '');
        setFamily(user.family || '');
        setPhone(user.phone ? maskPhone(user.phone) : '');
      }

      // Load saved card data
      const savedCardData = await AsyncStorage.getItem('user_card_data');
      if (savedCardData) {
        const cardData = JSON.parse(savedCardData);
        setCardNumber(cardData.cardNumber || '');
        setBankName(cardData.bankName || '');
        setCardHolderName(cardData.cardHolderName || '');
      }

    } catch (error) {
      console.log('Error fetching user data:', error);
      Alert.alert('خطا', 'در دریافت اطلاعات کاربر مشکلی پیش آمده است');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserData();
  };

  const maskPhone = (phone) => {
    if (!phone) return '---';
    return phone.replace(/^(\d{4})\d{3}(\d{4})$/, '$1***$2');
  };

  const maskCardNumber = (cardNumber) => {
    if (!cardNumber) return '**** **** **** ****';
    const visiblePart = cardNumber.slice(-4);
    return `**** **** **** ${visiblePart}`;
  };

  const handleSaveProfile = async () => {
    try {
      // Here you would typically send updated profile data to your API
      Alert.alert('موفقیت', 'اطلاعات کارت بانکی با موفقیت ذخیره شد');
    } catch (error) {
      Alert.alert('خطا', 'در ذخیره اطلاعات کارت بانکی مشکلی پیش آمده است');
    }
  };

  const handleSaveCard = async () => {
    try {
      setSavingCard(true);

      // Validate card data
      if (!cardNumber || !bankName || !cardHolderName) {
        Alert.alert('خطا', 'لطفاً تمام فیلدهای کارت بانکی را پر کنید');
        return;
      }

      // Basic card number validation (16 digits)
      const cleanCardNumber = cardNumber.replace(/\s/g, '');
      if (cleanCardNumber.length !== 16 || !/^\d+$/.test(cleanCardNumber)) {
        Alert.alert('خطا', 'شماره کارت باید 16 رقمی باشد');
        return;
      }

      const cardData = {
        cardNumber: cleanCardNumber,
        bankName,
        cardHolderName
      };

      // Save to AsyncStorage
      await AsyncStorage.setItem('user_card_data', JSON.stringify(cardData));
      
      setSavingCard(false);
      setShowCardModal(false);
      Alert.alert('موفقیت', 'اطلاعات کارت بانکی با موفقیت ذخیره شد');

    } catch (error) {
      setSavingCard(false);
      Alert.alert('خطا', 'در ذخیره اطلاعات کارت مشکلی پیش آمده است');
    }
  };

  const openCardModal = () => {
    setShowCardModal(true);
  };

  const formatCardNumber = (text) => {
    // Remove all non-digits
    const cleanText = text.replace(/\D/g, '');
    
    // Format as XXXX XXXX XXXX XXXX
    const formatted = cleanText.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    
    // Limit to 16 digits + 3 spaces = 19 characters
    return formatted.slice(0, 19);
  };

  if (loading) {
    return (
      <Box flex={1} p={4} bg="white" justifyContent="center" alignItems="center">
        <VStack space={4} alignItems="center">
          <Spinner size="lg" color="#a92b31" />
          <Text fontSize="md" color="gray.600">در حال دریافت اطلاعات...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <ScrollView 
      flex={1} 
      bg="white"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#a92b31']}
          tintColor="#a92b31"
        />
      }
    >
      <Box flex={1} p={4} bg="white">
        <VStack space={4} alignItems="center">
          <Avatar 
            size="2xl" 
            source={require('../assets/ajurak.png')}
          >
            <Text fontSize="xl" color="white" fontWeight="bold">
              {name ? name.charAt(0) : 'U'}
            </Text>
          </Avatar>
          
          <Text fontSize="lg" fontWeight="bold">
            {name} {family}
          </Text>

          {/* User Stats */}
          <HStack space={4} justifyContent="center" w="100%">
            <Center bg="#f8f9fa" p={3} borderRadius="md" flex={1}>
              <Text fontSize="lg" fontWeight="bold" color="#a92b31">
                {Math.floor(coins).toLocaleString('fa-IR')}
              </Text>
              <Text fontSize="xs" color="gray.600">سکه</Text>
            </Center>
            <Center bg="#f8f9fa" p={3} borderRadius="md" flex={1}>
              <Text fontSize="lg" fontWeight="bold" color="#a92b31">
                {successfulRefs.toLocaleString('fa-IR')}
              </Text>
              <Text fontSize="xs" color="gray.600">معرفی موفق</Text>
            </Center>
          </HStack>

          <VStack w="100%" space={3}>
         
            
            <Input 
              value={phone} 
              onChangeText={setPhone} 
              placeholder="شماره تلفن" 
              keyboardType="phone-pad" 
              textAlign="right"
              isDisabled // Phone might be read-only
            />

            <Text mt={2} fontSize="sm" fontWeight="bold" textAlign="right">
              کارت بانکی (اختیاری)
            </Text>
            
            <Box p={4} bg="#F7F7F9" borderRadius="md">
              <VStack space={2}>
                <HStack justifyContent="space-between" alignItems="center">
                  <VStack flex={1}>
                    <Text fontSize="md" fontWeight="bold" textAlign="right">
                      {cardNumber ? maskCardNumber(cardNumber) : '**** **** **** ****'}
                    </Text>
                    <Text fontSize="xs" color="gray.500" textAlign="right">
                      {bankName || 'بانک'}
                    </Text>
                    {cardHolderName && (
                      <Text fontSize="xs" color="gray.500" textAlign="right">
                        دارنده: {cardHolderName}
                      </Text>
                    )}
                  </VStack>
                  <Button 
                    variant="ghost" 
                    onPress={openCardModal}
                    _text={{ color: '#a92b31', fontSize: 'sm' }}
                  >
                    {cardNumber ? 'ویرایش' : 'افزودن'}
                  </Button>
                </HStack>
                
                {!cardNumber && (
                  <Text fontSize="xs" color="orange.600" textAlign="right" mt={2}>
                    💡 برای نقد کردن آجرک در آینده، نیاز به ثبت کارت بانکی دارید
                  </Text>
                )}
              </VStack>
            </Box>

            <Button 
              mt={2} 
              onPress={handleSaveProfile}
              bg="#a92b31"
              _text={{ color: 'white', fontWeight: 'bold' }}
            >
              ذخیره تغییرات کارت بانکی
            </Button>
          </VStack>

          {/* Card Modal */}
          <Modal isOpen={showCardModal} onClose={() => setShowCardModal(false)} size="lg">
            <Modal.Content>
              <Modal.Header borderBottomWidth={0}>
                <VStack space={2} w="100%">
                  <Text fontSize="lg" fontWeight="bold" textAlign="center">
                    {cardNumber ? 'ویرایش کارت بانکی' : 'ثبت کارت بانکی'}
                  </Text>
                  <Text fontSize="sm" color="gray.600" textAlign="center">
                    این بخش اختیاری است - برای نقد کردن آجرک نیاز است
                  </Text>
                </VStack>
              </Modal.Header>
              <Modal.Body>
                <VStack space={4}>
                  <Box bg="orange.50" p={3} borderRadius="md">
                    <Text fontSize="xs" color="orange.700" textAlign="right" lineHeight={20}>
                      💡 توجه: شماره کارت باید به نام {name} {family} باشد تا در زمان نقد کردن آجرک با مشکل مواجه نشوید.
                    </Text>
                  </Box>

                  <Input
                    value={formatCardNumber(cardNumber)}
                    onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                    placeholder="۶۲۱۹ ۸۶۱۱ ۰۲۳۴ ۵۶۷۸"
                    keyboardType="numeric"
                    textAlign="right"
                    maxLength={19}
                  />
                  
                  <Input
                    value={bankName}
                    onChangeText={setBankName}
                    placeholder="نام بانک (مثال: ملت، ملی، ...)"
                    textAlign="right"
                  />
                  
                  <Input
                    value={cardHolderName}
                    onChangeText={setCardHolderName}
                    placeholder={`نام دارنده کارت (${name} ${family})`}
                    textAlign="right"
                  />
                </VStack>
              </Modal.Body>
              <Modal.Footer borderTopWidth={0}>
                <HStack space={2} flex={1}>
                  <Button 
                    flex={1}
                    variant="outline" 
                    onPress={() => setShowCardModal(false)}
                    _text={{ color: 'gray.600' }}
                  >
                    انصراف
                  </Button>
                  <Button 
                    flex={1}
                    onPress={handleSaveCard}
                    bg="#a92b31"
                    _text={{ color: 'white', fontWeight: 'bold' }}
                    isLoading={savingCard}
                  >
                    {cardNumber ? 'بروزرسانی' : 'ذخیره'}
                  </Button>
                </HStack>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        </VStack>
      </Box>
    </ScrollView>
  );
}