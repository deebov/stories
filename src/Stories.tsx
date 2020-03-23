import React, { Ref, createContext } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import Indicators from './Indicators';
import Carousel from 'react-native-snap-carousel';
import VideoStory, { Props as VideoProps } from './VideoStory';
import ImageStory from './ImageStory';

export const ProgressContext = createContext<{
  stories: Story[];
  snapToNext: () => void;
}>({ stories: [], snapToNext: () => {} });

const data: Story[] = [
  {
    type: 'img',
    source:
      'https://scontent-cdg2-1.cdninstagram.com/v/t51.12442-15/e35/p1080x1080/90091619_313900329585547_6847663868430656608_n.jpg?_nc_ht=scontent-cdg2-1.cdninstagram.com&_nc_cat=1&_nc_ohc=J_wNh6vjXDkAX9bHvO2&oh=4c9645aa9e0a39c1dd54d2d8438e6b50&oe=5E9E356E',
    duration: 5000,
    isPlaying: false,
    isBuffering: false,
    progress: 0
  },
  {
    type: 'img',
    source:
      'https://scontent-cdg2-1.cdninstagram.com/v/t51.12442-15/e35/p1080x1080/90090529_615665712348185_6135826223346728305_n.jpg?_nc_ht=scontent-cdg2-1.cdninstagram.com&_nc_cat=1&_nc_ohc=3C53EJVJ5AsAX_Ndz4V&oh=b450d15b5bd0b9dff7c056e900b34200&oe=5EA39535',
    duration: 5000,
    isPlaying: false,
    isBuffering: false,
    progress: 0
  },
  // {
  //   type: 'video',
  //   source:
  //     'https://scontent-lax3-1.cdninstagram.com/v/t72.14836-16/76100231_2918195068268772_6731737029743982321_n.mp4?efg=eyJ2ZW5jb2RlX3RhZyI6InZ0c192b2RfdXJsZ2VuLjcyMC5zdG9yeSJ9&_nc_ht=scontent-lax3-1.cdninstagram.com&_nc_cat=100&_nc_ohc=KsNe8xPMYDoAX9oBNck&vs=17866489618689049_607512533&_nc_vs=HBksFQAYJEdJY3lpUVRrOEcwOEZWNEtBUEcyTzRzcDcydGRidlE1QUFBRhUAABUAGCRHTlpYZ2dUU0s3RndrZGtJQUFtUjVSTk5IWDRNYnZRNUFBQUYVAgAoABgAGwGIB3VzZV9vaWwBMRUAABgAFrLk14rI3rw%2FFQIoAkMzLBdALGZmZmZmZhgSZGFzaF9iYXNlbGluZV8xX3YxEQB16AcA&_nc_rid=478d7e284c&oe=5E74DAD9&oh=38271ab5921515bcfaba57217e524bea',
  //   isPlaying: false,
  //   isBuffering: false,
  //   progress: 0,
  //   action: {
  //     label: 'See more',
  //     url: 'https://google.com',
  //   },
  // },
  {
    type: 'video',
    source:
      'https://scontent-cdg2-1.cdninstagram.com/v/t50.12441-16/90988431_1526131337535823_3107541065818190898_n.mp4?_nc_ht=scontent-cdg2-1.cdninstagram.com&_nc_cat=107&_nc_ohc=zkHQLquHKkQAX-qC4m2&oe=5E78761E&oh=a8d6b3e0bb864dc9f63e0507624c9fd0',
    isPlaying: false,
    isBuffering: false,
    progress: 0,
    action: {
      label: 'try for free',
      url: 'https://google.com'
    }
  },
  {
    type: 'video',
    source:
      'https://scontent-lax3-1.cdninstagram.com/v/t72.14836-16/75230080_136288307819840_8548793618074434092_n.mp4?efg=eyJ2ZW5jb2RlX3RhZyI6InZ0c192b2RfdXJsZ2VuLjcyMC5zdG9yeSJ9&_nc_ht=scontent-lax3-1.cdninstagram.com&_nc_cat=108&_nc_ohc=cyOFcF41glUAX_2mmzI&vs=17881158319532154_1641776234&_nc_vs=HBksFQAYJEdJRHJld1JBdFN3WTlIc0FBQ3o2YzRfQWFxTjJidlE1QUFBRhUAABUAGCRHTjRLZ2dSZjFVc1NBTm9EQUFjbG1zbXJwbmd2YnZRNUFBQUYVAgAoABgAGwGIB3VzZV9vaWwBMRUAABgAFvSY9KGytMM%2FFQIoAkMzLBdAK8zMzMzMzRgSZGFzaF9iYXNlbGluZV8xX3YxEQB16AcA&_nc_rid=478d70ae5b&oe=5E7555C5&oh=ee38924749353c67464b39121a4a8364',
    isPlaying: false,
    isBuffering: false,
    progress: 0,
    action: {
      label: 'try for free',
      url: 'https://google.com'
    }
  }
  // {
  //   type: 'video',
  //   source:
  //     'https://scontent-lax3-2.cdninstagram.com/v/t72.14836-16/77388574_207912666978547_3670621015942161135_n.mp4?efg=eyJ2ZW5jb2RlX3RhZyI6InZ0c192b2RfdXJsZ2VuLjcyMC5zdG9yeSJ9&_nc_ht=scontent-lax3-2.cdninstagram.com&_nc_cat=107&_nc_ohc=1lK_l7jHb4MAX8jVEzO&vs=17855749522842409_1890285678&_nc_vs=HBksFQAYJEdCN2JuQVR6Mktod0dMMEFBTy1pVU1CZHF2QXlidlE1QUFBRhUAABUAGCRHRFhOZFFTUUtpaDFjenNCQUlfS1Nmc0ZxSEZ1YnZRNUFBQUYVAgAoABgAGwGIB3VzZV9vaWwBMRUAABgAFtL85O6z7bc%2FFQIoAkMzLBdAKxDlYEGJNxgSZGFzaF9iYXNlbGluZV8xX3YxEQB16AcA&_nc_rid=478d70859b&oe=5E745DA2&oh=0b1a111e2d58822e1a97ed614a851c7d',
  //   isPlaying: false,
  //   isBuffering: false,
  //   progress: 0,
  // },
];

export type Story = {
  type: string;
  source: string;
  isPlaying: boolean;
  isBuffering: boolean;
  progress: number;
  duration?: number;
  action?: {
    label: string;
    url: string;
  };
};

interface Props {}

interface State {
  activeIndex: number;
  stories: Story[];
  data: any;
  activeIndexForIndicators: number;
}

class Stories extends React.Component<Props, State> {
  carouselRef: Ref<any>;

  constructor(props: Props) {
    super(props);

    this.state = {
      activeIndex: 0,
      activeIndexForIndicators: 0,
      stories: [...data],
      data: [...data]
    };
    this.carouselRef = React.createRef();
  }

  onSwipeUp = () => {};

  nextStory = () => {
    // console.log('next', new Date().getMilliseconds());

    this.carouselRef.current.snapToNext();
  };
  previousStory = () => {
    this.carouselRef.current.snapToPrev();
  };

  onBeforeSnapItem = (snapIndex: number) => {
    this.setState({ activeIndexForIndicators: snapIndex });
  };

  onSnapItem = (snapIndex: number) => {
    this.setState({
      activeIndex: snapIndex,
      data: data.map((item, idx) => ({ ...item, isActive: idx === snapIndex }))
    });
  };

  renderItem = ({ item, index }: any) => {
    const props: VideoProps = {
      index,
      story: this.state.stories[index],
      isActive: this.state.activeIndex === index,
      snapTonextStory: this.nextStory,
      setStory: (story: Story) => {
        // console.log(index, 'called setState', new Date().getMilliseconds());
        let changed = false;
        for (let key in story) {
          if (story[key] !== this.state.stories[index][key]) {
            changed = true;
            // if (this.state.activeIndex === index) {
            //   console.log(
            //     index,
            //     key,
            //     'changed to',
            //     story[key],
            //     new Date().getMilliseconds()
            //   );
            // }
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
          // enableMomentum
          decelerationRate={'fast'}
          onBeforeSnapToItem={this.onBeforeSnapItem}
          onSnapToItem={this.onSnapItem}
          inactiveSlideOpacity={1}
          inactiveSlideScale={1}
        />

        <ProgressContext.Provider
          value={{ stories: this.state.stories, snapToNext: this.nextStory }}
        >
          <Indicators
            length={this.state.data.length}
            activeIndex={this.state.activeIndexForIndicators}
          />
        </ProgressContext.Provider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%'
  }
});

export default Stories;
