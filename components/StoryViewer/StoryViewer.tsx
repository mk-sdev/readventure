import React, { useEffect, useRef, useState } from 'react'
import { Image, ScrollView, StyleSheet, View } from 'react-native'

import StyledText from '@/components/Text'
import {
  FONT_SIZE_STORAGE_KEY,
  STORED_TEXTS_STORAGE_KEY,
} from '@/constants/StorageKeys'
import { translations } from '@/constants/Translations'
import { homeLanguage, request, storedText } from '@/constants/Types'
import { getValue, setValue } from '@/utils/async-storage'
import useFetchText from '@/utils/useFetchText'
import useStore from '@/utils/zustand'

import { Sentence } from '../BottomSheets/BottomSheet'
import Button from '../Button'
import Header from './Header'
import Story from './Story'

export default function StoryViewer({
  setShowStory,
  request,
  index,
}: {
  setShowStory: React.Dispatch<React.SetStateAction<boolean>> // for unmounting
  request?: string // present only if inside StorySetup
  index?: number // present only if inside StoryList
}) {
  const appLang = useStore(state => state.appLang)
  const theme = useStore(state => state.theme)
  const fontSize = useStore(state => state.fontSize)
  const setFontSize = useStore(state => state.setFontSize)
  const [shouldTranslate, setShouldTranslate] = useState(false)
  const [sliderValue, setSliderValue] = useState(fontSize)
  const [sentence, setSentence] = useState('')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null) // index of the selected sentence

  const { response, setResponse, fetchData, error } = useFetchText(
    appLang as homeLanguage,
  ) //used when inside StorySetup

  const bottomSheetRef = useRef<{ open: () => void; close: () => void }>(null)
  const storyExists = response || index !== undefined

  useEffect(() => {
    //if inside StorySetup - perform an API call
    if (request) {
      fetchData(JSON.parse(request as string))
      return
    }

    //if inside StoryList - retrieve from the storage
    ;(async () => {
      const lastTexts: storedText[] = await getValue(STORED_TEXTS_STORAGE_KEY)
      setResponse(lastTexts[index as number])
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      await setValue(FONT_SIZE_STORAGE_KEY, fontSize)
    })()
  }, [fontSize])

  function handleSentencePress(sentence: string, i: number) {
    setSentence(sentence)
    setSelectedIndex(i)
    bottomSheetRef.current?.open()
  }

  function handleClose() {
    setSelectedIndex(null)
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
        {storyExists && (
          <View style={{ alignItems: 'center' }}>
            <Header
              response={response}
              sliderValue={sliderValue}
              setFontSize={setFontSize}
            />

            <Story
              response={response}
              fontSize={fontSize}
              shouldTranslate={shouldTranslate}
              selectedIndex={selectedIndex}
              handleSentencePress={handleSentencePress}
            />
          </View>
        )}

        {!storyExists && !error && (
          // waiting screen displayed while the story is still being generated
          <View style={styles.waitingView}>
            <StyledText type="title" style={{ padding: 20, width: '100%' }}>
              {translations[appLang].waitingText}
            </StyledText>
            <Image
              style={[styles.image, { opacity: theme === 'light' ? 1 : 0.3 }]}
              source={require('../../assets/images/sparkles.png')}
            />
          </View>
        )}

        {error && (
          <View style={styles.waitingView}>
            <StyledText type="title" style={{ padding: 20, width: '100%' }}>
              {translations[appLang].error}
            </StyledText>
            <Image
              style={styles.image}
              source={require('../../assets/images/error.png')}
            />
          </View>
        )}

        <View style={styles.bottomButtonsView}>
          {storyExists && (
            <Button
              text={
                shouldTranslate
                  ? translations[appLang].showOriginal
                  : translations[appLang].translate
              }
              onPress={() => setShouldTranslate(prev => !prev)}
            />
          )}

          {/* closing button is always present */}
          <Button
            type="secondary"
            text={translations[appLang].close}
            onPress={() => setShowStory(false)}
          />
        </View>
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
  bottomButtonsView: {
    width: '100%',
    alignItems: 'center',
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
  waitingView: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  image: {
    width: '50%',
    maxWidth: 200,
    height: 'auto',
    aspectRatio: 1,
    opacity: 0.5,
  },
})
