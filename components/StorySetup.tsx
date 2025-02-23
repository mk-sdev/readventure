import { useFocusEffect } from 'expo-router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native'

import Text from '@/components/texts'
import Colors from '@/constants/Colors'
import { ADVANCEMENT_LEVELS_STORAGE_KEY } from '@/constants/StorageKeys'
import { translations } from '@/constants/Translations'
import {
  foreignLanguages,
  homeLanguages,
  levels,
  request,
} from '@/constants/Types'
import { getValue, setValue } from '@/utils/async-storage'
import { returnFlag, setButtonBg } from '@/utils/functions'
import useStoredData from '@/utils/useStoredData'

import { LanguagePickerBottomSheet } from './BottomSheets/LanguagePickerBottomSheet'
import Button from './Button'

export default function StorySetup({
  appLang,
  setRequest,
  theme,
}: {
  appLang: homeLanguages
  setRequest: React.Dispatch<React.SetStateAction<string>>
  theme: 'dark' | 'light'
}) {
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

  async function handleSubmit() {
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

  return (
    <React.Fragment>
      <Text type="title">{translations[appLang].textDescriptionLabel}</Text>
      <Text type="small">{translations[appLang].textDescriptionInfo}</Text>
      <TextInput
        multiline
        numberOfLines={10}
        placeholder={translations[appLang].textDescriptionPlaceholder}
        placeholderTextColor={Colors[theme].placeholder}
        style={[
          styles.input,
          {
            backgroundColor: Colors[theme].inputBg,
            borderColor:
              description.length > characterLimit
                ? 'tomato'
                : Colors[theme].inputBorder,
            color:
              description.length > characterLimit ? 'red' : Colors[theme].text,
          },
        ]}
        value={description}
        onChangeText={setDescription}
      />
      <Text
        style={{
          color:
            description.length > characterLimit ? 'red' : Colors[theme].text,
          opacity: 0.7,
          marginTop: 10,
          marginBottom: -10,
        }}
      >
        {`${description.length} / ${characterLimit}`}
      </Text>

      <Text type="title">{translations[appLang].languageLabel}</Text>
      <Pressable
        style={[
          styles.languageSelector,
          { backgroundColor: Colors[theme].button },
        ]}
        onPress={() => bottomSheetRef.current?.open()}
      >
        {dropDownValue && returnFlag(dropDownValue)}
        <Text
          style={[
            styles.languageText,
            {
              color:
                theme === 'light'
                  ? Colors[theme].background
                  : Colors[theme].text,
            },
          ]}
        >
          {dropDownItems.find(item => item.value === dropDownValue)?.label ||
            'Select Language'}
        </Text>
      </Pressable>

      <Text type="title">{translations[appLang].chooseLevel}</Text>
      <View style={styles.levelContainer}>
        {levels.map(level => (
          <Pressable
            key={level}
            onPress={() => setAdvancementLevel(level)}
            style={({ pressed }) => [
              styles.option,
              {
                elevation: level === advancementLevel ? 3 : 1,
                backgroundColor: setButtonBg(
                  level === advancementLevel,
                  pressed,
                  theme,
                ),
              },
            ]}
          >
            <Text style={styles.level}>{level}</Text>
          </Pressable>
        ))}
      </View>

      <Button onPress={handleSubmit} text={translations[appLang].submit} />
      {/* <Pressable
        onPress={handleSubmit}
        style={({ pressed }) => [
          {
            backgroundColor: Colors[theme].button,
            margin: 20,
            borderRadius: 10,
            elevation: pressed ? 0 : 2,
            width: '80%',
            maxWidth: 300,
            height: 50,
            justifyContent: 'center',
          },
        ]}
      >
        <Text
          style={{
            fontSize: 20,
            textAlign: 'center',
            fontWeight: 'bold',
            opacity: 0.95,
            color:
              theme === 'light' ? Colors[theme].background : Colors[theme].text,
          }}
        >
          {translations[appLang].submit}
        </Text>
      </Pressable> */}

      <LanguagePickerBottomSheet
        ref={bottomSheetRef}
        languages={dropDownItems}
        selectedLanguage={dropDownValue}
        onSelect={setDropDownValue}
        theme={theme}
      />
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  input: {
    height: 125,
    textAlignVertical: 'top',
    // backgroundColor: '#eee',
    borderWidth: 1,
    width: '90%',
    maxWidth: 500,
    padding: 10,
    borderRadius: 10,
    fontSize: 18,
  },
  languageSelector: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 1,
  },
  languageText: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
    opacity: 0.95,
  },
  levelContainer: {
    flexDirection: 'row',
    gap: 10,
    width: '90%',
    marginTop: 10,
    justifyContent: 'center',
  },
  option: {
    // padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    // backgroundColor: '#ddd',
    width: 40,
    height: 40,
    alignItems: 'center',
    textAlign: 'center',
    // flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  level: {
    fontSize: 20,
    fontWeight: 'bold',
    opacity: 0.9,
  },
})
