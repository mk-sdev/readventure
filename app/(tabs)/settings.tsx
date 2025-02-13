import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'
import { Pressable, StyleSheet } from 'react-native'

import { Text, View } from '@/components/Themed'
import {
  DEFAULT_HOME_LANGUAGE,
  HOME_LANGUAGE_STORAGE_KEY,
  INTEREST_LANGUAGES_STORAGE_KEY,
} from '@/constants/StoregeKeys'
import { translations } from '@/constants/translations'
import { foreignLanguages, homeLanguages } from '@/constants/Types'
import { clearAsyncStorage, getValue, setValue } from '@/utils/async-storage'

//const homeLanguages = ['en', 'pl'] as const

function HomeOption({
  lang,
  onPress,
  isSelected,
}: {
  lang: homeLanguages
  onPress: () => void
  isSelected: boolean
}) {
  const text = lang === 'pl' ? 'Polski' : 'English'
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        {
          backgroundColor: isSelected ? 'red' : '#ddd',
        },
        pressed && styles.pressed,
      ]}
    >
      <Text>{text}</Text>
    </Pressable>
  )
}

function ForeignOption({
  lang,
  onPress,
  selectedForeignLanguages,
  text,
}: {
  lang: foreignLanguages
  onPress: () => void
  selectedForeignLanguages: foreignLanguages[]
  text: string
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        {
          backgroundColor: selectedForeignLanguages.includes(lang)
            ? 'red'
            : '#ddd',
        },
        pressed && styles.pressed,
      ]}
    >
      <Text>{text}</Text>
    </Pressable>
  )
}

export default function SettingsScreen() {
  const [selectedHomeLanguage, setSelectedHomeLanguage] =
    useState<homeLanguages>(DEFAULT_HOME_LANGUAGE)
  const [selectedForeignLanguages, setSelectedForeignLanguages] = useState<
    foreignLanguages[]
  >([])

  useEffect(() => {
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
      setSelectedForeignLanguages(storedForeignLangs ? storedForeignLangs : [])
    }
    loadLanguages()
  }, [])

  // Zmiana języka ojczystego
  const handleSelectHomeLanguage = (lang: homeLanguages) => {
    setSelectedHomeLanguage(lang)
    AsyncStorage.setItem(HOME_LANGUAGE_STORAGE_KEY, lang)
  }

  // Zmiana języków obcych
  async function handleSelectForeignLanguages(lang: foreignLanguages) {
    let interestLanguages = await getValue(INTEREST_LANGUAGES_STORAGE_KEY)
    interestLanguages ||= []
    if (interestLanguages.includes(lang)) {
      interestLanguages = interestLanguages.filter(
        (item: foreignLanguages) => item !== lang,
      )
    } else {
      interestLanguages.push(lang)
    }
    setSelectedForeignLanguages(interestLanguages)
    setValue('interestLanguages', interestLanguages)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {translations[selectedHomeLanguage].chooseHomeLanguage}
      </Text>
      <Text>{translations[selectedHomeLanguage].homeLanguageInfo}</Text>

      {(['en', 'pl'] as homeLanguages[]).map(lang => (
        <HomeOption
          key={lang}
          lang={lang}
          onPress={() => handleSelectHomeLanguage(lang)}
          isSelected={selectedHomeLanguage === lang}
        />
      ))}

      <Text style={styles.title}>
        {translations[selectedHomeLanguage].chooseForeignLanguage}
      </Text>

      {Object.keys(translations[selectedHomeLanguage].foreignLanguages).map(
        key => {
          const langCode = key as foreignLanguages
          let langText: string =
            // @ts-ignore
            translations[selectedHomeLanguage].foreignLanguages[langCode]
          return (
            <ForeignOption
              key={langCode}
              selectedForeignLanguages={selectedForeignLanguages}
              lang={langCode}
              text={langText}
              onPress={() => handleSelectForeignLanguages(langCode)}
            />
          )
        },
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  option: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: '#ddd',
    width: '80%',
    alignItems: 'center',
  },
  pressed: {
    backgroundColor: '#bbb',
  },
})
