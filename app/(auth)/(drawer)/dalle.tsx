import { View, Text } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import { defaultStyles } from '@/constants/Styles';

const Dalle = () => {
  return (
    <View style={defaultStyles.pageContainer}>
      <Stack.Screen
        options={
          {
            // headerTitle: () => (
            //   <HeaderDropDown
            //     title='Dall-E'
            //     onSelect={(key) =>   {} }
            //     items={[
            //       { key: 'share', title: 'Share GPT', icon: 'square.and.arrow.up' },
            //       { key: 'details', title: 'See Details', icon: 'info.up' },
            //       { key: 'Keep', title: 'Keep in Sidebar', icon: 'pin' },
            //     ]}
            //   />
            // ),
          }
        }
      />

      <Text>Dalle</Text>
    </View>
  );
};

export default Dalle;
