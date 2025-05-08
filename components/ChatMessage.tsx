import Colors from '@/constants/Colors';
import { Message, Role } from '@/utils/Interfaces';
import { View, Text, StyleSheet, Image } from 'react-native';
import MarkdownDisplay from 'react-native-markdown-display';
import { FontAwesome6 } from '@expo/vector-icons';
import React from 'react';

const ChatMessage = ({
  content,
  role,
  loading,
}: Message & { loading?: boolean }) => {
  const isBot = role === Role.Bot;

  // Don't render empty messages
  if (!content || content.trim() === '') return null;

  return (
    <View
      style={[
        styles.container,
        isBot ? styles.botContainer : styles.userContainer,
      ]}
    >
      {/* Avatar always on the left for both user and bot */}
      {isBot ? (
        <Image
          source={require('@/assets/images/shanai.png')}
          style={styles.avatar}
        />
      ) : (
        <View style={styles.userAvatar}>
          <FontAwesome6 name='user' size={20} color={Colors.dark} />
        </View>
      )}

      {/* Message bubble */}
      <View
        style={[
          styles.messageBubble,
          isBot ? styles.botBubble : styles.userBubble,
        ]}
      >
        <MarkdownDisplay
          style={isBot ? styles.botMarkdown : styles.userMarkdown}
        >
          {content}
        </MarkdownDisplay>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 6,
    width: '95%',
  },
  botContainer: {
    alignSelf: 'flex-start',
    marginLeft: 5,
  },
  userContainer: {
    alignSelf: 'flex-end',
    marginRight: 5,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  messageBubble: {
    padding: 14,
    borderRadius: 18,
    maxWidth: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  botBubble: {
    backgroundColor: 'rgba(240,240,240,0.9)',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: 'rgba(100,120,255,0.8)',
    borderBottomRightRadius: 4,
  },
  botMarkdown: {
    body: {
      color: 'rgba(0,0,0,0.8)',
      fontSize: 15,
      lineHeight: 22,
    },
    heading1: {
      fontSize: 20,
      fontWeight: '600',
      color: 'rgba(0,0,0,0.9)',
      marginVertical: 8,
    },
    heading2: {
      fontSize: 18,
      fontWeight: '600',
      color: 'rgba(0,0,0,0.9)',
      marginVertical: 6,
    },
    heading3: {
      fontSize: 16,
      fontWeight: '600',
      color: 'rgba(0,0,0,0.9)',
      marginVertical: 4,
    },
    code_inline: {
      backgroundColor: 'rgba(0,0,0,0.08)',
      paddingHorizontal: 4,
      borderRadius: 3,
      fontFamily: 'monospace',
    },
    fence: {
      backgroundColor: 'rgba(0,0,0,0.08)',
      padding: 12,
      borderRadius: 6,
      marginVertical: 6,
    },
    blockquote: {
      borderLeftWidth: 3,
      borderLeftColor: 'rgba(0,0,0,0.1)',
      paddingLeft: 10,
      marginVertical: 6,
    },
  },
  userMarkdown: {
    body: {
      color: 'rgba(255,255,255,0.9)',
      fontSize: 15,
      lineHeight: 22,
    },
    heading1: {
      fontSize: 20,
      fontWeight: '600',
      color: 'white',
      marginVertical: 8,
    },
    heading2: {
      fontSize: 18,
      fontWeight: '600',
      color: 'white',
      marginVertical: 6,
    },
    heading3: {
      fontSize: 16,
      fontWeight: '600',
      color: 'white',
      marginVertical: 4,
    },
    code_inline: {
      backgroundColor: 'rgba(255,255,255,0.15)',
      paddingHorizontal: 4,
      borderRadius: 3,
      fontFamily: 'monospace',
    },
    fence: {
      backgroundColor: 'rgba(255,255,255,0.15)',
      padding: 12,
      borderRadius: 6,
      marginVertical: 6,
    },
    blockquote: {
      borderLeftWidth: 3,
      borderLeftColor: 'rgba(255,255,255,0.3)',
      paddingLeft: 10,
      marginVertical: 6,
    },
  },
});

export default ChatMessage;
