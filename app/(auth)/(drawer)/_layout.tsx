import Colors from '@/constants/Colors';
import { Chat } from '@/utils/Interfaces';
import {
  deleteChatAll,
  getChats,
  renameChat,
} from '@/utils/Database';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useUser } from '@clerk/expo';
import { Drawer } from 'expo-router/drawer';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { top, bottom } = useSafeAreaInsets();
  const [history, setHistory] = useState<Chat[]>([]);
  const db = useSQLiteContext();
  const router = useRouter();
  const [colorTheme, setColorTheme] = useState(false);
  const { user } = useUser();

  const textColor = colorTheme ? '#fff' : Colors.grey;
  const bgColor = colorTheme ? '#000' : '#fff';

  const loadChats = async () => {
    const result = await getChats(db);
    setHistory(result);
  };

  useEffect(() => {
    loadChats();
    Keyboard.dismiss();

    const unsub = props.navigation.addListener('focus', () => {
      loadChats();
      Keyboard.dismiss();
    });

    return unsub;
  }, [props.navigation]);

  return (
    <View style={{ backgroundColor: bgColor, flex: 1, paddingTop: top + 12 }}>
      <StatusBar style={colorTheme ? 'light' : 'dark'} />

      <View style={[styles.header, { backgroundColor: bgColor }]}>
        <View style={[styles.searchSection, { width: '80%' }]}>
          <Ionicons
            name='search'
            style={styles.searchIcon}
            color={Colors.greyLight}
            size={20}
          />
          <TextInput
            style={styles.input}
            placeholder='Search'
            placeholderTextColor={Colors.greyLight}
            underlineColorAndroid='transparent'
          />
        </View>
        <TouchableOpacity onPress={() => setColorTheme(!colorTheme)}>
          <Ionicons
            name={colorTheme ? 'moon' : 'sunny'}
            size={24}
            color={Colors.greyLight}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingTop: 0, paddingBottom: 16 }}>
        {props.state.routes.map((route, index) => {
          const focused = index === props.state.index;
          const { options } = props.descriptors[route.key];
          const drawerItemStyle = options.drawerItemStyle as
            | { display?: string }
            | undefined;

          if (drawerItemStyle?.display === 'none') return null;

          const label =
            typeof options.title === 'string' ? options.title : route.name;
          const iconColor = focused ? '#000' : textColor;

          return (
            <TouchableOpacity
              key={route.key}
              style={[styles.drawerRow, focused && styles.drawerRowActive]}
              onPress={() => props.navigation.navigate(route.name)}
            >
              <View style={styles.drawerIcon}>
                {typeof options.drawerIcon === 'function'
                  ? options.drawerIcon({
                      color: iconColor,
                      size: 22,
                      focused,
                    })
                  : null}
              </View>
              <Text style={[styles.drawerLabel, { color: iconColor }]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {history.length > 0 && (
          <Text style={styles.historyLabel}>Previous chats</Text>
        )}
        {history.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            style={styles.drawerRow}
            onPress={() =>
              router.push(`/(auth)/(drawer)/(chat)/${chat.id}`)
            }
            onLongPress={() => {
              Alert.alert(chat.title, undefined, [
                {
                  text: 'Rename',
                  onPress: () => {
                    Alert.prompt(
                      'Rename Chat',
                      'Enter a new name for the chat',
                      async (newName) => {
                        if (newName) {
                          await renameChat(db, chat.id, newName);
                          loadChats();
                        }
                      }
                    );
                  },
                },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: async () => {
                    await db.runAsync('DELETE FROM chats WHERE id = ?', chat.id);
                    loadChats();
                  },
                },
                { text: 'Cancel', style: 'cancel' },
              ]);
            }}
          >
            <Text
              style={[styles.drawerLabel, { color: textColor }]}
              numberOfLines={1}
            >
              {chat.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={{ padding: 16, paddingBottom: bottom + 15 }}>
        <TouchableOpacity
          style={styles.settingsRow}
          onPress={() => router.push('/(auth)/(modal)/settings')}
        >
          <Ionicons name='settings-outline' size={24} color={Colors.grey} />
          <Text style={{ fontSize: 17, color: textColor }}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footer}
          onPress={() => router.push('/(auth)/(modal)/settings')}
        >
          <Image
            source={require('@/assets/images/anime-pfp.jpg')}
            style={styles.avatar}
          />
          <Text style={[styles.userName, { color: textColor }]} numberOfLines={1}>
            {user?.primaryEmailAddress?.emailAddress || 'Guest'}
          </Text>
        </TouchableOpacity>

        {history.length > 0 && (
          <TouchableOpacity
            style={styles.deleteAll}
            onPress={() => {
              Alert.alert(
                'Delete All Chats',
                'Are you sure you want to delete ALL chats?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete All',
                    style: 'destructive',
                    onPress: async () => {
                      await deleteChatAll(db);
                      loadChats();
                    },
                  },
                ]
              );
            }}
          >
            <Ionicons name='trash-outline' size={18} color='tomato' />
            <Text style={{ color: 'tomato', marginLeft: 6 }}>Delete All</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const NewChatButton = () => {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.push('/(auth)/(drawer)/(chat)/new')}
      hitSlop={12}
    >
      <Ionicons
        name='create-outline'
        size={26}
        color={Colors.grey}
        style={{ marginRight: 16 }}
      />
    </TouchableOpacity>
  );
};

const Layout = () => {
  const dimensions = useWindowDimensions();

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: Colors.light },
        headerShadowVisible: false,
        drawerActiveBackgroundColor: Colors.selected,
        drawerInactiveTintColor: '#000',
        overlayColor: 'rgba(0, 0, 0, 0.2)',
        drawerStyle: { width: dimensions.width * 0.86 },
      }}
    >
      <Drawer.Screen
        name='(chat)/new'
        dangerouslySingular={() => Math.random().toString()}
        options={{
          title: 'Shan AI',
          drawerIcon: () => (
            <View style={[styles.item, { backgroundColor: '#000' }]}>
              <Image
                style={styles.btnImage}
                source={require('@/assets/images/logo-white.png')}
              />
            </View>
          ),
          headerRight: () => <NewChatButton />,
        }}
      />

      <Drawer.Screen
        name='(chat)/[id]'
        options={{
          title: 'Chat',
          drawerItemStyle: { display: 'none' },
          headerRight: () => <NewChatButton />,
        }}
      />

      <Drawer.Screen
        name='dalle'
        options={{
          title: 'Image Generation',
          drawerIcon: () => (
            <View style={styles.item}>
              <Ionicons name='image' size={26} color='green' />
            </View>
          ),
        }}
      />

      <Drawer.Screen
        name='deepseek'
        options={{
          title: 'DeepSeek AI',
          drawerIcon: () => (
            <View style={styles.item}>
              <Ionicons name='fish-outline' size={26} color='blue' />
            </View>
          ),
        }}
      />

      <Drawer.Screen
        name='explore'
        options={{
          title: 'Explore Features',
          drawerIcon: () => (
            <View style={styles.exploreItem}>
              <Ionicons name='apps-outline' size={18} color='#000' />
            </View>
          ),
        }}
      />
    </Drawer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchSection: {
    marginHorizontal: 16,
    borderRadius: 10,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.input,
  },
  searchIcon: {
    padding: 6,
  },
  input: {
    flex: 1,
    paddingTop: 8,
    paddingRight: 8,
    paddingBottom: 8,
    paddingLeft: 0,
    color: '#424242',
  },
  drawerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 2,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 12,
  },
  drawerRowActive: {
    backgroundColor: Colors.selected,
  },
  drawerIcon: {
    width: 28,
    alignItems: 'center',
  },
  drawerLabel: {
    fontSize: 16,
    flex: 1,
  },
  historyLabel: {
    color: Colors.greyLight,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
    fontSize: 13,
  },
  settingsRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    paddingVertical: 15,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 17,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  deleteAll: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  item: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  btnImage: {
    margin: 6,
    width: 16,
    height: 16,
  },
  exploreItem: {
    borderRadius: 15,
    backgroundColor: '#fff',
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Layout;
