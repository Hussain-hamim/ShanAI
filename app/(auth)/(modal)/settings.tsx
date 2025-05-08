import { AUTH_STORAGE_KEY, tokenCache } from '@/app/_layout';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Storage } from '@/utils/Storage';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
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
  Image,
  ActivityIndicator,
} from 'react-native';
import { useMMKVString } from 'react-native-mmkv';

const Page = () => {
  // const [key, setKey] = useMMKVString('apikey', Storage);
  // const [organization, setOrganization] = useMMKVString('org', Storage);

  const [key, setKey] = useState('');
  const [organization, setOrganization] = useState('');
  const [loading, setLoading] = useState(false);

  if (loading) {
    <View style={[defaultStyles.loadingOverlay, { flex: 1 }]}>
      <ActivityIndicator size='large' color='#fff' />
    </View>;
  }

  const [apiKey, setApiKey] = useState('');
  const [org, setOrg] = useState('');
  const router = useRouter();

  const { signOut } = useAuth();
  const { user } = useUser();

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
      <View
        style={{
          flex: 0.5,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <Image
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            borderWidth: 5,
            borderColor: '#438851da',
          }}
          source={require('@/assets/images/anime-pfp.jpg')}
        />
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
          <Text style={{}}>User Email: </Text>

          {user?.primaryEmailAddress?.emailAddress || 'hussain-hamim@gmail.com'}
        </Text>
      </View>

      <Text style={{}}>API Key:</Text>
      <TextInput
        style={styles.input}
        value={apiKey}
        onChangeText={setApiKey}
        placeholder='Enter your API key'
        autoCorrect={false}
        autoCapitalize='none'
        multiline
        hitSlop={10}
      />

      <TouchableOpacity
        style={[defaultStyles.btn, { backgroundColor: Colors.primary }]}
        onPress={saveApiKey}
      >
        <Text style={styles.buttonText}>Save API Key</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[defaultStyles.btn, { backgroundColor: Colors.primary }]}
        onPress={() => {}}
      >
        <Ionicons name='information-circle-outline' size={28} color={'white'} />
        <Text style={styles.buttonText}>About</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[defaultStyles.btn, { backgroundColor: Colors.orange }]}
        onPress={async () => {
          await signOut();
          router.replace('/');
          await tokenCache.removeToken(AUTH_STORAGE_KEY);
          setLoading(true);
        }}
        hitSlop={40}
      >
        <Ionicons name='log-out-outline' size={28} color={'white'} />
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
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
    marginHorizontal: 10,
  },
});
export default Page;
