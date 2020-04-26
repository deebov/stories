import React, { forwardRef, RefObject } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Indicator as IIndicator } from './Stories';
import Animated, {
  Easing,
  Transition,
  Transitioning,
  TransitioningView,
} from 'react-native-reanimated';
import { useMemoOne } from 'use-memo-one';

const {
  Clock,
  Value,
  useCode,
  set,
  block,
  cond,
  startClock,
  stopClock,
  clockRunning,
  and,
  not,
  timing,
  eq,
  call,
} = Animated;

const runTiming = (clock: Animated.Clock, duration: number) => {
  const state = {
    time: new Value(0),
    position: new Value(0),
    finished: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: duration,
    toValue: new Value(1),
    easing: Easing.linear,
  };
  return block([
    cond(
      not(clockRunning(clock)),
      set(state.time, 0),
      timing(clock, state, config)
    ),
    state.position,
  ]);
};

const AnimatedIndicator: React.FC<{
  isPlaying: boolean;
  duration: number;
  bubbleIndicator?: boolean;
  progress: Animated.Value<number>;
}> = ({ bubbleIndicator, duration, isPlaying: playing, progress }) => {
  duration = duration || 0;
  const { isPlaying, clock } = useMemoOne(
    () => ({
      clock: new Clock(),
      isPlaying: new Value(0) as Animated.Value<number>,
    }),
    []
  );

  useCode(
    () =>
      block([
        cond(and(isPlaying, not(clockRunning(clock))), startClock(clock)),
        cond(and(not(isPlaying), clockRunning(clock)), stopClock(clock)),
        cond(duration, set(progress, runTiming(clock, duration))),
      ]),
    [isPlaying, clock, duration]
  );

  useCode(() => set(isPlaying, Number(playing)), [playing]);

  return (
    <Animated.View
      style={[
        styles.indicatorOverlay,
        bubbleIndicator ? bubbleStyles.indicator : {},
        {
          flex: progress,
        },
      ]}
    />
  );
};

const Indicator = (props) => (
  <View
    style={[
      styles.indicatorOverlay,
      {
        flex: props.width,
      },
    ]}
  />
);

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

const Indicators: React.FC<Props> = forwardRef<TransitioningView, Props>(
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
  indicatorOverlay: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 10,
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
  indicatorOverlay: {
    borderRadius: 100,
  },
});

export default Indicators;
