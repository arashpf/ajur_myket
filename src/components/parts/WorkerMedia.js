
import React, {useState, useRef, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Linking,
  Image as RNImage,
  useWindowDimensions,
} from 'react-native';
import Swiper from 'react-native-swiper';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import {WebView} from 'react-native-webview';
import Modal from 'react-native-modal';
import ImageViewer from 'react-native-image-zoom-viewer';
import Animated, {
  Easing,
  cancelAnimation,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);
const MEDIA_HEIGHT = 338;

/**
 * KenBurnsImage
 * - Uses Reanimated shared values for transform
 * - Pan distance is clamped to safe overflow so black bars do not appear
 * - Pause = cancel animation and keep current transform
 * - Resume = restart from current/seeded state
 * - Shows spinner until image fully loads
 */
const KenBurnsImage = ({
  uri,
  height = MEDIA_HEIGHT,
  isLandscape = true,
  play = true,
  seed = 0,
  onPress,
  onTouchStart,
  onTouchEnd,
}) => {
  const {width: windowWidth} = useWindowDimensions();
  const [imageLoading, setImageLoading] = useState(true);

  const scale = useSharedValue(1.06);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const minScaleLandscape = 1.06;
  const minScalePortrait = 1.04;

  useEffect(() => {
    setImageLoading(true);
  }, [uri]);

  const safeTravelX = useMemo(() => {
    const minScale = isLandscape ? minScaleLandscape : minScalePortrait;
    const overflowX = ((minScale - 1) * windowWidth) / 2;
    const desired = Math.max(18, Math.round(windowWidth * 0.06));
    return Math.max(0, Math.min(desired, overflowX - 2));
  }, [windowWidth, isLandscape]);

  const safeTravelY = useMemo(() => {
    const minScale = isLandscape ? minScaleLandscape : minScalePortrait;
    const overflowY = ((minScale - 1) * height) / 2;
    const desired = Math.max(14, Math.round(height * 0.10));
    return Math.max(0, Math.min(desired, overflowY - 2));
  }, [height, isLandscape]);

  const startAnimation = () => {
    'worklet';

    if (isLandscape) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.14, {duration: 0}),
          withTiming(1.06, {
            duration: 9000,
            easing: Easing.inOut(Easing.cubic),
          }),
          withTiming(1.14, {
            duration: 9000,
            easing: Easing.inOut(Easing.cubic),
          }),
        ),
        -1,
        false,
      );

      translateX.value = withRepeat(
        withSequence(
          withTiming(safeTravelX, {
            duration: 9000,
            easing: Easing.inOut(Easing.cubic),
          }),
          withTiming(-safeTravelX, {
            duration: 9000,
            easing: Easing.inOut(Easing.cubic),
          }),
        ),
        -1,
        true,
      );

      translateY.value = withTiming(0, {duration: 0});
    } else {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.08, {duration: 0}),
          withTiming(1.04, {
            duration: 12000,
            easing: Easing.inOut(Easing.cubic),
          }),
          withTiming(1.08, {
            duration: 12000,
            easing: Easing.inOut(Easing.cubic),
          }),
        ),
        -1,
        false,
      );

      translateY.value = withRepeat(
        withSequence(
          withTiming(-safeTravelY, {
            duration: 12000,
            easing: Easing.inOut(Easing.cubic),
          }),
          withTiming(safeTravelY, {
            duration: 12000,
            easing: Easing.inOut(Easing.cubic),
          }),
        ),
        -1,
        true,
      );

      translateX.value = withTiming(0, {duration: 0});
    }
  };

  const stopAnimationFreeze = () => {
    'worklet';
    cancelAnimation(scale);
    cancelAnimation(translateX);
    cancelAnimation(translateY);
  };

  useEffect(() => {
    cancelAnimation(scale);
    cancelAnimation(translateX);
    cancelAnimation(translateY);

    scale.value = isLandscape ? 1.14 : 1.08;
    translateX.value = isLandscape ? -safeTravelX : 0;
    translateY.value = 0;

    if (play) {
      startAnimation();
    }

    return () => {
      cancelAnimation(scale);
      cancelAnimation(translateX);
      cancelAnimation(translateY);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play, isLandscape, seed, safeTravelX, safeTravelY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {scale: scale.value},
        {translateX: translateX.value},
        {translateY: translateY.value},
      ],
    };
  });

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={onPress}
      onPressIn={() => {
        onTouchStart?.();
        stopAnimationFreeze();
      }}
      onPressOut={() => {
        onTouchEnd?.();
      }}
      style={[styles.animatedImageWrapper, {height}]}>
      {imageLoading && (
        <View style={styles.imageLoaderOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}

      <AnimatedFastImage
        source={{uri}}
        style={[styles.mainImage, {height}, animatedStyle]}
        resizeMode={FastImage.resizeMode.cover}
        onLoadStart={() => setImageLoading(true)}
        onLoadEnd={() => setImageLoading(false)}
        onError={() => setImageLoading(false)}
      />
    </TouchableOpacity>
  );
};

const WorkerMedia = ({
  images = [],
  virtual_tours = [],
  videos = [],
  worker_id,
}) => {
  const [activeTab, setActiveTab] = useState('images');
  const [fullscreenVisible, setFullscreenVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [imageOrientations, setImageOrientations] = useState({});
  const [isUserTouchingImage, setIsUserTouchingImage] = useState(false);

  const videoRef = useRef(null);
  const resumeTimeoutRef = useRef(null);
  const [animSeed, setAnimSeed] = useState(0);

  const hasAdditionalMedia = videos.length > 0 || virtual_tours.length > 0;

  const imageUrls = images.map(image => ({
    url: image.url,
    props: {},
  }));

  useEffect(() => {
    let isMounted = true;

    const detectOrientations = async () => {
      const result = {};

      await Promise.all(
        images.map((img, index) => {
          return new Promise(resolve => {
            if (!img?.url) {
              result[index] = true;
              resolve();
              return;
            }

            RNImage.getSize(
              img.url,
              (width, height) => {
                result[index] = width > height;
                resolve();
              },
              () => {
                result[index] = true;
                resolve();
              },
            );
          });
        }),
      );

      if (isMounted) setImageOrientations(result);
    };

    if (images.length > 0) detectOrientations();

    return () => {
      isMounted = false;
    };
  }, [images]);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  const pauseAnimation = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    setIsUserTouchingImage(true);
  };

  const resumeAnimation = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsUserTouchingImage(false);
    }, 220);
  };

  const shouldPlayAnimation = index => {
    return (
      activeTab === 'images' &&
      !fullscreenVisible &&
      currentImageIndex === index &&
      !isUserTouchingImage
    );
  };

  const renderSlide = (item, index, type) => {
    return (
      <View key={`${type}-${index}`} style={styles.slide}>
        <Text style={styles.slideCounter}>
          {index + 1}/
          {type === 'images'
            ? images.length
            : type === 'videos'
            ? videos.length
            : virtual_tours.length}
        </Text>

        {type === 'images' && (
          <KenBurnsImage
            uri={item.url}
            height={MEDIA_HEIGHT}
            isLandscape={imageOrientations[index] ?? true}
            play={shouldPlayAnimation(index)}
            seed={animSeed + index}
            onTouchStart={pauseAnimation}
            onTouchEnd={resumeAnimation}
            onPress={() => {
              setCurrentImageIndex(index);
              setFullscreenVisible(true);
            }}
          />
        )}

        {type === 'virtual_tours' && (
          <WebView
            source={{uri: item.url}}
            style={styles.iframe}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            allowsFullscreenVideo={true}
          />
        )}

        {type === 'videos' && (
          <View style={styles.videoContainer}>
            {videoLoading && (
              <ActivityIndicator
                size="large"
                color="#FFFFFF"
                style={styles.videoLoader}
              />
            )}

            {videoError && (
              <View style={styles.videoErrorContainer}>
                <Icon name="error-outline" size={40} color="#FFFFFF" />
                <Text style={styles.videoErrorText}>خطا در بارگذاری ویدیو</Text>
              </View>
            )}

            <Video
              ref={videoRef}
              source={{uri: item.absolute_path}}
              style={styles.video}
              controls={true}
              resizeMode="cover"
              paused={true}
              onLoadStart={() => {
                setVideoLoading(true);
                setVideoError(false);
              }}
              onLoad={() => setVideoLoading(false)}
              onError={() => {
                setVideoLoading(false);
                setVideoError(true);
              }}
              bufferConfig={{
                minBufferMs: 15000,
                maxBufferMs: 30000,
                bufferForPlaybackMs: 2500,
                bufferForPlaybackAfterRebufferMs: 5000,
              }}
            />
          </View>
        )}
      </View>
    );
  };

  const onPressingVirtualTour = () => {
    Linking.openURL(`https://ajur.app/virtual-tour/${worker_id}`);
  };

  const renderSlider = (mediaList, type) => {
    if (mediaList.length === 0) return null;

    return (
      <Swiper
        loop={false}
        showsPagination={true}
        dotStyle={styles.paginationDot}
        activeDotStyle={styles.paginationActiveDot}
        paginationStyle={styles.paginationContainer}
        onIndexChanged={index => {
          setCurrentImageIndex(index);
          setAnimSeed(s => s + 1);
          pauseAnimation();
          resumeAnimation();
        }}>
        {mediaList.map((item, index) => renderSlide(item, index, type))}
      </Swiper>
    );
  };

  const renderThumbnail = (type, thumbnailUri, count, isVideo = false) => {
    if (!thumbnailUri) return null;

    return (
      <TouchableOpacity
        style={styles.mediaBox}
        onPress={() => {
          setActiveTab(type);
          if (type === 'images') {
            setCurrentImageIndex(0);
            setAnimSeed(s => s + 1);
          }
        }}
        activeOpacity={0.7}>
        <View style={styles.thumbnailContainer}>
          <FastImage
            source={{uri: thumbnailUri}}
            style={styles.thumbnail}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View
            style={[
              styles.mediaCounter,
              isVideo && styles.mediaCounterVideo,
            ]}>
            {isVideo ? (
              <Icon name="play-arrow" size={24} color="white" />
            ) : (
              <Text style={styles.counterText}>{count}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (images.length === 0 && virtual_tours.length === 0 && videos.length === 0) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.mediaContainer}>
        {activeTab === 'images' && renderSlider(images, 'images')}
        {activeTab === 'virtual_tours' &&
          renderSlider(virtual_tours, 'virtual_tours')}
        {activeTab === 'videos' && renderSlider(videos, 'videos')}
      </View>

      {hasAdditionalMedia && (
        <View style={styles.mediaBoxRow}>
          {images.length > 0 &&
            renderThumbnail('images', images[0]?.url, `${images.length} عکس`)}

          {virtual_tours.length > 0 && (
            <TouchableOpacity
              style={styles.mediaBox}
              onPress={onPressingVirtualTour}>
              <View style={styles.thumbnailContainer}>
                <FastImage
                  source={{uri: virtual_tours[0]?.thumbnail_url}}
                  style={styles.thumbnail}
                  resizeMode={FastImage.resizeMode.cover}
                />
                <View style={styles.mediaCounter}>
                  <Text style={styles.counterText}>بازدید مجازی</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}

          {videos.length > 0 &&
            renderThumbnail(
              'videos',
              videos[0]?.thumbnail_url || images[0]?.url,
              null,
              true,
            )}
        </View>
      )}

      <Modal
        isVisible={fullscreenVisible}
        style={styles.modal}
        onBackdropPress={() => setFullscreenVisible(false)}
        onBackButtonPress={() => setFullscreenVisible(false)}
        onModalShow={() => {
          pauseAnimation();
        }}
        onModalHide={() => {
          resumeAnimation();
          setAnimSeed(s => s + 1);
        }}>
        <ImageViewer
          imageUrls={imageUrls}
          index={currentImageIndex}
          onSwipeDown={() => setFullscreenVisible(false)}
          enableSwipeDown={true}
          enableImageZoom={true}
          renderHeader={() => (
            <View style={styles.headerContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setFullscreenVisible(false)}>
                <Icon name="close" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {marginTop: 0},
  mediaContainer: {
    width: '100%',
    // borderRadius: 12,
    overflow: 'hidden',
    height: MEDIA_HEIGHT,
    backgroundColor: '#f0f0f0',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#000',
  },
  animatedImageWrapper: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#000',
    position: 'relative',
  },

  imageLoaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    zIndex: 2,
  },
  mainImage: {
    width: '100%',
    height: MEDIA_HEIGHT,
  },
  iframe: {width: '100%', height: MEDIA_HEIGHT},
  videoContainer: {
    width: '100%',
    height: MEDIA_HEIGHT,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {width: '100%', height: '100%'},
  videoLoader: {position: 'absolute'},
  videoErrorContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoErrorText: {color: '#FFFFFF', marginTop: 10},
  mediaBoxRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  mediaBox: {
    flex: 1,
    minWidth: 100,
    maxWidth: '32%',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 2,
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    height: 100,
    marginBottom: 1,
  },
  thumbnail: {width: '100%', height: '100%', borderRadius: 6},
  mediaCounter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -40}, {translateY: -10}],
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 24,
  },
  mediaCounterVideo: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -25}, {translateY: -10}],
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 24,
  },
  counterText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  slideCounter: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 14,
    zIndex: 10,
  },
  paginationContainer: {bottom: 10},
  paginationDot: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationActiveDot: {
    backgroundColor: 'white',
    width: 20,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  modal: {margin: 0, backgroundColor: 'black'},
  headerContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  closeButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 5,
  },
});

export default WorkerMedia;