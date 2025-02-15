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
  }, [])
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

const styles = StyleSheet.create({})
function loadFavLangs() {
  throw new Error('Function not implemented.')
}
