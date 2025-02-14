import { useFocusEffect } from 'expo-router'
import { useCallback } from 'react'
import { StyleSheet } from 'react-native'

import { Text, View } from '@/components/Themed'
import { HOME_LANGUAGE_STORAGE_KEY } from '@/constants/StorageKeys'
import { getValue } from '@/utils/async-storage'

export default function LastTextsScreen() {
  useFocusEffect(
    useCallback(() => {
      const loadLanguage = async () => {
        const storeLang = await getValue(HOME_LANGUAGE_STORAGE_KEY)
        console.log('Stored language:', storeLang)
      }

      loadLanguage()
    }, []),
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Here will be lastly generated texts</Text>
      {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/three.tsx" /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})
