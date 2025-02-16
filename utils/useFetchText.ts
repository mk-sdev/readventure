import axios from 'axios'
import { useState } from 'react'

import { STORED_TEXTS_STORAGE_KEY } from '@/constants/StorageKeys'
import {
  foreignLanguages,
  homeLanguages,
  request,
  response,
  storedText,
} from '@/constants/Types'

import { getValue, setValue } from './async-storage'

export default function useFetchText(appLang: homeLanguages) {
  const [res, setRes] = useState<response | storedText | null>(null)

  const fetchData = async (reqData: request) => {
    try {
      const response = await axios.post('http://localhost:8082/api/hello', {
        params: {
          description: reqData.description,
          lang: reqData.lang,
          homeLang: reqData.homeLang,
          level: reqData.level,
        },
      })
      console.log(response.data)
      setRes(response.data)

      const id = JSON.stringify(Math.random()) 
      const text: string = response.data.text
      const translation: string = response.data.translation
      const lang: foreignLanguages = reqData.lang
      const transLang: homeLanguages = appLang as homeLanguages
      const newText = { id, text, translation, lang, transLang }
      let lastTexts: storedText[] = await getValue(STORED_TEXTS_STORAGE_KEY)

      if (!lastTexts) lastTexts = [newText]
      else lastTexts.unshift(newText)
      if (lastTexts.length > 3) lastTexts.pop()

      await setValue(STORED_TEXTS_STORAGE_KEY, lastTexts)
    } catch (error) {
      console.error('Błąd podczas pobierania danych:', error)
    }
  }
  return { res, setRes, fetchData }
}
