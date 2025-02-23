import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';

import ChatMessage from '@/components/ChatMessage';
import MessageInput from '@/components/MessageInput';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: Date;
}

export default function DeepSeekScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const handleSend = async (content: string) => {
    try {
      setIsLoading(true);

      // Add user message
      const userMessage: Message = {
        id: Math.random().toString(),
        content,
        role: 'user',
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Call DeepSeek API
      const response = await fetch(
        'https://api.deepseek.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer sk-e5652e02c8444322a4f8f5a7f8370287', // Replace with your valid API key
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [{ role: 'user', content }],
            stream: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get response from DeepSeek API');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Failed to create stream reader');

      let assistantMessage: Message = {
        id: Math.random().toString(),
        content: '',
        role: 'assistant',
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { done: readDone, value } = await reader.read();
        done = readDone;

        // Convert the chunk to text
        const chunk = decoder.decode(value, { stream: true });

        // Split the chunk into lines
        const lines = chunk.split('\n').filter((line) => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            if (data.choices[0]?.delta?.content) {
              assistantMessage = {
                ...assistantMessage,
                content:
                  assistantMessage.content + data.choices[0].delta.content,
              };
              setMessages((prev) => [...prev.slice(0, -1), assistantMessage]);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          content: 'Sorry, there was an error processing your request.',
          role: 'assistant',
          createdAt: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        {/* <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Ionicons name='menu' size={24} color='#fff' />
        </TouchableOpacity> */}

        <Text style={styles.title}>DeepSeek Chat</Text>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => setMessages([])}
        >
          <Ionicons name='trash-outline' size={24} color='black' />
        </TouchableOpacity>
      </View>

      {messages.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Start a conversation with DeepSeek AI!
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatMessage {...item} />}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />
      )}

      <MessageInput onShouldSendMessage={handleSend} loading={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    // padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    // color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  clearButton: {
    padding: 8,
  },
  messageList: {
    // padding: 16,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
});
