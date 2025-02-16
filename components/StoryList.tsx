import { useFocusEffect } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { STORED_TEXTS_STORAGE_KEY } from '@/constants/StorageKeys'
import { storedText } from '@/constants/Types'
import { getValue } from '@/utils/async-storage'

export default function StoryList({
  setIndex,
  setShowStory,
}: {
  setIndex: React.Dispatch<React.SetStateAction<number>>
  setShowStory: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [lastTexts, setLastTexts] = useState<storedText[]>([])

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
    <React.Fragment>
      <Text style={styles.title}>Here will be lastly generated texts</Text>
      {lastTexts.length > 0 ? (
        lastTexts.map((text, index) => (
          <Pressable
            onPress={() => {
              setShowStory(true)
              setIndex(index)
            }}
          >
            <View style={{ width: '90%', height: 150, borderWidth: 2 }}>
              <Text key={index}>{text?.text}</Text>
            </View>
          </Pressable>
        ))
      ) : (
        <Text>No texts generated yet.</Text>
      )}
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
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
