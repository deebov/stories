import React, { useState, memo } from 'react';
import { StyleSheet, Image } from 'react-native';
import SlideWrapper from './SlideWrapper';
import { SlideProps } from './VideoStory';

const ImageStory: React.FC<SlideProps> = ({
  isActive,
  story,
  headers,
  setIndicator,
  onClose,
}) => {
  const [buffering, setBuffering] = useState(false);
  return (
    <SlideWrapper
      start={() => setIndicator({ isPlaying: true })}
      pause={() => setIndicator({ isPlaying: false })}
      reset={() => {
        setIndicator({ isPlaying: false });
        setBuffering(false);
      }}
      isBuffering={buffering}
      onClose={onClose}
      isActive={isActive}
      action={story.action}
    >
      <Image
        source={{ uri: story.source, headers: headers }}
        style={styles.image}
        onLoadStart={() => {
          setBuffering(true);
          setIndicator({ isPlaying: false });
        }}
        onLoad={() => {
          setBuffering(false);
          setIndicator({ isPlaying: true });
        }}
        onError={console.log}
      />
    </SlideWrapper>
  );
};

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default ImageStory;
