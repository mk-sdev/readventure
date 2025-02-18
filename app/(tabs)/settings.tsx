import { useEffect } from 'react'
import { Pressable, ScrollView, StyleSheet, Switch } from 'react-native'

import { Text, View } from '@/components/Themed'
import Colors from '@/constants/Colors'
import {
  COLOR_THEME_STORAGE_KEY,
  FAV_LANGUAGES_STORAGE_KEY,
  HOME_LANGUAGE_STORAGE_KEY,
} from '@/constants/StorageKeys'
import { translations } from '@/constants/Translations'
import { foreignLanguages, homeLanguages } from '@/constants/Types'
import { getValue, setValue } from '@/utils/async-storage'
import { returnFlag, setButtonBg } from '@/utils/functions'
import useStoredData from '@/utils/useStoredData'
import useStore from '@/utils/zustand'

function HomeOption({
  lang,
  onPress,
  isSelected,
  theme,
}: {
  lang: homeLanguages
  onPress: () => void
  isSelected: boolean
  theme: 'light' | 'dark'
}) {
  const text = lang === 'pl' ? 'Polski' : 'English'
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        {
          elevation: isSelected ? 1 : 0,
          backgroundColor: setButtonBg(isSelected, pressed, theme),
        },
      ]}
    >
      <View style={styles.optionView}>
        {returnFlag(lang)}
        <Text style={{ fontWeight: 'bold' }}>{text}</Text>
      </View>
    </Pressable>
  )
}

function ForeignOption({
  lang,
  onPress,
  selectedForeignLanguages,
  text,
  theme,
}: {
  lang: foreignLanguages
  onPress: () => void
  selectedForeignLanguages: foreignLanguages[]
  text: string
  theme: 'light' | 'dark'
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        {
          elevation: selectedForeignLanguages.includes(lang) ? 1 : 0,
          backgroundColor: setButtonBg(
            selectedForeignLanguages.includes(lang),
            pressed,
            theme,
          ),
        },
      ]}
    >
      <View style={styles.optionView}>
        {returnFlag(lang)}
        <Text style={{ fontWeight: 'bold' }}>{text}</Text>
      </View>
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
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: Colors[theme].background },
      ]}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent',
          gap: 20,
        }}
      >
        <Text style={[styles.title, { width: 'auto' }]}>
          {translations[appLang].toggleTheme}
        </Text>
        <Switch
          value={theme === 'light'}
          onValueChange={() =>
            setLocalTheme(localTheme === 'light' ? 'dark' : 'light')
          }
          trackColor={{ false: '#767577', true: Colors[theme].buttonSecondary }}
          thumbColor={theme === 'light' ? Colors[theme].button : '#f4f3f4'}
          style={{
            transform: [{ scaleX: 1.35 }, { scaleY: 1.35 }, { translateY: 4 }],
          }}
        />
      </View>

      <Text style={styles.title}>
        {translations[appLang].chooseHomeLanguage}
      </Text>
      <Text style={[styles.smallText, { color: Colors[theme].text }]}>
        {translations[appLang].homeLanguageInfo}
      </Text>

      {(['en', 'pl'] as homeLanguages[]).map(lang => (
        <HomeOption
          key={lang}
          lang={lang}
          onPress={() => setLocalAppLang(lang)}
          isSelected={appLang === lang}
          theme={theme}
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
            theme={theme}
          />
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    width: '90%',
    maxWidth: 300,
    textAlign: 'center',
  },
  smallText: {
    width: '95%',
    maxWidth: 300,
    fontSize: 15,
    marginBottom: 10,
    marginTop: -5,
    opacity: 0.7,
    lineHeight: 20,
    textAlign: 'center',
  },
  option: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    // backgroundColor: '#ddd',
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  optionView: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    borderRadius: 5,
    width: 110,
  },
})
