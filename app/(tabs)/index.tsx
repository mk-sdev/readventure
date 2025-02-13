import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { StyleSheet, TextInput } from 'react-native'
import { Image } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'

import { Text, View } from '@/components/Themed'
import {
  DEFAULT_HOME_LANGUAGE,
  HOME_LANGUAGE_STORAGE_KEY,
  INTEREST_LANGUAGES_STORAGE_KEY,
} from '@/constants/StoregeKeys'
import { translations } from '@/constants/translations'
import { foreignLanguages, homeLanguages } from '@/constants/Types'
import { getValue } from '@/utils/async-storage'
import returnFlag from '@/utils/functions'

export default function HomeScreen() {
  const [selectedHomeLanguage, setSelectedHomeLanguage] =
    useState<homeLanguages>(DEFAULT_HOME_LANGUAGE)
  const [selectedForeignLanguages, setSelectedForeignLanguages] = useState<
    foreignLanguages[]
  >([])

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<foreignLanguages | null>(null)
  const [items, setItems] = useState<{ label: string; value: string }[]>([])

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
          INTEREST_LANGUAGES_STORAGE_KEY,
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
    setItems(newItems)
    setValue(newItems[0].value)
  }, [selectedForeignLanguages, selectedHomeLanguage])

  return (
    <View style={styles.container}>
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
      />
      {value && returnFlag(value)}
      <View style={{ width: '90%', marginTop: 30 }}>
        <Text style={styles.label}>
          {translations[selectedHomeLanguage].languageLabel}
        </Text>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
})
