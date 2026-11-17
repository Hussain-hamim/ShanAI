import React, { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ClerkProvider, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import {
  disableGuestMode,
  getGuestModeSync,
  isGuestMode,
} from '@/utils/guest';

const CLERK_PUBLISHABLE_KEY = process.env
  .EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const [guest, setGuest] = useState(getGuestModeSync());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const guestValue = await isGuestMode();
      if (cancelled) return;
      setGuest(guestValue);
      setReady(true);
      if (loaded) {
        SplashScreen.hideAsync();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [loaded]);

  useEffect(() => {
    // Keep React state in sync with sync memory flag (set before navigate)
    setGuest(getGuestModeSync());
  }, [segments]);

  useEffect(() => {
    if (!isLoaded || !ready) return;

    const inAuthGroup = segments[0] === '(auth)';
    const isGuest = guest || getGuestModeSync();

    if (isSignedIn) {
      if (isGuest) {
        disableGuestMode().then(() => setGuest(false));
      }
      if (!inAuthGroup) {
        router.replace('/(auth)/(drawer)/(chat)/new');
      }
      return;
    }

    if (inAuthGroup && !isGuest) {
      router.replace('/');
    }
  }, [isSignedIn, isLoaded, segments, guest, ready]);

  return (
    <>
      <StatusBar style='dark' />
      <Stack>
        <Stack.Screen name='index' options={{ headerShown: false }} />
        <Stack.Screen
          name='login'
          options={{
            presentation: 'modal',
            title: '',
            headerShadowVisible: false,
            headerStyle: { backgroundColor: '#f8f9fa' },
          }}
        />
        <Stack.Screen name='(auth)' options={{ headerShown: false }} />
      </Stack>

      {(!loaded || !isLoaded || !ready) && (
        <View style={styles.loading}>
          <ActivityIndicator size='large' color='#000' />
        </View>
      )}
    </>
  );
};

const RootLayoutNav = () => {
  if (!CLERK_PUBLISHABLE_KEY) {
    throw new Error('Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in .env');
  }

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

const styles = StyleSheet.create({
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    zIndex: 10,
  },
});

export default RootLayoutNav;
