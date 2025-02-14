import { useState } from 'react'

import { FAV_LANGUAGES_STORAGE_KEY } from '@/constants/StorageKeys'
import { foreignLanguages } from '@/constants/Types'

import { getValue } from './async-storage'

export default function useFavLangs() {
  const [favLangs, setFavLangs] = useState<foreignLanguages[]>([])

  const loadFavLangs = async () => {
    const storedForeignLangs: foreignLanguages[] = await getValue(
      FAV_LANGUAGES_STORAGE_KEY,
    )
    setFavLangs(storedForeignLangs ? storedForeignLangs : [])
  }

  return {
    loadFavLangs,
    favLangs,
    setFavLangs,
  }
}
