import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

interface Props {
  active: boolean;
}

const Buffering: React.FC<Props> = ({ active }) => {
  return (
    <Animatable.View
      easing='ease-in-out'
      duration={300}
      transition='opacity'
      style={{
        ...styles.container,
        opacity: active ? 1 : 0,
      }}
    >
      <ActivityIndicator />
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
});

export default Buffering;
