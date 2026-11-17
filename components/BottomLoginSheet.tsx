import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { enableGuestMode } from '@/utils/guest';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BottomLoginSheet = () => {
  const { bottom } = useSafeAreaInsets();
  const router = useRouter();

  const enterGuestMode = async () => {
    await enableGuestMode();
    // Force a remount-friendly navigation after flag is persisted
    router.replace('/(auth)/(drawer)/(chat)/new');
  };

  return (
    <View style={[styles.container, { paddingBottom: bottom + 40 }]}>
      <TouchableOpacity
        style={[defaultStyles.btn, styles.btnDark]}
        onPress={() => router.push({ pathname: '/login', params: { type: 'signup' } })}
      >
        <Ionicons name='mail' size={20} style={styles.btnIcon} color={'#fff'} />
        <Text style={styles.btnDarkText}>Sign up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[defaultStyles.btn, styles.btnOutline]}
        onPress={() => router.push({ pathname: '/login', params: { type: 'login' } })}
      >
        <Ionicons
          name='log-in-outline'
          size={26}
          style={styles.btnIcon}
          color={'white'}
        />
        <Text style={styles.btnDarkText}>Log in</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[defaultStyles.btn, styles.btnOutline]}
        onPress={enterGuestMode}
      >
        <Ionicons
          name='bag-outline'
          size={20}
          style={styles.btnIcon}
          color={'purple'}
        />
        <Text style={styles.btnDarkText}>Guest Mode</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 26,
    gap: 14,
  },
  btnDark: {
    backgroundColor: Colors.grey,
  },
  btnDarkText: {
    color: '#fff',
    fontSize: 20,
  },
  btnOutline: {
    borderWidth: 3,
    borderColor: Colors.grey,
  },
  btnIcon: {
    paddingRight: 6,
  },
});

export default BottomLoginSheet;
