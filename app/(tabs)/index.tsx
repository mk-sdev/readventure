import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { Button, ScrollView, StyleSheet, TextInput } from 'react-native'
import { Pressable } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'

import { Text, View } from '@/components/Themed'
import {
  ADVANCEMENT_LEVELS_STORAGE_KEY,
  DEFAULT_HOME_LANGUAGE,
  FAV_LANGUAGES_STORAGE_KEY,
  HOME_LANGUAGE_STORAGE_KEY,
} from '@/constants/StorageKeys'
import { translations } from '@/constants/Translations'
import { foreignLanguages, homeLanguages } from '@/constants/Types'
import { getValue, setValue } from '@/utils/async-storage'
import returnFlag from '@/utils/functions'

export default function HomeScreen() {
  const [selectedHomeLanguage, setSelectedHomeLanguage] =
    useState<homeLanguages>(DEFAULT_HOME_LANGUAGE)
  const [selectedForeignLanguages, setSelectedForeignLanguages] = useState<
    foreignLanguages[]
  >([])

  const [openDropDown, setOpenDropDown] = useState(false)
  const [dropDownValue, setDropDownValue] = useState<foreignLanguages | null>(
    null,
  )
  const [dropDownItems, setDropDownItems] = useState<
    { label: string; value: string }[]
  >([])

  const [advancementLevel, setAdvancementLevel] = useState('A1')
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const

  async function handleSubmit() {
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
      const loadLanguages = async () => {
        const storedHomeLang = (await AsyncStorage.getItem(
          HOME_LANGUAGE_STORAGE_KEY,
        )) as homeLanguages
        setSelectedHomeLanguage(
          storedHomeLang ? storedHomeLang : DEFAULT_HOME_LANGUAGE,
        )

        const storedForeignLangs: foreignLanguages[] = await getValue(
          FAV_LANGUAGES_STORAGE_KEY,
        )
        setSelectedForeignLanguages(
          storedForeignLangs ? storedForeignLangs : [],
        )
      }
      loadLanguages()
    }, []),
  )

  useEffect(() => {
    // get available languages
    let newItems = Object.entries(
      translations[selectedHomeLanguage].foreignLanguages,
    ).map(([key, value]) => ({
      label: value,
      value: key as foreignLanguages,
    }))

    // place favourite languages at the beginning
    newItems = [
      ...newItems.filter(item => selectedForeignLanguages.includes(item.value)),
      ...newItems.filter(
        item => !selectedForeignLanguages.includes(item.value),
      ),
    ]
    setDropDownItems(newItems)
    setDropDownValue(dropDownValue || newItems[0].value)
  }, [selectedForeignLanguages, selectedHomeLanguage])

  const [text, setText] = useState('')

  useEffect(() => {
    console.log(text)
  }, [text])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>
        {translations[selectedHomeLanguage].textDescriptionLabel}
      </Text>
      <TextInput
        multiline={true}
        numberOfLines={10}
        placeholder={
          translations[selectedHomeLanguage].textDescriptionPlaceholder
        }
        style={styles.input}
        value={text}
        onChangeText={setText}
      />
      {dropDownValue && returnFlag(dropDownValue)}
      <View style={{ width: '90%', marginTop: 30 }}>
        <Text style={styles.label}>
          {translations[selectedHomeLanguage].languageLabel}
        </Text>
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
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
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
