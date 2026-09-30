import React, { useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';

const LazyVideoPlayer = ({ video }) => {
  const [isReady, setIsReady] = useState(false);
  const [showCustomControls, setShowCustomControls] = useState(true);
  const videoRef = useRef(null);

  const handlePlay = () => {
    setShowCustomControls(false);
  };

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: video.absolute_path }}
        style={styles.video}
        paused={showCustomControls}
        controls={!showCustomControls} // Only show native controls after play
        resizeMode="contain"
        onReadyForDisplay={() => setIsReady(true)}
        bufferConfig={{
          minBufferMs: 10000,
          maxBufferMs: 20000,
          bufferForPlaybackMs: 2000,
          bufferForPlaybackAfterRebufferMs: 4000
        }}
        ref={videoRef}
      />

      {showCustomControls && (
        <TouchableOpacity 
          style={styles.playButton}
          onPress={handlePlay}
        >
          <Icon name="play" size={40} color="white" />
        </TouchableOpacity>
      )}

      {!isReady && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#b92a31" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    aspectRatio: 16/9,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LazyVideoPlayer;