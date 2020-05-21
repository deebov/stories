import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Button,
  Dimensions,
  StatusBar
} from 'react-native';
import Stories from 'rn-stories';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

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

const ModalScreen: React.FC<any> = ({ navigation }) => (
  <SafeAreaView style={styles.container}>
    <StatusBar animated barStyle="light-content" />
    <Stories bubbleIndicators={true} stories={data} onAllEnd={() => navigation.goBack()} />
  </SafeAreaView>
);

const HomeScreen: React.FC<any> = ({ navigation }) => (
  <SafeAreaView style={{ ...styles.container, backgroundColor: '#fff' }}>
    <StatusBar animated barStyle="default" />
    <Button
      onPress={() => navigation.navigate('Stories')}
      title="Open"
      color="blue"
    />
  </SafeAreaView>
);

const RootStack = createStackNavigator();

export default function Modal() {
  return (
    <NavigationContainer>
      <RootStack.Navigator mode="modal">
        <RootStack.Screen name="Main" component={HomeScreen} />
        <RootStack.Screen
          name="Stories"
          component={ModalScreen}
          options={{
            headerShown: false,
            gestureResponseDistance: {
              vertical: Dimensions.get('window').height - 100
            }
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
