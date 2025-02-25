import Feather from '@expo/vector-icons/Feather'
import { Portal } from '@gorhom/portal'
import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

import Text from '@/components/Text'
import Colors from '@/constants/Colors'
import { translations } from '@/constants/Translations'
import useStore from '@/utils/zustand'

type SnackbarProps = {
  isConnected: boolean
  shake?: boolean
}

export default function Snackbar({ isConnected, shake }: SnackbarProps) {
  const theme = useStore(state => state.theme)
  const appLang = useStore(state => state.appLang)

  const translateY = useSharedValue(50)
  const opacity = useSharedValue(0)
  const shakeX = useSharedValue(0)

  useEffect(() => {
    if (isConnected) {
      translateY.value = withTiming(50, { duration: 300 })
      opacity.value = withTiming(0, { duration: 300 })
    } else {
      translateY.value = withTiming(0, { duration: 300 })
      opacity.value = withTiming(1, { duration: 300 })
    }
  }, [isConnected])

  // Efekt drgania
  useEffect(() => {
    if (shake) {
      shakeX.value = withSequence(
        withTiming(-5, { duration: 50 }),
        withTiming(5, { duration: 50 }),
        withTiming(-5, { duration: 50 }),
        withTiming(5, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      )
    }
  }, [shake])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { translateX: shakeX.value }],
    opacity: opacity.value,
  }))

  return (
    <Portal hostName="NetInfoHost">
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.snackbar,
            animatedStyle,
            {
              backgroundColor: Colors[theme].alertBg,
              borderColor: Colors[theme].alertBorder,
            },
          ]}
        >
          <Feather name="wifi-off" size={24} color={Colors[theme].text} />
          <Text style={{ textAlign: 'center', fontSize: 15 }}>
            {translations[appLang].noInternet}
          </Text>
        </Animated.View>
      </View>
    </Portal>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    zIndex: 1,
    alignItems: 'center',
  },
  snackbar: {
    flexDirection: 'row',
    borderWidth: 2,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
    borderRadius: 10,
  },
})
