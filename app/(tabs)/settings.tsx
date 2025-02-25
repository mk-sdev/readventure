import { useEffect } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import Button from '@/components/Button'
import ForeignLanguages from '@/components/settings/ForeignLanguages'
import HomeLanguages from '@/components/settings/HomeLanguages'
import ToggleTheme from '@/components/settings/ToggleTheme'
import Colors from '@/constants/Colors'
import {
  COLOR_THEME_STORAGE_KEY,
  HOME_LANGUAGE_STORAGE_KEY,
} from '@/constants/StorageKeys'
import { clearAsyncStorage, setValue } from '@/utils/async-storage'
import useStoredData from '@/utils/useStoredData'
import useStore from '@/utils/zustand'

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

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: Colors[theme].background },
      ]}
    >
      <ToggleTheme localTheme={localTheme} setLocalTheme={setLocalTheme} />

      <HomeLanguages setLocalAppLang={setLocalAppLang} />

      <ForeignLanguages favLangs={favLangs} setFavLangs={setFavLangs} />

      {__DEV__ && (
        <Button
          text="clear async storage"
          type="primary"
          onPress={() => {
            ;(async () => {
              await clearAsyncStorage()
            })()
          }}
        ></Button>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    minHeight: '100%',
  },
})
