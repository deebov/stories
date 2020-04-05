import React, { useEffect, useRef } from 'react';
import GestureRecognizer from 'react-native-swipe-gestures';
import { Linking, StyleSheet, View } from 'react-native';
import Buffering from './Buffering';
import FooterAction from './FooterAction';
import {
  LongPressGestureHandler,
  State,
  LongPressGestureHandlerGestureEvent
} from 'react-native-gesture-handler';
import { TransitioningView } from 'react-native-reanimated';

export interface Props {
  start: () => any;
  pause: () => any;
  reset: () => any;
  onClose: () => any;
  action: any;
  isBuffering: boolean;
  isActive: boolean;
}

const SlideWrapper: React.FC<Props> = ({
  start,
  pause,
  reset,
  isBuffering,
  isActive,
  action,
  children,
  onClose
}) => {
  const transitionRef = useRef<TransitioningView>();
  useEffect(() => {
    if (isActive) {
      if (!isBuffering) {
        start();
      }
    } else {
      reset();
    }
  }, [isActive, isBuffering]);

  const onSwipeUp = () => {
    if (action && action.url) {
      Linking.openURL(action.url);
    }
  };

  const gestureHandler = ({
    nativeEvent
  }: LongPressGestureHandlerGestureEvent) => {
    if (nativeEvent.state === State.ACTIVE) {
      if (transitionRef.current) {
        transitionRef.current.animateNextTransition();
      }
      pause();
    }
    if (nativeEvent.state === State.END) {
      if (transitionRef.current) {
        transitionRef.current.animateNextTransition();
      }
      start();
    }
  };

  return (
    <View style={styles.container}>
      <LongPressGestureHandler
        onHandlerStateChange={gestureHandler}
        minDurationMs={90}
      >
        <View style={styles.container}>
          <GestureRecognizer onSwipeUp={onSwipeUp} style={styles.container}>
            {children}
            <Buffering ref={transitionRef} active={isBuffering} />
          </GestureRecognizer>
        </View>
      </LongPressGestureHandler>

      {action && <FooterAction label={action.label} url="" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%'
  }
});

export default SlideWrapper;
