import React from 'react';
import { View, StyleSheet } from 'react-native';

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

const styles = StyleSheet.create({
  indicatorOverlay: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 10,
  },
});

export default Indicator;
