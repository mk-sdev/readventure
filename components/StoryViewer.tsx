import React, { useEffect, useRef, useState } from 'react';
import { Button, Text } from 'react-native';

import { STORED_TEXTS_STORAGE_KEY } from '@/constants/StorageKeys';
import { homeLanguages, request, storedText } from '@/constants/Types';
import { getValue } from '@/utils/async-storage';
import useFetchText from '@/utils/useFetchText';
import { Sentence } from './BottomSheets/BottomSheet';

export default function StoryViewer({
  appLang,
  setShowStory,
  request,
  index,
}: {
  appLang?: homeLanguages;
  setShowStory: React.Dispatch<React.SetStateAction<boolean>>;
  request?: string;
  index?: number;
}) {
  const [shouldTranslate, setShouldTranslate] = useState(false);
  const { res, setRes, fetchData } = useFetchText(appLang as homeLanguages);

  useEffect(() => {
    if (request) {
      const req: request = JSON.parse(request as string);
      fetchData(req);
      return;
    }

    (async () => {
      const lastTexts: storedText[] = await getValue(STORED_TEXTS_STORAGE_KEY);
      setRes(lastTexts[index as number]);
    })();
  }, []);

  const bottomSheetRef = useRef<{ open: () => void; close: () => void }>(null);
  const [sentence, setSentence] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // index of the selected sentence

  function handleSentencePress(sentence: string, i: number) {
    setSentence(sentence);
    setSelectedIndex(i); 
    bottomSheetRef.current?.open();
  }

  function handleClose() {
    setSelectedIndex(null); 
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
                  key={i}
                  style={{
                    fontSize: 30,
                    backgroundColor: selectedIndex === i ? 'green' : 'transparent', 
                  }}
                  onPress={() => handleSentencePress(res?.translation.split('.')[i], i)}
                >
                  {sentence}.
                </Text>
              ))}
            </Text>
          )}
          <Button
            onPress={() => setShouldTranslate(prev => !prev)}
            title={shouldTranslate ? 'show original text' : 'translate'}
          />
        </React.Fragment>
      ) : (
        <Text>Your read-venture is being generated</Text>
      )}
      <Button onPress={() => setShowStory(false)} title="go back" />
      
      <Sentence ref={bottomSheetRef} sentence={sentence} onClose={handleClose} />
    </React.Fragment>
  );
}
