import Feather from '@expo/vector-icons/Feather'
import Slider from '@react-native-community/slider'
import * as Clipboard from 'expo-clipboard'
import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import Colors from '@/constants/Colors'
import { translations } from '@/constants/Translations'
import { homeLanguages, response } from '@/constants/Types'
import { returnFlag } from '@/utils/functions'
import useStore from '@/utils/zustand'

export default function Header({
  res,
  sliderValue,
  setFontSize,
}: {
  res: response | null
  sliderValue: number
  setFontSize: Function
}) {
  const theme = useStore(state => state.theme)
  const appLang = useStore(state => state.appLang)
  const [showCopyText, setShowCopyText] = useState<unknown>(true)

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(res?.text as string)
    setShowCopyText(false)
    setTimeout(() => {
      setShowCopyText(true)
    }, 2000)
  }

  return (
    <View style={styles.header}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}
      >
        {returnFlag(res?.lang as homeLanguages)}
        <Text
          //@ts-ignore
          style={{
            color: Colors[theme].text,
            fontWeight: 'bold',
            lineHeight: '100%',
          }}
        >
          {res?.level}
        </Text>
      </View>
      {res && (
        <Slider
          step={1}
          style={{ flexBasis: 175 }}
          minimumValue={18}
          maximumValue={40}
          value={sliderValue}
          minimumTrackTintColor={Colors[theme].sliderLeft}
          maximumTrackTintColor={Colors[theme].sliderRight}
          thumbTintColor={Colors[theme].sliderThumb}
          onValueChange={currentValue => setFontSize(currentValue)}
        />
      )}
      <Pressable onPress={() => copyToClipboard()}>
        <View
          style={{
            height: '100%',
            alignItems: 'center',
            width: 50,
          }}
        >
          <Feather
            name={showCopyText ? 'copy' : 'check-circle'}
            size={25}
            color={Colors[theme].tint}
          />
          <Text
            style={[
              styles.copyText,
              {
                color: Colors[theme].tint,
                opacity: theme === 'dark' ? 0.75 : 0.85,
              },
            ]}
          >
            {showCopyText
              ? translations[appLang].copy
              : translations[appLang].copied}
          </Text>
        </View>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    width: '90%',
    maxWidth: 400,
    padding: 10,
    flexDirection: 'row',
    gap: 10,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  copyText: {
    fontWeight: 'bold',
    fontSize: 13,
  },
})
