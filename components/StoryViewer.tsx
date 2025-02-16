import React, { useEffect, useState } from 'react'
import { Alert, Button, Text, TextInput } from 'react-native'

import { STORED_TEXTS_STORAGE_KEY } from '@/constants/StorageKeys'
import { homeLanguages, request, storedText } from '@/constants/Types'
import { getValue } from '@/utils/async-storage'
import useFetchText from '@/utils/useFetchText'

export default function StoryViewer({
  appLang, // index.tsx only
  setShowStory,
  request, // index.tsx only
  index, // last-texts.tsx only
}: {
  appLang?: homeLanguages
  setShowStory: React.Dispatch<React.SetStateAction<boolean>>
  request?: string
  index?: number
}) {
  const [shouldTranslate, setShouldTranslate] = useState(false)
  const { res, setRes, fetchData } = useFetchText(appLang as homeLanguages)
  useEffect(() => {
    // if inside index.tsx
    if (request) {
      const req: request = JSON.parse(request as string)
      fetchData(req)
      return
    }

    // if inside last-texts.tsx
    ;(async () => {
      const lastTexts: storedText[] = await getValue(STORED_TEXTS_STORAGE_KEY)
      setRes(lastTexts[index as number])
    })()
    return
  }, [])

  return (
    <React.Fragment>
      {res || index !== undefined ? (
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
        </React.Fragment>
      ) : (
        <Text>Your read-venture is being generated</Text>
      )}
      <Button onPress={() => setShowStory(false)} title="go back"></Button>
    </React.Fragment>
  )
}
