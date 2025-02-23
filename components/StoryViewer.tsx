import Feather from '@expo/vector-icons/Feather'
import Slider from '@react-native-community/slider'
import * as Clipboard from 'expo-clipboard'
import React, { useEffect, useRef, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

import StyledText from '@/components/texts'
import Colors from '@/constants/Colors'
import { STORED_TEXTS_STORAGE_KEY } from '@/constants/StorageKeys'
import { translations } from '@/constants/Translations'
import { homeLanguages, request, storedText } from '@/constants/Types'
import { getValue } from '@/utils/async-storage'
import { returnFlag } from '@/utils/functions'
import useFetchText from '@/utils/useFetchText'
import useStore from '@/utils/zustand'

import { Sentence } from './BottomSheets/BottomSheet'

export default function StoryViewer({
  appLang,
  setShowStory,
  request,
  index,
}: {
  appLang: homeLanguages
  setShowStory: React.Dispatch<React.SetStateAction<boolean>>
  request?: string
  index?: number
}) {
  const [shouldTranslate, setShouldTranslate] = useState(false)
  const { res, setRes, fetchData } = useFetchText(appLang as homeLanguages)

  useEffect(() => {
    if (request) {
      const req: request = JSON.parse(request as string)
      fetchData(req)
      return
    }

    ;(async () => {
      const lastTexts: storedText[] = await getValue(STORED_TEXTS_STORAGE_KEY)
      setRes(lastTexts[index as number])
    })()
  }, [])

  const bottomSheetRef = useRef<{ open: () => void; close: () => void }>(null)
  const [sentence, setSentence] = useState('')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null) // index of the selected sentence

  function handleSentencePress(sentence: string, i: number) {
    setSentence(sentence)
    setSelectedIndex(i)
    bottomSheetRef.current?.open()
  }

  function handleClose() {
    setSelectedIndex(null)
  }

  const theme = useStore(state => state.theme)

  const [fontSize, setFontSize] = useState<number>(22)
  const [sliderValue, setSliderValue] = useState(22)
  // useEffect(() => {
  //   // setSliderValue(fontSize)
  // }, [fontSize])

  const [showCopyText, setShowCopyText] = useState<unknown>(true)
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(res?.text as string)
    setShowCopyText(false)
    setTimeout(() => {
      setShowCopyText(true)
    }, 2000)
  }

  return (
    <React.Fragment>
      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={{
          alignItems: 'center',
          paddingBottom: 20,
          justifyContent: 'space-between',
          minHeight: '100%',
        }}
      >
        {(res || index !== undefined) && (
          <View style={{ alignItems: 'center' }}>
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
                    {showCopyText ? 'Copy' : 'Copied!'}
                  </Text>
                </View>
              </Pressable>
            </View>
            {shouldTranslate ? (
              <Text
                style={[styles.text, { fontSize, color: Colors[theme].text }]}
              >
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
                        selectedIndex === i
                          ? Colors[theme].button
                          : 'transparent',
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
          </View>
        )}

        {!(res || index !== undefined) && (
          <StyledText type="title" style={{ height: '100%' }}>
            {translations[appLang].waitingText}
          </StyledText>
        )}

        <View style={styles.bottomButtonsView}>
          {(res || index !== undefined) && (
            <Pressable
              style={[styles.button, { backgroundColor: Colors[theme].button }]}
              onPress={() => {
                console.log('first')
                setShouldTranslate(prev => !prev)
              }}
            >
              <Text style={[styles.buttonText, { color: Colors[theme].text }]}>
                {shouldTranslate
                  ? translations[appLang].showOriginal
                  : translations[appLang].translate}
              </Text>
            </Pressable>
          )}

          <Pressable
            style={[
              styles.button,
              { backgroundColor: Colors[theme].buttonSecondary },
            ]}
            onPress={() => setShowStory(false)}
          >
            <Text style={[styles.buttonText, { color: Colors[theme].text }]}>
              {translations[appLang].close}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
      <Sentence
        ref={bottomSheetRef}
        sentence={sentence}
        onClose={handleClose}
        theme={theme}
      />
    </React.Fragment>
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
  bottomButtonsView: {
    width: '100%',
    alignItems: 'center',
  },
  text: {
    width: '90%',
    maxWidth: 400,
    opacity: 0.8,
  },
  button: {
    borderRadius: 9,
    height: 50,
    width: '70%',
    maxWidth: 300,
    marginTop: 20,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  copyText: {
    fontWeight: 'bold',
    fontSize: 13,
  },
})
