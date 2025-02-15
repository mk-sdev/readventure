import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text } from 'react-native'

import { request } from '@/constants/Types'
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

  useEffect(() => {
    const req: request = JSON.parse(request)
    setReq(req)
    fetchData(req)
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
      <Button onPress={() => setShowStory(false)} title="go back"></Button>
      <Text>opis: {req?.description}</Text>
      <Text>język docelowy: {req?.lang}</Text>
      <Text>język ojczysty: {req?.homeLang}</Text>
      <Text>poziom zaawansowania: {req?.level}</Text>
    </React.Fragment>
  )
}

