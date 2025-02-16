import { useEffect } from 'react'
import { Pressable, StyleSheet } from 'react-native'

import { Text, View } from '@/components/Themed'
import {
  FAV_LANGUAGES_STORAGE_KEY,
  HOME_LANGUAGE_STORAGE_KEY,
} from '@/constants/StorageKeys'
import { translations } from '@/constants/Translations'
import { foreignLanguages, homeLanguages } from '@/constants/Types'
import { getValue, setValue } from '@/utils/async-storage'
import returnFlag from '@/utils/functions'
import useFavLangs from '@/utils/useFavLangs'
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
  const appLang = useStore(state => state.appLang)
  const setAppLang = useStore(state => state.setAppLang)
  const { loadFavLangs, favLangs, setFavLangs } = useFavLangs()

  useEffect(() => {
    loadFavLangs()
  }, [])

  useEffect(() => {
    const saveAppLang = async () => {
      await setValue(HOME_LANGUAGE_STORAGE_KEY, appLang)
    }
    saveAppLang()
  }, [appLang])

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
      <Text style={styles.title}>
        {translations[appLang].chooseHomeLanguage}
      </Text>
      <Text>{translations[appLang].homeLanguageInfo}</Text>

      {(['en', 'pl'] as homeLanguages[]).map(lang => (
        <HomeOption
          key={lang}
          lang={lang}
          onPress={() => setAppLang(lang)}
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
