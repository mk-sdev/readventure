import { useState } from 'react'

import {
  COLOR_THEME_STORAGE_KEY,
  FAV_LANGUAGES_STORAGE_KEY,
  HOME_LANGUAGE_STORAGE_KEY,
} from '@/constants/StorageKeys'
import { foreignLanguages, homeLanguages } from '@/constants/Types'

import { getValue } from './async-storage'

export default function useStoredData() {
  const [favLangs, setFavLangs] = useState<foreignLanguages[]>([])
  const [localAppLang, setLocalAppLang] = useState<homeLanguages>('en')
  const [localTheme, setLocalTheme] = useState<'dark' | 'light'>('light')

  const loadFavLangs = async () => {
    const storedForeignLangs: foreignLanguages[] = await getValue(
      FAV_LANGUAGES_STORAGE_KEY,
    )
    setFavLangs(storedForeignLangs ? storedForeignLangs : [])
  }

  const loadAppLang = async () => {
    const storedAppLang = await getValue(HOME_LANGUAGE_STORAGE_KEY)
    if (storedAppLang) setLocalAppLang(storedAppLang)
    else setLocalAppLang('en')
  }

  const loadTheme = async () => {
    const storedTheme = await getValue(COLOR_THEME_STORAGE_KEY)
    if (storedTheme) setLocalTheme(storedTheme)
    else setLocalTheme('light')
  }

  return {
    loadFavLangs,
    favLangs,
    setFavLangs,
    localAppLang,
    setLocalAppLang,
    loadAppLang,
    loadTheme,
    localTheme,
    setLocalTheme,
  }
}
