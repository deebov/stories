import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import Stories from './src/Stories';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Stories />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
