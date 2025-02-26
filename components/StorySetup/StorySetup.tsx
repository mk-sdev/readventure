import NetInfo from '@react-native-community/netinfo'
import { useFocusEffect } from 'expo-router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Alert } from 'react-native'

import Snackbar from '@/components/Snackbar'
import { ADVANCEMENT_LEVELS_STORAGE_KEY } from '@/constants/StorageKeys'
import { translations } from '@/constants/Translations'
import { foreignLanguages, levels, request } from '@/constants/Types'
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
  const [dropDownValue, setDropDownValue] = useState<foreignLanguages | null>(
    null,
  )
  const { loadFavLangs, favLangs } = useStoredData()
  const [advancementLevel, setAdvancementLevel] = useState<levels>('A1')
  const levels: levels[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const

  const bottomSheetRef = useRef<{ open: () => void; close: () => void }>(null)
  const [dropDownItems, setDropDownItems] = useState<
    { label: string; value: foreignLanguages; isFav: boolean }[]
  >([])

  const characterLimit = 150

  const [shake, setShake] = useState(false)
  const [isConnected, setIsConnected] = useState(true)

  async function handleSubmit() {
    if (!isConnected) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }

    if (description.length > characterLimit) {
      Alert.alert(translations[appLang].submitAlert)
      return
    }
    const request: request = {
      description,
      lang: dropDownValue as foreignLanguages,
      homeLang: appLang,
      level: advancementLevel,
    }
    setRequest(JSON.stringify(request))
    
    let storedLevels: Record<string, levels> = await getValue(
      ADVANCEMENT_LEVELS_STORAGE_KEY,
    )
    if (!storedLevels) storedLevels = {}
    storedLevels[dropDownValue as string] = advancementLevel
    setValue(ADVANCEMENT_LEVELS_STORAGE_KEY, storedLevels)
    
    setShowStory(true) 
  }

  useEffect(() => {
    ;(async () => {
      let storedLevels: Record<string, levels> = await getValue(
        ADVANCEMENT_LEVELS_STORAGE_KEY,
      )
      setAdvancementLevel(storedLevels?.[dropDownValue as string] ?? 'A1')
    })()
  }, [dropDownValue])

  useFocusEffect(
    useCallback(() => {
      loadFavLangs()
    }, []),
  )

  useEffect(() => {
    let newItems = Object.entries(translations[appLang].foreignLanguages).map(
      ([key, value]) => ({
        label: value,
        value: key as foreignLanguages,
        isFav: favLangs && favLangs.includes(key as foreignLanguages),
      }),
    )

    newItems = [
      ...newItems.filter(item => favLangs.includes(item.value)),
      ...newItems.filter(item => !favLangs.includes(item.value)),
    ]
    setDropDownItems(newItems)
    setDropDownValue(newItems[0]?.value || dropDownValue)
  }, [favLangs, appLang])

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      //@ts-ignore
      setIsConnected(state.isConnected)
    })
    return () => unsubscribe()
  }, [])

  return (
    <React.Fragment>
      <Snackbar isConnected={isConnected} shake={shake} />

      <TextArea
        description={description}
        setDescription={setDescription}
        characterLimit={characterLimit}
      />

      <LanguageButton
        dropDownValue={dropDownValue}
        dropDownItems={dropDownItems}
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
        languages={dropDownItems}
        selectedLanguage={dropDownValue}
        onSelect={setDropDownValue}
      />
    </React.Fragment>
  )
}
