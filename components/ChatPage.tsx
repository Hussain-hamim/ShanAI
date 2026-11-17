import React, { useState, useCallback, useRef, useEffect } from 'react';
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
import { Stack, useLocalSearchParams } from 'expo-router';
import MessageInput from '@/components/MessageInput';
import MessageIdeas from '@/components/MessageIdeas';
import { Message, Role } from '@/utils/Interfaces';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import ChatMessage from '@/components/ChatMessage';
import { streamMessage } from '@/utils/api';
import { FlatList } from 'react-native-gesture-handler';
import { FlashListState } from '@shopify/flash-list/dist/FlashList';
import { useSQLiteContext } from 'expo-sqlite';
import { addChat, addMessage, getMessages } from '@/utils/Database';

const ChatPage = () => {
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

  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const [chatId, _setChatId] = useState<string>(id);
  const chatRef = useRef(chatId);

  const setChatId = (id: string) => {
    chatRef.current = id;
    _setChatId(id);
  };

  useEffect(() => {
    if (id) {
      setChatId(id);
      getMessages(db, parseInt(id, 10)).then(setMessages);
    }
  }, [id, db]);

  const getCompletion = useCallback(
    async (message: string) => {
      if (loading || !message.trim()) return;

      let activeChatId = Number(chatRef.current);

      if (!activeChatId || Number.isNaN(activeChatId)) {
        const result = await addChat(db, message);
        activeChatId = Number(result.lastInsertRowId);
        setChatId(String(activeChatId));
      }

      await addMessage(db, activeChatId, {
        content: message,
        role: Role.User,
      });

      setMessages((prev) => [
        ...prev,
        { content: message, role: Role.User },
        { content: '', role: Role.Bot },
      ]);

      let botContent = '';

      try {
        setLoading(true);

        for await (const chunk of streamMessage(message)) {
          botContent += chunk;
          setMessages((prev) => {
            const updatedMessages = [...prev];
            updatedMessages[updatedMessages.length - 1] = {
              ...updatedMessages[updatedMessages.length - 1],
              content: botContent,
            };
            return updatedMessages;
          });
        }
      } catch (error) {
        console.error('Error streaming message:', error);
        botContent =
          error instanceof Error
            ? error.message
            : 'Error fetching response. Please try again.';
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last?.role === Role.Bot) {
            updated[updated.length - 1] = { ...last, content: botContent };
            return updated;
          }
          return [...updated, { content: botContent, role: Role.Bot }];
        });
      } finally {
        if (activeChatId && botContent) {
          try {
            await addMessage(db, activeChatId, {
              content: botContent,
              role: Role.Bot,
            });
          } catch (dbError) {
            console.error('Failed to save bot message:', dbError);
          }
        }
        setLoading(false);
      }
    },
    [loading, db]
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
              source={require('@/assets/images/shanai.png')}
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
              //   flatListRef.current?.scrollToEnd({ animated: true }); // scroll to bottom while streaming have a bug
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

export default ChatPage;
