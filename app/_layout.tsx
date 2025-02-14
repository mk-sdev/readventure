import FontAwesome from '@expo/vector-icons/FontAwesome'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import 'react-native-reanimated'

import { useColorScheme } from '@/components/useColorScheme'
import {
  DEFAULT_HOME_LANGUAGE,
  HOME_LANGUAGE_STORAGE_KEY,
} from '@/constants/StorageKeys'
import { homeLanguages } from '@/constants/Types'
import { clearAsyncStorage, getValue } from '@/utils/async-storage'
import useStore from '@/utils/zustand'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  })

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()

  const setAppLang = useStore(state => state.setAppLang)

  useEffect(() => {
    ;(async () => {
      const storedHomeLang = await getValue(HOME_LANGUAGE_STORAGE_KEY)
      if (storedHomeLang) setAppLang(storedHomeLang)
      //console.log('🚀 ~ ; ~ storedHomeLang:', storedHomeLang)
    })()
  }, [])

  // clearAsyncStorage()
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  )
}
