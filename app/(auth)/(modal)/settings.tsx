import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { disableGuestMode } from '@/utils/guest';
import { Storage } from '@/utils/Storage';
import { useAuth, useUser } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [org, setOrg] = useState('');
  const router = useRouter();

  const { signOut } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    Storage.getString('apikey').then((value) => {
      if (value) setApiKey(value);
    });
    Storage.getString('org').then((value) => {
      if (value) setOrg(value);
    });
  }, []);

  const saveApiKey = async () => {
    await Storage.set('apikey', apiKey);
    await Storage.set('org', org);
    router.push('/(auth)/(drawer)/(chat)/new');
  };

  if (loading) {
    return (
      <View style={[defaultStyles.loadingOverlay, { flex: 1 }]}>
        <ActivityIndicator size='large' color='#fff' />
      </View>
    );
  }

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
          <Text>User Email: </Text>
          {user?.primaryEmailAddress?.emailAddress || 'hussain-hamim@gmail.com'}
        </Text>
      </View>

      <Text>API Key:</Text>
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
          setLoading(true);
          await disableGuestMode();
          try {
            await signOut();
          } catch {
            // Guest users have no Clerk session
          }
          router.replace('/');
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
