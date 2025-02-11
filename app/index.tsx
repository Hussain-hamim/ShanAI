import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AnimatedIntro from '@/components/AnimatedIntro';
import BottomLoginSheet from '@/components/BottomLoginSheet';

const index = () => {
  return (
    <View style={styles.container}>
      <StatusBar style='dark' />
      <AnimatedIntro />
      <BottomLoginSheet />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default index;
