import React, { useEffect, useState, memo } from 'react';
import { StyleSheet, Image } from 'react-native';
import { useTimer } from './useTimer';
import { Story } from './Stories';
import SlideWrapper from './SlideWrapper';

export interface Props {
  story: Story;
  isActive: boolean;
  index: number;
  setStory: (story: Story) => void;
  snapTonextStory: () => void;
}

const ImageStory: React.FC<Props> = ({
  isActive,
  story,
  setStory,
  snapTonextStory,
  index
}) => {
  const [buffering, setBuffering] = useState(true);
  // const duration = story.duration || 5000;

  // const { time, start, pause, reset } = useTimer({
  //   endTime: duration,
  //   interval: 10,
  //   step: 10,
  // });

  // useEffect(() => {
  //   if (time >= duration) {
  //     snapTonextStory();
  //   } else {
  //     setStory({ ...story, progress: (time * 100) / duration });
  //   }
  // }, [time]);

  // useEffect(() => {
  // if (!story.isBuffering) {
  // setStory({ ...story, isPlaying: true });
  // console.log(index, 'playing', new Date().getMilliseconds());

  //   console.log('buffering state inside image is', story.isBuffering);
  // }, [story.isBuffering]);
  // console.log(index, buffering);
  // console.log(story.isBuffering);
  // console.log('buffering state inside image is', story.isBuffering);
  return (
    <SlideWrapper
      start={() => setStory({ ...story, isPlaying: true })}
      pause={() => setStory({ ...story, isPlaying: false })}
      reset={() => setStory({ ...story, isPlaying: false, isBuffering: false })}
      isBuffering={story.isBuffering}
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
    resizeMode: 'cover'
  }
});

export default ImageStory;
