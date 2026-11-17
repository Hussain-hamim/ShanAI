import Colors from '@/constants/Colors';
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
  title: string;
  items: Array<{
    key: string;
    title: string;
    icon: string;
  }>;
  selected?: string;
  onSelect: (key: string) => void;
};

const HeaderDropDown = ({ title, selected, items, onSelect }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={styles.trigger}
        hitSlop={12}
      >
        <Text style={styles.title}>{title}</Text>
        {selected ? (
          <Text style={styles.selected}>
            {selected} {'>'}
          </Text>
        ) : (
          <Ionicons name='chevron-down' size={16} color={Colors.greyLight} />
        )}
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
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontWeight: '500',
    fontSize: 16,
  },
  selected: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.greyLight,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 12,
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

export default HeaderDropDown;
