import React, { useRef, useEffect, forwardRef } from 'react';
import { Video as AVideo, AVPlaybackStatus, VideoProps } from 'expo-av';
import { useDebouncedCallback } from 'use-debounce';
import useCombinedRefs from './useCombinedRefs';

interface Props extends VideoProps {
  paused: boolean;
  onPlay?: (playing: boolean) => void;
  onBuffer?: (buffering: boolean) => void;
  onFinish?: () => void;
}

const Video = forwardRef<AVideo, Props>((props, ref) => {
  const videoRef = useRef<AVideo>();
  const buffering = useRef(false);
  const playing = useRef(false);
  const combinedRef = useCombinedRefs(ref, videoRef);

  const [debouncedCallback] = useDebouncedCallback((value: boolean) => {
    if (value !== buffering.current) {
      props.onBuffer?.(value);
      buffering.current = value;
    }
  }, 10);

  useEffect(() => {
    if (props.paused) {
      combinedRef?.current?.pauseAsync();
    } else {
      combinedRef?.current?.playAsync();
    }
  }, [props.paused]);

  const onStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      const { isBuffering, isPlaying } = status;

      // PLAYING
      if (typeof props.onPlay == 'function' && isPlaying !== playing.current) {
        props.onPlay(isPlaying);
        playing.current = isPlaying;
      }

      // BUFFERING
      if (typeof props.onBuffer === 'function') {
        debouncedCallback(isBuffering);
      }

      // FINISH
      if (typeof props.onFinish === 'function' && status.didJustFinish) {
        props.onFinish();
      }
    }
  };

  return (
    <AVideo
      onPlaybackStatusUpdate={onStatusUpdate}
      ref={combinedRef}
      {...props}
    />
  );
});

export default Video;
