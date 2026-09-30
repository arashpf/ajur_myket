// NewWorker.js - COMPLETE WITH ALL FIXES (CLEANED)
import React, { useState, useRef, useEffect ,useCallback} from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  BackHandler, 
  PermissionsAndroid, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  Keyboard,
  Platform 
} from 'react-native';
import { FormControl, useToast, Box } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import { KeyboardAwareScrollView } from 'react-native-smart-keyboard-view';

import styles from './newworkerparts/styles';
import {
  useCategories,
  useFields,
  usePropertyForm,
  useImageManager,
  useVideoManager,
  useUpload,
  useDraft,
} from './newworkerparts/hooks';
import {
  CategorySelector,
  LocationSelector,
  TitleInput,
  ImageUploader,
  VideoUploader,
  PropertyFields,
  DescriptionInput,
  SubmitButton,
  StepIndicator,
  NextStepButton,
} from './newworkerparts/components';
import {
  CategoryModal,
  ImagePreviewModal,
  AlertModal,
  NoImageAlertModal,
  AddressModal,
  CloseModal,
} from './newworkerparts/modals';

const NewWorker = ({ route, navigation }) => {
  const { mode, propertyId } = route.params || {};
  const toast = useToast();
  const inputRef = useRef(null);
  const [cellphone, setCellphone] = useState('000');
  
  // ============ State برای مدیریت بارگذاری اولیه ============
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  // ============ State برای بارگذاری ویدیو ============
  const [isVideoPreviewLoading, setIsVideoPreviewLoading] = useState(false);
  const [showVideoLoadingOverlay, setShowVideoLoadingOverlay] = useState(false);
  
  const [currentStep, setCurrentStep] = useState(1);
  
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryModalOpened, setCategoryModalOpened] = useState(false);
  
  const [showAlert, setShowAlert] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showNoImageAlert, setShowNoImageAlert] = useState(false);
  const [noImageVerified, setNoImageVerified] = useState(false);
  const [paused, setPaused] = useState(false);
  
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressData, setAddressData] = useState(null);

  const [isImagePickerLoading, setIsImagePickerLoading] = useState(false);

  const isFocused = useIsFocused();

  const { allCategories, selectedCategory, loadingCategories, catId, selectCategory } = useCategories();
  const { normalFields, predefineFields, tickFields, loadingFields } = useFields(catId);
  const { 
    properties, 
    title, 
    setTitle, 
    description, 
    setDescription, 
    note, 
    setNote, 
    addProperty, 
    removeProperty, 
    updateProperty,
    upsertProperty, 
  } = usePropertyForm();
  
  const { 
    images, 
    selectedImage, 
    isImageModalVisible, 
    addImages, 
    deleteImage, 
    setMainImage, 
    openImagePreview, 
    closeImagePreview,
    updateImage,
    updateImageStatus,
  } = useImageManager();
  
  const { 
    videos, 
    getDisplayVideos,
    selectedVideo, 
    videoModalVisible, 
    selectedVideoUri,
    showTrimmer,
    setShowTrimmer,
    setSelectedVideoUri,
    addVideo, 
    deleteVideo, 
    openVideoPreview, 
    closeVideoPreview,
    handleVideoSelected,
    handleTrimmedAndCompressed,
    closeTrimmer,
    closeTrimmer2,
    isCompressing,
    compressingVideoUri,
    startCompressing,
    endCompressing,
    updateVideoStatus,
    markVideoError,
  } = useVideoManager();
  
  const { beginUpload, uploadProgress, startUpload, updateProgress, finishUpload } = useUpload();

  const {
    draftId,
    draftData,
    isLoadingDraft,
    isExistingDraft,
    isEditMode,
    isVideoUploading,
    uploadProgress: videoUploadProgress,
    currentUploadVideoUri,
    loadOrCreateDraft,
    updateDraftData,
    uploadImage,
    uploadVideo,
    deleteImage: deleteImageFromDraftAPI,
    deleteVideo: deleteVideoFromDraftAPI,
    cancelUpload,
    finalize,
    deleteDraftData,
    changeMainImage,
  } = useDraft({ mode, propertyId, categoryId: catId, navigation });

  // ==================== توابع فشرده‌سازی ====================
  const handleCompressionStart = () => {
    startCompressing();
  };
  
  const handleCompressionEnd = () => {
    endCompressing();
  };

  // ============ Debug: Log image status changes ============
  useEffect(() => {
    console.log('📊 Images state changed:', images.length);
    images.forEach((img, index) => {
      console.log(`  Image ${index}: status=${img.uploadStatus || 'unknown'}, id=${img.id || 'no-id'}`);
    });
  }, [images]);

  // ============ بررسی وضعیت اینترنت ============
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        toast.show({
          render: () => (
            <Box bg="orange.700" px="15" py="3" rounded="md" mb={5}>
              <Text style={{ color: 'white', fontSize: 16 }}>
                ⚠️ اتصال اینترنت شما قطع است
              </Text>
            </Box>
          ),
        });
        
        if (isVideoUploading) {
          cancelUpload();
          Alert.alert(
            '⚠️ آپلود لغو شد',
            'اتصال اینترنت قطع شد. آپلود ویدیو لغو شد.',
            [{ text: 'OK' }]
          );
        }
      }
    });

    return () => unsubscribe();
  }, [isVideoUploading]);

  // ==================== deleteImageFromDraft - FIXED ====================
  const deleteImageFromDraft = useCallback(async (imageToDelete) => {
    if (!draftId || !imageToDelete) return;
    
    console.log('🗑️ Deleting image:', imageToDelete);
    console.log('📊 Image ID:', imageToDelete.id);
    console.log('📊 Image URI:', imageToDelete.uri);
    
    try {
      // ============ 1. Delete from server if it has an ID ============
      if (imageToDelete.id) {
        console.log('📤 Deleting from server, ID:', imageToDelete.id);
        await deleteImageFromDraftAPI(imageToDelete.id);
        console.log('✅ Image deleted from server:', imageToDelete.id);
      } else {
        console.log('⚠️ Image has no ID, only removing from local state');
      }
      
      // ============ 2. Remove from local display (images state) ============
      deleteImage(imageToDelete);
      console.log('✅ Image removed from local display');
      
      // ============ 3. Update draft data on server ============
      if (draftData) {
        const currentImages = draftData.images || [];
        console.log('📊 Current images in draft:', currentImages.length);
        
        const updatedImages = currentImages.filter(img => 
          img.uri !== imageToDelete.uri && 
          img.id !== imageToDelete.id
        );
        
        console.log('📊 Updated images count:', updatedImages.length);
        
        // ✅ REMOVED: setDraftData(prev => ({ ...prev, images: updatedImages }));
        // We just update via API, and draftData will be refreshed automatically
        
        await updateDraftData({ images: updatedImages });
        console.log('✅ Draft updated on server');
      } else {
        console.log('⚠️ No draftData available, skipping server update');
      }
      
      toast.show({
        render: () => (
          <Box bg="green.500" px="15" py="3" rounded="md" mb={5}>
            <Text style={{ color: 'white', fontSize: 16 }}>
              عکس با موفقیت حذف شد
            </Text>
          </Box>
        ),
      });
      
    } catch (error) {
      console.error('❌ Error deleting image:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      
      toast.show({
        render: () => (
          <Box bg="red.700" px="15" py="3" rounded="md" mb={5}>
            <Text style={{ color: 'white', fontSize: 16 }}>
              خطا در حذف عکس: {error.message || 'خطای ناشناخته'}
            </Text>
          </Box>
        ),
      });
    }
  }, [draftId, draftData, deleteImage, deleteImageFromDraftAPI, updateDraftData]);

  // ============ تابع لغو آپلود با پیام ============
  const handleCancelUpload = () => {
    Alert.alert(
      '⚠️ لغو آپلود',
      'آیا مطمئن هستید می‌خواهید آپلود ویدیو را لغو کنید؟',
      [
        { text: 'خیر', style: 'cancel' },
        { 
          text: 'بله، لغو کن', 
          style: 'destructive',
          onPress: () => {
            cancelUpload();
            toast.show({
              render: () => (
                <Box bg="orange.700" px="15" py="3" rounded="md" mb={5}>
                  <Text style={{ color: 'white', fontSize: 16 }}>
                    آپلود ویدیو لغو شد
                  </Text>
                </Box>
              ),
            });
          }
        }
      ]
    );
  };

    // ============ force start from step 1 in edit mode ============


  // ============ useEffect برای بارگذاری اولیه ============
  useEffect(() => {
    const initializeApp = async () => {
      console.log('🔄 Starting initial loading...');
      setIsInitialLoading(true);
      
      try {
        const phone = await AsyncStorage.getItem('cellphone');
        setCellphone(phone || '000');
        
        const formData = {
          title: '',
          description: '',
          note: '',
          properties: [],
        };
        await loadOrCreateDraft(formData);
        
        setIsDataLoaded(true);
        console.log('✅ Initial loading complete');
      } catch (error) {
        console.error('❌ Error during initialization:', error);
        toast.show({
          render: () => (
            <Box bg="red.700" px="15" py="3" rounded="md" mb={5}>
              <Text style={{ color: 'white', fontSize: 16 }}>
                خطا در بارگذاری اطلاعات
              </Text>
            </Box>
          ),
        });
      } finally {
        setIsInitialLoading(false);
      }
    };
    
    initializeApp();
  }, []);

  // ============ پر کردن فرم با داده‌های Draft ============
  useEffect(() => {
    if (draftData && isExistingDraft && isDataLoaded) {
      console.log('📝 Filling form with draft data...');
      
      if (draftData.name) setTitle(draftData.name);
      if (draftData.description) setDescription(draftData.description);
      if (draftData.note) setNote(draftData.note);
      
      if (draftData.json_properties) {
        try {
          const parsedProps = JSON.parse(draftData.json_properties);
          parsedProps.forEach(prop => {
            upsertProperty(prop);
          });
        } catch (e) {
          console.log('Error parsing draft properties:', e);
        }
      }
      
      if (draftData.images && draftData.images.length > 0) {
        draftData.images.forEach(img => {
          let imageUrl = img.url;
          if (!imageUrl || !imageUrl.startsWith('http')) {
            imageUrl = `https://api.ajur.app/public/workers/images/${img.filepath}`;
          }
          addImages([{ 
            uri: imageUrl, 
            mime: 'image/jpeg', 
            id: img.id,
            uploadStatus: 'uploaded'
          }]);
        });
      }
      
      if (draftData.videos && draftData.videos.length > 0) {
        draftData.videos.forEach(video => {
          const videoUrl = video.url || `https://api.ajur.app/public/workers/videos/${video.filepath}`;
          addVideo({ 
            uri: videoUrl,
            thumbnail: video.thumbnail || null,
            mime: 'video/mp4', 
            id: video.id,
            isFromDraft: true,
            duration: video.duration || '00:00',
            error: false,
            uploadStatus: 'uploaded',
          });
        });
      }
      
      if (draftData.address) {
        let addressData = draftData.address;
        if (typeof addressData === 'string') {
          try {
            addressData = JSON.parse(addressData);
          } catch (e) {
            console.log('Error parsing address:', e);
          }
        }
        if (addressData && typeof addressData === 'object') {
          setAddressData(addressData);
        }
      }
    }
  }, [draftData, isExistingDraft, isDataLoaded]);

  // ============ انتخاب دسته‌بندی از Draft ============
  useEffect(() => {
    if (draftData && isExistingDraft && allCategories.length > 0 && draftData.category_id && isDataLoaded) {
      const categoryId = Number(draftData.category_id);
      const cat = allCategories.find(c => c.id === categoryId);
      if (cat) {
        selectCategory(cat);
      }
    }
  }, [draftData, isExistingDraft, allCategories, isDataLoaded]);

  // ============ ذخیره خودکار Draft ============
  useEffect(() => {
    const saveDraft = async () => {
      if (draftId && !isEditMode && isDataLoaded) {
        await updateDraftData({
          title,
          description,
          note,
          properties,
          category_id: catId,
        });
      }
    };
    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [title, description, note, properties, catId, draftId, isDataLoaded]);

  useEffect(() => {
    if (isFocused) {
      try {
        const parent = navigation.getParent();
        if (parent) {
          parent.setOptions({
            tabBarStyle: { display: 'none', height: 0 },
            tabBarVisible: false,
          });
        }
        const grandParent = navigation.getParent()?.getParent();
        if (grandParent) {
          grandParent.setOptions({
            tabBarStyle: { display: 'none', height: 0 },
            tabBarVisible: false,
          });
        }
      } catch (e) {
        console.log('Error hiding tab bar:', e);
      }
    }
    return () => {
      try {
        const parent = navigation.getParent();
        if (parent) {
          parent.setOptions({ tabBarStyle: { display: 'flex', height: undefined }, tabBarVisible: true });
          const gp = navigation.getParent()?.getParent();
          if (gp) gp.setOptions({ tabBarStyle: { display: 'flex', height: undefined }, tabBarVisible: true });
        }
      } catch (e) {
        console.log('Error showing tab bar:', e);
      }
    };
  }, [isFocused, navigation]);

  useEffect(() => {
    AsyncStorage.getItem('cellphone').then(phone => setCellphone(phone));
  }, []);

  useEffect(() => {
    if (currentStep === 2 && !selectedCategory && !categoryModalOpened && !loadingCategories) {
      setCategoryModalOpened(true);
      setShowCategoryModal(true);
    }
  }, [currentStep, selectedCategory, loadingCategories, categoryModalOpened]);

  useEffect(() => {
    if (noImageVerified) {
      handleSubmit();
    }
  }, [noImageVerified]);

  // useEffect(() => {
  //   const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
  //     // If edit mode, just go back without any dialog
  //     if (isEditMode) {
  //       navigation.goBack();
  //       return true;
  //     }
      
  //     // If draft mode (new property or draft), show the close modal
  //     if (!isEditMode) {
  //       setShowCloseModal(true);
  //       return true;
  //     }
      
  //     // Default: don't handle back press (let system handle it)
  //     return false;
  //   });
  
  //   return () => backHandler.remove();
  // }, [isEditMode, navigation]);

// ============ BackHandler with proper cleanup and focus management ============
useEffect(() => {
  let backHandler = null;
  
  // Only add the back handler when the screen is focused
  if (isFocused) {
    backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // If edit mode, just go back without any dialog
      if (isEditMode) {
        navigation.goBack();
        return true;
      }
      
      // If draft mode (new property or draft), show the close modal
      if (!isEditMode) {
        setShowCloseModal(true);
        return true;
      }
      
      // Default: don't handle back press (let system handle it)
      return false;
    });
  }

  // Clean up the event listener when component unmounts or loses focus
  return () => {
    if (backHandler) {
      backHandler.remove();
    }
  };
}, [isFocused, isEditMode, navigation]);





  // ==================== توابع ====================
  const requestCameraPermission = async () => {
    try {
      const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
      if (hasPermission) return true;
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera to take photos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return status === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      return false;
    }
  };

  // ==================== pickImages - CLEANED ====================
  const pickImages = () => {
    if (isImagePickerLoading) {
      console.log('⏳ Image picker is loading, please wait...');
      return;
    }

    Keyboard.dismiss();
    setIsImagePickerLoading(true);

    setTimeout(() => {
      console.log('📸 Opening image picker...');
      
      ImagePicker.openPicker({
        multiple: true,
        mediaType: 'photo',
        compressImageMaxWidth: 1080,
        compressImageMaxHeight: 1080,
        compressImageQuality: 0.8,
        forceJpg: true,
        includeExif: false,
        waitAnimationEnd: false,
        cropping: false,
        showsSelectedCount: true,
      })
      .then(async (selectedImages) => {
        setIsImagePickerLoading(false);
        console.log('✅ Images selected:', selectedImages.length);
        
        if (!selectedImages || selectedImages.length === 0) {
          console.log('⚠️ No images selected');
          return;
        }
        
        const processedImages = selectedImages.map((img) => ({
          uri: img.path,
          width: img.width,
          height: img.height,
          mime: img.mime || 'image/jpeg',
          uploadStatus: 'uploading',
        }));

        addImages(processedImages);
        console.log('📊 Images added with status: uploading');

        for (let i = 0; i < processedImages.length; i++) {
          const img = processedImages[i];
          console.log(`📤 Uploading image ${i + 1}/${processedImages.length}`);
          
          try {
            const result = await uploadImage(img.uri, img.mime);
            console.log('📤 Upload result:', result ? 'success' : 'null');
            
            let success = false;
            let imageData = null;
            
            if (result && result.image && result.image.id) {
              success = true;
              imageData = result.image;
              console.log('✅ Found image data in result.image');
            } else if (result && result.images && result.images.length > 0) {
              success = true;
              const lastImage = result.images[result.images.length - 1];
              imageData = {
                id: lastImage.id,
                url: `https://api.ajur.app/public/workers/images/${lastImage.filepath}`,
                filepath: lastImage.filepath,
              };
              console.log('✅ Found image data in result.images');
            } else if (result && result.id && result.filepath) {
              success = true;
              imageData = result;
              console.log('✅ Found image data directly in result');
            } else if (result && result.status === 200) {
              success = true;
              imageData = {
                id: Date.now(),
                url: img.uri,
                filepath: `uploaded_${Date.now()}`,
              };
              console.log('⚠️ Status 200 but no image data, using fallback');
            }
            
            if (success && imageData) {
              updateImage(img.uri, {
                id: imageData.id,
                url: imageData.url || img.uri,
                filepath: imageData.filepath || `local/${Date.now()}`,
                uploadStatus: 'uploaded',
              });
              console.log('✅ Image uploaded successfully with ID:', imageData.id);
              // showToast(`عکس ${i + 1} با موفقیت آپلود شد`, 'success');
            } else {
              console.warn('⚠️ Upload failed - no image data in response');
              updateImageStatus(img.uri, 'error');
              showToast('خطا در آپلود عکس: پاسخ نامعتبر', 'error');
            }
            
          } catch (error) {
            console.error('❌ Error uploading image:', error);
            updateImageStatus(img.uri, 'error');
            
            let errorMessage = 'خطا در آپلود عکس';
            if (error.message) {
              if (error.message.includes('Network')) {
                errorMessage = 'اتصال اینترنت خود را بررسی کنید';
              } else if (error.message.includes('timeout')) {
                errorMessage = 'زمان آپلود به پایان رسید';
              } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
              } else {
                errorMessage = error.message;
              }
            }
            showToast(errorMessage, 'error');
          }
        }
        
        console.log('✅ All images processed');
      })
      .catch(error => {
        console.log('❌ Error picking images:', error);
        setIsImagePickerLoading(false);
        
        if (error.message !== 'User cancelled image selection') {
          showToast('خطا در انتخاب عکس: ' + (error.message || 'خطای ناشناخته'), 'error');
        }
      })
      .finally(() => {
        setIsImagePickerLoading(false);
        console.log('✅ Image picker closed');
      });
    }, 200);
  };

  // ==================== Retry Image Upload ====================
  const retryImageUpload = useCallback(async (image) => {
    if (!image) {
      console.log('⚠️ No image provided for retry');
      return;
    }
    
    console.log('🔄 Retrying image upload:', image.uri);
    updateImageStatus(image.uri, 'uploading');
    
    try {
      const result = await uploadImage(image.uri, image.mime || 'image/jpeg');
      console.log('📤 Retry result:', result ? 'success' : 'null');
      
      if (result && result.image) {
        updateImage(image.uri, {
          id: result.image.id,
          url: result.image.url,
          filepath: result.image.filepath,
          uploadStatus: 'uploaded',
        });
        console.log('✅ Image retry successful');
        // showToast('عکس با موفقیت آپلود شد', 'success');
      } else {
        throw new Error('Upload returned no result');
      }
    } catch (error) {
      console.error('❌ Image retry failed:', error);
      updateImageStatus(image.uri, 'error');
      
      let errorMessage = 'خطا در آپلود مجدد';
      if (error.message?.includes('Network')) {
        errorMessage = 'اتصال اینترنت خود را بررسی کنید';
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'زمان آپلود به پایان رسید';
      } else {
        errorMessage = error.message || 'خطای ناشناخته';
      }
      showToast(errorMessage, 'error');
    }
  }, [uploadImage, updateImage, updateImageStatus]);

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;
    try {
      const image = await ImagePicker.openCamera({
        width: 1080,
        height: 1080,
        cropping: false,
        includeBase64: false,
        compressImageQuality: 0.8,
      });
      const processedImage = {
        uri: image.path,
        width: image.width,
        height: image.height,
        mime: image.mime || 'image/jpeg',
        uploadStatus: 'uploading',
      };
      addImages([processedImage]);

      try {
        const result = await uploadImage(processedImage.uri, processedImage.mime);
        if (result && result.image) {
          updateImage(processedImage.uri, {
            id: result.image.id,
            url: result.image.url,
            filepath: result.image.filepath,
            uploadStatus: 'uploaded',
          });
        }
      } catch (error) {
        console.error('❌ Error uploading image:', error);
        updateImageStatus(processedImage.uri, 'error');
        showToast('خطا در آپلود عکس', 'error');
      }
    } catch (error) {
      if (error.message !== 'User cancelled image selection') {
        console.log('Error opening camera:', error);
      }
    }
  };

  // Helper function for showing toasts
  const showToast = (message, type = 'info') => {
    const bgColor = type === 'success' ? 'green.500' : type === 'error' ? 'red.500' : 'orange.500';
    toast.show({
      render: () => (
        <Box bg={bgColor} px="15" py="3" rounded="md" mb={5}>
          <Text style={{ color: 'white', fontSize: 16 }}>{message}</Text>
        </Box>
      ),
    });
  };

  // ============ Set Main Image ============
// ============ Set Main Image - COMPLETE ============
// ============ Set Main Image - COMPLETE ============
// ============ Set Main Image - FIXED ============
// ============ Set Main Image - FIXED ============
// ============ Set Main Image - FIXED ============
const handleSetMainImage = useCallback(async (image) => {
  if (!image) return;
  
  console.log('🔄 Setting main image:', image.id || image.uri);
  
  // If image has an ID, call the API to change main image on server
  if (image.id && draftId) {
    try {
      // Show loading indicator
      toast.show({
        render: () => (
          <Box bg="blue.500" px="15" py="3" rounded="md" mb={5}>
            <Text style={{ color: 'white', fontSize: 16 }}>
              در حال تغییر عکس اصلی...
            </Text>
          </Box>
        ),
      });
      
      // Call API to change main image
      await changeMainImage(image.id);
      console.log('✅ Main image changed on server:', image.id);
      
      // Update local UI - move image to front
      setMainImage(image);
      
      // toast.show({
      //   render: () => (
      //     <Box bg="green.500" px="15" py="3" rounded="md" mb={5}>
      //       <Text style={{ color: 'white', fontSize: 16 }}>
      //         عکس اصلی با موفقیت تغییر کرد
      //       </Text>
      //     </Box>
      //   ),
      // });
      
    } catch (error) {
      console.error('❌ Error changing main image:', error);
      toast.show({
        render: () => (
          <Box bg="red.700" px="15" py="3" rounded="md" mb={5}>
            <Text style={{ color: 'white', fontSize: 16 }}>
              خطا در تغییر عکس اصلی: {error.message || 'خطای ناشناخته'}
            </Text>
          </Box>
        ),
      });
    }
  } else {
    // If no ID (newly uploaded image without ID), just update UI
    console.log('⚠️ Image has no ID, updating UI only');
    setMainImage(image);
  }
}, [draftId, changeMainImage, setMainImage]);

  // ============ pickVideos - FIXED ============
  const pickVideos = () => {
    if (isVideoPreviewLoading || showVideoLoadingOverlay) {
      console.log('⏳ Video is loading, please wait...');
      return;
    }

    console.log('📹 pickVideos called');
    
    setShowVideoLoadingOverlay(true);
    setIsVideoPreviewLoading(true);

    ImagePicker.openPicker({ mediaType: 'video' })
      .then(async (video) => {
        console.log('Video picked:', video);
        
        setShowVideoLoadingOverlay(false);
        setShowTrimmer(true);
        setSelectedVideoUri(video.path);
        
        let fileSize = 0;
        let fileSizeMB = 0;
        
        try {
          const response = await fetch(video.path);
          const blob = await response.blob();
          fileSize = blob.size;
          fileSizeMB = (fileSize / 1024 / 1024).toFixed(2);

          const newVideo = {
            uri: video.path,
            mime: video.mime || 'video/mp4',
            width: video.width || 1080,
            height: video.height || 1080,
            size: fileSize,
          };
          handleVideoSelected(newVideo);
          
          console.log(`📊 File size: ${fileSizeMB} MB (${fileSize} bytes)`);
          
        } catch (error) {
          console.log('Could not get file size:', error);
          const newVideo = {
            uri: video.path,
            mime: video.mime || 'video/mp4',
            width: video.width || 1080,
            height: video.height || 1080,
          };
          handleVideoSelected(newVideo);
        }
        
      })
      .catch(error => {
        console.log('Error picking video:', error);
        
        setShowVideoLoadingOverlay(false);
        setShowTrimmer(false);
        setIsVideoPreviewLoading(false);
        
        let errorMessage = 'خطای ناشناخته';
        if (typeof error === 'string') errorMessage = error;
        else if (error && typeof error === 'object') errorMessage = error.message || error.toString() || 'خطای ناشناخته';
        
        if (errorMessage !== 'User cancelled image selection') {
          showToast('خطا در انتخاب ویدیو: ' + errorMessage, 'error');
        }
      })
      .finally(() => {
        setIsVideoPreviewLoading(false);
        setShowVideoLoadingOverlay(false);
        console.log('✅ Video picker unlocked');
      });
  };

  // ============ Handle Video Upload ============
  const handleUploadVideo = useCallback(async (videoUri, mimeType) => {
    console.log('📤 Starting video upload:', videoUri);
    
    try {
      updateVideoStatus(videoUri, 'uploading');
      
      const result = await uploadVideo(videoUri, mimeType);
      
      if (result) {
        console.log('✅ Video uploaded successfully');
        updateVideoStatus(videoUri, 'uploaded');
      } else {
        throw new Error('Upload returned no result');
      }
    } catch (error) {
      console.error('❌ Video upload failed:', error);
      markVideoError(videoUri);
    }
  }, [uploadVideo, updateVideoStatus, markVideoError]);

  // ============ Retry Video Upload ============
  const retryVideoUpload = useCallback(async (video) => {
    if (!video) return;
    console.log('🔄 Retrying video upload:', video.uri);
    await handleUploadVideo(video.uri, video.mime);
  }, [handleUploadVideo]);

  const handleSelectCategory = (category) => {
    selectCategory(category);
    setCategoryModalOpened(true);
    setShowCategoryModal(false);
    if (draftId) {
      updateDraftData({ category_id: category.id });
    }
  };

  const handleAddressConfirm = (address) => {
    setAddressData(address);
    setShowAddressModal(false);
    if (draftId) {
      updateDraftData({ address: address })
        .then(() => console.log('✅ Address saved to draft'))
        .catch((error) => console.error('❌ Error saving address:', error));
    }
  };

  // const handleClose = () => {
  //   setShowCloseModal(true);
  // };

  const handleClose = () => {
    // اگر حالت ادیت هست، مستقیم برو بیرون بدون پرسش
    if (isEditMode) {
      navigation.goBack();
      return;
    }
    // در غیر این صورت (حالت جدید یا پیش‌نویس) مودال نمایش داده شود
    setShowCloseModal(true);
  };

  const handleCloseSave = async () => {
    setShowCloseModal(false);
    if (draftId) {
      await updateDraftData({
        title,
        description,
        note,
        properties,
        category_id: catId,
        address: addressData,
      });
    }
    navigation.goBack();
  };

  const handleCloseDelete = async () => {
    setShowCloseModal(false);
    if (draftId) {
      await deleteDraftData();
    }
    navigation.goBack();
  };

  const handleCloseCancel = () => {
    setShowCloseModal(false);
  };

  const handleBackConfirm = () => {
    setShowAlert(false);
    navigation.goBack();
  };

  const handleNoImageConfirm = () => {
    setShowNoImageAlert(false);
    setNoImageVerified(true);
  };

  const goToStep2 = () => {
    if (images.length === 0) {
      showToast('لطفا حداقل یک عکس انتخاب کنید', 'warning');
      return;
    }
    if (!title || title.length < 3) {
      showToast('عنوان باید حداقل ۳ حرف باشد', 'warning');
      return;
    }
    if (!description || description.length < 10) {
      showToast('لطفا توضیحات کامل‌تری وارد کنید (حداقل ۱۰ حرف)', 'warning');
      return;
    }
    setCurrentStep(2);
  };

  const goToStep1 = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async () => {
    if (!selectedCategory) {
      setShowCategoryModal(true);
      showToast('لطفا دسته بندی را انتخاب کنید', 'warning');
      return;
    }

    if (!addressData) {
      showToast('لطفا موقعیت ملک را انتخاب کنید', 'warning');
      return;
    }

    if (isVideoUploading || isCompressing) {
      showToast(
        isCompressing ? 'لطفا تا پایان فشرده‌سازی ویدیو صبر کنید' : 'لطفا تا پایان آپلود ویدیو صبر کنید',
        'warning'
      );
      return;
    }

    if (!normalFields || normalFields.length === 0) {
      showToast('لطفا ابتدا دسته بندی را انتخاب کنید تا فیلدها بارگذاری شوند', 'warning');
      return;
    }

    const requiredFields = normalFields.filter(f => f.special === '1');
    const missingRequired = requiredFields.filter(f => !properties.some(p => p.name === f.value && p.value && p.value !== ''));
    if (missingRequired.length > 0) {
      const missingNames = missingRequired.map(f => f.value).join('، ');
      showToast(`لطفا فیلدهای ستاره دار را پر کنید: ${missingNames}`, 'warning');
      return;
    }

    const requiredTickFields = tickFields.filter(f => f.special === "1");
    const missingTickFields = requiredTickFields.filter(f => !properties.some(p => p.name === f.value && (p.value === 1 || p.value === 0)));
    if (missingTickFields.length > 0) {
      const missingNames = missingTickFields.map(f => f.value).join('، ');
      showToast(`لطفا وضعیت موارد زیر را مشخص کنید: ${missingNames}`, 'warning');
      return;
    }

    if (draftId) {
      try {
        await updateDraftData({ title, description, note, properties, category_id: catId, address: addressData });
      } catch (error) {
        showToast('خطا در ذخیره پیش‌نویس', 'error');
        return;
      }
    } else {
      showToast('خطا: شناسه پیش‌نویس یافت نشد', 'error');
      return;
    }

    await submitPropertyWithAddress(addressData);
  };

  // const submitPropertyWithAddress = async (address) => {
  //   try {
  //     startUpload();
  //     const token = await AsyncStorage.getItem('id_token');
      
  //     // ============ IF DRAFT EXISTS ============
  //     if (draftId) {
  //       // Make sure the order is saved before finalizing
  //       const sortedImages = [...images].sort((a, b) => (a.order || 0) - (b.order || 0));
        
  //       // Update draft with correct order
  //       await updateDraftData({ 
  //         images: sortedImages.map((img, index) => ({
  //           ...img,
  //           order: index
  //         }))
  //       });
        
  //       const finalized = await finalize({ 
  //         category_id: catId, 
  //         title, 
  //         description, 
  //         note, 
  //         properties, 
  //         phone: cellphone 
  //       });
  //       const workerId = finalized?.id || draftId;
  //       await submitLocation(token, workerId, address);
  //       finishUpload();
  //       navigation.navigate('SingleUpgrade', { worker_id: workerId });
  //       return;
  //     }
  
  //     // ============ NEW PROPERTY ============
  //     const formData = new FormData();
      
  //     // ============ FIX: Sort images by order ============
  //     const sortedImages = [...images].sort((a, b) => (a.order || 0) - (b.order || 0));
  //     console.log('📊 Images sorted by order:', sortedImages.map((img, i) => `Image ${i}: order=${img.order}`));
      
  //     sortedImages.forEach((img, index) => {
  //       const imageUri = img.uri || img.url;
  //       if (imageUri) {
  //         formData.append('upload[]', { 
  //           uri: imageUri, 
  //           name: `image_${Date.now()}_${index}.jpg`, 
  //           type: img.mime || 'image/jpeg' 
  //         });
  //       }
  //     });
  
  //     if (videos.length > 0) {
  //       videos.forEach((video, index) => {
  //         formData.append('videos[]', { 
  //           uri: video.uri, 
  //           name: `video_${Date.now()}_${index}.mp4`, 
  //           type: video.mime || 'video/mp4' 
  //         });
  //       });
  //     } else {
  //       formData.append('videos[]', null);
  //     }
  
  //     const response = await axios.post('https://api.ajur.app/api/post-model-with-images', formData, {
  //       params: {
  //         token,
  //         category_id: catId,
  //         phone: cellphone,
  //         title,
  //         description,
  //         note,
  //         properties: JSON.stringify(properties),
  //       },
  //       onUploadProgress: (progressEvent) => {
  //         const progress = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
  //         updateProgress(progress);
  //       },
  //     });
  
  //     const workerId = response.data.worker.id;
  //     await submitLocation(token, workerId, address);
  //     finishUpload();
  //     navigation.navigate('SingleUpgrade', { worker_id: workerId });
      
  //   } catch (error) {
  //     finishUpload();
  //     console.error('❌ Submit error:', error);
  //     showToast(error.response?.data?.message || 'خطا در ارسال اطلاعات', 'error');
  //   }
  // };


  const submitPropertyWithAddress = async (address) => {
    try {
      startUpload();
      const token = await AsyncStorage.getItem('id_token');
      
      // ============ FIX: ENSURE ALL IMAGES HAVE ORDER PROPERTY ============
      const imagesWithOrder = images.map((img, index) => ({
        ...img,
        order: img.order !== undefined ? img.order : index
      }));
      
      // Sort by order
      const sortedImages = [...imagesWithOrder].sort((a, b) => (a.order || 0) - (b.order || 0));
      console.log('📊 Images sorted for submission:', sortedImages.map((img, i) => `Image ${i}: order=${img.order}, uri=${img.uri}`));
      
      if (draftId) {
        // Update draft with correct order before finalizing
        const reorderedImages = sortedImages.map((img, index) => ({
          ...img,
          order: index
        }));
        
        await updateDraftData({ images: reorderedImages });
        
        const finalized = await finalize({ 
          category_id: catId, 
          title, 
          description, 
          note, 
          properties, 
          phone: cellphone 
        });
        const workerId = finalized?.id || draftId;
        await submitLocation(token, workerId, address);
        finishUpload();

        navigation.reset({
          index: 2,  // ← Active route is at index 2 (SingleUpgrade)
          routes: [
            { name: "Base" },
            { name: "Dashboard" },
            { 
              name: 'SingleUpgrade', 
              params: { worker_id: workerId } 
            }
          ],
        });

        // navigation.navigate('SingleUpgrade', { worker_id: workerId });
        return;
      }
  
      const formData = new FormData();
      
      // ============ SEND SORTED IMAGES ============
      sortedImages.forEach((img, index) => {
        const imageUri = img.uri || img.url;
        if (imageUri) {
          formData.append('upload[]', { 
            uri: imageUri, 
            name: `image_${Date.now()}_${index}.jpg`, 
            type: img.mime || 'image/jpeg' 
          });
        }
      });
  
      if (videos.length > 0) {
        videos.forEach((video, index) => {
          formData.append('videos[]', { 
            uri: video.uri, 
            name: `video_${Date.now()}_${index}.mp4`, 
            type: video.mime || 'video/mp4' 
          });
        });
      } else {
        formData.append('videos[]', null);
      }
  
      const response = await axios.post('https://api.ajur.app/api/post-model-with-images', formData, {
        params: {
          token,
          category_id: catId,
          phone: cellphone,
          title,
          description,
          note,
          properties: JSON.stringify(properties),
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
          updateProgress(progress);
        },
      });
  
      const workerId = response.data.worker.id;
      await submitLocation(token, workerId, address);
      finishUpload();
      navigation.navigate('SingleUpgrade', { worker_id: workerId });
      
    } catch (error) {
      finishUpload();
      console.error('❌ Submit error:', error);
      showToast(error.response?.data?.message || 'خطا در ارسال اطلاعات', 'error');
    }
  };

  const submitLocation = async (token, workerId, address) => {
    try {
      const response = await axios({
        method: 'post',
        url: 'https://api.ajur.app/api/post-model-location',
        timeout: 1000 * 35,
        params: {
          token,
          lat: 35.6995,
          long: 51.3379,
          worker_id: workerId,
          region: address.region || '',
          neighbourhood: address.neighbourhood,
          city: address.city,
          municipality_zone: address.municipality_zone || '',
          state: address.state || '',
          formatted: address.formatted
        },
      });

      if (response.data.status == "200") {
        // showToast('آگهی شما با موفقیت ثبت شد', 'success');

        if (isEditMode) {
          showToast('ملک شما با موفقیت ویرایش شد', 'success');
        } else {
          showToast('ملک شما با موفقیت ثبت شد', 'success');
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const formatCategoryName = (name) => {
    if (!name) return '';
    return name.replace(/خرید/g, 'فروش');
  };

  const formatLocationDisplay = (address) => {
    if (!address) return null;
    return { city: address.city, neighbourhood: address.neighbourhood, formatted: address.formatted };
  };

  const numToPersianForField = (num) => {
    if (!num || num === '') return '';
    const number = Number(num);
    if (isNaN(number) || number === 0) return '';
    
    const persianNumbers = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
    const tens = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
    const teens = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
    const hundreds = ['', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
    const units = ['', 'هزار', 'میلیون', 'میلیارد'];

    const splitNumber = (number) => {
      let result = [];
      while (number > 0) {
        result.push(number % 1000);
        number = Math.floor(number / 1000);
      }
      return result;
    };

    const threeDigitToWords = (number) => {
      let result = [];
      const hundredPart = Math.floor(number / 100);
      const remainder = number % 100;

      if (hundredPart > 0) result.push(hundreds[hundredPart]);
      if (remainder >= 10 && remainder < 20) {
        result.push(teens[remainder - 10]);
      } else {
        const tenPart = Math.floor(remainder / 10);
        const unitPart = remainder % 10;
        if (tenPart > 0) result.push(tens[tenPart]);
        if (unitPart > 0) result.push(persianNumbers[unitPart]);
      }
      return result.join(' و ');
    };

    const groups = splitNumber(number);
    let words = [];
    groups.forEach((group, index) => {
      if (group > 0) {
        const groupWord = threeDigitToWords(group);
        const unit = units[index];
        words.unshift(unit ? `${groupWord} ${unit}` : groupWord);
      }
    });
    return words.join(' و ').trim();
  };

  // ============================================================
  // ============ RETURN ============
  // ============================================================

  if (isInitialLoading || isLoadingDraft || !isDataLoaded) {
    return (
      <View style={styles.fullLoadingContainer}>
        <ActivityIndicator size="large" color="#a92b31" />
        {isLoadingDraft && <Text style={styles.loadingSubText}>لطفاً صبر کنید</Text>}
      </View>
    );
  }

  if (showVideoLoadingOverlay) {
    return (
      <View style={styles.fullLoadingContainer}>
        <ActivityIndicator size="large" color="#a92b31" />
      </View>
    );
  }

  if (isImagePickerLoading) {
    return (
      <View style={styles.fullLoadingContainer}>
        <ActivityIndicator size="large" color="#a92b31" />
      </View>
    );
  }

  if (beginUpload) {
    return (
      <View style={styles.fullLoadingContainer}>
        <ActivityIndicator size="large" color="#a92b31" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StepIndicator currentStep={currentStep} onClose={handleClose} isEditMode={isEditMode} isDraft={isExistingDraft} />

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraHeight={Platform.OS === 'ios' ? 100 : 80}
        extraScrollHeight={Platform.OS === 'ios' ? 100 : 80}
        viewIsInsideTabBar={true}
      >
        <View style={{ backgroundColor: 'white' }}>
          <FormControl>
            {currentStep === 1 && (
              <>
                <TitleInput ref={inputRef} value={title} onChangeText={setTitle} />
                <ImageUploader
                  images={images}
                  onAddImage={pickImages}
                  onOpenCamera={openCamera}
                  onDeleteImage={deleteImageFromDraft}
                  // onSetMainImage={setMainImage}
                  onSetMainImage={handleSetMainImage}
                  onOpenPreview={openImagePreview}
                  onRetryUpload={retryImageUpload}
                />
                <DescriptionInput description={description} setDescription={setDescription} note={note} setNote={setNote} showNote={false} />
              </>
            )}

            {currentStep === 2 && (
              <>
                <View style={{ flexDirection: 'row', marginHorizontal: 8, marginBottom: 1 }}>
                  <TouchableOpacity style={styles.backStepButton} onPress={goToStep1}>
                    <Icon name="chevron-back-outline" size={24} color="#a92b31" />
                    <Text style={styles.backStepButtonText}>مرحله قبل</Text>
                  </TouchableOpacity>
                </View>
                <CategorySelector selectedCategory={selectedCategory} onPress={() => { setCategoryModalOpened(true); setShowCategoryModal(true); }} formatCategoryName={formatCategoryName} />

                <VideoUploader
                  videos={getDisplayVideos()}
                  onAddVideo={pickVideos}
                  onDeleteVideo={deleteVideo}
                  onOpenPreview={openVideoPreview}
                  onCloseVideoPreview={closeVideoPreview}
                  videoModalVisible={videoModalVisible}
                  selectedVideo={selectedVideo}
                  paused={paused}
                  showTrimmer={showTrimmer}
                  selectedVideoUri={selectedVideoUri}
                  onTrimmedAndCompressed={handleTrimmedAndCompressed}
                  onCloseTrimmer={closeTrimmer}
                  onCloseTrimmer2={closeTrimmer2}
                  isVideoUploading={isVideoUploading}
                  videoUploadProgress={videoUploadProgress}
                  currentUploadVideoUri={currentUploadVideoUri}
                  onCancelUpload={cancelUpload}
                  onUploadVideo={handleUploadVideo}
                  isCompressing={isCompressing}
                  compressingVideoUri={compressingVideoUri}
                  onCompressionStart={handleCompressionStart}
                  onCompressionEnd={handleCompressionEnd}
                  isLoading={isVideoPreviewLoading}
                  onRetryUpload={retryVideoUpload}
                />

                <LocationSelector selectedLocation={formatLocationDisplay(addressData)} onPress={() => setShowAddressModal(true)} />

                <Text style={styles.sectionTitle}>مشخصات ملک</Text>
                <Text style={styles.sectionSubtitle}>
                  فقط فیلدهایی که ستاره دارند اجباری میباشند، ولی با پر کردن هرچه بیشتر اطلاعات ملکی
                  شانس نمایش ملک خود به مشتری را بالا میبرید و به هوش مصنوعی آجر امکان پردازش بهتری میدهید
                </Text>

                <PropertyFields
                  normalFields={normalFields}
                  tickFields={tickFields}
                  predefineFields={predefineFields}
                  properties={properties}
                  loading={loadingFields}
                  onAddProperty={addProperty}
                  onRemoveProperty={removeProperty}
                  onUpdateProperty={updateProperty}
                  onUpsertProperty={upsertProperty}
                  formatNumber={(num) => num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  numToPersian={numToPersianForField}
                />

                <DescriptionInput description={description} setDescription={setDescription} note={note} setNote={setNote} showDescription={false} />
              </>
            )}
          </FormControl>
        </View>
      </KeyboardAwareScrollView>

      {currentStep === 1 && <NextStepButton onPress={goToStep2} loading={false} />}
      {currentStep === 2 && <SubmitButton onPress={handleSubmit} loading={beginUpload} isVideoProcessing={isVideoUploading || isCompressing} isEditMode={isEditMode} />}

      <CategoryModal
        isVisible={showCategoryModal}
        categories={allCategories}
        loading={loadingCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onClose={() => { if (selectedCategory) setShowCategoryModal(false); }}
        isForced={false}
        formatCategoryName={formatCategoryName}
      />

      <ImagePreviewModal
        isVisible={isImageModalVisible}
        image={selectedImage}
        onClose={closeImagePreview}
        onDelete={() => {
          deleteImageFromDraft(selectedImage);
          closeImagePreview();
        }}
        onSetMain={() => {
          handleSetMainImage(selectedImage); 
          
          closeImagePreview();
        }}
      />

      <AlertModal isVisible={showAlert} onCancel={() => setShowAlert(false)} onConfirm={handleBackConfirm} />
      <CloseModal isVisible={showCloseModal} onCancel={handleCloseCancel} onSave={handleCloseSave} onDelete={handleCloseDelete} />
      <NoImageAlertModal isVisible={showNoImageAlert} onCancel={() => setShowNoImageAlert(false)} onConfirm={handleNoImageConfirm} />
      <AddressModal isVisible={showAddressModal} onClose={() => setShowAddressModal(false)} onConfirm={handleAddressConfirm} isLoading={beginUpload} />
    </View>
  );
};

export default NewWorker;