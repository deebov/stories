import React, { forwardRef, RefObject } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  Transition,
  Transitioning,
  TransitioningView,
} from 'react-native-reanimated';
import { useMemoOne } from 'use-memo-one';

import { Indicator as IIndicator } from '../Stories';
import AnimatedIndicator from './AnimatedIndicator';
import Indicator from './Indicator';

const { Value, useCode, set, block, cond, and, eq, call } = Animated;

interface Props {
  activeIndex?: number;
  quantity: number;
  bubbleIndicators: boolean;
  snapToNext: () => void;
  playing: boolean;
  duration: number;

  ref?: RefObject<TransitioningView>;
}

const transition = (
  <Transition.Change durationMs={300} interpolation="easeInOut" />
);

const Indicators = forwardRef<TransitioningView, Props>(
  (
    { activeIndex, quantity, snapToNext, playing, duration, bubbleIndicators },
    ref
  ) => {
    const { progress, snapped } = useMemoOne(
      () => ({
        progress: new Value(0) as Animated.Value<number>,
        snapped: new Value(0),
      }),
      [activeIndex]
    );

    useCode(
      () =>
        block([
          cond(and(eq(progress, 1), eq(snapped, 0)), [
            set(snapped, 1),
            call([], snapToNext),
          ]),
        ]),
      [snapped]
    );
    return (
      <Transitioning.View
        ref={ref}
        transition={transition}
        style={[
          styles.container,
          bubbleIndicators ? bubbleStyles.container : {},
        ]}
      >
        {Array(quantity)
          .fill('')
          .map((indicator: IIndicator, idx: number) => {
            const isActive = idx === activeIndex;
            return (
              <View
                key={idx}
                style={[
                  styles.indicator,
                  bubbleIndicators ? bubbleStyles.indicator : {},
                  {
                    marginLeft: idx > 0 ? 10 : 0,
                    flex: bubbleIndicators ? (isActive ? 1 : 0) : 1,
                  },
                ]}
              >
                {idx === activeIndex ? (
                  <AnimatedIndicator
                    progress={progress}
                    bubbleIndicator={bubbleIndicators}
                    isPlaying={playing}
                    duration={duration}
                  />
                ) : (
                  <Indicator width={idx > activeIndex ? 0 : 1} />
                )}
              </View>
            );
          })}
      </Transitioning.View>
    );
  }
);

const width = Dimensions.get('window').width;
const bubbleContainerWidth = Dimensions.get('window').width / 1.7;
const windowWidth = Dimensions.get('window').width / 2;

const styles = StyleSheet.create({
  container: {
    width: width,
    position: 'absolute',
    top: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  indicator: {
    borderRadius: 10,
    flex: 1,
    height: 5,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,.4)',
    flexDirection: 'row',
  },
});

const bubbleStyles = StyleSheet.create({
  container: {
    width: bubbleContainerWidth,
    left: windowWidth - bubbleContainerWidth / 2,
    paddingHorizontal: 0,
  },
  indicator: {
    borderRadius: 100,
    height: 10,
    minWidth: 10,
  },
});

export default Indicators;
