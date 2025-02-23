import React from 'react'
import { Pressable, Text } from 'react-native'

import Colors from '@/constants/Colors'
import useStore from '@/utils/zustand'

export default function Button({
  type = 'primary',
  text,
  onPress,
}: {
  type?: 'primary' | 'secondary'
  text: string
  onPress: Function
}) {
  const theme = useStore(state => state.theme)
  return (
    <Pressable
      onPress={() => onPress()}
      style={({ pressed }) => [
        {
          backgroundColor:
            type === 'primary'
              ? Colors[theme].button
              : Colors[theme].buttonSecondary,
          marginTop: 20,
          borderRadius: 10,
          elevation: pressed ? 0 : 2,
          width: '80%',
          maxWidth: 300,
          height: 50,
          justifyContent: 'center',
        },
      ]}
    >
      <Text
        style={{
          fontSize: 20,
          textAlign: 'center',
          fontWeight: 'bold',
          opacity: 0.95,
          color: returnTextColor(theme, type),
        }}
      >
        {text}
      </Text>
    </Pressable>
  )
}

function returnTextColor(
  theme: 'dark' | 'light',
  type: 'primary' | 'secondary',
): string {
  if (theme === 'light' && type === 'primary') return Colors[theme].background
  return Colors[theme].text
}
