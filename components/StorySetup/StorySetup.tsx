import NetInfo from '@react-native-community/netinfo'
import { useFocusEffect } from 'expo-router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Alert } from 'react-native'

import Snackbar from '@/components/Snackbar'
import { ADVANCEMENT_LEVELS_STORAGE_KEY } from '@/constants/StorageKeys'
import { translations } from '@/constants/Translations'
import {
  foreignLanguage,
  languageItem,
  level,
  levels,
  request,
} from '@/constants/Types'
import { getValue, setValue } from '@/utils/async-storage'
import useStoredData from '@/utils/useStoredData'
import useStore from '@/utils/zustand'

import { LanguagePickerBottomSheet } from '../BottomSheets/LanguagePickerBottomSheet'
import Button from '../Button'
import LanguageButton from './LanguageButton'
import LevelButtons from './LevelButtons'
import TextArea from './TextArea'

export default function StorySetup({
  setRequest,
  setShowStory,
}: {
  setRequest: React.Dispatch<React.SetStateAction<string>>
  setShowStory: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const appLang = useStore(state => state.appLang)
  const [description, setDescription] = useState('')
  const [topLanguage, setTopLanguage] = useState<foreignLanguage | null>(null) // a language that appears on the language picker button at first
  const { loadFavLangs, favLangs } = useStoredData()
  const [advancementLevel, setAdvancementLevel] = useState<level>('A1')

  const bottomSheetRef = useRef<{ open: () => void; close: () => void }>(null)
  const [languageItems, setLanguageItems] = useState<languageItem[]>([])

  const characterLimit = 150

  const [shake, setShake] = useState(false) // whether to shake the "no internet" snackbar or not
  const [isConnected, setIsConnected] = useState(true) // whether is the Internet connection or not

  useFocusEffect(
    useCallback(() => {
      loadFavLangs()
    }, []),
  )

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      //@ts-ignore
      setIsConnected(state.isConnected)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    // if the user chooses another language, its remembered advancement level is being set to the state
    ;(async () => {
      let storedLevels: Record<string, level> = await getValue(
        ADVANCEMENT_LEVELS_STORAGE_KEY,
      )
      setAdvancementLevel(storedLevels?.[topLanguage as string] ?? 'A1')
    })()
  }, [topLanguage])

  useEffect(() => {
    // setting the languageItems for the bottom shit in a correct order (alphabetic, favourite first)
    let newItems = Object.entries(translations[appLang].foreignLanguages).map(
      ([key, value]) => ({
        label: value,
        value: key as foreignLanguage,
        isFav: favLangs && favLangs.includes(key as foreignLanguage),
      }),
    )

    newItems = [
      ...newItems.filter(item => favLangs.includes(item.value)),
      ...newItems.filter(item => !favLangs.includes(item.value)),
    ]
    setLanguageItems(newItems)
    setTopLanguage(newItems[0]?.value || topLanguage)
  }, [favLangs, appLang])

  async function handleSubmit() {
    // must be connected to the Internet
    if (!isConnected) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }

    // must not exceed the character limit of the description
    if (description.length > characterLimit) {
      Alert.alert(translations[appLang].submitAlert)
      return
    }

    // creating the request object for POST operation
    const request: request = {
      description,
      lang: topLanguage as foreignLanguage,
      homeLang: appLang,
      level: advancementLevel,
    }
    setRequest(JSON.stringify(request))

    // remember chosen advancement level of that language - so that user doesn't have to pick it each time manually
    let storedLevels: Record<string, level> = await getValue(
      ADVANCEMENT_LEVELS_STORAGE_KEY,
    )
    if (!storedLevels) storedLevels = {}
    storedLevels[topLanguage as string] = advancementLevel
    setValue(ADVANCEMENT_LEVELS_STORAGE_KEY, storedLevels)

    setShowStory(true) // show the StoryViewer component
  }

  return (
    <React.Fragment>
      <Snackbar isConnected={isConnected} shake={shake} />

      <TextArea
        description={description}
        setDescription={setDescription}
        characterLimit={characterLimit}
      />

      <LanguageButton
        topLanguage={topLanguage}
        languageItems={languageItems}
        onPress={() => bottomSheetRef.current?.open()}
      />

      <LevelButtons
        levels={levels}
        setAdvancementLevel={setAdvancementLevel}
        advancementLevel={advancementLevel}
      />

      <Button onPress={handleSubmit} text={translations[appLang].submit} />

      <LanguagePickerBottomSheet
        ref={bottomSheetRef}
        languages={languageItems}
        selectedLanguage={topLanguage}
        onSelect={setTopLanguage}
      />
    </React.Fragment>
  )
}
