import React, { useEffect, useRef } from 'react';
import GestureRecognizer from 'react-native-swipe-gestures';
import { Linking, StyleSheet, View } from 'react-native';
import Buffering from './Buffering';
import FooterAction from './FooterAction';
import {
  LongPressGestureHandler,
  State,
  LongPressGestureHandlerGestureEvent,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

export interface Props {
  start: () => any;
  pause: () => any;
  reset: () => any;
  onClose: () => any;
  tapHandler?: (event: TapGestureHandlerGestureEvent) => any;
  action: any;
  isBuffering: boolean;
  isActive: boolean;
}

const SlideWrapper: React.FC<Props> = ({
  start,
  pause,
  isBuffering,
  action,
  children,
  tapHandler,
}) => {
  // useEffect(() => {
  //   if (isActive) {
  //     start();
  //   } else {
  //     reset();
  //   }
  // }, [isActive]);

  const onSwipeUp = () => {
    if (action && action.url) {
      Linking.openURL(action.url);
    }
  };

  const gestureHandler = ({
    nativeEvent,
  }: LongPressGestureHandlerGestureEvent) => {
    if (nativeEvent.state === State.ACTIVE) {
      pause();
    }
    if (nativeEvent.state === State.END) {
      start();
    }
  };

  return (
    <LongPressGestureHandler
      onHandlerStateChange={gestureHandler}
      minDurationMs={70}
    >
      <TapGestureHandler
        maxDurationMs={100}
        maxDist={10}
        onHandlerStateChange={tapHandler}
      >
        <View style={styles.container}>
          <GestureRecognizer onSwipeUp={onSwipeUp} style={styles.container}>
            {children}
          </GestureRecognizer>
          {isBuffering && <Buffering active={true} />}
          {action && <FooterAction label={action.label} url="" />}
        </View>
      </TapGestureHandler>
    </LongPressGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default SlideWrapper;
