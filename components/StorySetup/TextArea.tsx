import React from 'react'
import { StyleSheet, TextInput } from 'react-native'

import Text from '@/components/Text'
import Colors from '@/constants/Colors'
import { translations } from '@/constants/Translations'
import useStore from '@/utils/zustand'

export default function TextArea({
  description,
  setDescription,
  characterLimit,
}: {
  description: string
  setDescription: React.Dispatch<React.SetStateAction<string>>
  characterLimit: number
}) {
  const appLang = useStore(state => state.appLang)
  const theme = useStore(state => state.theme)

  return (
    <>
      <Text type="title">{translations[appLang].textDescriptionLabel}</Text>
      <Text type="small">{translations[appLang].textDescriptionInfo}</Text>
      <TextInput
        multiline
        numberOfLines={10}
        placeholder={translations[appLang].textDescriptionPlaceholder}
        placeholderTextColor={Colors[theme].placeholder}
        style={[
          styles.input,
          {
            backgroundColor: Colors[theme].inputBg,
            borderColor:
              description.length > characterLimit
                ? 'tomato'
                : Colors[theme].inputBorder,
            color:
              description.length > characterLimit ? 'red' : Colors[theme].text,
          },
        ]}
        value={description}
        onChangeText={setDescription}
      />
      <Text
        style={{
          color:
            description.length > characterLimit ? 'red' : Colors[theme].text,
          opacity: 0.7,
          marginTop: 10,
          marginBottom: -10,
        }}
      >
        {`${description.length} / ${characterLimit}`}
      </Text>
    </>
  )
}

const styles = StyleSheet.create({
  input: {
    height: 125,
    textAlignVertical: 'top',
    // backgroundColor: '#eee',
    borderWidth: 1,
    width: '90%',
    maxWidth: 500,
    padding: 10,
    borderRadius: 10,
    fontSize: 18,
  },
})
