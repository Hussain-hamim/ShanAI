import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useSignIn, useSignUp } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
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
import { disableGuestMode } from '@/utils/guest';

const Login = () => {
  const { type } = useLocalSearchParams<{ type: string }>();
  const isLogin = type === 'login';
  const [loading, setLoading] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const scaleValue = useRef(new Animated.Value(1)).current;

  const { signIn, errors: signInErrors, fetchStatus: signInStatus } = useSignIn();
  const {
    signUp,
    errors: signUpErrors,
    fetchStatus: signUpStatus,
  } = useSignUp();

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.98,
        duration: 50,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await signIn.password({
        emailAddress,
        password,
      });

      if (error) {
        Alert.alert(error.message || 'Login failed');
        return;
      }

      if (signIn.status === 'complete') {
        await disableGuestMode();
        await signIn.finalize({
          navigate: () => {
            router.replace('/(auth)/(drawer)/(chat)/new');
          },
        });
      } else {
        Alert.alert(
          'Additional steps required',
          `Sign-in status: ${signIn.status}`
        );
      }
    } catch (error: any) {
      Alert.alert(error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const { error } = await signUp.password({
        emailAddress,
        password,
      });

      if (error) {
        Alert.alert(error.message || 'Signup failed');
        return;
      }

      if (signUp.status === 'complete') {
        await disableGuestMode();
        await signUp.finalize({
          navigate: () => {
            router.replace('/(auth)/(drawer)/(chat)/new');
          },
        });
      } else {
        // Email verification may be required depending on Clerk settings
        Alert.alert(
          'Check your email',
          'Additional verification may be required before you can sign in.'
        );
      }
    } catch (error: any) {
      Alert.alert(error?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const busy =
    loading || signInStatus === 'fetching' || signUpStatus === 'fetching';

  return (
    <LinearGradient colors={['#f8f9fa', '#e9ecef']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.inner}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          <StatusBar style='dark' />

          {busy && (
            <View style={[defaultStyles.loadingOverlay, styles.loadingOverlay]}>
              <ActivityIndicator size='large' color={Colors.primary} />
            </View>
          )}

          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require('../assets/images/shanai.png')}
            />
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>
              {isLogin ? 'Welcome back' : 'Create account'}
            </Text>
            <Text style={styles.subtitle}>
              {isLogin
                ? 'Sign in to continue your journey'
                : 'Join us to get started'}
            </Text>
          </View>

          <View style={styles.form}>
            <View
              style={[
                styles.inputContainer,
                focusedInput === 'email' && styles.inputFocused,
              ]}
            >
              <Ionicons
                name='mail-outline'
                size={20}
                color={focusedInput === 'email' ? Colors.primary : '#999'}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder='Email address'
                placeholderTextColor='#999'
                autoCapitalize='none'
                keyboardType='email-address'
                value={emailAddress}
                onChangeText={setEmailAddress}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
                hitSlop={50}
              />
            </View>

            <View
              style={[
                styles.inputContainer,
                focusedInput === 'password' && styles.inputFocused,
              ]}
            >
              <Ionicons
                name='lock-closed-outline'
                size={20}
                color={focusedInput === 'password' ? Colors.primary : '#999'}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder='Password'
                placeholderTextColor='#999'
                autoCapitalize='none'
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
                hitSlop={50}
              />
            </View>

            {(signInErrors?.fields?.password ||
              signUpErrors?.fields?.password) && (
              <Text style={styles.errorText}>
                {signInErrors?.fields?.password?.message ||
                  signUpErrors?.fields?.password?.message}
              </Text>
            )}

            {isLogin && (
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              hitSlop={40}
              onPressIn={animatePress}
              onPress={isLogin ? handleSignIn : handleSignUp}
              activeOpacity={0.9}
            >
              <Animated.View
                style={[styles.button, { transform: [{ scale: scaleValue }] }]}
              >
                <LinearGradient
                  colors={['#7B64FF', '#5E42D6']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.buttonText}>
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </Text>
                  <View style={styles.buttonIcon}>
                    <Ionicons name='arrow-forward' size={16} color='white' />
                  </View>
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isLogin
                ? "Don't have an account?"
                : 'Already have an account?'}
            </Text>
            <TouchableOpacity
              hitSlop={40}
              onPress={() =>
                router.setParams({
                  type: isLogin ? 'signup' : 'login',
                })
              }
            >
              <Text style={styles.footerLink}>
                {isLogin ? 'Sign up' : 'Sign in'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  inner: {
    flexGrow: 1,
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 40 : 24,
    justifyContent: 'center',
  },
  loadingOverlay: {
    borderRadius: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#636e72',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#dfe6e9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputFocused: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: '#2d3436',
    paddingVertical: 0,
  },
  errorText: {
    color: '#d63031',
    marginBottom: 8,
    fontSize: 13,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    marginVertical: 20,
  },
  button: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#7B64FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
  buttonIcon: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 10,
    padding: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerText: {
    color: '#636e72',
    fontSize: 14,
    marginRight: 4,
  },
  footerLink: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Login;
