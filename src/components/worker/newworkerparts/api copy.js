// newworkerparts/api.js
import axios from 'axios';
import {Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
const API_BASE = 'https://api.ajur.app/api';

// ==================== Get User's Draft ====================
// export const getUserDraft = async () => {
//     try {
//       const token = await AsyncStorage.getItem('id_token');
//       if (!token) return null;
  
//       const response = await axios.get(`${API_BASE}/get-user-draft`, {
//         params: { token },
//       });
  
//       if (response.data && response.data.worker) {
//         const worker = response.data.worker;
        
    
        
        
        
//         return worker;
//       }
//       return null;
//     } catch (error) {
//       // 404 means no draft found - this is expected
//       if (error.response?.status === 404) {
       
//         return null;
//       }
//       console.error('Error fetching draft:', error);
     
//       return null;
//     }
//   };



// ==================== Get User's Draft ====================
export const getUserDraft = async () => {
    try {
      const token = await AsyncStorage.getItem('id_token');
      if (!token) return null;
  
      const response = await axios.get(`${API_BASE}/get-user-draft`, {
        params: { token },
      });
  
      if (response.data && response.data.worker) {
        const worker = response.data.worker;
        
        // ==================== GENERATE THUMBNAILS FOR VIDEOS ====================
        if (worker.videos && worker.videos.length > 0) {
          for (const video of worker.videos) {
            const videoUrl = `https://api.ajur.app/public/workers/videos/${video.filepath}`;
            try {
              const thumbnail = await generateVideoThumbnail(videoUrl);
              if (thumbnail) {
                video.thumbnail = thumbnail;
              }
            } catch (e) {
              console.log('Could not generate thumbnail for video:', video.filepath);
            }
          }
        }
        
        return worker;
      }
      return null;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching draft:', error);
      return null;
    }
  };

// ==================== Create/Update Draft (via post-model-with-images) ====================
export const saveDraft = async (data) => {
    try {
      const token = await AsyncStorage.getItem('id_token');
      const cellphone = await AsyncStorage.getItem('cellphone');
  
      // Convert category_id to number if it exists
      const categoryId = data.category_id ? Number(data.category_id) : null;
  
      const params = {
        token,
        category_id: categoryId,
        title: data.title || '',
        description: data.description || '',
        note: data.note || '',
        properties: JSON.stringify(data.properties || []),
        address: data.address || null, // ← ADD THIS LINE
        status: 3,
        phone: cellphone || '000',
      };
  
      if (data.draft_id) {
        params.exid = data.draft_id;
      }
  
      console.log('📤 saveDraft params:', params);
  
      const response = await axios.post(
        `${API_BASE}/post-model-with-images`,
        {},
        { params }
      );
  
      return response.data.worker;
    } catch (error) {
      console.error('❌ Error saving draft:', error);
      throw error;
    }
  };

// ==================== Upload Single Image to Draft ====================
export const uploadImageToDraft = async (draftId, imageUri, mimeType) => {
  try {
    const token = await AsyncStorage.getItem('id_token');
    
    const formData = new FormData();
    const fileName = `draft_${draftId}_image_${Date.now()}.jpg`;
    
    formData.append('image[]', {
      uri: imageUri,
      name: fileName,
      type: mimeType || 'image/jpeg',
    });

    const response = await axios.post(
      `${API_BASE}/upload-image`,
      formData,
      {
        params: {
          token,
          worker_id: draftId,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          // Progress callback can be handled by the component
        },
      }
    );

    return response.data;
  } catch (error) {
    // console.error('Error uploading image to draft:', error);
    throw error;
  }
};

// ==================== Upload Single Video to Draft ====================
// newworkerparts/api.js - بخش uploadVideoToDraft

// newworkerparts/api.js


// newworkerparts/api.js - uploadVideoToDraft

// newworkerparts/api.js

export const uploadVideoToDraft = async (draftId, videoUri, mimeType, onProgress) => {
  try {
    const token = await AsyncStorage.getItem('id_token');
    
    // ============ دریافت حجم فایل ============
    let fileSize = 0;
    try {
      const response = await fetch(videoUri);
      const blob = await response.blob();
      fileSize = blob.size;
    } catch (error) {
      console.log('Could not get file size:', error);
    }
    
    const formData = new FormData();
    const fileName = `draft_${draftId}_video_${Date.now()}.mp4`;
    
    formData.append('video[]', {
      uri: videoUri,
      name: fileName,
      type: mimeType || 'video/mp4',
    });

    // ============ ایجاد AbortController برای تایم‌اوت ============
    const source = axios.CancelToken.source();
    const timeoutId = setTimeout(() => {
      source.cancel('Upload timeout - connection lost');
    }, 600000); // 600 ثانیه تایم‌اوت

    const response = await axios.post(
      `${API_BASE}/upload-video`,
      formData,
      {
        params: {
          token,
          worker_id: draftId,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        cancelToken: source.token,
        timeout: 600000, // 600 ثانیه تایم‌اوت
        onUploadProgress: (progressEvent) => {
          let progress = 0;
          
          if (progressEvent.total) {
            progress = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
          } else if (fileSize > 0) {
            progress = Math.floor((progressEvent.loaded * 100) / fileSize);
          } else {
            const estimatedTotal = 50 * 1024 * 1024;
            progress = Math.floor((progressEvent.loaded * 100) / estimatedTotal);
          }
          
          const finalProgress = Math.min(Math.max(progress, 0), 99);
          console.log(`📊 Upload progress: ${finalProgress}%`);
          
          if (onProgress) onProgress(finalProgress);
        },
      }
    );

    clearTimeout(timeoutId);

    if (onProgress) onProgress(100);
    return response.data;
    
  } catch (error) {
    // ============ مدیریت انواع خطا ============
    if (axios.isCancel(error)) {
      console.log('❌ Upload cancelled by timeout:', error.message);
      throw new Error('ارتباط با سرور قطع شد. لطفاً اتصال اینترنت را بررسی کنید.');
    } else if (error.code === 'ECONNABORTED') {
      console.log('❌ Upload timeout');
      throw new Error('زمان آپلود به پایان رسید. لطفاً دوباره تلاش کنید.');
    } else if (error.message === 'Network Error') {
      console.log('❌ Network error');
      throw new Error('اتصال اینترنت خود را بررسی کنید.');
    } else {
      console.error('❌ Upload error:', error);
      throw error;
    }
  }
};

// ==================== Delete Single Image from Draft ====================
export const deleteImageFromDraft = async (imageId) => {
  try {
    const token = await AsyncStorage.getItem('id_token');

    const response = await axios.delete(`${API_BASE}/delete-image`, {
      params: {
        token,
        image_id: imageId,
      },
    });

    return response.data;
  } catch (error) {
    // console.error('Error deleting image:', error);
    throw error;
  }
};

// ==================== Delete Single Video from Draft ====================
export const deleteVideoFromDraft = async (videoId) => {
  try {
    const token = await AsyncStorage.getItem('id_token');

    const response = await axios.delete(`${API_BASE}/delete-video`, {
      params: {
        token,
        video_id: videoId,
      },
    });

    return response.data;
  } catch (error) {
    // console.error('Error deleting video:', error);
    throw error;
  }
};

// ==================== Delete Entire Draft ====================
export const deleteDraft = async (draftId) => {
  try {
    const token = await AsyncStorage.getItem('id_token');

    const response = await axios.delete(`${API_BASE}/delete-property`, {
      params: {
        token,
        worker_id: draftId,
      },
    });

    return response.data;
  } catch (error) {
    // console.error('Error deleting draft:', error);
    throw error;
  }
};

// ==================== Finalize Draft (Publish) ====================
// در api.js
export const finalizeDraft = async (draftId, data) => {
    try {
      const token = await AsyncStorage.getItem('id_token');
  
      const response = await axios.post(
        `${API_BASE}/post-model-with-images`,
        {},
        {
          params: {
            token,
            exid: draftId,
            category_id: data.category_id,
            title: data.title || '',
            description: data.description || '',
            note: data.note || '',
            properties: JSON.stringify(data.properties || []),
            status: 1, // Published
            phone: data.phone || '000',
          },
        }
      );
  
      return response.data.worker;
    } catch (error) {
      // console.error('Error finalizing draft:', error);
      throw error;
    }
  };

// ==================== Get Property for Edit ====================
export const getPropertyById = async (propertyId) => {
  try {
    const token = await AsyncStorage.getItem('id_token');

    const response = await axios.get(`${API_BASE}/get-property`, {
      params: {
        token,
        worker_id: propertyId,
      },
    });

    // Alert.alert('get-property loaded');
    return response.data.worker;
  } catch (error) {
    // console.error('Error loading property:', error);
    // throw error;
    // Alert.alert('error in load get-property')
  }
};