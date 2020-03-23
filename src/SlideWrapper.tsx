import React, { useEffect, memo } from 'react';
import GestureRecognizer from 'react-native-swipe-gestures';
import { Linking, StyleSheet, View } from 'react-native';
import Buffering from './Buffering';
import FooterAction from './FooterAction';
import { LongPressGestureHandler, State } from 'react-native-gesture-handler';

export interface Props {
  start: () => any;
  pause: () => any;
  reset: () => any;
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
  children
}) => {
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
  // if (isActive) {
    // console.log(isActive);
  // }
  // console.log(isActive, 'slide wrapper rendered');

  return (
    <View style={styles.container}>
      <Buffering active={isBuffering} />
      <LongPressGestureHandler
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.ACTIVE) {
            pause();
          }
          if (nativeEvent.state === State.END) {
            start();
          }
        }}
        minDurationMs={90}
      >
        <GestureRecognizer
          // onTouchStart={!isBuffering ? pause : undefined}
          // onTouchEnd={!isBuffering ? start : undefined}
          onSwipeUp={onSwipeUp}
          style={styles.container}
        >
          {children}
        </GestureRecognizer>
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
