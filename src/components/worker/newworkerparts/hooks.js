// hooks.js - COMPLETE WITH ALL FIXES + CHANGE MAIN IMAGE
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast, Box, Text } from 'native-base';
import {
  Alert
} from 'react-native';
import React from 'react';

// ==================== API Imports for Draft ====================
import {
  getUserDraft,
  saveDraft,
  uploadImageToDraft,
  uploadVideoToDraft,
  deleteImageFromDraft,
  deleteVideoFromDraft,
  deleteDraft,
  finalizeDraft,
  getPropertyById,
  changeMainImage as changeMainImageApi, // Add this
} from './api';

// ==================== Hook برای مدیریت دسته بندی‌ها ====================
export const useCategories = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [catId, setCatId] = useState(null);
  const toast = useToast();

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await axios.get('https://api.ajur.app/api/sub-category');
      setAllCategories(response.data);
    } catch (error) {
      toast.show({
        render: () => (
          <Box bg="red.700" px="15" py="3" rounded="md" mb={5}>
            <Text style={{ color: 'white', fontSize: 16 }}>
              خطا در بارگذاری دسته بندی‌ها
            </Text>
          </Box>
        ),
      });
    } finally {
      setLoadingCategories(false);
    }
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setCatId(category.id);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    allCategories,
    selectedCategory,
    loadingCategories,
    catId,
    selectCategory,
  };
};

// ==================== Hook برای مدیریت فیلدهای دسته بندی ====================
export const useFields = (catId) => {
  const [normalFields, setNormalFields] = useState([]);
  const [predefineFields, setPredefineFields] = useState([]);
  const [tickFields, setTickFields] = useState([]);
  const [loadingFields, setLoadingFields] = useState(true);

  useEffect(() => {
    if (catId) {
      setLoadingFields(true);
      axios({
        method: 'get',
        url: 'https://api.ajur.app/api/category-fields',
        params: { cat: catId },
      })
        .then((response) => {
          setNormalFields(
            response.data.normal_fields.sort((a, b) => (a.sort > b.sort ? 1 : -1))
          );
          setTickFields(response.data.tick_fields);
          setPredefineFields(response.data.predefine_fields);
          setLoadingFields(false);
        })
        .catch((error) => {
          setLoadingFields(false);
        });
    }
  }, [catId]);

  return {
    normalFields,
    predefineFields,
    tickFields,
    loadingFields,
  };
};

// ==================== Hook برای مدیریت فرم ملک ====================
export const usePropertyForm = () => {
  const [properties, setProperties] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');

  const addProperty = (property) => {
    setProperties((prev) => [...prev, property]);
  };

  const removeProperty = (propertyName) => {
    setProperties((prev) => prev.filter((item) => item.name !== propertyName));
  };

  const updateProperty = (propertyName, value) => {
    const existing = properties.find((p) => p.name === propertyName);
    if (existing) {
      setProperties((prev) =>
        prev.map((p) => (p.name === propertyName ? { ...p, value } : p))
      );
    } else {
      addProperty({ name: propertyName, value });
    }
  };

  const upsertProperty = (property) => {
    setProperties((prev) => {
      const existingIndex = prev.findIndex((p) => p.name === property.name);
      
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], value: property.value };
        return updated;
      }
      return [...prev, property];
    });
  };

  const clearProperties = () => {
    setProperties([]);
  };

  return {
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
    clearProperties,
  };
};

// ==================== Hook برای مدیریت عکس‌ها - FIXED ====================
export const useImageManager = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

  const addImages = (newImages) => {
    // Add images with order property
    const imagesWithOrder = newImages.map((img, index) => ({
      ...img,
      order: images.length + index,
      uploadStatus: img.uploadStatus || 'uploading'
    }));
    setImages((prev) => [...prev, ...imagesWithOrder]);
  };

  const deleteImage = (image) => {
    setImages((prev) => prev.filter((img) => img.uri !== image.uri));
  };

  const setMainImage = (image) => {
    if (!image) return;
  
    setImages((prev) => {
      const rest = prev.filter(
        (img) => img.uri !== image.uri && img.id !== image.id
      );
      return [
        { ...image, order: 0, isMain: true },
        ...rest.map((img, i) => ({ ...img, order: i + 1, isMain: false })),
      ];
    });
  };

  const openImagePreview = (image) => {
    setSelectedImage(image);
    setIsImageModalVisible(true);
  };

  const closeImagePreview = () => {
    setSelectedImage(null);
    setIsImageModalVisible(false);
  };

  const updateImage = (oldUri, newData) => {
    console.log('🔄 updateImage called:', { oldUri, newData });
    setImages((prev) => {
      const updated = prev.map((img) => {
        if (img.uri === oldUri) {
          console.log('✅ Found matching image, updating:', img.uri);
          return { ...img, ...newData };
        }
        return img;
      });
      return updated;
    });
  };

  const updateImageStatus = (uri, status) => {
    console.log('🔄 updateImageStatus called:', { uri, status });
    setImages((prev) => {
      const updated = prev.map((img) => {
        if (img.uri === uri) {
          console.log('✅ Updating status for image:', uri, 'to', status);
          return { ...img, uploadStatus: status };
        }
        return img;
      });
      return updated;
    });
  };

  const updateImageById = (id, newData) => {
    console.log('🔄 updateImageById called:', { id, newData });
    setImages((prev) => {
      const updated = prev.map((img) => {
        if (img.id === id) {
          console.log('✅ Found image by ID:', id);
          return { ...img, ...newData };
        }
        return img;
      });
      return updated;
    });
  };

  const getImageByUri = (uri) => {
    return images.find(img => img.uri === uri);
  };

  const getImageById = (id) => {
    return images.find(img => img.id === id);
  };

  return {
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
    updateImageById,
    getImageByUri,
    getImageById,
  };
};

// ==================== Hook برای مدیریت ویدیوها - FIXED ====================
export const useVideoManager = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideoUri, setSelectedVideoUri] = useState(null);
  const [showTrimmer, setShowTrimmer] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressingVideoUri, setCompressingVideoUri] = useState(null);
  const [tempProcessingVideo, setTempProcessingVideo] = useState(null);

  const addVideo = (video) => {
    setVideos((prev) => [...prev, video]);
  };

  const deleteVideo = (video) => {
    setVideos((prev) => prev.filter((v) => v.uri !== video.uri));
    if (tempProcessingVideo && tempProcessingVideo.uri === video.uri) {
      setTempProcessingVideo(null);
    }
  };

  const openVideoPreview = (video) => {
    setSelectedVideo(video);
    setVideoModalVisible(true);
  };

  const closeVideoPreview = () => {
    setSelectedVideo(null);
    setVideoModalVisible(false);
  };

  const handleVideoSelected = (video) => {
    console.log('🎬 Video selected in hook:', video);
    setSelectedVideo(video);
    setSelectedVideoUri(video.uri);
    setShowTrimmer(true);
    
    const processingVideo = {
      uri: video.uri,
      mime: video.mime || 'video/mp4',
      width: video.width || 1080,
      height: video.height || 1080,
      isFromDraft: false,
      isProcessing: true,
      error: false,
      uploadStatus: 'processing',
    };
    setTempProcessingVideo(processingVideo);
    setCompressingVideoUri(video.uri);
  };

  const handleTrimmedAndCompressed = (compressedVideoUri) => {
    console.log('📤 Compressed video URI in hook:', compressedVideoUri);
    
    setTempProcessingVideo(null);
    
    if (compressedVideoUri) {
      const newVideo = {
        uri: compressedVideoUri,
        mime: selectedVideo?.mime || 'video/mp4',
        width: 1080,
        height: 1080,
        isFromDraft: false,
        isProcessing: false,
        error: false,
        uploadStatus: 'uploading',
      };
      setVideos((prev) => [...prev, newVideo]);
    }
    
    setShowTrimmer(false);
    setSelectedVideo(null);
    setSelectedVideoUri(null);
    setCompressingVideoUri(null);
    setIsCompressing(false);
  };

  const startCompressing = () => {
    console.log('📹 startCompressing called');
    setIsCompressing(true);
  };

  const endCompressing = () => {
    console.log('📹 endCompressing called');
    setIsCompressing(false);
  };

  const closeTrimmer = () => {
    console.log('❌ Closing trimmer - removing video');
    setTempProcessingVideo(null);
    setShowTrimmer(false);
    setSelectedVideo(null);
    setSelectedVideoUri(null);
    setCompressingVideoUri(null);
    setIsCompressing(false);
  };

  const closeTrimmer2 = () => {
    setShowTrimmer(false);
  };

  const updateVideoStatus = (uri, status) => {
    setVideos((prev) =>
      prev.map((v) =>
        v.uri === uri ? { ...v, uploadStatus: status, isProcessing: status === 'uploading', error: status === 'error' } : v
      )
    );
  };

  const markVideoError = (uri) => {
    setVideos((prev) =>
      prev.map((v) =>
        v.uri === uri ? { ...v, uploadStatus: 'error', isProcessing: false, error: true } : v
      )
    );
  };

  const getDisplayVideos = () => {
    const result = [...videos];
    if (tempProcessingVideo) {
      result.push(tempProcessingVideo);
    }
    return result;
  };

  return {
    videos,
    getDisplayVideos,
    selectedVideo,
    videoModalVisible,
    selectedVideoUri,
    setSelectedVideoUri,
    showTrimmer,
    setShowTrimmer,
    isCompressing,
    compressingVideoUri,
    addVideo,
    deleteVideo,
    openVideoPreview,
    closeVideoPreview,
    handleVideoSelected,
    handleTrimmedAndCompressed,
    closeTrimmer,
    closeTrimmer2,
    startCompressing,
    endCompressing,
    updateVideoStatus,
    markVideoError,
  };
};

// ==================== Hook برای مدیریت آپلود ====================
export const useUpload = () => {
  const [beginUpload, setBeginUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const startUpload = () => {
    setBeginUpload(true);
    setUploadProgress(0);
  };

  const updateProgress = (progress) => {
    setUploadProgress(progress);
  };

  const finishUpload = () => {
    setBeginUpload(false);
    setUploadProgress(0);
  };

  return {
    beginUpload,
    uploadProgress,
    startUpload,
    updateProgress,
    finishUpload,
  };
};

// ==================== Hook برای مدیریت Draft ====================
export const useDraft = ({ mode, propertyId, categoryId, navigation }) => {
  const toast = useToast();
  const [draftId, setDraftId] = useState(null);
  const [draftData, setDraftData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExistingDraft, setIsExistingDraft] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentUploadVideoUri, setCurrentUploadVideoUri] = useState(null);
  const [cancelVideoUpload, setCancelVideoUpload] = useState(false);

  const loadOrCreateDraft = async (formData) => {
    console.log('🔄 loadOrCreateDraft called');
    console.log('📤 mode:', mode, 'propertyId:', propertyId);
    
    setIsLoading(true);
    try {
      if (mode === 'edit' && propertyId) {
        console.log('📤 EDIT MODE: Fetching property by ID:', propertyId);
        setIsEditMode(true);
        
        try {
          const property = await getPropertyById(propertyId);
          console.log('✅ Property fetched:', property);
          
          if (property) {
            setDraftId(property.id);
            setDraftData(property);
            setIsExistingDraft(true);
            setIsLoading(false);
            return property;
          } else {
            console.log('⚠️ Property not found, creating new draft');
            const newDraft = await saveDraft({
              category_id: categoryId || null,
              title: formData?.title || '',
              description: formData?.description || '',
              note: formData?.note || '',
              properties: formData?.properties || [],
            });
            
            if (newDraft) {
              setDraftId(newDraft.id);
              setDraftData(newDraft);
              setIsExistingDraft(false);
              setIsLoading(false);
              return newDraft;
            }
          }
        } catch (fetchError) {
          console.error('❌ Error fetching property:', fetchError);
          console.log('⚠️ Falling back to new draft');
          const newDraft = await saveDraft({
            category_id: categoryId || null,
            title: formData?.title || '',
            description: formData?.description || '',
            note: formData?.note || '',
            properties: formData?.properties || [],
          });
          
          if (newDraft) {
            setDraftId(newDraft.id);
            setDraftData(newDraft);
            setIsExistingDraft(false);
            setIsLoading(false);
            return newDraft;
          }
        }
      }

      console.log('📤 NEW MODE: Getting user draft');
      const draft = await getUserDraft();
      console.log('📤 getUserDraft result:', draft);
      
      if (draft) {
        console.log('✅ Existing draft found');
        setDraftId(draft.id);
        setDraftData(draft);
        setIsExistingDraft(true);
        setIsLoading(false);
        return draft;
      }

      console.log('📤 No draft found, creating new draft');
      const newDraft = await saveDraft({
        category_id: categoryId || null,
        title: formData?.title || '',
        description: formData?.description || '',
        note: formData?.note || '',
        properties: formData?.properties || [],
      });
      console.log('✅ New draft created:', newDraft);

      if (newDraft) {
        setDraftId(newDraft.id);
        setDraftData(newDraft);
        setIsExistingDraft(false);
        setIsLoading(false);
        return newDraft;
      }

      console.log('⚠️ Failed to create draft');
      setIsLoading(false);
      return null;
      
    } catch (error) {
      console.error('❌ Error loading/creating draft:', error);
      
      toast.show({
        render: () => (
          <Box bg="red.700" px="15" py="3" rounded="md" mb={5}>
            <Text style={{ color: 'white', fontSize: 16 }}>
              خطا در بارگذاری پیش‌نویس: {error.message || 'خطای ناشناخته'}
            </Text>
          </Box>
        ),
      });
      setIsLoading(false);
      return null;
    }
  };

  const updateDraftData = async (data) => {
    if (!draftId) {
      return null;
    }
    try {
      const updated = await saveDraft({
        draft_id: draftId,
        ...data,
      });
      setDraftData(updated);
      return updated;
    } catch (error) {
      throw error;
    }
  };

  // ==================== CHANGE MAIN IMAGE - NEW ====================
  const changeMainImage = async (imageId) => {
    if (!draftId) {
      toast.show({
        render: () => (
          <Box bg="red.700" px="15" py="3" rounded="md" mb={5}>
            <Text style={{ color: 'white', fontSize: 16 }}>
              خطا: شناسه پیش‌نویس یافت نشد
            </Text>
          </Box>
        ),
      });
      return null;
    }
    
    if (!imageId) {
      toast.show({
        render: () => (
          <Box bg="red.700" px="15" py="3" rounded="md" mb={5}>
            <Text style={{ color: 'white', fontSize: 16 }}>
              خطا: شناسه عکس یافت نشد
            </Text>
          </Box>
        ),
      });
      return null;
    }
    
    try {
      const result = await changeMainImageApi(draftId, imageId);
      console.log('✅ Main image changed successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Error changing main image:', error);
      throw error;
    }
  };

  // ==================== UPLOAD IMAGE ====================
  const uploadImage = async (imageUri, mimeType) => {
    console.log('📤 ========== UPLOAD IMAGE HOOK ==========');
    console.log('📤 imageUri:', imageUri);
    console.log('📤 mimeType:', mimeType);
    console.log('📤 draftId:', draftId);
    
    if (!draftId) {
      console.error('❌ No draft ID for image upload');
      toast.show({
        render: () => (
          <Box bg="red.700" px="15" py="3" rounded="md" mb={5}>
            <Text style={{ color: 'white', fontSize: 16 }}>
              خطا: شناسه پیش‌نویس یافت نشد
            </Text>
          </Box>
        ),
      });
      return null;
    }

    if (!imageUri) {
      console.error('❌ No image URI provided');
      toast.show({
        render: () => (
          <Box bg="red.700" px="15" py="3" rounded="md" mb={5}>
            <Text style={{ color: 'white', fontSize: 16 }}>
              خطا: عکسی انتخاب نشده است
            </Text>
          </Box>
        ),
      });
      return null;
    }

    try {
      const result = await uploadImageToDraft(draftId, imageUri, mimeType);
      console.log('📤 Result from API:', JSON.stringify(result, null, 2));
      
      if (!result) {
        console.warn('⚠️ Upload returned null/undefined');
        return null;
      }
      
      if (result.image && result.image.id) {
        console.log('✅ Image upload successful (new format):', result.image);
        return { image: result.image };
      }
      
      if (result.images && Array.isArray(result.images) && result.images.length > 0) {
        const lastImage = result.images[result.images.length - 1];
        const imageData = {
          id: lastImage.id,
          url: `https://api.ajur.app/public/workers/images/${lastImage.filepath}`,
          filepath: lastImage.filepath,
        };
        console.log('✅ Image upload successful (old format):', imageData);
        return { image: imageData };
      }
      
      if (result.id && result.filepath) {
        console.log('✅ Image upload successful (direct format):', result);
        return { image: result };
      }
      
      console.warn('⚠️ Unknown response format. Available keys:', Object.keys(result));
      console.warn('⚠️ Full response:', JSON.stringify(result, null, 2));
      
      if (result.status === 200) {
        console.log('⚠️ Status is 200 but no image data found. Creating fallback.');
        return { 
          image: { 
            id: Date.now(), 
            url: imageUri, 
            filepath: `uploaded_${Date.now()}` 
          } 
        };
      }
      
      return null;
      
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      throw error;
    }
  };

  // ==================== UPLOAD VIDEO ====================
  const uploadVideo = async (videoUri, mimeType) => {
    console.log('========== UPLOAD VIDEO CALLED ==========');
    console.log('Draft ID:', draftId);
    console.log('Video URI:', videoUri);
    
    if (!draftId) {
      toast.show({
        render: () => (
          <Box bg="red.700" px="15" py="3" rounded="md" mb={5}>
            <Text style={{ color: 'white', fontSize: 16 }}>
              خطا: شناسه پیش‌نویس یافت نشد
            </Text>
          </Box>
        ),
      });
      return null;
    }

    if (!videoUri) {
      toast.show({
        render: () => (
          <Box bg="red.700" px="15" py="3" rounded="md" mb={5}>
            <Text style={{ color: 'white', fontSize: 16 }}>
              خطا: ویدیویی انتخاب نشده است
            </Text>
          </Box>
        ),
      });
      return null;
    }

    setIsVideoUploading(true);
    setUploadProgress(0);
    setCurrentUploadVideoUri(videoUri);
    setCancelVideoUpload(false);

    try {
      const result = await uploadVideoToDraft(
        draftId,
        videoUri,
        mimeType,
        (progress) => {
          if (cancelVideoUpload) {
            throw new Error('Upload cancelled');
          }
          setUploadProgress(progress);
        }
      );
      
      console.log('✅ Upload successful:', result);
      setIsVideoUploading(false);
      setUploadProgress(100);
      setCurrentUploadVideoUri(null);
      
      toast.show({
        render: () => (
          <Box bg="green.500" px="15" py="3" rounded="md" mb={5}>
            <Text style={{ color: 'white', fontSize: 16 }}>
              ✅ ویدیو با موفقیت آپلود شد
            </Text>
          </Box>
        ),
      });
      
      return result;
      
    } catch (error) {
      console.error('❌ Upload error:', error);
      setIsVideoUploading(false);
      setUploadProgress(0);
      setCurrentUploadVideoUri(null);
      
      if (error.message === 'Upload cancelled') {
        console.log('⏹️ Video upload cancelled by user');
        return null;
      }
      
      let errorMessage = 'خطا در آپلود ویدیو';
      if (error.message && error.message.includes('timeout')) {
        errorMessage = 'زمان آپلود به پایان رسید. لطفاً دوباره تلاش کنید.';
      } else if (error.message && error.message.includes('Network')) {
        errorMessage = 'اتصال اینترنت خود را بررسی کنید.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.show({
        render: () => (
          <Box bg="red.700" px="15" py="3" rounded="md" mb={5}>
            <Text style={{ color: 'white', fontSize: 16 }}>
              ❌ {errorMessage}
            </Text>
          </Box>
        ),
      });
      
      throw new Error(errorMessage);
    }
  };

  const cancelUpload = () => {
    setCancelVideoUpload(true);
    setIsVideoUploading(false);
    setUploadProgress(0);
    setCurrentUploadVideoUri(null);
  };

  const deleteImage = async (imageId) => {
    if (!draftId) {
      return null;
    }
    try {
      const result = await deleteImageFromDraft(imageId);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const deleteVideo = async (videoId) => {
    if (!draftId) {
      return null;
    }
    try {
      const result = await deleteVideoFromDraft(videoId);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const finalize = async (data) => {
    if (!draftId) {
      return null;
    }
    try {
      const result = await finalizeDraft(draftId, data);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const deleteDraftData = async () => {
    if (!draftId) {
      return null;
    }
    try {
      const result = await deleteDraft(draftId);
      setDraftId(null);
      setDraftData(null);
      setIsExistingDraft(false);
      return result;
    } catch (error) {
      throw error;
    }
  };

  return {
    draftId,
    draftData,
    isLoading,
    isExistingDraft,
    isEditMode,
    isVideoUploading,
    uploadProgress,
    currentUploadVideoUri,
    loadOrCreateDraft,
    updateDraftData,
    uploadImage,
    uploadVideo,
    deleteImage,
    deleteVideo,
    cancelUpload,
    finalize,
    deleteDraftData,
    changeMainImage, // Add this
  };
};