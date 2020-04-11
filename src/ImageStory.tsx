import React, { useState, memo } from 'react';
import { StyleSheet, Image } from 'react-native';
import SlideWrapper from './SlideWrapper';
import { Props } from './VideoStory';

const ImageStory: React.FC<Props> = memo(
  ({ isActive, story, setIndicator, onClose, indicator }) => {
    const [buffering, setBuffering] = useState(false);
    return (
      <SlideWrapper
        start={() => setIndicator({ ...indicator, isPlaying: true })}
        pause={() => setIndicator({ ...indicator, isPlaying: false })}
        reset={() => {
          setIndicator({ ...indicator, isPlaying: false });
          setBuffering(false);
        }}
        isBuffering={buffering}
        onClose={onClose}
        isActive={isActive}
        action={story.action}
      >
        <Image
          source={{ uri: story.source }}
          style={styles.image}
          onLoadStart={() => {
            setBuffering(true);
            setIndicator({ ...indicator, isPlaying: false });
          }}
          onLoad={() => {
            setBuffering(false);
            setIndicator({ ...indicator, isPlaying: true });
          }}
          onError={console.log}
        />
      </SlideWrapper>
    );
  }, // Re-render if isActive has changed
  (prevProps, nextProps) => prevProps.isActive === nextProps.isActive
);

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
