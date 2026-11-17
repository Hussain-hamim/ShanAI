import AsyncStorage from '@react-native-async-storage/async-storage';

/** Expo Go–safe storage (AsyncStorage). Swap back to MMKV in a dev build later if needed. */
export const Storage = {
  async getString(key: string): Promise<string | undefined> {
    const value = await AsyncStorage.getItem(key);
    return value ?? undefined;
  },
  async set(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  },
  async delete(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },
};
