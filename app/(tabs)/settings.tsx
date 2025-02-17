import { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Switch } from 'react-native'

import { Text, View } from '@/components/Themed'
import {
  COLOR_THEME_STORAGE_KEY,
  FAV_LANGUAGES_STORAGE_KEY,
  HOME_LANGUAGE_STORAGE_KEY,
} from '@/constants/StorageKeys'
import { translations } from '@/constants/Translations'
import { foreignLanguages, homeLanguages } from '@/constants/Types'
import { getValue, setValue } from '@/utils/async-storage'
import returnFlag from '@/utils/functions'
import useStoredData from '@/utils/useStoredData'
import useStore from '@/utils/zustand'

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
      {returnFlag(lang)}
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
      {returnFlag(lang)}
      <Text>{text}</Text>
    </Pressable>
  )
}

export default function SettingsScreen() {
  const setAppLang = useStore(state => state.setAppLang)
  const setTheme = useStore(state => state.setTheme)
  const appLang = useStore(state => state.appLang)
  const theme = useStore(state => state.theme)

  const {
    loadFavLangs,
    favLangs,
    setFavLangs,
    // for some fucking reason I must use helper variables and can't use global appLang directly because otherwise after refresh the retrieved from async storage data is not correct
    localAppLang, // appLang that is a helper variable used only in this file
    setLocalAppLang,
    loadAppLang,
    // the same case as above
    loadTheme,
    localTheme,
    setLocalTheme,
  } = useStoredData()

  useEffect(() => {
    loadFavLangs()
    loadAppLang()
    loadTheme()
  }, [])

  useEffect(() => {
    // updating global appLang and storing it in the memory
    const saveAppLang = async () => {
      await setValue(HOME_LANGUAGE_STORAGE_KEY, localAppLang)
    }
    saveAppLang()
    setAppLang(localAppLang)
  }, [localAppLang])

  useEffect(() => {
    // updating global theme and storing it in the memory
    const saveTheme = async () => {
      await setValue(COLOR_THEME_STORAGE_KEY, localTheme)
    }
    saveTheme()
    setTheme(localTheme)
  }, [localTheme])

  async function handleSelectForeignLanguages(lang: foreignLanguages) {
    let interestLanguages = await getValue(FAV_LANGUAGES_STORAGE_KEY)
    interestLanguages ||= []
    if (interestLanguages.includes(lang)) {
      interestLanguages = interestLanguages.filter(
        (item: foreignLanguages) => item !== lang,
      )
    } else {
      interestLanguages.push(lang)
    }
    setFavLangs(interestLanguages)
    setValue(FAV_LANGUAGES_STORAGE_KEY, interestLanguages)
  }

  return (
    <View style={styles.container}>
      <Switch
        value={theme === 'light'}
        onValueChange={() =>
          setLocalTheme(localTheme === 'light' ? 'dark' : 'light')
        }
      />
      <Text style={styles.title}>
        {translations[appLang].chooseHomeLanguage}
      </Text>
      <Text>{translations[appLang].homeLanguageInfo}</Text>

      {(['en', 'pl'] as homeLanguages[]).map(lang => (
        <HomeOption
          key={lang}
          lang={lang}
          onPress={() => setLocalAppLang(lang)}
          isSelected={appLang === lang}
        />
      ))}

      <Text style={styles.title}>
        {translations[appLang].chooseForeignLanguage}
      </Text>

      {Object.keys(translations[appLang].foreignLanguages).map(key => {
        const langCode = key as foreignLanguages
        let langText: string =
          // @ts-ignore
          translations[appLang].foreignLanguages[langCode]
        return (
          <ForeignOption
            key={langCode}
            selectedForeignLanguages={favLangs}
            lang={langCode}
            text={langText}
            onPress={() => handleSelectForeignLanguages(langCode)}
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
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  pressed: {
    backgroundColor: '#bbb',
  },
})
