import { useState } from 'react'

import {
  FAV_LANGUAGES_STORAGE_KEY,
  HOME_LANGUAGE_STORAGE_KEY,
} from '@/constants/StorageKeys'
import { foreignLanguages, homeLanguages } from '@/constants/Types'

import { getValue } from './async-storage'

export default function useStoredData() {
  const [favLangs, setFavLangs] = useState<foreignLanguages[]>([])
  const [localAppLang, setLocalAppLang] = useState<homeLanguages>('en')

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

  return {
    loadFavLangs,
    favLangs,
    setFavLangs,
    localAppLang,
    setLocalAppLang,
    loadAppLang,
  }
}
