import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { Text, View } from '@/components/Themed'
import { STORED_TEXTS_STORAGE_KEY } from '@/constants/StorageKeys'
import { storedText } from '@/constants/Types'
import { getValue } from '@/utils/async-storage'

export default function LastTextsScreen() {
  const [lastTexts, setLastTexts] = useState([])

  useFocusEffect(
    useCallback(() => {
      ;(async () => {
        const storedTexts: Array<storedText> = await getValue(
          STORED_TEXTS_STORAGE_KEY,
        )
        setLastTexts(storedTexts ? storedTexts : [])
      })()
    }, []),
  )

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Here will be lastly generated texts</Text>

      {lastTexts.length > 0 ? (
        lastTexts.map((text, index) => (
          <View style={{ width: '90%', height: 150, borderWidth: 2 }}>
            <Text key={index}>{text?.text}</Text>
          </View>
        ))
      ) : (
        <Text>No texts generated yet.</Text>
      )}
    </ScrollView>
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
