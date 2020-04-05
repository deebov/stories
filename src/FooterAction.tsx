import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

const UpIcon = () => (
  <Svg viewBox="0 0 24 24" width={30} height={30}>
    <Path
      fill="#ffffff"
      d="M18 15a1 1 0 0 1-.64-.23L12 10.29l-5.37 4.32a1 1 0 0 1-1.41-.15 1 1 0 0 1 .15-1.41l6-4.83a1 1 0 0 1 1.27 0l6 5a1 1 0 0 1 .13 1.41A1 1 0 0 1 18 15z"
    />
  </Svg>
);

interface Props {
  label: string;
  url: string;
}

const FooterAction: React.FC<Props> = props => {
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
    width: '100%'
  },
  label: {
    color: 'white',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 1
  }
});

export default FooterAction;
