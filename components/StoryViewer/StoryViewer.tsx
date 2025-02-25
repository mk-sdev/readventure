import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import StyledText from '@/components/Text'
import {
  FONT_SIZE_STORAGE_KEY,
  STORED_TEXTS_STORAGE_KEY,
} from '@/constants/StorageKeys'
import { translations } from '@/constants/Translations'
import { homeLanguages, request, storedText } from '@/constants/Types'
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
  setShowStory: React.Dispatch<React.SetStateAction<boolean>>
  request?: string
  index?: number
}) {
  const appLang = useStore(state => state.appLang)
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
  const fontSize = useStore(state => state.fontSize)
  const setFontSize = useStore(state => state.setFontSize)

  useEffect(() => {
    ;(async () => {
      await setValue(FONT_SIZE_STORAGE_KEY, fontSize)
    })()
  }, [fontSize])

  const [sliderValue, setSliderValue] = useState(fontSize)

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
            <Header
              res={res}
              sliderValue={sliderValue}
              setFontSize={setFontSize}
            />

            <Story
              res={res}
              fontSize={fontSize}
              shouldTranslate={shouldTranslate}
              selectedIndex={selectedIndex}
              handleSentencePress={handleSentencePress}
            />
          </View>
        )}

        {!(res || index !== undefined) && (
          <StyledText type="title" style={{ height: '100%' }}>
            {translations[appLang].waitingText}
          </StyledText>
        )}

        <View style={styles.bottomButtonsView}>
          {(res || index !== undefined) && (
            <Button
              text={
                shouldTranslate
                  ? translations[appLang].showOriginal
                  : translations[appLang].translate
              }
              onPress={() => setShouldTranslate(prev => !prev)}
            />
          )}

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
})
