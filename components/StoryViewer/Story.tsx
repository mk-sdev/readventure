import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import Colors from '@/constants/Colors'
import { response } from '@/constants/Types'
import useStore from '@/utils/zustand'

export default function Story({
  shouldTranslate,
  fontSize,
  res,
  selectedIndex,
  handleSentencePress,
}: {
  shouldTranslate: boolean
  fontSize: number
  res: response | null
  selectedIndex: number | null
  handleSentencePress: (a: string, i: number) => void
}) {
  const theme = useStore(state => state.theme)

  return (
    <>
      {shouldTranslate ? (
        <Text style={[styles.text, { fontSize, color: Colors[theme].text }]}>
          {res?.translation}
        </Text>
      ) : (
        <Text style={[styles.text, { color: Colors[theme].text }]}>
          {res?.text.split('. ').map((sentence, i, arr) => (
            <Text
              key={i}
              style={{
                fontSize,
                backgroundColor:
                  selectedIndex === i ? Colors[theme].button : 'transparent',
              }}
              onPress={() =>
                handleSentencePress(res?.translation.split('.')[i], i)
              }
            >
              {sentence}
              {i !== arr.length - 1 && '. '}
            </Text>
          ))}
        </Text>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  text: {
    width: '90%',
    maxWidth: 700,
    opacity: 0.8,
  },
})
