// import {
//   View,
//   Text,
//   Button,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Image,
//   Keyboard,
// } from 'react-native';
// import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import { useAuth } from '@clerk/clerk-react';
// import { StatusBar } from 'expo-status-bar';
// import { defaultStyles } from '@/constants/Styles';
// import { Redirect, Stack } from 'expo-router';
// import HeaderDropDown from '@/components/HeaderDropDown';
// import MessageInput from '@/components/MessageInput';
// import MessageIdeas from '@/components/MessageIdeas';
// import { Message, Role } from '@/utils/Interfaces';
// import { FlashList } from '@shopify/flash-list';
// import ChatMessage from '@/components/ChatMessage';
// import { useMMKVString } from 'react-native-mmkv';
// import { Storage } from '@/utils/Storage';
// import OpenAI from 'react-native-openai';
// import { streamMessage } from '@/utils/api';
// // import { sendMessage } from '@/utils/api';

// const DUMMY_MESSAGES: Message[] = [
//   { content: 'Hello, how can i help you today!', role: Role.Bot },
//   {
//     content:
//       'i need you with my react native app coding can you help em please!i need you with my react native app coding can you help em pleasei need you with my react native app coding can you help em pleasei need you with my react native app coding can you help em pleasei need you with my react native app coding can you help em please',
//     role: Role.User,
//   },
//   { content: 'Hello, how can i help you today!', role: Role.Bot },
//   {
//     content:
//       'i pleasei need you with my react native app coding can you help em pleasei need you with my react native app coding can you help em pleasei need you with my react native app coding can you help em please',
//     role: Role.User,
//   },
// ];

// const Page = () => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [height, setHeight] = useState(0);
//   const [loading, setloading] = useState(false);

//   const sendMessage = (message: string) => {
//     setMessages((prev) => {
//       const messages = [
//         ...prev,
//         {
//           content: message,
//           role: Role.User,
//         },
//       ];
//       return messages;
//     });
//   };

//   const updateLastMessage = (chunk: string) => {
//     const AllMessages = [...messages];

//     const lastMessage = AllMessages[AllMessages.length - 1];

//     if (lastMessage) {
//       AllMessages[AllMessages.length - 1] = {
//         ...lastMessage,
//         content: lastMessage.content + chunk,
//         role: Role.Bot,
//       };
//     }
//     return { AllMessages };
//   };

//   const getCompletion = useCallback(
//     async (message: any) => {
//       sendMessage(message);
//       //
//       try {
//         setloading(true);

//         // const response = await sendMessage(message);
//         for await (const chunk of streamMessage(message)) {
//           // Add AI response
//           // setMessages((prev) => {
//           //   const messages = [
//           //     ...prev,
//           //     {
//           //       content: response,
//           //       role: Role.Bot,
//           //     },
//           //   ];
//           //   return messages;
//           // });
//           //
//           updateLastMessage(chunk);
//           console.log(chunk);
//         }
//       } catch (error: any) {
//         // Add error message with specific error details
//         setMessages((prev) => {
//           const messages = [
//             ...prev,
//             {
//               content: error.message,
//               role: Role.Bot,
//             },
//           ];
//           return messages;
//         });
//       } finally {
//         setloading(false);
//       }
//     },
//     [sendMessage, setloading, updateLastMessage]
//   );

//   const onLayout = (event: any) => {
//     // invoke on layout changes
//     const { height } = event.nativeEvent.layout;
//     setHeight(height);
//   };

//   return (
//     <View style={defaultStyles.pageContainer}>
//       <Stack.Screen
//         options={
//           {
//             // headerTitle: () => (
//             //   <HeaderDropDown
//             //     title='ChatGPT'
//             //     onSelect={(key) => {
//             //       setGptVersion(key);
//             //     }}
//             //     selected={gptVersion}
//             //     items={[
//             //       { key: '3.5', title: 'GPT-3.5', icon: 'bolt' },
//             //       { key: '4', title: 'GPT-4', icon: 'sparkles' },
//             //     ]}
//             //   />
//             // ),
//           }
//         }
//       />

//       <StatusBar style='dark' />

//       <View style={{ flex: 1 }} onLayout={onLayout}>
//         {messages.length === 0 && (
//           <View style={[styles.logoContainer, { marginTop: height / 2 - 100 }]}>
//             <Image
//               source={require('@/assets/images/logo-white.png')}
//               style={styles.image}
//             />
//           </View>
//         )}

//         <FlashList
//           data={messages}
//           renderItem={({ item }) => <ChatMessage loading={loading} {...item} />}
//           estimatedItemSize={400}
//           keyboardDismissMode='on-drag'
//           contentContainerStyle={{
//             paddingBottom: 150,
//             paddingTop: 30,
//           }}
//         />
//       </View>

//       <KeyboardAvoidingView
//         keyboardVerticalOffset={70}
//         style={{
//           position: 'absolute',
//           bottom: 0,
//           left: 0,
//           width: '100%',
//         }}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       >
//         {messages.length === 0 && <MessageIdeas onSelectCard={getCompletion} />}
//         <MessageInput loading={loading} onShouldSendMessage={getCompletion} />
//       </KeyboardAvoidingView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   logoContainer: {
//     alignSelf: 'center',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 50,
//     height: 50,
//     backgroundColor: '#000',
//     borderRadius: 50,
//   },
//   image: {
//     width: 30,
//     height: 30,
//     resizeMode: 'cover',
//   },
//   page: {
//     flex: 1,
//   },
// });

// export default Page;

////////////////////////////////////

// import React, { useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   Image,
// } from 'react-native';
// import { StatusBar } from 'expo-status-bar';
// import { defaultStyles } from '@/constants/Styles';
// import { Stack } from 'expo-router';
// import HeaderDropDown from '@/components/HeaderDropDown';
// import MessageInput from '@/components/MessageInput';
// import MessageIdeas from '@/components/MessageIdeas';
// import { Message, Role } from '@/utils/Interfaces';
// import { FlashList } from '@shopify/flash-list';
// import ChatMessage from '@/components/ChatMessage';
// import { streamMessage } from '@/utils/api';

// const Page = () => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [height, setHeight] = useState(0);
//   const [loading, setLoading] = useState(false);

//   const updateLastMessage = (chunk: string) => {
//     const allMessages = [...messages];
//     const lastMessage = allMessages[allMessages.length - 1];

//     if (lastMessage) {
//       allMessages[allMessages.length - 1] = {
//         ...lastMessage,
//         content: lastMessage.content + chunk,
//         role: Role.Bot,
//       };
//     }
//     return { allMessages };
//   };

//   const getCompletion = useCallback(
//     async (message: string) => {
//       setMessages((prev) => [
//         ...prev,
//         { content: message, role: Role.User },
//         { content: '', role: Role.Bot },
//       ]);

//       try {
//         setLoading(true);

//         for await (const chunk of streamMessage(message)) {
//           setMessages((prev) => {
//             const updatedMessages = [...prev];
//             updatedMessages[updatedMessages.length - 1].content += chunk;
//             return updatedMessages;
//           });
//         }
//       } catch (error) {
//         console.error('Error streaming message:', error);
//         setMessages((prev) => [
//           ...prev,
//           {
//             content: 'Error fetching response. Please try again.',
//             role: Role.Bot,
//           },
//         ]);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [messages]
//   );

//   const onLayout = (event: any) => {
//     const { height } = event.nativeEvent.layout;
//     setHeight(height);
//   };

//   return (
//     <View style={defaultStyles.pageContainer}>
//       <Stack.Screen options={{}} />
//       <StatusBar style='dark' />
//       <View style={{ flex: 1 }} onLayout={onLayout}>
//         {messages.length === 0 && (
//           <View style={[styles.logoContainer, { marginTop: height / 2 - 100 }]}>
//             <Image
//               source={require('@/assets/images/logo-white.png')}
//               style={styles.image}
//             />
//           </View>
//         )}
//         <FlashList
//           data={messages}
//           renderItem={({ item }) => <ChatMessage loading={loading} {...item} />}
//           estimatedItemSize={400}
//           keyboardDismissMode='on-drag'
//           contentContainerStyle={{
//             paddingBottom: 150,
//             paddingTop: 30,
//           }}
//         />
//       </View>
//       <KeyboardAvoidingView
//         keyboardVerticalOffset={70}
//         style={{
//           position: 'absolute',
//           bottom: 0,
//           left: 0,
//           width: '100%',
//         }}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       >
//         {messages.length === 0 && <MessageIdeas onSelectCard={getCompletion} />}
//         <MessageInput loading={loading} onShouldSendMessage={getCompletion} />
//       </KeyboardAvoidingView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   logoContainer: {
//     alignSelf: 'center',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 50,
//     height: 50,
//     backgroundColor: '#000',
//     borderRadius: 50,
//   },
//   image: {
//     width: 30,
//     height: 30,
//     resizeMode: 'cover',
//   },
//   page: {
//     flex: 1,
//   },
// });

// export default Page;
/////////////////////////////////////

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { defaultStyles } from '@/constants/Styles';
import { Stack } from 'expo-router';
import HeaderDropDown from '@/components/HeaderDropDown';
import MessageInput from '@/components/MessageInput';
import MessageIdeas from '@/components/MessageIdeas';
import { Message, Role } from '@/utils/Interfaces';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import ChatMessage from '@/components/ChatMessage';
import { streamMessage } from '@/utils/api';
import { FlatList } from 'react-native-gesture-handler';
import { FlashListState } from '@shopify/flash-list/dist/FlashList';

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [height, setHeight] = useState(0);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlashList>(null);

  // const updateLastMessage = (chunk: string) => {
  //   const allMessages = [...messages];
  //   const lastMessage = allMessages[allMessages.length - 1];

  //   if (lastMessage) {
  //     allMessages[allMessages.length - 1] = {
  //       ...lastMessage,
  //       content: lastMessage.content + chunk,
  //       role: Role.Bot,
  //     };
  //   }
  //   return { allMessages };
  // };

  const getCompletion = useCallback(
    async (message: string) => {
      setMessages((prev) => [
        ...prev,
        { content: message, role: Role.User },
        { content: '', role: Role.Bot },
      ]);

      try {
        setLoading(true);

        for await (const chunk of streamMessage(message)) {
          setMessages((prev) => {
            const updatedMessages = [...prev];
            updatedMessages[updatedMessages.length - 1].content += chunk;
            return updatedMessages;
          });
        }
      } catch (error) {
        console.error('Error streaming message:', error);
        setMessages((prev) => [
          ...prev,
          {
            content: 'Error fetching response. Please try again.',
            role: Role.Bot,
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages]
  );

  const onLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setHeight(height);
  };

  return (
    <View style={defaultStyles.pageContainer}>
      <Stack.Screen options={{}} />
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
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => <ChatMessage loading={loading} {...item} />}
          estimatedItemSize={400}
          keyboardDismissMode='on-drag'
          onContentSizeChange={() => {
            if (messages.length > 0) {
              // if (loading) {
              // flatListRef.current?.scrollToEnd({ animated: true });
            }
          }}
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
        <MessageInput loading={loading} onShouldSendMessage={getCompletion} />
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
