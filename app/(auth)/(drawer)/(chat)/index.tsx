import { View, Text, Button } from 'react-native';
import React from 'react';
import { useAuth } from '@clerk/clerk-react';
import { StatusBar } from 'expo-status-bar';

const index = () => {
  const { signOut } = useAuth();

  return (
    <View>
      <StatusBar style='dark' />

      <Text>inside chat (chat)</Text>
      <Button title='Sign out' onPress={() => signOut()} />
    </View>
  );
};

export default index;
