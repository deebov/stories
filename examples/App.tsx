import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import Stories from 'rn-stories';

const data = [
  {
    type: 'img',
    source:
      'https://images.prismic.io/foundingbird-blog/650c81e8-b746-4518-9565-a6120cdf9425_mkbhd.jpg?auto=compress,format',
    duration: 10000,
    action: { url: 'https://foundingbird.com', label: 'Go to Foundingbird' }
  },
  {
    type: 'video',
    source:
      'https://foundingbird-blog.cdn.prismic.io/foundingbird-blog/2dc27fe2-0552-48b0-9e4b-16044a28d039_daddariosa.mp4',
    duration: null,
    action: { url: 'https://google.com', label: 'Sign up' }
  },
  {
    type: 'img',
    source:
      'https://images.prismic.io/foundingbird-blog/5cbb28a2-10c1-41d4-865f-1ffdfa03f8d3_mkbhdd.jpg?auto=compress,format',
    duration: 5000
  },
  {
    type: 'video',
    source:
      'https://foundingbird-blog.cdn.prismic.io/foundingbird-blog/42ead80e-7011-4558-9344-54d26580c6d0_daddarioss.mp4',
    duration: null
  },
  {
    type: 'video',
    source:
      'https://foundingbird-blog.cdn.prismic.io/foundingbird-blog/7bd372f5-9474-49a2-b0dc-b7c718ec1b65_daddario.mp4',
    duration: null
  }
];

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Stories stories={data} />
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
