import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'
import { Pressable, StyleSheet } from 'react-native'

import { Text, View } from '@/components/Themed'
import { clearAsyncStorage, getValue, setValue } from '@/utils/async-storage'

const translations = {
  en: {
    chooseHomeLanguage: 'Choose your home language',
    homeLanguageInfo:
      "If you don't see your home language, choose the one you're most familiar with",
    chooseForeignLanguage:
      'Which of these languages are you most interested in?',
    foreignLanguages: {
      de: 'German',
      it: 'Italian',
      pl: 'Polish',
      es: 'Spanish',
    },
  },
  pl: {
    chooseHomeLanguage: 'Wybierz swój język ojczysty',
    homeLanguageInfo:
      'Jeśli nie widzisz swojego języka ojczystego, wybierz ten, który znasz najlepiej',
    chooseForeignLanguage: 'Które z tych języków Cię najbardziej interesują?',
    foreignLanguages: {
      en: 'Angielski',
      es: 'Hiszpański',
      de: 'Niemiecki',
      it: 'Włoski',
    },
  },
}

const DEFAULT_HOME_LANGUAGE = 'en'
const LANGUAGE_STORAGE_KEY = 'appLanguage'

const homeLanguages = ['en', 'pl'] as const

type homeLanguages = 'en' | 'pl'
type foreignLanguages = 'en' | 'pl' | 'es' | 'it' | 'de'

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
        LANGUAGE_STORAGE_KEY,
      )) as homeLanguages
      setSelectedHomeLanguage(storedHomeLang ? storedHomeLang : 'en')

      const storedForeignLangs: foreignLanguages[] =
        await getValue('interestLanguages')
      setSelectedForeignLanguages(storedForeignLangs ? storedForeignLangs : [])
    }
    loadLanguages()
  }, [])

  // Zmiana języka ojczystego
  const handleSelectHomeLanguage = (lang: homeLanguages) => {
    setSelectedHomeLanguage(lang)
    AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
  }

  // Zmiana języków obcych
  async function handleSelectForeignLanguages(lang: foreignLanguages) {
    let interestLanguages = await getValue('interestLanguages')
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
      {homeLanguages.map(lang => (
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
      {selectedHomeLanguage === 'pl' &&
        Object.keys(translations.pl.foreignLanguages).map(key => {
          const languageKey =
            key as keyof typeof translations.pl.foreignLanguages
          let lang =
            translations[selectedHomeLanguage].foreignLanguages[languageKey]
          return (
            <ForeignOption
              key={languageKey}
              selectedForeignLanguages={selectedForeignLanguages}
              lang={languageKey}
              text={lang}
              onPress={() => handleSelectForeignLanguages(languageKey)}
            />
          )
        })}

      {selectedHomeLanguage === 'en' &&
        Object.keys(translations.en.foreignLanguages).map(key => {
          const languageKey =
            key as keyof typeof translations.en.foreignLanguages
          let lang =
            translations[selectedHomeLanguage].foreignLanguages[languageKey]
          return (
            <ForeignOption
              key={languageKey}
              selectedForeignLanguages={selectedForeignLanguages}
              lang={languageKey}
              text={lang}
              onPress={() => handleSelectForeignLanguages(languageKey)}
            />
          )
        })}
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
