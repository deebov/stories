import React, { useRef, memo, useState } from 'react';
import { StyleSheet } from 'react-native';
import Video from 'expo-video';

import { Story, Indicator } from './Stories';
import SlideWrapper from './SlideWrapper';

export interface SlideProps {
  story: Story;
  isActive: boolean;
  headers?: {
    [key: string]: string;
  };

  setIndicator: (indicator: Partial<Indicator>) => void;
  onClose: () => void;
}

const VideoStory: React.FC<SlideProps> = memo(
  ({ isActive, story, headers, setIndicator, onClose }) => {
    const videoRef = useRef<Video>();
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
          paused={paused}
          style={styles.video}
          onPlay={(p) => setIndicator({ isPlaying: p })}
          onBuffer={setBuffering}
          onLoad={(status) => {
            if (status.isLoaded) {
              setIndicator({ duration: status.durationMillis });
            }
          }}
          ref={videoRef}
          source={{
            uri: story.source,
            headers: headers
          }}
          resizeMode="cover"
          shouldPlay={isActive}
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
