// import React, { useEffect } from 'react';
// import { useFonts } from 'expo-font';
// import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
// import { ActivityIndicator, View } from 'react-native';
// import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import * as SecureStore from 'expo-secure-store';

// const CLERK_PUBLISHABLE_KEY = process.env
//   .EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

// const tokenCache = {
//   async getToken(key: string) {
//     try {
//       return SecureStore.getItemAsync(key);
//     } catch (error) {
//       console.log(error);
//     }
//   },

//   async saveToken(key: string, value: string) {
//     try {
//       return SecureStore.setItemAsync(key, value);
//     } catch (error) {
//       console.log(error);
//     }
//   },
// };

// SplashScreen.preventAutoHideAsync();

// const InitialLayout = () => {
//   const [loaded, error] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   });

//   const router = useRouter();

//   const { isLoaded, isSignedIn } = useAuth();
//   const segments = useSegments();

//   useEffect(() => {
//     if (error) throw error;
//   }, []);

//   useEffect(() => {
//     SplashScreen.hideAsync();
//   }, [loaded]);

//   useEffect(() => {
//     if (!isLoaded) return;

//     const inAuthGroup = segments[0] === '(auth)';

//     if (isSignedIn && !inAuthGroup) {
//       //bring the user inside
//       router.replace('/(auth)/(drawer)/(chat)/new');
//     } else if (!isSignedIn && inAuthGroup) {
//       // kick the user out
//       router.replace('/');
//     }
//   }, [isSignedIn]);

//   if (!loaded || !isLoaded) {
//     return (
//       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//         <ActivityIndicator size='large' color='#000' />
//       </View>
//     );
//   }

//   return (
//     <Stack>
//       <Stack.Screen name='index' options={{ headerShown: false }} />
//       <Stack.Screen
//         name='login'
//         options={{
//           presentation: 'modal',
//           title: '',
//         }}
//       />
//       <Stack.Screen name='(auth)' options={{ headerShown: false }} />
//     </Stack>
//   );
// };

// const RootLayoutNav = () => {
//   return (
//     <ClerkProvider
//       publishableKey={CLERK_PUBLISHABLE_KEY}
//       tokenCache={tokenCache}
//     >
//       <GestureHandlerRootView style={{ flex: 1 }}>
//         <InitialLayout />
//       </GestureHandlerRootView>
//     </ClerkProvider>
//   );
// };

// export default RootLayoutNav;

//////////////////////////////////////////////////

import React, { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';

const CLERK_PUBLISHABLE_KEY = process.env
  .EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

export const AUTH_STORAGE_KEY = 'user_auth_token';

export const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (error) {
      console.log('Error getting token:', error);
    }
  },

  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.log('Error saving token:', error);
    }
  },

  async removeToken(key: string) {
    try {
      return SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.log('Error removing token:', error);
    }
  },
};

SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const router = useRouter();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const segments = useSegments();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (error) throw error;
  }, []);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, [loaded]);

  useEffect(() => {
    const checkStoredAuth = async () => {
      const storedToken = await tokenCache.getToken(AUTH_STORAGE_KEY);
      console.log('auth token: ', storedToken);
      if (storedToken) {
        router.replace('/(auth)/(drawer)/(chat)/new');
      }
      setCheckingAuth(false);
    };

    checkStoredAuth();
  }, []);

  // useEffect(() => {
  //   if (!isLoaded || checkingAuth) return;

  //   const inAuthGroup = segments[0] === '(auth)';

  //   if (isSignedIn) {
  //     router.replace('/(auth)/(drawer)/(chat)/new');
  //     getToken().then((token) => {
  //       if (token) tokenCache.saveToken(AUTH_STORAGE_KEY, token);
  //     });
  //   } else if (!isSignedIn && inAuthGroup) {
  //     tokenCache.removeToken(AUTH_STORAGE_KEY);
  //     router.replace('/');
  //   }
  // }, [isSignedIn, checkingAuth]);

  // if (checkingAuth) {
  //   return (
  //     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
  //       <StatusBar style='dark' />
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
