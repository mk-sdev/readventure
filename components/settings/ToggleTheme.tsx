import Feather from '@expo/vector-icons/Feather'
import React from 'react'
import { Pressable, View } from 'react-native'

import Text from '@/components/Text'
import Colors from '@/constants/Colors'
import { translations } from '@/constants/Translations'
import useStore from '@/utils/zustand'

export default function ToggleTheme({
  localTheme,
  setLocalTheme,
}: {
  localTheme: 'light' | 'dark'
  setLocalTheme: Function
}) {
  const appLang = useStore(state => state.appLang)
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        gap: 20,
        marginTop: 20,
      }}
    >
      <Text
        type="title"
        style={{
          width: 'auto',
          marginTop: 10,
        }}
      >
        {translations[appLang].toggleTheme}
      </Text>
      <View
        style={{
          backgroundColor: 'transparent',
          flexDirection: 'row',
          height: 50,
          width: 100,
          borderRadius: 15,
          overflow: 'hidden',
        }}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor:
              localTheme === 'dark'
                ? Colors[localTheme].buttonSecondary
                : Colors[localTheme].button,
            justifyContent: 'center',
          }}
          onPress={() => setLocalTheme('light')}
        >
          <Feather
            name="sun"
            size={24}
            style={{
              alignSelf: 'center',
              opacity: localTheme === 'dark' ? 0.5 : 1,
            }}
            color={Colors[localTheme].text}
          />
        </Pressable>
        <Pressable
          style={{
            flex: 1,
            backgroundColor:
              localTheme === 'dark'
                ? Colors[localTheme].button
                : Colors[localTheme].buttonSecondary,
            justifyContent: 'center',
          }}
          onPress={() => setLocalTheme('dark')}
        >
          <Feather
            name="moon"
            size={24}
            style={{
              alignSelf: 'center',
              opacity: localTheme === 'dark' ? 1 : 0.5,
            }}
            color={Colors[localTheme].text}
          />
        </Pressable>
      </View>
    </View>
  )
}
