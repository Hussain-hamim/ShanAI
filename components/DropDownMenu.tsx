import { View, Text } from 'react-native';
import React from 'react';
import * as DropdownMenu from 'zeego/dropdown-menu';
import { Ionicons } from '@expo/vector-icons';

export type Props = {
  items: Array<{
    key: string;
    title: string;
    icon: string;
  }>;
  onSelect: (key: string) => void;
};

const DropDownMenu = ({ items, onSelect }: Props) => {
  return (
    <>
      {/* <DropdownMenu.Root>
        <DropdownMenu.Trigger> */}
      <Ionicons name='ellipsis-horizontal' size={24} color={'#fff'} />
      {/* </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {items.map((item) => (
            <DropdownMenu.Item
              key={item.key}
              onSelect={() => onSelect(item.key)}
            >
              <DropdownMenu.ItemTitle>{item.title}</DropdownMenu.ItemTitle>
              <DropdownMenu.ItemIcon
                androidIconName={item.icon}
                ios={{ name: item.icon, pointSize: 18 }}
              />
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root> */}
    </>
  );
};

export default DropDownMenu;
