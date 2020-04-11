import React, { createContext, RefObject } from 'react';
import { StyleSheet, Dimensions, View, Platform } from 'react-native';
import Indicators, { BubbleIndicators } from './Indicators';
import Carousel, { CarouselStatic } from 'react-native-snap-carousel';
import VideoStory, { Props as VideoProps } from './VideoStory';
import ImageStory from './ImageStory';
import { TransitioningView } from 'react-native-reanimated';

export const StoriesContext = createContext<{
  indicators: Indicator[];
  snapToNext: () => void;
}>({ indicators: [], snapToNext: () => {} });

export type Story = {
  type: 'video' | 'img';
  source: string;
  duration?: number;
  action?: {
    label: string;
    url: string;
  };
};

export interface Props {
  stories: Story[];
  bubbleIndicators: boolean;
  onClose: () => void;
  onStoryEnd: () => void;
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
      indicators: this.props.stories.map((s) => ({
        isPlaying: false,
        duration: s.duration,
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
      this.props?.onStoryEnd();
      this.setState({ reachedEnd: true });
    } else {
      this.carouselRef.current.snapToNext();
    }
  };
  previousStory = () => {
    this.carouselRef.current.snapToPrev();
  };

  onBeforeSnapItem = (snapIndex: number) => {
    if (Platform.OS !== 'android') {
      this.indicatorsRef.current?.animateNextTransition();
    }
    this.setState({ activeIndexForIndicators: snapIndex });
  };

  onSnapItem = (snapIndex: number) => {
    this.setState({
      activeIndex: snapIndex,
    });
  };

  renderItem = ({ item, index }: any) => {
    const props: VideoProps = {
      index,
      onClose: this.props.onClose,
      story: this.state.stories[index],
      isActive: this.state.activeIndex === index,
      snapTonextStory: this.nextStory,
      indicator: this.state.indicators[index],
      setIndicator: (indicator: Indicator) => {
        this.setState((prevState) => {
          const indicators = Array.from(prevState.indicators);
          indicators[index] = indicator;
          return { indicators };
        });
      },
    };

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
          decelerationRate={'normal'}
          onBeforeSnapToItem={this.onBeforeSnapItem}
          onSnapToItem={this.onSnapItem}
          inactiveSlideOpacity={1}
          inactiveSlideScale={1}
        />

        <StoriesContext.Provider
          value={{
            indicators: this.state.indicators,
            snapToNext: this.nextStory,
          }}
        >
          {this.props.bubbleIndicators ? (
            <BubbleIndicators
              ref={this.indicatorsRef}
              length={this.state.indicators.length}
              activeIndex={this.state.activeIndexForIndicators}
            />
          ) : (
            <Indicators
              length={this.state.indicators.length}
              activeIndex={this.state.activeIndexForIndicators}
            />
          )}
        </StoriesContext.Provider>
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
