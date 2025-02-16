import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Alert, Button, StyleSheet, Text } from 'react-native'

import { request, response } from '@/constants/Types'
import { homeLanguages } from '@/constants/Types'

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
    const text =
      'Hello World. This is a test text. Its purpose is to test something.'
    const translation =
      'Witaj Świecie. To jest tekst testowy. Jego celem jest przetestować coś.'
    setRes({ text, translation })
  }, [])

  const fetchData = async (reqData: request) => {
    try {
      const response = await axios.get('http://localhost:8080/api/data', {
        params: {
          lang: reqData.lang,
          homeLang: reqData.homeLang,
          level: reqData.level,
        },
      })
      console.log(response.data)
    } catch (error) {
      console.error('Błąd podczas pobierania danych:', error)
    }
  }

  return (
    <React.Fragment>
      {/* <Text>opis: {req?.description}</Text>
      <Text>język docelowy: {req?.lang}</Text>
      <Text>język ojczysty: {req?.homeLang}</Text>
      <Text>poziom zaawansowania: {req?.level}</Text> */}

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
