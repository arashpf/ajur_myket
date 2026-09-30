// VideoTrimmer.js - COMPLETE WITH LOADING STATE AND FIXED LAYOUT
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import VideoPlayer from 'react-native-video';
import {Video, getVideoMetaData} from 'react-native-compressor';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const VideoTrimmer = ({
  videoUri,
  onTrimmedAndCompressed,
  onUploadVideo,
  onCompressionStart,
  onCompressionEnd,
  onCloseTrimmer,
  onCloseTrimmer2,
  setCompressingVideoUri,
  isLoading,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [error, setError] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    if (videoUri) {
      console.log('📹 VideoTrimmer mounted with URI:', videoUri);
      setModalVisible(true);
      setError(null);
      setPaused(false);
      setIsProcessing(false);
      setIsCompressing(false);
    }
  }, [videoUri]);

  // ============ محاسبه بیت‌ریت ============
  const calculateBitrate = (fileSize, duration) => {
    const sizeInBits = fileSize * 8;
    const bitrate = sizeInBits / duration;
    return bitrate / 1000; // بازگشت به kbps
  };

  // ============ تشخیص نیاز به فشرده‌سازی ============
  const shouldCompress = (fileSizeMB, duration, bitrate) => {
    const rules = {
      sizeTooBig: fileSizeMB > 20,
      durationTooLong: duration > 30,
      bitrateTooHigh: bitrate > 8000,
      sizeAndDuration: fileSizeMB > 10 && duration > 15,
    };
    
    const needsCompression = 
      rules.sizeTooBig || 
      rules.durationTooLong || 
      rules.bitrateTooHigh || 
      rules.sizeAndDuration;
    
    console.log('📊 Compression decision:', {
      fileSize: `${fileSizeMB.toFixed(2)} MB`,
      duration: `${duration.toFixed(1)}s`,
      bitrate: `${bitrate.toFixed(0)} kbps`,
      needsCompression,
      rules
    });
    
    return needsCompression;
  };

  // ============ تعیین سطح فشرده‌سازی ============
  const getCompressionLevel = (fileSizeMB, duration, bitrate) => {
    let level = 'medium';
    let score = 0;
    
    if (fileSizeMB > 50) score += 3;
    else if (fileSizeMB > 30) score += 2;
    else if (fileSizeMB > 15) score += 1;
    
    if (duration > 60) score += 2;
    else if (duration > 30) score += 1;
    
    if (bitrate > 12000) score += 2;
    else if (bitrate > 8000) score += 1;
    
    if (score >= 5) level = 'aggressive';
    else if (score >= 3) level = 'medium';
    else if (score >= 1) level = 'light';
    else level = 'none';
    
    console.log('📊 Compression level:', {
      score,
      level,
      fileSize: `${fileSizeMB.toFixed(2)} MB`,
      duration: `${duration.toFixed(1)}s`,
      bitrate: `${bitrate.toFixed(0)} kbps`
    });
    
    return level;
  };

  // ============ دریافت تنظیمات بر اساس سطح ============
  const getCompressionSettings = (level, originalBitrate) => {
    switch (level) {
      case 'aggressive':
        return {
          maxWidth: 1280,
          quality: 'high',
          maxBitrate: Math.min(originalBitrate * 0.5, 5000),
          compressionMethod: 'auto',
          framerate: 30,
        };
        
      case 'medium':
        return {
          maxWidth: 1600,
          quality: 'high',
          maxBitrate: Math.min(originalBitrate * 0.7, 8000),
          compressionMethod: 'auto',
          framerate: 30,
        };
        
      case 'light':
        return {
          maxWidth: 1920,
          quality: 'high',
          maxBitrate: Math.min(originalBitrate * 0.85, 12000),
          compressionMethod: 'auto',
          framerate: 30,
        };
        
      case 'none':
      default:
        return {
          maxWidth: 1920,
          quality: 'high',
          maxBitrate: originalBitrate * 1.2,
          compressionMethod: 'auto',
          framerate: 30,
        };
    }
  };

  const handleConfirm = () => {
    console.log('✅ Confirm button pressed');
    setModalVisible(false);
    
    if (setCompressingVideoUri) {
      setCompressingVideoUri(videoUri);
    }
    
    if (onCompressionStart) {
      console.log('📹 Calling onCompressionStart');
      onCompressionStart();
    }
    
    processVideoInBackground();
  };

  const processVideoInBackground = async () => {
    console.log('🔄 Starting smart compression...');
    setIsProcessing(true);
    setIsCompressing(true);
    setError(null);

    try {
      // ============ مرحله 1: دریافت متادیتا ============
      console.log('📊 Getting video metadata...');
      const metaData = await getVideoMetaData(videoUri);
      console.log('📊 Metadata:', metaData);
      
      // ============ مرحله 2: محاسبه پارامترها ============
      const fileSizeBytes = metaData.size || 0;
      const fileSizeMB = fileSizeBytes / (1024 * 1024);
      const duration = metaData.duration || 0;
      const bitrate = calculateBitrate(fileSizeBytes, duration);
      
      console.log('📊 Video stats:', {
        fileSize: `${fileSizeMB.toFixed(2)} MB`,
        duration: `${duration.toFixed(1)}s`,
        bitrate: `${bitrate.toFixed(0)} kbps`
      });
      
      // ============ مرحله 3: نمایش Alert اطلاعات ویدیو ============
      // Alert.alert(
      //   '📹 اطلاعات ویدیو',
      //   `حجم: ${fileSizeMB.toFixed(2)} MB\n` +
      //   `مدت: ${duration.toFixed(0)} ثانیه\n` +
      //   `بیت‌ریت: ${bitrate.toFixed(0)} kbps\n\n` +
      //   `در حال بررسی نیاز به فشرده‌سازی...`,
      //   [{ text: 'OK' }]
      // );
      
      // ============ مرحله 4: تصمیم‌گیری برای فشرده‌سازی ============
      const needsCompression = shouldCompress(fileSizeMB, duration, bitrate);
      
      if (!needsCompression) {
        console.log('✅ No compression needed, using original video');
        
        // Alert.alert(
        //   '✅ نیازی به فشرده‌سازی نیست',
        //   `ویدیو با حجم ${fileSizeMB.toFixed(2)} MB کیفیت اصلی حفظ میشود.`,
        //   [{ text: 'OK' }]
        // );
        
        onTrimmedAndCompressed(videoUri);
        if (onUploadVideo) {
          await onUploadVideo(videoUri);
        }
        return;
      }
      
      // ============ مرحله 5: تعیین سطح فشرده‌سازی ============
      const compressionLevel = getCompressionLevel(fileSizeMB, duration, bitrate);
      const settings = getCompressionSettings(compressionLevel, bitrate);
      
      console.log('🗜️ Compression settings:', settings);
      
      // ============ مرحله 6: نمایش Alert فشرده‌سازی ============
      const levelNames = {
        'aggressive': 'سنگین (کاهش کیفیت)',
        'medium': 'متوسط',
        'light': 'سبک',
        'none': 'بدون فشرده‌سازی'
      };
      
      // Alert.alert(
      //   '🗜️ فشرده‌سازی ویدیو',
      //   `سطح فشرده‌سازی: ${levelNames[compressionLevel]}\n\n` +
      //   `حجم فعلی: ${fileSizeMB.toFixed(2)} MB\n` +
      //   `مدت: ${duration.toFixed(0)} ثانیه\n\n` +
      //   `در حال فشرده‌سازی...`,
      //   [{ text: 'OK' }]
      // );
      
      // ============ مرحله 7: اجرای فشرده‌سازی ============
      console.log('🗜️ Compressing video with level:', compressionLevel);
      const compressedVideoUri = await Video.compress(videoUri, settings);
      console.log('✅ Compression complete:', compressedVideoUri);
      
      // ============ مرحله 8: دریافت اطلاعات ویدیوی فشرده شده ============
      const compressedMetaData = await getVideoMetaData(compressedVideoUri);
      const compressedSizeMB = compressedMetaData.size / (1024 * 1024);
      const compressionRatio = ((fileSizeMB - compressedSizeMB) / fileSizeMB * 100);
      
      console.log('📊 Compression result:', {
        originalSize: `${fileSizeMB.toFixed(2)} MB`,
        compressedSize: `${compressedSizeMB.toFixed(2)} MB`,
        saved: `${compressionRatio.toFixed(0)}%`
      });
      
      // ============ مرحله 9: نمایش نتیجه ============
      // Alert.alert(
      //   '✅ فشرده‌سازی کامل شد',
      //   `حجم اولیه: ${fileSizeMB.toFixed(2)} MB\n` +
      //   `حجم جدید: ${compressedSizeMB.toFixed(2)} MB\n` +
      //   `کاهش حجم: ${compressionRatio.toFixed(0)}%\n\n` +
      //   `کیفیت: ${compressionLevel === 'aggressive' ? 'کمی کاهش یافته' : 'حفظ شده'}`,
      //   [{ text: 'OK' }]
      // );

      // ============ مرحله 10: آپلود ============
      onTrimmedAndCompressed(compressedVideoUri);
      
      if (onUploadVideo) {
        console.log('📤 Uploading compressed video...');
        try {
          await onUploadVideo(compressedVideoUri);
          console.log('✅ Upload complete');
        } catch (uploadError) {
          console.error('❌ Upload error:', uploadError);
          setError('خطا در آپلود ویدیو');
        }
      }
      
    } catch (error) {
      console.error('❌ Processing error:', error);
      setError('خطا در پردازش ویدیو');
      console.log('🔄 Using original video as fallback');
      onTrimmedAndCompressed(videoUri);
    } finally {
      console.log('🏁 Processing finished');
      setIsProcessing(false);
      setIsCompressing(false);
      
      if (setCompressingVideoUri) {
        setCompressingVideoUri(null);
      }
      
      if (onCompressionEnd) {
        console.log('📹 Calling onCompressionEnd');
        onCompressionEnd();
      }
      
      if (onCloseTrimmer) {
        console.log('❌ Closing trimmer');
        onCloseTrimmer();
      }
    }
  };

  const handleCancel = () => {
    console.log('❌ Cancel button pressed - removing video');
    setModalVisible(false);
    if (onCloseTrimmer) {
      onCloseTrimmer();
    }
  };

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleCancel}
      style={{ margin: 0 }}
    >
      <View style={styles.fullScreenContainer}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={handleCancel} 
            style={styles.closeButton}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Icon name="close" size={30} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isLoading ? 'در حال بارگذاری ویدیو...' : 'پیش‌نمایش ویدیو'}
          </Text>
          <View style={{ width: 50 }} />
        </View>

        {/* Video Player - 90% of screen */}
        <View style={styles.videoContainer}>
          {isLoading ? (
            <View style={styles.loadingVideoContainer}>
              <ActivityIndicator size="large" color="white" />
            </View>
          ) : videoUri ? (
            <VideoPlayer
              source={{uri: videoUri}}
              style={styles.videoPlayer}
              controls
              resizeMode="contain"
              paused={paused}
              muted={paused}
            />
          ) : null}
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Processing Indicator */}
        {isCompressing && (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="white" />
            <Text style={styles.processingText}>در حال فشرده‌سازی ویدیو...</Text>
          </View>
        )}

        {/* Bottom Buttons - 10% of screen */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity 
            style={[styles.button, styles.skipButton, (isLoading || isProcessing) && styles.buttonDisabled]}
            onPress={handleCancel}
            disabled={isLoading || isProcessing}
          >
            <Text style={[styles.skipButtonText, (isLoading || isProcessing) && styles.buttonTextDisabled]}>
              رد کردن
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.confirmButton, (isLoading || isProcessing) && styles.buttonDisabled]}
            onPress={handleConfirm}
            disabled={isLoading || isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="white" />
            ) : isLoading ? (
              <Text style={styles.confirmButtonText}>در حال بارگذاری...</Text>
            ) : (
              <Text style={styles.confirmButtonText}>تایید ویدیو</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: 80,
  },
  
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'iransans',
    color: 'white',
  },
  
  closeButton: {
    padding: 12,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.15)',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },

  // ============ Video - 90% of screen ============
  videoContainer: {
    flex: 9,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  
  videoPlayer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },

  loadingVideoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  
  loadingVideoText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'iransans',
    marginTop: 12,
  },

  // ============ Bottom Buttons - 10% of screen ============
  bottomButtons: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.9)',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonDisabled: {
    opacity: 0.5,
  },
  
  buttonTextDisabled: {
    color: 'rgba(255,255,255,0.5)',
  },
  
  confirmButton: {
    backgroundColor: '#a92b31',
  },
  
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'iransans',
  },
  
  skipButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  
  skipButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'iransans',
  },

  // ============ Processing Indicator ============
  processingContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 15,
  },
  
  processingText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'iransans',
    marginTop: 12,
  },

  // ============ Error Container ============
  errorContainer: {
    backgroundColor: 'rgba(255,0,0,0.7)',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 100,
    borderRadius: 8,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 15,
  },
  
  errorText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'iransans',
    textAlign: 'center',
  },
});

export default VideoTrimmer;