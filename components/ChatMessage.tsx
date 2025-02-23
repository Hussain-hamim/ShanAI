import Colors from '@/constants/Colors';
import { Message, Role } from '@/utils/Interfaces';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import MarkdownDisplay from 'react-native-markdown-display';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const ChatMessage = ({
  content,
  role,
  loading,
}: Message & { loading?: boolean }) => {
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(content);
  };

  const copyCodeToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
  };

  const rules = {
    text: (node: any) => (
      <Text key={node.key} style={styles.text} selectable={true}>
        {node.content}
      </Text>
    ),
    code_inline: (node: any) => (
      <Text selectable={true} key={node.key} style={styles.codeInline}>
        {node.content}
      </Text>
    ),
    code_block: (node: any) => (
      <View key={node.key} style={styles.codeBlock}>
        <SyntaxHighlighter
          selectable={true}
          language='javascript'
          style={atomOneDark}
        >
          {node.content}
        </SyntaxHighlighter>
        <TouchableOpacity
          style={styles.copyButton}
          onPress={() => copyCodeToClipboard(node.content)}
        >
          <Ionicons name='copy-outline' size={16} color='white' />
        </TouchableOpacity>
      </View>
    ),
    heading1: (node: any) => (
      <Text key={node.key} style={styles.heading1}>
        {node.content}
      </Text>
    ),
    heading2: (node: any) => (
      <Text key={node.key} style={styles.heading2}>
        {node.content}
      </Text>
    ),
    heading3: (node: any) => (
      <Text key={node.key} style={styles.heading3}>
        {node.content}
      </Text>
    ),
    blockquote: (node: any) => (
      <View key={node.key} style={styles.blockquote}>
        <Text style={styles.blockquoteText}>{node.content}</Text>
      </View>
    ),
  };

  return (
    <View style={styles.container}>
      <View style={styles.messageWrapper}>
        {role === Role.Bot ? (
          <Image
            source={require('@/assets/images/logo-white.png')}
            style={styles.avatar}
          />
        ) : (
          <Image
            source={require('@/assets/images/anime-pfp.jpg')}
            style={styles.avatar}
          />
        )}
        <View style={styles.messageBubble}>
          <MarkdownDisplay style={styles.markdown} rules={rules}>
            {content}
          </MarkdownDisplay>
          {role === Role.Bot && (
            <Pressable style={styles.copyAllButton} onPress={copyToClipboard}>
              <Ionicons name='copy-outline' size={18} color='white' />
              <Text style={styles.copyAllText}>Copy</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    marginVertical: 8,
  },
  messageWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#000',
    marginRight: 10,
  },
  messageBubble: {
    backgroundColor: '#2d2d2dda',
    padding: 12,
    borderRadius: 16,
    flex: 1,
    maxWidth: '100%', // Ensures it takes full width
    alignSelf: 'stretch', // Helps stretch to full available width
  },

  markdown: {
    body: {
      color: '#2d2d2d',
      fontSize: 16,
    },
    strong: { fontWeight: 'bold', color: 'white' },
    heading1: {
      fontSize: 22,
      fontWeight: 'bold',
      color: 'white',
      marginVertical: 8,
    },
    heading2: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
      marginVertical: 6,
    },
    heading3: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
      marginVertical: 4,
    },
  },
  text: {
    fontSize: 16,
    color: 'white',
  },
  codeBlock: {
    backgroundColor: '#1e1e1e',
    padding: 10,
    borderRadius: 6,
    marginVertical: 6,
    position: 'relative',
  },
  codeInline: {
    backgroundColor: '#333',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    color: '#dcdcaa',
    fontFamily: 'monospace',
  },
  copyButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
    backgroundColor: '#444',
    borderRadius: 4,
  },
  copyAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#444',
    padding: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  copyAllText: {
    color: 'white',
    marginLeft: 4,
    fontSize: 14,
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: '#888',
    paddingLeft: 8,
    marginVertical: 4,
  },
  blockquoteText: {
    color: '#ccc',
    fontStyle: 'italic',
  },
});

export default ChatMessage;
