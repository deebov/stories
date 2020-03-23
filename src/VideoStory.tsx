import React, { useRef, memo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import { Story } from './Stories';
import SlideWrapper from './SlideWrapper';

export interface Props {
  story: Story;
  isActive: boolean;
  index: number;
  setStory: (story: Story) => void;
  snapTonextStory: () => void;
}

const VideoStory: React.FC<Props> = memo(
  ({ index, isActive, story, setStory, snapTonextStory }) => {
    const videoRef = useRef();
    // const [buffering, setBuffering] = useState(false);

    const onStatusChange = (status: any) => {
      const {
        isBuffering,
        durationMillis,
        didJustFinish,
        isLooping,
        error,
        isLoaded,
        isPlaying
      } = status;

      if (!isLoaded) {
        if (error) {
          console.log(`Encountered a fatal error during playback: ${error}`);
        }
      } else {
        const updatedStory = { ...story };

        if (isActive) {
          if (isPlaying) {
            // console.log(index, 'playing', new Date().getMilliseconds());
          } else {
            // console.log(index, 'not playing', new Date().getMilliseconds());
          }
        }
        updatedStory.isPlaying = isPlaying;
        updatedStory.duration = durationMillis;
        updatedStory.isBuffering = isBuffering;
        // setBuffering(buffering);
        setStory(updatedStory);

        if (didJustFinish && !isLooping) {
          snapTonextStory();
        }
      }
    };

    const pause = () => {
      if (videoRef.current) {
        videoRef.current.pauseAsync();
      }
    };
    const play = () => {
      if (videoRef.current) {
        videoRef.current.playAsync();
      }
    };
    const reset = () => {
      if (videoRef.current) {
        videoRef.current.stopAsync();
      }
    };

    return (
      <SlideWrapper
        start={play}
        pause={pause}
        reset={reset}
        isBuffering={story.isBuffering}
        isActive={isActive}
        action={story.action}
      >
        <Video
          progressUpdateIntervalMillis={10000}
          style={styles.video}
          onLoadStart={() => {
            // setBuffering(true);
            setStory({ ...story, isBuffering: true });
          }}
          onLoad={() => {
            // setBuffering(false);
            setStory({ ...story, isBuffering: false });
          }}
          onPlaybackStatusUpdate={onStatusChange}
          ref={videoRef}
          source={{
            uri: story.source
          }}
          resizeMode="cover"
          shouldPlay={index === 0 ? true : false}
          isLooping={false}
          isMuted={true}
        />
      </SlideWrapper>
    );
  }
);

const styles = StyleSheet.create({
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  }
});

export default VideoStory;
