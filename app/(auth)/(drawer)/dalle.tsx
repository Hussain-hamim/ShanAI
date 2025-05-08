import ChatMessageDalle from '@/components/ChatMessageDalle';
import MessageInput from '@/components/MessageInput';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { generateImage } from '@/utils/api';
import { Message, Role } from '@/utils/Interfaces';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Stack, useNavigation } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
// import { useMMKVString } from 'react-native-mmkv';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const dummyMessages = [
  {
    role: Role.Bot,
    content: '',
    imageUrl: 'https://galaxies.dev/img/meerkat_2.jpg',
    prompt:
      'A meerkat astronaut in a futuristic spacesuit, standing upright on a rocky, alien landscape resembling the surface of Mars. The spacesuit is highly detailed with reflective visor and intricate life-support systems. The background shows a distant starry sky and a small Earth visible in the far horizon. The meerkat looks curious and brave, embodying the spirit of exploration.',
  },
];

const Page = () => {
  const [height, setHeight] = useState(0);

  // const [key, setKey] = useMMKVString('apikey', Storage);
  // const [organization, setOrganization] = useMMKVString('org', Storage);

  const [messages, setMessages] = useState<Message[]>([]);

  // if (!key || key === '' || !organization || organization === '') {
  //   return <Redirect href={'/(auth)/(modal)/settings'} />;
  // }

  // const openAI = useMemo(
  //   () =>
  //     new OpenAI({
  //       apiKey: key,
  //       organization,
  //     }),
  //   []
  // );

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  // const [prompt, setPrompt] = useState('');
  const [isWorking, setWorking] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (prompt: string) => {
    if (!prompt.trim() || isWorking) return;

    setWorking(true);
    setError(null);
    try {
      setMessages([...messages, { role: Role.User, content: prompt }]);

      const imageUrl = await generateImage(prompt);

      setMessages((prev) => [
        ...prev,
        { role: Role.Bot, content: '', imageUrl, prompt: prompt },
      ]);

      setGeneratedImage(imageUrl);
    } catch (err) {
      console.log('error generating image: ', err);
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setWorking(false);
    }
  };

  const onLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setHeight(height / 2);
  };

  const getCompletion = async (text: string) => {
    setWorking(true);
    setMessages([...messages, { role: Role.User, content: text }]);

    // const result = await openAI.image.create({
    //   prompt: text,
    // });
    // if (result.data && result.data.length > 0) {
    //   const imageUrl = result.data[0].url;
    //   setMessages((prev) => [
    //     ...prev,
    //     { role: Role.Bot, content: '', imageUrl, prompt: text },
    //   ]);
    // }
    setWorking(false);
    //
    //
  };

  return (
    <View style={defaultStyles.pageContainer}>
      <Stack.Screen
        options={
          {
            // headerTitle: () => (
            //   <HeaderDropDown
            //     title='Dall·E'
            //     items={[
            //       {
            //         key: 'share',
            //         title: 'Share GPT',
            //         icon: 'square.and.arrow.up',
            //       },
            //       { key: 'details', title: 'See Details', icon: 'info.circle' },
            //       { key: 'keep', title: 'Keep in Sidebar', icon: 'pin' },
            //     ]}
            //     onSelect={() => {}}
            //   />
            // ),
          }
        }
      />
      <View style={styles.page} onLayout={onLayout}>
        {messages.length == 0 && (
          <View
            style={[
              { marginTop: height / 2 - 100, alignItems: 'center', gap: 16 },
            ]}
          >
            <View style={styles.logoContainer}>
              <Ionicons name='image' size={48} color={'orchid'} />
            </View>
            <Text style={styles.label}>
              Let me turn your imagination into imagery.
            </Text>
          </View>
        )}
        <FlashList
          data={messages}
          renderItem={({ item }) => <ChatMessageDalle {...item} />}
          estimatedItemSize={400}
          contentContainerStyle={{ paddingTop: 30, paddingBottom: 150 }}
          keyboardDismissMode='on-drag'
          ListFooterComponent={
            <>
              {isWorking && (
                <ChatMessageDalle
                  {...{ role: Role.Bot, content: '', loading: true }}
                />
              )}
            </>
          }
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={70}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
        }}
      >
        <MessageInput
          loading={isWorking}
          onShouldSendMessage={handleGenerate}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    backgroundColor: '#000',
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.greyLight,
  },
  image: {
    resizeMode: 'cover',
  },
  page: {
    flex: 1,
  },
  label: {
    color: Colors.grey,
    fontSize: 16,
  },
});
export default Page;
