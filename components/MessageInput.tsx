import Colors from '@/constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Keyboard, StyleSheet, View } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ATouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export type MessageInputProps = {
  onShouldSendMessage: (message: string) => void;
  loading: boolean;
};

const MessageInput = ({ onShouldSendMessage, loading }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const { bottom } = useSafeAreaInsets();
  const expanded = useSharedValue(0);

  const toggleMediaButtons = () => {
    expanded.value = withSpring(expanded.value === 0 ? 1 : 0);
  };

  const onSend = () => {
    if (message.trim().length > 0) {
      onShouldSendMessage(message);
      setMessage('');
      Keyboard.dismiss();
    }
  };

  const onChangeText = (text: string) => {
    setMessage(text);
    // Hide media buttons when typing starts
    if (text.length > 0 && expanded.value === 1) {
      expanded.value = withSpring(0);
    }
  };

  const buttonViewStyle = useAnimatedStyle(() => {
    const width = interpolate(
      expanded.value,
      [0, 1],
      [0, 120],
      Extrapolation.CLAMP
    );
    const marginRight = interpolate(
      expanded.value,
      [0, 1],
      [0, 8],
      Extrapolation.CLAMP
    );

    return {
      width,
      marginRight,
      opacity: expanded.value,
    };
  });

  return (
    <BlurView
      intensity={90}
      tint='light'
      style={[
        styles.container,
        {
          paddingBottom: bottom + 16,
          paddingTop: 12,
        },
      ]}
    >
      <View style={styles.row}>
        <TouchableOpacity
          onPress={toggleMediaButtons}
          style={styles.expandButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name='add'
            size={24}
            color={Colors.primary}
            style={{
              transform: [
                {
                  rotate: expanded.value === 1 ? '45deg' : '0deg',
                },
              ],
            }}
          />
        </TouchableOpacity>

        <Animated.View style={[styles.mediaButtons, buttonViewStyle]}>
          <TouchableOpacity
            style={styles.mediaButton}
            onPress={() => ImagePicker.launchCameraAsync()}
          >
            <Ionicons name='camera' size={20} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mediaButton}
            onPress={() => ImagePicker.launchImageLibraryAsync()}
          >
            <Ionicons name='image' size={20} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mediaButton}
            onPress={() => DocumentPicker.getDocumentAsync()}
          >
            <Ionicons name='document' size={20} color={Colors.primary} />
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder='Type a message...'
            placeholderTextColor='#999'
            style={styles.messageInput}
            multiline
            value={message}
            onChangeText={onChangeText}
            returnKeyType='send'
            onSubmitEditing={onSend}
            blurOnSubmit={false}
          />
        </View>

        <View style={styles.sendButtonContainer}>
          {message.length > 0 ? (
            <TouchableOpacity onPress={onSend} style={styles.sendButton}>
              <Ionicons name='send' size={20} color='white' />
            </TouchableOpacity>
          ) : loading ? (
            <ActivityIndicator size='large' color={Colors.primary} />
          ) : (
            <TouchableOpacity style={styles.micButton}>
              <MaterialCommunityIcons
                name='microphone'
                size={20}
                color='white'
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </BlurView>
  );
};

export default MessageInput;

const styles = StyleSheet.create({
  container: {
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: 56,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: 'rgba(118, 118, 128, 0.12)',
    borderRadius: 18,
    paddingHorizontal: 16,
    minHeight: 36,
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  messageInput: {
    fontSize: 16,
    color: Colors.dark,
    paddingVertical: 8,
  },
  expandButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(118, 118, 128, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    overflow: 'hidden',
  },
  mediaButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(118, 118, 128, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  sendButtonContainer: {
    width: 36,
    height: 36,
    marginLeft: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#00A884',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
