import {
  View,
  Text,
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { StatusBar } from 'expo-status-bar';
import { defaultStyles } from '@/constants/Styles';
import { Stack } from 'expo-router';
import HeaderDropDown from '@/components/HeaderDropDown';
import MessageInput from '@/components/MessageInput';

const Page = () => {
  const { signOut } = useAuth();
  const [gptVersion, setGptVersion] = useState('3.5');

  const getCompletion = (message: string) => {
    console.log('getting completion for: ', message);
  };

  return (
    <View style={defaultStyles.pageContainer}>
      <Stack.Screen
        options={
          {
            // headerTitle: () => (
            //   <HeaderDropDown
            //     title='ChatGPT'
            //     onSelect={(key) => {
            //       setGptVersion(key);
            //     }}
            //     selected={gptVersion}
            //     items={[
            //       { key: '3.5', title: 'GPT-3.5', icon: 'bolt' },
            //       { key: '4', title: 'GPT-4', icon: 'sparkles' },
            //     ]}
            //   />
            // ),
          }
        }
      />

      <ScrollView style={{ flex: 1 }}>
        <Text>Dummy Content</Text>
        {/* <Button title='Sign out' onPress={() => signOut()} /> */}
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
        <Text>Dummy Content</Text>
      </ScrollView>
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
        <MessageInput onShouldSendMessage={getCompletion} />
      </KeyboardAvoidingView>
    </View>
  );
};

export default Page;
