import {
  View,
  Text,
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Image,
  Keyboard,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { StatusBar } from 'expo-status-bar';
import { defaultStyles } from '@/constants/Styles';
import { Stack } from 'expo-router';
import HeaderDropDown from '@/components/HeaderDropDown';
import MessageInput from '@/components/MessageInput';
import MessageIdeas from '@/components/MessageIdeas';
import { Message, Role } from '@/utils/Interfaces';
import { FlashList } from '@shopify/flash-list';
import ChatMessage from '@/components/ChatMessage';
import { useMMKVString } from 'react-native-mmkv';
import { storage } from '@/utils/Storage';

const DUMMY_MESSAGES: Message[] = [
  { content: 'Hello, how can i help you today!', role: Role.Bot },
  {
    content:
      'i need you with my react native app coding can you help em please!i need you with my react native app coding can you help em pleasei need you with my react native app coding can you help em pleasei need you with my react native app coding can you help em pleasei need you with my react native app coding can you help em please',
    role: Role.User,
  },
  { content: 'Hello, how can i help you today!', role: Role.Bot },
  {
    content:
      'i pleasei need you with my react native app coding can you help em pleasei need you with my react native app coding can you help em pleasei need you with my react native app coding can you help em please',
    role: Role.User,
  },
  { content: 'Hello, how can i help you today!', role: Role.Bot },
  {
    content:
      'i need you w em please!i need you with my react native app coding can you help em pleasei need you with my react native app coding can you help em pleasei need you with my react native app coding can you help em pleasei need you with my react native app coding can you help em please',
    role: Role.User,
  },
  { content: 'Hello, how can i help you today!', role: Role.Bot },
  {
    content: 'i ct native app coding can you help em please',
    role: Role.User,
  },
];

const Page = () => {
  const { signOut } = useAuth();
  const [messages, setMessages] = useState<Message[]>(DUMMY_MESSAGES);
  const [height, setHeight] = useState(0);

  const [key, setKey] = useMMKVString('apiKey', storage);
  const [organization, setOrganization] = useMMKVString('org', storage);
  const [gptVersion, setGptVersion] = useMMKVString('gptVersion', storage);

  const onLayout = (event: any) => {
    // invoke on layout changes
    const { height } = event.nativeEvent.layout;
    setHeight(height);
  };

  const getCompletion = (message: string) => {
    console.log('getting completion for: ', message);
  };

  return (
    <View style={defaultStyles.pageContainer}>
      <Stack.Screen
        options={
          {
            // headerTitle: () => (
            // <HeaderDropDown
            //   title='ChatGPT'
            //   onSelect={(key) => {
            //     setGptVersion(key);
            //   }}
            //   selected={gptVersion}
            //   items={[
            //     { key: '3.5', title: 'GPT-3.5', icon: 'bolt' },
            //     { key: '4', title: 'GPT-4', icon: 'sparkles' },
            //   ]}
            // />
            // ),
          }
        }
      />

      <StatusBar style='dark' />

      <View style={{ flex: 1 }} onLayout={onLayout}>
        {messages.length === 0 && (
          <View style={[styles.logoContainer, { marginTop: height / 2 - 100 }]}>
            <Image
              source={require('@/assets/images/logo-white.png')}
              style={styles.image}
            />
          </View>
        )}

        <FlashList
          data={messages}
          renderItem={({ item }) => <ChatMessage {...item} />}
          estimatedItemSize={400}
          keyboardDismissMode='on-drag'
          contentContainerStyle={{
            paddingBottom: 150,
            paddingTop: 30,
          }}
        />
      </View>

      <KeyboardAvoidingView
        keyboardVerticalOffset={70}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {messages.length === 0 && <MessageIdeas onSelectCard={getCompletion} />}
        <MessageInput onShouldSendMessage={getCompletion} />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    backgroundColor: '#000',
    borderRadius: 50,
  },
  image: {
    width: 30,
    height: 30,
    resizeMode: 'cover',
  },
  page: {
    flex: 1,
  },
});

export default Page;

//

//

//

/// INTERPOLATE EXAMPLE:

// import React from 'react';
// import { View, Text, FlatList, StyleSheet } from 'react-native';
// import Animated, {
//   useAnimatedScrollHandler,
//   useSharedValue,
//   useAnimatedStyle,
//   interpolate,
// } from 'react-native-reanimated';

// const DATA = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`);

// const ListItem = ({ index, scrollY }) => {
//   const inputRange = [(index - 1) * 100, index * 100, (index + 1) * 100];

//   // Interpolate opacity and scale based on scroll position
//   const animatedStyle = useAnimatedStyle(() => {
//     const opacity = interpolate(scrollY.value, inputRange, [0, 1, 0]);
//     const scale = interpolate(scrollY.value, inputRange, [0.8, 1, 0.8]);

//     console.log(scale);

//     return {
//       opacity,
//       transform: [{ scale }],
//     };
//   });

//   return (
//     <Animated.View style={[styles.item, animatedStyle]}>
//       <Text style={styles.text}>{`Item ${index + 1}`}</Text>
//     </Animated.View>
//   );
// };

// const App = () => {
//   const scrollY = useSharedValue(0);

//   // Update scrollY as user scrolls
//   const scrollHandler = useAnimatedScrollHandler((event) => {
//     scrollY.value = event.contentOffset.y;
//   });

//   return (
//     <Animated.FlatList
//       data={DATA}
//       keyExtractor={(item) => item}
//       renderItem={({ index }) => <ListItem index={index} scrollY={scrollY} />}
//       onScroll={scrollHandler}
//       scrollEventThrottle={16}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   item: {
//     height: 100,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#4CAF50',
//     marginVertical: 10,
//     borderRadius: 10,
//   },
//   text: {
//     color: '#FFF',
//     fontSize: 20,
//   },
// });

// export default App;
