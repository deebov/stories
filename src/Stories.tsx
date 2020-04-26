import React, { createContext, RefObject } from 'react';
import { StyleSheet, Dimensions, View, Platform } from 'react-native';
import Indicators from './Indicators';
import Carousel, { CarouselStatic } from 'react-native-snap-carousel';
import VideoStory, { Props as VideoProps } from './VideoStory';
import ImageStory from './ImageStory';
import { TransitioningView } from 'react-native-reanimated';
import NestedStory from './NestedStory';
import * as Haptics from 'expo-haptics';

export const StoriesContext = createContext<{
  playing: boolean;
  duration: number;
}>({ playing: true, duration: 0 });

export type Slide = {
  type: 'video' | 'img';
  source: string;
  duration?: number;
  action?: {
    label: string;
    url: string;
  };
};

export type Story = Slide & { children?: Slide[] };

export interface Props {
  stories: Story[];
  bubbleIndicators: boolean;
  nestedStories?: boolean;
  onClose: () => void;
  onStoryEnd: () => void;
  onAllEnd: () => void;
}

interface State {
  activeIndex: number;
  reachedEnd: boolean;
  stories: Story[];
  indicators: Indicator[];
  activeIndexForIndicators: number;
}

export interface Indicator {
  isPlaying: boolean;
  duration?: number;
}

class Stories extends React.Component<Props, State> {
  // @ts-ignore
  carouselRef: RefObject<CarouselStatic<any>>;
  indicatorsRef: RefObject<TransitioningView>;

  constructor(props: Props) {
    super(props);

    this.state = {
      activeIndex: 0,
      reachedEnd: false,
      activeIndexForIndicators: 0,
      stories: [...this.props.stories],
      indicators: this.props.stories.map((i) => ({
        duration: i.duration,
        isPlaying: false,
      })),
    };
    this.carouselRef = React.createRef<CarouselStatic<any>>();
    this.indicatorsRef = React.createRef<TransitioningView>();
  }

  nextStory = () => {
    if (
      !this.state.reachedEnd &&
      this.state.activeIndex === this.state.stories.length - 1
    ) {
      this.props?.onAllEnd();
      this.setState({ reachedEnd: true });
    } else {
      // Haptics.impactAsync(
      //   Haptics.ImpactFeedbackStyle[
      //     this.props.nestedStories ? 'Medium' : 'Light'
      //   ]
      // );
      this.carouselRef.current.snapToNext();
    }
  };
  previousStory = () => {
    // Haptics.impactAsync(
    //   Haptics.ImpactFeedbackStyle[this.props.nestedStories ? 'Medium' : 'Light']
    // );
    this.carouselRef.current.snapToPrev();
  };

  onBeforeSnapItem = (snapIndex: number) => {
    if (Platform.OS !== 'android' && this.props.bubbleIndicators) {
      this.indicatorsRef.current?.animateNextTransition();
    }
    this.setState({ activeIndexForIndicators: snapIndex });
  };

  onSnapItem = (snapIndex: number) => {
    const impactStyle = this.props.nestedStories
      ? Haptics.ImpactFeedbackStyle.Medium
      : Haptics.ImpactFeedbackStyle.Light;

    Haptics.impactAsync(impactStyle);
    this.setState({
      activeIndex: snapIndex,
    });
  };

  renderItem = ({ item, index }: { item: Story; index: number }) => {
    const props: VideoProps = {
      onClose: this.props.onClose,
      story: this.state.stories[index],
      isActive: this.state.activeIndex === index,
      setIndicator: (indicator: Indicator) => {
        this.setState((prevState) => {
          const indicators = Array.from(prevState.indicators);
          indicators[index] = { ...prevState.indicators[index], ...indicator };
          return { indicators };
        });
      },
    };

    if (this.props.nestedStories) {
      return (
        <NestedStory
          bubbleIndicators={false}
          isLast={index === this.state.stories.length - 1}
          isActive={this.state.activeIndex === index}
          onEnd={this.props.onStoryEnd}
          snapToNext={this.nextStory}
          slides={item.children}
        />
      );
    }

    return item.type === 'video' ? (
      <VideoStory {...props} />
    ) : (
      <ImageStory {...props} />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Carousel
          lockScrollWhileSnapping
          // @ts-ignore
          ref={this.carouselRef}
          data={this.state.stories}
          renderItem={this.renderItem}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={Dimensions.get('window').width}
          horizontal
          swipeThreshold={50}
          shouldOptimizeUpdates={false}
          decelerationRate={'fast'}
          onBeforeSnapToItem={this.onBeforeSnapItem}
          onSnapToItem={this.onSnapItem}
          inactiveSlideOpacity={1}
          inactiveSlideScale={1}
        />
        {!this.props.nestedStories && (
          <Indicators
            ref={this.indicatorsRef}
            bubbleIndicators={this.props.bubbleIndicators}
            quantity={this.props.stories.length}
            activeIndex={this.state.activeIndexForIndicators}
            snapToNext={this.nextStory}
            playing={this.state.indicators[this.state.activeIndex].isPlaying}
            duration={this.state.indicators[this.state.activeIndex].duration}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
});

export default Stories;
