import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  useWindowDimensions,
  TextInput,
  Keyboard,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Drawer } from 'expo-router/drawer';
import Colors from '@/constants/Colors';
import { Link, router, useNavigation } from 'expo-router';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { DrawerActions, NavigationContainer } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  useDrawerStatus,
} from '@react-navigation/drawer';
import { Chat } from '@/utils/Interfaces';
import { deleteChat, getChats, renameChat } from '@/utils/Database';
import { useSQLiteContext } from 'expo-sqlite';
import * as ContextMenu from 'zeego/context-menu';

// a customized drawer component
export const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { top, bottom } = useSafeAreaInsets();
  const isDrawerOpen = useDrawerStatus() === 'open';
  const [history, sethistory] = useState<Chat[]>([]);
  const db = useSQLiteContext();

  useEffect(() => {
    if (isDrawerOpen) {
      loadChats();
    }

    Keyboard.dismiss();
  }, [history, isDrawerOpen]);

  const loadChats = async () => {
    const result = await getChats(db);
    console.log('my chat', result);
    sethistory(result);
  };

  const onDeleteChat = (chatId: number) => {
    Alert.alert('Delete Chat', 'Are you sure you want to delete this chat?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: async () => {
          // Delete the chat
          await db.runAsync('DELETE FROM chats WHERE id = ?', chatId);
          loadChats();
        },
      },
    ]);
  };

  const onRenameChat = (chatId: number) => {
    Alert.prompt(
      'Rename Chat',
      'Enter a new name for the chat',
      async (newName) => {
        if (newName) {
          // Rename the chat
          await renameChat(db, chatId, newName);
          loadChats();
        }
      }
    );
  };

  return (
    <View style={{ flex: 1, marginTop: top + 16 }}>
      {/* HEADER */}
      <View style={{ backgroundColor: 'white', paddingBottom: 16 }}>
        <View style={styles.searchSection}>
          <Ionicons
            name='search'
            style={styles.searchIcon}
            color={Colors.greyLight}
            size={20}
          />
          <TextInput
            style={styles.input}
            placeholder='Search'
            underlineColorAndroid={'transparent'}
          />
        </View>
      </View>

      {/* MIDDLE */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 0 }}
      >
        {/* we spread the items from the existing drawer component vis props */}
        <DrawerItemList {...props} />
        {history.map((chat) => (
          ////////////////////
          // <ContextMenu.Root>
          //   <ContextMenu.Trigger>
          //     <DrawerItem
          //       key={chat.id}
          //       label={chat.title}
          //       inactiveTintColor='#000'
          //       onPress={() =>
          //         router.push(`/(auth)/(drawer)/(chat)/${chat.id}`)
          //       }
          //     />
          //     <ContextMenu.Content>

          //           <ContextMenu.Preview>
          //             {()=>(
          //               <View
          //               style={{
          //                 alignItems: 'center',
          //                 justifyContent: 'center',
          //                 padding: 16,
          //                 height: 200,
          //                 width: 250,
          //                 backgroundColor: '#fff'
          //               }}
          //               >
          // <Text>{chat.title}</Text>
          //               </View>
          //             )}
          //           </ContextMenu.Preview>

          //       <ContextMenu.Item
          //         onSelect={() => onRenameChat(chat.id)}
          //         key='rename'
          //       >
          //         <ContextMenu.ItemTitle>Rename</ContextMenu.ItemTitle>
          //         <ContextMenu.ItemIcon
          //           ios={{ name: 'pencil', pointSize: 18 }}
          //           androidIconName='pencil'
          //         />
          //       </ContextMenu.Item>

          //       <ContextMenu.Item
          //         onSelect={() => onDeleteChat(chat.id)}
          //         key='delete'
          //       >
          //         <ContextMenu.ItemTitle>Delete</ContextMenu.ItemTitle>
          //         <ContextMenu.ItemIcon
          //           ios={{ name: 'pencil', pointSize: 18 }}
          //           androidIconName='pencil'
          //         />
          //       </ContextMenu.Item>
          //     </ContextMenu.Content>
          //   </ContextMenu.Trigger>
          // </ContextMenu.Root>
          ////////////////////

          <React.Fragment key={chat.id}>
            <DrawerItem
              key={chat.id}
              label={chat.title}
              inactiveTintColor='#000'
              onPress={() => router.push(`/(auth)/(drawer)/(chat)/${chat.id}`)}
            />
            <TouchableOpacity onPress={() => onDeleteChat(chat.id)}>
              <Text style={{ color: 'tomato' }}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => onRenameChat(chat.id)}>
              <Text style={{ color: 'green' }}>Rename</Text>
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </DrawerContentScrollView>

      {/* FOOTER */}
      <View style={{ padding: 16, paddingBottom: bottom + 10 }}>
        <Link href='/(auth)/(modal)/settings' asChild>
          <TouchableOpacity style={styles.footer}>
            <Image
              //   source={{ uri: 'https://galaxies.dev/img/meerkat_2.jpt' }}
              source={require('@/assets/images/anime-pfp.jpg')}
              style={styles.avatar}
            />
            <Text style={styles.userName}>Hussain Hamim</Text>
            <Text style={{ color: Colors.greyLight }}>v1.0.0 - 2025</Text>
            <Ionicons
              name='ellipsis-horizontal'
              size={24}
              color={Colors.greyLight}
            />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

const Layout = () => {
  const navigation = useNavigation();
  const dimensions = useWindowDimensions();

  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      screenOptions={{
        // headerLeft: () => (
        //   <TouchableOpacity
        //     onPress={() => navigation.dispatch(DrawerActions.toggleDrawer)}
        //     style={{ marginHorizontal: 16 }}
        //   >
        //     <FontAwesome6 name='grip-lines' size={20} color={Colors.grey} />
        //   </TouchableOpacity>
        // ),
        headerStyle: { backgroundColor: Colors.light },
        headerShadowVisible: false,
        drawerActiveBackgroundColor: Colors.selected,
        // drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerItemStyle: { borderRadius: 12 },
        drawerLabelStyle: { borderRadius: -20 },
        overlayColor: 'rgba(0, 0, 0, 0.2)',
        drawerStyle: { width: dimensions.width * 0.86 },
      }}
    >
      <Drawer.Screen
        name='(chat)/new'
        getId={() => Math.random().toString()}
        options={{
          title: 'Shan AI', // shan ai
          drawerIcon: () => (
            <View style={[styles.item, { backgroundColor: '#000' }]}>
              <Image
                style={[styles.btnImage]}
                source={require('@/assets/images/logo-white.png')}
              />
            </View>
          ),
          //
          headerRight: () => (
            <Link href={'/(auth)/(drawer)/(chat)/new'} push asChild>
              <TouchableOpacity>
                <Ionicons
                  name='create-outline'
                  size={26}
                  color={Colors.grey}
                  style={{ marginRight: 16 }}
                />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />

      <Drawer.Screen
        name='(chat)/[id]'
        options={{
          title: 'Chat',
          drawerItemStyle: { display: 'none' },
          headerRight: () => (
            <Link href={'/(auth)/(drawer)/(chat)/new'} push asChild>
              <TouchableOpacity>
                <Ionicons
                  name='create-outline'
                  size={26}
                  color={Colors.grey}
                  style={{ marginRight: 16 }}
                />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />

      <Drawer.Screen
        name='dalle'
        options={{
          title: 'Dall-E',
          drawerIcon: () => (
            <View style={[styles.item, { backgroundColor: '#000' }]}>
              <Image
                style={[styles.dallEImage]}
                source={require('@/assets/images/dalle.png')}
              />
            </View>
          ),
        }}
      />

      <Drawer.Screen
        name='explore'
        options={{
          title: 'Explore GPTs',
          drawerIcon: () => (
            <View style={[styles.exploreItem]}>
              <Ionicons name='apps-outline' size={18} color='#000' />
            </View>
          ),
        }}
      />
    </Drawer>
  );
};

const styles = StyleSheet.create({
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
    alignItems: 'center',
    color: '#424242',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roundImage: {
    width: 30,
    height: 30,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  userName: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
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
  dallEImage: {
    width: 28,
    height: 28,
    resizeMode: 'cover',
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
