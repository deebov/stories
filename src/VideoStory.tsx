import React, { useRef, memo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Story, Indicator } from './Stories';
import SlideWrapper from './SlideWrapper';
import Video from './Video';
import { Video as AVideo } from 'expo-av';

export interface Props {
  story: Story;
  isActive: boolean;
  index: number;
  indicator: Indicator;

  setIndicator: (indicator: Indicator) => void;
  snapTonextStory: () => void;
  onClose: () => void;
}

const VideoStory: React.FC<Props> = memo(
  ({
    index,
    isActive,
    story,
    setIndicator,
    snapTonextStory,
    onClose,
    indicator,
  }) => {
    const videoRef = useRef<AVideo>();
    const [paused, setPaused] = useState(true);
    const [buffering, setBuffering] = useState(false);

    const reset = () => {
      setPaused(true);
      videoRef.current?.stopAsync();
    };

    return (
      <SlideWrapper
        start={() => setPaused(false)}
        pause={() => setPaused(true)}
        reset={reset}
        isBuffering={buffering}
        onClose={onClose}
        isActive={isActive}
        action={story.action}
      >
        <Video
          onFinish={snapTonextStory}
          paused={paused}
          style={styles.video}
          onPlay={(p) => setIndicator({ ...indicator, isPlaying: p })}
          onBuffer={setBuffering}
          onLoad={(status) => {
            if (status.isLoaded) {
              setIndicator({ ...indicator, duration: status.durationMillis });
            }
          }}
          ref={videoRef}
          source={{
            uri: story.source,
          }}
          resizeMode="cover"
          shouldPlay={index === 0 ? true : false}
          isLooping={false}
          isMuted={true}
        />
      </SlideWrapper>
    );
  },
  // Re-render if isActive has changed
  (prevProps, nextProps) => prevProps.isActive === nextProps.isActive
);

const styles = StyleSheet.create({
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});

export default VideoStory;
