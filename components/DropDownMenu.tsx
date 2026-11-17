import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export type Props = {
  items: Array<{
    key: string;
    title: string;
    icon: string;
  }>;
  onSelect: (key: string) => void;
};

const DropDownMenu = ({ items, onSelect }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable onPress={() => setOpen(true)} hitSlop={12}>
        <Ionicons name='ellipsis-horizontal' size={24} color={'#fff'} />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType='fade'
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.menu}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={styles.item}
                onPress={() => {
                  onSelect(item.key);
                  setOpen(false);
                }}
              >
                <Text style={styles.itemText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'flex-end',
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 12,
    minWidth: 180,
    overflow: 'hidden',
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 16,
  },
});

export default DropDownMenu;
