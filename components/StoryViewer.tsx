import Slider from '@react-native-community/slider'
import React, { useEffect, useRef, useState } from 'react'
import {
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import StyledText from '@/components/texts'
import Colors from '@/constants/Colors'
// import Text from '@/components/texts'
import { STORED_TEXTS_STORAGE_KEY } from '@/constants/StorageKeys'
import { translations } from '@/constants/Translations'
import { homeLanguages, request, storedText } from '@/constants/Types'
import { getValue } from '@/utils/async-storage'
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
  useEffect(() => {
    // setSliderValue(fontSize)
  }, [fontSize])
  return (
    <React.Fragment>
      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}
      >
        {/* res || index !== undefined */}
        {res || index !== undefined ? (
          <React.Fragment>
            {res && (
              <Slider
                step={1}
                style={{ width: 200, height: 40 }}
                minimumValue={18}
                maximumValue={40}
                value={sliderValue}
                minimumTrackTintColor={Colors[theme].button}
                maximumTrackTintColor={Colors[theme].button}
                thumbTintColor={Colors[theme].tint}
                onValueChange={currentValue => setFontSize(currentValue)}
              />
            )}
            {shouldTranslate ? (
              <Text
                style={[styles.text, { fontSize, color: Colors[theme].text }]}
              >
                {res?.translation}
              </Text>
            ) : (
              <Text style={[styles.text, { color: Colors[theme].text }]}>
                {res?.text.split('.').map((sentence, i) => (
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
                    {sentence}.
                  </Text>
                ))}
              </Text>
            )}
            <Pressable
              style={[
                styles.button,
                {
                  backgroundColor: Colors[theme].button,
                },
              ]}
              onPress={() => {
                console.log('first')
                setShouldTranslate(prev => !prev)
              }}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: Colors[theme].text,
                  },
                ]}
              >
                {shouldTranslate
                  ? translations[appLang].showOriginal
                  : translations[appLang].translate}
              </Text>
            </Pressable>
          </React.Fragment>
        ) : (
          <StyledText type="title" style={{ height: '100%' }}>
            {translations[appLang].waitingText}
          </StyledText>
        )}
        <Pressable
          style={[
            styles.button,
            {
              backgroundColor: Colors[theme].buttonSecondary,
            },
          ]}
          onPress={() => setShowStory(false)}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color: Colors[theme].text,
              },
            ]}
          >
            {translations[appLang].close}
          </Text>
        </Pressable>
      </ScrollView>
      <Sentence
        ref={bottomSheetRef}
        sentence={sentence}
        onClose={handleClose}
      />
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  text: {
    width: '90%',
    maxWidth: 400,
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
})
