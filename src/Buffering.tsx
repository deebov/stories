import React, { forwardRef } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Transitioning, Transition } from 'react-native-reanimated';

interface Props {
  active: boolean;
}

const transition = (
  <Transition.Together>
    <Transition.In durationMs={90} interpolation='linear' type='fade' />
    <Transition.Out durationMs={150} interpolation='linear' type='fade' />
  </Transition.Together>
);

const Buffering: React.FC<Props> = forwardRef(({ active }, ref) => {
  return (
    <Transitioning.View
      ref={ref}
      transition={transition}
      style={{ ...StyleSheet.absoluteFillObject, zIndex: 99 }}
    >
      {active && (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      )}
    </Transitioning.View>
  );
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
});

export default Buffering;
