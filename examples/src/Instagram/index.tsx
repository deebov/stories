import React from 'react';
import Stories from 'rn-stories';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Button,
  Dimensions,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const nestedData = [
  {
    id: 'test-1',
    children: [
      {
        type: 'img',
        source:
          'https://images.unsplash.com/photo-1586039001882-5bd1bab0a9ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80',
        duration: 3000,
        action: {
          url: 'https://foundingbird.com',
          label: 'Go to Foundingbird',
        },
      },
      {
        type: 'img',
        source:
          'https://images.prismic.io/foundingbird-blog/5cbb28a2-10c1-41d4-865f-1ffdfa03f8d3_mkbhdd.jpg?auto=compress,format',
        duration: 5000,
      },
      {
        type: 'video',
        source:
          'https://foundingbird-blog.cdn.prismic.io/foundingbird-blog/42ead80e-7011-4558-9344-54d26580c6d0_daddarioss.mp4',
        duration: null,
      },
    ],
  },
  {
    id: 'test-2',
    children: [
      {
        type: 'img',
        source:
          'https://images.prismic.io/foundingbird-blog/5cbb28a2-10c1-41d4-865f-1ffdfa03f8d3_mkbhdd.jpg?auto=compress,format',
        duration: 5000,
      },
      {
        type: 'video',
        source:
          'https://foundingbird-blog.cdn.prismic.io/foundingbird-blog/42ead80e-7011-4558-9344-54d26580c6d0_daddarioss.mp4',
        duration: null,
      },
    ],
  },
  {
    id: 'test-3',
    children: [
      {
        type: 'img',
        source:
          'https://images.prismic.io/foundingbird-blog/5cbb28a2-10c1-41d4-865f-1ffdfa03f8d3_mkbhdd.jpg?auto=compress,format',
        duration: 5000,
      },
    ],
  },
];

const avatars = [
  {
    id: 'test-1',
    imgUrl:
      'https://s.gravatar.com/avatar/7290852b92b5d8794b3a4eaa282285f5?size=100&default=retro',
  },
  {
    id: 'test-2',
    imgUrl:
      'https://s.gravatar.com/avatar/baf156e7f8b32a213486555040795fbf?size=100&default=retro',
  },
  {
    id: 'test-3',
    imgUrl:
      'https://s.gravatar.com/avatar/baf156e7f8b32a213486555040795fbf?size=100&default=retro',
  },
];

interface InstagramProps {
  navigate: any;
}

const Instagram: React.FC<InstagramProps> = (props) => {
  return (
    <View style={styles.avatarsContainer}>
      {avatars.map((avatar, index) => (
        <TouchableOpacity
          onPress={() =>
            props.navigate('Stories', {
              id: avatar.id,
            })
          }
          key={avatar.id}
          activeOpacity={0.8}
        >
          <ImageBackground
            source={{ uri: avatar.imgUrl }}
            style={{
              ...styles.avatar,
              marginRight: index !== avatars.length - 1 ? 10 : 0,
            }}
          ></ImageBackground>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const ModalScreen: React.FC<any> = ({ navigation, route }) => {
  const { id } = route.params;
  const itemIndex = nestedData.findIndex((val) => val.id === id);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar animated barStyle="light-content" />
      <Stories
        nestedStories
        stories={nestedData}
        firstItem={itemIndex}
        onAllEnd={() => navigation.goBack()}
      />
    </SafeAreaView>
  );
};

const HomeScreen: React.FC<any> = ({ navigation, route }) => {
  return (
    <SafeAreaView style={{ ...styles.container, backgroundColor: '#fff' }}>
      <StatusBar animated barStyle="default" />
      <Instagram navigate={navigation.navigate} />
    </SafeAreaView>
  );
};

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
              vertical: Dimensions.get('window').height - 100,
            },
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 25,
    width: 50,
    height: 50,
    overflow: 'hidden',
  },
  avatarsContainer: {
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
