import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Storage } from '@/utils/Storage';
import { useAuth } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
} from 'react-native';
import { useMMKVString } from 'react-native-mmkv';

const Page = () => {
  // const [key, setKey] = useMMKVString('apikey', Storage);
  // const [organization, setOrganization] = useMMKVString('org', Storage);

  const [key, setKey] = useState('');
  const [organization, setOrganization] = useState('');

  const [apiKey, setApiKey] = useState('');
  const [org, setOrg] = useState('');
  const router = useRouter();

  const { signOut } = useAuth();

  const saveApiKey = async () => {
    setKey(apiKey);
    setOrganization(org);
    router.push('/(auth)/(drawer)/(chat)/new');
  };

  const removeApiKey = async () => {
    setKey('');
    setOrganization('');
  };

  return (
    <View style={styles.container}>
      {key && key !== '' && (
        <>
          <Text style={styles.label}>You are all set!</Text>
          <TouchableOpacity
            style={[defaultStyles.btn, { backgroundColor: Colors.primary }]}
            onPress={removeApiKey}
          >
            <Text style={styles.buttonText}>Remove API Key</Text>
          </TouchableOpacity>
        </>
      )}

      {(!key || key === '') && (
        <>
          <Text style={styles.label}>API Key & Organization:</Text>
          <TextInput
            style={styles.input}
            value={apiKey}
            onChangeText={setApiKey}
            placeholder='Enter your API key'
            autoCorrect={false}
            autoCapitalize='none'
            multiline
            hitSlop={200}
          />
          <TextInput
            style={styles.input}
            value={org}
            onChangeText={setOrg}
            placeholder='Your organization'
            autoCorrect={false}
            autoCapitalize='none'
            hitSlop={200}
          />

          <TouchableOpacity
            style={[defaultStyles.btn, { backgroundColor: Colors.primary }]}
            onPress={saveApiKey}
          >
            <Text style={styles.buttonText}>Save API Key</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[defaultStyles.btn, { backgroundColor: Colors.orange }]}
            onPress={async () => {
              await signOut();
              router.replace('/');
            }}
          >
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 5,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },

  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});
export default Page;
