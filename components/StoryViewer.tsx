import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Alert, Button, Text } from 'react-native'

import { STORED_TEXTS_STORAGE_KEY } from '@/constants/StorageKeys'
import {
  foreignLanguages,
  homeLanguages,
  request,
  response,
  storedText,
} from '@/constants/Types'
import { getValue, setValue } from '@/utils/async-storage'

export default function StoryViewer({
  appLang,
  setShowStory,
  request,
}: {
  appLang: homeLanguages
  setShowStory: Function
  request: string
}) {
  const [req, setReq] = useState<request | null>(null)
  const [res, setRes] = useState<response | null>(null)
  const [shouldTranslate, setShouldTranslate] = useState(false)

  useEffect(() => {
    const req: request = JSON.parse(request)
    setReq(req)
    fetchData(req)
  }, [])

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

      const id = JSON.stringify(Math.random()) //TODO: change this line
      const text: string = response.data.text
      const translation: string = response.data.translation
      const lang: foreignLanguages = reqData.lang
      const transLang: homeLanguages = appLang
      const newText = { id, text, translation, lang, transLang }
      let lastTexts: storedText[] = await getValue(STORED_TEXTS_STORAGE_KEY)

      if (!lastTexts) lastTexts = [newText]
      else lastTexts.push(newText)
      if (lastTexts.length > 3) lastTexts.pop()

      await setValue(STORED_TEXTS_STORAGE_KEY, lastTexts)
    } catch (error) {
      console.error('Błąd podczas pobierania danych:', error)
    }
  }

  return (
    <React.Fragment>
      {shouldTranslate ? (
        <Text style={{ fontSize: 30 }}>{res?.translation}</Text>
      ) : (
        <Text>
          {res?.text.split('.').map((sentence, i) => (
            <Text
              style={{ fontSize: 30 }}
              onPress={() =>
                Alert.alert(
                  sentence + '.',
                  res?.translation.split('.')[i] + '.',
                )
              }
            >
              {sentence}.
            </Text>
          ))}
        </Text>
      )}

      <Button
        onPress={() => setShouldTranslate(prev => !prev)}
        title={shouldTranslate ? 'show original text' : 'translate'}
      ></Button>
      <Button onPress={() => setShowStory(false)} title="go back"></Button>
    </React.Fragment>
  )
}
