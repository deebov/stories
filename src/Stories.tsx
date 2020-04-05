import React, { createContext, RefObject } from 'react';
import { StyleSheet, Dimensions, View, Platform } from 'react-native';
import Indicators from './Indicators';
import Carousel, { CarouselStatic } from 'react-native-snap-carousel';
import VideoStory, { Props as VideoProps } from './VideoStory';
import ImageStory from './ImageStory';
import { TransitioningView } from 'react-native-reanimated';

export const StoriesContext = createContext<{
  stories: Story[];
  snapToNext: () => void;
}>({ stories: [], snapToNext: () => {} });

export type Story = {
  type: 'video' | 'img';
  source: string;
  isPlaying?: boolean;
  isBuffering?: boolean;
  duration?: number;
  action?: {
    label: string;
    url: string;
  };
};

export interface Props {
  stories: Story[];
  onClose: () => void;
  onStoryEnd: () => void;
}

interface State {
  activeIndex: number;
  reachedEnd: boolean;
  stories: Story[];
  data: any;
  activeIndexForIndicators: number;
}

class Stories extends React.Component<Props, State> {
  carouselRef: RefObject<CarouselStatic<any>>;
  indicatorsRef: RefObject<TransitioningView>;

  constructor(props: Props) {
    super(props);

    this.state = {
      activeIndex: 0,
      reachedEnd: false,
      activeIndexForIndicators: 0,
      stories: [...this.props.stories],
      data: [...this.props.stories]
    };
    this.carouselRef = React.createRef();
    this.indicatorsRef = React.createRef<TransitioningView>();
  }

  nextStory = () => {
    // console.log('next', new Date().getMilliseconds());
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
      activeIndex: snapIndex
    });
  };

  renderItem = ({ item, index }: any) => {
    const props: VideoProps = {
      index,
      onClose: this.props.onClose,
      story: this.state.stories[index],
      isActive: this.state.activeIndex === index,
      snapTonextStory: this.nextStory,
      setStory: (story: Story) => {
        // console.log(index, 'called setState', new Date().getMilliseconds());
        let changed = false;
        for (let key in story) {
          if (story[key] !== this.state.stories[index][key]) {
            changed = true;
          }
        }

        if (changed) {
          this.setState(prevState => {
            const stories = Array.from(prevState.stories);
            stories[index] = story;
            return { stories };
          });
        }
      }
    };

    return item.type === 'video' ? (
      <VideoStory {...props} />
    ) : (
      <ImageStory {...props} />
    );
  };

  render() {
    // console.log('stories rendered', new Date().getMilliseconds());

    return (
      <View style={styles.container}>
        <Carousel
          lockScrollWhileSnapping
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
          value={{ stories: this.state.stories, snapToNext: this.nextStory }}
        >
          <Indicators
            ref={this.indicatorsRef}
            length={this.state.data.length}
            activeIndex={this.state.activeIndexForIndicators}
          />
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
    overflow: 'hidden'
  }
});

export default Stories;
