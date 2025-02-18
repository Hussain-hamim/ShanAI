import Colors from '@/constants/Colors';
// import {
//   copyImageToClipboard,
//   downloadAndSaveImage,
//   shareImage,
// } from '@/utils/Image';
import { Message, Role } from '@/utils/Interfaces';
import { Link } from 'expo-router';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import * as ContextMenu from 'zeego/context-menu';
import MarkdownDisplay from 'react-native-markdown-display';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

const ChatMessage = ({
  content,
  role,
  imageUrl,
  prompt,
  loading,
}: Message & { loading?: boolean }) => {
  //

  //
  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
  };

  const rules = {
    code_inline: (node: any) => {
      return (
        <View style={styles.codeBlock} key={node.key}>
          <Text style={styles.codeText}>{node.content}</Text>
          <TouchableOpacity
            style={styles.copyButton}
            onPress={() => copyToClipboard(node.content)}
          >
            <Ionicons name='copy-outline' size={16} color='#666' />
          </TouchableOpacity>
        </View>
      );
    },
    code_block: (node: any) => {
      return (
        <View style={styles.codeBlock} key={node.key}>
          <Text style={styles.codeText}>{node.content}</Text>
          <TouchableOpacity
            style={styles.copyButton}
            onPress={() => copyToClipboard(node.content)}
          >
            <Ionicons name='copy-outline' size={16} color='#666' />
          </TouchableOpacity>
        </View>
      );
    },
  };

  return (
    <View style={styles.row}>
      {role === Role.Bot ? (
        <View style={[styles.item, { backgroundColor: '#000' }]}>
          <Image
            source={require('@/assets/images/logo-white.png')}
            style={styles.btnImage}
          />
        </View>
      ) : (
        <Image
          source={require('@/assets/images/anime-pfp.jpg')}
          style={styles.avatar}
        />
      )}

      <View style={[styles.bubble]}>
        <MarkdownDisplay
          style={{
            body: styles.markdownBody,
            strong: styles.markdownBold,
            heading1: styles.markdownHeading,
            heading2: styles.markdownHeading,
            heading3: styles.markdownHeading,
          }}
          rules={rules}
        >
          {content}
        </MarkdownDisplay>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    // gap: 14,
    // marginVertical: 12,
  },
  item: {
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 15,
  },
  btnImage: {
    margin: 6,
    width: 16,
    height: 16,
  },
  avatar: {
    marginTop: 15,

    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#000',
  },
  text: {
    padding: 4,
    fontSize: 16,
    paddingHorizontal: 10,
    flexWrap: 'wrap',
    // flex: 1,
  },
  previewImage: {
    width: 240,
    height: 240,
    borderRadius: 10,
  },
  loading: {
    justifyContent: 'center',
    height: 26,
    marginLeft: 14,
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  assistantContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 20,
    padding: 12,
    flex: 1,
  },
  userBubble: {
    backgroundColor: '#7c3aed',
  },
  assistantBubble: {
    backgroundColor: '#2d2d2d',
  },
  markdownBody: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 16,

    // flexWrap: 'wrap',
  },
  markdownBold: {
    fontWeight: 'bold',
    color: 'black',
  },
  markdownHeading: {
    color: 'black',
    fontWeight: 'bold',
    marginVertical: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  codeBlock: {
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    position: 'relative',
  },
  codeText: {
    color: '#e6e6e6',
    fontFamily: 'monospace',
    fontSize: 14,
  },
  copyButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
    backgroundColor: '#333',
    borderRadius: 4,
  },
});
export default ChatMessage;
