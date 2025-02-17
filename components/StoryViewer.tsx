import React, { useEffect, useRef, useState } from 'react';
import { Button, Text } from 'react-native';

import { STORED_TEXTS_STORAGE_KEY } from '@/constants/StorageKeys';
import { homeLanguages, request, storedText } from '@/constants/Types';
import { getValue } from '@/utils/async-storage';
import useFetchText from '@/utils/useFetchText';
import { Sentence } from './BottomSheets/BottomSheet';

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

  const bottomSheetRef = useRef<{ open: () => void; close: () => void }>(null);
  const [sentence, setSentence] = useState("")

  function handleSentencePress(sentence:string){
    //Alert.alert(sentence)
    bottomSheetRef.current?.open()
    setSentence(sentence)
  }

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
                  onPress={()=>handleSentencePress(res?.translation.split('.')[i])                  }
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
      <Sentence ref={bottomSheetRef} sentence={sentence}  />      
    </React.Fragment>
  )
}


