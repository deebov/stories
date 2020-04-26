import React, { forwardRef, Ref } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface Props {
  active: boolean;
}

const Buffering: React.FC<Props> = forwardRef(({ active }, ref) => {
  return (
    <View style={{ ...StyleSheet.absoluteFillObject, zIndex: 99 }}>
      {active && (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      )}
    </View>
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
