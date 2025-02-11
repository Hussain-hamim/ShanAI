import { View, Text, Button } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import { defaultStyles } from '@/constants/Styles';
import HeaderDropDown from '@/components/HeaderDropDown';
import { useAuth } from '@clerk/clerk-expo';

const Dalle = () => {
  const { signOut } = useAuth();

  return (
    <View style={defaultStyles.pageContainer}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <HeaderDropDown
              title='Dall-E'
              onSelect={(key) => {}}
              items={[
                {
                  key: 'share',
                  title: 'Share GPT',
                  icon: 'square.and.arrow.up',
                },
                { key: 'details', title: 'See Details', icon: 'info.up' },
                { key: 'Keep', title: 'Keep in Sidebar', icon: 'pin' },
              ]}
            />
          ),
        }}
      />

      <Text>Dalle</Text>
      <Button onPress={() => signOut()} title='Sign out' />
    </View>
  );
};

export default Dalle;
