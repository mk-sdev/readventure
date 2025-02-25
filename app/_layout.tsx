import FontAwesome from '@expo/vector-icons/FontAwesome'
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'

import { useColorScheme } from '@/components/useColorScheme'
import {
  COLOR_THEME_STORAGE_KEY,
  FONT_SIZE_STORAGE_KEY,
  HOME_LANGUAGE_STORAGE_KEY,
} from '@/constants/StorageKeys'
import { getValue } from '@/utils/async-storage'
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
  const setTheme = useStore(state => state.setTheme)
  const setFontSize = useStore(state => state.setFontSize)

  useEffect(() => {
    ;(async () => {
      const storedHomeLang = await getValue(HOME_LANGUAGE_STORAGE_KEY)
      if (storedHomeLang) setAppLang(storedHomeLang)

      const storedTheme = await getValue(COLOR_THEME_STORAGE_KEY)
      if (storedTheme) setTheme(storedTheme)

      const storedFontSize = await getValue(FONT_SIZE_STORAGE_KEY)
      if (storedFontSize) setFontSize(storedFontSize)

      // else if (colorScheme) setTheme(colorScheme)
      //console.log('🚀 ~ ; ~ storedHomeLang:', storedHomeLang)
    })()
  }, [])

  // clearAsyncStorage()
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}
