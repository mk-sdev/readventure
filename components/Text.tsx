import React from 'react'
import { Text as RNText, StyleProp, StyleSheet, TextStyle } from 'react-native'

import Colors from '@/constants/Colors'
import useStore from '@/utils/zustand'

export default function Text({
  children,
  type,
  style,
  numberOfLines,
}: {
  children: string
  type?: 'title' | 'small'
  style?: StyleProp<TextStyle>
  numberOfLines?: number
}) {
  const theme = useStore(state => state.theme)

  return (
    <RNText
      style={[
        type === 'title' && styles.title,
        type === 'small' && styles.smallText,
        { color: Colors[theme].text },
        style,
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </RNText>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 10,
    width: '90%',
    maxWidth: 300,
    textAlign: 'center',
  },
  smallText: {
    width: '95%',
    maxWidth: 300,
    fontSize: 15,
    marginBottom: 10,
    marginTop: -5,
    opacity: 0.7,
    lineHeight: 20,
    textAlign: 'center',
  },
})
