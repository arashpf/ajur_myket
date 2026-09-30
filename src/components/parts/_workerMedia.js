// import React, {useState, useRef} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   ActivityIndicator,
//   Platform,
//   Linking
// } from 'react-native';
// import Swiper from 'react-native-swiper';
// import Video from 'react-native-video';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import FastImage from 'react-native-fast-image';
// import {WebView} from 'react-native-webview';
// import Modal from 'react-native-modal';
// import ImageViewer from 'react-native-image-zoom-viewer';

// const WorkerMedia = ({
//   images = [],
//   virtual_tours = [],
//   videos = [],
//   worker_id,
// }) => {
//   const [activeTab, setActiveTab] = useState('images');
//   const [fullscreenVisible, setFullscreenVisible] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [videoLoading, setVideoLoading] = useState(true);
//   const [videoError, setVideoError] = useState(false);
//   const videoRef = useRef(null);

//   const swiperRef = useRef(null);

//   // Check if we have additional media types (videos or virtual tours)
//   const hasAdditionalMedia = videos.length > 0 || virtual_tours.length > 0;

//   // Prepare images for zoom viewer
//   const imageUrls = images.map(image => ({
//     url: image.url,
//     props: {
//       // You can add additional image props here
//     }
//   }));

//   const renderSlide = (item, index, type) => {
//     return (
//       <View key={`${type}-${index}`} style={styles.slide}>
//         <Text style={styles.slideCounter}>
//           {index + 1}/{type === 'images' ? images.length : 
//            type === 'videos' ? videos.length : virtual_tours.length}
//         </Text>

//         {type === 'images' && (
//           <TouchableOpacity
//             activeOpacity={0.9}
//             onPress={() => {
//               setCurrentImageIndex(index);
//               setFullscreenVisible(true);
//             }}>
//             <FastImage
//               source={{uri: item.url}}
//               style={styles.mainImage}
//               resizeMode={FastImage.resizeMode.cover}
//             />
//           </TouchableOpacity>
//         )}

//         {type === 'virtual_tours' && (
//           <WebView
//             source={{uri: item.url}}
//             style={styles.iframe}
//             javaScriptEnabled={true}
//             domStorageEnabled={true}
//             startInLoadingState={true}
//             allowsFullscreenVideo={true}
//           />
//         )}

//         {type === 'videos' && (
//           <View style={styles.videoContainer}>
//             {videoLoading && (
//               <ActivityIndicator 
//                 size="large" 
//                 color="#FFFFFF" 
//                 style={styles.videoLoader}
//               />
//             )}
//             {videoError && (
//               <View style={styles.videoErrorContainer}>
//                 <Icon name="error-outline" size={40} color="#FFFFFF" />
//                 <Text style={styles.videoErrorText}>خطا در بارگذاری ویدیو</Text>
//               </View>
//             )}
//             <Video
//               ref={videoRef}
//               source={{uri: item.absolute_path}}
//               style={styles.video}
//               controls={true}
//               resizeMode="cover"
//               paused={true}
//               onLoadStart={() => {
//                 setVideoLoading(true);
//                 setVideoError(false);
//               }}
//               onLoad={() => setVideoLoading(false)}
//               onError={() => {
//                 setVideoLoading(false);
//                 setVideoError(true);
//               }}
//               bufferConfig={{
//                 minBufferMs: 15000,
//                 maxBufferMs: 30000,
//                 bufferForPlaybackMs: 2500,
//                 bufferForPlaybackAfterRebufferMs: 5000
//               }}
//             />
//           </View>
//         )}
//       </View>
//     );
//   };

//   const onPressingVirtualTour = () => {
//     Linking.openURL(`https://ajur.app/virtual-tour/${worker_id}`);
//   }

//   const renderSlider = (mediaList, type) => {
//     if (mediaList.length === 0) return null;
    
//     return (
//       <Swiper
//         ref={swiperRef}
//         loop={false}
//         showsPagination={true}
//         dotStyle={styles.paginationDot}
//         activeDotStyle={styles.paginationActiveDot}
//         paginationStyle={styles.paginationContainer}
//         onIndexChanged={index => setCurrentImageIndex(index)}>
//         {mediaList.map((item, index) => renderSlide(item, index, type))}
//       </Swiper>
//     );
//   };

//   const renderThumbnail = (type, thumbnailUri, count, isVideo = false) => {
//     if (!thumbnailUri) return null;
    
//     return (
//       <TouchableOpacity
//         style={styles.mediaBox}
//         onPress={() => {
//           setActiveTab(type);
//           if (type === 'images') {
//             setFullscreenVisible(true);
//           }
//         }}
//         activeOpacity={0.7}
//       >
//         <View style={styles.thumbnailContainer}>
//           <FastImage
//             source={{ uri: thumbnailUri }}
//             style={styles.thumbnail}
//             resizeMode={FastImage.resizeMode.cover}
//           />
//           <View style={[styles.mediaCounter, isVideo && styles.mediaCounterVideo]}>
//             {isVideo ? (
//               <Icon name="play-arrow" size={24} color="white" />
//             ) : (
//               <Text style={styles.counterText}>{count}</Text>
//             )}
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   // Don't render anything if no media exists
//   if (images.length === 0 && virtual_tours.length === 0 && videos.length === 0) {
//     return null;
//   }

//   return (
//     <View style={styles.wrapper}>
//       <View style={styles.mediaContainer}>
//         {activeTab === 'images' && renderSlider(images, 'images')}
//         {activeTab === 'virtual_tours' && renderSlider(virtual_tours, 'virtual_tours')}
//         {activeTab === 'videos' && renderSlider(videos, 'videos')}
//       </View>

//       {/* Only show thumbnails row if we have additional media types */}
//       {(hasAdditionalMedia) && (
//         <View style={styles.mediaBoxRow}>
//           {/* Show image thumbnail only when we have videos or virtual tours */}
//           {images.length > 0 && hasAdditionalMedia && 
//             renderThumbnail('images', images[0]?.url, `${images.length} عکس`)}

//           {virtual_tours.length > 0 && (
//             <TouchableOpacity
//               style={styles.mediaBox}
//               onPress={onPressingVirtualTour}>
//               <View style={styles.thumbnailContainer}>
//                 <FastImage
//                   source={{uri: virtual_tours[0]?.thumbnail_url}}
//                   style={styles.thumbnail}
//                   resizeMode={FastImage.resizeMode.cover}
//                 />
//                 <View style={styles.mediaCounter}>
//                   <Text style={styles.counterText}>بازدید مجازی</Text>
//                 </View>
//               </View>
//             </TouchableOpacity>
//           )}

//           {videos.length > 0 &&
//             renderThumbnail(
//               'videos',
//               videos[0]?.thumbnail_url || images[0]?.url,
//               null,
//               true,
//             )}
//         </View>
//       )}

//       {/* Fullscreen Image Modal with Zoom */}
//       <Modal
//         isVisible={fullscreenVisible}
//         style={styles.modal}
//         onBackdropPress={() => setFullscreenVisible(false)}
//         onBackButtonPress={() => setFullscreenVisible(false)}
//       >
//         <ImageViewer
//           imageUrls={imageUrls}
//           index={currentImageIndex}
//           onSwipeDown={() => setFullscreenVisible(false)}
//           enableSwipeDown={true}
//           enableImageZoom={true}
//           renderHeader={(currentIndex) => (
//             <View style={styles.headerContainer}>
//               <Text style={styles.headerText}>
//                 {currentIndex + 1} / {images.length}
//               </Text>
//               <TouchableOpacity
//                 style={styles.closeButton}
//                 onPress={() => setFullscreenVisible(false)}
//               >
//                 <Icon name="close" size={30} color="#fff" />
//               </TouchableOpacity>
//             </View>
//           )}
//           renderIndicator={(currentIndex, total) => (
//             <View style={styles.footerContainer}>
//               <Text style={styles.footerText}>
//                 {currentIndex + 1} / {total}
//               </Text>
//             </View>
//           )}
//         />
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   wrapper: {
//     marginTop: 0,
//   },
//   mediaContainer: {
//     width: '100%',
//     borderRadius: 12,
//     overflow: 'hidden',
//     height: 260,
//     backgroundColor: '#f0f0f0',
//   },
//   slide: {
//     flex: 1,
//     justifyContent: 'center',
//     position: 'relative',
//     backgroundColor: '#000',
//   },
//   mainImage: {
//     width: '100%',
//     height: 260,
//   },
//   iframe: {
//     width: '100%',
//     height: 260,
//   },
//   videoContainer: {
//     width: '100%',
//     height: 260,
//     backgroundColor: '#000',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   video: {
//     width: '100%',
//     height: '100%',
//   },
//   videoLoader: {
//     position: 'absolute',
//   },
//   videoErrorContainer: {
//     position: 'absolute',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   videoErrorText: {
//     color: '#FFFFFF',
//     marginTop: 10,
//   },
//   mediaBoxRow: {
//     flexDirection: 'row',
//     gap: 12,
//     marginTop: 16,
//     justifyContent: 'space-between',
//     flexWrap: 'wrap',
//   },
//   mediaBox: {
//     flex: 1,
//     minWidth: 100,
//     maxWidth: '32%',
//     backgroundColor: '#f9f9f9',
//     borderRadius: 10,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 1},
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//     padding: 2,
//   },
//   thumbnailContainer: {
//     position: 'relative',
//     width: '100%',
//     height: 100,
//     marginBottom: 1,
//   },
//   thumbnail: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 6,
//   },
//   mediaCounter: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: [{translateX: -40}, {translateY: -10}],
//     backgroundColor: 'rgba(0, 0, 0, 0.3)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 20,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     minWidth: 24,
//   },
//   mediaCounterVideo: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: [{translateX: -25}, {translateY: -10}],
//     backgroundColor: 'rgba(0, 0, 0, 0.3)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 20,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     minWidth: 24,
//   },
//   counterText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   slideCounter: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     color: 'white',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//     fontSize: 14,
//     zIndex: 10,
//   },
//   paginationContainer: {
//     bottom: 10,
//   },
//   paginationDot: {
//     backgroundColor: 'rgba(255,255,255,0.3)',
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginHorizontal: 4,
//   },
//   paginationActiveDot: {
//     backgroundColor: 'white',
//     width: 20,
//     height: 8,
//     borderRadius: 4,
//     marginHorizontal: 4,
//   },
//   modal: {
//     margin: 0,
//     backgroundColor: 'black',
//   },
//   headerContainer: {
//     position: 'absolute',
//     top: Platform.OS === 'ios' ? 50 : 20,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     zIndex: 1,
//   },
//   headerText: {
//     color: 'white',
//     fontSize: 16,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     padding: 8,
//     borderRadius: 10,
//   },
//   footerContainer: {
//     position: 'absolute',
//     bottom: 20,
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//   },
//   footerText: {
//     color: 'white',
//     fontSize: 16,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     padding: 8,
//     borderRadius: 10,
//   },
//   closeButton: {
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 15,
//     padding: 5,
//   },
// });

// export default WorkerMedia;







/////////

// before try to animate

import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Platform,
  Linking
} from 'react-native';
import Swiper from 'react-native-swiper';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import {WebView} from 'react-native-webview';
import Modal from 'react-native-modal';
import ImageViewer from 'react-native-image-zoom-viewer';

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
  const videoRef = useRef(null);

  const swiperRef = useRef(null);

  // Check if we have additional media types (videos or virtual tours)
  const hasAdditionalMedia = videos.length > 0 || virtual_tours.length > 0;

  // Prepare images for zoom viewer
  const imageUrls = images.map(image => ({
    url: image.url,
    props: {
      // You can add additional image props here
    }
  }));

  const renderSlide = (item, index, type) => {
    return (
      <View key={`${type}-${index}`} style={styles.slide}>
        <Text style={styles.slideCounter}>
          {index + 1}/{type === 'images' ? images.length : 
           type === 'videos' ? videos.length : virtual_tours.length}
        </Text>

        {type === 'images' && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              setCurrentImageIndex(index);
              setFullscreenVisible(true);
            }}>
            <FastImage
              source={{uri: item.url}}
              style={styles.mainImage}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
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
                bufferForPlaybackAfterRebufferMs: 5000
              }}
            />
          </View>
        )}
      </View>
    );
  };

  const onPressingVirtualTour = () => {
    Linking.openURL(`https://ajur.app/virtual-tour/${worker_id}`);
  }

  const renderSlider = (mediaList, type) => {
    if (mediaList.length === 0) return null;
    
    return (
      <Swiper
        ref={swiperRef}
        loop={false}
        showsPagination={true}
        dotStyle={styles.paginationDot}
        activeDotStyle={styles.paginationActiveDot}
        paginationStyle={styles.paginationContainer}
        onIndexChanged={index => setCurrentImageIndex(index)}>
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
            setFullscreenVisible(true);
          }
        }}
        activeOpacity={0.7}
      >
        <View style={styles.thumbnailContainer}>
          <FastImage
            source={{ uri: thumbnailUri }}
            style={styles.thumbnail}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={[styles.mediaCounter, isVideo && styles.mediaCounterVideo]}>
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

  // Don't render anything if no media exists
  if (images.length === 0 && virtual_tours.length === 0 && videos.length === 0) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.mediaContainer}>
        {activeTab === 'images' && renderSlider(images, 'images')}
        {activeTab === 'virtual_tours' && renderSlider(virtual_tours, 'virtual_tours')}
        {activeTab === 'videos' && renderSlider(videos, 'videos')}
      </View>

      {/* Only show thumbnails row if we have additional media types */}
      {(hasAdditionalMedia) && (
        <View style={styles.mediaBoxRow}>
          {/* Show image thumbnail only when we have videos or virtual tours */}
          {images.length > 0 && hasAdditionalMedia && 
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

      {/* Fullscreen Image Modal with Zoom */}
      <Modal
        isVisible={fullscreenVisible}
        style={styles.modal}
        onBackdropPress={() => setFullscreenVisible(false)}
        onBackButtonPress={() => setFullscreenVisible(false)}
      >
        <ImageViewer
          imageUrls={imageUrls}
          index={currentImageIndex}
          onSwipeDown={() => setFullscreenVisible(false)}
          enableSwipeDown={true}
          enableImageZoom={true}
          renderHeader={(currentIndex) => (
            <View style={styles.headerContainer}>
              {/* <Text style={styles.headerText}>
                {currentIndex + 1} / {images.length}
              </Text> */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setFullscreenVisible(false)}
              >
                <Icon name="close" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          // renderIndicator={(currentIndex, total) => (
          //   <View style={styles.footerContainer}>
          //     <Text style={styles.footerText}>
          //       {currentIndex + 1} / {total}
          //     </Text>
          //   </View>
          // )}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 0,
  },
  mediaContainer: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    height: 260,
    backgroundColor: '#f0f0f0',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#000',
  },
  mainImage: {
    width: '100%',
    height: 260,
  },
  iframe: {
    width: '100%',
    height: 260,
  },
  videoContainer: {
    width: '100%',
    height: 260,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoLoader: {
    position: 'absolute',
  },
  videoErrorContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoErrorText: {
    color: '#FFFFFF',
    marginTop: 10,
  },
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
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
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
  paginationContainer: {
    bottom: 10,
  },
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
  modal: {
    margin: 0,
    backgroundColor: 'black',
  },
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
  headerText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 10,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 10,
  },
  closeButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 5,
  },
});

export default WorkerMedia;