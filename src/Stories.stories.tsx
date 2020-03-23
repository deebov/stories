import React from 'react';

import { storiesOf } from '@storybook/react-native';
import { ApplicationProvider } from 'react-native-ui-kitten';
import { mapping, light as lightTheme } from '@eva-design/eva';
import { StyleSheet, SafeAreaView } from 'react-native';
import CenterView from '../../../storybook/CenterView/index';

import Stories from './Stories';

storiesOf('Stories', module)
  .addDecorator((getStory: any) => (
    <ApplicationProvider mapping={mapping} theme={lightTheme}>
      <SafeAreaView style={styles.container}>
        <CenterView>{getStory()}</CenterView>
      </SafeAreaView>
    </ApplicationProvider>
  ))
  .add('Example 1', () => <Stories />);

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
  },
});
