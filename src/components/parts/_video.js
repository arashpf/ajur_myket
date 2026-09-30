import React, { Component } from 'react';
import {StyleSheet,Text,Dimensions} from 'react-native';
import Video from 'react-native-video';
const MyComponent = ({video}) => {

    return (

      <Video
          source={{ uri: video.absolute_path }}
          style={{ width: '100%', height: Dimensions.get('window').width/1.5 }}
          controls={true}
          paused
          bufferConfig={{
            minBufferMs: 2000,
            maxBufferMs: 4000,
            bufferForPlaybackMs: 1000,
            bufferForPlaybackAfterRebufferMs: 1000
          }}

          ref={(ref) => {
          this.player = ref
          }}
      />



    )
}

// Later on in your styles..
var styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default MyComponent;
