import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Text, BackHandler, PermissionsAndroid } from 'react-native';
import { FormControl, useToast, Box } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Progress from 'react-native-progress';
import axios from 'axios';
import ImagePicker from 'react-native-image-crop-picker';

import styles from './newworkerparts/styles';
import {
  useCategories,
  useFields,
  usePropertyForm,
  useImageManager,
  useVideoManager,
  useUpload,
} from './newworkerparts/hooks';
import {
  CategorySelector,
  LocationSelector, // <-- اضافه کردن
  TitleInput,
  ImageUploader,
  VideoUploader,
  PropertyFields,
  DescriptionInput,
  Header,
  SubmitButton,
} from './newworkerparts/components';
import {
  CategoryModal,
  FieldModal,
  ImagePreviewModal,
  AlertModal,
  NoImageAlertModal,
  AddressModal, // <-- اضافه کردن
} from './newworkerparts/modals';

const NewWorker2 = ({ route, navigation }) => {
  const toast = useToast();
  const inputRef = useRef(null);
  const [cellphone, setCellphone] = useState('000');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isCategoryForced, setIsCategoryForced] = useState(false);
  const [fieldModalVisible, setFieldModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const [fieldValue, setFieldValue] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showNoImageAlert, setShowNoImageAlert] = useState(false);
  const [noImageVerified, setNoImageVerified] = useState(false);
  const [paused, setPaused] = useState(false);
  
  // New states for address
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressData, setAddressData] = useState(null); // <-- برای نمایش آدرس انتخاب شده

  // استفاده از هوک‌ها
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
    updateProperty 
  } = usePropertyForm();
  
  const { 
    images, 
    selectedImage, 
    isImageModalVisible, 
    addImages, 
    deleteImage, 
    setMainImage, 
    openImagePreview, 
    closeImagePreview 
  } = useImageManager();
  
  const { 
    videos, 
    selectedVideo, 
    videoModalVisible, 
    selectedVideoUri,
    showTrimmer,
    addVideo, 
    deleteVideo, 
    openVideoPreview, 
    closeVideoPreview,
    handleVideoSelected,
    handleTrimmedAndCompressed,
    closeTrimmer,
  } = useVideoManager();
  
  const { beginUpload, uploadProgress, startUpload, updateProgress, finishUpload } = useUpload();

  // دریافت شماره موبایل
  useEffect(() => {
    AsyncStorage.getItem('cellphone').then(phone => setCellphone(phone));
  }, []);

  // باز کردن مودال دسته بندی اگر انتخاب نشده
  useEffect(() => {
    if (!selectedCategory && !loadingCategories) {
      setIsCategoryForced(true);
      setShowCategoryModal(true);
    }
  }, [selectedCategory, loadingCategories]);

  useEffect(() => {
    if (noImageVerified) {
      handleSubmit();
    }
  }, [noImageVerified]);

  // هندل بک دکمه
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      setShowAlert(true);
      return true;
    });
    return () => backHandler.remove();
  }, []);

  // ==================== توابع Image Picker ====================
  
  const requestCameraPermission = async () => {
    try {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
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
      console.error('Error requesting camera permission:', error);
      return false;
    }
  };

  const pickImages = () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'photo',
      compressImageMaxWidth: 1080,
      compressImageMaxHeight: 1080,
      compressImageQuality: 1,
      forceJpg: true,
      includeExif: true,
      waitAnimationEnd: false,
    })
      .then(async (selectedImages) => {
        const processedImages = selectedImages.map((img) => ({
          uri: img.path,
          width: img.width,
          height: img.height,
          mime: img.mime || 'image/jpeg',
        }));
        addImages(processedImages);
      })
      .catch(error => {
        console.log('Error picking images:', error);
        if (error.message !== 'User cancelled image selection') {
          toast.show({
            render: () => (
              <Box bg="red.700" px="15" py="3" rounded="md" mb={5}>
                <Text style={{ color: 'white', fontSize: 16 }}>
                  خطا در انتخاب عکس
                </Text>
              </Box>
            ),
          });
        }
      });
  };

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
      addImages([{
        uri: image.path,
        width: image.width,
        height: image.height,
        mime: image.mime || 'image/jpeg',
      }]);
    } catch (error) {
      if (error.message !== 'User cancelled image selection') {
        console.log('Error opening camera:', error);
      }
    }
  };

  // ==================== توابع Video Picker ====================

  const pickVideos = () => {
    console.log('pickVideos called');
    ImagePicker.openPicker({
      mediaType: 'video',
    })
      .then((video) => {
        console.log('Video picked:', video);
        const newVideo = {
          uri: video.path,
          mime: video.mime || 'video/mp4',
          width: video.width || 1080,
          height: video.height || 1080,
        };
        handleVideoSelected(newVideo);
      })
      .catch(error => {
        console.log('Error picking video:', error);
        if (error.message !== 'User cancelled image selection') {
          toast.show({
            render: () => (
              <Box bg="red.700" px="15" py="3" rounded="md" mb={5}>
                <Text style={{ color: 'white', fontSize: 16 }}>
                  خطا در انتخاب ویدیو: {error.message}
                </Text>
              </Box>
            ),
          });
        }
      });
  };

  // ==================== توابع دیگر ====================

  const handleSelectCategory = (category) => {
    selectCategory(category);
    setIsCategoryForced(false);
    setShowCategoryModal(false);
  };

  const handleFieldModalOpen = (field) => {
    setCurrentField(field);
    setFieldValue('');
    setFieldModalVisible(true);
  };

  const handleFieldModalConfirm = () => {
    if (fieldValue) {
      addProperty({
        name: currentField.value,
        value: fieldValue,
        kind: 1,
        special: currentField.special,
        order: currentField.sort,
      });
    }
    setFieldModalVisible(false);
    setFieldValue('');
  };

  const numToPersian = () => {
    const num = Number(fieldValue);
    if (!num) return '';
    const persianNumbers = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
    const tens = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
    const teens = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
    const hundreds = ['', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
    const units = ['', 'هزار', 'میلیون', 'میلیارد'];

    if (num === 0) return 'صفر';

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

    const groups = splitNumber(num);
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

  const handleBackConfirm = () => {
    setShowAlert(false);
    navigation.goBack();
  };

  const handleNoImageConfirm = () => {
    setShowNoImageAlert(false);
    setNoImageVerified(true);
  };

  // ==================== تابع آدرس ====================

  const handleAddressConfirm = (address) => {
    setAddressData(address); // ذخیره آدرس
    setShowAddressModal(false); // بستن مودال
  };

  // ==================== تابع ارسال نهایی ====================

  const handleSubmit = async () => {
    if (!selectedCategory) {
      setIsCategoryForced(true);
      setShowCategoryModal(true);
      toast.show({
        render: () => (
          <Box bg="orange.700" px="15" py="3" rounded="md" mb={5}>
            <Text style={{ color: 'white', fontSize: 16 }}>لطفا دسته بندی را انتخاب کنید</Text>
          </Box>
        ),
      });
      return;
    }

    if (!addressData) {
      toast.show({
        render: () => (
          <Box bg="orange.700" px="15" py="3" rounded="md" mb={5}>
            <Text style={{ color: 'white', fontSize: 16 }}>لطفا موقعیت ملک را انتخاب کنید</Text>
          </Box>
        ),
      });
      return;
    }

    if (!title || title.length < 3) {
      toast.show({
        render: () => (
          <Box bg="orange.700" px="15" py="3" rounded="md" mb={5}>
            <Text style={{ color: 'white', fontSize: 16 }}>عنوان باید حداقل ۳ حرف باشد</Text>
          </Box>
        ),
      });
      return;
    }

    if (images.length === 0 && !noImageVerified) {
      setShowNoImageAlert(true);
      return;
    }

    const requiredFields = normalFields.filter(f => f.special === 1);
    const missingRequired = requiredFields.filter(
      f => !properties.find(p => p.name === f.value)
    );

    if (missingRequired.length > 0) {
      toast.show({
        render: () => (
          <Box bg="orange.700" px="15" py="3" rounded="md" mb={5}>
            <Text style={{ color: 'white', fontSize: 16 }}>فیلدهای ستاره دار را پر کنید</Text>
          </Box>
        ),
      });
      return;
    }

    // ارسال نهایی با آدرس
    await submitPropertyWithAddress(addressData);
  };

  const submitPropertyWithAddress = async (address) => {
    try {
      startUpload();
      const token = await AsyncStorage.getItem('id_token');
      
      // مرحله 1: ارسال اطلاعات ملک
      const formData = new FormData();
      
      images.forEach((img, index) => {
        formData.append('upload[]', {
          uri: img.uri,
          name: `image_${Date.now()}_${index}.jpg`,
          type: img.mime || 'image/jpeg',
        });
      });

      if (videos.length > 0) {
        videos.forEach((video, index) => {
          formData.append('videos[]', {
            uri: video.uri,
            name: `video_${Date.now()}_${index}.mp4`,
            type: video.mime || 'video/mp4',
          });
        });
      } else {
        formData.append('videos[]', null);
      }

      // ارسال اطلاعات ملک
      const response = await axios.post(
        'https://api.ajur.app/api/post-model-with-images',
        formData,
        {
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
        }
      );

      const workerId = response.data.worker.id;

      // مرحله 2: ارسال موقعیت مکانی
      await submitLocation(token, workerId, address);

      finishUpload();
      
      // رفتن به صفحه بعدی (SingleUpgrade)
      navigation.navigate('SingleUpgrade', { worker_id: workerId });
      
    } catch (error) {
      console.error('Error submitting property:', error);
      finishUpload();
      toast.show({
        render: () => (
          <Box bg="red.700" px="15" py="3" rounded="md" mb={5}>
            <Text style={{ color: 'white', fontSize: 16 }}>
              {error.response?.data?.message || 'خطا در ارسال اطلاعات'}
            </Text>
          </Box>
        ),
      });
    }
  };

  const submitLocation = async (token, workerId, address) => {
    try {
      const response = await axios({
        method: 'post',
        url: 'https://api.ajur.app/api/post-model-location',
        timeout: 1000 * 35,
        params: {
          token: token,
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
        toast.show({
          render: () => (
            <Box bg="green.500" px="15" py="3" rounded="md" mb={5}>
              <Text style={{ color: 'white', fontSize: 16 }}>
                آگهی شما با موفقیت ثبت شد
              </Text>
            </Box>
          ),
        });
      }
    } catch (error) {
      console.error('Location API Error:', error);
      throw error;
    }
  };

  const formatCategoryName = (name) => {
    if (!name) return '';
    return name.replace(/خرید/g, 'فروش');
  };

  // تابع برای نمایش آدرس انتخاب شده
  const formatLocationDisplay = (address) => {
    if (!address) return null;
    return {
      city: address.city,
      neighbourhood: address.neighbourhood,
      formatted: address.formatted
    };
  };

  if (beginUpload) {
    return (
      <View style={styles.progress_wrapper}>
        <Progress.Bar width={350} progress={uploadProgress / 100} color="#a92b31" showsText={true} />
      </View>
    );
  }

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View style={{ backgroundColor: 'white' }}>
        <Header 
          title={selectedCategory ? formatCategoryName(selectedCategory.name) : 'انتخاب دسته بندی'}
          onBackPress={() => setShowAlert(true)}
        />
        
        <FormControl>
          {/* انتخاب دسته بندی */}
          <CategorySelector
            selectedCategory={selectedCategory}
            onPress={() => {
              setIsCategoryForced(false);
              setShowCategoryModal(true);
            }}
            formatCategoryName={formatCategoryName}
          />

          {/* ==================== انتخاب موقعیت ملک ==================== */}
          <LocationSelector
            selectedLocation={formatLocationDisplay(addressData)}
            onPress={() => setShowAddressModal(true)}
          />

          {/* عنوان ملک */}
          <TitleInput ref={inputRef} value={title} onChangeText={setTitle} />

          {/* عکس‌ها */}
          <ImageUploader
            images={images}
            onAddImage={pickImages}
            onOpenCamera={openCamera}
            onDeleteImage={deleteImage}
            onSetMainImage={setMainImage}
            onOpenPreview={openImagePreview}
          />

          {/* ویدیوها */}
          <VideoUploader
            videos={videos}
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
          />

          {/* مشخصات ملک */}
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
            onOpenModal={handleFieldModalOpen}
            formatNumber={(num) => num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          />

          {/* توضیحات */}
          <DescriptionInput
            description={description}
            setDescription={setDescription}
            note={note}
            setNote={setNote}
          />
        </FormControl>

        <SubmitButton onPress={handleSubmit} />
      </View>

      {/* Modals */}
      <CategoryModal
        isVisible={showCategoryModal}
        categories={allCategories}
        loading={loadingCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onClose={() => setShowCategoryModal(false)}
        isForced={isCategoryForced}
        formatCategoryName={formatCategoryName}
      />

      <FieldModal
        isVisible={fieldModalVisible}
        field={currentField}
        value={fieldValue}
        onChangeText={setFieldValue}
        onConfirm={handleFieldModalConfirm}
        onClose={() => setFieldModalVisible(false)}
        numToPersian={numToPersian}
      />

      <ImagePreviewModal
        isVisible={isImageModalVisible}
        image={selectedImage}
        onClose={closeImagePreview}
        onDelete={() => {
          deleteImage(selectedImage);
          closeImagePreview();
        }}
        onSetMain={() => {
          setMainImage(selectedImage);
          closeImagePreview();
        }}
      />

      <AlertModal
        isVisible={showAlert}
        onCancel={() => setShowAlert(false)}
        onConfirm={handleBackConfirm}
      />

      <NoImageAlertModal
        isVisible={showNoImageAlert}
        onCancel={() => setShowNoImageAlert(false)}
        onConfirm={handleNoImageConfirm}
      />

      {/* Address Modal - فقط برای انتخاب موقعیت */}
      <AddressModal
        isVisible={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onConfirm={handleAddressConfirm}
        isLoading={beginUpload}
      />
    </ScrollView>
  );
};

export default NewWorker2;