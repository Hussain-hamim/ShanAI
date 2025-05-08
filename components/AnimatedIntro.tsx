import React, { useEffect } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  useDerivedValue,
} from 'react-native-reanimated';
import { ReText } from 'react-native-redash';
import Colors from '@/constants/Colors';

const content = [
  { title: "Hello, I'm ShanAI.", bg: Colors.green, fontColor: Colors.pink },
  { title: 'Let’s connect minds.', bg: Colors.lime, fontColor: Colors.brown },
  {
    title: 'Smarter every message.',
    bg: Colors.teal,
    fontColor: Colors.yellow,
  },
  { title: 'Your AI, reimagined.', bg: Colors.blue, fontColor: Colors.orange },
];

const AnimatedIntro = () => {
  const { width, height } = useWindowDimensions();

  const ringScale = useSharedValue(1);
  const currentIndex = useSharedValue(0);

  useEffect(() => {
    // Pulse ring animation
    ringScale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1
    );

    // Cycle text and colors
    const interval = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % content.length;
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const bgColor = useDerivedValue(() =>
    interpolateColor(
      currentIndex.value,
      content.map((_, i) => i),
      content.map((c) => c.bg)
    )
  );

  const textColor = useDerivedValue(() =>
    interpolateColor(
      currentIndex.value,
      content.map((_, i) => i),
      content.map((c) => c.fontColor)
    )
  );

  const animatedText = useDerivedValue(() => content[currentIndex.value].title);

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: bgColor.value,
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringScale.value === 1 ? 0.4 : 0.15,
    borderColor: textColor.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: textColor.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View style={[styles.ring, ringStyle]} />
      <ReText text={animatedText} style={[styles.text, textStyle]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1, // keep it behind your login sheet
  },
  ring: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
  },
  text: {
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 20,
  },
});

export default AnimatedIntro;
