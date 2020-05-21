import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import UpIcon from './utils/UpIcon';

interface Props {
  label: string;
  url: string;
}

const FooterAction: React.FC<Props> = (props) => {
  return (
    <LinearGradient
      colors={['transparent', 'rgba(0,0,0,.3)', 'rgba(0,0,0,.7)']}
      style={styles.container}
    >
      <UpIcon />
      <Text style={styles.label}>{props.label}</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 25,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  label: {
    color: 'white',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default FooterAction;
