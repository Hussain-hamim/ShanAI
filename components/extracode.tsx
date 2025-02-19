// // // // //

// // // // //

// // // // //

// // // // /// INTERPOLATE EXAMPLE:

// // // // // import React from 'react';
// // // // // import { View, Text, FlatList, StyleSheet } from 'react-native';
// // // // // import Animated, {
// // // // //   useAnimatedScrollHandler,
// // // // //   useSharedValue,
// // // // //   useAnimatedStyle,
// // // // //   interpolate,
// // // // // } from 'react-native-reanimated';

// // // // // const DATA = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`);

// // // // // const ListItem = ({ index, scrollY }) => {
// // // // //   const inputRange = [(index - 1) * 100, index * 100, (index + 1) * 100];

// // // // //   // Interpolate opacity and scale based on scroll position
// // // // //   const animatedStyle = useAnimatedStyle(() => {
// // // // //     const opacity = interpolate(scrollY.value, inputRange, [0, 1, 0]);
// // // // //     const scale = interpolate(scrollY.value, inputRange, [0.8, 1, 0.8]);

// // // // //     console.log(scale);

// // // // //     return {
// // // // //       opacity,
// // // // //       transform: [{ scale }],
// // // // //     };
// // // // //   });

// // // // //   return (
// // // // //     <Animated.View style={[styles.item, animatedStyle]}>
// // // // //       <Text style={styles.text}>{`Item ${index + 1}`}</Text>
// // // // //     </Animated.View>
// // // // //   );
// // // // // };

// // // // // const App = () => {
// // // // //   const scrollY = useSharedValue(0);

// // // // //   // Update scrollY as user scrolls
// // // // //   const scrollHandler = useAnimatedScrollHandler((event) => {
// // // // //     scrollY.value = event.contentOffset.y;
// // // // //   });

// // // // //   return (
// // // // //     <Animated.FlatList
// // // // //       data={DATA}
// // // // //       keyExtractor={(item) => item}
// // // // //       renderItem={({ index }) => <ListItem index={index} scrollY={scrollY} />}
// // // // //       onScroll={scrollHandler}
// // // // //       scrollEventThrottle={16}
// // // // //     />
// // // // //   );
// // // // // };

// // // // // const styles = StyleSheet.create({
// // // // //   item: {
// // // // //     height: 100,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: '#4CAF50',
// // // // //     marginVertical: 10,
// // // // //     borderRadius: 10,
// // // // //   },
// // // // //   text: {
// // // // //     color: '#FFF',
// // // // //     fontSize: 20,
// // // // //   },
// // // // // });

// // // // // export default App;

// // // import axios from 'axios';
// // // import {
// // //   View,
// // //   Text,
// // //   KeyboardAvoidingView,
// // //   Platform,
// // //   StyleSheet,
// // //   Image,
// // // } from 'react-native';
// // // import React, { useEffect, useState } from 'react';
// // // import { StatusBar } from 'expo-status-bar';
// // // import { defaultStyles } from '@/constants/Styles';
// // // import { Stack } from 'expo-router';
// // // import HeaderDropDown from '@/components/HeaderDropDown';
// // // import MessageInput from '@/components/MessageInput';
// // // import MessageIdeas from '@/components/MessageIdeas';
// // // import { Message, Role } from '@/utils/Interfaces';
// // // import { FlashList } from '@shopify/flash-list';
// // // import ChatMessage from '@/components/ChatMessage';
// // // import { useMMKVString } from 'react-native-mmkv';
// // // import { Storage } from '@/utils/Storage';

// // // const Page = () => {
// // //   const [messages, setMessages] = useState<Message[]>([]);
// // //   const [height, setHeight] = useState(0);

// // //   // const [key, setKey] = useMMKVString('apiKey', Storage);
// // //   // const [organization, setOrganization] = useMMKVString('org', Storage);
// // //   // const [gptVersion, setGptVersion] = useMMKVString('gptVersion', Storage);

// // //   const key1 =
// // //     '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';
// // //   const organization1 = 'org-zJcp8wvmMZVylTeDZU5uUjd8';

// // //   const [key, setKey] = useState(key1);
// // //   const [organization, setOrganization] = useState(organization1);
// // //   const [gptVersion, setGptVersion] = useState('gpt-4');

// // //   const getCompletion = async (message: string) => {
// // //     console.log('getting completion for: ', message);

// // //     setMessages((prevMessages) => [
// // //       ...prevMessages,
// // //       { content: message, role: Role.User },
// // //       { role: Role.Bot, content: '...' },
// // //     ]);

// // //     try {
// // //       const response = await axios.post(
// // //         'https://api.openai.com/v1/chat/completions',
// // //         {
// // //           model: gptVersion === '4' ? 'gpt-4' : 'gpt-3.5-turbo',
// // //           messages: [{ role: 'user', content: message }],
// // //           stream: false,
// // //         },
// // //         {
// // //           headers: {
// // //             'Content-Type': 'application/json',
// // //             Authorization: `Bearer ${key}`,
// // //             'OpenAI-Organization': organization,
// // //           },
// // //         }
// // //       );

// // //       const completion = response.data.choices[0].message.content;

// // //       setMessages((prevMessages) => {
// // //         const updatedMessages = [...prevMessages];
// // //         updatedMessages[updatedMessages.length - 1].content = completion;
// // //         return updatedMessages;
// // //       });
// // //     } catch (error) {
// // //       console.error('Error fetching OpenAI completion:', error);
// // //       setMessages((prevMessages) => {
// // //         const updatedMessages = [...prevMessages];
// // //         updatedMessages[updatedMessages.length - 1].content =
// // //           'Error fetching response. Please try again.';
// // //         return updatedMessages;
// // //       });
// // //     }
// // //   };

// // //   const onLayout = (event: any) => {
// // //     const { height } = event.nativeEvent.layout;
// // //     setHeight(height);
// // //   };

// // //   return (
// // //     <View style={defaultStyles.pageContainer}>
// // //       <Stack.Screen
// // //         options={
// // //           {
// // //             // headerTitle: () => (
// // //             //   <HeaderDropDown
// // //             //     title='ChatGPT'
// // //             //     onSelect={(key) => {
// // //             //       setGptVersion(key);
// // //             //     }}
// // //             //     selected={gptVersion}
// // //             //     items={[
// // //             //       { key: '3.5', title: 'GPT-3.5', icon: 'bolt' },
// // //             //       { key: '4', title: 'GPT-4', icon: 'sparkles' },
// // //             //     ]}
// // //             //   />
// // //             // ),
// // //           }
// // //         }
// // //       />

// // //       <StatusBar style='dark' />

// // //       <View style={{ flex: 1 }} onLayout={onLayout}>
// // //         {messages.length === 0 && (
// // //           <View style={[styles.logoContainer, { marginTop: height / 2 - 100 }]}>
// // //             <Image
// // //               source={require('@/assets/images/logo-white.png')}
// // //               style={styles.image}
// // //             />
// // //           </View>
// // //         )}

// // //         <FlashList
// // //           data={messages}
// // //           renderItem={({ item }) => <ChatMessage {...item} />}
// // //           estimatedItemSize={400}
// // //           keyboardDismissMode='on-drag'
// // //           contentContainerStyle={{
// // //             paddingBottom: 150,
// // //             paddingTop: 30,
// // //           }}
// // //         />
// // //       </View>

// // //       <KeyboardAvoidingView
// // //         keyboardVerticalOffset={70}
// // //         style={{
// // //           position: 'absolute',
// // //           bottom: 0,
// // //           left: 0,
// // //           width: '100%',
// // //         }}
// // //         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// // //       >
// // //         {messages.length === 0 && <MessageIdeas onSelectCard={getCompletion} />}
// // //         <MessageInput onShouldSendMessage={getCompletion} />
// // //       </KeyboardAvoidingView>
// // //     </View>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   logoContainer: {
// // //     alignSelf: 'center',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     width: 50,
// // //     height: 50,
// // //     backgroundColor: '#000',
// // //     borderRadius: 50,
// // //   },
// // //   image: {
// // //     width: 30,
// // //     height: 30,
// // //     resizeMode: 'cover',
// // //   },
// // //   page: {
// // //     flex: 1,
// // //   },
// // // });

// // // export default Page;

// // // Error fetching OpenAI completion: [AxiosError: Request failed with status code 429]

// // /////////////////////////////////////////////////////////////////////

// // import axios from 'axios';
// // import {
// //   View,
// //   Text,
// //   KeyboardAvoidingView,
// //   Platform,
// //   StyleSheet,
// //   Image,
// //   Button,
// // } from 'react-native';
// // import React, { useEffect, useState } from 'react';
// // import { StatusBar } from 'expo-status-bar';
// // import { defaultStyles } from '@/constants/Styles';
// // import { Stack } from 'expo-router';
// // import HeaderDropDown from '@/components/HeaderDropDown';
// // import MessageInput from '@/components/MessageInput';
// // import MessageIdeas from '@/components/MessageIdeas';
// // import { Message, Role } from '@/utils/Interfaces';
// // import { FlashList } from '@shopify/flash-list';
// // import ChatMessage from '@/components/ChatMessage';
// // import { useMMKVString } from 'react-native-mmkv';
// // import { Storage } from '@/utils/Storage';

// // import OpenAI from 'openai';

// // const openai = new OpenAI({
// //   apiKey:
// //     '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',
// // });

// // const page = () => {
// //   const [send, setsend] = useState('');
// //   const completion = async () => {
// //     const result = await openai.chat.completions.create({
// //       model: 'gpt-3.5-turbo',
// //       messages: [
// //         { role: 'system', content: 'You are a helpful assistant.' },
// //         {
// //           role: 'user',
// //           content: 'Write a haiku about recursion in programming.',
// //         },
// //       ],
// //       store: true,
// //     });

// //     setsend(result.choices[0].message);
// //   };

// //   return (
// //     <View>
// //       <Text>{send}</Text>
// //       <Button title='send' onPress={completion} />
// //     </View>
// //   );
// // };

// // export default page;

// // // const Page = () => {
// // //   const [messages, setMessages] = useState<Message[]>([]);
// // //   const [height, setHeight] = useState(0);

// // //   const key1 =
// // //     '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';
// // //   const organization1 = 'org-zJcp8wvmMZVylTeDZU5uUjd8';

// // //   const [key, setKey] = useState(key1);
// // //   const [organization, setOrganization] = useState(organization1);
// // //   const [gptVersion, setGptVersion] = useState('gpt-3.5-turbo');

// // //   // const getCompletion = async (message: string) => {
// // //   //   console.log('getting completion for: ', message);

// // //   //   setMessages((prevMessages) => [
// // //   //     ...prevMessages,
// // //   //     { content: message, role: Role.User },
// // //   //     { role: Role.Bot, content: '...' },
// // //   //   ]);

// // //   //   const fetchCompletion = async (retryCount = 0) => {
// // //   //     try {
// // //   //       const response = await axios.post(
// // //   //         'https://api.openai.com/v1/chat/completions',
// // //   //         {
// // //   //           model: 'gpt-3.5-turbo',
// // //   //           messages: [{ role: 'user', content: message }],
// // //   //           stream: false,
// // //   //         },
// // //   //         {
// // //   //           headers: {
// // //   //             'Content-Type': 'application/json',
// // //   //             Authorization: `Bearer ${key}`,
// // //   //             'OpenAI-Organization': organization,
// // //   //           },
// // //   //         }
// // //   //       );

// // //   //       const completion = response.data.choices[0].message.content;

// // //   //       setMessages((prevMessages) => {
// // //   //         const updatedMessages = [...prevMessages];
// // //   //         updatedMessages[updatedMessages.length - 1].content = completion;
// // //   //         return updatedMessages;
// // //   //       });
// // //   //     } catch (error) {
// // //   //       if (error.response && error.response.status === 429 && retryCount < 5) {
// // //   //         const retryAfter = error.response.headers['retry-after'] || 1;
// // //   //         console.warn(`Rate limited. Retrying after ${retryAfter} seconds...`);
// // //   //         console.warn('nooooooo why');
// // //   //         setTimeout(() => fetchCompletion(retryCount + 1), retryAfter * 1000);
// // //   //       } else {
// // //   //         console.error('Error fetching OpenAI completion:', error);
// // //   //         setMessages((prevMessages) => {
// // //   //           const updatedMessages = [...prevMessages];
// // //   //           updatedMessages[updatedMessages.length - 1].content =
// // //   //             'Error fetching response. Please try again.';
// // //   //           return updatedMessages;
// // //   //         });
// // //   //       }
// // //   //     }
// // //   //   };

// // //   //   fetchCompletion();
// // //   // };
// // //   const openai = new OpenAI({
// // //     apiKey:
// // //       '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',
// // //   });

// // //   const getCompletion = async (message: any) => {
// // //     setMessages((prevMessages) => [
// // //       ...prevMessages,
// // //       { content: message, role: Role.User },
// // //       { role: Role.Bot, content: '...' },
// // //     ]);

// // //     const completion = await openai.chat.completions.create({
// // //       model: 'gpt-3.5-turbo',
// // //       messages: [
// // //         { role: 'system', content: 'You are a helpful assistant.' },
// // //         {
// // //           role: 'user',
// // //           content: 'Write a haiku about recursion in programming.',
// // //         },
// // //       ],
// // //       store: true,
// // //     });

// // //     const result = completion.choices[0].message;
// // //     console.log(completion.choices[0].message);

// // //     setMessages((prevMessages) => {
// // //       const updatedMessages = [...prevMessages];
// // //       updatedMessages[updatedMessages.length - 1].content += result;

// // //       return updatedMessages;
// // //     });
// // //   };

// // //   const onLayout = (event: any) => {
// // //     const { height } = event.nativeEvent.layout;
// // //     setHeight(height);
// // //   };

// // //   return (
// // //     <View style={defaultStyles.pageContainer}>
// // //       <Stack.Screen options={{}} />

// // //       <StatusBar style='dark' />

// // //       <View style={{ flex: 1 }} onLayout={onLayout}>
// // //         {messages.length === 0 && (
// // //           <View style={[styles.logoContainer, { marginTop: height / 2 - 100 }]}>
// // //             <Image
// // //               source={require('@/assets/images/logo-white.png')}
// // //               style={styles.image}
// // //             />
// // //           </View>
// // //         )}

// // //         <FlashList
// // //           data={messages}
// // //           renderItem={({ item }) => <ChatMessage {...item} />}
// // //           estimatedItemSize={400}
// // //           keyboardDismissMode='on-drag'
// // //           contentContainerStyle={{
// // //             paddingBottom: 150,
// // //             paddingTop: 30,
// // //           }}
// // //         />
// // //       </View>

// // //       <KeyboardAvoidingView
// // //         keyboardVerticalOffset={70}
// // //         style={{
// // //           position: 'absolute',
// // //           bottom: 0,
// // //           left: 0,
// // //           width: '100%',
// // //         }}
// // //         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// // //       >
// // //         {messages.length === 0 && <MessageIdeas onSelectCard={getCompletion} />}
// // //         <MessageInput onShouldSendMessage={getCompletion} />
// // //       </KeyboardAvoidingView>
// // //     </View>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   logoContainer: {
// // //     alignSelf: 'center',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     width: 50,
// // //     height: 50,
// // //     backgroundColor: '#000',
// // //     borderRadius: 50,
// // //   },
// // //   image: {
// // //     width: 30,
// // //     height: 30,
// // //     resizeMode: 'cover',
// // //   },
// // //   page: {
// // //     flex: 1,
// // //   },
// // // });

// // // export default Page;

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   ScrollView,
//   StyleSheet,
// } from 'react-native';
// import axios from 'axios';

// export const ChatScreen = () => {
//   const [input, setInput] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const apiKey =
//     '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';

//   const model = 'gpt-3.5-turbo'; // Change to 'gpt-4' if needed

//   const handleSendMessage = async () => {
//     if (!input.trim()) return;

//     setMessages((prev) => [
//       ...prev,
//       { role: 'user', content: input },
//       { role: 'bot', content: '' },
//     ]);
//     setInput('');
//     setIsLoading(true);

//     try {
//       const response = await axios.post(
//         'https://api.openai.com/v1/chat/completions',
//         {
//           model: model,
//           messages: [{ role: 'user', content: input }],
//           stream: true,
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${apiKey}`,
//           },
//           responseType: 'stream',
//         }
//       );

//       response.data.on('data', (chunk) => {
//         const lines = chunk
//           .toString()
//           .split('\n')
//           .filter((line) => line.trim() !== '');

//         for (const line of lines) {
//           const message = line.replace(/^data: /, '');
//           if (message === '[DONE]') {
//             setIsLoading(false);
//             return;
//           }

//           try {
//             const parsed = JSON.parse(message);
//             const content = parsed.choices[0]?.delta?.content;

//             if (content) {
//               setMessages((prev) => {
//                 const updatedMessages = [...prev];
//                 updatedMessages[updatedMessages.length - 1].content += content;
//                 return updatedMessages;
//               });
//             }
//           } catch (error) {
//             console.error('Error parsing stream:', error);
//           }
//         }
//       });
//     } catch (error) {
//       console.error('Error fetching completion:', error);
//       setIsLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView style={styles.chatContainer}>
//         {messages.map((msg, index) => (
//           <View
//             key={index}
//             style={[
//               styles.messageBubble,
//               msg.role === 'user' ? styles.userMessage : styles.botMessage,
//             ]}
//           >
//             <Text style={styles.messageText}>{msg.content}</Text>
//           </View>
//         ))}
//       </ScrollView>

//       <TextInput
//         style={styles.input}
//         value={input}
//         onChangeText={setInput}
//         placeholder='Type your message...'
//       />

//       <Button
//         title={isLoading ? 'Loading...' : 'Send'}
//         onPress={handleSendMessage}
//         disabled={isLoading}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   chatContainer: {
//     flex: 1,
//     marginBottom: 10,
//   },
//   messageBubble: {
//     padding: 10,
//     borderRadius: 10,
//     marginVertical: 5,
//     maxWidth: '80%',
//   },
//   userMessage: {
//     alignSelf: 'flex-end',
//     backgroundColor: '#DCF8C6',
//   },
//   botMessage: {
//     alignSelf: 'flex-start',
//     backgroundColor: '#E3E3E3',
//   },
//   messageText: {
//     fontSize: 16,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     marginBottom: 10,
//   },
// });

// export default ChatScreen;

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   ScrollView,
//   StyleSheet,
// } from 'react-native';
// import OpenAI from 'openai';

// // Initialize OpenAI client
// const openai = new OpenAI({
//   apiKey:
//     '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',
//   // 'sk-abcdef1234567890abcdef1234567890abcdef12',
//   // '  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',
// });

// const ChatScreen = () => {
//   const [input, setInput] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSendMessage = async () => {
//     if (!input.trim()) return;

//     setMessages((prev) => [
//       ...prev,
//       { role: 'user', content: input },
//       { role: 'bot', content: '' },
//     ]);
//     setInput('');
//     setIsLoading(true);

//     try {
//       const stream = await openai.chat.completions.create({
//         model: 'gpt-3.5-turbo', // Change to 'gpt-4' if needed
//         messages: [{ role: 'user', content: input }],
//         stream: true,
//       });

//       for await (const part of stream) {
//         const content = part.choices[0]?.delta?.content;

//         if (content) {
//           setMessages((prev) => {
//             const updatedMessages = [...prev];
//             updatedMessages[updatedMessages.length - 1].content += content;
//             return updatedMessages;
//           });
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching completion:', error);
//       console.log('errorrrrrrrrrrrrrrrrrrrrrrrr');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView style={styles.chatContainer}>
//         {messages.map((msg, index) => (
//           <View
//             key={index}
//             style={[
//               styles.messageBubble,
//               msg.role === 'user' ? styles.userMessage : styles.botMessage,
//             ]}
//           >
//             <Text style={styles.messageText}>{msg.content}</Text>
//           </View>
//         ))}
//       </ScrollView>

//       <TextInput
//         style={styles.input}
//         value={input}
//         onChangeText={setInput}
//         placeholder='Type your message...'
//       />

//       <Button
//         title={isLoading ? 'Loading...' : 'Send'}
//         onPress={handleSendMessage}
//         disabled={isLoading}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   chatContainer: {
//     flex: 1,
//     marginBottom: 10,
//   },
//   messageBubble: {
//     padding: 10,
//     borderRadius: 10,
//     marginVertical: 5,
//     maxWidth: '80%',
//   },
//   userMessage: {
//     alignSelf: 'flex-end',
//     backgroundColor: '#DCF8C6',
//   },
//   botMessage: {
//     alignSelf: 'flex-start',
//     backgroundColor: '#E3E3E3',
//   },
//   messageText: {
//     fontSize: 16,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     marginBottom: 10,
//   },
// });

// export default ChatScreen;

///////////////////////////////////////////////////////////////////

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   ScrollView,
//   StyleSheet,
// } from 'react-native';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// // Initialize Gemini API client
// const client = new GoogleGenerativeAI(
//   'AIzaSyC6sq9zm7mKED_jw59dB4590D9Kpazk5zQ'
// );

// // client.getGenerativeModel({model: 'gemini-1.5-flash'})
// const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

// const ChatScreen = () => {
//   const [input, setInput] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, seterror] = useState();

//   const handleSendMessage = async () => {
//     if (!input.trim()) return;

//     setMessages((prev) => [
//       ...prev,
//       { role: 'user', content: input },
//       { role: 'bot', content: '' },
//     ]);
//     setInput('');
//     setIsLoading(true);

//     try {
//       const prompt = 'explain how ai work';
//       // const prompt = messages[0].content;

//       const result = await model.generateContent(prompt);

//       const content = result.response.text();

//       console.log(content);

//       if (content) {
//         setMessages((prev) => {
//           const updatedMessages = [...prev];
//           updatedMessages[updatedMessages.length - 1] += content;
//           return updatedMessages;
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching completion:', error);
//       // setMessages((prev) => [...prev, { role: 'bot', content: error }]);
//       // setMessages([error]);
//       seterror(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView style={styles.chatContainer}>
//         {messages.map((msg, index) => (
//           <View
//             key={index}
//             style={[
//               styles.messageBubble,
//               msg.role === 'user' ? styles.userMessage : styles.botMessage,
//             ]}
//           >
//             <Text style={styles.messageText}>{msg.content}</Text>
//           </View>
//         ))}
//       </ScrollView>

//       <TextInput
//         style={styles.input}
//         value={input}
//         onChangeText={setInput}
//         placeholder='Type your message...'
//       />

//       <Button
//         title={isLoading ? 'Loading...' : 'Send'}
//         onPress={handleSendMessage}
//         disabled={isLoading}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   chatContainer: {
//     flex: 1,
//     marginBottom: 10,
//   },
//   messageBubble: {
//     padding: 10,
//     borderRadius: 10,
//     marginVertical: 5,
//     maxWidth: '80%',
//   },
//   userMessage: {
//     alignSelf: 'flex-end',
//     backgroundColor: '#DCF8C6',
//   },
//   botMessage: {
//     alignSelf: 'flex-start',
//     backgroundColor: '#E3E3E3',
//   },
//   messageText: {
//     fontSize: 16,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     marginBottom: 10,
//   },
// });

// export default ChatScreen;
