import axios from 'axios'
import { useState } from 'react'

import { STORED_TEXTS_STORAGE_KEY } from '@/constants/StorageKeys'
import {
  foreignLanguages,
  homeLanguages,
  levels,
  request,
  response,
  storedText,
} from '@/constants/Types'

import { getValue, setValue } from './async-storage'

export default function useFetchText(appLang: homeLanguages) {
  const [response, setResponse] = useState<response | storedText | null>(null)
  const [error, setError] = useState(false)

  const fetchData = async (reqData: request) => {
    try {
      const response = await axios.post('http://localhost:8081/api/generate', {
        params: {
          description: reqData.description,
          lang: reqData.lang,
          homeLang: reqData.homeLang,
          level: reqData.level,
        },
      })
      console.log(response.data)
      setResponse(response.data)

      const id = JSON.stringify(Math.random())
      const text: string = response.data.text
      const translation: string = response.data.translation
      const lang: foreignLanguages = reqData.lang
      const level: levels = reqData.level
      const transLang: homeLanguages = appLang as homeLanguages
      const newText: storedText = {
        id,
        text,
        translation,
        lang,
        transLang,
        level,
      }
      let lastTexts: storedText[] = await getValue(STORED_TEXTS_STORAGE_KEY)

      if (!lastTexts) lastTexts = [newText]
      else lastTexts.unshift(newText)
      if (lastTexts.length > 10) lastTexts.pop()

      await setValue(STORED_TEXTS_STORAGE_KEY, lastTexts)
    } catch (error) {
      console.error('Error while fetching data:', error)
      setError(true)
    }
  }
  return { response, setResponse, fetchData, error }
}
