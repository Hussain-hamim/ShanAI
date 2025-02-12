import React, { useEffect } from 'react';
import { useFonts } from 'expo-font';
import {
  router,
  Slot,
  SplashScreen,
  Stack,
  useRouter,
  useSegments,
} from 'expo-router';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SecureStore from 'expo-secure-store';

const CLERK_PUBLISHABLE_KEY = process.env
  .EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (error) {
      console.log(error);
    }
  },

  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.log(error);
    }
  },
};

SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const router = useRouter();

  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments(); //Returns a list of selected file segments for the currently selected route.

  useEffect(() => {
    if (error) throw error;
  }, []);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, [loaded]);

  useEffect(() => {
    // if (!isLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';

    // if (1 === 1) {
    if (isSignedIn && !inAuthGroup) {
      //bring the user inside
      router.replace('/(auth)/(drawer)/(chat)/new');
    } else if (!isSignedIn && inAuthGroup) {
      // kick the user out
      router.replace('/');
    }
  }, [isSignedIn]);
  // }, []);

  // if (!loaded || !isLoaded) {
  //   return (
  //     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
  //       <ActivityIndicator size='large' color='#000' />
  //     </View>
  //   );
  // }

  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen
        name='login'
        options={{
          presentation: 'modal',
          title: '',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name='close-outline' size={28} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name='(auth)' options={{ headerShown: false }} />
    </Stack>
  );
};

const RootLayoutNav = () => {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <InitialLayout />
      </GestureHandlerRootView>
    </ClerkProvider>
  );
};

export default RootLayoutNav;
