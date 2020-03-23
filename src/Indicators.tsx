import React, { memo, useContext } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { ProgressContext } from './Stories';
import Animated, { Easing } from 'react-native-reanimated';
import { useMemoOne } from 'use-memo-one';
import { useTransition } from 'react-native-redash';

interface Props {
  activeIndex?: number;
  length: number;
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
  Extrapolate,
  interpolate,
  call,
  greaterThan,
  lessThan
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
    frameTime: new Value(0)
  };

  const config = {
    duration: duration,
    toValue: new Value(1),
    easing: Easing.linear
  };
  return block([
    cond(
      not(clockRunning(clock)),
      set(state.time, 0),
      timing(clock, state, config)
    ),
    cond(and(state.finished, eq(snapped, 0)), [
      call([], callback),
      set(snapped, 1)
    ]),
    state.position
  ]);
};

const Indicator: React.FC<{ index: number; activeIndex?: number }> = memo(
  ({ index, activeIndex }) => {
    const data = useContext(ProgressContext);
    const duration = data.stories[index].duration;
    const playing = data.stories[index].isPlaying;
    let snapToNext = data.snapToNext;
    const isActive = index === activeIndex;
    // console.log(index, 'indicator rendered');

    if (isActive) {
      console.log(
        index,
        `indicator ${playing ? 'playing' : 'not playing'}`,
        new Date().getMilliseconds()
      );
    }

    const { isPlaying, clock, progress } = useMemoOne(
      () => ({
        progress: new Value(0) as Animated.Value<number>,
        clock: new Clock(),
        isPlaying: new Value(0) as Animated.Value<number>
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
          cond(duration, set(progress, runTiming(clock, duration, snapToNext)))
        ]),
      [isPlaying, clock, progress, duration]
    );

    return (
      <Animated.View
        style={[
          styles.indicatorOverlay,
          {
            flex: cond(
              lessThan(index, activeIndex),
              1,
              cond(greaterThan(index, activeIndex), 0, progress)
            )
          }
        ]}
      />
    );
  }
);

const Indicators: React.FC<Props> = memo(({ activeIndex, length }) => {
  // console.log('indicators rendered');

  return (
    <View style={styles.container}>
      {Array(length)
        .fill('')
        .map((indicator: any, idx: number) => {
          const isActive = idx === activeIndex;
          const transition = useTransition(isActive, {
            duration: 300,
            easing: Easing.out(Easing.ease)
          });
          // const flex = interpolate(transition, {
          //   inputRange: [0, 1],
          //   outputRange: [0, 1],
          //   extrapolate: Extrapolate.CLAMP
          // });
          return (
            <Animated.View
              key={idx}
              style={[
                { ...styles.indicator, marginLeft: idx > 0 ? 10 : 0 },
                { flex: transition }
              ]}
            >
              <Indicator index={idx} activeIndex={activeIndex} />
            </Animated.View>
          );
        })}
    </View>
  );
});

const width = Dimensions.get('window').width / 1.7;
const windowWidth = Dimensions.get('window').width / 2;

const styles = StyleSheet.create({
  container: {
    width: width,
    left: windowWidth - width / 2,
    position: 'absolute',
    top: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16
  },
  indicator: {
    borderRadius: 100,
    flex: 1,
    height: 10,
    minWidth: 10,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,.4)',
    flexDirection: 'row'
  },
  indicatorOverlay: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 100
  }
});

export default Indicators;
