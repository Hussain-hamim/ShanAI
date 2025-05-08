import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useSignIn, useSignUp } from '@clerk/clerk-expo';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AUTH_STORAGE_KEY, tokenCache } from './_layout';

const Login = () => {
  const { type } = useLocalSearchParams<{ type: string }>();
  const [loading, setLoading] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  const { signIn, isLoaded, setActive } = useSignIn();
  const {
    signUp,
    isLoaded: signUpLoaded,
    setActive: signUpSetActive,
  } = useSignUp();

  const handleSignIn = async () => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // Save token locally for persistence
      const token = result.createdSessionId || '';
      await tokenCache.saveToken(AUTH_STORAGE_KEY, token);

      // Set active session and navigate
      setActive({ session: token });
      router.replace('/(auth)/(drawer)/(chat)/new');
    } catch (error: any) {
      Alert.alert(error.errors?.[0]?.message || 'Login failed');
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!signUpLoaded) return;
    setLoading(true);

    try {
      const result = await signUp.create({
        emailAddress,
        password,
      });

      // Save token locally for persistence
      const token = result.createdSessionId || '';
      await tokenCache.saveToken(AUTH_STORAGE_KEY, token);

      // Set active session and navigate
      signUpSetActive({ session: token });
      router.replace('/(auth)/(drawer)/(chat)/new');
    } catch (error: any) {
      Alert.alert(error.errors?.[0]?.message || 'Signup failed');
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={1}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <StatusBar style='dark' />

        {loading && (
          <View style={[defaultStyles.loadingOverlay]}>
            <ActivityIndicator size='large' color='green' />
          </View>
        )}

        <Image
          style={styles.logo}
          source={require('../assets/images/logo-dark.png')}
        />

        <Text style={styles.title}>
          {type === 'login' ? 'Welcome back' : 'Create your account'}
        </Text>

        <View style={{ marginBottom: 30 }}>
          <TextInput
            style={styles.inputField}
            placeholder='Email'
            autoCapitalize='none'
            value={emailAddress}
            onChangeText={setEmailAddress}
            returnKeyType='next'
            hitSlop={50}
          />
          <TextInput
            style={styles.inputField}
            placeholder='Password'
            autoCapitalize='none'
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            hitSlop={50}
          />
        </View>

        {type === 'login' ? (
          <TouchableOpacity
            onPress={handleSignIn}
            style={[defaultStyles.btn, styles.btnPrimary]}
            hitSlop={30}
          >
            <Text style={styles.btnPrimaryText}>Login</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleSignUp}
            style={[defaultStyles.btn, styles.btnPrimary]}
            hitSlop={30}
          >
            <Text style={styles.btnPrimaryText}>Create Account</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logo: {
    width: 60,
    height: 60,
    alignSelf: 'center',
    marginVertical: 80,
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#fff',
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
    marginVertical: 4,
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Login;
