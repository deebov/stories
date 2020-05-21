import React, { MutableRefObject } from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import { TapGestureHandlerStateChangeEvent } from 'react-native-gesture-handler';
import Animated, { set } from 'react-native-reanimated';
import memoizeOne from 'memoize-one';
import * as Haptics from 'expo-haptics';

import { Slide } from './Stories';
import Indicators from './Indicators';
import SlideWrapper from './SlideWrapper';
import debounce from './utils/debounce';

interface Props {
  slides: Slide[];
  isActive: boolean;
  headers?: {
    [key: string]: string;
  };
  isLast: boolean;
  bubbleIndicators: boolean;

  onEnd: () => void;
  snapToNext: () => void;
}

interface State {
  currentIndex: number;
  buffering: boolean;
  playing: boolean;
  duration: number;
  paused: boolean;
}
const windowWidth = Dimensions.get('window').width;

class NestedStory extends React.Component<Props, State> {
  playbackInstance: MutableRefObject<Video>;
  videoRef: MutableRefObject<Video>;
  buffering: boolean;
  playing: boolean;
  hasStarted: boolean;
  progress: Animated.Value<number>;
  timeout: any;
  updateBuffer: (isBuffering: boolean) => void;

  constructor(props) {
    super(props);
    this.progress = new Animated.Value(0);
    this.playing = true;
    this.playbackInstance = React.createRef();
    this.videoRef = React.createRef();
    this.buffering = true;
    this.hasStarted = false;

    this.updateBuffer = debounce((value: boolean) => {
      if (value !== this.state.buffering) {
        this.setState({ buffering: value });
      }
    }, 15);

    this.state = {
      currentIndex: 0,
      buffering: true,
      playing: false,
      duration: 0,
      paused: false,
    };
  }

  updatePlaybackInstance = async () => {
    // if (this.playbackInstance.current != null) {
    //   await this.playbackInstance.current.unloadAsync();
    //   this.playbackInstance.current = null;
    // }
    // const source = {
    //   uri: this.props.slides[this.state.currentIndex].source,
    //   headers: { 'Cache-control': 'max-age=180' },
    // };
    // const initialStatus = {
    //   shouldPlay: this.props.isActive,
    //   isMuted: true,
    //   isLooping: false,
    // };
    // await this.videoRef.current.loadAsync(source, initialStatus, false);
    // this.playbackInstance.current = this.videoRef.current;
  };

  onVideoMount = (ref) => {
    this.videoRef.current = ref;
    this.updatePlaybackInstance();
  };

  snapToNext = () => {
    if (
      this.props.slides[this.state.currentIndex].type === 'img' ||
      this.playbackInstance.current !== null
    ) {
      if (this.state.currentIndex !== this.props.slides.length - 1) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        this.setState({
          currentIndex: Math.min(
            this.state.currentIndex + 1,
            this.props.slides.length - 1
          ),
        });
      } else {
        if (this.props.isLast && typeof this.props.onEnd === 'function') {
          this.props.onEnd();
        } else {
          this.props.snapToNext();
          this.setState({
            currentIndex: 0,
            paused: true,
            playing: false,
          });
          this.playbackInstance.current?.stopAsync();
        }
      }
    }
  };

  snapToPrev = () => {
    if (
      this.props.slides[this.state.currentIndex].type === 'img' ||
      this.playbackInstance.current !== null
    ) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (this.state.currentIndex != 0) {
        this.setState({
          currentIndex: Math.max(this.state.currentIndex - 1, 0),
        });
      } else {
        this.playbackInstance.current?.replayAsync();
      }
    }
  };

  onTouchEnd = (event: TapGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === 5) {
      const x = event.nativeEvent.x;
      if (x > windowWidth / 2) {
        this.snapToNext();
      } else {
        this.snapToPrev();
      }
    }
  };

  onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      this.updateBuffer(status.isBuffering);

      if (status.isPlaying !== this.state.playing) {
        this.setState({ playing: status.isPlaying });
      }

      // if (status.didJustFinish) {
      //   // set(this.progress, 0);
      //   this.snapToNext();
      // }
    }
  };

  onLoad = (status) => {
    if (status.isLoaded) {
      this.setState({ duration: status.durationMillis });
    }
  };

  updatePlayingStatus = memoizeOne((paused) => {
    if (!paused) {
      this.playbackInstance?.current?.playAsync();
    } else {
      this.playbackInstance?.current?.pauseAsync();
    }
  });

  componentDidUpdate() {
    this.updatePlayingStatus(this.state.paused);
    if (this.props.isActive && !this.hasStarted) {
      this.setState(
        { paused: false, playing: true },
        () => (this.hasStarted = true)
      );
    }
    if (!this.props.isActive && this.hasStarted) {
      this.playbackInstance.current?.stopAsync();
      this.setState(
        {
          currentIndex: 0,
          paused: true,
          playing: false,
          buffering: false,
        },
        () => (this.hasStarted = false)
      );
    }
  }

  render() {
    const slide = this.props.slides[this.state.currentIndex];

    return (
      <View style={StyleSheet.absoluteFillObject}>
        <SlideWrapper
          start={() => this.setState({ paused: false, playing: true })}
          pause={() => this.setState({ paused: true, playing: false })}
          reset={() => {}}
          isBuffering={this.state.buffering}
          onClose={() => {}}
          isActive={true}
          action={slide.action}
          tapHandler={this.onTouchEnd}
        >
          {slide.type === 'video' ? (
            <Video
              source={{
                uri: slide.source,
                headers: { 'cache-control': 'max-age=300' },
              }}
              key={this.state.currentIndex}
              shouldPlay={this.hasStarted}
              isMuted={true}
              isLooping={false}
              style={styles.video}
              onLoad={this.onLoad}
              onLoadStart={() => this.setState({ playing: false })}
              onPlaybackStatusUpdate={this.onPlaybackStatusUpdate}
              ref={this.playbackInstance}
              resizeMode="cover"
            />
          ) : (
            <Image
              key={this.state.currentIndex}
              style={StyleSheet.absoluteFill}
              source={{
                uri: slide.source,
                headers: {
                  'cache-control': 'max-age=300',
                  ...this.props.headers,
                },
              }}
              onLoadStart={() =>
                this.setState({ buffering: true, playing: false })
              }
              onLoad={() =>
                this.setState({
                  buffering: false,
                  playing: this.hasStarted,
                  duration: slide.duration,
                })
              }
            />
          )}
        </SlideWrapper>
        <Indicators
          bubbleIndicators={false}
          quantity={this.props.slides.length}
          activeIndex={this.state.currentIndex}
          snapToNext={this.snapToNext}
          playing={this.state.playing}
          duration={this.state.duration}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});

export default NestedStory;
