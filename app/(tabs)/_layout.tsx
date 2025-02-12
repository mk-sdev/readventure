import Feather from '@expo/vector-icons/Feather'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import Octicons from '@expo/vector-icons/Octicons'
import { Link, Tabs } from 'expo-router'
import React from 'react'
import { Pressable } from 'react-native'

import { useClientOnlyValue } from '@/components/useClientOnlyValue'
import { useColorScheme } from '@/components/useColorScheme'
import Colors from '@/constants/Colors'

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
  //return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />
}

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="settings" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          // headerRight: () => (
          //   <Link href="/modal" asChild>
          //     <Pressable>
          //       {({ pressed }) => (
          //         <FontAwesome
          //           name="info-circle"
          //           size={25}
          //           color={Colors[colorScheme ?? 'light'].text}
          //           style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
          //         />
          //       )}
          //     </Pressable>
          //   </Link>
          //),
        }}
      />
      <Tabs.Screen
        name="last-texts"
        options={{
          title: 'Last texts',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="last-texts" color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
