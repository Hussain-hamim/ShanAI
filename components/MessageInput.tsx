import Colors from '@/constants/Colors';
import {
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { BlurView } from 'expo-blur';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

import { Text } from 'react-native';
import React from 'react';

const ATouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export type MessageInputProps = {
  // TODO:
  onShouldSendMessage: (message: string) => void;
};

const MessageInput = ({ onShouldSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const { bottom } = useSafeAreaInsets();
  const expanded = useSharedValue(0);

  const expandItems = () => {
    expanded.value = withTiming(1, { duration: 400 });
  };

  const collapseItems = () => {
    expanded.value = withTiming(0, { duration: 400 });
  };

  const onSend = () => {
    // todo
    onShouldSendMessage(message);
    setMessage('');
  };

  const onChangeText = (text: string) => {
    collapseItems();
    setMessage(text);
  };

  const expandedButtonStyle = useAnimatedStyle(() => {
    const opacityInterpolation = interpolate(
      expanded.value,
      [0, 1],
      [1, 0],
      Extrapolation.CLAMP
    );

    const widthInterpolation = interpolate(
      expanded.value,
      [0, 1],
      [30, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity: opacityInterpolation,
      width: widthInterpolation,
    };
  });

  const buttonViewStyle = useAnimatedStyle(() => {
    const widthInterpolation = interpolate(
      expanded.value,
      [0, 1],
      [0, 100],
      Extrapolation.CLAMP
    );

    return {
      opacity: expanded.value,
      width: widthInterpolation,
    };
  });

  return (
    <BlurView
      intensity={120}
      tint='extraLight'
      style={{
        paddingBottom: bottom + 20,
        paddingTop: 10,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        backgroundColor: 'blue',
        borderTopColor: 'gray',
        borderTopWidth: 0.7,
      }}
    >
      <View style={styles.row}>
        <ATouchableOpacity
          onPress={expandItems}
          style={[styles.roundBtn, expandedButtonStyle]}
        >
          <Ionicons name='add' size={24} color={Colors.grey} />
        </ATouchableOpacity>

        <Animated.View style={[styles.buttonView, buttonViewStyle]}>
          <TouchableOpacity onPress={() => ImagePicker.launchCameraAsync()}>
            <Ionicons name='camera-outline' size={24} color={Colors.grey} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => ImagePicker.launchImageLibraryAsync()}
          >
            <Ionicons name='image-outline' size={24} color={Colors.grey} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => DocumentPicker.getDocumentAsync()}>
            <Ionicons name='folder-outline' size={24} color={Colors.grey} />
          </TouchableOpacity>
        </Animated.View>

        <TextInput
          autoFocus
          placeholder='Message'
          style={styles.messageInput}
          multiline
          value={message}
          onChangeText={onChangeText}
          onFocus={collapseItems}
          returnKeyType='done'
        />

        {message.length > 0 ? (
          <TouchableOpacity onPress={onSend}>
            <Ionicons name='arrow-up-circle' size={30} color={Colors.grey} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity>
            {/* <Ionicons name='mic' size={30} color={Colors.grey} /> */}
            {/* <FontAwesome6 name='microphone' size={30} color={Colors.grey} /> */}
            <MaterialCommunityIcons
              name='chat-plus'
              size={30}
              color={Colors.grey}
            />
          </TouchableOpacity>
        )}
      </View>
    </BlurView>
  );
};

export default MessageInput;

// const ATouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// export type Props = {
//   onShouldSend: (message: string) => void;
// };

// const MessageInput = ({ onShouldSend }: Props) => {
//   const [message, setMessage] = useState('');
//   const { bottom } = useSafeAreaInsets();
//   const expanded = useSharedValue(0);
//   const inputRef = useRef<TextInput>(null);

//   const expandItems = () => {
//     expanded.value = withTiming(1, { duration: 400 });
//   };

//   const collapseItems = () => {
//     expanded.value = withTiming(0, { duration: 400 });
//   };

//   const expandButtonStyle = useAnimatedStyle(() => {
//     const opacityInterpolation = interpolate(
//       expanded.value,
//       [0, 1],
//       [1, 0],
//       Extrapolation.CLAMP
//     );
//     const widthInterpolation = interpolate(
//       expanded.value,
//       [0, 1],
//       [30, 0],
//       Extrapolation.CLAMP
//     );

//     return {
//       opacity: opacityInterpolation,
//       width: widthInterpolation,
//     };
//   });

//   const buttonViewStyle = useAnimatedStyle(() => {
//     const widthInterpolation = interpolate(
//       expanded.value,
//       [0, 1],
//       [0, 100],
//       Extrapolation.CLAMP
//     );
//     return {
//       width: widthInterpolation,
//       opacity: expanded.value,
//     };
//   });

//   const onChangeText = (text: string) => {
//     collapseItems();
//     setMessage(text);
//   };

//   const onSend = () => {
//     onShouldSend(message);
//     setMessage('');
//   };

//   const onSelectCard = (text: string) => {
//     onShouldSend(text);
//   };

//   return (
//     <BlurView
//       intensity={90}
//       tint='extraLight'
//       style={{ paddingBottom: bottom, paddingTop: 10 }}
//     >
//       <View style={styles.row}>
//         <ATouchableOpacity
//           onPress={expandItems}
//           style={[styles.roundBtn, expandButtonStyle]}
//         >
//           <Ionicons name='add' size={24} color={Colors.grey} />
//         </ATouchableOpacity>

//         <Animated.View style={[styles.buttonView, buttonViewStyle]}>
//           <TouchableOpacity onPress={() => ImagePicker.launchCameraAsync()}>
//             <Ionicons name='camera-outline' size={24} color={Colors.grey} />
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => ImagePicker.launchImageLibraryAsync()}
//           >
//             <Ionicons name='image-outline' size={24} color={Colors.grey} />
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => DocumentPicker.getDocumentAsync()}>
//             <Ionicons name='folder-outline' size={24} color={Colors.grey} />
//           </TouchableOpacity>
//         </Animated.View>

//         <TextInput
//           autoFocus
//           ref={inputRef}
//           placeholder='Message'
//           style={styles.messageInput}
//           onFocus={collapseItems}
//           onChangeText={onChangeText}
//           value={message}
//           multiline
//         />
//         {message.length > 0 ? (
//           <TouchableOpacity onPress={onSend}>
//             <Ionicons name='arrow-up-circle' size={24} color={Colors.grey} />
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity>
//             <FontAwesome5 name='headphones' size={24} color={Colors.grey} />
//           </TouchableOpacity>
//         )}
//       </View>
//     </BlurView>
//   );
// };

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  messageInput: {
    flex: 1,
    marginHorizontal: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 20,
    padding: 10,
    borderColor: Colors.greyLight,
    backgroundColor: Colors.light,
  },
  roundBtn: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: Colors.input,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
// export default MessageInput;
