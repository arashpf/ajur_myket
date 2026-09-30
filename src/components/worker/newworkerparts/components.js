// components.js - COMPLETE WITH EXTRA FIELDS MODAL (FIXED)
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
  TextInput,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
  Keyboard,
  findNodeHandle
} from 'react-native';
import {
  FormControl,
  Input,
  TextArea,
  Box,
  Button,
  Select,
  Actionsheet,
  useDisclose,
  HStack,
  Divider,
  useToast
} from 'native-base';

import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import Modal from 'react-native-modal';
import styles from './styles';
import VideoTrimmer from '../parts/VideoTrimmer';

const { width, height } = Dimensions.get('window');

export const StepIndicator = ({ currentStep, onClose, isEditMode, isDraft }) => {
  const totalSteps = 2;
  
  const getStepTitle = () => {
    if (currentStep === 1) {
      return 'تصاویر و توضیحات';
    } else if (currentStep === 2) {
      return 'مشخصات ملک';
    }
    return '';
  };

  const getSubtitle = () => {
    if (isEditMode) {
      return 'ویرایش ملک';
    }
    if (isDraft) {
      return 'ادامه پیش‌نویس';
    }
    return 'ثبت ملک جدید';
  };
  
  return (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <TouchableOpacity onPress={onClose} style={styles.stepCloseButton}>
          <Icon name="close" size={24} color="#333" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={styles.stepTextTitle}>
            {getSubtitle()}
          </Text>
        </View>
      </View>
      
      <View style={styles.stepProgressWrapper}>
        <View style={styles.stepProgressBar}>
          <View style={[
            styles.stepProgressFill,
            { width: currentStep === 1 ? '50%' : '100%' }
          ]} />
        </View>
        <Text style={styles.stepTextSubtitle}>
          صفحه {currentStep} از {totalSteps}: {getStepTitle()}
        </Text>
      </View>
    </View>
  );
};

export const CategorySelector = ({ selectedCategory, onPress, formatCategoryName }) => {
  return (
    <>
      <TouchableOpacity onPress={onPress} style={styles.categorySelector}>
        <Icon name="chevron-back-outline" size={24} color="#bc323b" />
        <Text
          style={[
            styles.categorySelectorText,
            selectedCategory ? styles.categorySelectorSelected : styles.categorySelectorPlaceholder,
          ]}
        >
          {selectedCategory ? formatCategoryName(selectedCategory.name) : 'دسته بندی را انتخاب کنید'}
        </Text>
      </TouchableOpacity>
    </>
  );
};

export const LocationSelector = ({ 
  selectedLocation, 
  onPress, 
  formatLocationName 
}) => {
  const getDisplayText = () => {
    if (!selectedLocation) {
      return 'انتخاب موقعیت ملک';
    }
    if (selectedLocation.formatted) {
      return selectedLocation.formatted;
    }
    if (selectedLocation.city && selectedLocation.neighbourhood) {
      return `${selectedLocation.city} - ${selectedLocation.neighbourhood}`;
    }
    if (selectedLocation.city) {
      return selectedLocation.city;
    }
    return 'موقعیت ملک را انتخاب کنید';
  };

  return (
    <>
      <TouchableOpacity onPress={onPress} style={styles.locationSelector}>
        <Icon name="chevron-back-outline" size={24} color="#4CAF50" />
        <Text
          style={[
            styles.locationSelectorText,
            selectedLocation ? styles.locationSelectorSelected : styles.locationSelectorPlaceholder,
          ]}
        >
          {getDisplayText()}
        </Text>
        <Icon name="location-outline" size={24} color="#999" />
      </TouchableOpacity>
    </>
  );
};

export const TitleInput = React.forwardRef(({ value, onChangeText }, ref) => {
  const inputRef = useRef(null);
  const isToggling = useRef(false);

  const handleFocus = () => {
    // if (isToggling.current) {
    //   return;
    // }
    
    // isToggling.current = true;
    // Keyboard.dismiss();
    
    // setTimeout(() => {
    //   inputRef.current?.focus();
    //   setTimeout(() => {
    //     isToggling.current = false;
    //   }, 50);
    // }, 100);
  };

  const handleBlur = () => {};

  return (
    <Input
      ref={(el) => {
        inputRef.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) ref.current = el;
      }}
      backgroundColor="white"
      height={60}
      padding={15}
      margin={3}
      borderRadius={10}
      fontFamily="iransans"
      fontSize={16}
      borderColor="gray"
      borderWidth={1}
      _focus={{
        borderColor: '#a92b31',
        borderWidth: 2,
      }}
      value={value}
      onChangeText={onChangeText}
      placeholder="عنوان ملک را اینجا وارد کنید"
      maxLength={90}
      autoFocus
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
});

export const NormalFieldInput = ({ 
  field, 
  value, 
  onChangeText, 
  onBlur,
  numToPersian,
  isRequired,
  formatNumber,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const displayValue = value || '';
  const numValue = displayValue.replace(/[^0-9]/g, '');
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const isToggling = useRef(false);
  const isClearing = useRef(false);
  const isKeyboardVisible = useRef(false);

  useEffect(() => {
    const keyboardDidShow = Keyboard.addListener('keyboardDidShow', () => {
      isKeyboardVisible.current = true;
    });
    const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => {
      isKeyboardVisible.current = false;
    });

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

  const labelAnim = useRef(new Animated.Value(0)).current;
  const isActive = isFocused || displayValue.length > 0;

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isActive ? 1 : 0,
      duration: 200,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isActive]);

  const labelTop = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [22, -8],
  });

  const labelFontSize = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 11],
  });

  const labelColor = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#999', '#bc323b'],
  });

  const labelPaddingHorizontal = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 6],
  });

  const handleClear = () => {
    isClearing.current = true;
    onChangeText('');
    
    setTimeout(() => {
      inputRef.current?.focus();
      setTimeout(() => {
        isClearing.current = false;
      }, 100);
    }, 100);
  };

  const handleContainerPress = () => {
    if (isClearing.current) {
      return;
    }
    inputRef.current?.focus();
  };

  const formatPrice = (text) => {
    if (!text) return '';
    const numbers = text.replace(/[^0-9]/g, '');
    if (!numbers) return '';
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getDisplayText = () => {
    if (displayValue) {
      return formatPrice(displayValue);
    }
    return '';
  };

  const handleChangeText = useCallback((text) => {
    if (isClearing.current) {
      return;
    }
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText === value) {
      return;
    }
    onChangeText(numericText);
  }, [value, onChangeText]);

  const persianText = useMemo(() => {
    if (numValue.length > 0 && numToPersian) {
      return numToPersian(numValue);
    }
    return '';
  }, [numValue, numToPersian]);

  const handleFocus = () => {
    setIsFocused(true);
    
    if (isClearing.current) {
      return;
    }
    
    if (isKeyboardVisible.current) {
      return;
    }
    
    if (isToggling.current) {
      return;
    }
    
    isToggling.current = true;
    Keyboard.dismiss();
    
    setTimeout(() => {
      inputRef.current?.focus();
      setTimeout(() => {
        isToggling.current = false;
      }, 150);
    }, 300);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  return (
    <View style={{ position: 'relative' }}>
      <TouchableWithoutFeedback 
        onPress={handleContainerPress}
        accessible={false}
      >
        <View 
          style={[styles.floatingContainer, isFocused && styles.floatingContainerFocused]}
          pointerEvents="box-only"
          ref={containerRef}
        >
          <Animated.View 
            style={[
              styles.floatingLabelWrapper,
              {
                top: labelTop,
                paddingHorizontal: labelPaddingHorizontal,
              }
            ]}
            pointerEvents="none"
          >
            <Animated.Text 
              style={[
                styles.floatingLabel,
                {
                  fontSize: labelFontSize,
                  color: labelColor,
                }
              ]}
            >
              {field.value}
              {isRequired && <Text style={styles.required}> *</Text>}
              {field.unit && <Text style={styles.floatingLabelUnit}> ({field.unit})</Text>}
            </Animated.Text>
          </Animated.View>
          
          <View style={styles.floatingInputRow}>
            <TextInput
              ref={inputRef}
              style={styles.floatingInput}
              placeholder=""
              placeholderTextColor="transparent"
              keyboardType="numeric"
              value={getDisplayText()}
              onChangeText={handleChangeText}
              onFocus={handleFocus}
              onBlur={handleBlur}
              textAlign="right"
            />
          </View>

          <View style={styles.floatingHint}>
            <Text style={styles.floatingHintText}>
              {persianText}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {displayValue.length > 0 && (
        <TouchableOpacity 
          onPress={handleClear}
          style={[
            styles.floatingClearButton,
            {
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: [{ translateY: -11 }],
              zIndex: 10,
            }
          ]}
          activeOpacity={0.7}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Icon name="close-circle" size={22} color="#999" />
        </TouchableOpacity>
      )}
    </View>
  );
};

// components.js - ImageUploader with Spinner and Retry
export const ImageUploader = ({ 
  images, 
  onAddImage, 
  onOpenCamera,
  onDeleteImage, 
  onSetMainImage,
  onOpenPreview,
  onRetryUpload,
}) => {
  const renderImages = () => {
    return images.map((img, index) => {
      // Get status with fallback
      const uploadStatus = img.uploadStatus || 'uploaded';
      const isUploading = uploadStatus === 'uploading';
      const hasError = uploadStatus === 'error';
      
      // Log status for debugging
      if (isUploading) {
        console.log('⏳ Image still uploading:', img.uri);
      }
      
      return (
        <TouchableOpacity 
          key={img.uri || img._tempId || index} // Use _tempId if available
          onPress={() => {
            if (!isUploading && !hasError) {
              onOpenPreview(img);
            }
          }}
          activeOpacity={isUploading ? 1 : 0.7}
        >
          <ImageBackground 
            source={{ uri: img.uri }} 
            style={styles.imageThumbnail}
            imageStyle={{ borderRadius: 8 }}
          >
            {index === 0 && !isUploading && !hasError && (
              <View style={styles.mainImageBadge}>
                <Text style={styles.mainImageText}>عکس اصلی</Text>
              </View>
            )}
            
            {/* Delete button - always visible */}
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={() => onDeleteImage(img)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="close-circle" size={24} color="red" />
            </TouchableOpacity>

            {/* Status Overlay */}
            {isUploading && (
              <View style={styles.imageStatusOverlay}>
                <ActivityIndicator size="large" color="white" />
              </View>
            )}

            {hasError && (
              <View style={styles.imageStatusOverlay}>
                <TouchableOpacity 
                  onPress={() => onRetryUpload && onRetryUpload(img)}
                  style={styles.imageRetryButton}
                >
                  <Icon name="refresh-circle" size={40} color="#ff6b6b" />
                </TouchableOpacity>
              </View>
            )}
          </ImageBackground>
        </TouchableOpacity>
      );
    });
  };

  const handleAddImage = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      onAddImage();
    }, 150);
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>عکس های ملک</Text>
      <Text style={styles.sectionSubtitle}>
        ملک هایی که عکس های با کیفیتی دارند در آجر تا ۵ برابر بیشتر دیده میشوند
      </Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {images.length < 11 && (
          <TouchableOpacity 
            onPress={handleAddImage}
            style={styles.addButton}
            activeOpacity={0.7}
          >
            <Icon name="image-outline" size={50} color="gray" />
            <Text style={styles.addButtonText}>انتخاب عکس جدید</Text>
          </TouchableOpacity>
        )}
        {renderImages()}
      </ScrollView>
    </View>
  );
};

export const VideoUploader = ({ 
  videos, 
  onAddVideo, 
  onDeleteVideo,
  onOpenPreview,
  videoModalVisible,
  selectedVideo,
  onCloseVideoPreview,
  paused,
  showTrimmer,
  selectedVideoUri,
  onTrimmedAndCompressed,
  onCloseTrimmer,
  onCloseTrimmer2,
  isVideoUploading,
  videoUploadProgress,
  currentUploadVideoUri,
  onCancelUpload,
  onUploadVideo,
  isCompressing,
  compressingVideoUri,
  onCompressionStart,
  onCompressionEnd,
  isLoading,
  onRetryUpload,
}) => {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideoForModal, setSelectedVideoForModal] = useState(null);
  const [localCompressing, setLocalCompressing] = useState(false);

  useEffect(() => {}, [selectedVideo]);

  const openVideoOptionsModal = (video) => {
    setSelectedVideoForModal(video);
    setShowVideoModal(true);
  };

  const handleCompressionStart = () => {
    console.log('📹 Compression started');
    setLocalCompressing(true);
    if (onCompressionStart) {
      onCompressionStart();
    }
  };
  
  const handleCompressionEnd = () => {
    console.log('📹 Compression ended');
    setLocalCompressing(false);
    if (onCompressionEnd) {
      onCompressionEnd();
    }
  };

  const renderVideos = () => {
    console.log('📹 Rendering videos:', videos.length);
    
    return videos.map((vd, index) => {
      const isCurrentUploading = isVideoUploading && currentUploadVideoUri === vd.uri;
      const isCurrentCompressing = vd.isProcessing === true || 
                                   ((isCompressing || localCompressing) && compressingVideoUri === vd.uri);
      const isUploaded = !isCurrentUploading && !isCurrentCompressing && vd.uri && !vd.error && vd.uploadStatus !== 'error';
      const hasError = vd.error === true || vd.uploadStatus === 'error';
      const hasThumbnail = vd.thumbnail && vd.thumbnail !== null;
      const imageSource = hasThumbnail ? { uri: vd.thumbnail } : null;
      
      // Check if this specific video is being uploaded
      const isThisUploading = isVideoUploading && currentUploadVideoUri === vd.uri;
      const uploadPercent = isThisUploading ? Math.round(videoUploadProgress || 0) : 0;
  
      console.log(`📹 Video ${index} - isProcessing: ${vd.isProcessing}, hasError: ${hasError}`);
  
      return (
        <TouchableOpacity 
          key={vd.uri || index} 
          onPress={() => {
            if (!isCurrentUploading && !isCurrentCompressing && !hasError) {
              openVideoOptionsModal(vd);
            }
          }}
          style={styles.videoThumbnailWrapper}
          activeOpacity={isCurrentUploading || isCurrentCompressing ? 1 : 0.7}
        >
          {imageSource ? (
            <ImageBackground 
              source={imageSource}
              style={styles.videoThumbnail}
              imageStyle={{ borderRadius: 8 }}
            >
              {isUploaded && vd.duration && (
                <View style={styles.videoDurationBadge}>
                  <Icon name="time-outline" size={12} color="white" />
                  <Text style={styles.videoDurationText}>{vd.duration}</Text>
                </View>
              )}
              
              {/* Upload Progress Overlay */}
              {isThisUploading && (
                <View style={styles.videoProgressOverlay}>
                  <View style={styles.videoProgressCircle}>
                    <Text style={styles.videoProgressPercent}>
                      {uploadPercent}%
                    </Text>
                  </View>
                </View>
              )}
              
              {/* Error Overlay with Retry */}
              {hasError && !isCurrentUploading && !isCurrentCompressing && (
                <View style={styles.videoProgressOverlay}>
                  <TouchableOpacity 
                    onPress={() => {
                      if (onRetryUpload && vd) {
                        onRetryUpload(vd);
                      }
                    }}
                    style={styles.videoRetryButton}
                  >
                    <Icon name="refresh-circle" size={40} color="#ff6b6b" />
                  </TouchableOpacity>
                </View>
              )}
            </ImageBackground>
          ) : (
            <View style={[styles.videoThumbnail, styles.videoPlaceholder]}>
              {isCurrentCompressing ? (
                <>
                  <ActivityIndicator size="large" color="white" />
                  <Text style={styles.videoProgressText}>فشرده‌سازی</Text>
                </>
              ) : isThisUploading ? (
                <>
                  <ActivityIndicator size="large" color="white" />
                  <Text style={styles.videoProgressText}>
                    {uploadPercent}%
                  </Text>
                </>
              ) : hasError ? (
                <TouchableOpacity 
                  onPress={() => {
                    if (onRetryUpload && vd) {
                      onRetryUpload(vd);
                    }
                  }}
                  style={{ alignItems: 'center' }}
                >
                  <Icon name="refresh-circle" size={40} color="#ff6b6b" />
                  <Text style={[styles.videoProgressText, { fontSize: 12, marginTop: 4 }]}>
                    تلاش مجدد
                  </Text>
                </TouchableOpacity>
              ) : (
                <Icon name="play-circle" size={50} color="white" />
              )}
            </View>
          )}
        </TouchableOpacity>
      );
    });
  };

  const renderVideoOptionsModal = () => {
    if (!selectedVideoForModal) return null;

    const isCurrentUploading = isVideoUploading && currentUploadVideoUri === selectedVideoForModal.uri;
    const isCurrentCompressing = (isCompressing || localCompressing) && 
                                 compressingVideoUri === selectedVideoForModal.uri;
    const isUploaded = !isCurrentUploading && !isCurrentCompressing && 
                       selectedVideoForModal.uri && !selectedVideoForModal.error;
    const hasError = selectedVideoForModal.error === true;

    return (
      <Modal
        isVisible={showVideoModal}
        onBackdropPress={() => setShowVideoModal(false)}
        style={{ justifyContent: 'flex-end', margin: 0 }}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.3}
      >
        <View style={styles.retryModalContainer}>
          <View style={styles.retryModalGrabber} />

          {isCurrentCompressing && (
            <>
              <View style={styles.videoModalInfo}>
                <ActivityIndicator size="small" color="#a92b31" />
              </View>
              <TouchableOpacity 
                style={[styles.retryModalItem, styles.retryModalItemDanger]}
                onPress={() => {
                  setShowVideoModal(false);
                  if (selectedVideoForModal) {
                    onDeleteVideo(selectedVideoForModal);
                    if (onCloseTrimmer) {
                      onCloseTrimmer();
                    }
                  }
                }}
              >
                <Icon name="trash-outline" size={22} color="#ff6b6b" />
                <Text style={styles.retryModalItemDangerText}>لغو و حذف ویدیو</Text>
              </TouchableOpacity>
            </>
          )}

          {isCurrentUploading && (
            <>
              <View style={styles.videoModalInfo}>
                <ActivityIndicator size="small" color="#a92b31" />
                <Text style={styles.videoModalInfoText}>در حال آپلود ویدیو...</Text>
                <Text style={[styles.videoModalInfoText, { fontSize: 14, color: '#666' }]}>
                  {videoUploadProgress || 0}%
                </Text>
              </View>
              <TouchableOpacity 
                style={[styles.retryModalItem, styles.retryModalItemDanger]}
                onPress={() => {
                  setShowVideoModal(false);
                  if (selectedVideoForModal) {
                    onDeleteVideo(selectedVideoForModal);
                    if (onCancelUpload) onCancelUpload();
                  }
                }}
              >
                <Icon name="trash-outline" size={22} color="#ff6b6b" />
                <Text style={styles.retryModalItemDangerText}>لغو و حذف ویدیو</Text>
              </TouchableOpacity>
            </>
          )}

          {isUploaded && (
            <>
              <View style={styles.videoModalInfo}>
                <Icon name="checkmark-circle" size={22} color="#4CAF50" />
                <Text style={styles.videoModalInfoText}>ویدیو با موفقیت آپلود شد</Text>
              </View>
              <TouchableOpacity 
                style={styles.retryModalItem}
                onPress={() => {
                  setShowVideoModal(false);
                  if (selectedVideoForModal) {
                    onOpenPreview(selectedVideoForModal);
                  }
                }}
              >
                <Icon name="eye-outline" size={22} color="#333" />
                <Text style={styles.retryModalItemText}>مشاهده ویدیو</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.retryModalItem, styles.retryModalItemDanger]}
                onPress={() => {
                  setShowVideoModal(false);
                  if (selectedVideoForModal) {
                    onDeleteVideo(selectedVideoForModal);
                  }
                }}
              >
                <Icon name="trash-outline" size={22} color="#ff6b6b" />
                <Text style={styles.retryModalItemDangerText}>حذف ویدیو</Text>
              </TouchableOpacity>
            </>
          )}

          {hasError && (
            <>
              <View style={styles.videoModalInfo}>
                <Icon name="alert-circle" size={22} color="#ff6b6b" />
                <Text style={[styles.videoModalInfoText, styles.videoModalInfoTextError]}>
                  خطا در آپلود ویدیو
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.retryModalItem}
                onPress={() => {
                  setShowVideoModal(false);
                  if (onRetryUpload && selectedVideoForModal) {
                    onRetryUpload(selectedVideoForModal);
                  }
                }}
              >
                <Icon name="refresh-outline" size={22} color="#333" />
                <Text style={styles.retryModalItemText}>تلاش مجدد برای بارگذاری</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.retryModalItem, styles.retryModalItemDanger]}
                onPress={() => {
                  setShowVideoModal(false);
                  if (selectedVideoForModal) {
                    onDeleteVideo(selectedVideoForModal);
                  }
                }}
              >
                <Icon name="trash-outline" size={22} color="#ff6b6b" />
                <Text style={styles.retryModalItemDangerText}>حذف ویدیو</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity 
            style={styles.retryModalCancel}
            onPress={() => setShowVideoModal(false)}
          >
            <Text style={styles.retryModalCancelText}>انصراف</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>ویدیوهای ملک</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {videos.length === 0 && (
          <TouchableOpacity onPress={onAddVideo} style={styles.addButton}>
            <Icon name="videocam" size={40} color="gray" />
            <Text style={styles.addButtonText}>افزودن ویدیو</Text>
          </TouchableOpacity>
        )}
        {renderVideos()}
      </ScrollView>

      <Modal
        isVisible={showTrimmer}
        onBackdropPress={onCloseTrimmer2}
        style={{ justifyContent: 'center', margin: 0 }}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.6}
      >
        <View style={styles.trimmerModalContainer}>
          <View style={styles.trimmerModalContent}>
            <View style={styles.trimmerHeader}>
              <Text style={styles.trimmerModalTitle}>فرایند فشرده سازی شروع شد</Text>
              <TouchableOpacity onPress={onCloseTrimmer2} style={styles.trimmerCloseButton}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            {selectedVideoUri && (
              <VideoTrimmer
                videoUri={selectedVideoUri}
                onTrimmedAndCompressed={onTrimmedAndCompressed}
                onUploadVideo={onUploadVideo}
                onCompressionStart={handleCompressionStart}
                onCompressionEnd={handleCompressionEnd}
                onCloseTrimmer={onCloseTrimmer}
                onCloseTrimmer2={onCloseTrimmer2}
                isLoading={isLoading}
              />
            )}
          </View>
        </View>
      </Modal>

      <Modal
        isVisible={videoModalVisible}
        onBackdropPress={onCloseVideoPreview}
        style={{ margin: 0 }}
        animationIn="fadeIn"
        animationOut="fadeOut"
      >
        <View style={styles.videoModalFullContainer}>
          <View style={styles.videoModalFullHeader}>
            <TouchableOpacity 
              onPress={onCloseVideoPreview}
              style={styles.videoModalFullCloseButton}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <Icon name="close" size={32} color="white" />
            </TouchableOpacity>
            <Text style={styles.videoModalFullHeaderTitle}>پیش‌نمایش ویدیو</Text>
          </View>

          {selectedVideo && (
            <Video
              source={{ uri: selectedVideo.uri }}
              style={styles.videoModalFullPlayer}
              controls
              resizeMode="cover"
              paused={paused}
              repeat={false}
            />
          )}
        </View>
      </Modal>

      {renderVideoOptionsModal()}
    </View>
  );
};

export const TickFieldSelector = ({ 
  field, 
  value, 
  onSelect,
  isRequired,
}) => {
  const [selectedOption, setSelectedOption] = useState(value ? 'دارد' : '');
  
  useEffect(() => {
    if (value === 1) {
      setSelectedOption('دارد');
    } else if (value === 0) {
      setSelectedOption('ندارد');
    } else {
      setSelectedOption('');
    }
  }, [value]);

  const handleSelect = (option) => {
    setSelectedOption(option);
    if (option === 'دارد') {
      onSelect(1);
    } else if (option === 'ندارد') {
      onSelect(0);
    } else {
      onSelect('');
    }
  };

  return (
    <View style={styles.tickFieldContainer}>
      <View style={styles.tickFieldOptions}>
        <TouchableOpacity
          style={[
            styles.tickFieldOption,
            selectedOption === 'ندارد' && styles.tickFieldOptionSelected,
          ]}
          onPress={() => handleSelect('ندارد')}
        >
          <Text style={[
            styles.tickFieldOptionText,
            selectedOption === 'ندارد' && styles.tickFieldOptionTextSelected,
          ]}>
            ندارد
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tickFieldOption,
            selectedOption === 'دارد' && styles.tickFieldOptionSelected,
          ]}
          onPress={() => handleSelect('دارد')}
        >
          <Text style={[
            styles.tickFieldOptionText,
            selectedOption === 'دارد' && styles.tickFieldOptionTextSelected,
          ]}>
            دارد
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.tickFieldLabel}>
        {field.value}
        {isRequired && <Text style={styles.required}> *</Text>}
      </Text>
    </View>
  );
};


export const ExtraFieldsModal = ({
  isVisible,
  onClose,
  onConfirm,
  normalFields,
  tickFields,
  predefineFields,
  properties,
  onUpsertProperty,
  onRemoveProperty,
  formatNumber,
  numToPersian,
}) => {
  // ============ استفاده از properties به جای localProperties ============
  // برای جلوگیری از desync با properties اصلی

  const handleNormalFieldChange = (fieldName, text, fieldSpecial, fieldSort) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length > 0) {
      // مستقیماً properties رو به‌روز کن
      onUpsertProperty({
        name: fieldName,
        value: numericText,
        kind: 1,
        special: fieldSpecial,
        order: fieldSort,
      });
    } else {
      onRemoveProperty(fieldName);
    }
  };

  const handleTickSelect = (fieldName, value, special) => {
    if (value === 1 || value === 0) {
      onUpsertProperty({
        name: fieldName,
        value: value,
        kind: 2,
        special: special,
      });
    } else {
      onRemoveProperty(fieldName);
    }
  };

  const handlePredefineChange = (fieldName, value, special, sort) => {
    if (value && value !== '') {
      onUpsertProperty({
        name: fieldName,
        value: value,
        kind: 3,
        special: special || 0,
        order: sort || 0,
      });
    } else {
      onRemoveProperty(fieldName);
    }
  };

  const getFieldValue = (fieldName) => {
    const existing = properties.find(p => p.name === fieldName);
    return existing ? String(existing.value) : '';
  };

  const getTickValue = (fieldName) => {
    const existing = properties.find(p => p.name === fieldName);
    return existing ? Number(existing.value) : null;
  };

  // ============ تابع Confirm برای بستن مودال ============
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={{ margin: 0 }}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
    >
      <View style={styles.extraFieldsModalContainer}>
        <View style={styles.extraFieldsModalHeader}>
          <Text style={styles.extraFieldsModalTitle}>سایر ویژگی‌ها و امکانات</Text>
          <TouchableOpacity onPress={onClose} style={styles.extraFieldsModalClose}>
            <Icon name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.extraFieldsModalContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Normal Fields - Optional */}
          {normalFields.filter(f => f.special === "0").map((fl) => {
            const currentValue = getFieldValue(fl.value);
            return (
              <NormalFieldInput
                key={`modal_normal_${fl.value}`}
                field={fl}
                value={currentValue}
                onChangeText={(text) => handleNormalFieldChange(fl.value, text, fl.special, fl.sort)}
                numToPersian={numToPersian}
                isRequired={false}
                formatNumber={formatNumber}
              />
            );
          })}

          {/* Tick Fields - Optional */}
          {tickFields.filter(f => f.special === "0").map((fl) => {
            const currentValue = getTickValue(fl.value);
            return (
              <TickFieldSelector
                key={`modal_tick_${fl.id}`}
                field={fl}
                value={currentValue}
                onSelect={(value) => handleTickSelect(fl.value, value, fl.special)}
                isRequired={false}
              />
            );
          })}

          {/* Predefine Fields - Optional */}
          {predefineFields.filter(f => f.special === "0").map((fl) => {
            const currentValue = getFieldValue(fl.value);
            return (
              <View key={`modal_pre_${fl.id}`} style={styles.predefined_Wrapper}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.predefinedLabel}>{fl.value}</Text>
                  <Select
                    minWidth="100%"
                    placeholder="انتخاب کنید"
                    placeholderTextColor="gray.500"
                    style={{ fontFamily: 'iransans', fontSize: 16 }}
                    selectedValue={currentValue}
                    onValueChange={(value) => handlePredefineChange(fl.value, value, fl.special, fl.sort)}
                    _actionSheet={{
                      _backdrop: { bg: 'transparent' },
                      _header: {
                        bg: 'white',
                        borderBottomWidth: 1,
                        borderBottomColor: '#bc323b',
                        paddingVertical: 16,
                      },
                      _title: {
                        color: '#333',
                        fontSize: 18,
                        fontWeight: 'bold',
                        fontFamily: 'iransans',
                        textAlign: 'center',
                      },
                      _body: { bg: 'white' },
                    }}
                    _item={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      _text: {
                        textAlign: 'center',
                        fontFamily: 'iransans',
                        fontSize: 16,
                        color: '#333',
                      },
                    }}
                    _selectedItem={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      bg: '#fef0f1',
                      _text: {
                        textAlign: 'center',
                        fontFamily: 'iransans',
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#a92b31',
                      },
                    }}
                  >
                    <Select.Item disabled value="" label="-" _text={{ textAlign: 'center', fontFamily: 'iransans', color: '#999' }} />
                    {fl.varchars && fl.varchars.map((vr) => (
                      <Select.Item key={vr.id} label={vr.value} value={vr.value} _text={{ textAlign: 'center', fontFamily: 'iransans', color: '#333' }} />
                    ))}
                  </Select>
                </View>
              </View>
            );
          })}

          <View style={{ height: 20 }} />
        </ScrollView>

        <View style={styles.extraFieldsModalFooter}>
          <TouchableOpacity style={styles.extraFieldsModalConfirm} onPress={handleConfirm}>
            <Text style={styles.extraFieldsModalConfirmText}>تأیید</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// export const ExtraFieldsModal = ({
//   isVisible,
//   onClose,
//   onConfirm,
//   normalFields,
//   tickFields,
//   predefineFields,
//   properties,
//   onUpsertProperty,
//   onRemoveProperty,
//   formatNumber,
//   numToPersian,
// }) => {
//   const [localProperties, setLocalProperties] = useState(properties || []);

//   useEffect(() => {
//     if (isVisible) {
//       setLocalProperties(properties || []);
//     }
//   }, [isVisible, properties]);

//   const handleNormalFieldChange = (fieldName, text, fieldSpecial, fieldSort) => {
//     const numericText = text.replace(/[^0-9]/g, '');
//     if (numericText.length > 0) {
//       const existing = localProperties.find(p => p.name === fieldName);
//       if (existing) {
//         setLocalProperties(prev => 
//           prev.map(p => p.name === fieldName ? { ...p, value: numericText } : p)
//         );
//       } else {
//         setLocalProperties(prev => [...prev, {
//           name: fieldName,
//           value: numericText,
//           kind: 1,
//           special: fieldSpecial,
//           order: fieldSort,
//         }]);
//       }
//     } else {
//       setLocalProperties(prev => prev.filter(p => p.name !== fieldName));
//     }
//   };

//   const handleTickSelect = (fieldName, value, special) => {
//     if (value === 1 || value === 0) {
//       const existing = localProperties.find(p => p.name === fieldName);
//       if (existing) {
//         setLocalProperties(prev => 
//           prev.map(p => p.name === fieldName ? { ...p, value: value } : p)
//         );
//       } else {
//         setLocalProperties(prev => [...prev, {
//           name: fieldName,
//           value: value,
//           kind: 2,
//           special: special,
//         }]);
//       }
//     } else {
//       setLocalProperties(prev => prev.filter(p => p.name !== fieldName));
//     }
//   };

//   const handlePredefineChange = (fieldName, value, special, sort) => {
//     if (value && value !== '') {
//       const existing = localProperties.find(p => p.name === fieldName);
//       if (existing) {
//         setLocalProperties(prev => 
//           prev.map(p => p.name === fieldName ? { ...p, value: value } : p)
//         );
//       } else {
//         setLocalProperties(prev => [...prev, {
//           name: fieldName,
//           value: value,
//           kind: 3,
//           special: special || 0,
//           order: sort || 0,
//         }]);
//       }
//     } else {
//       setLocalProperties(prev => prev.filter(p => p.name !== fieldName));
//     }
//   };

//   const getFieldValue = (fieldName) => {
//     const existing = localProperties.find(p => p.name === fieldName);
//     return existing ? String(existing.value) : '';
//   };

//   const getTickValue = (fieldName) => {
//     const existing = localProperties.find(p => p.name === fieldName);
//     return existing ? Number(existing.value) : null;
//   };

//   const handleConfirm = () => {
//     const optionalFieldNames = [
//       ...normalFields.filter(f => f.special === "0").map(f => f.value),
//       ...tickFields.filter(f => f.special === "0").map(f => f.value),
//       ...predefineFields.filter(f => f.special === "0").map(f => f.value),
//     ];

//     optionalFieldNames.forEach(name => {
//       onRemoveProperty(name);
//     });

//     localProperties.forEach(prop => {
//       onUpsertProperty(prop);
//     });

//     onConfirm();
//     onClose();
//   };

//   return (
//     <Modal
//       isVisible={isVisible}
//       onBackdropPress={onClose}
//       style={{ margin: 0 }}
//       animationIn="slideInUp"
//       animationOut="slideOutDown"
//       backdropOpacity={0.5}
//     >
//       <View style={styles.extraFieldsModalContainer}>
//         <View style={styles.extraFieldsModalHeader}>
//           <Text style={styles.extraFieldsModalTitle}>سایر ویژگی‌ها و امکانات</Text>
//           <TouchableOpacity onPress={onClose} style={styles.extraFieldsModalClose}>
//             <Icon name="close" size={24} color="#333" />
//           </TouchableOpacity>
//         </View>

//         <ScrollView 
//           style={styles.extraFieldsModalContent}
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//         >
//           {normalFields.filter(f => f.special === "0").map((fl) => {
//             const currentValue = getFieldValue(fl.value);
//             return (
//               <NormalFieldInput
//                 key={`modal_${fl.value}`}
//                 field={fl}
//                 value={currentValue}
//                 onChangeText={(text) => handleNormalFieldChange(fl.value, text, fl.special, fl.sort)}
//                 numToPersian={numToPersian}
//                 isRequired={false}
//                 formatNumber={formatNumber}
//               />
//             );
//           })}

//           {tickFields.filter(f => f.special === "0").map((fl) => {
//             const currentValue = getTickValue(fl.value);
//             return (
//               <TickFieldSelector
//                 key={`modal_tick_${fl.id}`}
//                 field={fl}
//                 value={currentValue}
//                 onSelect={(value) => handleTickSelect(fl.value, value, fl.special)}
//                 isRequired={false}
//               />
//             );
//           })}

//           {predefineFields.filter(f => f.special === "0").map((fl) => {
//             const currentValue = getFieldValue(fl.value);
//             return (
//               <View key={`modal_pre_${fl.id}`} style={styles.predefined_Wrapper}>
//                 <View style={{ flex: 1 }}>
//                   <Text style={styles.predefinedLabel}>{fl.value}</Text>
//                   <Select
//                     minWidth="100%"
//                     placeholder="انتخاب کنید"
//                     placeholderTextColor="gray.500"
//                     style={{ fontFamily: 'iransans', fontSize: 16 }}
//                     selectedValue={currentValue}
//                     onValueChange={(value) => handlePredefineChange(fl.value, value, fl.special, fl.sort)}
//                     _actionSheet={{
//                       _backdrop: { bg: 'transparent' },
//                       _header: {
//                         bg: 'white',
//                         borderBottomWidth: 1,
//                         borderBottomColor: '#bc323b',
//                         paddingVertical: 16,
//                       },
//                       _title: {
//                         color: '#333',
//                         fontSize: 18,
//                         fontWeight: 'bold',
//                         fontFamily: 'iransans',
//                         textAlign: 'center',
//                       },
//                       _body: { bg: 'white' },
//                     }}
//                     _item={{
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                       _text: {
//                         textAlign: 'center',
//                         fontFamily: 'iransans',
//                         fontSize: 16,
//                         color: '#333',
//                       },
//                     }}
//                     _selectedItem={{
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                       bg: '#fef0f1',
//                       _text: {
//                         textAlign: 'center',
//                         fontFamily: 'iransans',
//                         fontSize: 16,
//                         fontWeight: 'bold',
//                         color: '#a92b31',
//                       },
//                     }}
//                   >
//                     <Select.Item disabled value="" label="-" _text={{ textAlign: 'center', fontFamily: 'iransans', color: '#999' }} />
//                     {fl.varchars && fl.varchars.map((vr) => (
//                       <Select.Item key={vr.id} label={vr.value} value={vr.value} _text={{ textAlign: 'center', fontFamily: 'iransans', color: '#333' }} />
//                     ))}
//                   </Select>
//                 </View>
//               </View>
//             );
//           })}

//           <View style={{ height: 20 }} />
//         </ScrollView>

//         <View style={styles.extraFieldsModalFooter}>
//           <TouchableOpacity style={styles.extraFieldsModalConfirm} onPress={handleConfirm}>
//             <Text style={styles.extraFieldsModalConfirmText}>تأیید</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// };

export const PropertyFields = ({ 
  normalFields, 
  tickFields, 
  predefineFields,
  properties,
  loading,
  onAddProperty,
  onRemoveProperty,
  onUpdateProperty,
  onUpsertProperty,
  formatNumber,
  numToPersian,
}) => {
  // ============ ALL HOOKS FIRST ============
  const [showExtraModal, setShowExtraModal] = useState(false);

  const handleNormalFieldChange = useCallback((fieldName, text, fieldSpecial, fieldSort) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length > 0) {
      onUpsertProperty({
        name: fieldName,
        value: numericText,
        kind: 1,
        special: fieldSpecial,
        order: fieldSort,
      });
    } else {
      onRemoveProperty(fieldName);
    }
  }, [onUpsertProperty, onRemoveProperty]);

  const handleTickSelect = useCallback((fieldName, value, special) => {
    if (value === 1 || value === 0) {
      onUpsertProperty({
        name: fieldName,
        value: value,
        kind: 2,
        special: special,
      });
    } else {
      onRemoveProperty(fieldName);
    }
  }, [onUpsertProperty, onRemoveProperty]);

  const handlePredefineChange = useCallback((fieldName, value, special, sort) => {
    if (value && value !== '') {
      onUpsertProperty({
        name: fieldName,
        value: value,
        kind: 3,
        special: special || 0,
        order: sort || 0,
      });
    } else {
      onRemoveProperty(fieldName);
    }
  }, [onUpsertProperty, onRemoveProperty]);

  // ============ FILTER FIELDS ============
  const requiredNormal = normalFields.filter(f => f.special === "1");
  const optionalNormal = normalFields.filter(f => f.special === "0");

  const requiredTick = tickFields.filter(f => f.special === "1");
  const optionalTick = tickFields.filter(f => f.special === "0");

  const requiredPredefine = predefineFields.filter(f => f.special === "1");
  const optionalPredefine = predefineFields.filter(f => f.special === "0");

  const hasExtraFields = optionalNormal.length > 0 || optionalTick.length > 0 || optionalPredefine.length > 0;

  const getSelectedExtraCount = useCallback(() => {
    const optionalFieldNames = [
      ...optionalNormal.map(f => f.value),
      ...optionalTick.map(f => f.value),
      ...optionalPredefine.map(f => f.value),
    ];

    let count = 0;
    optionalFieldNames.forEach(name => {
      const existing = properties.find(p => p.name === name);
      if (existing && existing.value && existing.value !== '') {
        count++;
      }
    });
    return count;
  }, [properties, optionalNormal, optionalTick, optionalPredefine]);

  const selectedCount = getSelectedExtraCount();

  // ============ LOADING CHECK (AFTER ALL HOOKS) ============
  if (loading) {
    return (
      <View style={styles.spinnerView}>
        <ActivityIndicator size="large" color="#a92b31" />
      </View>
    );
  }

  // ============ RENDER FUNCTIONS ============
  const renderRequiredFields = () => {
    return (
      <>
        {requiredNormal.map((fl) => {
          const existing = properties.find((p) => p.name === fl.value);
          const currentValue = existing ? String(existing.value) : '';
          return (
            <NormalFieldInput
              key={`required_${fl.value}`}
              field={fl}
              value={currentValue}
              onChangeText={(text) => handleNormalFieldChange(fl.value, text, fl.special, fl.sort)}
              numToPersian={numToPersian}
              isRequired={true}
              formatNumber={formatNumber}
            />
          );
        })}

        {requiredTick.map((fl) => {
          const existing = properties.find((p) => p.name === fl.value);
          const currentValue = existing ? Number(existing.value) : null;
          return (
            <TickFieldSelector
              key={`required_tick_${fl.id}`}
              field={fl}
              value={currentValue}
              onSelect={(value) => handleTickSelect(fl.value, value, fl.special)}
              isRequired={true}
            />
          );
        })}

        {requiredPredefine.map((fl) => {
          const existing = properties.find((p) => p.name === fl.value);
          const currentValue = existing ? String(existing.value) : '';
          return (
            <View key={`required_pre_${fl.id}`} style={styles.predefined_Wrapper}>
              <View style={{ flex: 1 }}>
                <Text style={styles.predefinedLabel}>
                  {fl.value}
                  <Text style={styles.required}> *</Text>
                </Text>
                <Select
                  minWidth="100%"
                  placeholder="انتخاب کنید"
                  placeholderTextColor="gray.500"
                  style={{ fontFamily: 'iransans', fontSize: 16 }}
                  selectedValue={currentValue}
                  onValueChange={(value) => handlePredefineChange(fl.value, value, fl.special, fl.sort)}
                  _actionSheet={{
                    _backdrop: { bg: 'transparent' },
                    _header: {
                      bg: 'white',
                      borderBottomWidth: 1,
                      borderBottomColor: '#bc323b',
                      paddingVertical: 16,
                    },
                    _title: {
                      color: '#333',
                      fontSize: 18,
                      fontWeight: 'bold',
                      fontFamily: 'iransans',
                      textAlign: 'center',
                    },
                    _body: { bg: 'white' },
                  }}
                  _item={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    _text: {
                      textAlign: 'center',
                      fontFamily: 'iransans',
                      fontSize: 16,
                      color: '#333',
                    },
                  }}
                  _selectedItem={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    bg: '#fef0f1',
                    _text: {
                      textAlign: 'center',
                      fontFamily: 'iransans',
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: '#a92b31',
                    },
                  }}
                >
                  <Select.Item disabled value="" label="-" _text={{ textAlign: 'center', fontFamily: 'iransans', color: '#999' }} />
                  {fl.varchars && fl.varchars.map((vr) => (
                    <Select.Item key={vr.id} label={vr.value} value={vr.value} _text={{ textAlign: 'center', fontFamily: 'iransans', color: '#333' }} />
                  ))}
                </Select>
              </View>
            </View>
          );
        })}
      </>
    );
  };

  return (
    <>
      {renderRequiredFields()}

      {hasExtraFields && (
        <TouchableOpacity
          style={styles.extraFieldsBox}
          onPress={() => setShowExtraModal(true)}
          activeOpacity={0.7}
        >
          <View style={styles.extraFieldsBoxContent}>
            <View style={styles.extraFieldsBoxLeft}>
              {selectedCount > 0 ? (
                <View style={styles.extraFieldsBoxBadge}>
                  <Text style={styles.extraFieldsBoxBadgeText}>{selectedCount} مورد</Text>
                </View>
              ) : (
                <Text style={styles.extraFieldsBoxAction}>انتخاب</Text>
              )}
            </View>
            <Text style={styles.extraFieldsBoxTitle}>سایر ویژگی‌ها و امکانات</Text>
          </View>
        </TouchableOpacity>
      )}

      <ExtraFieldsModal
        isVisible={showExtraModal}
        onClose={() => setShowExtraModal(false)}
        onConfirm={() => {}}
        normalFields={normalFields}
        tickFields={tickFields}
        predefineFields={predefineFields}
        properties={properties}
        onUpsertProperty={onUpsertProperty}
        onRemoveProperty={onRemoveProperty}
        formatNumber={formatNumber}
        numToPersian={numToPersian}
      />
    </>
  );
};

export const DescriptionInput = ({ 
  description, 
  setDescription, 
  note, 
  setNote,
  showDescription = true,
  showNote = true,
}) => {
  const descriptionRef = useRef(null);
  const noteRef = useRef(null);
  const isToggling = useRef(false);

  const handleDescriptionFocus = () => {
    if (isToggling.current) {
      return;
    }
    
    isToggling.current = true;
    Keyboard.dismiss();
    
    setTimeout(() => {
      descriptionRef.current?.focus();
      setTimeout(() => {
        isToggling.current = false;
      }, 150);
    }, 300);
  };

  const handleDescriptionBlur = () => {};

  const handleNoteFocus = () => {
    if (isToggling.current) {
      return;
    }
    
    isToggling.current = true;
    Keyboard.dismiss();
    
    setTimeout(() => {
      noteRef.current?.focus();
      setTimeout(() => {
        isToggling.current = false;
      }, 150);
    }, 300);
  };

  const handleNoteBlur = () => {};

  return (
    <>
      {showDescription && (
        <TextArea
          ref={descriptionRef}
          h="auto"
          minH={120}
          placeholder="توضیحات : این توضیحات برای مشتری و دیگران قابل مشاهده خواهد بود"
          w="auto"
          value={description}
          onChangeText={setDescription}
          backgroundColor="white"
          borderWidth={0.5}
          borderColor="#d0d0d0"
          borderRadius={10}
          padding={4}
          paddingTop={8}
          paddingBottom={8}
          paddingHorizontal={14}
          marginTop={8}
          marginBottom={8}
          marginLeft={3}
          marginRight={3}
          fontFamily="iransans"
          fontSize={16}
          textAlignVertical="top"
          onFocus={handleDescriptionFocus}
          onBlur={handleDescriptionBlur}
          _focus={{
            borderColor: '#a92b31',
            borderWidth: 2,
            backgroundColor: 'white',
          }}
        />
      )}

      {showNote && (
        <TextArea
          ref={noteRef}
          h="auto"
          minH={120}
          placeholder="یادداشت خصوصی : فقط توسط شما قابل مشاهده خواهد بود ، مانند نام مالک ، مقدار کمسیون توافقی و غیره"
          w="auto"
          value={note}
          onChangeText={setNote}
          backgroundColor="white"
          borderWidth={1}
          borderColor="#d0d0d0"
          borderRadius={10}
          padding={4}
          paddingTop={8}
          paddingBottom={8}
          paddingHorizontal={14}
          marginTop={8}
          marginBottom={8}
          marginLeft={3}
          marginRight={3}
          fontFamily="iransans"
          fontSize={16}
          textAlignVertical="top"
          onFocus={handleNoteFocus}
          onBlur={handleNoteBlur}
          _focus={{
            borderColor: '#a92b31',
            borderWidth: 2,
            backgroundColor: 'white',
          }}
        />
      )}
    </>
  );
};

export const Header = ({ title, onBackPress }) => {
  return (
    <View style={styles.headerContainer}>
      <HStack px="4" py="3" justifyContent="space-between" alignItems="center" w="100%">
        <TouchableOpacity onPress={onBackPress}>
          <Icon name="close" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ثبت ملک در آجر</Text>
      </HStack>
      <Divider />
    </View>
  );
};

export const SubmitButton = ({ onPress, title, loading, isVideoProcessing , isEditMode  }) => {
  const toast = useToast();
  const handlePress = () => {
    if (isVideoProcessing) {
      toast.show({
        render: () => (
          <Box bg="orange.700" px="15" py="3" rounded="md" mb={5}>
            <Text style={{ color: 'white', fontSize: 16 }}>
              لطفا تا پایان آپلود ویدیو صبر کنید
            </Text>
          </Box>
        ),
      });
      return;
    }
    onPress();
  };

  const buttonText = isEditMode ? 'تکمیل ویرایش ملک' : (title || 'ثبت ملک');

  return (
    <View style={styles.submitButtonWrapper}>
      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handlePress}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <View style={styles.submitButtonContent}>
            <Icon name="checkmark-circle-outline" size={22} color="white" style={styles.submitButtonIcon} />
            <Text style={styles.submitButtonText}>{buttonText}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export const NextStepButton = ({ onPress, title, loading }) => {
  return (
    <View style={styles.nextStepButtonWrapper}>
      <TouchableOpacity
        style={[styles.nextStepButton, loading && styles.nextStepButtonDisabled]}
        onPress={onPress}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <View style={styles.nextStepButtonContent}>
            <Text style={styles.nextStepButtonText}>{title || 'مرحله بعد'}</Text>
            <Icon name="chevron-forward-outline" size={24} color="white" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};