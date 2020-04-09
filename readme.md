# Instagram-like stories for Expo React native

> Note: This library is under development. Suggestions and PRs are welcomed and appreciated!

## Install
```bash
yarn add rn-stories
```

## Usage
Head to [examples](./examples) folder for more examples

```tsx
import React from 'react';
import { SafeAreaView } from 'react-native';
import Stories from 'rn-stories';

const data = [
  {
    type: 'img',
    source:
      'https://images.unsplash.com/photo-1586039001882-5bd1bab0a9ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80',
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
  .....
];

export default function App() {
  const onStoryEnd = () => {
    console.log('Stories ended')
  }

  return (
    <SafeAreaView>
      <Stories stories={data} onStoryEnd={onStoryEnd} />
    </SafeAreaView>
  );
}
```

## Props

Prop | Description | Type | Default
------ | ------ | ------ | ------
**`stories`** | Array of Story | Array | **Required**
**`onStoryEnd`** | Callback function to be called after all or last item in stories array reaches end | Function | __Optional__

## Types

### Story

Prop | Description | Type | Default
------ | ------ | ------ | ------
**`type`** | Type of story | Enum `video` or `img` | **Required**
**`source`** | URL of video or img | String | **Required**
**`duration`** | Duration of how long an image slide should be shown in millisenconds | Number | Required for `img` only
**`action`** | Swipe up action | Array of `{label: string, url: string}` | __Optional__

## Todo

- [x] Get rid of react-native-eva-icons and use a sinlge icon
- [ ] Add a Close button/icon
- [ ] Multiple stories
- [ ] Add an option to pass custom Footer
- [ ] Add an option to pass custom Indicators
- [ ] Add an option to change Indicators' style and look
- [ ] Make a separate package that uses react-native-video
