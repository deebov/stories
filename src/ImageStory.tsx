import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Story } from './Stories';
import SlideWrapper from './SlideWrapper';

export interface Props {
  story: Story;
  isActive: boolean;
  index: number;
  setStory: (story: Story) => void;
  snapTonextStory: () => void;
  onClose: () => void;
}

const ImageStory: React.FC<Props> = ({
  isActive,
  story,
  setStory,
  onClose,
  snapTonextStory,
  index,
}) => {
  // console.log(story);

  return (
    <SlideWrapper
      start={() => setStory({ ...story, isPlaying: true })}
      pause={() => setStory({ ...story, isPlaying: false })}
      reset={() => setStory({ ...story, isPlaying: false, isBuffering: false })}
      isBuffering={!!story.isBuffering}
      onClose={onClose}
      isPlaying={story.isPlaying}
      isActive={isActive}
      action={story.action}
    >
      <Image
        source={{ uri: story.source }}
        style={styles.image}
        onLoadStart={() => setStory({ ...story, isBuffering: true })}
        onLoad={() => setStory({ ...story, isBuffering: false })}
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
