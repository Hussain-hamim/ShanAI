import Colors from '@/constants/Colors';
import React, { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { ReText } from 'react-native-redash';

const content = [
  { title: "Hello, I'm ShanAI.", bg: Colors.green, fontColor: Colors.pink },
  { title: "Let's connect minds.", bg: Colors.lime, fontColor: Colors.brown },
  {
    title: 'Smarter every message.',
    bg: Colors.teal,
    fontColor: Colors.yellow,
  },
  { title: 'Your AI, reimagined.', bg: Colors.blue, fontColor: Colors.orange },
];

const AnimatedIntro = () => {
  const { width, height } = useWindowDimensions();
  // Keep hero content in the space above the bottom login sheet
  const heroHeight = height * 0.55;

  const ringScale = useSharedValue(1);
  const currentIndex = useSharedValue(0);

  useEffect(() => {
    ringScale.value = withRepeat(
      withSequence(
        withTiming(1.25, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1
    );

    const interval = setInterval(() => {
      const next = (Math.round(currentIndex.value) + 1) % content.length;
      currentIndex.value = withTiming(next, { duration: 600 });
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

  const animatedText = useDerivedValue(
    () => content[Math.round(currentIndex.value) % content.length].title
  );

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: bgColor.value,
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: interpolate(ringScale.value, [1, 1.25], [0.45, 0.18]),
    borderColor: textColor.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: textColor.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={[styles.hero, { height: heroHeight, width }]}>
        <Animated.View style={[styles.ring, ringStyle]} />
        <View style={[styles.textWrap, { width: width - 48 }]}>
          <ReText
            text={animatedText}
            style={[styles.text, textStyle, { width: width - 48 }]}
          />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ring: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
  },
  textWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AnimatedIntro;
