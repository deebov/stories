import React, { memo, useContext, forwardRef, RefObject } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { StoriesContext, Indicator as IIndicator } from './Stories';
import Animated, {
  Easing,
  Transition,
  Transitioning,
  TransitioningView,
} from 'react-native-reanimated';
import { useMemoOne } from 'use-memo-one';

interface Props {
  activeIndex?: number;
  length: number;
  ref?: RefObject<TransitioningView>;
}

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
  greaterThan,
  lessThan,
} = Animated;

const runTiming = (
  clock: Animated.Clock,
  duration: number,
  callback: () => void
) => {
  const snapped = new Value(0);

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
    cond(and(state.finished, eq(snapped, 0)), [
      call([], callback),
      set(snapped, 1),
    ]),
    state.position,
  ]);
};

const Indicator: React.FC<{
  index: number;
  activeIndex?: number;
  bubbleIndicator?: boolean;
}> = memo(({ index, bubbleIndicator, activeIndex = 0 }) => {
  const data = useContext(StoriesContext);
  const duration = data.indicators[index].duration || 0;
  const playing = data.indicators[index].isPlaying;
  let snapToNext = data.snapToNext;
  const isActive = index === activeIndex;

  const { isPlaying, clock, progress } = useMemoOne(
    () => ({
      progress: new Value(0) as Animated.Value<number>,
      clock: new Clock(),
      isPlaying: new Value(0) as Animated.Value<number>,
    }),
    [index, activeIndex]
  );

  isPlaying.setValue(playing ? 1 : 0);
  if (!isActive) {
    snapToNext = () => {};
  }

  useCode(
    () =>
      block([
        cond(and(isPlaying, not(clockRunning(clock))), startClock(clock)),
        cond(and(not(isPlaying), clockRunning(clock)), stopClock(clock)),
        cond(duration, set(progress, runTiming(clock, duration, snapToNext))),
      ]),
    [isPlaying, clock, progress, duration]
  );

  return (
    <Animated.View
      style={[
        styles.indicatorOverlay,
        bubbleIndicator ? bubbleStyles.indicator : {},
        {
          flex: cond(
            lessThan(index, activeIndex),
            1,
            cond(greaterThan(index, activeIndex), 0, progress)
          ),
        },
      ]}
    />
  );
});

const transition = (
  <Transition.Change durationMs={300} interpolation="easeInOut" />
);

const Indicators: React.FC<Props> = memo(({ activeIndex, length }) => (
  <View style={styles.container}>
    {Array(length)
      .fill('')
      .map((indicator: IIndicator, idx: number) => (
        <View
          key={idx}
          style={{ ...styles.indicator, marginLeft: idx > 0 ? 5 : 0 }}
        >
          <Indicator index={idx} activeIndex={activeIndex} />
        </View>
      ))}
  </View>
));

export const BubbleIndicators: React.FC<Props> = memo(
  forwardRef<TransitioningView, Props>(({ activeIndex, length }, ref) => {
    return (
      <Transitioning.View
        ref={ref}
        transition={transition}
        style={[styles.container, bubbleStyles.container]}
      >
        {Array(length)
          .fill('')
          .map((indicator: IIndicator, idx: number) => {
            const isActive = idx === activeIndex;
            return (
              <View
                key={idx}
                style={[
                  styles.indicator,
                  bubbleStyles.indicator,
                  { marginLeft: idx > 0 ? 10 : 0, flex: isActive ? 1 : 0 },
                ]}
              >
                <Indicator
                  bubbleIndicator
                  index={idx}
                  activeIndex={activeIndex}
                />
              </View>
            );
          })}
      </Transitioning.View>
    );
  })
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
