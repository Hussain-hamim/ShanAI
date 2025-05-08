import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const BottomLoginSheet = () => {
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: bottom + 40 }]}>
      <Link
        href={{
          pathname: '/login',
          params: { type: 'register' },
        }}
        style={[defaultStyles.btn, styles.btnDark]}
        asChild
      >
        <TouchableOpacity>
          <Ionicons
            name='mail'
            size={20}
            style={styles.btnIcon}
            color={'#fff'}
          />
          <Text style={styles.btnDarkText}>Sign up</Text>
        </TouchableOpacity>
      </Link>
      <Link
        href={{
          pathname: '/login',
          params: { type: 'login' },
        }}
        style={[defaultStyles.btn, styles.btnOutline]}
        asChild
      >
        <TouchableOpacity>
          <Ionicons
            name='log-in-outline'
            size={26}
            style={styles.btnIcon}
            color={'white'}
          />
          <Text style={styles.btnDarkText}>Log in</Text>
        </TouchableOpacity>
      </Link>
      <Link
        href={{
          pathname: '/(auth)/(drawer)/(chat)/new',
          params: { type: 'guest' },
        }}
        style={[defaultStyles.btn, styles.btnOutline]}
        asChild
      >
        <TouchableOpacity>
          <Ionicons
            name='bag-outline'
            size={20}
            style={styles.btnIcon}
            color={'purple'}
          />
          <Text style={styles.btnDarkText}>Guest Mode</Text>
        </TouchableOpacity>
      </Link>
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
  btnLight: {
    backgroundColor: '#fff',
  },
  btnLightText: {
    color: '#000',
    fontSize: 20,
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
