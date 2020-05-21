import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
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
        bubbleIndicator ? styles.bubbleIndicatorOverlay : {},
        {
          flex: progress,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  indicatorOverlay: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 10,
  },
  bubbleIndicatorOverlay: {
    borderRadius: 100,
    height: 10,
    minWidth: 10,
  },
});

export default AnimatedIndicator;
