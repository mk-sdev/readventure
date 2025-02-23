import Feather from '@expo/vector-icons/Feather'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import Octicons from '@expo/vector-icons/Octicons'
import { Tabs } from 'expo-router'
import React from 'react'

import { useClientOnlyValue } from '@/components/useClientOnlyValue'
import { useColorScheme } from '@/components/useColorScheme'
import Colors from '@/constants/Colors'
import { translations } from '@/constants/Translations'
import useStore from '@/utils/zustand'

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: 'home' | 'settings' | 'last-texts'
  color: string
}) {
  switch (props.name) {
    case 'home':
      return <Octicons name="home" size={24} color={props.color} />
    case 'settings':
      return <Feather name="settings" size={24} color={props.color} />
    case 'last-texts':
      return <FontAwesome5 name="history" size={24} color={props.color} />
    default:
      return <FontAwesome name="home" color={props.color} /> // Default to home icon if not specified.
  }
}

export default function TabLayout() {
  const colorScheme = useColorScheme()
  const appLang = useStore(state => state.appLang)
  const theme = useStore(state => state.theme)

  return (
    <Tabs
      screenOptions={{
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerStyle: {
          backgroundColor: Colors[theme].background,
          elevation: 2,
          borderBottomWidth: 1,
          borderBottomColor: Colors[theme].headerBorder,
        },
        headerTintColor: Colors[theme].text,
        headerShown: useClientOnlyValue(false, true),

        tabBarStyle: {
          backgroundColor: Colors[theme].background,
          height: 60,
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: Colors[theme].tabIconSelected,
        tabBarInactiveTintColor: Colors[theme].tabIconDefault,
        tabBarLabelStyle: {
          fontSize: 14,
        },
      }}
    >
      <Tabs.Screen
        name="settings"
        options={{
          title: translations[appLang].settings,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="settings" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarHideOnKeyboard: true,
          title: translations[appLang].home,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="last-texts"
        options={{
          title: translations[appLang].lastTexts,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="last-texts" color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
