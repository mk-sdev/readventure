import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'
import { Pressable, StyleSheet } from 'react-native'

import { Text, View } from '@/components/Themed'

const translations = {
  en: {
    chooseHomeLanguage: 'Choose your home language',
    homeLanguageInfo:
      "If you don't see your home language, choose the one you're most familiar with",
    chooseForeignLanguage:
      'Which of these languages are you most interested in?',
    foreignLanguages: {
      German: 'German',
      Italian: 'Italian',
      Polish: 'Polish',
      Spanish: 'Spanish',
    },
  },
  pl: {
    chooseHomeLanguage: 'Wybierz swój język ojczysty',
    homeLanguageInfo:
      'Jeśli nie widzisz swojego języka ojczystego, wybierz ten, który znasz najlepiej',
    chooseForeignLanguage: 'Które z tych języków Cię najbardziej interesują?',
    foreignLanguages: {
      English: 'Angielski',
      Spanish: 'Hiszpański',
      German: 'Niemiecki',
      Italian: 'Włoski',
    },
  },
}

// 📌 set English as default
const DEFAULT_HOME_LANGUAGE = 'en'
const LANGUAGE_STORAGE_KEY = 'appLanguage'

const homeLanguages = ['English', 'Polish'] as const

function Option({ lang, onPress }: { lang: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.option, pressed && styles.pressed]}
    >
      <Text>{lang}</Text>
    </Pressable>
  )
}

export default function SettingsScreen() {
  const [selectedHomeLanguage, setSelectedHomeLanguage] = useState<'en' | 'pl'>(
    DEFAULT_HOME_LANGUAGE,
  )

  useEffect(() => {
    const loadLanguages = async () => {
      const storedHomeLang = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
      if (storedHomeLang) setSelectedHomeLanguage(storedHomeLang as 'en' | 'pl')
    }
    loadLanguages()
  }, [])

  // 📌 Zmiana języka i zapisanie do AsyncStorage
  const handleSelectHomeLanguage = (lang: string) => {
    const newLang = lang === 'Polish' ? 'pl' : 'en'
    setSelectedHomeLanguage(newLang)
    AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLang)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {translations[selectedHomeLanguage].chooseHomeLanguage}
      </Text>
      <Text>{translations[selectedHomeLanguage].homeLanguageInfo}</Text>
      {homeLanguages.map(lang => (
        <Option
          key={lang}
          lang={lang}
          onPress={() => handleSelectHomeLanguage(lang)}
        />
      ))}

      <Text style={styles.title}>
        {translations[selectedHomeLanguage].chooseForeignLanguage}
      </Text>
      {selectedHomeLanguage === 'pl' &&
        Object.keys(translations.pl.foreignLanguages).map(key => {
          const languageKey =
            key as keyof typeof translations.pl.foreignLanguages
          return (
            <Option
              key={languageKey}
              lang={
                translations[selectedHomeLanguage].foreignLanguages[languageKey]
              }
              onPress={() => console.log(`Selected ${languageKey}`)}
            />
          )
        })}

      {selectedHomeLanguage === 'en' &&
        Object.keys(translations.en.foreignLanguages).map(key => {
          const languageKey =
            key as keyof typeof translations.en.foreignLanguages
          return (
            <Option
              key={languageKey}
              lang={
                translations[selectedHomeLanguage].foreignLanguages[languageKey]
              }
              onPress={() => console.log(`Selected ${languageKey}`)}
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
