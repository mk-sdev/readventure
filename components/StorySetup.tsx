import { useFocusEffect } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'

import { ADVANCEMENT_LEVELS_STORAGE_KEY } from '@/constants/StorageKeys'
import { translations } from '@/constants/Translations'
import {
  foreignLanguages,
  homeLanguages,
  levels,
  request,
} from '@/constants/Types'
import { getValue, setValue } from '@/utils/async-storage'
import returnFlag from '@/utils/functions'
import useFavLangs from '@/utils/useFavLangs'

export default function StorySetup({
  appLang,
  setShowStory,
  setRequest,
}: {
  appLang: homeLanguages
  setShowStory: Function
  setRequest: Function
}) {
  const [description, setDescription] = useState('')

  const [openDropDown, setOpenDropDown] = useState(false)
  const [dropDownValue, setDropDownValue] = useState<foreignLanguages | null>(
    null,
  )
  const [dropDownItems, setDropDownItems] = useState<
    { label: string; value: string }[]
  >([])
  const { loadFavLangs, favLangs } = useFavLangs()

  const [advancementLevel, setAdvancementLevel] = useState<levels>('A1')
  const levels: levels[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const

  async function handleSubmit() {
    setShowStory(true)
    const request: request = {
      description,
      lang: dropDownValue as foreignLanguages,
      homeLang: appLang,
      level: advancementLevel,
    }
    setRequest(JSON.stringify(request))
    let storedLevels: {} = await getValue(ADVANCEMENT_LEVELS_STORAGE_KEY)
    if (!storedLevels) {
      storedLevels = {}
      storedLevels[dropDownValue] = advancementLevel
    } else storedLevels[dropDownValue] = advancementLevel
    setValue(ADVANCEMENT_LEVELS_STORAGE_KEY, storedLevels)
  }

  useEffect(() => {
    ;(async () => {
      let storedLevels: {} = await getValue(ADVANCEMENT_LEVELS_STORAGE_KEY)
      if (!storedLevels || !storedLevels[dropDownValue])
        setAdvancementLevel('A1')
      else setAdvancementLevel(storedLevels[dropDownValue])
    })()
  }, [dropDownValue])

  useFocusEffect(
    useCallback(() => {
      loadFavLangs()
    }, []),
  )

  useEffect(() => {
    // get available languages
    let newItems = Object.entries(translations[appLang].foreignLanguages).map(
      ([key, value]) => ({
        label: value,
        value: key as foreignLanguages,
      }),
    )

    // place favourite languages at the beginning
    newItems = [
      ...newItems.filter(item => favLangs.includes(item.value)),
      ...newItems.filter(item => !favLangs.includes(item.value)),
    ]
    setDropDownItems(newItems)
    setDropDownValue(dropDownValue || newItems[0].value)
  }, [favLangs, appLang])

  return (
    <React.Fragment>
      <Text style={styles.label}>
        {translations[appLang].textDescriptionLabel}
      </Text>
      <Text>{translations[appLang].textDescriptionInfo}</Text>
      <TextInput
        multiline={true}
        numberOfLines={10}
        placeholder={translations[appLang].textDescriptionPlaceholder}
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />
      {dropDownValue && returnFlag(dropDownValue)}
      <View style={{ width: '90%', marginTop: 30 }}>
        <Text style={styles.label}>{translations[appLang].languageLabel}</Text>
        <DropDownPicker
          open={openDropDown}
          value={dropDownValue}
          items={dropDownItems}
          setOpen={setOpenDropDown}
          setValue={setDropDownValue}
          setItems={setDropDownItems}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 10,
          width: '90%',
          marginTop: 10,
          justifyContent: 'center',
        }}
      >
        {levels.map(level => (
          <Pressable key={level} onPress={() => setAdvancementLevel(level)}>
            <Text
              style={[
                styles.level,
                {
                  backgroundColor: level === advancementLevel ? 'red' : '#ddd',
                },
              ]}
            >
              {level}
            </Text>
          </Pressable>
        ))}
      </View>
      <Button onPress={handleSubmit} title="submit"></Button>
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 200,
    textAlignVertical: 'top',
    backgroundColor: '#eee',
    width: '90%',
    padding: 10,
    borderRadius: 5,
  },
  level: {
    backgroundColor: 'red',
    fontSize: 30,
  },
})
function loadFavLangs() {
  throw new Error('Function not implemented.')
}
