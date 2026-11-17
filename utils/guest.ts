import AsyncStorage from '@react-native-async-storage/async-storage';

const GUEST_KEY = 'guest_mode';

let memoryGuest = false;

export async function enableGuestMode() {
  memoryGuest = true;
  await AsyncStorage.setItem(GUEST_KEY, '1');
}

export async function disableGuestMode() {
  memoryGuest = false;
  await AsyncStorage.removeItem(GUEST_KEY);
}

export function getGuestModeSync() {
  return memoryGuest;
}

export async function isGuestMode() {
  if (memoryGuest) return true;
  const value = await AsyncStorage.getItem(GUEST_KEY);
  memoryGuest = value === '1';
  return memoryGuest;
}
