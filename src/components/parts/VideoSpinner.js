import React from 'react';
import { StyleSheet, View } from 'react-native';
import Video from 'react-native-video';

const VideoSpinner = () => {
  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/img/spinner.mp4')}  // Your MP4 spinner video
        style={styles.video}
        resizeMode="contain"  // Adjust the video size to fit within the container
        repeat={true}         // Makes the video loop infinitely
        muted={true}          // Optional: Mutes the video (since it's a spinner)
        shouldPlay={true}     // Ensures the video plays
        playInBackground={true} // Allows the video to play in the background (if needed)
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Centers the spinner vertically
    alignItems: 'center',     // Centers the spinner horizontally
    // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: add a background color to emphasize the spinner
  },
  video: {
    width: 300, // Adjust size as needed
    height: 300, // Adjust size as needed
  },
});

export default VideoSpinner;