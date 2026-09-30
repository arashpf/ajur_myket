import React from 'react';
import { Box, VStack, HStack, Text, Button, useToast } from 'native-base';
import { Share, Clipboard } from 'react-native';

export default function RefBox({ username, onShareClick, onCopyClick }) {
  const toast = useToast();
  const referralUrl = `https://ajur.app/download?ref=${username}`;

  const handleShare = async () => {
    // If no username, call the parent handler which will show the modal
    if (!username) {
      onShareClick();
      return;
    }

    // Proceed with normal share functionality if username exists
    try {
      await Share.share({
        message: referralUrl,
      });
    } catch (error) {
      console.log('Error sharing referral URL:', error);
    }
  };

  const handleCopy = async () => {
    // If no username, call the parent handler which will show the modal
    if (!username) {
      onCopyClick();
      return;
    }

    // Proceed with normal copy functionality if username exists
    try {
      await Clipboard.setString(referralUrl);
      toast.show({
        title: 'لینک کپی شد!',
        description: 'لینک معرف شما با موفقیت کپی شد.',
        placement: 'top',
        bgColor: 'green.500',
        duration: 2000,
      });
    } catch (error) {
      console.log('Error copying referral URL:', error);
    }
  };

  return (
    <Box bg="black" borderRadius={8} p={4} w="100%" my={3}>
      <VStack space={3} alignItems="center">
        <Text color="white" fontSize="sm" fontWeight="bold" selectable>
          {username ? referralUrl : 'برای اشتراک‌گذاری لینک، ابتدا نام کاربری انتخاب کنید'}
        </Text>
        <HStack space={3} justifyContent="center">
          <Button 
            colorScheme="gray" 
            size="sm" 
            onPress={handleShare}
            _text={{ color: 'white' }}
          >
            اشتراک گذاری
          </Button>
          <Button 
            colorScheme="gray" 
            size="sm" 
            onPress={handleCopy}
            _text={{ color: 'white' }}
          >
            کپی
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}